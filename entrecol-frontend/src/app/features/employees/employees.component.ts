import { Component } from '@angular/core';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { PayrollFileUploadComponent } from './payroll-file-upload/payroll-file-upload.component';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [PayrollFileUploadComponent, EmployeeListComponent],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.scss',
})
export class EmployeesComponent {}
