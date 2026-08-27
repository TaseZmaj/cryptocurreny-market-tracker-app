package mk.ukim.finki.wp.cryptocurrencyanalysisapp.service;


import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.MicroservicesDTOs.LstmPredictionResponseDto;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

// PredictionService.java
@Service

public class LstmPredictionService {

    // URL на вашиот FastAPI микросервис
   private static final String LSTM_PREDICTOR_MICROSERVICE_URL = "http://lstm-predictor:8081/api/v1/predict/";

    // For local testing of the microservice without containerization use this url instead:
//    private static final String LSTM_PREDICTOR_MICROSERVICE_URL = "http://localhost:8081/api/v1/predict/";

    private final WebClient webClient;

    // Инјектирање на WebClient преку конструктор
    public LstmPredictionService(
            WebClient.Builder webClientBuilder
    ) {
        this.webClient = webClientBuilder.baseUrl(LSTM_PREDICTOR_MICROSERVICE_URL).build();
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
                        return clientResponse.bodyToMono(String.class)
                            .flatMap(body -> Mono.error(new RuntimeException(
                                "LSTM сервисот врати " + clientResponse.statusCode() + ": " + body
                            )));
                    })

                    // 3. Извлекување на телото и мапирање во Java објект
                    .bodyToMono(LstmPredictionResponseDto.class)

                    // 4. Блокирање (WebClient е асинхрон, но тука чекаме синхроно)
                    .block();

            return response;

        } catch (Exception e) {
            // Логирање на грешката
            System.err.println("Настана грешка: " + e.getMessage());
            e.printStackTrace();
            // Може да вратите default одговор или да фрлите RuntimeException
            return null;
        }
    }
}
