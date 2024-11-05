import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { EntertainmentReportService } from '../../../services/entertainment-report.service';

@Component({
  selector: 'app-movies-by-genre-count',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movies-by-genre-count.component.html',
  styleUrl: './movies-by-genre-count.component.scss',
})
export class MoviesByGenreCountComponent {
  private readonly entertainmentReportService = inject(
    EntertainmentReportService,
  );

  genreCount = input.required<number>();

  protected readonly movies = computed(() => {
    const movies =
      this.entertainmentReportService.report()?.data
        ?.moviesGroupedByGenreCount?.[this.genreCount()];
    if (!movies) return [];

    return this.entertainmentReportService.moviesByGenreCountAscending()
      ? [...movies].sort((a, b) => a.title.localeCompare(b.title))
      : [...movies].sort((a, b) => b.title.localeCompare(a.title));
  });

  protected readonly totalMovies = computed(() => {
    return this.entertainmentReportService.report()?.data?.totalMovies ?? 0;
  });
}
