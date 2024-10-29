import { CurrencyPipe, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  Component,
  computed,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
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
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { CustomPaginatorIntl } from '@shared/config/paginator-intl.config';
import { EmptyPipe } from '@shared/pipes/empty.pipe';
import { PayrollUploadComponent } from '../../components/payroll-upload/payroll-upload.component';
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
    PayrollUploadComponent,
    EmptyPipe,
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: CustomPaginatorIntl }],
  templateUrl: './payroll-list.component.html',
  styleUrl: './payroll-list.component.scss',
})
export class PayrollListComponent implements OnInit, AfterViewInit {
  private readonly elementRef = inject(ElementRef);
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

  ngAfterViewInit(): void {
    const card = this.elementRef.nativeElement.querySelector('mat-card');

    if (card) {
      card.addEventListener('mousemove', (e: MouseEvent): void => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        card.style.setProperty('--mouse-x', `${x}%`);
        card.style.setProperty('--mouse-y', `${y}%`);
      });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource().filter = filterValue.trim().toLowerCase();
    this.dataSource().paginator?.firstPage();
  }

  getSalaryColor(salary: number): string {
    if (salary >= 5000000) return 'var(--mat-green-500)';
    if (salary >= 3000000) return 'var(--mat-lime-500)';
    if (salary >= 2000000) return 'var(--mat-orange-500)';
    return 'var(--mat-red-500)';
  }
}
