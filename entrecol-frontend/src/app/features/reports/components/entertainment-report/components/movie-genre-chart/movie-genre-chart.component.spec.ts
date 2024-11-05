import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieGenreChartComponent } from './movie-genre-chart.component';

describe('MovieGenreChartComponent', () => {
  let component: MovieGenreChartComponent;
  let fixture: ComponentFixture<MovieGenreChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieGenreChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieGenreChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
