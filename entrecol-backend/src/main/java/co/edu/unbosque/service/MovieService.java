package co.edu.unbosque.service;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.edu.unbosque.model.Genre;
import co.edu.unbosque.model.Movie;
import co.edu.unbosque.repository.GenreRepository;
import co.edu.unbosque.repository.MovieRepository;

@Service
public class MovieService {
    private final MovieRepository movieRepository;
    private final GenreRepository genreRepository;

    public MovieService(MovieRepository movieRepository, GenreRepository genreRepository) {
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
    }

    public Page<Movie> getAllMovies(int page, int size) {
        return movieRepository.findAll(PageRequest.of(page, size));
    }

    public Page<Movie> searchMovies(String title, Integer year, Long genreId, int page, int size) {
        return movieRepository.searchMovies(title, year, genreId, PageRequest.of(page, size));
    }

    public List<Integer> getAllYears() {
        return movieRepository.findAllYears();
    }

    @Transactional
    @SuppressWarnings("unchecked")
    public int processMovieUpload(List<Map<String, Object>> moviesData) {
        int processedMovies = 0;

        for (Map<String, Object> movieData : moviesData) {
            try {
                Long originalId = Long.valueOf(movieData.get("originalId").toString());
                if (movieRepository.existsByOriginalId(originalId)) {
                    continue;
                }

                Movie movie = new Movie();
                movie.setOriginalId(originalId);
                movie.setTitle(movieData.get("title").toString());
                movie.setReleaseYear(Integer.valueOf(movieData.get("releaseYear").toString()));

                Set<Genre> genres = new HashSet<>();
                List<Map<String, String>> genreList = (List<Map<String, String>>) movieData.get("genres");
                for (Map<String, String> genreData : genreList) {
                    String genreName = genreData.get("name");
                    Genre genre = genreRepository.findByName(genreName)
                            .orElseGet(() -> {
                                Genre newGenre = new Genre();
                                newGenre.setName(genreName);
                                return genreRepository.save(newGenre);
                            });
                    genres.add(genre);
                }
                movie.setGenres(genres);

                movieRepository.save(movie);
                processedMovies++;

            } catch (Exception e) {
                throw new RuntimeException("Error processing movie: " + e.getMessage() + ", Movie data: " + movieData);
            }
        }

        return processedMovies;
    }
}
