package mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.OnChainSentimentDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OnChainMetricsDto {

    private String symbol;

    // on-chain метрики (можеш да додадеш уште ако сакаш)
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
