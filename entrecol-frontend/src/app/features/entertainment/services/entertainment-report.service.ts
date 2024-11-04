import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '@env';
import { PdfPreviewDialogComponent } from '@payrolls/components/pdf-preview-dialog/pdf-preview-dialog.component';
import { finalize } from 'rxjs';
import { EntertainmentReport } from '../models/entertainment-report.model';

interface State<T> {
  data: T;
  loading: boolean;
  initialLoad: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class EntertainmentReportService {
  private readonly apiUrl = `${environment.apiUrl}/api/entertainment-report`;
  private readonly http = inject(HttpClient);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  readonly report = signal<State<EntertainmentReport | null>>({
    data: null,
    loading: false,
    initialLoad: true,
  });

  readonly pdfExporting = signal(false);

  getReport(
    startDate: string,
    endDate: string,
    topN: number,
    genreCount: number,
    moviesByGenreAscending: boolean,
    topRatedBooksAscending: boolean,
    topBottomBooksByYearAscending: boolean,
    moviesByGenreCountAscending: boolean,
  ): void {
    this.report.update((state) => ({ ...state, loading: true }));

    this.http
      .get<{ data: EntertainmentReport }>(this.apiUrl, {
        params: {
          startDate,
          endDate,
          topN,
          genreCount,
          moviesByGenreAscending,
          topRatedBooksAscending,
          topBottomBooksByYearAscending,
          moviesByGenreCountAscending,
        },
      })
      .subscribe({
        next: ({ data }) => {
          this.report.set({
            data,
            loading: false,
            initialLoad: false,
          });
        },
        error: () => {
          this.report.update((state) => ({ ...state, loading: false }));
          this.snackBar.open(
            'Error al cargar el reporte de entretenimiento',
            'Cerrar',
          );
        },
      });
  }

  exportToPdf(
    startDate: string,
    endDate: string,
    topN: number,
    genreCount: number,
    moviesByGenreAscending: boolean,
    topRatedBooksAscending: boolean,
    topBottomBooksByYearAscending: boolean,
    moviesByGenreCountAscending: boolean,
  ): void {
    this.pdfExporting.set(true);

    this.http
      .get(`${this.apiUrl}/export/pdf`, {
        params: {
          startDate,
          endDate,
          topN,
          genreCount,
          moviesByGenreAscending,
          topRatedBooksAscending,
          topBottomBooksByYearAscending,
          moviesByGenreCountAscending,
        },
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
        error: () => {
          this.snackBar.open('Error al exportar el PDF', 'Cerrar');
        },
      });
  }
}
