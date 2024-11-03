package co.edu.unbosque.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import co.edu.unbosque.model.Book;

public interface BookRepository extends JpaRepository<Book, Long> {
        @Query("SELECT b FROM Book b ORDER BY b.averageRating DESC")
        List<Book> findTopNByRating(Pageable pageable);

        @Query("SELECT b FROM Book b WHERE YEAR(b.publicationDate) = :year ORDER BY b.averageRating DESC")
        List<Book> findTopBooksByYear(@Param("year") int year, Pageable pageable);

        @Query("SELECT b FROM Book b WHERE YEAR(b.publicationDate) = :year ORDER BY b.averageRating ASC")
        List<Book> findBottomBooksByYear(@Param("year") int year, Pageable pageable);

        @Query("SELECT YEAR(b.publicationDate) as year, COUNT(b) as count FROM Book b " +
                        "WHERE b.publicationDate BETWEEN :startDate AND :endDate " +
                        "GROUP BY YEAR(b.publicationDate) ORDER BY year")
        List<Object[]> getBookCountByYear(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
}
