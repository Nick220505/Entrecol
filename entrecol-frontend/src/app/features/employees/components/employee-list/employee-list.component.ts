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
import { Employee } from '@employees/models/payroll.model';
import { PayrollService } from '@employees/services/payroll.service';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { CustomPaginatorIntl } from '@shared/config/paginator-intl.config';
import { EmptyPipe } from '@shared/pipes/empty.pipe';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    CurrencyPipe,
    DatePipe,
    LoadingSpinnerComponent,
    EmptyPipe,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  protected readonly payrollService = inject(PayrollService);
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly sort = viewChild(MatSort);
  protected readonly dataSource = computed(() =>
    Object.assign(
      new MatTableDataSource<Employee>(this.payrollService.employees().data),
      {
        paginator: this.paginator(),
        sort: this.sort(),
        sortingDataAccessor: (item: Employee, property: string) => {
          switch (property) {
            case 'department':
              return item.department.name;
            case 'position':
              return item.position.name;
            case 'eps':
              return item.eps.name;
            case 'arl':
              return item.arl.name;
            case 'pensionFund':
              return item.pensionFund.name;
            default:
              return item[property as keyof Employee];
          }
        },
      },
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
