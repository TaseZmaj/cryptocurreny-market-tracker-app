package mk.ukim.finki.wp.cryptocurrencyanalysisapp.service;

import lombok.RequiredArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * Helper client to interact with Binance /api/v3/klines and to try common quote assets.
 */
@Service
public class Filter2 {

    private static final String BINANCE_KLINE_API = "https://api.binance.com/api/v3/klines";
    private static final int MAX_KLINES_PER_CALL = 1000;
    private final RestTemplate restTemplate;

    // Common quote assets to try (order matters: prefer stablecoins)
    private static final String[] COMMON_QUOTE_ASSETS = new String[] {"USDT", "BUSD", "USDC", "BTC", "ETH"};

    public Filter2(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Try to find a working Binance trading pair for given symbol (e.g. "BTC" -> "BTCUSDT").
     * Returns the pair string or null if none found.
     */
    public String findWorkingPair(String baseSymbol) {
        for (String quote : COMMON_QUOTE_ASSETS) {
            String pair = (baseSymbol + quote).toUpperCase();
            String testUrl = String.format("%s?symbol=%s&interval=1d&limit=1", BINANCE_KLINE_API, pair);
            try {
                ResponseEntity<List<List<Object>>> resp = restTemplate.exchange(
                        testUrl,
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<>() {}
                );
                if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                    // pair works
                    return pair;
                }
            } catch (HttpClientErrorException e) {
                // 4xx indicates pair not found or not tradable; continue trying other quotes
            } catch (Exception e) {
                // network or other error: log and continue (caller will decide)
                System.err.println("  -> Binance pair check error for " + pair + ": " + e.getMessage());
            }
        }
        return null;
    }

    /**
     * Fetches klines (daily) between startTime(inclusive ms) and endTime(inclusive ms) paginated with limit MAX_KLINES_PER_CALL.
     * Returns the combined list of klines (each kline is List<Object> as Binance returns).
     */
    public List<List<Object>> fetchKlinesPaginated(String pair, Instant startInclusive, Instant endInclusive) {
        List<List<Object>> all = new ArrayList<>();
        long startMs = startInclusive.toEpochMilli();
        long endMs = endInclusive.toEpochMilli();

        while (true) {
            String url = String.format("%s?symbol=%s&interval=1d&startTime=%d&endTime=%d&limit=%d",
                    BINANCE_KLINE_API, pair, startMs, endMs, MAX_KLINES_PER_CALL);
            try {
                ResponseEntity<List<List<Object>>> resp = restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<>() {}
                );
                List<List<Object>> page = resp.getBody();
                if (page == null || page.isEmpty()) {
                    break;
                }
                all.addAll(page);

                if (page.size() < MAX_KLINES_PER_CALL) {
                    // done
                    break;
                }

                // advance start to last returned kline's open time + 1 ms to avoid overlap
                long lastOpen = Long.parseLong(page.get(page.size() - 1).get(0).toString());
                startMs = lastOpen + 1;

                // be polite with Binance
                Thread.sleep(200);
            } catch (HttpClientErrorException e) {
                System.err.println("  -> Binance returned HTTP error while fetching klines for " + pair + ": " + e.getStatusCode());
                break;
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                break;
            } catch (Exception ex) {
                System.err.println("  -> Unexpected error fetching klines for " + pair + ": " + ex.getMessage());
                break;
            }
        }
        return all;
    }
}
