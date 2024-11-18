import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@env';

interface Department {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly baseUrl = `${environment.apiUrl}/departments`;

  readonly departments = signal<{
    data: Department[];
    loading: boolean;
    initialLoad: boolean;
  }>({
    data: [],
    loading: false,
    initialLoad: true,
  });

  getAll(): void {
    this.departments.update((state) => ({ ...state, loading: true }));
    this.http.get<Department[]>(this.baseUrl).subscribe({
      next: (data) => {
        this.departments.update((state) => ({
          ...state,
          data,
          loading: false,
          initialLoad: false,
        }));
      },
      error: () => {
        this.departments.update((state) => ({
          ...state,
          loading: false,
          initialLoad: false,
        }));
        this.snackBar.open('Error al cargar los departamentos', 'Cerrar');
      },
    });
  }
}
