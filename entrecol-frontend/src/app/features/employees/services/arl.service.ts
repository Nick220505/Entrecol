import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@env';

interface ARL {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class ARLService {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly baseUrl = `${environment.apiUrl}/arl`;

  readonly arlList = signal<{
    data: ARL[];
    loading: boolean;
    initialLoad: boolean;
  }>({
    data: [],
    loading: false,
    initialLoad: true,
  });

  getAll(): void {
    this.arlList.update((state) => ({ ...state, loading: true }));
    this.http.get<ARL[]>(this.baseUrl).subscribe({
      next: (data) => {
        this.arlList.update((state) => ({
          ...state,
          data,
          loading: false,
          initialLoad: false,
        }));
      },
      error: () => {
        this.arlList.update((state) => ({
          ...state,
          loading: false,
          initialLoad: false,
        }));
        this.snackBar.open('Error al cargar las ARL', 'Cerrar');
      },
    });
  }
}
