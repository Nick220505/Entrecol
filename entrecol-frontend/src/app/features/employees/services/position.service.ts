import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@env';

interface Position {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly baseUrl = `${environment.apiUrl}/positions`;

  readonly positions = signal<{
    data: Position[];
    loading: boolean;
    initialLoad: boolean;
  }>({
    data: [],
    loading: false,
    initialLoad: true,
  });

  getAll(): void {
    this.positions.update((state) => ({ ...state, loading: true }));
    this.http.get<Position[]>(this.baseUrl).subscribe({
      next: (data) => {
        this.positions.update((state) => ({
          ...state,
          data,
          loading: false,
          initialLoad: false,
        }));
      },
      error: () => {
        this.positions.update((state) => ({
          ...state,
          loading: false,
          initialLoad: false,
        }));
        this.snackBar.open('Error al cargar los cargos', 'Cerrar');
      },
    });
  }
}
