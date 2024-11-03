package co.edu.unbosque.controller;

import java.util.Collections;
import java.util.Date;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import co.edu.unbosque.dto.EntertainmentReportDTO;
import co.edu.unbosque.service.EntertainmentReportService;

@RestController
@RequestMapping("/api/entertainment-report")
@CrossOrigin(origins = "http://localhost:4200")
public class EntertainmentReportController {
    private final EntertainmentReportService entertainmentReportService;

    public EntertainmentReportController(EntertainmentReportService entertainmentReportService) {
        this.entertainmentReportService = entertainmentReportService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getEntertainmentReport(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "10") int topN,
            @RequestParam(defaultValue = "2") int genreCount,
            @RequestParam(defaultValue = "true") boolean moviesByGenreAscending,
            @RequestParam(defaultValue = "true") boolean topRatedBooksAscending,
            @RequestParam(defaultValue = "true") boolean topBottomBooksByYearAscending,
            @RequestParam(defaultValue = "true") boolean moviesByGenreCountAscending) {
        try {
            EntertainmentReportDTO report = entertainmentReportService.getEntertainmentReport(
                    startDate, endDate, topN, genreCount,
                    moviesByGenreAscending, topRatedBooksAscending,
                    topBottomBooksByYearAscending, moviesByGenreCountAscending);
            return ResponseEntity.ok(Map.of("data", report));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    @GetMapping("/export/pdf")
    public ResponseEntity<byte[]> exportEntertainmentReportPdf(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate,
            @RequestParam(defaultValue = "10") int topN,
            @RequestParam(defaultValue = "2") int genreCount,
            @RequestParam(defaultValue = "true") boolean ascending) {
        try {
            byte[] pdfBytes = entertainmentReportService.generateEntertainmentReportPdf(
                    startDate, endDate, topN, genreCount, ascending);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("filename", "reporte-entretenimiento.pdf");

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}