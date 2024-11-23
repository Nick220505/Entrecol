import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Employee } from '@employees/models/payroll.model';
import { ARLService } from '@employees/services/arl.service';
import { DepartmentService } from '@employees/services/department.service';
import { EPSService } from '@employees/services/eps.service';
import { PayrollService } from '@employees/services/payroll.service';
import { PensionFundService } from '@employees/services/pension-fund.service';
import { PositionService } from '@employees/services/position.service';

@Component({
    selector: 'app-employee-dialog',
    imports: [
        ReactiveFormsModule,
        MatDialogModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatProgressSpinnerModule,
        MatIconModule,
    ],
    templateUrl: './employee-dialog.component.html',
    styleUrl: './employee-dialog.component.scss'
})
export class EmployeeDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(MatDialogRef<EmployeeDialogComponent>);
  protected readonly data = inject<Employee | undefined>(MAT_DIALOG_DATA);
  protected readonly payrollService = inject(PayrollService);
  protected readonly departmentService = inject(DepartmentService);
  protected readonly positionService = inject(PositionService);
  protected readonly epsService = inject(EPSService);
  protected readonly arlService = inject(ARLService);
  protected readonly pensionFundService = inject(PensionFundService);

  protected readonly form: FormGroup = this.fb.group({
    fullName: [this.data?.fullName ?? '', [Validators.required]],
    code: [this.data?.code ?? '', [Validators.required]],
    departmentId: [this.data?.department?.id ?? '', [Validators.required]],
    positionId: [this.data?.position?.id ?? '', [Validators.required]],
    hireDate: [this.data?.hireDate ?? '', [Validators.required]],
    epsId: [this.data?.eps?.id ?? '', [Validators.required]],
    arlId: [this.data?.arl?.id ?? '', [Validators.required]],
    pensionFundId: [this.data?.pensionFund?.id ?? '', [Validators.required]],
    salary: [this.data?.salary ?? '', [Validators.required]],
  });

  ngOnInit(): void {
    this.departmentService.getAll();
    this.positionService.getAll();
    this.epsService.getAll();
    this.arlService.getAll();
    this.pensionFundService.getAll();

    if (this.data) {
      this.form.patchValue({
        code: this.data.code,
        fullName: this.data.fullName,
        departmentId: this.data.department.id,
        positionId: this.data.position.id,
        hireDate: this.data.hireDate,
        epsId: this.data.eps.id,
        arlId: this.data.arl.id,
        pensionFundId: this.data.pensionFund.id,
        salary: this.data.salary,
      });
    }
  }

  protected onSubmit(): void {
    if (this.form.valid) {
      if (this.data) {
        this.payrollService.update(this.data.id, this.form.value);
      } else {
        this.payrollService.create(this.form.value);
      }
      this.dialogRef.close(true);
    }
  }

  protected onCancel(): void {
    this.dialogRef.close(false);
  }
}
