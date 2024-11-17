import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Publisher } from '@books/models/publisher.model';
import { environment } from '@env';
import { LoadingState } from '@shared/models/loading-state.model';
import { catchError, finalize, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PublisherService {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly apiUrl = `${environment.apiUrl}/publishers`;

  private readonly loadingState = signal<LoadingState<Publisher[]>>({
    data: [],
    loading: false,
    initialLoad: true,
  });

  private readonly creatingSignal = signal(false);
  private readonly updatingSignal = signal(false);
  private readonly deletingSignal = signal(false);

  readonly publishers = computed(() => this.loadingState());
  readonly creating = computed(() => this.creatingSignal());
  readonly updating = computed(() => this.updatingSignal());
  readonly deleting = computed(() => this.deletingSignal());

  getAll(): void {
    this.loadingState.update((state) => ({ ...state, loading: true }));
    this.http
      .get<Publisher[]>(this.apiUrl)
      .pipe(
        catchError((error) => this.handleError(error)),
        finalize(() =>
          this.loadingState.update((state) => ({ ...state, loading: false })),
        ),
      )
      .subscribe({
        next: (publishers) =>
          this.loadingState.update((state) => ({
            ...state,
            data: publishers,
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

  create(publisher: Partial<Publisher>): void {
    this.creatingSignal.set(true);
    this.http
      .post<Publisher>(this.apiUrl, publisher)
      .pipe(
        catchError((error) => this.handleError(error)),
        finalize(() => this.creatingSignal.set(false)),
      )
      .subscribe({
        next: () => {
          this.getAll();
          this.snackBar.open('Editorial creada exitosamente', 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }

  update(id: number, publisher: Partial<Publisher>): void {
    this.updatingSignal.set(true);
    this.http
      .put<Publisher>(`${this.apiUrl}/${id}`, publisher)
      .pipe(
        catchError((error) => this.handleError(error)),
        finalize(() => this.updatingSignal.set(false)),
      )
      .subscribe({
        next: () => {
          this.getAll();
          this.snackBar.open('Editorial actualizada exitosamente', 'Cerrar', {
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
          this.snackBar.open('Editorial eliminada exitosamente', 'Cerrar', {
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
        errorMessage = 'La editorial no fue encontrada';
      } else if (error.status === 400) {
        errorMessage = 'Datos inválidos';
      } else if (error.status === 409) {
        errorMessage = 'La editorial ya existe';
      }
    }

    this.snackBar.open(errorMessage, 'Cerrar', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });

    return throwError(() => new Error(errorMessage));
  }
}
