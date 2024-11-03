import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Book } from '@app/features/books/models/book.model';
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
  private readonly apiUrl = `${environment.apiUrl}/api/books`;
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);

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
        this.snackBar.open('Error al cargar los libros', 'Cerrar');
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
        next: ({ processedCount }) => {
          this.snackBar.open(
            `${processedCount} libros subidos exitosamente`,
            'Cerrar',
          );
          this.books.update((state) => ({ ...state, initialLoad: true }));
          this.getAll();
        },
        error: () => {
          this.books.update((state) => ({ ...state, loading: false }));
          this.snackBar.open('Error al subir los libros', 'Cerrar');
        },
      });
  }

  uploadBookFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const content = e.target?.result as string;
        const books = JSON.parse(content);
        this.uploadBooks(books);
      } catch {
        this.snackBar.open('El archivo JSON no es válido', 'Cerrar');
      }
    };

    reader.onerror = () => {
      this.snackBar.open('Error al leer el archivo', 'Cerrar');
    };

    reader.readAsText(file);
  }
}
