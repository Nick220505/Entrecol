import { Component } from '@angular/core';
import { PayrollFileUploadComponent } from './components/payroll-file-upload/payroll-file-upload.component';
import { PayrollListComponent } from './components/payroll-list/payroll-list.component';

@Component({
  selector: 'app-payrolls',
  standalone: true,
  imports: [PayrollFileUploadComponent, PayrollListComponent],
  templateUrl: './payrolls.component.html',
  styleUrl: './payrolls.component.scss',
})
export class PayrollsComponent {}
