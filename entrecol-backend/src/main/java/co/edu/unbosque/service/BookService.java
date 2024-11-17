package co.edu.unbosque.service;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import co.edu.unbosque.model.Author;
import co.edu.unbosque.model.Book;
import co.edu.unbosque.model.Language;
import co.edu.unbosque.model.Publisher;
import co.edu.unbosque.model.Rating;
import co.edu.unbosque.repository.AuthorRepository;
import co.edu.unbosque.repository.BookRepository;
import co.edu.unbosque.repository.LanguageRepository;
import co.edu.unbosque.repository.PublisherRepository;

@Service
public class BookService {
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;
    private final LanguageRepository languageRepository;
    private final JdbcTemplate jdbcTemplate;
    private final SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");
    private static final int BATCH_SIZE = 500;

    private final RowMapper<IdMapping> idMapper = (rs, rowNum) -> new IdMapping(rs.getLong("id"), rs.getString("name"));
    private final RowMapper<BookIdMapping> bookIdMapper = (rs, rowNum) -> new BookIdMapping(rs.getLong("id"),
            rs.getLong("original_id"));

    public BookService(BookRepository bookRepository, AuthorRepository authorRepository,
            PublisherRepository publisherRepository, LanguageRepository languageRepository, JdbcTemplate jdbcTemplate) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
        this.languageRepository = languageRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll(Sort.by(Sort.Direction.ASC, "title"));
    }

    public Optional<Book> getBookById(Long id) {
        return bookRepository.findById(id);
    }

    public List<Book> getTopNBooks(int n) {
        return bookRepository.findTopNByRating(PageRequest.of(0, n));
    }

    public List<Book> getTopAndBottomBooksByYear(int year) {
        List<Book> topBooks = bookRepository.findTopBooksByYear(year, PageRequest.of(0, 5));
        List<Book> bottomBooks = bookRepository.findBottomBooksByYear(year, PageRequest.of(0, 5));
        topBooks.addAll(bottomBooks);
        return topBooks;
    }

    public Map<Integer, Long> getBookPublicationFrequency(Date startDate, Date endDate) {
        List<Object[]> results = bookRepository.getBookCountByYear(startDate, endDate);
        return results.stream()
                .collect(Collectors.toMap(row -> ((Number) row[0]).intValue(), row -> ((Number) row[1]).longValue()));
    }

    public Page<Book> searchBooks(String title, Long authorId, Long publisherId, Long languageId, int page, int size) {
        return bookRepository.searchBooks(title, authorId, publisherId, languageId, PageRequest.of(page, size));
    }

    @Transactional
    public int processBookUpload(List<Map<String, Object>> booksData) {
        clearExistingData();

        Set<String> uniqueLanguages = new HashSet<>();
        Map<String, Long> languageCodeToId = new HashMap<>();
        for (Map<String, Object> bookData : booksData) {
            uniqueLanguages.add((String) bookData.get("language_code"));
        }

        List<Language> existingLanguages = languageRepository.findAll();
        for (Language lang : existingLanguages) {
            languageCodeToId.put(lang.getCode(), lang.getId());
            uniqueLanguages.remove(lang.getCode());
        }

        if (!uniqueLanguages.isEmpty()) {
            batchInsertLanguages(uniqueLanguages, languageCodeToId);
        }

        Set<String> uniquePublishers = new HashSet<>();
        Map<String, Long> publisherNameToId = new HashMap<>();
        for (Map<String, Object> bookData : booksData) {
            uniquePublishers.add((String) bookData.get("publisher"));
        }

        List<Publisher> existingPublishers = publisherRepository.findAll();
        for (Publisher pub : existingPublishers) {
            publisherNameToId.put(pub.getName(), pub.getId());
            uniquePublishers.remove(pub.getName());
        }

        if (!uniquePublishers.isEmpty()) {
            batchInsertPublishers(uniquePublishers, publisherNameToId);
        }

        Set<String> uniqueAuthors = new HashSet<>();
        Map<String, Long> authorNameToId = new HashMap<>();
        for (Map<String, Object> bookData : booksData) {
            String[] authors = ((String) bookData.get("authors")).split("/");
            for (String author : authors) {
                uniqueAuthors.add(author.trim());
            }
        }

        List<Author> existingAuthors = authorRepository.findAll();
        for (Author author : existingAuthors) {
            authorNameToId.put(author.getName(), author.getId());
            uniqueAuthors.remove(author.getName());
        }

        if (!uniqueAuthors.isEmpty()) {
            batchInsertAuthors(uniqueAuthors, authorNameToId);
        }

        List<Object[]> bookBatch = new ArrayList<>();
        int processedBooks = 0;

        for (Map<String, Object> bookData : booksData) {
            try {
                Date publicationDate = dateFormat.parse((String) bookData.get("publication_date"));
                bookBatch.add(new Object[] {
                        Long.parseLong(bookData.get("bookID").toString()),
                        bookData.get("title"),
                        bookData.get("isbn"),
                        bookData.get("isbn13"),
                        Integer.parseInt(bookData.get("num_pages").toString()),
                        Double.parseDouble(bookData.get("average_rating").toString()),
                        new Date(publicationDate.getTime()),
                        languageCodeToId.get(bookData.get("language_code")),
                        publisherNameToId.get(bookData.get("publisher"))
                });

                if (bookBatch.size() >= BATCH_SIZE) {
                    processedBooks += processBatch(bookBatch, bookData, authorNameToId);
                    bookBatch.clear();
                }
            } catch (Exception e) {
                continue;
            }
        }

        if (!bookBatch.isEmpty()) {
            processedBooks += processBatch(bookBatch, booksData.get(booksData.size() - 1), authorNameToId);
        }

        return processedBooks;
    }

    private void batchInsertLanguages(Set<String> languages, Map<String, Long> languageCodeToId) {
        if (languages.isEmpty())
            return;

        String existingSql = "SELECT id, code as name FROM language WHERE code IN ("
                + String.join(",", Collections.nCopies(languages.size(), "?")) + ")";
        List<IdMapping> existingLanguages = jdbcTemplate.query(existingSql, idMapper, languages.toArray());

        for (IdMapping lang : existingLanguages) {
            languageCodeToId.put(lang.name(), lang.id());
            languages.remove(lang.name());
        }

        if (!languages.isEmpty()) {
            String sql = "INSERT IGNORE INTO language (code) VALUES (?)";
            List<Object[]> batch = new ArrayList<>();
            for (String code : languages) {
                batch.add(new Object[] { code });
            }
            jdbcTemplate.batchUpdate(sql, batch);

            String getIdsSql = "SELECT id, code as name FROM language WHERE code IN ("
                    + String.join(",", Collections.nCopies(languages.size(), "?")) + ")";
            List<IdMapping> newLanguages = jdbcTemplate.query(getIdsSql, idMapper, languages.toArray());
            for (IdMapping lang : newLanguages) {
                languageCodeToId.put(lang.name(), lang.id());
            }
        }
    }

    private void batchInsertPublishers(Set<String> publishers, Map<String, Long> publisherNameToId) {
        if (publishers.isEmpty())
            return;

        String existingSql = "SELECT id, name FROM publisher WHERE name IN ("
                + String.join(",", Collections.nCopies(publishers.size(), "?")) + ")";
        List<IdMapping> existingPublishers = jdbcTemplate.query(existingSql, idMapper, publishers.toArray());

        for (IdMapping pub : existingPublishers) {
            publisherNameToId.put(pub.name(), pub.id());
            publishers.remove(pub.name());
        }

        if (!publishers.isEmpty()) {
            String sql = "INSERT IGNORE INTO publisher (name) VALUES (?)";
            List<Object[]> batch = new ArrayList<>();
            for (String name : publishers) {
                batch.add(new Object[] { name });
            }
            jdbcTemplate.batchUpdate(sql, batch);

            String getIdsSql = "SELECT id, name FROM publisher WHERE name IN ("
                    + String.join(",", Collections.nCopies(publishers.size(), "?")) + ")";
            List<IdMapping> newPublishers = jdbcTemplate.query(getIdsSql, idMapper, publishers.toArray());
            for (IdMapping pub : newPublishers) {
                publisherNameToId.put(pub.name(), pub.id());
            }
        }
    }

    private void batchInsertAuthors(Set<String> authors, Map<String, Long> authorNameToId) {
        if (authors.isEmpty())
            return;

        String existingSql = "SELECT id, name FROM author WHERE name IN ("
                + String.join(",", Collections.nCopies(authors.size(), "?")) + ")";
        List<IdMapping> existingAuthors = jdbcTemplate.query(existingSql, idMapper, authors.toArray());

        for (IdMapping author : existingAuthors) {
            authorNameToId.put(author.name(), author.id());
            authors.remove(author.name());
        }

        if (!authors.isEmpty()) {
            String sql = "INSERT IGNORE INTO author (name) VALUES (?)";
            List<Object[]> batch = new ArrayList<>();
            for (String name : authors) {
                batch.add(new Object[] { name });
            }
            jdbcTemplate.batchUpdate(sql, batch);

            String getIdsSql = "SELECT id, name FROM author WHERE name IN ("
                    + String.join(",", Collections.nCopies(authors.size(), "?")) + ")";
            List<IdMapping> newAuthors = jdbcTemplate.query(getIdsSql, idMapper, authors.toArray());
            for (IdMapping author : newAuthors) {
                authorNameToId.put(author.name(), author.id());
            }
        }
    }

    private int processBatch(List<Object[]> bookBatch, Map<String, Object> bookData, Map<String, Long> authorNameToId) {
        String bookSql = "INSERT INTO book (original_id, title, isbn, isbn13, num_pages, average_rating, publication_date, language_id, publisher_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        int[] results = jdbcTemplate.batchUpdate(bookSql, bookBatch);

        String getBookIdsSql = "SELECT id, original_id FROM book WHERE original_id IN ("
                + String.join(",", Collections.nCopies(bookBatch.size(), "?")) + ")";

        List<BookIdMapping> newBooks = jdbcTemplate.query(getBookIdsSql, bookIdMapper,
                bookBatch.stream().map(b -> b[0]).toArray());

        List<Object[]> ratingBatch = new ArrayList<>();
        List<Object[]> bookAuthorBatch = new ArrayList<>();

        for (BookIdMapping book : newBooks) {
            ratingBatch.add(new Object[] {
                    book.id(),
                    Integer.parseInt(bookData.get("ratings_count").toString()),
                    Integer.parseInt(bookData.get("text_reviews_count").toString())
            });

            String[] authors = ((String) bookData.get("authors")).split("/");
            for (String authorName : authors) {
                Long authorId = authorNameToId.get(authorName.trim());
                bookAuthorBatch.add(new Object[] { book.id(), authorId });
            }
        }

        String ratingSql = "INSERT INTO rating (book_id, ratings_count, text_reviews_count) VALUES (?, ?, ?)";
        String bookAuthorSql = "INSERT INTO book_author (book_id, author_id) VALUES (?, ?)";

        jdbcTemplate.batchUpdate(ratingSql, ratingBatch);
        jdbcTemplate.batchUpdate(bookAuthorSql, bookAuthorBatch);

        return results.length;
    }

    private void clearExistingData() {
        jdbcTemplate.execute("DELETE FROM book_author");
        jdbcTemplate.execute("DELETE FROM rating");
        jdbcTemplate.execute("DELETE FROM book");
        jdbcTemplate.execute("DELETE FROM author");
        jdbcTemplate.execute("DELETE FROM publisher");
        jdbcTemplate.execute("DELETE FROM language");
    }

    private record IdMapping(Long id, String name) {
    }

    private record BookIdMapping(Long id, Long originalId) {
    }

    @Transactional
    public Book createBook(Book book) {
        if (book.getOriginalId() == null) {
            book.setOriginalId(System.currentTimeMillis());
        }
        if (book.getAverageRating() == null) {
            book.setAverageRating(0.0);
        }

        if (book.getRating() == null) {
            Rating rating = new Rating();
            rating.setBook(book);
            rating.setRatingsCount(0);
            rating.setTextReviewsCount(0);
            book.setRating(rating);
        }

        return bookRepository.save(book);
    }

    @Transactional
    public Book updateBook(Book book) {
        Book existingBook = bookRepository.findById(book.getId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setOriginalId(existingBook.getOriginalId());

        if (existingBook.getRating() != null) {
            Rating existingRating = existingBook.getRating();
            if (book.getRating() == null) {
                book.setRating(existingRating);
            } else {
                book.getRating().setId(existingRating.getId());
                book.getRating().setBook(book);
            }
        } else if (book.getRating() == null) {
            Rating rating = new Rating();
            rating.setBook(book);
            rating.setRatingsCount(0);
            rating.setTextReviewsCount(0);
            book.setRating(rating);
        }

        return bookRepository.save(book);
    }

    @Transactional
    public void deleteBook(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        book.setAuthors(new HashSet<>());

        book.removeRating();

        bookRepository.delete(book);
    }
}
