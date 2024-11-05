import { CommonModule, formatDate } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
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
import { Book } from '@books/models/book.model';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { EntertainmentReportService } from '../../services/entertainment-report.service';
import { BookPublicationChartComponent } from './book-publication-chart/book-publication-chart.component';
import { MovieGenreChartComponent } from './movie-genre-chart/movie-genre-chart.component';
import { TopRatedBooksListComponent } from './top-rated-books-list/top-rated-books-list.component';

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
  ],
  templateUrl: './entertainment-report.component.html',
  styleUrl: './entertainment-report.component.scss',
})
export class EntertainmentReportComponent implements OnInit {
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

  readonly report = computed(() => this.entertainmentReportService.report());
  readonly pdfExporting = computed(() =>
    this.entertainmentReportService.pdfExporting(),
  );

  readonly moviesByGenreData = computed(() => {
    const stats = this.report()?.data?.moviesByGenreStats;
    if (!stats) return [];

    const data = Object.entries(stats).map(([name, value]) => ({
      name,
      value,
    }));
    const isAscending = this.form.get('moviesByGenreAscending')?.value;

    return isAscending
      ? data.sort((a, b) => a.name.localeCompare(b.name))
      : data.sort((a, b) => b.name.localeCompare(a.name));
  });

  readonly bookPublicationData = computed(() => {
    const stats = this.report()?.data?.bookPublicationStats;
    if (!stats) return [];
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  });

  readonly topRatedBooks = computed(() => {
    const books = this.report()?.data?.topRatedBooks;
    if (!books) return [];

    const isAscending = this.form.get('topRatedBooksAscending')?.value;
    return [...books].sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return isAscending ? comparison : -comparison;
    });
  });

  readonly bottomRatedBooks = computed(() => {
    const books = this.report()?.data?.bottomRatedBooks;
    if (!books) return [];

    const isAscending = this.form.get('topRatedBooksAscending')?.value;
    return [...books].sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return isAscending ? comparison : -comparison;
    });
  });

  readonly sortedYearlyBooks = computed(() => {
    const booksByYear = this.report()?.data?.topAndBottomBooksByYear;
    if (!booksByYear) return [];

    const years = Object.keys(booksByYear).map(Number);
    const isAscending = this.form.get('topBottomBooksByYearAscending')?.value;

    const sortedYears = isAscending
      ? years.sort((a, b) => a - b)
      : years.sort((a, b) => b - a);

    return sortedYears.map((year) => {
      const books = booksByYear[year];
      const midPoint = Math.floor(books.length / 2);
      const topBooks = books.slice(0, midPoint);
      const bottomBooks = books.slice(midPoint);

      const sortBooks = (bookList: Book[]) => {
        return [...bookList].sort((a, b) => {
          const comparison = a.title.localeCompare(b.title);
          return isAscending ? comparison : -comparison;
        });
      };

      return {
        year,
        topBooks: sortBooks(topBooks),
        bottomBooks: sortBooks(bottomBooks),
      };
    });
  });

  readonly moviesWithGenres = computed(() => {
    const movies =
      this.report()?.data?.moviesGroupedByGenreCount?.[
        this.form.value.genreCount
      ];
    if (!movies) return [];

    const isAscending = this.form.get('moviesByGenreCountAscending')?.value;
    return [...movies].sort((a, b) => {
      const comparison = a.title.localeCompare(b.title);
      return isAscending ? comparison : -comparison;
    });
  });

  onSubmit(): void {
    if (this.form.valid) {
      const {
        startDate,
        endDate,
        topN,
        genreCount,
        moviesByGenreAscending,
        topRatedBooksAscending,
        topBottomBooksByYearAscending,
        moviesByGenreCountAscending,
      } = this.form.value;

      this.entertainmentReportService.getReport(
        formatDate(startDate, 'yyyy-MM-dd', 'en-US'),
        formatDate(endDate, 'yyyy-MM-dd', 'en-US'),
        topN,
        genreCount,
        moviesByGenreAscending,
        topRatedBooksAscending,
        topBottomBooksByYearAscending,
        moviesByGenreCountAscending,
      );
    }
  }

  exportToPdf(): void {
    if (this.form.valid) {
      const {
        startDate,
        endDate,
        topN,
        genreCount,
        moviesByGenreAscending,
        topRatedBooksAscending,
        topBottomBooksByYearAscending,
        moviesByGenreCountAscending,
      } = this.form.value;

      this.entertainmentReportService.exportToPdf(
        formatDate(startDate, 'yyyy-MM-dd', 'en-US'),
        formatDate(endDate, 'yyyy-MM-dd', 'en-US'),
        topN,
        genreCount,
        moviesByGenreAscending,
        topRatedBooksAscending,
        topBottomBooksByYearAscending,
        moviesByGenreCountAscending,
      );
    }
  }

  ngOnInit() {
    this.form.get('moviesByGenreAscending')?.valueChanges.subscribe(() => {
      this.entertainmentReportService.report.update((currentState) => ({
        ...currentState,
        data: currentState.data
          ? {
              ...currentState.data,
              moviesByGenreStats: { ...currentState.data.moviesByGenreStats },
            }
          : null,
      }));
    });

    this.form.get('topRatedBooksAscending')?.valueChanges.subscribe(() => {
      this.entertainmentReportService.report.update((currentState) => ({
        ...currentState,
        data: currentState.data
          ? {
              ...currentState.data,
              topRatedBooks: [...currentState.data.topRatedBooks],
            }
          : null,
      }));
    });

    this.form
      .get('topBottomBooksByYearAscending')
      ?.valueChanges.subscribe(() => {
        this.entertainmentReportService.report.update((currentState) => ({
          ...currentState,
          data: currentState.data
            ? {
                ...currentState.data,
                topAndBottomBooksByYear: {
                  ...currentState.data.topAndBottomBooksByYear,
                },
              }
            : null,
        }));
      });

    this.form.get('moviesByGenreCountAscending')?.valueChanges.subscribe(() => {
      this.entertainmentReportService.report.update((currentState) => ({
        ...currentState,
        data: currentState.data
          ? {
              ...currentState.data,
              moviesGroupedByGenreCount: {
                ...currentState.data.moviesGroupedByGenreCount,
              },
            }
          : null,
      }));
    });
  }
}
