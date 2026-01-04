package mk.ukim.finki.wp.cryptocurrencyanalysisapp.service;

import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.MicroservicesDTOs.AnalyzeRequestDto;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.MicroservicesDTOs.AnalyzeResponseDto;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.MicroservicesDTOs.CandleDto;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.HistoricalData;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository.HistoricalDataRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Service што ги зема историските податоци од Mongo
 * и го вика Python API-то за техничка анализа.
 */
@Service
public class TechnicalAnalysisService {

    private final HistoricalDataRepository historicalDataRepository;
    private final RestTemplate restTemplate;

    // URL на Python FastAPI сервис
    private static final String PYTHON_API_URL = "http://technical-analysis:8000/analyze";

    public TechnicalAnalysisService(HistoricalDataRepository historicalDataRepository,
                                    RestTemplate restTemplate) {
        this.historicalDataRepository = historicalDataRepository;
        this.restTemplate = restTemplate;
    }

    public AnalyzeResponseDto analyzeSymbol(String coinGeckoId) {

        // 1) Земаме историски податоци од Mongo за тој coin
        List<HistoricalData> history =
                historicalDataRepository.findBySymbolIdOrderByTimestampDesc(coinGeckoId);

        if (history.isEmpty()) {
           throw new RuntimeException("No historical data found for symbol " + coinGeckoId);
        }

        // 2) Ги мапираме HistoricalData -> CandleDto (формат што го очекува Python)
        List<CandleDto> candles = history.stream()
                .map(h -> new CandleDto(
                        h.getTimestamp().toString(),                 // Instant -> ISO String
                        h.getOpen().doubleValue(),                   // BigDecimal -> double
                        h.getHigh().doubleValue(),
                        h.getLow().doubleValue(),
                        h.getClose().doubleValue(),
                        h.getTotalVolume().doubleValue()
                ))
                .collect(Collectors.toList());

        AnalyzeRequestDto requestDto = new AnalyzeRequestDto(candles);

        // 3) Го викаме Python API-то со POST /analyze
        AnalyzeResponseDto response = restTemplate.postForObject(
                PYTHON_API_URL,
                requestDto,
                AnalyzeResponseDto.class
        );

        return response;
    }
}
