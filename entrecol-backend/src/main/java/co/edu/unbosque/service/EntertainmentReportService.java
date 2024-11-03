package co.edu.unbosque.service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.jfree.chart.ChartFactory;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.data.category.DefaultCategoryDataset;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.itextpdf.text.Document;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.FontFactory;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;

import co.edu.unbosque.dto.EntertainmentReportDTO;
import co.edu.unbosque.model.Book;
import co.edu.unbosque.model.Movie;
import co.edu.unbosque.repository.BookRepository;
import co.edu.unbosque.repository.MovieRepository;

@Service
public class EntertainmentReportService {
    private final MovieRepository movieRepository;
    private final BookRepository bookRepository;

    public EntertainmentReportService(MovieRepository movieRepository, BookRepository bookRepository) {
        this.movieRepository = movieRepository;
        this.bookRepository = bookRepository;
    }

    public EntertainmentReportDTO getEntertainmentReport(Date startDate, Date endDate, int topN, int genreCount,
            boolean ascending) {
        try {
            EntertainmentReportDTO report = new EntertainmentReportDTO();

            Calendar calendar = Calendar.getInstance();
            calendar.setTime(startDate);
            int startYear = calendar.get(Calendar.YEAR);
            calendar.setTime(endDate);
            int endYear = calendar.get(Calendar.YEAR);

            Sort.Direction direction = ascending ? Sort.Direction.ASC : Sort.Direction.DESC;

            List<Movie> movies = movieRepository.findMoviesByYearRange(startYear, endYear);
            report.setMoviesByGenre(movies != null ? movies : new ArrayList<>());

            List<Book> topBooks = bookRepository.findTopNByRating(PageRequest.of(0, topN, Sort.by(direction, "title")));
            report.setTopRatedBooks(topBooks != null ? topBooks : new ArrayList<>());

            Map<Integer, List<Book>> booksByYear = new HashMap<>();
            for (int year = startYear; year <= endYear; year++) {
                List<Book> yearTopBooks = bookRepository.findTopBooksByYear(year,
                        PageRequest.of(0, 5, Sort.by(direction, "title")));
                List<Book> yearBottomBooks = bookRepository.findBottomBooksByYear(year,
                        PageRequest.of(0, 5, Sort.by(direction, "title")));
                if (yearTopBooks != null) {
                    if (yearBottomBooks != null) {
                        yearTopBooks.addAll(yearBottomBooks);
                    }
                    booksByYear.put(year, yearTopBooks);
                }
            }
            report.setTopAndBottomBooksByYear(booksByYear);

            List<Movie> moviesByGenreCount = movieRepository.findMoviesByGenreCount(genreCount);
            Map<Integer, List<Movie>> moviesGrouped = new HashMap<>();
            moviesGrouped.put(genreCount, moviesByGenreCount != null ? moviesByGenreCount : new ArrayList<>());
            report.setMoviesGroupedByGenreCount(moviesGrouped);
            report.setTotalMovies((long) (moviesByGenreCount != null ? moviesByGenreCount.size() : 0));

            List<Object[]> genreStats = movieRepository.getMovieCountByGenre();
            Map<String, Long> genreStatsMap = genreStats != null ? genreStats.stream()
                    .collect(Collectors.toMap(
                            row -> (String) row[0],
                            row -> (Long) row[1]))
                    : new HashMap<>();
            report.setMoviesByGenreStats(genreStatsMap);

            List<Object[]> bookStats = bookRepository.getBookCountByYear(startDate, endDate);
            Map<Integer, Long> bookStatsMap = bookStats != null ? bookStats.stream()
                    .collect(Collectors.toMap(
                            row -> ((Number) row[0]).intValue(),
                            row -> ((Number) row[1]).longValue()))
                    : new HashMap<>();
            report.setBookPublicationStats(bookStatsMap);

            return report;
        } catch (Exception e) {
            throw new RuntimeException("Error generating entertainment report: " + e.getMessage(), e);
        }
    }

    public byte[] generateEntertainmentReportPdf(Date startDate, Date endDate, int topN, int genreCount,
            boolean ascending) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter.getInstance(document, out);
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);

            Paragraph title = new Paragraph("Reporte de Entretenimiento", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            EntertainmentReportDTO report = getEntertainmentReport(startDate, endDate, topN, genreCount, ascending);

            PdfPTable mainTable = new PdfPTable(1);
            mainTable.setWidthPercentage(100);

            JFreeChart movieGenreChart = createMovieGenreChart(report.getMoviesByGenreStats());
            addChartSection(mainTable, "Películas por Género", movieGenreChart);

            JFreeChart bookPublicationChart = createBookPublicationChart(report.getBookPublicationStats());
            addChartSection(mainTable, "Frecuencia de Publicación de Libros", bookPublicationChart);

            document.add(mainTable);
            document.close();

            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF", e);
        }
    }

    private JFreeChart createMovieGenreChart(Map<String, Long> stats) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        stats.forEach((genre, count) -> dataset.addValue(count, "Películas", genre));

        JFreeChart chart = ChartFactory.createBarChart(
                null,
                "Género",
                "Cantidad",
                dataset,
                PlotOrientation.VERTICAL,
                false,
                true,
                false);

        customizeChart(chart);
        return chart;
    }

    private JFreeChart createBookPublicationChart(Map<Integer, Long> stats) {
        DefaultCategoryDataset dataset = new DefaultCategoryDataset();
        stats.forEach((year, count) -> dataset.addValue(count, "Libros", year.toString()));

        JFreeChart chart = ChartFactory.createBarChart(
                null,
                "Año",
                "Cantidad",
                dataset,
                PlotOrientation.VERTICAL,
                false,
                true,
                false);

        customizeChart(chart);
        return chart;
    }

    private void customizeChart(JFreeChart chart) {
        chart.setBackgroundPaint(Color.WHITE);
        chart.getCategoryPlot().setBackgroundPaint(Color.WHITE);
    }

    private void addChartSection(PdfPTable table, String title, JFreeChart chart) throws Exception {
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);

        PdfPCell titleCell = new PdfPCell(new Paragraph(title, titleFont));
        titleCell.setBorder(0);
        titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        titleCell.setPaddingBottom(10);
        table.addCell(titleCell);

        java.awt.image.BufferedImage chartImage = chart.createBufferedImage(700, 400);
        com.itextpdf.text.Image chartPdfImage = com.itextpdf.text.Image.getInstance(chartImage, null);
        PdfPCell chartCell = new PdfPCell(chartPdfImage);
        chartCell.setBorder(0);
        chartCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        chartCell.setPaddingBottom(20);
        table.addCell(chartCell);
    }
}