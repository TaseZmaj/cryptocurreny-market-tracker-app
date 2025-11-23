package mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

/**
 * Data Transfer Object for the CoinGecko /market_chart API response.
 * The API returns data as a list of [timestamp (long), value (double)].
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MarketChartResponseDTO {

    // Each inner list is [timestamp_ms, price_value]
    private List<List<Double>> prices;

    // Each inner list is [timestamp_ms, market_cap_value]
    private List<List<Double>> market_caps;

    // Each inner list is [timestamp_ms, total_volumes_value]
    private List<List<Double>> total_volumes;
}