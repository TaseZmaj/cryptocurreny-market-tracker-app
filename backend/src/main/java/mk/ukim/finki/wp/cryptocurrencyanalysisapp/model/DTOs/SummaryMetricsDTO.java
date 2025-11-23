package mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * DTO to map the necessary 24H summary metrics from the CoinGecko API response.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SummaryMetricsDTO {
    private String id;
    private BigDecimal lastPrice;
    private BigDecimal volume;
    private BigDecimal highPrice;
    private BigDecimal lowPrice;
    private BigDecimal quoteVolume; //ova e liquidity
}