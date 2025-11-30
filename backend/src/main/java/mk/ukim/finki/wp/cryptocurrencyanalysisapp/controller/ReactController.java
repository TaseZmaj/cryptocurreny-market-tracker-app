package mk.ukim.finki.wp.cryptocurrencyanalysisapp.controller;

import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.CoinDetailsDTO;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.HistoricalData;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.Symbol;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.service.CoinService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173/")
@RequestMapping("/api/coins")
@RestController
public class ReactController {

    private final CoinService coinService;
    public ReactController(CoinService coinService) {
        this.coinService = coinService;
    }

    @GetMapping
    public List<Symbol> getSymbols() {
        return coinService.findAllSymbols();
    }

    @GetMapping("/{coinId}")
    public CoinDetailsDTO getBTCSymbols(@PathVariable String coinId) {
        return coinService.getCoinDetails(coinId);
    }

    @GetMapping("/{coinId}/history")
    public List<HistoricalData> getHistoricalData(@PathVariable String coinId) {
        return coinService.getHistoricalDataForSymbol(coinId);
    }
}
