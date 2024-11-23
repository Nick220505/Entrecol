import { Component, effect, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { PayrollService } from '@employees/services/payroll.service';
import { EntertainmentReportComponent } from './components/entertainment-report/entertainment-report.component';
import { HealthPensionReportComponent } from './components/health-pension-report/health-pension-report.component';
import { NoveltyReportComponent } from './components/novelty-report/novelty-report.component';
import { PayrollReportComponent } from './components/payroll-report/payroll-report.component';
import { PersonalInfoReportComponent } from './components/personal-info-report/personal-info-report.component';

@Component({
    selector: 'app-reports',
    imports: [
        MatTabsModule,
        MatIconModule,
        PayrollReportComponent,
        PersonalInfoReportComponent,
        HealthPensionReportComponent,
        NoveltyReportComponent,
        EntertainmentReportComponent,
    ],
    templateUrl: './reports.component.html',
    styleUrl: './reports.component.scss'
})
export class ReportsComponent {
  private readonly payrollService = inject(PayrollService);

  constructor() {
    effect(
      () => {
        if (!this.payrollService.fileUploaded()) {
          this.payrollService.getAll();
        }
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        if (!this.payrollService.employees().initialLoad) {
          this.payrollService.getEmployeeReport();
        }
      },
      { allowSignalWrites: true },
    );
  }
}
