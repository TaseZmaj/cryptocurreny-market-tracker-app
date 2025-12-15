package mk.ukim.finki.wp.cryptocurrencyanalysisapp.controller;


import lombok.Data;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.MicroservicesDTOs.LstmPredictionResponseDto;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.service.LstmPredictionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/crypto")
@Data
public class LstmPredictionController {
    private final LstmPredictionService lstmPredictionService;

    @GetMapping("/prediction/{symbolId}")
    public ResponseEntity<?> getPricePrediction(@PathVariable String symbolId) {
        LstmPredictionResponseDto result = lstmPredictionService.getPrediction(symbolId);

        if (result == null) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("Не може да се добие предвидување за LSTM моделот.");
        }

        return ResponseEntity.ok(result);
    }
}