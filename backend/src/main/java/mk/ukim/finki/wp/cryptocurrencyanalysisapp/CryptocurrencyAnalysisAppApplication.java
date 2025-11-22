package mk.ukim.finki.wp.cryptocurrencyanalysisapp;

import mk.ukim.finki.wp.cryptocurrencyanalysisapp.service.CryptoSyncService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.CommandLineRunner;
@SpringBootApplication
public class CryptocurrencyAnalysisAppApplication implements CommandLineRunner {

	@Autowired
	private CryptoSyncService syncService;

	public static void main(String[] args) {
		SpringApplication.run(CryptocurrencyAnalysisAppApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		System.out.println("--- APPLICATION STARTING SYNC ---");
		// Оваа метода ќе се изврши веднаш штом стартува апликацијата
		syncService.syncTopSymbols();
		System.out.println("--- SYNC PROCESS FINISHED ---");

		// По желба, можете да го исклучите Spring Boot по завршување на Job-от
		// System.exit(0);
	}

}
