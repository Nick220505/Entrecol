import { CommonModule, formatDate } from '@angular/common';
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
import { BookPublicationChartComponent } from './book-publication-chart/book-publication-chart.component';
import { MovieGenreChartComponent } from './movie-genre-chart/movie-genre-chart.component';
import { MoviesByGenreCountComponent } from './movies-by-genre-count/movies-by-genre-count.component';
import { TopRatedBooksListComponent } from './top-rated-books-list/top-rated-books-list.component';
import { YearlyBooksComparisonComponent } from './yearly-books-comparison/yearly-books-comparison.component';

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
    MovieGenreChartComponent,
    BookPublicationChartComponent,
    TopRatedBooksListComponent,
    YearlyBooksComparisonComponent,
    MoviesByGenreCountComponent,
  ],
  templateUrl: './entertainment-report.component.html',
  styleUrl: './entertainment-report.component.scss',
})
export class EntertainmentReportComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly entertainmentReportService = inject(
    EntertainmentReportService,
  );

  protected readonly form: FormGroup = this.formBuilder.group({
    startDate: ['', Validators.required],
    endDate: ['', Validators.required],
    topN: [10, [Validators.required, Validators.min(1)]],
    genreCount: [2, [Validators.required, Validators.min(1)]],
    moviesByGenreAscending: [true],
    topRatedBooksAscending: [true],
    topBottomBooksByYearAscending: [true],
    moviesByGenreCountAscending: [true],
  });

  protected readonly report = computed(() =>
    this.entertainmentReportService.report(),
  );
  protected readonly pdfExporting = computed(() =>
    this.entertainmentReportService.pdfExporting(),
  );

  constructor() {
    this.setupToggleListeners();
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

  onSubmit(): void {
    if (this.form.valid) {
      const { startDate, endDate, topN, genreCount } = this.form.value;

      this.entertainmentReportService.getReport(
        formatDate(startDate, 'yyyy-MM-dd', 'en-US'),
        formatDate(endDate, 'yyyy-MM-dd', 'en-US'),
        topN,
        genreCount,
      );
    }
  }

  exportToPdf(): void {
    if (this.form.valid) {
      const { startDate, endDate, topN, genreCount } = this.form.value;

      this.entertainmentReportService.exportToPdf(
        formatDate(startDate, 'yyyy-MM-dd', 'en-US'),
        formatDate(endDate, 'yyyy-MM-dd', 'en-US'),
        topN,
        genreCount,
      );
    }
  }
}
