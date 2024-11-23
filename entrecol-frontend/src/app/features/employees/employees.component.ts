import { Component } from '@angular/core';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { PayrollFileUploadComponent } from './components/payroll-file-upload/payroll-file-upload.component';

@Component({
    selector: 'app-employees',
    imports: [PayrollFileUploadComponent, EmployeeListComponent],
    templateUrl: './employees.component.html',
    styleUrl: './employees.component.scss'
})
export class EmployeesComponent {}
