import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { SnackBarService } from '@core/services/snack-bar.service';
import { environment } from '@env';
import { Movie } from '../models/movie.model';

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
export class MoviesService {
  private readonly apiUrl = `${environment.apiUrl}/movies`;
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(SnackBarService);

  readonly movie = signal<State<Movie | null>>({
    data: null,
    loading: false,
    initialLoad: true,
  });

  readonly movies = signal<State<Movie[]>>({
    data: [],
    loading: false,
    initialLoad: true,
  });
  readonly uploading = signal(false);

  getAll(page = 0, size = 10): void {
    this.movies.update((state) => ({ ...state, loading: true }));
    this.http
      .get<PaginatedResponse<Movie>>(`${this.apiUrl}?page=${page}&size=${size}`)
      .subscribe({
        next: (response) => {
          this.movies.set({
            data: response.content,
            loading: false,
            initialLoad: false,
          });
        },
        error: () => {
          this.movies.update((state) => ({ ...state, loading: false }));
          this.snackBar.error('Error al cargar las películas');
        },
      });
  }

  uploadMovies(movies: Movie[]): void {
    this.uploading.set(true);
    this.movies.update((state) => ({ ...state, loading: true }));
    this.http
      .post<{ message: string; processedCount: number }>(
        `${this.apiUrl}/upload`,
        movies
      )
      .subscribe({
        next: () => {
          this.movies.update((state) => ({ ...state, loading: false }));
          this.snackBar.success('Películas cargadas exitosamente');
          this.getAll();
        },
        error: () => {
          this.movies.update((state) => ({ ...state, loading: false }));
          this.uploading.set(false);
          this.snackBar.error('Error al cargar las películas');
        },
      });
  }
}
