import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EntertainmentReportService } from '../../services/entertainment-report.service';
import { BookPublicationChartComponent } from './book-publication-chart/book-publication-chart.component';
import { EntertainmentReportFiltersComponent } from './entertainment-report-filters/entertainment-report-filters.component';
import { MovieGenreChartComponent } from './movie-genre-chart/movie-genre-chart.component';
import { MoviesByGenreCountComponent } from './movies-by-genre-count/movies-by-genre-count.component';
import { TopRatedBooksListComponent } from './top-rated-books-list/top-rated-books-list.component';
import { YearlyBooksComparisonComponent } from './yearly-books-comparison/yearly-books-comparison.component';

@Component({
  selector: 'app-entertainment-report',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    EntertainmentReportFiltersComponent,
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
  private readonly entertainmentReportService = inject(
    EntertainmentReportService,
  );

  protected readonly report = computed(() =>
    this.entertainmentReportService.report(),
  );
}
