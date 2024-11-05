import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { HealthPensionReportComponent } from './components/health-pension-report/health-pension-report.component';
import { NoveltyReportComponent } from './components/novelty-report/novelty-report.component';
import { PayrollReportComponent } from './components/payroll-report/payroll-report.component';
import { PersonalInfoReportComponent } from './components/personal-info-report/personal-info-report.component';

@Component({
  selector: 'app-payrolls',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    PayrollReportComponent,
    PersonalInfoReportComponent,
    HealthPensionReportComponent,
    NoveltyReportComponent,
  ],
  templateUrl: './payrolls.component.html',
  styleUrl: './payrolls.component.scss',
})
export class PayrollsComponent {}
