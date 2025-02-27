import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';

import { DatePipe } from '@angular/common';
import { EmployeeNovelty } from '@employees/models/novelty-report.model';
import { PayrollService } from '@employees/services/payroll.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { NoveltyDepartmentChartComponent } from './novelty-department-chart/novelty-department-chart.component';
import { NoveltyDepartmentPositionChartComponent } from './novelty-department-position-chart/novelty-department-position-chart.component';

@Component({
    selector: 'app-novelty-report',
    imports: [
        DatePipe,
        ReactiveFormsModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatTableModule,
        LoadingSpinnerComponent,
        NoveltyDepartmentChartComponent,
        NoveltyDepartmentPositionChartComponent,
    ],
    templateUrl: './novelty-report.component.html',
    styleUrl: './novelty-report.component.scss'
})
export class NoveltyReportComponent {
  protected readonly payrollService = inject(PayrollService);
  protected readonly dateForm = new FormGroup({
    startDate: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(0[1-9]|1[0-2])\/\d{4}$/),
    ]),
    endDate: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(0[1-9]|1[0-2])\/\d{4}$/),
    ]),
  });

  onSearch(): void {
    if (this.dateForm.valid) {
      const { startDate, endDate } = this.dateForm.value;
      this.payrollService.getNoveltyReport(startDate!, endDate!);
    }
  }

  exportToPdf(): void {
    if (this.dateForm.valid) {
      const { startDate, endDate } = this.dateForm.value;
      this.payrollService.exportNoveltyReportToPdf(startDate!, endDate!);
    }
  }

  getNoveltyTypes(employee: EmployeeNovelty): string[] {
    const types = [];
    if (employee.disabilityRecord) types.push('Incapacidad');
    if (employee.vacationRecord) types.push('Vacaciones');
    return types;
  }

  getStartDate(employee: EmployeeNovelty): Date | null {
    if (employee.disabilityRecord && employee.disabilityStartDate) {
      return new Date(employee.disabilityStartDate);
    }
    if (employee.vacationRecord && employee.vacationStartDate) {
      return new Date(employee.vacationStartDate);
    }
    return null;
  }

  getEndDate(employee: EmployeeNovelty): Date | null {
    if (employee.disabilityRecord && employee.disabilityEndDate) {
      return new Date(employee.disabilityEndDate);
    }
    if (employee.vacationRecord && employee.vacationEndDate) {
      return new Date(employee.vacationEndDate);
    }
    return null;
  }

  hasNoveltyInDateRange(employee: EmployeeNovelty): boolean {
    return employee.disabilityRecord || employee.vacationRecord;
  }
}
