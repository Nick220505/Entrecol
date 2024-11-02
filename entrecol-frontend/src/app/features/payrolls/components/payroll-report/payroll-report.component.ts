import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';

import { EmployeeReport } from '@payrolls/models/report.model';
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
export class PayrollReportComponent implements OnInit {
  report$ = signal<EmployeeReport | null>(null);
  sortOrder = signal<'asc' | 'desc'>('asc');
  displayedColumns = ['fullName', 'code', 'department', 'position'];

  departmentChartData: { name: string; value: number }[] = [];
  departmentPositionChartData: {
    name: string;
    series: { name: string; value: number }[];
  }[] = [];
  yAxisTicks = [0, 1, 2, 3];

  constructor(private payrollService: PayrollService) {}

  ngOnInit() {
    this.loadReport();
  }

  loadReport() {
    this.payrollService
      .getEmployeeReport(this.sortOrder())
      .subscribe((data) => {
        this.report$.set(data);
        this.updateChartData(data);
      });
  }

  updateChartData(data: EmployeeReport) {
    // Process department stats
    this.departmentChartData = Object.entries(data.departmentStats)
      .map(([name, value]) => ({
        name:
          data.employees.find((emp) => emp.department.name === name)?.department
            .name || name,
        value: value,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);

    // Process department-position stats
    this.departmentPositionChartData = Object.entries(
      data.departmentPositionStats,
    )
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

    // Update yAxisTicks
    const maxValue = Math.max(
      ...this.departmentPositionChartData.flatMap((dept) =>
        dept.series.map((s) => s.value),
      ),
    );
    this.yAxisTicks = Array.from({ length: maxValue + 1 }, (_, i) => i);
  }

  formatPositionName(name: string): string {
    return name
      .split(/(?=[A-Z])/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  toggleSort() {
    this.sortOrder.set(this.sortOrder() === 'asc' ? 'desc' : 'asc');
    this.loadReport();
  }

  downloadPdf() {
    console.log('Exportar a PDF');
  }
}
