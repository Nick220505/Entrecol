import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookFileUploadComponent } from './book-file-upload.component';

describe('BookFileUploadComponent', () => {
  let component: BookFileUploadComponent;
  let fixture: ComponentFixture<BookFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookFileUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
