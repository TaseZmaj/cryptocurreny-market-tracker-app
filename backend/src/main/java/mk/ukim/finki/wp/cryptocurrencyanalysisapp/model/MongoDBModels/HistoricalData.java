package mk.ukim.finki.wp.cryptocurrencyanalysisapp.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * MongoDB Document representing a single historical data point (OHLCV) for a cryptocurrency.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "historical_data")
//Index for fast searching by symbol and timestamp
@CompoundIndex(name = "symbol_timestamp_idx", def = "{'symbolId': 1, 'timestamp': -1}", unique = true)
public class HistoricalData {

    @Id
    private String id; // MongoDB ObjectId

    // This is the ID from CoinGecko
    @Indexed
    private String symbolId;

    @Indexed(direction = org.springframework.data.mongodb.core.index.IndexDirection.DESCENDING)
    private Instant timestamp;

    // OHLCV
    private BigDecimal open;
    private BigDecimal high;
    private BigDecimal low;
    private BigDecimal close;
    private BigDecimal totalVolume;

    public HistoricalData(String symbolId, Instant timestamp, BigDecimal open, BigDecimal high, BigDecimal low, BigDecimal close, BigDecimal totalVolume) {
        this.symbolId = symbolId;
        this.timestamp = timestamp;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.totalVolume = totalVolume;
    }
}