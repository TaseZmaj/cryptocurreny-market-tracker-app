package mk.ukim.finki.wp.cryptocurrencyanalysisapp.utils;

import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.RawSymbolDTO;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.SummaryMetricsDTO;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.HistoricalData;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.AssetSummary;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.Symbol;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class TransformationUtils {
    /**
     * Converts Binance 24h data to AssetSymmary entities (Binance API data TO mongoDB data - Filter 2 and 3)
     */
    public static AssetSummary transformAssetSummary(String coinId, SummaryMetricsDTO symbolData24h) {
        Instant updatedAt = Instant.now();

        return new AssetSummary(
                coinId,
                symbolData24h.getLastPrice(),
                symbolData24h.getVolume(),
                symbolData24h.getHighPrice(),
                symbolData24h.getLowPrice(),
                symbolData24h.getQuoteVolume(), //liquidity
                updatedAt
        );
    }

    /**
     * Converts Binance klines to HistoricalData entities (Binance API data TO mongoDB data - Filter 2 and 3)
     */
    public static List<HistoricalData> transformKlinesToHistoricalData(String coinId, List<List<Object>> klines) {
        List<HistoricalData> dataPoints = new ArrayList<>(klines.size());

        for (List<Object> kline : klines) {
            Instant timestamp = Instant.ofEpochMilli(Long.parseLong(kline.get(0).toString()));

            BigDecimal open = new BigDecimal(kline.get(1).toString());
            BigDecimal high = new BigDecimal(kline.get(2).toString());
            BigDecimal low = new BigDecimal(kline.get(3).toString());
            BigDecimal close = new BigDecimal(kline.get(4).toString());
            BigDecimal totalVolume = new BigDecimal(kline.get(5).toString());

            dataPoints.add(new HistoricalData(
                    coinId,
                    timestamp,
                    open,
                    high,
                    low,
                    close,
                    totalVolume
            ));
        }
        return dataPoints;
    }

    /**
     * Converts Coingecko API entity to Symbol entities (Binance API data TO mongoDB data - Filter 2 and 3)
     */
    public static Symbol transformToSymbol(RawSymbolDTO raw) {
        Symbol symbol = new Symbol();
        symbol.setId(raw.getCoinId());
        symbol.setSymbol(raw.getSymbol().toUpperCase());
        symbol.setName(raw.getName());
        symbol.setActive(true);
        if (raw.getRank() != null) {
            symbol.setMarketCapRank(new BigDecimal(raw.getRank()));
        }
        symbol.setQuoteAsset("USD");

        return symbol;
    }
}
