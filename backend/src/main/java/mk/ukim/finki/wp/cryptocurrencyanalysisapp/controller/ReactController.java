package mk.ukim.finki.wp.cryptocurrencyanalysisapp.controller;

import lombok.AllArgsConstructor;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.FrontendDTOs.CoinDetailsDTO;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.HistoricalData;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.service.CoinService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/coins")
@AllArgsConstructor
public class ReactController {
    private final CoinService coinService;

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
}
