import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { BookPublicationChartComponent } from './components/book-publication-chart/book-publication-chart.component';
import { EntertainmentReportFiltersComponent } from './components/entertainment-report-filters/entertainment-report-filters.component';
import { MovieGenreChartComponent } from './components/movie-genre-chart/movie-genre-chart.component';
import { MoviesByGenreCountComponent } from './components/movies-by-genre-count/movies-by-genre-count.component';
import { TopRatedBooksListComponent } from './components/top-rated-books-list/top-rated-books-list.component';
import { YearlyBooksComparisonComponent } from './components/yearly-books-comparison/yearly-books-comparison.component';
import { EntertainmentReportService } from './services/entertainment-report.service';

@Component({
  selector: 'app-entertainment-report',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    LoadingSpinnerComponent,
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
  protected readonly entertainmentReportService = inject(
    EntertainmentReportService,
  );
}
