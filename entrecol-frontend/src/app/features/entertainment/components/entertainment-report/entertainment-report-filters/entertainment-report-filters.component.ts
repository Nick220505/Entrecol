import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormsModule,
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
    FormsModule,
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
  protected readonly entertainmentReportService = inject(
    EntertainmentReportService,
  );

  protected readonly form = this.formBuilder.group({
    startDate: [
      this.entertainmentReportService.startDate(),
      Validators.required,
    ],
    endDate: [this.entertainmentReportService.endDate(), Validators.required],
    topN: [
      this.entertainmentReportService.topN(),
      [Validators.required, Validators.min(1)],
    ],
    genreCount: [
      this.entertainmentReportService.genreCount(),
      [Validators.required, Validators.min(1)],
    ],
    moviesByGenreAscending: [
      this.entertainmentReportService.moviesByGenreAscending(),
    ],
    topRatedBooksAscending: [
      this.entertainmentReportService.topRatedBooksAscending(),
    ],
    topBottomBooksByYearAscending: [
      this.entertainmentReportService.topBottomBooksByYearAscending(),
    ],
    moviesByGenreCountAscending: [
      this.entertainmentReportService.moviesByGenreCountAscending(),
    ],
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.entertainmentReportService.getReport();
    }
  }

  onExportPdf(): void {
    if (this.form.valid) {
      this.entertainmentReportService.exportToPdf();
    }
  }
}
