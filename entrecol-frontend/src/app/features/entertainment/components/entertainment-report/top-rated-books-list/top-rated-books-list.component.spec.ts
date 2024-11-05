import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopRatedBooksListComponent } from './top-rated-books-list.component';

describe('TopRatedBooksListComponent', () => {
  let component: TopRatedBooksListComponent;
  let fixture: ComponentFixture<TopRatedBooksListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopRatedBooksListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopRatedBooksListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
