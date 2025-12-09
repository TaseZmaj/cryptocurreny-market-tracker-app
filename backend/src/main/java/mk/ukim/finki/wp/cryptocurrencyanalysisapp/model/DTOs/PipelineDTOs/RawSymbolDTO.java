package mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.PipelineDTOs;

import lombok.Data;
import java.math.BigDecimal;
import com.fasterxml.jackson.annotation.JsonProperty;


/**
 * DTO for transferring data between Filter 1 and Filter 2
 */
@Data
public class RawSymbolDTO {

    // Полето "id" во JSON одговорот (пр. "bitcoin")
    @JsonProperty("id")
    private String coinId;

    // Полето "symbol" (пр. "btc")
    private String symbol;

    // Полето "name" (пр. "Bitcoin")
    private String name;

    @JsonProperty("market_cap_rank")
    private Integer rank;

    @JsonProperty("market_cap")
    private BigDecimal marketCap;

    // Потребно за да се провери дали е активен/делистиран
    @JsonProperty("total_volume")
    private BigDecimal totalVolume;
}