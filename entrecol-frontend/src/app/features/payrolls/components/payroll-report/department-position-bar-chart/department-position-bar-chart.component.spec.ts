import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DepartmentPositionBarChartComponent } from './department-position-bar-chart.component';

describe('DepartmentPositionBarChartComponent', () => {
  let component: DepartmentPositionBarChartComponent;
  let fixture: ComponentFixture<DepartmentPositionBarChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxChartsModule, DepartmentPositionBarChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DepartmentPositionBarChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default empty data array', () => {
    expect(component.data).toEqual([]);
  });

  it('should have default yAxisTicks', () => {
    expect(component.yAxisTicks).toEqual([0, 1, 2, 3]);
  });

  it('should format Y axis ticks correctly', () => {
    expect(component.formatYAxisTick(5.6)).toBe('6');
    expect(component.formatYAxisTick(5.1)).toBe('5');
    expect(component.formatYAxisTick(0)).toBe('0');
  });

  it('should format X axis ticks correctly', () => {
    const longText =
      'This is a very long department name that should be truncated';
    const shortText = 'Short name';

    expect(component.formatXAxisTick(longText)).toBe('This is a very l...');
    expect(component.formatXAxisTick(shortText)).toBe(shortText);
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
      {
        name: 'Technology',
        series: [
          { name: 'Developer', value: 5 },
          { name: 'Manager', value: 2 },
        ],
      },
    ];
    component.data = testData;
    fixture.detectChanges();

    const chartElement = fixture.nativeElement.querySelector(
      'ngx-charts-bar-vertical-2d',
    );
    expect(chartElement).toBeTruthy();
  });

  it('should update yAxisTicks when provided', () => {
    const newTicks = [0, 1, 2, 3, 4, 5];
    component.yAxisTicks = newTicks;
    expect(component.yAxisTicks).toEqual(newTicks);
  });
});
