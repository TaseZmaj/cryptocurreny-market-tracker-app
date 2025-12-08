package mk.ukim.finki.wp.cryptocurrencyanalysisapp.controller;

import mk.ukim.finki.wp.cryptocurrencyanalysisapp.dto.AnalyzeResponseDto;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.CoinDetailsDTO;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.HistoricalData;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.Symbol;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.service.CoinService;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.service.TechnicalAnalysisService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173/")
@RequestMapping("/api/coins")
@RestController
public class ReactController {

    private final CoinService coinService;
    private final TechnicalAnalysisService technicalAnalysisService;

    public ReactController(CoinService coinService,
                           TechnicalAnalysisService technicalAnalysisService) {
        this.coinService = coinService;
        this.technicalAnalysisService = technicalAnalysisService;
    }

    @GetMapping
    public List<Symbol> getSymbols() {
        return coinService.findAllSymbols();
    }

    @GetMapping("/{coinId}")
    public CoinDetailsDTO getCoinDetails(@PathVariable String coinId) {
        return coinService.getCoinDetails(coinId);
    }

    @GetMapping("/{coinId}/history")
    public List<HistoricalData> getHistoricalData(@PathVariable String coinId) {
        return coinService.getHistoricalDataForSymbol(coinId);
    }

    // ⭐ Нов endpoint — техничка анализа преку Python сервис
    @GetMapping("/{coinId}/technical-analysis")
    public AnalyzeResponseDto getTechnicalAnalysis(@PathVariable String coinId) {
        return technicalAnalysisService.analyzeSymbol(coinId);
    }
}
