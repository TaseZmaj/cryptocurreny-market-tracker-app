package mk.ukim.finki.wp.cryptocurrencyanalysisapp.dto;

import java.util.List;

public class AnalyzeRequestDto {

    private List<CandleDto> candles;

    public AnalyzeRequestDto() {}

    public AnalyzeRequestDto(List<CandleDto> candles) {
        this.candles = candles;
    }

    public List<CandleDto> getCandles() {
        return candles;
    }

    public void setCandles(List<CandleDto> candles) {
        this.candles = candles;
    }
}
