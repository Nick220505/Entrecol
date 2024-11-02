import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  LegendPosition,
  NgxChartsModule,
  ScaleType,
} from '@swimlane/ngx-charts';

interface ChartData {
  name: string;
  value: number;
}

@Component({
  selector: 'app-department-pie-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './department-pie-chart.component.html',
  styleUrls: ['./department-pie-chart.component.scss'],
})
export class DepartmentPieChartComponent {
  readonly data = input.required<ChartData[]>();
  protected readonly legendPosition = LegendPosition.Right;
  protected readonly colorScheme = {
    name: 'vivid',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#647c8a', '#3f51b5', '#2196f3', '#00b862', '#afdf0a', '#a7b61a'],
  };
}
