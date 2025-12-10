package mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.OnChainSentimentDTOs;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SentimentResultDto {

    private String sentiment;   // "POSITIVE", "NEGATIVE", "NEUTRAL"
    private double score;       // од -1 до 1
}
