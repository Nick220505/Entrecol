import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { PayrollService } from '@payrolls/services/payroll.service';
import { DepartmentPieChartComponent } from '../department-pie-chart/department-pie-chart.component';
import { DepartmentPositionBarChartComponent } from '../department-position-bar-chart/department-position-bar-chart.component';

@Component({
  selector: 'app-payroll-report',
  templateUrl: './payroll-report.component.html',
  styleUrls: ['./payroll-report.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTableModule,
    DepartmentPieChartComponent,
    DepartmentPositionBarChartComponent,
  ],
})
export class PayrollReportComponent {
  private readonly payrollService = inject(PayrollService);

  readonly report = this.payrollService.report;
  readonly departmentChartData = computed(() => {
    const data = this.report().data;
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
  readonly departmentPositionChartData = computed(() => {
    const data = this.report().data;
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
  readonly yAxisTicks = computed(() => {
    const data = this.departmentPositionChartData();
    if (!data.length) return [0, 1, 2, 3];

    const maxValue = Math.max(
      ...data.flatMap((dept) => dept.series.map((s) => s.value)),
    );
    return Array.from({ length: maxValue + 1 }, (_, i) => i);
  });

  constructor() {
    effect(
      () => {
        if (this.payrollService.employees().data.length > 0) {
          this.payrollService.getEmployeeReport();
        }
      },
      { allowSignalWrites: true },
    );
  }

  formatPositionName(name: string): string {
    return name
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
