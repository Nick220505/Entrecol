import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntertainmentReportFiltersComponent } from './entertainment-report-filters.component';

describe('EntertainmentReportFiltersComponent', () => {
  let component: EntertainmentReportFiltersComponent;
  let fixture: ComponentFixture<EntertainmentReportFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EntertainmentReportFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EntertainmentReportFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
