import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';

import { EmployeePersonalInfo } from '@employees/models/employee-personal-info.model';
import { HealthPensionReport } from '@employees/models/health-pension-report.model';
import { NoveltyReport } from '@employees/models/novelty-report.model';
import { Employee } from '@employees/models/payroll.model';
import { EmployeeReport } from '@employees/models/report.model';
import { environment } from '@env';
import { PdfPreviewDialogComponent } from '@shared/components/pdf-preview-dialog/pdf-preview-dialog.component';

interface State<T> {
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

  readonly employees = signal<{
    data: Employee[];
    loading: boolean;
    initialLoad: boolean;
  }>({
    data: [],
    loading: false,
    initialLoad: true,
  });

  readonly report = signal<State<EmployeeReport | null>>({
    data: null,
    loading: false,
    initialLoad: true,
  });

  readonly personalInfo = signal<State<EmployeePersonalInfo | null>>({
    data: null,
    loading: false,
    initialLoad: true,
  });

  readonly uploading = signal(false);
  readonly fileUploaded = signal(false);
  readonly pdfExporting = signal(false);
  readonly pdfExportingPersonalInfo = signal(false);

  readonly healthPensionReport = signal<State<HealthPensionReport | null>>({
    data: null,
    loading: false,
    initialLoad: true,
  });

  readonly pdfExportingHealthPension = signal(false);

  readonly epsFrequency = signal<State<Record<string, number>>>({
    data: {},
    loading: false,
    initialLoad: true,
  });

  readonly pensionFrequency = signal<State<Record<string, number>>>({
    data: {},
    loading: false,
    initialLoad: true,
  });

  readonly noveltyReport = signal<State<NoveltyReport | null>>({
    data: null,
    loading: false,
    initialLoad: true,
  });

  readonly pdfExportingNovelty = signal(false);

  readonly creating = signal(false);
  readonly updating = signal(false);
  readonly deleting = signal(false);

  getAll(): void {
    this.employees.update((state) => ({ ...state, loading: true }));
    this.http.get<Employee[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.employees.update((state) => ({
          ...state,
          data,
          loading: false,
          initialLoad: false,
        }));
      },
      error: () => {
        this.employees.update((state) => ({
          ...state,
          loading: false,
          initialLoad: false,
        }));
        this.snackBar.open('Error al cargar los empleados', 'Cerrar');
      },
    });
  }

  create(employee: Partial<Employee>): void {
    this.creating.set(true);
    this.http
      .post<Employee>(this.apiUrl, employee)
      .pipe(finalize(() => this.creating.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Empleado creado exitosamente', 'Cerrar');
          this.getAll();
        },
        error: () => {
          this.snackBar.open('Error al crear el empleado', 'Cerrar');
        },
      });
  }

  update(id: number, employee: Partial<Employee>): void {
    this.updating.set(true);
    this.http
      .put<Employee>(`${this.apiUrl}/${id}`, employee)
      .pipe(finalize(() => this.updating.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Empleado actualizado exitosamente', 'Cerrar');
          this.getAll();
        },
        error: () => {
          this.snackBar.open('Error al actualizar el empleado', 'Cerrar');
        },
      });
  }

  delete(id: number): void {
    this.deleting.set(true);
    this.http
      .delete(`${this.apiUrl}/${id}`)
      .pipe(finalize(() => this.deleting.set(false)))
      .subscribe({
        next: () => {
          this.snackBar.open('Empleado eliminado exitosamente', 'Cerrar');
          this.getAll();
        },
        error: () => {
          this.snackBar.open('Error al eliminar el empleado', 'Cerrar');
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
          this.fileUploaded.set(true);
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

  getPersonalInfo(employeeId: number): void {
    this.personalInfo.update((state) => ({ ...state, loading: true }));

    this.http
      .get<EmployeePersonalInfo>(`${this.apiUrl}/${employeeId}/personal-info`)
      .subscribe({
        next: (data) => {
          this.personalInfo.set({
            data,
            loading: false,
            initialLoad: false,
          });
        },
        error: () => {
          this.personalInfo.update((state) => ({ ...state, loading: false }));
          this.snackBar.open(
            'Error al cargar la información personal',
            'Cerrar',
          );
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
          dialogRef.componentInstance.pdfUrl.set(url);
          dialogRef.afterClosed().subscribe(() => {
            window.URL.revokeObjectURL(url);
          });
        },
        error: () => this.snackBar.open('Error al exportar el PDF', 'Cerrar'),
      });
  }

  exportPersonalInfoToPdf(employeeId: number): void {
    this.pdfExportingPersonalInfo.set(true);

    this.http
      .get(`${this.apiUrl}/${employeeId}/personal-info/export/pdf`, {
        responseType: 'blob',
      })
      .pipe(finalize(() => this.pdfExportingPersonalInfo.set(false)))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const dialogRef = this.dialog.open(PdfPreviewDialogComponent, {
            width: '90vw',
            height: '90vh',
            maxWidth: '100vw',
            maxHeight: '100vh',
          });
          dialogRef.componentInstance.pdfUrl.set(url);
          dialogRef.afterClosed().subscribe(() => {
            window.URL.revokeObjectURL(url);
          });
        },
        error: () => this.snackBar.open('Error al exportar el PDF', 'Cerrar'),
      });
  }

  getHealthPensionReport(): void {
    this.healthPensionReport.update((state) => ({ ...state, loading: true }));

    this.http
      .get<{
        data: HealthPensionReport;
      }>(`${this.apiUrl}/health-pension-report`)
      .subscribe({
        next: ({ data }) => {
          this.healthPensionReport.set({
            data,
            loading: false,
            initialLoad: false,
          });
        },
        error: () => {
          this.healthPensionReport.update((state) => ({
            ...state,
            loading: false,
          }));
          this.snackBar.open(
            'Error al cargar el reporte de salud y pensión',
            'Cerrar',
          );
        },
      });
  }

  exportHealthPensionReportToPdf(): void {
    this.pdfExportingHealthPension.set(true);

    this.http
      .get(`${this.apiUrl}/health-pension-report/export/pdf`, {
        responseType: 'blob',
      })
      .pipe(finalize(() => this.pdfExportingHealthPension.set(false)))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const dialogRef = this.dialog.open(PdfPreviewDialogComponent, {
            width: '90vw',
            height: '90vh',
            maxWidth: '100vw',
            maxHeight: '100vh',
          });
          dialogRef.componentInstance.pdfUrl.set(url);
          dialogRef.afterClosed().subscribe(() => {
            window.URL.revokeObjectURL(url);
          });
        },
        error: () => this.snackBar.open('Error al exportar el PDF', 'Cerrar'),
      });
  }

  getEpsFrequency(): void {
    this.epsFrequency.update((state) => ({ ...state, loading: true }));

    this.http
      .get<{ data: Record<string, number> }>(`${this.apiUrl}/eps-frequency`)
      .subscribe({
        next: ({ data }) => {
          this.epsFrequency.set({
            data,
            loading: false,
            initialLoad: false,
          });
        },
        error: () => {
          this.epsFrequency.update((state) => ({ ...state, loading: false }));
          this.snackBar.open('Error al cargar la frecuencia de EPS', 'Cerrar');
        },
      });
  }

  getPensionFrequency(): void {
    this.pensionFrequency.update((state) => ({ ...state, loading: true }));

    this.http
      .get<{ data: Record<string, number> }>(`${this.apiUrl}/pension-frequency`)
      .subscribe({
        next: ({ data }) => {
          this.pensionFrequency.set({
            data,
            loading: false,
            initialLoad: false,
          });
        },
        error: () => {
          this.pensionFrequency.update((state) => ({
            ...state,
            loading: false,
          }));
          this.snackBar.open(
            'Error al cargar la frecuencia de Fondos de Pensión',
            'Cerrar',
          );
        },
      });
  }

  getNoveltyReport(startDate: string, endDate: string): void {
    this.noveltyReport.update((state) => ({ ...state, loading: true }));

    this.http
      .get<{
        data: NoveltyReport;
      }>(
        `${this.apiUrl}/novelty-report?startDate=${startDate}&endDate=${endDate}`,
      )
      .subscribe({
        next: ({ data }) => {
          this.noveltyReport.set({
            data,
            loading: false,
            initialLoad: false,
          });
        },
        error: () => {
          this.noveltyReport.update((state) => ({ ...state, loading: false }));
          this.snackBar.open(
            'Error al cargar el reporte de novedades',
            'Cerrar',
          );
        },
      });
  }

  exportNoveltyReportToPdf(startDate: string, endDate: string): void {
    this.pdfExportingNovelty.set(true);

    this.http
      .get(`${this.apiUrl}/novelty-report/export/pdf`, {
        params: { startDate, endDate },
        responseType: 'blob',
      })
      .pipe(finalize(() => this.pdfExportingNovelty.set(false)))
      .subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const dialogRef = this.dialog.open(PdfPreviewDialogComponent, {
            width: '90vw',
            height: '90vh',
            maxWidth: '100vw',
            maxHeight: '100vh',
          });
          dialogRef.componentInstance.pdfUrl.set(url);
          dialogRef.afterClosed().subscribe(() => {
            window.URL.revokeObjectURL(url);
          });
        },
        error: () => this.snackBar.open('Error al exportar el PDF', 'Cerrar'),
      });
  }
}
