import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { PayrollService } from '@payrolls/services/payroll.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EpsDepartmentBarChartComponent } from '../eps-department-bar-chart/eps-department-bar-chart.component';
import { EpsPieChartComponent } from '../eps-pie-chart/eps-pie-chart.component';
import { PensionDepartmentBarChartComponent } from '../pension-department-bar-chart/pension-department-bar-chart.component';
import { PensionPieChartComponent } from '../pension-pie-chart/pension-pie-chart.component';

@Component({
  selector: 'app-health-pension-report',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    LoadingSpinnerComponent,
    EpsPieChartComponent,
    PensionPieChartComponent,
    EpsDepartmentBarChartComponent,
    PensionDepartmentBarChartComponent,
  ],
  templateUrl: './health-pension-report.component.html',
  styleUrl: './health-pension-report.component.scss',
})
export class HealthPensionReportComponent {
  protected readonly payrollService = inject(PayrollService);
  protected readonly report = computed(() =>
    this.payrollService.healthPensionReport(),
  );
  protected readonly employees = computed(() =>
    this.payrollService.employees(),
  );

  constructor() {
    effect(
      () => {
        if (this.payrollService.employees().data.length > 0) {
          this.payrollService.getHealthPensionReport();
        }
      },
      { allowSignalWrites: true },
    );
  }

  downloadPdf(): void {
    this.payrollService.exportHealthPensionReportToPdf();
  }
}
