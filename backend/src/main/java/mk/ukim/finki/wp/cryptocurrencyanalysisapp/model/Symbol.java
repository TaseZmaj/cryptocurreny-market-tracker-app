package mk.ukim.finki.wp.cryptocurrencyanalysisapp.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Document(collection = "crypto_symbols")
@Setter
@Getter
public class Symbol {

    // Ќе го користиме симболот како ID (на пр. "BTC")
    @Id
    private String id;

    @Indexed(unique = true)
    private String symbol; // На пр. "BTC"
    private String name;
    private String quoteAsset;
    private BigDecimal marketCapRank; // Ранг (за да знаеме дали е во топ 1000)
    private LocalDate lastSyncedDate; // За следење во Филтер 2
    private boolean isActive; // За чистење
}