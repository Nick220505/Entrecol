import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  LegendPosition,
  NgxChartsModule,
  ScaleType,
} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-department-pie-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './department-pie-chart.component.html',
  styleUrls: ['./department-pie-chart.component.scss'],
})
export class DepartmentPieChartComponent {
  @Input({ required: true }) data: { name: string; value: number }[] = [];

  readonly view: [number, number] = [window.innerWidth / 1.2, 550];
  readonly legendPosition = LegendPosition.Right;
  readonly colorScheme = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#3366cc',
      '#dc3912',
      '#ff9900',
      '#109618',
      '#990099',
      '#0099c6',
      '#dd4477',
      '#66aa00',
    ],
  };

  formatLabel(value: number): string {
    return value.toString();
  }
}
