package mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "on_chain_metrics")
public class OnChainMetrics {

    @Id
    private String id;

    private String symbol;

    private Long activeAddresses;
    private Long transactionCount;
    private Double exchangeInflow;
    private Double exchangeOutflow;
    private Long whaleTransactions;
    private Double hashRate;
    private Double totalValueLocked;
    private Double nvtRatio;
    private Double mvrvRatio;
}
