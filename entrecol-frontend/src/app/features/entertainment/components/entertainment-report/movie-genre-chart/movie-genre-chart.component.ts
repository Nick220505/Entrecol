import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { NgxChartsModule } from '@swimlane/ngx-charts';

interface ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-movie-genre-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './movie-genre-chart.component.html',
  styleUrl: './movie-genre-chart.component.scss',
})
export class MovieGenreChartComponent {
  data = input.required<ChartData[]>();
}
