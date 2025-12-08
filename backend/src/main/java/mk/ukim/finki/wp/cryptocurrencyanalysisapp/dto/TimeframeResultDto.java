package mk.ukim.finki.wp.cryptocurrencyanalysisapp.dto;

import java.util.Map;

public class TimeframeResultDto {

    private String signal;
    private Map<String, Object> last_candle;

    public TimeframeResultDto() {}

    public String getSignal() {
        return signal;
    }

    public void setSignal(String signal) {
        this.signal = signal;
    }

    public Map<String, Object> getLast_candle() {
        return last_candle;
    }

    public void setLast_candle(Map<String, Object> last_candle) {
        this.last_candle = last_candle;
    }
}
