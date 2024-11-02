import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  LegendPosition,
  NgxChartsModule,
  ScaleType,
} from '@swimlane/ngx-charts';

interface ChartData {
  name: string;
  series: {
    name: string;
    value: number;
  }[];
}

@Component({
  selector: 'app-department-position-bar-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './department-position-bar-chart.component.html',
  styleUrls: ['./department-position-bar-chart.component.scss'],
})
export class DepartmentPositionBarChartComponent {
  readonly data = input.required<ChartData[]>();
  readonly yAxisTicks = input.required<number[]>();
  protected readonly legendPosition = LegendPosition.Right;
  protected readonly colorScheme = {
    name: 'vivid',
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
      '#b82e2e',
      '#316395',
      '#994499',
      '#22aa99',
      '#aaaa11',
      '#6633cc',
      '#e67300',
    ],
  };

  protected readonly view: [number, number] = [window.innerWidth / 1.2, 550];

  formatYAxisTick(value: number): string {
    return Math.round(value).toString();
  }

  formatXAxisTick(val: string): string {
    return val.length > 15 ? val.substring(0, 15) + '...' : val;
  }
}
