package mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs;

import lombok.Data;
import lombok.AllArgsConstructor;

import java.time.Instant;

/**
 * DTO за пренос на информации помеѓу Filter 2 и Filter 3.
 * Ја содржи идентификацијата на симболот и последниот датум до кој имаме податоци.
 */
@Data
@AllArgsConstructor
public class HistoricalUpdateInfoDTO {
    private String coinId; // CoinGecko ID (пр. "bitcoin")
    private String tickerSymbol; // Ticker симбол (пр. "BTC")
    private Instant lastUpdatedDate; // Последниот датум во базата. Ако е null, нема податоци.
}