package mk.ukim.finki.wp.cryptocurrencyanalysisapp.service;


import lombok.RequiredArgsConstructor;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.FrontendDTOs.CoinDetailsDTO;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.AssetSummary;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.HistoricalData;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.Symbol;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository.AssetSummaryRepository;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository.HistoricalDataRepository;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository.SymbolRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class CoinService {
    private final AssetSummaryRepository assetSummaryRepository;
    private final HistoricalDataRepository historicalDataRepository;
    private final SymbolRepository symbolRepository;

    public List <CoinDetailsDTO> getCoinsDetails(){
        List<Symbol> symbols = symbolRepository.findAll();
        List<String> symbolIds = symbols.stream().map(Symbol::getId).toList();

        List<AssetSummary> assetSummaries = assetSummaryRepository.findAllById(symbolIds);

        //Makes a map like this <bitcoin, assetSummary for bitcoin>,
        Map<String, AssetSummary> summaryMap = assetSummaries.stream()
                .collect(Collectors.toMap(AssetSummary::getCoinId, Function.identity()));

        List<CoinDetailsDTO> result = new ArrayList<>();
        for (Symbol symbol : symbols){
            AssetSummary coinSummary = summaryMap.get(symbol.getId());

            if(coinSummary == null) continue;

            result.add(new CoinDetailsDTO(
                    symbol.getId(),
                    symbol.getSymbol(),
                    symbol.getName(),
                    symbol.getMarketCapRank().intValue(), // Конвертирање во int/Integer
                    symbol.getQuoteAsset(),
                    symbol.getActive(),

                    coinSummary.getLastPrice(),
                    coinSummary.getVolume24h(),
                    coinSummary.getHigh24h(),
                    coinSummary.getLow24h(),
                    coinSummary.getLiquidity24h(),
                    coinSummary.getUpdatedAt(),

                    symbol.getCoinIconUrl()
            ));
        }

        return result;
    }

    public CoinDetailsDTO getCoinDetails(String coinGeckoId){

        // --- ЧЕКОР 1: Најди Symbol (Користи го CoinGecko ID) ---
        // Потребно е да го промениш SymbolRepository за да најдеш по ID, или да го мапираш
        // URL параметарот (BTC) на CoinGecko ID
            Symbol symbol = symbolRepository.findById(coinGeckoId) // Наоѓање по ID (пр. "bitcoin")
                    .orElseThrow(() -> new RuntimeException("Coin not found: " + coinGeckoId));

        // --- ЧЕКОР 2: Најди AssetSummary ---
        // AssetSummary користи CoinGecko ID како свое ID.
        AssetSummary summary = assetSummaryRepository.findById(coinGeckoId)
                .orElseGet(AssetSummary::new); // Врати празен/default објект ако не постои


        // --- ЧЕКОР 3: Мапирање и Комбинирање ---
        return new CoinDetailsDTO(
                symbol.getId(),
                symbol.getSymbol(),
                symbol.getName(),
                symbol.getMarketCapRank().intValue(), // Конвертирање во int/Integer
                symbol.getQuoteAsset(),
                symbol.getActive(),

                summary.getLastPrice(),
                summary.getVolume24h(),
                summary.getHigh24h(),
                summary.getLow24h(),
                summary.getLiquidity24h(),
                summary.getUpdatedAt(),

                symbol.getCoinIconUrl()
        );

    }

    public List<HistoricalData> getHistoricalDataForSymbol(String coinGeckoId) {
        // HistoricalData користи symbolId за поврзување
        return historicalDataRepository.findBySymbolIdOrderByTimestampDesc(coinGeckoId);
    }
}
