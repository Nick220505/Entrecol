import { CommonModule, formatDate } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EntertainmentReportService } from '../../../services/entertainment-report.service';

@Component({
  selector: 'app-entertainment-report-filters',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatSlideToggleModule,
  ],
  templateUrl: './entertainment-report-filters.component.html',
  styleUrl: './entertainment-report-filters.component.scss',
})
export class EntertainmentReportFiltersComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly entertainmentReportService = inject(
    EntertainmentReportService,
  );

  protected readonly form: FormGroup = this.formBuilder.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    topN: [
      this.entertainmentReportService.topN(),
      [Validators.required, Validators.min(1)],
    ],
    genreCount: [
      this.entertainmentReportService.genreCount(),
      [Validators.required, Validators.min(1)],
    ],
    moviesByGenreAscending: [true],
    topRatedBooksAscending: [true],
    topBottomBooksByYearAscending: [true],
    moviesByGenreCountAscending: [true],
  });

  constructor() {
    this.setupToggleListeners();
    this.setupValueListeners();
  }

  private setupToggleListeners(): void {
    this.form.get('moviesByGenreAscending')?.valueChanges.subscribe((value) => {
      this.entertainmentReportService.moviesByGenreAscending.set(value);
    });

    this.form.get('topRatedBooksAscending')?.valueChanges.subscribe((value) => {
      this.entertainmentReportService.topRatedBooksAscending.set(value);
    });

    this.form
      .get('topBottomBooksByYearAscending')
      ?.valueChanges.subscribe((value) => {
        this.entertainmentReportService.topBottomBooksByYearAscending.set(
          value,
        );
      });

    this.form
      .get('moviesByGenreCountAscending')
      ?.valueChanges.subscribe((value) => {
        this.entertainmentReportService.moviesByGenreCountAscending.set(value);
      });
  }

  private setupValueListeners(): void {
    this.form.get('topN')?.valueChanges.subscribe((value) => {
      this.entertainmentReportService.topN.set(value);
    });

    this.form.get('genreCount')?.valueChanges.subscribe((value) => {
      this.entertainmentReportService.genreCount.set(value);
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const { startDate, endDate } = this.form.value;
      this.entertainmentReportService.getReport(
        formatDate(startDate, 'yyyy-MM-dd', 'en-US'),
        formatDate(endDate, 'yyyy-MM-dd', 'en-US'),
      );
    }
  }

  onExportPdf(): void {
    if (this.form.valid) {
      const { startDate, endDate } = this.form.value;
      this.entertainmentReportService.exportToPdf(
        formatDate(startDate, 'yyyy-MM-dd', 'en-US'),
        formatDate(endDate, 'yyyy-MM-dd', 'en-US'),
      );
    }
  }

  protected readonly pdfExporting =
    this.entertainmentReportService.pdfExporting;
}
