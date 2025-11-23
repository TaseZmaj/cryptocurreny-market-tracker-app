package mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs;

import lombok.Data;
import lombok.AllArgsConstructor;
import java.time.Instant;

/**
 * DTO for transferring data between Filter 2 and Filter 3
 */
@Data
@AllArgsConstructor
public class HistoricalUpdateInfoDTO {
    private String coinId; // CoinGecko ID (пр. "bitcoin")
    private String tickerSymbol; // Ticker симбол (пр. "BTC")
    private Instant lastUpdatedDate; // Последниот датум во базата. Ако е null, нема податоци.
}