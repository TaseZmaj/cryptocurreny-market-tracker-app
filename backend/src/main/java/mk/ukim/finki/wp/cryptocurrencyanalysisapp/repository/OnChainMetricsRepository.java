package mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository;

import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.OnChainMetrics;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface OnChainMetricsRepository extends MongoRepository<OnChainMetrics, String> {

    Optional<OnChainMetrics> findFirstBySymbolOrderByIdDesc(String symbol);
}
