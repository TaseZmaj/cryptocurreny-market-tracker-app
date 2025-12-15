package mk.ukim.finki.wp.cryptocurrencyanalysisapp.controller;


import lombok.Data;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.MicroservicesDTOs.LstmPredictionResponseDto;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.service.LstmPredictionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/crypto")
@Data
public class LstmPredictionController {
    private final LstmPredictionService lstmPredictionService;

    @GetMapping ("/prediction/{symoblId}")
    public ResponseEntity<?> getPricePrediction(@PathVariable String symoblId) {
        LstmPredictionResponseDto result = lstmPredictionService.getPrediction(symoblId);

        if (result == null) {
            ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body("Не може да се " +
                    "добие предвидување за LSTM моделот.");
        }

        return ResponseEntity.ok(result);
    }
}
