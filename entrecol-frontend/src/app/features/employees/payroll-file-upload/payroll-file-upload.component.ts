import { Component, inject } from '@angular/core';
import { PayrollService } from '@app/features/employee-reports/services/payroll.service';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';

@Component({
  selector: 'app-payroll-file-upload',
  standalone: true,
  imports: [FileUploadComponent],
  templateUrl: './payroll-file-upload.component.html',
  styleUrl: './payroll-file-upload.component.scss',
})
export class PayrollFileUploadComponent {
  protected readonly payrollService = inject(PayrollService);
}
