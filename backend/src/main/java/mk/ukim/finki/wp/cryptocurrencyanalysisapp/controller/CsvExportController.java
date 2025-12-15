package mk.ukim.finki.wp.cryptocurrencyanalysisapp.controller;

import lombok.RequiredArgsConstructor;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.DTOs.FrontendDTOs.CoinDetailsDTO;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.model.MongoDBModels.HistoricalData;
import mk.ukim.finki.wp.cryptocurrencyanalysisapp.service.CoinService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@CrossOrigin(origins = "http://localhost:5173/")
@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class CsvExportController {

    private final CoinService coinService;

    // 1) CSV export for same data as GET /api/coins (List<CoinDetailsDTO>)
    @GetMapping(value = "/coins", produces = "text/csv")
    public ResponseEntity<Resource> exportCoinsCsv() {
        List<CoinDetailsDTO> coins = coinService.getCoinsDetails();
        String csv = buildCoinsCsv(coins);

        return buildCsvResponse(csv, "coins");
    }

    // 2) CSV export for same data as GET /api/coins/{coinId}/history (List<HistoricalData>)
    @GetMapping(value = "/coins/{coinId}/history", produces = "text/csv")
    public ResponseEntity<Resource> exportHistoryCsv(@PathVariable String coinId) {
        List<HistoricalData> history = coinService.getHistoricalDataForSymbol(coinId);
        String csv = buildHistoryCsv(history);

        return buildCsvResponse(csv, "history_" + coinId);
    }

    // -------- helpers --------

    private ResponseEntity<Resource> buildCsvResponse(String csv, String baseFileName) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        String filename = baseFileName + "_" + timestamp + ".csv";

        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                // Nice-to-have: helps Excel read UTF-8 correctly
                .contentType(new MediaType("text", "csv", StandardCharsets.UTF_8))
                .contentLength(bytes.length)
                .body(new ByteArrayResource(bytes));
    }

    private String buildCoinsCsv(List<CoinDetailsDTO> coins) {
        StringBuilder sb = new StringBuilder();

        // Header (match CoinDetailsDTO fields you return to frontend)
        sb.append("id,symbol,name,marketCapRank,quoteAsset,active,lastPrice,volume24h,high24h,low24h,liquidity24h,updatedAt,coinIconUrl\n");

        for (CoinDetailsDTO c : coins) {
            sb.append(csv(c.getCoinId())).append(',')
                    .append(csv(c.getSymbol())).append(',')
                    .append(csv(c.getName())).append(',')
                    .append(csv(c.getMarketCapRank())).append(',')
                    .append(csv(c.getQuoteAsset())).append(',')
                    .append(csv(c.getActive())).append(',')
                    .append(csv(c.getLastPrice())).append(',')
                    .append(csv(c.getVolume24h())).append(',')
                    .append(csv(c.getHigh24h())).append(',')
                    .append(csv(c.getLow24h())).append(',')
                    .append(csv(c.getLiquidity24h())).append(',')
                    .append(csv(c.getSummaryUpdatedAt())).append(',')
                    .append(csv(c.getCoinIconUrl()))
                    .append('\n');
        }

        return sb.toString();
    }


    private String buildHistoryCsv(List<HistoricalData> history) {
        StringBuilder sb = new StringBuilder();

        sb.append("symbolId,timestamp,open,high,low,close,volume\n");

        for (HistoricalData h : history) {
            sb.append(csv(h.getSymbolId())).append(',')
                    .append(csv(h.getTimestamp())).append(',')
                    .append(csv(h.getOpen())).append(',')
                    .append(csv(h.getHigh())).append(',')
                    .append(csv(h.getLow())).append(',')
                    .append(csv(h.getClose())).append(',')
                    .append(csv(h.getTotalVolume()))
                    .append('\n');
        }

        return sb.toString();
    }

    // CSV escaping (handles commas, quotes, newlines, nulls)
    private String csv(Object value) {
        if (value == null) return "";
        String s = String.valueOf(value);
        boolean mustQuote = s.contains(",") || s.contains("\"") || s.contains("\n") || s.contains("\r");
        if (s.contains("\"")) s = s.replace("\"", "\"\"");
        return mustQuote ? "\"" + s + "\"" : s;
    }
}
