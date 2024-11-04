package co.edu.unbosque.service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
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
import com.itextpdf.text.DocumentException;
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
            List<Book> bottomBooks = bookRepository.findBottomNByRating(
                    PageRequest.of(0, topN, Sort.by(topRatedDirection, "title")));
            report.setTopRatedBooks(topBooks != null ? topBooks : new ArrayList<>());
            report.setBottomRatedBooks(bottomBooks != null ? bottomBooks : new ArrayList<>());

            Map<Integer, List<Book>> booksByYear = new HashMap<>();
            List<Integer> years = new ArrayList<>();
            for (int year = startYear; year <= endYear; year++) {
                List<Book> yearTopBooks = bookRepository.findTopBooksByYear(year,
                        PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "averageRating")));
                List<Book> yearBottomBooks = bookRepository.findBottomBooksByYear(year,
                        PageRequest.of(0, 5, Sort.by(Sort.Direction.ASC, "averageRating")));
                if (yearTopBooks != null) {
                    if (yearBottomBooks != null) {
                        yearTopBooks.addAll(yearBottomBooks);
                    }
                    booksByYear.put(year, yearTopBooks);
                    years.add(year);
                }
            }

            if (topBottomBooksByYearAscending) {
                years.sort(Integer::compareTo);
            } else {
                years.sort((y1, y2) -> y2.compareTo(y1));
            }

            Map<Integer, List<Book>> sortedBooksByYear = new LinkedHashMap<>();
            for (Integer year : years) {
                sortedBooksByYear.put(year, booksByYear.get(year));
            }
            report.setTopAndBottomBooksByYear(sortedBooksByYear);

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
            Map<String, Long> genreStatsMap = new LinkedHashMap<>();

            if (genreStats != null) {
                List<Object[]> sortedStats = new ArrayList<>(genreStats);
                if (moviesByGenreAscending) {
                    sortedStats.sort((a, b) -> ((String) a[0]).compareTo((String) b[0]));
                } else {
                    sortedStats.sort((a, b) -> ((String) b[0]).compareTo((String) a[0]));
                }

                for (Object[] row : sortedStats) {
                    genreStatsMap.put((String) row[0], (Long) row[1]);
                }
            }

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
            boolean moviesByGenreAscending, boolean topRatedBooksAscending,
            boolean topBottomBooksByYearAscending, boolean moviesByGenreCountAscending) {
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

            EntertainmentReportDTO report = getEntertainmentReport(
                    startDate, endDate, topN, genreCount,
                    moviesByGenreAscending, topRatedBooksAscending,
                    topBottomBooksByYearAscending, moviesByGenreCountAscending);

            PdfPTable movieGenreTable = new PdfPTable(1);
            movieGenreTable.setWidthPercentage(100);
            JFreeChart movieGenreChart = createMovieGenreChart(report.getMoviesByGenreStats());
            addChartSection(movieGenreTable, "Películas por Género", movieGenreChart);
            document.add(movieGenreTable);
            document.newPage();

            PdfPTable bookPublicationTable = new PdfPTable(1);
            bookPublicationTable.setWidthPercentage(100);
            JFreeChart bookPublicationChart = createBookPublicationChart(report.getBookPublicationStats());
            addChartSection(bookPublicationTable, "Frecuencia de Publicación de Libros", bookPublicationChart);
            document.add(bookPublicationTable);
            document.newPage();

            PdfPTable topRatedTable = new PdfPTable(1);
            topRatedTable.setWidthPercentage(100);
            PdfPCell topRatedTitleCell = new PdfPCell(new Paragraph(
                    String.format("Top %d Libros con Mejor Rating", topN), sectionTitleFont));
            topRatedTitleCell.setBorder(0);
            topRatedTitleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            topRatedTitleCell.setPaddingBottom(20);
            topRatedTable.addCell(topRatedTitleCell);

            addBooksToTable(topRatedTable, report.getTopRatedBooks(), contentFont, ratingFont);
            document.add(topRatedTable);
            document.newPage();

            PdfPTable yearlyBooksTable = new PdfPTable(1);
            yearlyBooksTable.setWidthPercentage(100);
            PdfPCell yearlyTitleCell = new PdfPCell(new Paragraph("Top 5 Libros por Año", sectionTitleFont));
            yearlyTitleCell.setBorder(0);
            yearlyTitleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            yearlyTitleCell.setPaddingBottom(20);
            yearlyBooksTable.addCell(yearlyTitleCell);

            List<Integer> sortedYears = new ArrayList<>(report.getTopAndBottomBooksByYear().keySet());
            if (topBottomBooksByYearAscending) {
                sortedYears.sort(Integer::compareTo);
            } else {
                sortedYears.sort((y1, y2) -> y2.compareTo(y1));
            }

            for (Integer year : sortedYears) {
                PdfPCell yearCell = new PdfPCell(new Paragraph(year.toString(), yearFont));
                yearCell.setBorder(0);
                yearCell.setPaddingTop(20);
                yearCell.setPaddingBottom(10);
                yearlyBooksTable.addCell(yearCell);

                List<Book> yearBooks = report.getTopAndBottomBooksByYear().get(year);
                int midPoint = yearBooks.size() / 2;

                PdfPCell topBooksTitle = new PdfPCell(new Paragraph("Mejor Rating", contentFont));
                topBooksTitle.setBorder(0);
                topBooksTitle.setPaddingBottom(10);
                yearlyBooksTable.addCell(topBooksTitle);
                addBooksToTable(yearlyBooksTable, yearBooks.subList(0, midPoint), contentFont, ratingFont);

                PdfPCell bottomBooksTitle = new PdfPCell(new Paragraph("Peor Rating", contentFont));
                bottomBooksTitle.setBorder(0);
                bottomBooksTitle.setPaddingTop(20);
                bottomBooksTitle.setPaddingBottom(10);
                yearlyBooksTable.addCell(bottomBooksTitle);
                addBooksToTable(yearlyBooksTable, yearBooks.subList(midPoint, yearBooks.size()), contentFont,
                        ratingFont);
            }
            document.add(yearlyBooksTable);
            document.newPage();

            PdfPTable moviesTable = new PdfPTable(1);
            moviesTable.setWidthPercentage(100);
            PdfPCell moviesTitleCell = new PdfPCell(
                    new Paragraph(String.format("Películas con %d Géneros", genreCount), sectionTitleFont));
            moviesTitleCell.setBorder(0);
            moviesTitleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
            moviesTitleCell.setPaddingBottom(20);
            moviesTable.addCell(moviesTitleCell);

            PdfPCell totalCell = new PdfPCell(
                    new Paragraph(String.format("Total: %d", report.getTotalMovies()), contentFont));
            totalCell.setBorder(0);
            totalCell.setPaddingBottom(10);
            moviesTable.addCell(totalCell);

            List<Movie> movies = report.getMoviesGroupedByGenreCount().get(genreCount);
            if (movies != null) {
                for (Movie movie : movies) {
                    PdfPCell movieCell = new PdfPCell(new Paragraph(movie.getTitle(), contentFont));
                    movieCell.setBorder(0);
                    movieCell.setPaddingBottom(5);
                    moviesTable.addCell(movieCell);

                    if (!movie.getGenres().isEmpty()) {
                        StringBuilder genres = new StringBuilder();
                        movie.getGenres().forEach(genre -> {
                            if (genres.length() > 0) {
                                genres.append(", ");
                            }
                            genres.append(genre.getName());
                        });
                        PdfPCell genresCell = new PdfPCell(new Paragraph(genres.toString(), contentFont));
                        genresCell.setBorder(0);
                        genresCell.setPaddingBottom(15);
                        genresCell.setPaddingLeft(20);
                        moviesTable.addCell(genresCell);
                    }
                }
            }
            document.add(moviesTable);

            document.close();
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

    private void addBooksToTable(PdfPTable table, List<Book> books, Font contentFont, Font ratingFont)
            throws DocumentException {
        try {
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
        } catch (DocumentException e) {
            throw new DocumentException("Error creating book table: " + e.getMessage());
        }
    }
}