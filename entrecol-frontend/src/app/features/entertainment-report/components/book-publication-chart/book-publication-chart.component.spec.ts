import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookPublicationChartComponent } from './book-publication-chart.component';

describe('BookPublicationChartComponent', () => {
  let component: BookPublicationChartComponent;
  let fixture: ComponentFixture<BookPublicationChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookPublicationChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookPublicationChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
