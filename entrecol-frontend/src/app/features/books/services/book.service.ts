import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Book } from '@app/features/books/models/book.model';
import { Author } from '@books/models/author.model';
import { Language } from '@books/models/language.model';
import { Publisher } from '@books/models/publisher.model';
import { environment } from '@env';
import { finalize } from 'rxjs';

interface State<T> {
  data: T;
  loading: boolean;
  initialLoad: boolean;
}

interface BookFormData {
  title: string;
  isbn?: string;
  isbn13?: string;
  numPages?: number;
  averageRating?: number;
  publicationDate?: Date;
  languageId?: number;
  publisherId?: number;
  authorIds?: number[];
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly apiUrl = `${environment.apiUrl}/books`;

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
  readonly creating = signal(false);
  readonly updating = signal(false);
  readonly deleting = signal(false);

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

  create(bookData: BookFormData): void {
    this.creating.set(true);
    const book = this.transformBookData(bookData);

    this.http
      .post<Book>(`${this.apiUrl}`, book)
      .pipe(finalize(() => this.creating.set(false)))
      .subscribe({
        next: (newBook) => {
          this.books.update((state) => ({
            ...state,
            data: [...state.data, newBook],
          }));
          this.snackBar.open('Libro creado exitosamente', 'Cerrar');
        },
        error: () => {
          this.snackBar.open('Error al crear el libro', 'Cerrar');
        },
      });
  }

  private transformBookData(bookData: BookFormData): Partial<Book> {
    return {
      title: bookData.title,
      isbn: bookData.isbn,
      isbn13: bookData.isbn13,
      numPages: bookData.numPages,
      averageRating: bookData.averageRating,
      publicationDate: bookData.publicationDate,
      language: bookData.languageId
        ? ({ id: bookData.languageId } as Language)
        : undefined,
      publisher: bookData.publisherId
        ? ({ id: bookData.publisherId } as Publisher)
        : undefined,
      authors: bookData.authorIds?.map((id) => ({ id }) as Author) || [],
    };
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

  update(id: number, bookData: BookFormData): void {
    this.updating.set(true);
    const book = this.transformBookData(bookData);

    this.http
      .put<Book>(`${this.apiUrl}/${id}`, book)
      .pipe(finalize(() => this.updating.set(false)))
      .subscribe({
        next: (updatedBook) => {
          this.books.update((state) => ({
            ...state,
            data: state.data.map((b) => (b.id === id ? updatedBook : b)),
          }));
          this.snackBar.open('Libro actualizado exitosamente', 'Cerrar');
        },
        error: () => {
          this.snackBar.open('Error al actualizar el libro', 'Cerrar');
        },
      });
  }

  delete(id: number): void {
    this.deleting.set(true);
    this.http
      .delete(`${this.apiUrl}/${id}`)
      .pipe(finalize(() => this.deleting.set(false)))
      .subscribe({
        next: () => {
          this.books.update((state) => ({
            ...state,
            data: state.data.filter((b) => b.id !== id),
          }));
          this.snackBar.open('Libro eliminado exitosamente', 'Cerrar');
        },
        error: () => {
          this.snackBar.open('Error al eliminar el libro', 'Cerrar');
        },
      });
  }
}
