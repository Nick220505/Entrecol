import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

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
}
