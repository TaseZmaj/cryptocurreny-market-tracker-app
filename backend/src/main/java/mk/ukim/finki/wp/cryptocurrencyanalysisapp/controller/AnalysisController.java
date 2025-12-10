package mk.ukim.finki.wp.cryptocurrencyanalysisapp.controller;

import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.OnChainSentimentDTOs.OnChainSentimentAnalysisDto;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.service.OnChainSentimentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analysis")
@CrossOrigin(origins = "*")
public class AnalysisController {

    private final OnChainSentimentService onChainSentimentService;

    public AnalysisController(OnChainSentimentService onChainSentimentService) {
        this.onChainSentimentService = onChainSentimentService;
    }

    // DTO за барањето
    public static class OnChainSentimentRequest {
        public String symbol;
        public String text;
    }

    @PostMapping("/onchain-sentiment")
    public ResponseEntity<OnChainSentimentAnalysisDto> analyze(@RequestBody OnChainSentimentRequest request) {
        OnChainSentimentAnalysisDto result =
                onChainSentimentService.analyze(request.symbol, request.text);
        return ResponseEntity.ok(result);
    }
}
