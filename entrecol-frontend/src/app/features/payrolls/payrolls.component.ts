import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { PayrollService } from './services/payroll.service';

import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { HealthPensionReportComponent } from './components/health-pension-report/health-pension-report.component';
import { NoveltyReportComponent } from './components/novelty-report/novelty-report.component';
import { PayrollFileUploadComponent } from './components/payroll-file-upload/payroll-file-upload.component';
import { PayrollReportComponent } from './components/payroll-report/payroll-report.component';
import { PersonalInfoReportComponent } from './components/personal-info-report/personal-info-report.component';

@Component({
  selector: 'app-payrolls',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    PayrollFileUploadComponent,
    EmployeeListComponent,
    PayrollReportComponent,
    PersonalInfoReportComponent,
    HealthPensionReportComponent,
    NoveltyReportComponent,
  ],
  templateUrl: './payrolls.component.html',
  styleUrl: './payrolls.component.scss',
})
export class PayrollsComponent {
  private readonly payrollService = inject(PayrollService);
  protected readonly selectedTabIndex = signal(0);

  constructor() {
    effect(
      () => {
        if (this.payrollService.fileUploaded()) {
          this.selectedTabIndex.set(1);
          this.payrollService.fileUploaded.set(false);
        }
      },
      { allowSignalWrites: true },
    );
  }
}
