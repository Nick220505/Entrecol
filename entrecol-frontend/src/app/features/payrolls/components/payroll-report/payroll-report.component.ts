import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { PayrollService } from '@payrolls/services/payroll.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
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
    MatIconModule,
    LoadingSpinnerComponent,
    DepartmentPieChartComponent,
    DepartmentPositionBarChartComponent,
  ],
})
export class PayrollReportComponent {
  protected readonly payrollService = inject(PayrollService);
  protected readonly report = computed(() => this.payrollService.report());
  protected readonly employees = computed(() =>
    this.payrollService.employees(),
  );

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

  downloadPdf(): void {
    this.payrollService.exportToPdf();
  }
}
