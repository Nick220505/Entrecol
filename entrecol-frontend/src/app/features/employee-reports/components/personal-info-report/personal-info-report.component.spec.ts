import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInfoReportComponent } from './personal-info-report.component';

describe('PersonalinfoReportComponent', () => {
  let component: PersonalInfoReportComponent;
  let fixture: ComponentFixture<PersonalInfoReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonalInfoReportComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonalInfoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
