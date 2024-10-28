package co.edu.unbosque.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import co.edu.unbosque.model.Movie;

public interface MovieRepository extends JpaRepository<Movie, Long> {
    boolean existsByOriginalId(Long originalId);

    @Query("SELECT m FROM Movie m WHERE " +
            "(:title IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
            "(:year IS NULL OR m.releaseYear = :year) AND " +
            "(:genreId IS NULL OR :genreId IN (SELECT g.id FROM m.genres g))")
    Page<Movie> searchMovies(
            @Param("title") String title,
            @Param("year") Integer year,
            @Param("genreId") Long genreId,
            Pageable pageable);

    @Query("SELECT DISTINCT m.releaseYear FROM Movie m ORDER BY m.releaseYear DESC")
    List<Integer> findAllYears();
}
