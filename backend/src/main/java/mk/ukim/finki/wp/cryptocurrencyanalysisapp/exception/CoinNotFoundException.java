package mk.ukim.finki.wp.cryptocurrencyanalysisapp.exception;

public class CoinNotFoundException extends RuntimeException {
    public CoinNotFoundException(String coinId) {
        super("Coin not found: " + coinId);
    }
}
