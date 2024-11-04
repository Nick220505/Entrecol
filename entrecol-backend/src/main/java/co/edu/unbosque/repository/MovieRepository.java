package co.edu.unbosque.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import co.edu.unbosque.model.Movie;

public interface MovieRepository extends JpaRepository<Movie, Long> {
        boolean existsByOriginalId(Long originalId);

        @Query("SELECT m FROM Movie m WHERE m.releaseYear BETWEEN YEAR(:startDate) AND YEAR(:endDate)")
        List<Movie> findMoviesByYearRange(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

        @Query("SELECT m FROM Movie m JOIN m.genres g WHERE SIZE(m.genres) = :genreCount AND m.releaseYear BETWEEN YEAR(:startDate) AND YEAR(:endDate)")
        List<Movie> findMoviesByGenreCount(@Param("genreCount") int genreCount, @Param("startDate") Date startDate,
                        @Param("endDate") Date endDate);

        @Query("SELECT g.name, COUNT(m) FROM Movie m JOIN m.genres g WHERE m.releaseYear BETWEEN YEAR(:startDate) AND YEAR(:endDate) GROUP BY g.name")
        List<Object[]> getMovieCountByGenre(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
}
