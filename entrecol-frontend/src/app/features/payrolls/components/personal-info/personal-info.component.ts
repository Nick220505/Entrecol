import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { map, startWith } from 'rxjs/operators';

import { Employee } from '@payrolls/models/payroll.model';
import { PayrollService } from '@payrolls/services/payroll.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent {
  private readonly payrollService = inject(PayrollService);
  protected readonly employeeSearchControl = new FormControl('');
  protected readonly selectedEmployee = signal<Employee | null>(null);

  protected readonly personalInfo = computed(() =>
    this.payrollService.personalInfo(),
  );

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

  displayFn(employee: Employee): string {
    return employee ? `${employee.fullName} (${employee.code})` : '';
  }

  onEmployeeSelected(event: MatAutocompleteSelectedEvent): void {
    const employee = event.option.value as Employee;
    this.selectedEmployee.set(employee);
    this.payrollService.getPersonalInfo(employee.id);
  }
}
