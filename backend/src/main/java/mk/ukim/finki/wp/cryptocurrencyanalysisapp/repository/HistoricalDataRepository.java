package mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository;

import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.HistoricalData;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for managing HistoricalData documents in MongoDB.
 */
public interface HistoricalDataRepository extends MongoRepository<HistoricalData, String> {

    /**
     * Finds the single latest historical data record for a given symbol ID.
     * This is used to determine the last date of existing data.
     * @param symbolId The CoinGecko ID (e.g., "bitcoin").
     * @return The latest HistoricalData object, or empty if none exists.
     */
    Optional<HistoricalData> findTopBySymbolIdOrderByTimestampDesc(String symbolId);



    List<HistoricalData> findBySymbolIdOrderByTimestampDesc(String symbolId);

}