package mk.ukim.finki.wp.cryptocurrencyanalysisapp.exception;

public class PipelineNotReadyException extends RuntimeException {
    public PipelineNotReadyException() {
        super("The data pipeline is still initializing.");
    }
}