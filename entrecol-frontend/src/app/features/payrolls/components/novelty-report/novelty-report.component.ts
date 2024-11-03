import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
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

import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmployeeNovelty } from '../../models/novelty-report.model';
import { PayrollService } from '../../services/payroll.service';

@Component({
  selector: 'app-novelty-report',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './novelty-report.component.html',
  styleUrl: './novelty-report.component.scss',
})
export class NoveltyReportComponent {
  protected readonly payrollService = inject(PayrollService);
  protected readonly report = computed(() =>
    this.payrollService.noveltyReport(),
  );

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

  protected readonly displayedColumns = [
    'fullName',
    'code',
    'departmentName',
    'positionName',
    'noveltyType',
    'startDate',
    'endDate',
  ];

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
    if (employee.bonus > 0) types.push('Bonificación');
    if (employee.transportAllowance > 0) types.push('Auxilio de Transporte');
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
}
