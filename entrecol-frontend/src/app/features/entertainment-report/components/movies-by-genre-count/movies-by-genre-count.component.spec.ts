import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MoviesByGenreCountComponent } from './movies-by-genre-count.component';

describe('MoviesByGenreCountComponent', () => {
  let component: MoviesByGenreCountComponent;
  let fixture: ComponentFixture<MoviesByGenreCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoviesByGenreCountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MoviesByGenreCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
