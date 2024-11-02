import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { environment } from '@env';
import { PdfPreviewDialogComponent } from '../components/pdf-preview-dialog/pdf-preview-dialog.component';
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
  private readonly dialog = inject(MatDialog);
  private readonly apiUrl = `${environment.apiUrl}/employees`;

  employees = signal<LoadingState<Employee[]>>({
    data: [],
    loading: false,
    initialLoad: true,
  });

  report = signal<LoadingState<EmployeeReport | null>>({
    data: null,
    loading: false,
    initialLoad: true,
  });

  uploading = signal(false);

  readonly pdfExporting = signal(false);

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

  getEmployeeReport(): void {
    this.report.update((state) => ({ ...state, loading: true }));

    this.http.get<EmployeeReport>(`${this.apiUrl}/report`).subscribe({
      next: (data) => {
        this.report.set({
          data,
          loading: false,
          initialLoad: false,
        });
      },
      error: () => {
        this.report.update((state) => ({ ...state, loading: false }));
        this.snackBar.open('Error al cargar el reporte', 'Cerrar');
      },
    });
  }

  exportToPdf(): void {
    this.pdfExporting.set(true);

    this.http
      .get(`${this.apiUrl}/export/pdf`, {
        responseType: 'blob',
      })
      .pipe(finalize(() => this.pdfExporting.set(false)))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const dialogRef = this.dialog.open(PdfPreviewDialogComponent, {
            width: '90vw',
            height: '90vh',
            maxWidth: '100vw',
            maxHeight: '100vh',
          });

          const component = dialogRef.componentInstance;
          component.setPdfUrl(url);

          dialogRef.afterClosed().subscribe(() => {
            window.URL.revokeObjectURL(url);
          });
        },
        error: () => {
          this.snackBar.open('Error al exportar el PDF', 'Cerrar');
        },
      });
  }
}
