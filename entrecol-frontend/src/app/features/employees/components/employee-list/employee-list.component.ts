import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, computed, inject, OnInit, viewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Employee } from '@employees/models/payroll.model';
import { PayrollService } from '@employees/services/payroll.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyPipe } from '@shared/pipes/empty.pipe';
import { EmployeeDialogComponent } from '../employee-dialog/employee-dialog.component';

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
    MatDialogModule,
  ],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss',
})
export class EmployeeListComponent implements OnInit {
  protected readonly payrollService = inject(PayrollService);
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly sort = viewChild(MatSort);
  private readonly dialog = inject(MatDialog);
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

  protected readonly displayedColumns: string[] = [
    'fullName',
    'code',
    'department',
    'position',
    'hireDate',
    'eps',
    'arl',
    'pensionFund',
    'salary',
    'actions',
  ];

  ngOnInit(): void {
    this.payrollService.getAll();
  }

  applyFilter(event: KeyboardEvent): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource().filter = filterValue.trim().toLowerCase();
    this.dataSource().paginator.firstPage();
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      maxHeight: '95vh',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.payrollService.getAll();
      }
    });
  }

  protected openEditDialog(employee: Employee): void {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, {
      width: '800px',
      data: employee,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.payrollService.getAll();
      }
    });
  }

  protected openDeleteDialog(employee: Employee): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Eliminar Empleado',
        message: `¿Está seguro que desea eliminar al empleado ${employee.fullName}?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.payrollService.delete(employee.id);
      }
    });
  }
}
