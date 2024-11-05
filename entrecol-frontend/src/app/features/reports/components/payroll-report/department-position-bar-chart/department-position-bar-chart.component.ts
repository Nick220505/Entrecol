import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { PayrollService } from '@employees/services/payroll.service';
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
  styleUrl: './department-position-bar-chart.component.scss',
})
export class DepartmentPositionBarChartComponent {
  private readonly payrollService = inject(PayrollService);
  protected readonly legendPosition = LegendPosition.Right;
  protected readonly view: [number, number] = [window.innerWidth / 1.2, 550];
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

  protected readonly chartData = computed(() => {
    const data = this.payrollService.report().data;
    if (!data) return [];

    return Object.entries(data.departmentPositionStats)
      .map(([department, positions]) => ({
        name:
          data.employees.find((emp) => emp.department.name === department)
            ?.department.name || department,
        series: Object.entries(positions)
          .map(([position, count]) => ({
            name: this.formatPositionName(
              data.employees.find((emp) => emp.position.name === position)
                ?.position.name || position,
            ),
            value: count,
          }))
          .filter((item) => item.value > 0)
          .sort((a, b) => b.value - a.value),
      }))
      .filter((dept) => dept.series.length > 0)
      .sort(
        (a, b) =>
          b.series.reduce((sum, item) => sum + item.value, 0) -
          a.series.reduce((sum, item) => sum + item.value, 0),
      );
  });

  protected readonly yAxisTicks = computed(() => {
    const data = this.chartData();
    if (!data.length) return [0, 1, 2, 3];

    const maxValue = Math.max(
      ...data.flatMap((dept) => dept.series.map((s) => s.value)),
    );
    return Array.from({ length: maxValue + 1 }, (_, i) => i);
  });

  formatYAxisTick(value: number): string {
    return Math.round(value).toString();
  }

  formatXAxisTick(val: string): string {
    return val.length > 15 ? val.substring(0, 15) + '...' : val;
  }

  private formatPositionName(name: string): string {
    return name
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
