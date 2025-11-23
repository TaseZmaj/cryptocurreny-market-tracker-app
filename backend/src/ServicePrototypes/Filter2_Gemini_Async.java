package mk.ukim.finki.wp.cryptocurrencyanalysisapp.service;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.HistoricalUpdateInfoDTO;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.HistoricalData;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.Symbol;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository.HistoricalDataRepository;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;
import java.util.stream.Collectors;


/**
 * Filter 2: Checks the latest available historical data date for each symbol in the local database.
 * If data is missing (first run), it performs a full 10-year historical OHLCV data fetch from Binance.
 * This filter prepares the input for Filter 3 (Incremental update and Summary fetch).
 */
@Service
@RequiredArgsConstructor
public class Filter2 {

    private final HistoricalDataRepository historicalDataRepository;
    private final RestTemplate restTemplate;

    // Binance api for OHLCV data
    private static final String BINANCE_KLINE_API = "https://api.binance.com/api/v3/klines";
    private static final String DEFAULT_INTERVAL = "1d"; // Дневни податоци
    private static final int MAX_KLINES_PER_CALL = 1000;
    private static final String DEFAULT_QUOTE_ASSET = "USDT"; // Претпоставка за quote asset

    //Executor for parallel DB operations AND API calls
    private final Executor executor = Executors.newFixedThreadPool(20);

    /**
     * Главна run метода за Филтер 2.
     * Проверува до кој датум има податоци. Ако нема, прави целосно преземање на OHLCV.
     * @param symbols Листа на активни Symbol објекти од Filter 1.
     * @return Листа на HistoricalUpdateInfo со последниот датум на ажурирање.
     */
    public List<HistoricalUpdateInfoDTO> run(List<Symbol> symbols) {
        System.out.println("--- Filter 2: Starting parallel historical data date check and full load (if needed) for " + symbols.size() + " symbols. ---");

        List<CompletableFuture<HistoricalUpdateInfoDTO>> futures = symbols.stream()
                .map(this::checkLastUpdateDateAndLoadIfMissing) // Создава CompletableFuture за секој симбол
                .collect(Collectors.toList());

        // Чекај додека сите фјучери не завршат и собирај ги резултатите
        return futures.stream()
                .map(CompletableFuture::join)
                .collect(Collectors.toList());
    }

    /**
     * Асинхрона функција: Проверка на DB и целосно преземање ако податоците недостасуваат.
     */
    private CompletableFuture<HistoricalUpdateInfoDTO> checkLastUpdateDateAndLoadIfMissing(Symbol symbol) {
        return CompletableFuture.supplyAsync(() -> {

                    HistoricalData latestData = historicalDataRepository
                            .findTopBySymbolIdOrderByTimestampDesc(symbol.getId())
                            .orElse(null);

                    Instant lastDate = null;
                    if (latestData != null) {
                        // Податоци постојат: Врати го следниот датум за инкрементално ажурирање од Filter 3
                        lastDate = latestData.getTimestamp().plus(1, ChronoUnit.DAYS);
                    } else {
                        // Податоци НЕ постојат: Изврши целосно преземање на OHLCV
                        System.out.println("  -> Filter 2: No historical data found for " + symbol.getSymbol() + ". Initiating FULL 10-year load.");
                        fetchAndSaveFullOhlcvData(symbol.getId(), symbol.getSymbol() + DEFAULT_QUOTE_ASSET);
                    }

                    // Врати го DTO-то за Филтер 3. Ако lastDate е null, Filter 3 ќе знае дека
                    // целосното преземање е завршено од Filter 2 и не треба да прави инкрементално ажурирање.
                    return new HistoricalUpdateInfoDTO(
                            symbol.getId(),
                            symbol.getSymbol(),
                            lastDate
                    );
                }, executor)
                .exceptionally(ex -> {
                    System.err.println("  -> ERROR in Filter 2 for " + symbol.getSymbol() + ": " + ex.getMessage());
                    return new HistoricalUpdateInfoDTO(symbol.getId(), symbol.getSymbol(), null);
                });
    }

    /**
     * Преземање на целосната историја на OHLCV (10 години) од Binance и зачувување во DB.
     */
    private void fetchAndSaveFullOhlcvData(String coinId, String binanceSymbol) {
        // Почни од пред 10 години (Full Load)
        long startTimeMs = Instant.now().minus(10, ChronoUnit.YEARS).toEpochMilli();

        String apiUrl = String.format(
                "%s?symbol=%s&interval=%s&startTime=%d&limit=%d",
                BINANCE_KLINE_API,
                binanceSymbol,
                DEFAULT_INTERVAL,
                startTimeMs,
                MAX_KLINES_PER_CALL
        );

        try {
            // API повик
            ResponseEntity<List<List<Object>>> response = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<List<List<Object>>>() {}
            );

            List<List<Object>> klines = response.getBody();
            if (klines == null || klines.isEmpty()) {
                System.out.println("  -> FULL LOAD: No data found on Binance for " + binanceSymbol + ".");
                return;
            }

            // Трансформација и зачувување
            List<HistoricalData> dataToSave = transformKlinesToHistoricalData(coinId, klines);
            historicalDataRepository.saveAll(dataToSave);

            System.out.println("  -> FULL LOAD: Successfully saved " + dataToSave.size() + " FULL OHLCV points for " + binanceSymbol);

        } catch (Exception e) {
            System.err.println("  -> FULL LOAD ERROR for " + binanceSymbol + ": " + e.getMessage());
        }
    }

    /**
     * Трансформирање на Binance Klines формат во HistoricalData објекти (Истиот метод како во Filter 3).
     */
    private List<HistoricalData> transformKlinesToHistoricalData(String coinId, List<List<Object>> klines) {
        List<HistoricalData> dataPoints = new ArrayList<>(klines.size());

        for (List<Object> kline : klines) {
            // Структурата на Binance klines е фиксна:
            // [0: Open time, 1: Open, 2: High, 3: Low, 4: Close, 5: Volume, ...]

            Instant timestamp = Instant.ofEpochMilli(Long.parseLong(kline.get(0).toString()));

            // Конвертирај ги сите вредности во BigDecimal
            BigDecimal open = new BigDecimal(kline.get(1).toString());
            BigDecimal high = new BigDecimal(kline.get(2).toString());
            BigDecimal low = new BigDecimal(kline.get(3).toString());
            BigDecimal close = new BigDecimal(kline.get(4).toString());
            // Volume
            BigDecimal volume = new BigDecimal(kline.get(5).toString());

            dataPoints.add(new HistoricalData(
                    coinId,
                    timestamp,
                    open,
                    high,
                    low,
                    close,
                    volume
            ));
        }
        return dataPoints;
    }
}