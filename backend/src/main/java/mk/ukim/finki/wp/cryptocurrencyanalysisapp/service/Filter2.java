package mk.ukim.finki.wp.cryptocurrencyanalysisapp.service;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.HistoricalUpdateInfoDTO;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.SummaryMetricsDTO;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.HistoricalData;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.AssetSummary;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.Symbol;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository.AssetSummaryRepository;
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

@Service
@RequiredArgsConstructor
public class Filter2 {

    private final AssetSummaryRepository assetSummaryRepository;
    private final HistoricalDataRepository historicalDataRepository;
    private final RestTemplate restTemplate;

    private static final String BINANCE_TICKER_API = "https://api.binance.com/api/v3/ticker/24hr?";
    private static final String BINANCE_KLINE_API = "https://api.binance.com/api/v3/klines";
    private static final String DEFAULT_INTERVAL = "1d";
    private static final int MAX_KLINES_PER_CALL = 1000;
    private static final String DEFAULT_QUOTE_ASSET = "USDT";

    public List<HistoricalUpdateInfoDTO> run(List<Symbol> symbols) {
        System.out.println("\n--- Filter 2: Starting historical data check for " + symbols.size() + " symbols. ---");

        List<HistoricalUpdateInfoDTO> results = new ArrayList<>();

        for (Symbol symbol : symbols) {
            results.add(checkLastUpdateDateAndLoadIfMissing(symbol));
        }

        return results;
    }

    /**
     * Check the DB and perform full load if needed.
     */
    private HistoricalUpdateInfoDTO checkLastUpdateDateAndLoadIfMissing(Symbol symbol) {
        try {
            HistoricalData latestData = historicalDataRepository
                    .findTopBySymbolIdOrderByTimestampDesc(symbol.getId())
                    .orElse(null);

            Instant lastDate;

            if (latestData != null) {
                // We already have data → Filter 3 will continue incrementally
                lastDate = latestData.getTimestamp().plus(1, ChronoUnit.DAYS);
            } else {
                // No data → run full 10-year load
                System.out.println("  -> Filter 2: No historical data for " + symbol.getSymbol() + " in the Database. Initiating FULL 10-year load.");
                fetchAdditionalSymbolData(symbol.getId(), symbol.getSymbol());
                fetchAndSaveFullOhlcvData(symbol.getId(), symbol.getSymbol() + DEFAULT_QUOTE_ASSET);
                lastDate = null; // Filter 3 will know not to increment
            }

            return new HistoricalUpdateInfoDTO(
                    symbol.getId(),
                    symbol.getSymbol(),
                    lastDate
            );

        } catch (Exception ex) {
            System.err.println("  -> ERROR in Filter 2 for " + symbol.getSymbol() + ": " + ex.getMessage() + "\n");
            return new HistoricalUpdateInfoDTO(symbol.getId(), symbol.getSymbol(), null);
        }
    }

    /**
     * Fetches data about the coin for the last 24H
     */
    private void fetchAdditionalSymbolData(String coinId, String binanceSymbol){
        System.out.println("    -> 24H DATA: Getting data for the last 24h for " + binanceSymbol);

        String url = BINANCE_TICKER_API + "symbol=" + binanceSymbol + DEFAULT_QUOTE_ASSET;

        ResponseEntity<SummaryMetricsDTO> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {}
        );

        SummaryMetricsDTO symbolData24h = response.getBody();
        AssetSummary assetSummary = transformAssetSummary(coinId, symbolData24h);

        assetSummaryRepository.save(assetSummary);
        System.out.println("    -> 24H DATA: LOADED SUCCESSFULLY");
    }

    /**
     * Full 10-year OHLCV fetch from Binance.
     */
    private void fetchAndSaveFullOhlcvData(String coinId, String binanceSymbol) {

        System.out.println("    -> FULL LOAD: Starting 10-year OHLCV fetch for " + binanceSymbol);

        final long now = Instant.now().toEpochMilli();

        // 10 years back using ZonedDateTime (Instant does not allow years)
        long start = Instant.now()
                .atZone(java.time.ZoneOffset.UTC)
                .minusYears(10)
                .toInstant()
                .toEpochMilli();

        List<HistoricalData> allData = new ArrayList<>();
        int totalSaved = 0;
        int batchCount = 0;

        while (true) {

            String url = String.format(
                    "%s?symbol=%s&interval=%s&startTime=%d&limit=%d",
                    BINANCE_KLINE_API,
                    binanceSymbol,
                    DEFAULT_INTERVAL,
                    start,
                    MAX_KLINES_PER_CALL
            );

            List<List<Object>> klines = callBinanceWithRetry(url);
            if (klines == null || klines.isEmpty()) {
                System.out.println("      -> FULL LOAD: No more klines for " + binanceSymbol + ". Done.");
                break;
            }

            // Convert klines to HistoricalData
            List<HistoricalData> batch = transformKlinesToHistoricalData(coinId, klines);

            // Save this batch to DB
            historicalDataRepository.saveAll(batch);
            batchCount++;
            totalSaved += batch.size();

            // Logging
            System.out.println("      Saved batch #" + batchCount + " (" + batch.size() + " entries) for " + binanceSymbol);

            // Move cursor to next candle after last returned openTime
            long lastOpenTime = Long.parseLong(klines.get(klines.size() - 1).get(0).toString());
            long nextStart = lastOpenTime + 1;

            if (nextStart >= now) {
                System.out.println("  -> FULL LOAD: Reached present time for " + binanceSymbol);
                break;
            }

            start = nextStart; // continue pagination
        }

        System.out.println("  -> FULL LOAD COMPLETE for " + binanceSymbol +
                ". Total OHLCV points saved: " + totalSaved + "\n");
    }

    /**
     * Converts Binance klines to HistoricalData entities.
     */
    private List<HistoricalData> transformKlinesToHistoricalData(String coinId, List<List<Object>> klines) {
        List<HistoricalData> dataPoints = new ArrayList<>(klines.size());

        for (List<Object> kline : klines) {
            Instant timestamp = Instant.ofEpochMilli(Long.parseLong(kline.get(0).toString()));

            BigDecimal open = new BigDecimal(kline.get(1).toString());
            BigDecimal high = new BigDecimal(kline.get(2).toString());
            BigDecimal low = new BigDecimal(kline.get(3).toString());
            BigDecimal close = new BigDecimal(kline.get(4).toString());
            BigDecimal totalVolume = new BigDecimal(kline.get(5).toString());

            dataPoints.add(new HistoricalData(
                    coinId,
                    timestamp,
                    open,
                    high,
                    low,
                    close,
                    totalVolume
            ));
        }
        return dataPoints;
    }

    private List<List<Object>> callBinanceWithRetry(String url) {
        int maxRetries = 5;
        int attempt = 1;
        long backoff = 500; // ms

        while (attempt <= maxRetries) {
            try {
                ResponseEntity<List<List<Object>>> response = restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<>() {}
                );
                return response.getBody();

            } catch (Exception ex) {
                if(ex.getMessage().contains("400 Bad Request")){
                    System.err.println(    "Stopped Requests due to invalid symbol" + "\n");
                    return null; // fail gracefully
                }
                System.err.println("    Binance API error (attempt " + attempt + "): " + ex.getMessage() + "\n");

                if (attempt == maxRetries) {
                    System.err.println("    --> Giving up after " + maxRetries + " attempts.");
                    return null; // fail gracefully
                }

                try {
                    Thread.sleep(backoff);
                } catch (InterruptedException ignored) {}

                backoff *= 2; // exponential backoff
                attempt++;
            }
        }

        return null;
    }

    /**
     * Transforms a SummaryMetricsDTO into a AssetSummary for MongoDB
     */
    private AssetSummary transformAssetSummary(String coinId, SummaryMetricsDTO symbolData24h) {
        Instant updatedAt = Instant.now();

        return new AssetSummary(
                coinId,
                symbolData24h.getLastPrice(),
                symbolData24h.getVolume(),
                symbolData24h.getHighPrice(),
                symbolData24h.getLowPrice(),
                symbolData24h.getQuoteVolume(), //liquidity
                updatedAt
        );
    }
}
