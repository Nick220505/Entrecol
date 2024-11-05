import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { EntertainmentReportComponent } from './components/entertainment-report/entertainment-report.component';
import { HealthPensionReportComponent } from './components/health-pension-report/health-pension-report.component';
import { NoveltyReportComponent } from './components/novelty-report/novelty-report.component';
import { PayrollReportComponent } from './components/payroll-report/payroll-report.component';
import { PersonalInfoReportComponent } from './components/personal-info-report/personal-info-report.component';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatIconModule,
    PayrollReportComponent,
    PersonalInfoReportComponent,
    HealthPensionReportComponent,
    NoveltyReportComponent,
    EntertainmentReportComponent,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss',
})
export class ReportsComponent {}
