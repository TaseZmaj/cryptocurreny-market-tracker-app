package mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository;

import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.Symbol;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;


/**
 * Repository for managing Symbol documents (the output of Filter 1).
 */
@Repository
public interface SymbolRepository extends MongoRepository<Symbol, String> {
    Optional<Symbol> findBySymbolIgnoreCase(String symbol);
}

