import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { map, startWith } from 'rxjs/operators';

import { CurrencyPipe, DatePipe } from '@angular/common';
import { Employee } from '@employees/models/payroll.model';
import { PayrollService } from '@employees/services/payroll.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-personal-info-report',
  imports: [
    CurrencyPipe,
    DatePipe,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './personal-info-report.component.html',
  styleUrl: './personal-info-report.component.scss',
})
export class PersonalInfoReportComponent {
  protected readonly payrollService = inject(PayrollService);
  protected readonly employeeSearchControl = new FormControl('');
  protected readonly selectedEmployee = signal<Employee | null>(null);

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

  exportToPdf(): void {
    this.payrollService.exportPersonalInfoToPdf(this.selectedEmployee()!.id);
  }
}
