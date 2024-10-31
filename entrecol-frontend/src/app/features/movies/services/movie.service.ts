import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Movie } from '@app/features/movies/models/movie.model';
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
export class MovieService {
  private readonly apiUrl = `${environment.apiUrl}/movies`;
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(SnackBarService);

  readonly movies = signal<State<Movie[]>>({
    data: [],
    loading: false,
    initialLoad: true,
  });
  readonly uploading = signal(false);

  getAll(): void {
    this.movies.update((state) => ({ ...state, loading: true }));
    this.http.get<Movie[]>(this.apiUrl).subscribe({
      next: (movies) => {
        this.movies.set({
          data: movies,
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
      .post<{
        message: string;
        processedCount: number;
      }>(`${this.apiUrl}/upload`, movies)
      .pipe(finalize(() => this.uploading.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.success('Películas subidas exitosamente');
          this.movies.update((state) => ({ ...state, initialLoad: true }));
          this.getAll();
        },
        error: () => {
          this.movies.update((state) => ({ ...state, loading: false }));
          this.snackBar.error('Error al subir las películas');
        },
      });
  }

  uploadMovieFile(file: File): void {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const movies = this.parseMovieData(content);
        this.uploadMovies(movies);
      } catch {
        this.snackBar.error('Error al procesar el archivo');
      }
    };

    reader.onerror = () => {
      this.snackBar.error('Error al leer el archivo');
    };

    reader.readAsText(file);
  }

  private parseMovieData(content: string): Movie[] {
    return content
      .split('\n')
      .filter((line) => line.trim())
      .map((line) => {
        const [id, title, genresStr] = line.split('::');
        const genres = genresStr.split('|').map((name) => ({ name }));
        const yearMatch = title.match(/\((\d{4})\)/);
        const year = yearMatch ? parseInt(yearMatch[1]) : null;
        const cleanTitle = title.replace(/\(\d{4}\)/, '').trim();

        return {
          originalId: parseInt(id),
          title: cleanTitle,
          releaseYear: year,
          genres,
        };
      });
  }
}
