package mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels;
//
//import lombok.Getter;
//import lombok.Setter;
//import org.springframework.data.annotation.Id;
//import org.springframework.data.mongodb.core.index.Indexed;
//import org.springframework.data.mongodb.core.mapping.Document;
//import lombok.Data;
//
//import java.math.BigDecimal;
//import java.time.LocalDate;
//
//@Data
//@Document(collection = "crypto_symbols")
//@Setter
//@Getter
//public class Symbol {
//
//    // Ќе го користиме симболот како ID (на пр. "BTC")
//    @Id
//    private String id;
//
//    @Indexed(unique = true)
//    private String symbol; // На пр. "BTC"
//    private String name;
//    private String quoteAsset;
//    private BigDecimal marketCapRank; // Ранг (за да знаеме дали е во топ 1000)
//    private LocalDate lastSyncedDate; // За следење во Филтер 2
//    private boolean isActive; // За чистење
//}


import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.Data;
import java.math.BigDecimal;
import java.time.Instant;

@Data
@Document(collection = "symbols") // Maps this class to a MongoDB collection named 'symbols'
public class Symbol {

    // The primary key (MongoDB's _id field). Must match the ID type in MongoRepository<Symbol, String>.
    @Id
    private String id; // This should hold the CoinGecko ID, e.g., "bitcoin"

    // Core data from Filter 1
    private String symbol; // The ticker, e.g., "BTC"
    private String name;   // The full name, e.g., "Bitcoin"
    private Boolean active; // True if passed Filter 1
    private BigDecimal marketCapRank;

    // Data relevant to the pipeline / Filter 2
    private Instant lastDataFetchDate; // To store the last date historical data was updated (for Filter 2 check)
    private String quoteAsset; // e.g., "USD"

    private String coinIconUrl;
}
