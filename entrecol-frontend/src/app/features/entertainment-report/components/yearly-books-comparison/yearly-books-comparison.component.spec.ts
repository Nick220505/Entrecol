import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YearlyBooksComparisonComponent } from './yearly-books-comparison.component';

describe('YearlyBooksComparisonComponent', () => {
  let component: YearlyBooksComparisonComponent;
  let fixture: ComponentFixture<YearlyBooksComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YearlyBooksComparisonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YearlyBooksComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
