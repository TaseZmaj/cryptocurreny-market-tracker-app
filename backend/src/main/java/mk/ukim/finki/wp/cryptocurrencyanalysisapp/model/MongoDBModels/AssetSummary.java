package mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * MongoDB Document representing the constantly updated 24-Hour summary metrics.
 * This corresponds to the 'asset_summary' collection.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "asset_summary")
public class AssetSummary {

    @Id
    private String coinId; // The CoinGecko ID (e.g., "bitcoin") serves as the primary key.

    private BigDecimal lastPrice;
    private BigDecimal volume24h;
    private BigDecimal high24h;
    private BigDecimal low24h;
    private BigDecimal liquidity24h;
    private Instant updatedAt; // Timestamp of the last successful update

}