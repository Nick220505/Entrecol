package co.edu.unbosque.dto;

import java.util.List;
import java.util.Map;

import co.edu.unbosque.model.Book;
import co.edu.unbosque.model.Movie;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
@Getter
@Setter
public class EntertainmentReportDTO {
    private List<Movie> moviesByGenre;
    private List<Book> topRatedBooks;
    private List<Book> bottomRatedBooks;
    private Map<Integer, List<Book>> topAndBottomBooksByYear;
    private Map<Integer, List<Movie>> moviesGroupedByGenreCount;
    private Long totalMovies;
    private Map<String, Long> moviesByGenreStats;
    private Map<Integer, Long> bookPublicationStats;
}