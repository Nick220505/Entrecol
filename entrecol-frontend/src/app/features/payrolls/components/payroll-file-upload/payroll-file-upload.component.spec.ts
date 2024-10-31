import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollFileUploadComponent } from './payroll-file-upload.component';

describe('PayrollFileUploadComponent', () => {
  let component: PayrollFileUploadComponent;
  let fixture: ComponentFixture<PayrollFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollFileUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PayrollFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
