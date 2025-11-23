package mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository;

import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.Symbol;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository for managing Symbol documents (the output of Filter 1).
 */
@Repository
public interface SymbolRepository extends MongoRepository<Symbol, String> {

    List<Symbol> findAllByActiveTrue(); //Finds all active symbols that should proceed to the next filter.
}