package mk.ukim.finki.wp.cryptocurrencyanalysisapp.service;


import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.MicroservicesDTOs.LstmPredictionResponseDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

// PredictionService.java
@Service

public class LstmPredictionService {

    // URL на вашиот FastAPI микросервис
    private static final String FASTAPI_BASE_URL = "http://lstm-predictor:8000/api/v1/predict/";

    private final WebClient webClient;

    // Инјектирање на WebClient преку конструктор
    public LstmPredictionService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.baseUrl(FASTAPI_BASE_URL).build();
    }

    /**
     * Го повикува Python FastAPI сервисот за да добие предвидување.
     *
     * @param symbolId ID на криптовалутата (на пр. "bitcoin")
     * @return Објект со предвидена и последна цена
     */
    public LstmPredictionResponseDto getPrediction(String symbolId) {

        System.out.println("Spring Boot: Повикувам FastAPI за симбол: " + symbolId);

        try {
            // 1. Конструирање на барањето: GET /api/v1/predict/{symbolId}
            LstmPredictionResponseDto response = webClient.get()
                    .uri(symbolId) // Ја користиме остатокот од URL патеката
                    .retrieve()

                    // 2. Ракување со одговорот (StatusCode)
                    .onStatus(status -> status.is4xxClientError() || status.is5xxServerError(), clientResponse -> {
                        // Ако FastAPI врати 404/500 (на пр. нема податоци или модел)
                        throw new RuntimeException("Грешка при повикот на LSTM сервисот. Статус: " + clientResponse.statusCode());
                    })

                    // 3. Извлекување на телото и мапирање во Java објект
                    .bodyToMono(LstmPredictionResponseDto.class)

                    // 4. Блокирање (WebClient е асинхрон, но тука чекаме синхроно)
                    .block();

            return response;

        } catch (Exception e) {
            // Логирање на грешката
            System.err.println("Настана грешка: " + e.getMessage());
            // Може да вратите default одговор или да фрлите RuntimeException
            return null;
        }
    }
}
