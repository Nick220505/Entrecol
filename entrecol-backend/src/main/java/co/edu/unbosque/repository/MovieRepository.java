package co.edu.unbosque.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import co.edu.unbosque.model.Movie;

public interface MovieRepository extends JpaRepository<Movie, Long> {
        boolean existsByOriginalId(Long originalId);

        @Query("SELECT m FROM Movie m WHERE m.releaseYear BETWEEN :startYear AND :endYear")
        List<Movie> findMoviesByYearRange(@Param("startYear") int startYear, @Param("endYear") int endYear);

        @Query("SELECT DISTINCT m FROM Movie m JOIN m.genres g GROUP BY m HAVING COUNT(g) = :genreCount")
        List<Movie> findMoviesByGenreCount(@Param("genreCount") int genreCount);

        @Query("SELECT g.name as name, COUNT(DISTINCT m) as count FROM Movie m JOIN m.genres g GROUP BY g.name")
        List<Object[]> getMovieCountByGenre();
}
