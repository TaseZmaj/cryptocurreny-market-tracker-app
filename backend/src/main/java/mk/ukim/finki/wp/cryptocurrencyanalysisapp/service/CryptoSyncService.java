package mk.ukim.finki.wp.cryptocurrencyanalysisapp.service;


import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.RawSymbolDTO;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.Symbol;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.repository.SymbolRepository;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CryptoSyncService {


    private final SymbolRepository symbolRepository;
    private final RestTemplate restTemplate = new RestTemplate(); // Алатка за API повици


    // Главната метода која го извршува Филтер 1
    public void syncTopSymbols() {
        // 1. Екстракција (Extraction)
        List<RawSymbolDTO> rawSymbols = extractRawSymbolsFromApi();

        // 2. Филтрирање и Трансформација (Filter/Transformation)
        List<Symbol> cleanSymbols = rawSymbols.stream()
                .filter(this::isValidForInclusion) // Филтрирање: Исклучува невалидни
                .map(this::transformToSymbol)      // Трансформација: Мапира во Symbol објект
                .collect(Collectors.toList());

        // 3. Внесување (Load)
        symbolRepository.saveAll(cleanSymbols);
        System.out.println("Filter 1 Completed: Successfully synced " + cleanSymbols.size() + " active symbols to MongoDB.");
    }

    // =========================================================
    // ПРИВАТНИ МЕТОДИ (Имплементација на Филтерот)
    // =========================================================

    // Филтер 1-А: Екстракција на сурови податоци
    private List<RawSymbolDTO> extractRawSymbolsFromApi() {

        // API URL со параметри за редослед и број на резултати по страница
        final String BASE_API_URL =
                "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=";

        final int TOTAL_PAGES = 10; // Цел: 10 страници x 100 резултати = 1000 симболи
        List<RawSymbolDTO> allSymbols = new ArrayList<>();

        System.out.println("Starting multi-page API extraction for 1000 symbols...");

        try {
            for (int page = 1; page <= TOTAL_PAGES; page++) {
                String url = BASE_API_URL + page;

                // 1. Повик до API за секоја страница
                ResponseEntity<List<RawSymbolDTO>> response = restTemplate.exchange(
                        url,
                        HttpMethod.GET,
                        null,
                        new ParameterizedTypeReference<List<RawSymbolDTO>>() {}
                );

                List<RawSymbolDTO> pageSymbols = response.getBody();
                if (pageSymbols == null || pageSymbols.isEmpty()) {
                    System.out.println("Warning: Page " + page + " returned empty results. Stopping.");
                    break; // Прекини ако нема повеќе податоци
                }

                allSymbols.addAll(pageSymbols); // Додај ги резултатите во главната листа
                System.out.println("  -> Successfully retrieved " + pageSymbols.size() + " symbols from Page " + page);

                // МНОГУ ВАЖНО: Додадете кратко одложување за да избегнете Rate Limiting
                // CoinGecko бара најмалку 1 повик/секунда.
                Thread.sleep(10000); // Пауза од 1.5 секунди
            }

            System.out.println("Extraction successful. Retrieved a total of " + allSymbols.size() + " raw symbols.");
            return allSymbols;

        } catch (InterruptedException e) {
            // Ова се случува ако Thread.sleep е прекинат
            Thread.currentThread().interrupt();
            System.err.println("API extraction interrupted.");
            return allSymbols;
        } catch (Exception e) {
            System.err.println("CRITICAL ERROR: Failed to fetch data from CoinGecko API: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }

    private boolean isValidForInclusion(RawSymbolDTO raw) {
        // 1. ФИЛТЕР: Исклучи невалидни/фиат валути
        if (raw.getName().toLowerCase().contains("lira") || raw.getName().toLowerCase().contains("fiat") || raw.getSymbol().length() > 5) {
            System.out.println("Filter 1: Skipping suspected non-crypto asset: " + raw.getSymbol());
            return false;
        }

        // 2. ФИЛТЕР: Исклучи ниска ликвидност / Делистирани (преку Market Cap и Volume)

        // Минимален Market Cap (10 милиони УСД за сигурност, не 1 милион)
        BigDecimal MIN_MARKET_CAP = new BigDecimal("10000000");
        // Минимален дневен Volume (пример: 100,000 УСД)
        BigDecimal MIN_VOLUME = new BigDecimal("100000");

        // Проверка за Market Cap
        if (raw.getMarketCap() == null || raw.getMarketCap().compareTo(MIN_MARKET_CAP) < 0) {
            System.out.println("Filter 1: Skipping low Market Cap asset: " + raw.getSymbol());
            return false;
        }

        // Проверка за Total Volume (индикатор за ликвидност и дали е делистиран)
        if (raw.getTotalVolume() == null || raw.getTotalVolume().compareTo(MIN_VOLUME) < 0) {
            System.out.println("Filter 1: Skipping low Volume / potential delisted asset: " + raw.getSymbol());
            return false;
        }

        // *Забелешка: Дупликатите се решаваат со користење на Symbol како ID и MongoDB unique Index.*

        return true;
    }
    // Филтер 1-В: Трансформација
    private Symbol transformToSymbol(RawSymbolDTO raw) {
        Symbol symbol = new Symbol();
        symbol.setId(raw.getSymbol().toUpperCase());
        symbol.setSymbol(raw.getSymbol().toUpperCase());
        symbol.setName(raw.getName());
        symbol.setActive(true);
        // Додадете ги и другите полиња од DTO
        if (raw.getRank() != null) {
            symbol.setMarketCapRank(new BigDecimal(raw.getRank()));
        }
        symbol.setQuoteAsset("USD"); // Од API URL

        return symbol;
    }

    // DTO за прифаќање на сурови податоци од API (треба да го креирате)
    // Ова е примитивен пример, вистинскиот DTO ќе биде покомплексен.
    private static class RawSymbol {
        private String symbol;
        private String name;
        private int rank;
        private long marketCap;

        public RawSymbol(String symbol, String name, int rank, long marketCap) {
            this.symbol = symbol;
            this.name = name;
            this.rank = rank;
            this.marketCap = marketCap;
        }
        // Потребни се Getters за Lombok или рачно
        public String getSymbol() { return symbol; }
        public String getName() { return name; }
        public long getMarketCap() { return marketCap; }
    }
}
