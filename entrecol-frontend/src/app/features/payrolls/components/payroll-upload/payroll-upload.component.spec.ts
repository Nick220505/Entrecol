import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollUploadComponent } from './payroll-upload.component';

describe('PayrollUploadComponent', () => {
  let component: PayrollUploadComponent;
  let fixture: ComponentFixture<PayrollUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PayrollUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
