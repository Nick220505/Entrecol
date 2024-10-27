package co.edu.unbosque.repository;

import java.util.Date;
import java.util.List;

import org.springframework.data.domain.Page;
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

        @Query("SELECT COUNT(b) FROM Book b WHERE b.publicationDate BETWEEN :startDate AND :endDate")
        Long countBooksByPublicationDateBetween(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

        @Query("SELECT YEAR(b.publicationDate) as year, COUNT(b) as count FROM Book b " +
                        "WHERE b.publicationDate BETWEEN :startDate AND :endDate " +
                        "GROUP BY YEAR(b.publicationDate) ORDER BY year")
        List<Object[]> getBookCountByYear(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

        @Query("SELECT b FROM Book b WHERE " +
                        "(:title IS NULL OR LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))) AND " +
                        "(:authorId IS NULL OR :authorId IN (SELECT a.id FROM b.authors a)) AND " +
                        "(:publisherId IS NULL OR b.publisher.id = :publisherId) AND " +
                        "(:languageId IS NULL OR b.language.id = :languageId)")
        Page<Book> searchBooks(
                        @Param("title") String title,
                        @Param("authorId") Long authorId,
                        @Param("publisherId") Long publisherId,
                        @Param("languageId") Long languageId,
                        Pageable pageable);
}
