package mk.ukim.finki.wp.cryptocurrencyanalysisapp.service.Pipeline;

import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.PipelineDTOs.HistoricalUpdateInfoDTO;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.Symbol;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.ReentrantLock;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PipelineRunner {

    private final Filter1 filter1;
    private final Filter2 filter2;
    private final Filter3 filter3;

    @Qualifier("filterExecutor")
    private final Executor filterExecutor;

    private final ReentrantLock lock = new ReentrantLock();

    // Trigger pipeline asynchronously when app is fully ready - replaced @PostConstruct
    @Async
    @EventListener(ApplicationReadyEvent.class)
    public void startPipelineOnStartup() {
        runPipeline();
    }

    //Executes the pipeline every 30minutes
    @Async
    @Scheduled(cron = "0 0,30 * * * *")
    public void runPipeline() {
        if (!lock.tryLock()) {
            System.out.println("Previous pipeline still running, skipping this execution.");
            return;
        }

        try {
            System.out.println("--------------- STARTING FILTER 1 ---------------");
            List<Symbol> filter1Results = filter1.run();
            System.out.println("--------------- FILTER 1 END --------------- \n\n");

            System.out.println("--------------- STARTING FILTER 2 ---------------");
            List<HistoricalUpdateInfoDTO> filter2Results = filter2.run(filter1Results);
            System.out.println("--------------- FILTER 2 END --------------- \n\n");

            System.out.println("--------------- STARTING FILTER 3 ---------------");
            filter3.run(filter2Results);
            System.out.println("--------------- FILTER 3 END --------------- \n");
        } finally {
            lock.unlock();
        }
    }
}
