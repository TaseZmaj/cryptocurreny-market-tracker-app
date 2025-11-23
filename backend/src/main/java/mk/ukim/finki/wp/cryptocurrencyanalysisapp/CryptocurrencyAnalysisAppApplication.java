package mk.ukim.finki.wp.cryptocurrencyanalysisapp;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import lombok.RequiredArgsConstructor;

@SpringBootApplication
@RequiredArgsConstructor
public class CryptocurrencyAnalysisAppApplication {

    public static void main(String[] args) {
        SpringApplication.run(CryptocurrencyAnalysisAppApplication.class, args);
    }
}