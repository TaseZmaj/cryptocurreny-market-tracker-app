package mk.ukim.finki.wp.cryptocurrencyanalysisapp.service.providers;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Component
public class DefiLlamaClient {

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public Double getChainTvl(String chainName) {

        String url = "https://api.llama.fi/v2/chains";

        List<Map<String, Object>> response =
                restTemplate.getForObject(url, List.class);

        if (response == null) return null;

        return response.stream()
                .filter(c -> chainName.equalsIgnoreCase((String) c.get("name")))
                .map(c -> ((Number) c.get("tvl")).doubleValue())
                .findFirst()
                .orElse(null);
    }
}
