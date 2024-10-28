import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
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
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LoadingSpinnerComponent } from '@shared/components/loading-spinner/loading-spinner.component';
import { EmptyPipe } from '@shared/pipes/empty.pipe';
import { PayrollUploadComponent } from '../../components/payroll-upload/payroll-upload.component';
import { Employee } from '../../models/payroll.model';
import { PayrollsService } from '../../services/payrolls.service';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    CurrencyPipe,
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
    LoadingSpinnerComponent,
    EmptyPipe,
    PayrollUploadComponent,
  ],
  templateUrl: './payroll-list.component.html',
  styleUrl: './payroll-list.component.scss',
})
export class PayrollListComponent implements OnInit, AfterViewInit {
  protected readonly payrollsService = inject(PayrollsService);
  protected readonly employees = computed(() =>
    this.payrollsService.employees()
  );
  protected readonly dataSource = computed(() => {
    const source = new MatTableDataSource<Employee>(this.employees().data);
    source.paginator = this.paginator() ?? null;
    source.sort = this.sort() ?? null;
    return source;
  });
  protected readonly displayedColumns = [
    'fullName',
    'code',
    'department',
    'position',
    'hireDate',
    'eps',
    'arl',
    'pensionFund',
    'salary',
  ];
  protected readonly paginator = viewChild(MatPaginator);
  protected readonly sort = viewChild(MatSort);

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.payrollsService.getAll();
  }

  ngAfterViewInit() {
    const card = this.elementRef.nativeElement.querySelector('mat-card');

    if (card) {
      card.addEventListener('mousemove', (e: MouseEvent) => {
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
