import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@env';

interface EPS {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class EPSService {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly baseUrl = `${environment.apiUrl}/eps`;

  readonly epsList = signal<{
    data: EPS[];
    loading: boolean;
    initialLoad: boolean;
  }>({
    data: [],
    loading: false,
    initialLoad: true,
  });

  getAll(): void {
    this.epsList.update((state) => ({ ...state, loading: true }));
    this.http.get<EPS[]>(this.baseUrl).subscribe({
      next: (data) => {
        this.epsList.update((state) => ({
          ...state,
          data,
          loading: false,
          initialLoad: false,
        }));
      },
      error: () => {
        this.epsList.update((state) => ({
          ...state,
          loading: false,
          initialLoad: false,
        }));
        this.snackBar.open('Error al cargar las EPS', 'Cerrar');
      },
    });
  }
}
