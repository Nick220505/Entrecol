package co.edu.unbosque.service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
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
    private final JdbcTemplate jdbcTemplate;
    private static final int BATCH_SIZE = 500;

    private final RowMapper<GenreMapping> genreRowMapper = (rs, rowNum) -> new GenreMapping(rs.getLong("id"),
            rs.getString("name"));

    private final RowMapper<MovieMapping> movieRowMapper = (rs, rowNum) -> new MovieMapping(rs.getLong("id"),
            rs.getLong("original_id"));

    public MovieService(MovieRepository movieRepository, GenreRepository genreRepository, JdbcTemplate jdbcTemplate) {
        this.movieRepository = movieRepository;
        this.genreRepository = genreRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Movie> getAllMovies() {
        return movieRepository.findAll();
    }

    @Transactional
    @SuppressWarnings("unchecked")
    public int processMovieUpload(List<Map<String, Object>> moviesData) {
        Set<String> uniqueGenres = new HashSet<>();
        for (Map<String, Object> movieData : moviesData) {
            List<Map<String, String>> genreList = (List<Map<String, String>>) movieData.get("genres");
            for (Map<String, String> genreData : genreList) {
                uniqueGenres.add(genreData.get("name"));
            }
        }

        Map<String, Long> genreNameToId = new HashMap<>();
        List<Genre> existingGenres = genreRepository.findAll();
        for (Genre genre : existingGenres) {
            genreNameToId.put(genre.getName(), genre.getId());
            uniqueGenres.remove(genre.getName());
        }

        if (!uniqueGenres.isEmpty()) {
            String genreInsertSql = "INSERT INTO genre (name) VALUES (?)";
            List<Object[]> genreBatch = new ArrayList<>();
            for (String genreName : uniqueGenres) {
                genreBatch.add(new Object[] { genreName });
            }
            jdbcTemplate.batchUpdate(genreInsertSql, genreBatch);

            String getGenreIdsSql = "SELECT id, name FROM genre WHERE name IN (" +
                    String.join(",", Collections.nCopies(uniqueGenres.size(), "?")) + ")";
            List<GenreMapping> newGenres = jdbcTemplate.query(
                    getGenreIdsSql,
                    genreRowMapper,
                    uniqueGenres.toArray());
            for (GenreMapping genre : newGenres) {
                genreNameToId.put(genre.name(), genre.id());
            }
        }

        String movieInsertSql = "INSERT INTO movie (original_id, title, release_year) VALUES (?, ?, ?)";
        String movieGenreInsertSql = "INSERT INTO movie_genre (movie_id, genre_id) VALUES (?, ?)";

        List<Object[]> movieBatch = new ArrayList<>();
        int processedMovies = 0;

        for (Map<String, Object> movieData : moviesData) {
            Long originalId = Long.valueOf(movieData.get("originalId").toString());
            if (movieRepository.existsByOriginalId(originalId)) {
                continue;
            }

            movieBatch.add(new Object[] {
                    originalId,
                    movieData.get("title").toString(),
                    Integer.valueOf(movieData.get("releaseYear").toString())
            });

            if (movieBatch.size() >= BATCH_SIZE) {
                processedMovies += processBatch(movieBatch, movieInsertSql, movieGenreInsertSql,
                        movieData, genreNameToId);
                movieBatch.clear();
            }
        }

        if (!movieBatch.isEmpty()) {
            processedMovies += processBatch(movieBatch, movieInsertSql, movieGenreInsertSql,
                    moviesData.get(moviesData.size() - 1), genreNameToId);
        }

        return processedMovies;
    }

    private int processBatch(List<Object[]> movieBatch, String movieInsertSql,
            String movieGenreInsertSql, Map<String, Object> movieData,
            Map<String, Long> genreNameToId) {

        int[] results = jdbcTemplate.batchUpdate(movieInsertSql, movieBatch);

        String getMovieIdsSql = "SELECT id, original_id FROM movie WHERE original_id IN (" +
                String.join(",", Collections.nCopies(movieBatch.size(), "?")) + ")";

        List<Object[]> movieGenreBatch = new ArrayList<>();
        Map<Long, Long> originalIdToId = new HashMap<>();

        List<MovieMapping> newMovies = jdbcTemplate.query(
                getMovieIdsSql,
                movieRowMapper,
                movieBatch.stream().map(m -> m[0]).toArray());

        for (MovieMapping movie : newMovies) {
            originalIdToId.put(movie.originalId(), movie.id());
        }

        for (Object[] movie : movieBatch) {
            Long movieId = originalIdToId.get(Long.valueOf(movie[0].toString()));
            if (!(movieData.get("genres") instanceof List<?>)) {
                throw new IllegalArgumentException("Invalid genres data format");
            }
            @SuppressWarnings("unchecked")
            List<Map<String, String>> genreList = (List<Map<String, String>>) movieData.get("genres");
            for (Map<String, String> genreData : genreList) {
                Long genreId = genreNameToId.get(genreData.get("name"));
                movieGenreBatch.add(new Object[] { movieId, genreId });
            }
        }

        jdbcTemplate.batchUpdate(movieGenreInsertSql, movieGenreBatch);

        return results.length;
    }

    private record GenreMapping(Long id, String name) {
    }

    private record MovieMapping(Long id, Long originalId) {
    }
}
