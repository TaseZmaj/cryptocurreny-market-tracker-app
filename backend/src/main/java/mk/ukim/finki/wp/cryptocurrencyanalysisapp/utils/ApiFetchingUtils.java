package mk.ukim.finki.wp.cryptocurrencyanalysisapp.utils;

import lombok.AllArgsConstructor;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Component
@AllArgsConstructor
public class ApiFetchingUtils {

    private final RestTemplate restTemplate;

    /**
     * Fetches from Binance with a max of 5 retries
     */
    public List<List<Object>> callBinanceWithRetry(String url) {
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
                    System.err.println("    -> ERROR: Stopped Requests due to invalid symbol" + "\n");
                    return null; // fail gracefully
                }
                System.err.println("    -> ERROR: Binance API error (attempt " + attempt + "): " + ex.getMessage() + "\n");

                if (attempt == maxRetries) {
                    System.err.println("      -> Giving up after " + maxRetries + " attempts.");
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
}
