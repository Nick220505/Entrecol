package co.edu.unbosque.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import co.edu.unbosque.model.Book;
import co.edu.unbosque.service.BookService;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping
    public ResponseEntity<List<Book>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Book> getBookById(@PathVariable Long id) {
        return bookService.getBookById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/top/{n}")
    public ResponseEntity<List<Book>> getTopNBooks(@PathVariable int n) {
        return ResponseEntity.ok(bookService.getTopNBooks(n));
    }

    @GetMapping("/year/{year}/top-bottom")
    public ResponseEntity<List<Book>> getTopAndBottomBooksByYear(@PathVariable int year) {
        return ResponseEntity.ok(bookService.getTopAndBottomBooksByYear(year));
    }

    @GetMapping("/publication-frequency")
    public ResponseEntity<Map<Integer, Long>> getBookPublicationFrequency(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date startDate,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") Date endDate) {
        return ResponseEntity.ok(bookService.getBookPublicationFrequency(startDate, endDate));
    }

    @PostMapping("/upload")
    public ResponseEntity<Map<String, Object>> uploadBooks(@RequestBody List<Map<String, Object>> booksData) {
        try {
            int processedBooks = bookService.processBookUpload(booksData);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Successfully processed " + processedBooks + " books");
            response.put("processedCount", processedBooks);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("error", "Failed to process books: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
