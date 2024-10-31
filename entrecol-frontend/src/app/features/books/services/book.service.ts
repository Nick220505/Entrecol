import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Book } from '@app/features/books/models/book.model';
import { SnackBarService } from '@core/services/snack-bar.service';
import { environment } from '@env';
import { finalize } from 'rxjs';

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
      .post<{
        message: string;
        processedCount: number;
      }>(`${this.apiUrl}/upload`, books)
      .pipe(finalize(() => this.uploading.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.success('Libros subidos exitosamente');
          this.books.update((state) => ({ ...state, initialLoad: true }));
          this.getAll();
        },
        error: () => {
          this.books.update((state) => ({ ...state, loading: false }));
          this.snackBar.error('Error al subir los libros');
        },
      });
  }

  uploadBookFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const books = JSON.parse(content);
        this.uploadBooks(books);
      } catch {
        this.snackBar.error('El archivo JSON no es válido');
      }
    };

    reader.onerror = () => {
      this.snackBar.error('Error al leer el archivo');
    };

    reader.readAsText(file);
  }
}
