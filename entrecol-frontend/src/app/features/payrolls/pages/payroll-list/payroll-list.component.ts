import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { PayrollUploadComponent } from '../../components/payroll-upload/payroll-upload.component';
import { PayrollsService } from '../../services/payrolls.service';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    LoadingSpinnerComponent,
    PayrollUploadComponent,
  ],
  templateUrl: './payroll-list.component.html',
  styleUrl: './payroll-list.component.scss',
})
export class PayrollListComponent implements OnInit {
  protected readonly payrollsService = inject(PayrollsService);
  protected readonly employees = computed(() =>
    this.payrollsService.employees()
  );

  ngOnInit(): void {
    this.payrollsService.getAll();
  }

  onPageChange(event: any): void {
    this.payrollsService.getAll(event.pageIndex, event.pageSize);
  }
}
