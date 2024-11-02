import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  LegendPosition,
  NgxChartsModule,
  ScaleType,
} from '@swimlane/ngx-charts';

@Component({
  selector: 'app-department-position-bar-chart',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './department-position-bar-chart.component.html',
  styleUrls: ['./department-position-bar-chart.component.scss'],
})
export class DepartmentPositionBarChartComponent {
  @Input({ required: true }) data: {
    name: string;
    series: { name: string; value: number }[];
  }[] = [];

  @Input() yAxisTicks = [0, 1, 2, 3];

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
      '#b82e2e',
      '#316395',
      '#994499',
      '#22aa99',
      '#aaaa11',
      '#6633cc',
      '#e67300',
    ],
  };

  formatYAxisTick(value: number): string {
    return Math.round(value).toString();
  }

  formatXAxisTick(val: string): string {
    return val.length > 15 ? val.substring(0, 15) + '...' : val;
  }
}
