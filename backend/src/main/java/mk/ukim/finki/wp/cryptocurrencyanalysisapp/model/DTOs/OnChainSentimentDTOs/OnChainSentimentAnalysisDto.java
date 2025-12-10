package mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.OnChainSentimentDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OnChainSentimentAnalysisDto {

    private OnChainMetricsDto onChainMetrics;
    private SentimentResultDto sentiment;
    private String combinedSignal; // "BULLISH", "BEARISH", "NEUTRAL"
}
