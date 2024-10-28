import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { SnackBarService } from '@core/services/snack-bar.service';
import { environment } from '@env';
import { Employee } from '../models/payroll.model';

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
export class PayrollsService {
  private readonly apiUrl = `${environment.apiUrl}/employees`;
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(SnackBarService);

  readonly employee = signal<State<Employee | null>>({
    data: null,
    loading: false,
    initialLoad: true,
  });

  readonly employees = signal<State<Employee[]>>({
    data: [],
    loading: false,
    initialLoad: true,
  });

  readonly uploading = signal(false);

  getAll(): void {
    this.employees.update((state) => ({ ...state, loading: true }));
    this.http.get<Employee[]>(this.apiUrl).subscribe({
      next: (employees) => {
        this.employees.set({
          data: employees,
          loading: false,
          initialLoad: false,
        });
      },
      error: () => {
        this.employees.update((state) => ({ ...state, loading: false }));
        this.snackBar.error('Error al cargar los empleados');
      },
    });
  }

  getById(id: number): void {
    this.employee.update((state) => ({ ...state, loading: true }));
    this.http.get<Employee>(`${this.apiUrl}/${id}`).subscribe({
      next: (employee) => {
        this.employee.set({
          data: employee,
          loading: false,
          initialLoad: false,
        });
      },
      error: () => {
        this.employee.update((state) => ({ ...state, loading: false }));
        this.snackBar.error('Error al cargar el empleado');
      },
    });
  }

  uploadEmployeeFile(file: File): void {
    this.uploading.set(true);
    this.employees.update((state) => ({ ...state, loading: true }));

    const formData = new FormData();
    formData.append('file', file);

    this.http
      .post<{ message: string; processedCount: number }>(
        `${this.apiUrl}/upload`,
        formData
      )
      .subscribe({
        next: () => {
          this.snackBar.success('Empleados cargados exitosamente');
          this.getAll();
        },
        error: () => {
          this.employees.update((state) => ({ ...state, loading: false }));
          this.uploading.set(false);
          this.snackBar.error('Error al cargar los empleados');
        },
        complete: () => {
          this.uploading.set(false);
        },
      });
  }
}
