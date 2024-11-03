import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { map, startWith } from 'rxjs/operators';

import { PayrollFileUploadComponent } from './components/payroll-file-upload/payroll-file-upload.component';
import { PayrollListComponent } from './components/payroll-list/payroll-list.component';
import { PayrollReportComponent } from './components/payroll-report/payroll-report.component';
import { PersonalInfoComponent } from './components/personal-info/personal-info.component';
import { Employee } from './models/payroll.model';
import { PayrollService } from './services/payroll.service';

@Component({
  selector: 'app-payrolls',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    PayrollFileUploadComponent,
    PayrollListComponent,
    PayrollReportComponent,
    PersonalInfoComponent,
  ],
  templateUrl: './payrolls.component.html',
  styleUrls: ['./payrolls.component.scss'],
})
export class PayrollsComponent {
  protected readonly payrollService = inject(PayrollService);
  protected readonly selectedEmployee = signal<Employee | null>(null);
  protected readonly employeeSearchControl = new FormControl('');

  protected readonly filteredEmployees = computed(() => {
    const searchValue = this.searchValue()?.toLowerCase();
    if (!searchValue) return this.payrollService.employees().data;

    return this.payrollService
      .employees()
      .data.filter(
        (employee) =>
          employee.fullName.toLowerCase().includes(searchValue) ||
          employee.code.toLowerCase().includes(searchValue),
      );
  });

  private readonly searchValue = toSignal(
    this.employeeSearchControl.valueChanges.pipe(
      startWith(''),
      map((value) => (typeof value === 'string' ? value : '')),
    ),
  );

  protected displayFn(employee: Employee): string {
    return employee ? `${employee.fullName} (${employee.code})` : '';
  }

  protected onEmployeeSelected(event: MatAutocompleteSelectedEvent): void {
    this.selectedEmployee.set(event.option.value);
  }
}
