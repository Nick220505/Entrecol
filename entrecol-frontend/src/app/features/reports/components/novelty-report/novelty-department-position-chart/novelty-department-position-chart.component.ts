import { Component, computed, inject } from '@angular/core';
import { PayrollService } from '@employees/services/payroll.service';
import {
  LegendPosition,
  NgxChartsModule,
  ScaleType,
} from '@swimlane/ngx-charts';

@Component({
    selector: 'app-novelty-department-position-chart',
    imports: [NgxChartsModule],
    templateUrl: './novelty-department-position-chart.component.html',
    styleUrl: './novelty-department-position-chart.component.scss'
})
export class NoveltyDepartmentPositionChartComponent {
  private readonly payrollService = inject(PayrollService);
  protected readonly legendPosition = LegendPosition.Right;
  protected readonly view: [number, number] = [window.innerWidth / 1.2, 550];
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

  protected readonly chartData = computed(() => {
    const stats =
      this.payrollService.noveltyReport().data?.departmentPositionStats;
    if (!stats) return [];

    return Object.entries(stats).map(([department, positions]) => ({
      name: department,
      series: Object.entries(positions)
        .map(([position, value]) => ({
          name: position,
          value,
        }))
        .filter((item) => item.value > 0)
        .sort((a, b) => b.value - a.value),
    }));
  });

  protected readonly yAxisTicks = computed(() => {
    const stats =
      this.payrollService.noveltyReport().data?.departmentPositionStats;
    if (!stats) return [0];

    const maxValue = Math.max(
      ...Object.values(stats).flatMap((positions) => Object.values(positions)),
    );
    return Array.from({ length: maxValue + 1 }, (_, i) => i);
  });

  formatYAxisTick(value: number): string {
    return `${value}`;
  }

  formatXAxisTick(value: string): string {
    return value.length > 15 ? value.substring(0, 15) + '...' : value;
  }
}
