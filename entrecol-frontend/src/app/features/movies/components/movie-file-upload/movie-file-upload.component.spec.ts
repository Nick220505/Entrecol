import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieFileUploadComponent } from './movie-file-upload.component';

describe('MovieFileUploadComponent', () => {
  let component: MovieFileUploadComponent;
  let fixture: ComponentFixture<MovieFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieFileUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
