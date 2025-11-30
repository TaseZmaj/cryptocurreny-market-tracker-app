package mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CoinDetailsDTO {
    // --- Податоци од Symbol.java ---
    private String coinId;          // CoinGecko ID (id полето во Symbol.java)
    private String symbol;          // Ticker (пр. "BTC")
    private String name;
    private Integer marketCapRank;
    private String quoteAsset;
    private Boolean active;

    // --- Податоци од AssetSummary.java (24H податоци) ---
    private BigDecimal lastPrice;
    private BigDecimal volume24h;
    private BigDecimal high24h;
    private BigDecimal low24h;
    private BigDecimal liquidity24h;
    private Instant summaryUpdatedAt; // Преименувано за да се избегне конфликт со Symbol
}
