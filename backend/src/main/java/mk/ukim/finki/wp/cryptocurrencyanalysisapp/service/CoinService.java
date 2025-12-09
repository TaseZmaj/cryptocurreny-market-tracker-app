package mk.ukim.finki.wp.cryptocurrencyanalysisapp.service;


import lombok.RequiredArgsConstructor;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.CoinDetailsDTO;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.AssetSummary;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.HistoricalData;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.Symbol;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository.AssetSummaryRepository;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository.HistoricalDataRepository;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository.SymbolRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class CoinService {
    private final AssetSummaryRepository assetSummaryRepository;
    private final HistoricalDataRepository historicalDataRepository;
    private final SymbolRepository symbolRepository;


    public List <Symbol> findAllSymbols(){
        return symbolRepository.findAll();
    }

    public CoinDetailsDTO  getCoinDetails(String coinGeckoId){

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
                summary.getUpdatedAt()
        );

    }

    public List<HistoricalData> getHistoricalDataForSymbol(String coinGeckoId) {
        // HistoricalData користи symbolId за поврзување
        return historicalDataRepository.findBySymbolIdOrderByTimestampDesc(coinGeckoId);
    }
}
