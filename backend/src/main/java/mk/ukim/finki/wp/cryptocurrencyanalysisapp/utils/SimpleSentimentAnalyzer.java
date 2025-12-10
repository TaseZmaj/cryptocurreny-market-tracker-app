package mk.ukim.finki.wp.cryptocurrencyanalysisapp.utils;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Locale;
import java.util.Set;

public class SimpleSentimentAnalyzer {

    private static final Set<String> POSITIVE_WORDS = new HashSet<>(Arrays.asList(
            "bullish", "buy", "moon", "gain", "rally", "positive", "up", "pump",
            "optimistic", "good", "great", "strong", "green"
    ));

    private static final Set<String> NEGATIVE_WORDS = new HashSet<>(Arrays.asList(
            "bearish", "sell", "dump", "crash", "down", "negative", "bad",
            "fear", "weak", "red", "panic", "risk"
    ));

    public static double score(String text) {
        if (text == null || text.isBlank()) {
            return 0.0;
        }

        String normalized = text.toLowerCase(Locale.ROOT);
        String[] tokens = normalized.split("\\W+");

        int pos = 0;
        int neg = 0;

        for (String token : tokens) {
            if (POSITIVE_WORDS.contains(token)) pos++;
            if (NEGATIVE_WORDS.contains(token)) neg++;
        }

        int total = pos + neg;
        if (total == 0) return 0.0;

        // score во опсег [-1, 1]
        return (double) (pos - neg) / total;
    }

    public static String label(double score) {
        if (score > 0.2) return "POSITIVE";
        if (score < -0.2) return "NEGATIVE";
        return "NEUTRAL";
    }
}
