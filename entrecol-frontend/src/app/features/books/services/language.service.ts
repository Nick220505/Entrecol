import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Language } from '@books/models/language.model';
import { environment } from '@env';
import { LoadingState } from '@shared/models/loading-state.model';
import { catchError, finalize, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly apiUrl = `${environment.apiUrl}/languages`;

  private readonly loadingState = signal<LoadingState<Language[]>>({
    data: [],
    loading: false,
    initialLoad: true,
  });

  private readonly creatingSignal = signal(false);
  private readonly updatingSignal = signal(false);
  private readonly deletingSignal = signal(false);

  readonly languages = computed(() => this.loadingState());
  readonly creating = computed(() => this.creatingSignal());
  readonly updating = computed(() => this.updatingSignal());
  readonly deleting = computed(() => this.deletingSignal());

  getAll(): void {
    this.loadingState.update((state) => ({ ...state, loading: true }));
    this.http
      .get<Language[]>(this.apiUrl)
      .pipe(
        catchError((error) => this.handleError(error)),
        finalize(() =>
          this.loadingState.update((state) => ({ ...state, loading: false })),
        ),
      )
      .subscribe({
        next: (languages) =>
          this.loadingState.update((state) => ({
            ...state,
            data: languages,
            initialLoad: false,
          })),
        error: () =>
          this.loadingState.update((state) => ({
            ...state,
            data: [],
            initialLoad: false,
          })),
      });
  }

  create(language: Partial<Language>): void {
    this.creatingSignal.set(true);
    this.http
      .post<Language>(this.apiUrl, language)
      .pipe(
        catchError((error) => this.handleError(error)),
        finalize(() => this.creatingSignal.set(false)),
      )
      .subscribe({
        next: () => {
          this.getAll();
          this.snackBar.open('Idioma creado exitosamente', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }

  update(id: number, language: Partial<Language>): void {
    this.updatingSignal.set(true);
    this.http
      .put<Language>(`${this.apiUrl}/${id}`, language)
      .pipe(
        catchError((error) => this.handleError(error)),
        finalize(() => this.updatingSignal.set(false)),
      )
      .subscribe({
        next: () => {
          this.getAll();
          this.snackBar.open('Idioma actualizado exitosamente', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }

  delete(id: number): void {
    this.deletingSignal.set(true);
    this.http
      .delete(`${this.apiUrl}/${id}`)
      .pipe(
        catchError((error) => this.handleError(error)),
        finalize(() => this.deletingSignal.set(false)),
      )
      .subscribe({
        next: () => {
          this.getAll();
          this.snackBar.open('Idioma eliminado exitosamente', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ha ocurrido un error';

    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      if (error.status === 404) {
        errorMessage = 'El idioma no fue encontrado';
      } else if (error.status === 400) {
        errorMessage = 'Datos inválidos';
      } else if (error.status === 409) {
        errorMessage = 'El código del idioma ya existe';
      }
    }

    this.snackBar.open(errorMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });

    return throwError(() => new Error(errorMessage));
  }
}
