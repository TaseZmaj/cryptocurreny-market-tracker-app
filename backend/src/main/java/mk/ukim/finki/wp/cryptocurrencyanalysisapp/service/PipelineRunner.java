package mk.ukim.finki.wp.cryptocurrencyanalysisapp.service;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.HistoricalUpdateInfoDTO;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.Symbol;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
@AllArgsConstructor
public class PipelineRunner {

    private final Filter1 filter1;
    private final Filter2 filter2;
    private final Filter3 filter3;


    @PostConstruct
    public void runPipeline() {
        Instant start = Instant.now();   // start timer

        System.out.println("--------------- STARTING FILTER 1 ---------------");
        List<Symbol> filter1Results = filter1.run();
        System.out.println("--------------- FILTER 1 END --------------- \n\n");

        System.out.println("--------------- STARTING FILTER 2 ---------------");
        List<HistoricalUpdateInfoDTO> filter2Results = filter2.run(filter1Results);
        System.out.println("--------------- FILTER 2 END --------------- \n\n");


        System.out.println("--------------- STARTING FILTER 3 ---------------");
        filter3.run(filter2Results);
        System.out.println("--------------- FILTER 3 END --------------- \n");


        Instant end = Instant.now(); //stop timer
        Duration duration = Duration.between(start, end);

        System.out.println("\n THE PIPELINE COMPLETED IN: "
                    + duration.toMinutes() + " minutes "
                    + (duration.getSeconds() % 60) + " seconds");
    }
}