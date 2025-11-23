package mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository;

import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.AssetSummary;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for managing AssetSummary documents (24H metrics) in MongoDB.
 */
@Repository
public interface AssetSummaryRepository extends MongoRepository<AssetSummary, String> { }