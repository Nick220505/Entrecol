import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Book } from '@app/features/books/models/book.model';
import { SnackBarService } from '@core/services/snack-bar.service';
import { environment } from '@env';

interface State<T> {
  data: T;
  loading: boolean;
  initialLoad: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
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

  getAll(): void {
    this.books.update((state) => ({ ...state, loading: true }));
    this.http.get<Book[]>(this.apiUrl).subscribe({
      next: (books) => {
        this.books.set({
          data: books,
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

  uploadBooks(books: Book[]): void {
    this.uploading.set(true);
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
