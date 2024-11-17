import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherDialogComponent } from './publisher-dialog.component';

describe('PublisherDialogComponent', () => {
  let component: PublisherDialogComponent;
  let fixture: ComponentFixture<PublisherDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublisherDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublisherDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
