import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DepartmentPieChartComponent } from './department-pie-chart.component';

describe('DepartmentPieChartComponent', () => {
  let component: DepartmentPieChartComponent;
  let fixture: ComponentFixture<DepartmentPieChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxChartsModule, DepartmentPieChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default empty data array', () => {
    expect(component.data).toEqual([]);
  });

  it('should format label correctly', () => {
    expect(component.formatLabel(5)).toBe('5');
    expect(component.formatLabel(0)).toBe('0');
  });

  it('should have correct view dimensions', () => {
    const [width, height] = component.view;
    expect(width).toBe(window.innerWidth / 1.2);
    expect(height).toBe(550);
  });

  it('should have color scheme defined', () => {
    expect(component.colorScheme).toBeDefined();
    expect(component.colorScheme.domain.length).toBeGreaterThan(0);
  });

  it('should render chart when data is provided', () => {
    const testData = [
      { name: 'Technology', value: 5 },
      { name: 'Sales', value: 3 },
    ];
    component.data = testData;
    fixture.detectChanges();

    const chartElement = fixture.nativeElement.querySelector(
      'ngx-charts-pie-chart',
    );
    expect(chartElement).toBeTruthy();
  });
});
