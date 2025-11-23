package mk.ukim.finki.wp.cryptocurrencyanalysisapp.service;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.HistoricalUpdateInfoDTO;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.HistoricalData;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository.HistoricalDataRepository;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.utils.ApiFetchingUtils;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.Semaphore;

import static mk.ukim.finki.wp.cryptocurrencyanalysisapp.utils.TransformationUtils.transformKlinesToHistoricalData;

@Service
@RequiredArgsConstructor
public class Filter3 {

    private final HistoricalDataRepository historicalDataRepository;
    private final RestTemplate restTemplate;
    private final ApiFetchingUtils apiFetchingUtils;

    // Semaphore to limit concurrent API calls
    private static final int MAX_CONCURRENT_REQUESTS = 20;
    private final Semaphore semaphore = new Semaphore(MAX_CONCURRENT_REQUESTS);

    private static final String BINANCE_KLINE_API = "https://api.binance.com/api/v3/klines";
    private static final String DEFAULT_INTERVAL = "1d";
    private static final int MAX_KLINES_PER_CALL = 1000;
    private static final String DEFAULT_QUOTE_ASSET = "USDT";

    @Qualifier("filterExecutor")
    private final Executor executor;

    public void run(List<HistoricalUpdateInfoDTO> symbolsWithLastDate) {

        List<CompletableFuture<Void>> futures = symbolsWithLastDate.stream()
                .filter(dto -> dto.getLastUpdatedDate() != null) // Only incremental updates
                .map(dto -> CompletableFuture.runAsync(
                        () -> fetchMissingData(dto), executor))
                .toList();

        // Wait for all updates to finish
        futures.forEach(CompletableFuture::join);
    }

    private void fetchMissingData(HistoricalUpdateInfoDTO dto) {
        try {
            semaphore.acquire();  // respect Binance API limits
            try {
                Instant lastTimestamp = dto.getLastUpdatedDate();
                long start = lastTimestamp.toEpochMilli() + 1;
                long now = Instant.now().toEpochMilli();

                if (start >= now) {
                    System.out.println("Filter 3: No new data to fetch for " + dto.getTickerSymbol());
                    return; // nothing to do
                }

                int batchCount = 0;
                while (start < now) {
                    String binanceSymbol = dto.getTickerSymbol() + DEFAULT_QUOTE_ASSET;
                    String url = String.format("%s?symbol=%s&interval=%s&startTime=%d&limit=%d",
                            BINANCE_KLINE_API,
                            binanceSymbol,
                            DEFAULT_INTERVAL,
                            start,
                            MAX_KLINES_PER_CALL);

                    List<List<Object>> klines = apiFetchingUtils.callBinanceWithRetry(url);
                    if (klines == null || klines.isEmpty()) break;

                    List<HistoricalData> batch = transformKlinesToHistoricalData(dto.getCoinId(), klines);
                    historicalDataRepository.saveAll(batch);
                    batchCount++;

                    long lastOpenTime = Long.parseLong(klines.get(klines.size() - 1).get(0).toString());
                    start = lastOpenTime + 1; // move to next candle
                }

                if(batchCount!=0){
                    System.out.println("Filter 3: Incremental update complete for " + dto.getTickerSymbol() + ". Batches: " + batchCount);
                }


            } finally {
                semaphore.release();
            }
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(e);
        }
    }
}