package mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.MicroservicesDTOs;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class LstmPredictionResponseDto {
    private String symbol;
    private double prediction;
    @JsonProperty("last_price")
    private double lastPrice;
}
