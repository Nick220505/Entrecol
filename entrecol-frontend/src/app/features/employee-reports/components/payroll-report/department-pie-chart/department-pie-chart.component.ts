import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { PayrollService } from '@app/features/employee-reports/services/payroll.service';
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
  styleUrl: './department-pie-chart.component.scss',
})
export class DepartmentPieChartComponent {
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
    const data = this.payrollService.report().data;
    if (!data) return [];
    return Object.entries(data.departmentStats)
      .map(([name, value]) => ({
        name:
          data.employees.find((emp) => emp.department.name === name)?.department
            .name || name,
        value: value,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  });

  protected readonly formattedData = computed(() =>
    this.chartData().map((d) => ({
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
