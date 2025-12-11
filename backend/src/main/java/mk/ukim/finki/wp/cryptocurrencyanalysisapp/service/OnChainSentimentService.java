package mk.ukim.finki.wp.cryptocurrencyanalysisapp.service;

import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.OnChainSentimentDTOs.OnChainMetricsDto;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.OnChainSentimentDTOs.OnChainSentimentAnalysisDto;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.OnChainSentimentDTOs.SentimentResultDto;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.OnChainMetrics;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository.OnChainMetricsRepository;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.utils.SimpleSentimentAnalyzer;
import org.springframework.stereotype.Service;

import java.util.Random;

@Service
public class OnChainSentimentService {

    private final OnChainMetricsRepository onChainMetricsRepository;
    private final Random random = new Random();

    public OnChainSentimentService(OnChainMetricsRepository onChainMetricsRepository) {
        this.onChainMetricsRepository = onChainMetricsRepository;
    }

    // Главен метод: комбинирана анализа
    public OnChainSentimentAnalysisDto analyze(String symbol, String newsText) {

        OnChainMetricsDto metricsDto = loadOrGenerateMetrics(symbol);

        double score = SimpleSentimentAnalyzer.score(newsText);
        String label = SimpleSentimentAnalyzer.label(score);

        SentimentResultDto sentimentResultDto = new SentimentResultDto(label, score);

        String combinedSignal = combine(metricsDto, sentimentResultDto);

        return new OnChainSentimentAnalysisDto(metricsDto, sentimentResultDto, combinedSignal);
    }

    // 1) земаме од базата или генерираме dummy податоци
    private OnChainMetricsDto loadOrGenerateMetrics(String symbol) {
        return onChainMetricsRepository
                .findFirstBySymbolOrderByIdDesc(symbol)
                .map(this::mapToDto)
                .orElseGet(() -> generateDummyMetrics(symbol));
    }

    private OnChainMetricsDto mapToDto(OnChainMetrics m) {
        return new OnChainMetricsDto(
                m.getSymbol(),
                m.getActiveAddresses(),
                m.getTransactionCount(),
                m.getExchangeInflow(),
                m.getExchangeOutflow(),
                m.getWhaleTransactions(),
                m.getHashRate(),
                m.getTotalValueLocked(),
                m.getNvtRatio(),
                m.getMvrvRatio()
        );
    }

    // ТУКА подоцна можеш да повикаш реални API-a (Glassnode, Santiment...)
    private OnChainMetricsDto generateDummyMetrics(String symbol) {
        long active = 100_000L + random.nextInt(50_000);
        long txCount = 300_000L + random.nextInt(100_000);
        double inflow = 500.0 + random.nextDouble() * 100;
        double outflow = 400.0 + random.nextDouble() * 100;
        long whales = 50L + random.nextInt(20);
        double hashRate = 350.0 + random.nextDouble() * 50;
        double tvl = 10_000_000_000.0 + random.nextDouble() * 1_000_000_000.0;
        double nvt = 50.0 + random.nextDouble() * 20;
        double mvrv = 1.2 + random.nextDouble() * 0.5;

        return new OnChainMetricsDto(
                symbol,
                active,
                txCount,
                inflow,
                outflow,
                whales,
                hashRate,
                tvl,
                nvt,
                mvrv
        );
    }

    // 2) Комбинација на on-chain + sentiment
    private String combine(OnChainMetricsDto m, SentimentResultDto s) {

        // Едноставна логика за пример:
        // ако sentiment е позитивен и има многу активни адреси -> BULLISH
        // ако sentiment е негативен и NVT е висок -> BEARISH
        // инаку NEUTRAL

        if ("POSITIVE".equals(s.getSentiment())
                && m.getActiveAddresses() != null
                && m.getActiveAddresses() > 120_000
                && m.getTransactionCount() != null
                && m.getTransactionCount() > 350_000) {
            return "BULLISH";
        }

        if ("NEGATIVE".equals(s.getSentiment())
                && m.getNvtRatio() != null
                && m.getNvtRatio() > 60) {
            return "BEARISH";
        }

        return "NEUTRAL";
    }
}
