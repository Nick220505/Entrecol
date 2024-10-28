import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { SnackBarService } from '@core/services/snack-bar.service';
import { environment } from '@env';
import { Book } from '../models/book.model';

interface PaginatedResponse<T> {
  content: T[];
  currentPage: number;
  totalItems: number;
  totalPages: number;
}

interface State<T> {
  data: T;
  loading: boolean;
  initialLoad: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private readonly apiUrl = `${environment.apiUrl}/books`;
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(SnackBarService);

  readonly book = signal<State<Book | null>>({
    data: null,
    loading: false,
    initialLoad: true,
  });

  readonly books = signal<State<Book[]>>({
    data: [],
    loading: false,
    initialLoad: true,
  });
  readonly uploading = signal(false);

  getAll(page = 0, size = 10): void {
    this.books.update((state) => ({ ...state, loading: true }));
    this.http
      .get<PaginatedResponse<Book>>(`${this.apiUrl}?page=${page}&size=${size}`)
      .subscribe({
        next: (response) => {
          this.books.set({
            data: response.content,
            loading: false,
            initialLoad: false,
          });
        },
        error: () => {
          this.books.update((state) => ({ ...state, loading: false }));
          this.snackBar.error('Error al cargar los libros');
        },
      });
  }

  getById(id: number): void {
    this.book.update((state) => ({ ...state, loading: true }));
    this.http.get<Book>(`${this.apiUrl}/${id}`).subscribe({
      next: (book) => {
        this.book.set({
          data: book,
          loading: false,
          initialLoad: false,
        });
      },
      error: () => {
        this.book.update((state) => ({ ...state, loading: false }));
        this.snackBar.error('Error al cargar el libro');
      },
    });
  }

  uploadBooks(books: Book[]): void {
    this.uploading.set(true);
    this.books.update((state) => ({ ...state, loading: true }));
    this.http
      .post<{ message: string; processedCount: number }>(
        `${this.apiUrl}/upload`,
        books
      )
      .subscribe({
        next: () => {
          this.uploading.set(false);
          this.snackBar.success('Libros cargados exitosamente');
          this.getAll();
        },
        error: () => {
          this.books.update((state) => ({ ...state, loading: false }));
          this.uploading.set(false);
          this.snackBar.error('Error al cargar los libros');
        },
      });
  }
}
