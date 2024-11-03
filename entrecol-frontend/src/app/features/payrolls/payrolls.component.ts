import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { PayrollFileUploadComponent } from './components/payroll-file-upload/payroll-file-upload.component';
import { PayrollListComponent } from './components/payroll-list/payroll-list.component';
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
    PayrollListComponent,
    PayrollReportComponent,
    PersonalInfoReportComponent,
  ],
  templateUrl: './payrolls.component.html',
  styleUrls: ['./payrolls.component.scss'],
})
export class PayrollsComponent {}
