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
import org.jfree.chart.renderer.category.BarRenderer;
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

    public EntertainmentReportDTO getEntertainmentReport(
            Date startDate, Date endDate, int topN, int genreCount,
            boolean moviesByGenreAscending, boolean topRatedBooksAscending,
            boolean topBottomBooksByYearAscending, boolean moviesByGenreCountAscending) {
        try {
            EntertainmentReportDTO report = new EntertainmentReportDTO();

            Calendar calendar = Calendar.getInstance();
            calendar.setTime(startDate);
            int startYear = calendar.get(Calendar.YEAR);
            calendar.setTime(endDate);
            int endYear = calendar.get(Calendar.YEAR);

            final Sort.Direction topRatedDirection = topRatedBooksAscending ? Sort.Direction.ASC : Sort.Direction.DESC;
            List<Book> topBooks = bookRepository.findTopNByRating(
                    PageRequest.of(0, topN, Sort.by(topRatedDirection, "title")));
            report.setTopRatedBooks(topBooks != null ? topBooks : new ArrayList<>());

            final Sort.Direction yearDirection = topBottomBooksByYearAscending ? Sort.Direction.ASC
                    : Sort.Direction.DESC;
            Map<Integer, List<Book>> booksByYear = new HashMap<>();
            for (int year = startYear; year <= endYear; year++) {
                List<Book> yearTopBooks = bookRepository.findTopBooksByYear(year,
                        PageRequest.of(0, 5, Sort.by(yearDirection, "title")));
                List<Book> yearBottomBooks = bookRepository.findBottomBooksByYear(year,
                        PageRequest.of(0, 5, Sort.by(yearDirection, "title")));
                if (yearTopBooks != null) {
                    if (yearBottomBooks != null) {
                        yearTopBooks.addAll(yearBottomBooks);
                    }
                    booksByYear.put(year, yearTopBooks);
                }
            }
            report.setTopAndBottomBooksByYear(booksByYear);

            final Sort.Direction movieDirection = moviesByGenreCountAscending ? Sort.Direction.ASC
                    : Sort.Direction.DESC;
            List<Movie> moviesByGenreCount = movieRepository.findMoviesByGenreCount(genreCount);
            if (moviesByGenreCount != null) {
                final Sort.Direction finalMovieDirection = movieDirection;
                moviesByGenreCount.sort((m1, m2) -> {
                    int comparison = m1.getTitle().compareTo(m2.getTitle());
                    return finalMovieDirection == Sort.Direction.ASC ? comparison : -comparison;
                });
            }

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
        try (ByteArrayOutputStream out = new ByteArrayOutputStream(8192)) {
            Document document = new Document(PageSize.A4.rotate());
            PdfWriter writer = PdfWriter.getInstance(document, out);
            writer.setFullCompression();
            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);
            Font sectionTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 16);
            Font yearFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);
            Font contentFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
            Font ratingFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12);

            Paragraph title = new Paragraph("Reporte de Entretenimiento", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20);
            document.add(title);

            Calendar calendar = Calendar.getInstance();
            calendar.setTime(startDate);
            int startYear = calendar.get(Calendar.YEAR);
            calendar.setTime(endDate);
            int endYear = calendar.get(Calendar.YEAR);

            EntertainmentReportDTO report = getEntertainmentReport(
                    startDate, endDate, topN, genreCount,
                    ascending, ascending, ascending, ascending);

            PdfPTable movieTable = new PdfPTable(1);
            movieTable.setWidthPercentage(100);

            JFreeChart movieGenreChart = createMovieGenreChart(report.getMoviesByGenreStats());
            addChartSection(movieTable,
                    String.format("Películas por Género (%d - %d)", startYear, endYear),
                    movieGenreChart);

            document.add(movieTable);

            document.newPage();

            PdfPTable bookTable = new PdfPTable(1);
            bookTable.setWidthPercentage(100);

            JFreeChart bookPublicationChart = createBookPublicationChart(report.getBookPublicationStats());
            addChartSection(bookTable,
                    String.format("Frecuencia de Publicación de Libros (%d - %d)", startYear, endYear),
                    bookPublicationChart);

            document.add(bookTable);

            document.newPage();

            PdfPTable booksTable = new PdfPTable(1);
            booksTable.setWidthPercentage(100);
            addTopRatedBooksSection(booksTable, report.getTopRatedBooks(),
                    String.format("Top %d Libros con Mejor Rating (%d - %d)",
                            topN, startYear, endYear),
                    sectionTitleFont, contentFont, ratingFont);
            document.add(booksTable);

            document.newPage();

            PdfPTable yearlyBooksTable = new PdfPTable(1);
            yearlyBooksTable.setWidthPercentage(100);
            addYearlyTopBooksSection(yearlyBooksTable, report.getTopAndBottomBooksByYear(),
                    String.format("Top 5 Libros por Año (%d - %d)", startYear, endYear),
                    sectionTitleFont, yearFont, contentFont, ratingFont);
            document.add(yearlyBooksTable);

            document.close();
            writer.close();

            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Error generating PDF: " + e.getMessage(), e);
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

        customizeChart(chart, new Color[] {
                new Color(70, 130, 180),
                new Color(255, 99, 71),
                new Color(50, 205, 50),
                new Color(255, 215, 0),
                new Color(138, 43, 226)
        });

        org.jfree.chart.axis.CategoryAxis domainAxis = chart.getCategoryPlot().getDomainAxis();
        domainAxis.setCategoryLabelPositions(
                org.jfree.chart.axis.CategoryLabelPositions.createUpRotationLabelPositions(Math.PI / 4.0));
        domainAxis.setMaximumCategoryLabelLines(2);
        domainAxis.setLabelFont(new java.awt.Font("SansSerif", java.awt.Font.PLAIN, 11));

        chart.getCategoryPlot().setDomainAxisLocation(org.jfree.chart.axis.AxisLocation.BOTTOM_OR_RIGHT);
        chart.getCategoryPlot().getDomainAxis().setLowerMargin(0.02);
        chart.getCategoryPlot().getDomainAxis().setUpperMargin(0.02);

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

        customizeChart(chart, new Color[] {
                new Color(255, 140, 0),
                new Color(46, 139, 87),
                new Color(220, 20, 60),
                new Color(75, 0, 130),
                new Color(184, 134, 11)
        });

        org.jfree.chart.axis.CategoryAxis domainAxis = chart.getCategoryPlot().getDomainAxis();
        domainAxis.setCategoryLabelPositions(
                org.jfree.chart.axis.CategoryLabelPositions.createUpRotationLabelPositions(Math.PI / 6.0));
        domainAxis.setMaximumCategoryLabelLines(1);
        domainAxis.setLabelFont(new java.awt.Font("SansSerif", java.awt.Font.PLAIN, 11));

        chart.getCategoryPlot().setDomainAxisLocation(org.jfree.chart.axis.AxisLocation.BOTTOM_OR_RIGHT);
        chart.getCategoryPlot().getDomainAxis().setLowerMargin(0.02);
        chart.getCategoryPlot().getDomainAxis().setUpperMargin(0.02);

        return chart;
    }

    private void customizeChart(JFreeChart chart, Color[] colors) {
        chart.setBackgroundPaint(Color.WHITE);
        org.jfree.chart.plot.CategoryPlot plot = chart.getCategoryPlot();
        plot.setBackgroundPaint(Color.WHITE);
        plot.setRangeGridlinePaint(new Color(220, 220, 220));
        plot.setDomainGridlinesVisible(false);
        plot.setOutlineVisible(false);

        BarRenderer renderer = (BarRenderer) plot.getRenderer();
        renderer.setMaximumBarWidth(0.1);
        renderer.setDrawBarOutline(false);
        renderer.setShadowVisible(false);

        int colorIndex = 0;
        for (int series = 0; series < renderer.getRowCount(); series++) {
            renderer.setSeriesPaint(series, colors[colorIndex % colors.length]);
            colorIndex++;
        }
    }

    private void addChartSection(PdfPTable table, String title, JFreeChart chart) throws Exception {
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14);

        PdfPCell titleCell = new PdfPCell(new Paragraph(title, titleFont));
        titleCell.setBorder(0);
        titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        titleCell.setPaddingBottom(10);
        table.addCell(titleCell);

        java.awt.image.BufferedImage chartImage = chart.createBufferedImage(800, 350);
        com.itextpdf.text.Image chartPdfImage = com.itextpdf.text.Image.getInstance(chartImage, null);
        PdfPCell chartCell = new PdfPCell(chartPdfImage);
        chartCell.setBorder(0);
        chartCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        chartCell.setPaddingBottom(20);
        table.addCell(chartCell);
    }

    private void addTopRatedBooksSection(PdfPTable table, List<Book> books, String title,
            Font titleFont, Font contentFont, Font ratingFont) throws Exception {
        PdfPCell titleCell = new PdfPCell(new Paragraph(title, titleFont));
        titleCell.setBorder(0);
        titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        titleCell.setPaddingBottom(20);
        table.addCell(titleCell);

        PdfPTable booksTable = new PdfPTable(2);
        booksTable.setWidthPercentage(95);
        booksTable.setWidths(new float[] { 0.8f, 0.2f });
        booksTable.setSpacingBefore(10);

        for (Book book : books) {
            PdfPCell bookCell = new PdfPCell(new Paragraph(book.getTitle(), contentFont));
            bookCell.setBorder(0);
            bookCell.setPaddingBottom(10);
            bookCell.setPaddingTop(10);
            bookCell.setPaddingLeft(20);
            booksTable.addCell(bookCell);

            PdfPCell ratingCell = new PdfPCell(
                    new Paragraph(String.format("%.1f", book.getAverageRating()), ratingFont));
            ratingCell.setBorder(0);
            ratingCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            ratingCell.setPaddingBottom(10);
            ratingCell.setPaddingTop(10);
            booksTable.addCell(ratingCell);

            PdfPCell separatorCell = new PdfPCell();
            separatorCell.setColspan(2);
            separatorCell.setBorder(PdfPCell.BOTTOM);
            separatorCell.setBorderColor(new com.itextpdf.text.BaseColor(211, 211, 211));
            separatorCell.setPaddingBottom(5);
            booksTable.addCell(separatorCell);
        }

        PdfPCell tableCell = new PdfPCell(booksTable);
        tableCell.setBorder(0);
        tableCell.setPaddingBottom(20);
        table.addCell(tableCell);
    }

    private void addYearlyTopBooksSection(PdfPTable table, Map<Integer, List<Book>> booksByYear,
            String title, Font titleFont, Font yearFont, Font contentFont, Font ratingFont) throws Exception {
        PdfPCell titleCell = new PdfPCell(new Paragraph(title, titleFont));
        titleCell.setBorder(0);
        titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        titleCell.setPaddingBottom(20);
        table.addCell(titleCell);

        List<Integer> sortedYears = new ArrayList<>(booksByYear.keySet());
        sortedYears.sort((y1, y2) -> y2.compareTo(y1));

        for (Integer year : sortedYears) {
            PdfPCell yearCell = new PdfPCell(new Paragraph(year.toString(), yearFont));
            yearCell.setBorder(0);
            yearCell.setHorizontalAlignment(Element.ALIGN_LEFT);
            yearCell.setPaddingBottom(10);
            yearCell.setPaddingTop(20);
            yearCell.setPaddingLeft(10);
            table.addCell(yearCell);

            PdfPTable booksTable = new PdfPTable(2);
            booksTable.setWidthPercentage(95);
            booksTable.setWidths(new float[] { 0.8f, 0.2f });

            List<Book> yearBooks = booksByYear.get(year);
            for (Book book : yearBooks) {
                PdfPCell bookCell = new PdfPCell(new Paragraph(book.getTitle(), contentFont));
                bookCell.setBorder(0);
                bookCell.setPaddingBottom(10);
                bookCell.setPaddingTop(10);
                bookCell.setPaddingLeft(20);
                booksTable.addCell(bookCell);

                PdfPCell ratingCell = new PdfPCell(
                        new Paragraph(String.format("%.1f", book.getAverageRating()), ratingFont));
                ratingCell.setBorder(0);
                ratingCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                ratingCell.setPaddingBottom(10);
                ratingCell.setPaddingTop(10);
                booksTable.addCell(ratingCell);

                PdfPCell separatorCell = new PdfPCell();
                separatorCell.setColspan(2);
                separatorCell.setBorder(PdfPCell.BOTTOM);
                separatorCell.setBorderColor(new com.itextpdf.text.BaseColor(211, 211, 211));
                separatorCell.setPaddingBottom(5);
                booksTable.addCell(separatorCell);
            }

            PdfPCell tableCell = new PdfPCell(booksTable);
            tableCell.setBorder(0);
            tableCell.setPaddingBottom(20);
            table.addCell(tableCell);
        }
    }
}