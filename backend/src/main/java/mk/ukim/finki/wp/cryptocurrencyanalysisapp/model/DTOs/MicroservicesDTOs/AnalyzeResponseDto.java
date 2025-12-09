package mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.MicroservicesDTOs;

import java.util.Map;

public class AnalyzeResponseDto {

    private Map<String, TimeframeResultDto> timeframes;

    public AnalyzeResponseDto() {}

    public Map<String, TimeframeResultDto> getTimeframes() {
        return timeframes;
    }

    public void setTimeframes(Map<String, TimeframeResultDto> timeframes) {
        this.timeframes = timeframes;
    }
}
