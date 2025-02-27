import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

import { PayrollService } from '@employees/services/payroll.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { DepartmentPieChartComponent } from './department-pie-chart/department-pie-chart.component';
import { DepartmentPositionBarChartComponent } from './department-position-bar-chart/department-position-bar-chart.component';

@Component({
    selector: 'app-payroll-report',
    templateUrl: './payroll-report.component.html',
    styleUrl: './payroll-report.component.scss',
    imports: [
        MatCardModule,
        MatButtonModule,
        MatTableModule,
        MatIconModule,
        LoadingSpinnerComponent,
        DepartmentPieChartComponent,
        DepartmentPositionBarChartComponent,
    ]
})
export class PayrollReportComponent {
  protected readonly payrollService = inject(PayrollService);

  downloadPdf(): void {
    this.payrollService.exportToPdf();
  }
}
