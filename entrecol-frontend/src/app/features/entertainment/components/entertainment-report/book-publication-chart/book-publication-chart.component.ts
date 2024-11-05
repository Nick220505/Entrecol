import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';

interface ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-book-publication-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './book-publication-chart.component.html',
  styleUrl: './book-publication-chart.component.scss',
})
export class BookPublicationChartComponent {
  data = input.required<ChartData[]>();

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
