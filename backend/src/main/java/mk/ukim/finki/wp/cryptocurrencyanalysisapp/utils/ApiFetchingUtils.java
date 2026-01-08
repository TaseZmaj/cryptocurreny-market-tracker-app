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
        long backoff = 2000; // Почни со 2 секунди наместо 500ms

        while (attempt <= maxRetries) {
            try {
                ResponseEntity<List<List<Object>>> response = restTemplate.exchange(
                        url, HttpMethod.GET, null, new ParameterizedTypeReference<>() {}
                );
                return response.getBody();

            } catch (Exception ex) {
                // КЛУЧНА ИЗМЕНА: Ако симболот не постои, не ни пробувај пак!
                if (ex.getMessage() != null && ex.getMessage().contains("400")) {
                    System.err.println("    -> Invalid Symbol (400) for URL: " + url + ". Skipping immediately.");
                    return null;
                }

                // Ако е грешка за премногу барања (429), зголеми го чекањето драстично
                if (ex.getMessage() != null && ex.getMessage().contains("429")) {
                    System.err.println("    -> Rate Limited (429). Waiting longer...");
                    backoff = 30000; // Чекај 30 секунди ако те блокираат
                }

                System.err.println("    -> Binance API error (attempt " + attempt + "): " + ex.getMessage());

                if (attempt == maxRetries) return null;

                try {
                    Thread.sleep(backoff);
                } catch (InterruptedException ignored) {}

                backoff *= 2;
                attempt++;
            }
        }
        return null;
    }
}
