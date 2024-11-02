import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, finalize } from 'rxjs';

import { environment } from '@env';
import { Employee } from '../models/payroll.model';
import { EmployeeReport } from '../models/report.model';

interface LoadingState<T> {
  data: T;
  loading: boolean;
  initialLoad: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class PayrollService {
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly apiUrl = `${environment.apiUrl}/employees`;

  employees = signal<LoadingState<Employee[]>>({
    data: [],
    loading: false,
    initialLoad: true,
  });

  uploading = signal(false);

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
        this.snackBar.open('Error al cargar los empleados', 'Cerrar');
      },
    });
  }

  uploadEmployeeFile(file: File): void {
    this.uploading.set(true);
    this.employees.update((state) => ({ ...state, loading: true }));

    const formData = new FormData();
    formData.append('file', file);

    this.http
      .post<{
        message: string;
        processedEmployees: number;
        processedRecords: number;
        processedCount: number;
      }>(`${this.apiUrl}/upload`, formData)
      .pipe(finalize(() => this.uploading.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Empleados subidos exitosamente', 'Cerrar');
          this.employees.update((state) => ({ ...state, initialLoad: true }));
          this.getAll();
        },
        error: () => {
          this.employees.update((state) => ({ ...state, loading: false }));
          this.snackBar.open('Error al subir los empleados', 'Cerrar');
        },
      });
  }

  getEmployeeReport(sort: string): Observable<EmployeeReport> {
    return this.http.get<EmployeeReport>(`${this.apiUrl}/report`, {
      params: { sort },
    });
  }

  exportToPdf(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export/pdf`, {
      responseType: 'blob',
    });
  }
}
