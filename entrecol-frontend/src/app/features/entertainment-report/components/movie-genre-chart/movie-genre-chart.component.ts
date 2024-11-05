import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { EntertainmentReportService } from '@entertainment-report/services/entertainment-report.service';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-movie-genre-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './movie-genre-chart.component.html',
  styleUrl: './movie-genre-chart.component.scss',
})
export class MovieGenreChartComponent {
  private readonly entertainmentReportService = inject(
    EntertainmentReportService,
  );

  protected readonly data = computed(() => {
    const stats =
      this.entertainmentReportService.report()?.data?.moviesByGenreStats;
    if (!stats) return [];

    const entries = Object.entries(stats).map(([name, value]) => ({
      name,
      value,
    }));

    return this.entertainmentReportService.moviesByGenreAscending()
      ? entries.sort((a, b) => a.name.localeCompare(b.name))
      : entries.sort((a, b) => b.name.localeCompare(a.name));
  });

  protected readonly colorScheme = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#2196F3',
      '#FF9800',
      '#4CAF50',
      '#E91E63',
      '#9C27B0',
      '#00BCD4',
      '#FFC107',
      '#3F51B5',
    ],
  };
}
