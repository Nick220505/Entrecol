import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { Employee } from '@payrolls/models/payroll.model';
import { PayrollService } from '@payrolls/services/payroll.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    LoadingSpinnerComponent,
  ],
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent {
  private readonly payrollService = inject(PayrollService);
  readonly employee = input.required<Employee>();

  protected readonly personalInfo = computed(() =>
    this.payrollService.personalInfo(),
  );

  constructor() {
    effect(
      () => {
        if (this.employee()) {
          this.payrollService.getPersonalInfo(this.employee().id);
        }
      },
      { allowSignalWrites: true },
    );
  }
}
