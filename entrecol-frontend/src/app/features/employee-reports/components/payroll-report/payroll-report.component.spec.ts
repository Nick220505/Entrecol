import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

import { PayrollService } from '@app/features/employee-reports/services/payroll.service';
import { DepartmentPieChartComponent } from './department-pie-chart/department-pie-chart.component';
import { DepartmentPositionBarChartComponent } from './department-position-bar-chart/department-position-bar-chart.component';
import { PayrollReportComponent } from './payroll-report.component';

describe('PayrollReportComponent', () => {
  let component: PayrollReportComponent;
  let fixture: ComponentFixture<PayrollReportComponent>;
  let payrollService: jasmine.SpyObj<PayrollService>;

  const mockEmployeeReport = {
    totalEmployees: 5,
    employees: [
      {
        id: 1,
        fullName: 'John Doe',
        code: 'EMP001',
        department: { id: 1, name: 'Technology' },
        position: { id: 1, name: 'Developer' },
        hireDate: new Date(),
        salary: 5000,
        eps: { id: 1, name: 'EPS1' },
        arl: { id: 1, name: 'ARL1' },
        pensionFund: { id: 1, name: 'Pension1' },
      },
    ],
    departmentStats: {
      Technology: 3,
      Sales: 2,
    },
    departmentPositionStats: {
      Technology: {
        Developer: 2,
        Manager: 1,
      },
      Sales: {
        Representative: 2,
      },
    },
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PayrollService', ['getEmployeeReport']);
    spy.getEmployeeReport.and.returnValue(of(mockEmployeeReport));

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        MatCardModule,
        MatButtonModule,
        MatTableModule,
        PayrollReportComponent,
        DepartmentPieChartComponent,
        DepartmentPositionBarChartComponent,
      ],
      providers: [{ provide: PayrollService, useValue: spy }],
    }).compileComponents();

    payrollService = TestBed.inject(
      PayrollService,
    ) as jasmine.SpyObj<PayrollService>;
    fixture = TestBed.createComponent(PayrollReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load report on init', () => {
    expect(payrollService.getEmployeeReport).toHaveBeenCalledWith('asc');
    expect(component.report$()).toBeTruthy();
  });

  it('should process department stats correctly', () => {
    expect(component.departmentChartData).toEqual([
      { name: 'Technology', value: 3 },
      { name: 'Sales', value: 2 },
    ]);
  });

  it('should process department-position stats correctly', () => {
    expect(component.departmentPositionChartData.length).toBe(2);
    expect(component.departmentPositionChartData[0].name).toBe('Technology');
    expect(component.departmentPositionChartData[0].series.length).toBe(2);
  });

  it('should update yAxisTicks based on max value', () => {
    expect(component.yAxisTicks).toEqual([0, 1, 2]);
  });

  it('should format position names correctly', () => {
    expect(component.formatPositionName('seniorDeveloper')).toBe(
      'Senior Developer',
    );
    expect(component.formatPositionName('CEO')).toBe('CEO');
  });

  it('should toggle sort order and reload data', () => {
    component.toggleSort();
    expect(component.sortOrder()).toBe('desc');
    expect(payrollService.getEmployeeReport).toHaveBeenCalledWith('desc');
  });

  it('should render employee table', () => {
    const table = fixture.nativeElement.querySelector('table');
    expect(table).toBeTruthy();
  });

  it('should render pie chart component', () => {
    const pieChart = fixture.nativeElement.querySelector(
      'app-department-pie-chart',
    );
    expect(pieChart).toBeTruthy();
  });

  it('should render bar chart component', () => {
    const barChart = fixture.nativeElement.querySelector(
      'app-department-position-bar-chart',
    );
    expect(barChart).toBeTruthy();
  });

  it('should display total employees', () => {
    const totalText = fixture.nativeElement.querySelector('h2');
    expect(totalText.textContent).toContain('5');
  });

  it('should have correct table columns', () => {
    expect(component.displayedColumns).toEqual([
      'fullName',
      'code',
      'department',
      'position',
    ]);
  });

  it('should handle empty data', () => {
    const emptyReport = {
      totalEmployees: 0,
      employees: [],
      departmentStats: {},
      departmentPositionStats: {},
    };

    payrollService.getEmployeeReport.and.returnValue(of(emptyReport));
    component.loadReport();
    fixture.detectChanges();

    expect(component.departmentChartData).toEqual([]);
    expect(component.departmentPositionChartData).toEqual([]);
    expect(component.yAxisTicks).toEqual([0]);
  });
});
