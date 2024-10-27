package co.edu.unbosque.service;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
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

    private final SimpleDateFormat dateFormat = new SimpleDateFormat("MM/dd/yyyy");

    public BookService(
            BookRepository bookRepository,
            AuthorRepository authorRepository,
            PublisherRepository publisherRepository,
            LanguageRepository languageRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
        this.publisherRepository = publisherRepository;
        this.languageRepository = languageRepository;
    }

    public Page<Book> getAllBooks(int page, int size) {
        return bookRepository.findAll(PageRequest.of(page, size));
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
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).intValue(),
                        row -> ((Number) row[1]).longValue()));
    }

    public Page<Book> searchBooks(String title, Long authorId, Long publisherId, Long languageId, int page, int size) {
        return bookRepository.searchBooks(title, authorId, publisherId, languageId, PageRequest.of(page, size));
    }

    @Transactional
    public int processBookUpload(List<Map<String, Object>> booksData) {
        int processedBooks = 0;

        for (Map<String, Object> bookData : booksData) {
            try {
                Book book = new Book();
                book.setOriginalId(Long.parseLong(bookData.get("bookID").toString()));
                book.setTitle((String) bookData.get("title"));
                book.setIsbn((String) bookData.get("isbn"));
                book.setIsbn13((String) bookData.get("isbn13"));
                book.setNumPages(Integer.parseInt(bookData.get("num_pages").toString()));
                book.setAverageRating(Double.parseDouble(bookData.get("average_rating").toString()));

                String publicationDateStr = (String) bookData.get("publication_date");
                book.setPublicationDate(dateFormat.parse(publicationDateStr));

                Language language = languageRepository.findByCode((String) bookData.get("language_code"))
                        .orElseGet(() -> {
                            Language newLanguage = new Language();
                            newLanguage.setCode((String) bookData.get("language_code"));
                            return languageRepository.save(newLanguage);
                        });
                book.setLanguage(language);

                Publisher publisher = publisherRepository.findByName((String) bookData.get("publisher"))
                        .orElseGet(() -> {
                            Publisher newPublisher = new Publisher();
                            newPublisher.setName((String) bookData.get("publisher"));
                            return publisherRepository.save(newPublisher);
                        });
                book.setPublisher(publisher);

                Set<Author> authors = new HashSet<>();
                String[] authorNames = ((String) bookData.get("authors")).split("/");
                for (String authorName : authorNames) {
                    String trimmedName = authorName.trim();
                    Author author = authorRepository.findByName(trimmedName)
                            .orElseGet(() -> {
                                Author newAuthor = new Author();
                                newAuthor.setName(trimmedName);
                                return authorRepository.save(newAuthor);
                            });
                    authors.add(author);
                }
                book.setAuthors(authors);

                Rating rating = new Rating();
                rating.setBook(book);
                rating.setRatingsCount(((Number) bookData.get("ratings_count")).intValue());
                rating.setTextReviewsCount(((Number) bookData.get("text_reviews_count")).intValue());
                book.setRating(rating);

                bookRepository.save(book);
                processedBooks++;

            } catch (Exception e) {
                throw new RuntimeException("Error processing book: " + e.getMessage(), e);
            }
        }

        return processedBooks;
    }

}
