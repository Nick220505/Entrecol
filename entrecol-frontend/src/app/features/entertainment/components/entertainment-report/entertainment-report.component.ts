import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EntertainmentReportService } from '../../services/entertainment-report.service';

@Component({
  selector: 'app-entertainment-report',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    NgxChartsModule,
  ],
  templateUrl: './entertainment-report.component.html',
  styleUrl: './entertainment-report.component.scss',
})
export class EntertainmentReportComponent {
  private readonly fb = inject(FormBuilder);
  private readonly entertainmentReportService = inject(
    EntertainmentReportService,
  );

  readonly form: FormGroup = this.fb.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    topN: [10, [Validators.required, Validators.min(1)]],
    genreCount: [2, [Validators.required, Validators.min(1)]],
    ascending: [true],
  });

  readonly report = this.entertainmentReportService.report;
  readonly pdfExporting = this.entertainmentReportService.pdfExporting;

  readonly moviesByGenreData = computed(() => {
    const stats = this.report()?.data?.moviesByGenreStats;
    if (!stats) return [];
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  });

  readonly bookPublicationData = computed(() => {
    const stats = this.report()?.data?.bookPublicationStats;
    if (!stats) return [];
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  });

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { startDate, endDate, topN, genreCount, ascending } =
        this.form.value;
      const formattedStartDate = this.formatDate(startDate);
      const formattedEndDate = this.formatDate(endDate);

      this.entertainmentReportService.getReport(
        formattedStartDate,
        formattedEndDate,
        topN,
        genreCount,
        ascending,
      );
    }
  }

  exportToPdf(): void {
    if (this.form.valid) {
      const { startDate, endDate, topN, genreCount, ascending } =
        this.form.value;
      const formattedStartDate = this.formatDate(startDate);
      const formattedEndDate = this.formatDate(endDate);

      this.entertainmentReportService.exportToPdf(
        formattedStartDate,
        formattedEndDate,
        topN,
        genreCount,
        ascending,
      );
    }
  }
}
