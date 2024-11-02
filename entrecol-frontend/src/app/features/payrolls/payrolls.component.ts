import { Component } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PayrollFileUploadComponent } from './components/payroll-file-upload/payroll-file-upload.component';
import { PayrollListComponent } from './components/payroll-list/payroll-list.component';
import { PayrollReportComponent } from './components/payroll-report/payroll-report.component';

@Component({
  selector: 'app-payrolls',
  standalone: true,
  imports: [
    PayrollFileUploadComponent,
    PayrollListComponent,
    PayrollReportComponent,
    MatSnackBarModule,
  ],
  templateUrl: './payrolls.component.html',
  styleUrl: './payrolls.component.scss',
})
export class PayrollsComponent {}
