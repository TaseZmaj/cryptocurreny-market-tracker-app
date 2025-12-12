package mk.ukim.finki.wp.cryptocurrencyanalysisapp.controller;

import lombok.AllArgsConstructor;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.MicroservicesDTOs.AnalyzeResponseDto;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.FrontendDTOs.CoinDetailsDTO;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.HistoricalData;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.Symbol;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.service.CoinService;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.service.TechnicalAnalysisService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173/")
@RequestMapping("/api/coins")
@RestController
@AllArgsConstructor
public class ReactController {

    private final CoinService coinService;
    private final TechnicalAnalysisService technicalAnalysisService;

    @GetMapping
    public List<CoinDetailsDTO> getSymbols() {
        return coinService.getCoinsDetails();
    }

    @GetMapping("/{coinId}")
    public CoinDetailsDTO getCoinDetails(@PathVariable String coinId) {
        return coinService.getCoinDetails(coinId);
    }

    @GetMapping("/{coinId}/history")
    public List<HistoricalData> getHistoricalData(@PathVariable String coinId) {
        return coinService.getHistoricalDataForSymbol(coinId);
    }

    // Technical Analysis via Python microservice "technical-analysis-service"
    @GetMapping("/{coinId}/technical-analysis")
    public AnalyzeResponseDto getTechnicalAnalysis(@PathVariable String coinId) {
        return technicalAnalysisService.analyzeSymbol(coinId);
    }
}
