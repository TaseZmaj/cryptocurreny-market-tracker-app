package mk.ukim.finki.wp.cryptocurrencyanalysisapp.service;

import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.OnChainSentimentDTOs.OnChainMetricsDto;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.OnChainSentimentDTOs.OnChainSentimentAnalysisDto;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.OnChainSentimentDTOs.SentimentResultDto;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.AssetSummary;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.HistoricalData;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.OnChainMetrics;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.Symbol;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository.AssetSummaryRepository;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository.HistoricalDataRepository;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository.OnChainMetricsRepository;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository.SymbolRepository;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.service.providers.DefiLlamaClient;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.utils.SimpleSentimentAnalyzer;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class OnChainSentimentService {

    private final OnChainMetricsRepository onChainMetricsRepository;
    private final AssetSummaryRepository assetSummaryRepository;
    private final HistoricalDataRepository historicalDataRepository;
    private final SymbolRepository symbolRepository;
    private final DefiLlamaClient defiLlamaClient;

    public OnChainSentimentService(OnChainMetricsRepository onChainMetricsRepository,
                                   AssetSummaryRepository assetSummaryRepository,
                                   HistoricalDataRepository historicalDataRepository,
                                   SymbolRepository symbolRepository,
                                   DefiLlamaClient defiLlamaClient) {
        this.onChainMetricsRepository = onChainMetricsRepository;
        this.assetSummaryRepository = assetSummaryRepository;
        this.historicalDataRepository = historicalDataRepository;
        this.symbolRepository = symbolRepository;
        this.defiLlamaClient = defiLlamaClient;
    }

    // Главен метод: комбинирана анализа
    public OnChainSentimentAnalysisDto analyze(String symbolOrCoinId, String newsText) {

        OnChainMetricsDto metricsDto = loadOrGenerateMetrics(symbolOrCoinId);

        double score = SimpleSentimentAnalyzer.score(newsText);
        String label = SimpleSentimentAnalyzer.label(score);

        SentimentResultDto sentimentResultDto = new SentimentResultDto(label, score);

        String combinedSignal = combine(metricsDto, sentimentResultDto);

        return new OnChainSentimentAnalysisDto(metricsDto, sentimentResultDto, combinedSignal);
    }

    // 1) земаме од базата (on_chain_metrics snapshot) или пресметуваме proxy метрики од Mongo
    private OnChainMetricsDto loadOrGenerateMetrics(String inputSymbolOrCoinId) {
        String coinId = resolveCoinId(inputSymbolOrCoinId);

        return onChainMetricsRepository
                .findFirstBySymbolOrderByIdDesc(coinId)
                .map(this::mapToDto)
                .orElseGet(() -> fetchAndStoreProxyMetricsFromMongo(coinId));
    }

    /**
     * Мапирање од coinId (slug) кон DeFi chain name за TVL.
     * Ако врати null -> нема TVL.
     */
    private String mapCoinToChain(String coinId) {
        return switch (coinId) {
            case "ethereum", "weth", "wrapped-eeth", "ethena-usde" -> "Ethereum";
            case "solana", "sui" -> "Solana";
            case "binancecoin", "bnb" -> "BSC";
            case "polygon" -> "Polygon";
            case "avalanche-2" -> "Avalanche";
            default -> null;
        };
    }

    // Ако корисник прати "stellar" (slug) или "XLM" (ticker) -> врати coinId (slug)
    private String resolveCoinId(String input) {
        if (input == null || input.isBlank()) {
            throw new IllegalArgumentException("Symbol/coinId is required.");
        }

        String trimmed = input.trim();

        // 1) ако е веќе slug и постои како _id во symbols
        if (symbolRepository.existsById(trimmed)) {
            return trimmed;
        }

        // 2) ако е ticker -> најди slug
        return symbolRepository.findBySymbolIgnoreCase(trimmed)
                .map(Symbol::getId)
                .orElseThrow(() -> new IllegalArgumentException("Unknown symbol/coinId: " + input));
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

    /**
     * Реални PROXY on-chain метрики од Mongo + REAL TVL од DeFiLlama.
     */
    private OnChainMetricsDto fetchAndStoreProxyMetricsFromMongo(String coinId) {

        AssetSummary asset = assetSummaryRepository.findById(coinId)
                .orElseThrow(() -> new IllegalArgumentException("AssetSummary not found for coinId=" + coinId));

        List<HistoricalData> last30 = historicalDataRepository.findTop30BySymbolIdOrderByTimestampDesc(coinId);

        // --- ако нема историја ---
        BigDecimal avgDailyVolume = BigDecimal.ZERO;
        BigDecimal lastDailyVolume = BigDecimal.ZERO;

        if (last30 != null && !last30.isEmpty()) {
            BigDecimal sum = BigDecimal.ZERO;
            int cnt = 0;
            for (HistoricalData h : last30) {
                if (h.getTotalVolume() != null) {
                    sum = sum.add(h.getTotalVolume());
                    cnt++;
                }
            }
            if (cnt > 0) {
                avgDailyVolume = sum.divide(BigDecimal.valueOf(cnt), 8, RoundingMode.HALF_UP);
            }
            lastDailyVolume = last30.get(0).getTotalVolume() == null ? BigDecimal.ZERO : last30.get(0).getTotalVolume();
        }

        BigDecimal volume24h = asset.getVolume24h() == null ? BigDecimal.ZERO : asset.getVolume24h();
        BigDecimal liquidity24h = asset.getLiquidity24h() == null ? BigDecimal.ZERO : asset.getLiquidity24h();
        BigDecimal lastPrice = asset.getLastPrice() == null ? BigDecimal.ZERO : asset.getLastPrice();

        // --- Proxy метрики ---

        Long activeAddressesProxy = volume24h.divide(BigDecimal.valueOf(1000), 0, RoundingMode.HALF_UP).longValue();

        Long txCountProxy = avgDailyVolume.divide(BigDecimal.valueOf(500), 0, RoundingMode.HALF_UP).longValue();

        Long whaleProxy = BigDecimal.ZERO.compareTo(avgDailyVolume) == 0
                ? 0L
                : (lastDailyVolume.compareTo(avgDailyVolume.multiply(BigDecimal.valueOf(2))) > 0 ? 1L : 0L);

        Double exchangeFlowProxy = (volume24h.compareTo(BigDecimal.ZERO) == 0)
                ? 0.0
                : liquidity24h.divide(volume24h, 8, RoundingMode.HALF_UP).doubleValue();

        BigDecimal avgClose30 = BigDecimal.ZERO;
        if (last30 != null && !last30.isEmpty()) {
            BigDecimal sumClose = BigDecimal.ZERO;
            int cntClose = 0;
            for (HistoricalData h : last30) {
                if (h.getClose() != null) {
                    sumClose = sumClose.add(h.getClose());
                    cntClose++;
                }
            }
            if (cntClose > 0) {
                avgClose30 = sumClose.divide(BigDecimal.valueOf(cntClose), 8, RoundingMode.HALF_UP);
            }
        }

        Double mvrvProxy = (avgClose30.compareTo(BigDecimal.ZERO) == 0)
                ? 1.0
                : lastPrice.divide(avgClose30, 8, RoundingMode.HALF_UP).doubleValue();

        Double nvtProxy = (avgDailyVolume.compareTo(BigDecimal.ZERO) == 0)
                ? 0.0
                : liquidity24h.divide(avgDailyVolume, 8, RoundingMode.HALF_UP).doubleValue();

        Double hashRate = null;

        // ✅ REAL TVL од DeFiLlama (ако има мапирање)
        String chain = mapCoinToChain(coinId);
        Double tvl = (chain == null) ? null : defiLlamaClient.getChainTvl(chain);

        // --- Сними snapshot во on_chain_metrics ---
        OnChainMetrics entity = new OnChainMetrics();
        entity.setSymbol(coinId);
        entity.setActiveAddresses(activeAddressesProxy);
        entity.setTransactionCount(txCountProxy);
        entity.setExchangeInflow(exchangeFlowProxy);
        entity.setExchangeOutflow(exchangeFlowProxy);
        entity.setWhaleTransactions(whaleProxy);
        entity.setHashRate(hashRate);
        entity.setTotalValueLocked(tvl);
        entity.setNvtRatio(nvtProxy);
        entity.setMvrvRatio(mvrvProxy);

        onChainMetricsRepository.save(entity);

        return mapToDto(entity);
    }

    // 2) Комбинација on-chain + sentiment
    private String combine(OnChainMetricsDto m, SentimentResultDto s) {

        if ("POSITIVE".equals(s.getSentiment())
                && m.getActiveAddresses() != null
                && m.getActiveAddresses() > 120_000
                && m.getTransactionCount() != null
                && m.getTransactionCount() > 350_000) {
            return "BULLISH";
        }

        if ("NEGATIVE".equals(s.getSentiment())
                && m.getNvtRatio() != null
                && m.getNvtRatio() > 0.8) {
            return "BEARISH";
        }

        return "NEUTRAL";
    }
}
