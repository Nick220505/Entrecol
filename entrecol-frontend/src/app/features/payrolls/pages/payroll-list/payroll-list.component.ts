import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { PayrollService } from '@app/features/payrolls/services/payroll.service';
import { FileUploadComponent } from '@shared/components/file-upload/file-upload.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { CustomPaginatorIntl } from '@shared/config/paginator-intl.config';
import { EmptyPipe } from '@shared/pipes/empty.pipe';
import { Employee } from '../../models/payroll.model';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    CurrencyPipe,
    DatePipe,
    LoadingSpinnerComponent,
    FileUploadComponent,
    EmptyPipe,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  templateUrl: './payroll-list.component.html',
  styleUrl: './payroll-list.component.scss',
})
export class PayrollListComponent implements OnInit {
  protected readonly payrollService = inject(PayrollService);
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly sort = viewChild(MatSort);
  protected readonly dataSource = computed(() =>
    Object.assign(
      new MatTableDataSource<Employee>(this.payrollService.employees().data),
      { paginator: this.paginator(), sort: this.sort() },
    ),
  );

  ngOnInit(): void {
    this.payrollService.getAll();
  }

  applyFilter(event: KeyboardEvent): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource().filter = filterValue.trim().toLowerCase();
    this.dataSource().paginator.firstPage();
  }
}
