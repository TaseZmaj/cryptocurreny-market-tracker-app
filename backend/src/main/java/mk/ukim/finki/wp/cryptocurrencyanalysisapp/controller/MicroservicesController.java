package mk.ukim.finki.wp.cryptocurrencyanalysisapp.controller;

import lombok.AllArgsConstructor;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.MicroservicesDTOs.AnalyzeResponseDto;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.MicroservicesDTOs.LstmPredictionResponseDto;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.service.LstmPredictionService;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.service.TechnicalAnalysisService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/microservices")
@AllArgsConstructor
public class MicroservicesController {
    private final TechnicalAnalysisService technicalAnalysisService;
    private final LstmPredictionService lstmPredictionService;

    // Technical Analysis microservice
    @GetMapping("/{coinId}/technical-analysis")
    public AnalyzeResponseDto getTechnicalAnalysis(@PathVariable String coinId) {
        return technicalAnalysisService.analyzeSymbol(coinId);
    }

    // Lstm Prediction microservice
    @GetMapping("{coinId}/lstm-prediction")
    public ResponseEntity<?> getPricePrediction(@PathVariable String coinId) {
        LstmPredictionResponseDto result = lstmPredictionService.getPrediction(coinId);

        if (result == null) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Не може да се добие предвидување за LSTM моделот.");
        }

        return ResponseEntity.ok(result);
    }
}
