import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
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
  protected readonly view: [number, number] = [window.innerWidth / 1.2, 550];
  protected readonly colorScheme = {
    name: 'custom',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [
      '#2196F3', // Blue
      '#FF9800', // Orange
      '#4CAF50', // Green
      '#E91E63', // Pink
      '#9C27B0', // Purple
      '#00BCD4', // Cyan
      '#FFC107', // Amber
      '#3F51B5', // Indigo
    ],
  };

  protected readonly formattedData = computed(() =>
    this.data().map((d) => ({
      ...d,
      name: this.formatName(d.name),
    })),
  );

  formatLabel(value: number): string {
    return `${value}`;
  }

  private formatName(name: string): string {
    return name.length > 20 ? name.substring(0, 20) + '...' : name;
  }
}
