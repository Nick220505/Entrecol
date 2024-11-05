import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { EntertainmentReportService } from '@entertainment-report/services/entertainment-report.service';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-book-publication-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './book-publication-chart.component.html',
  styleUrl: './book-publication-chart.component.scss',
})
export class BookPublicationChartComponent {
  private readonly entertainmentReportService = inject(
    EntertainmentReportService,
  );

  protected readonly data = computed(() => {
    const stats =
      this.entertainmentReportService.report()?.data?.bookPublicationStats;
    if (!stats) return [];
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
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
