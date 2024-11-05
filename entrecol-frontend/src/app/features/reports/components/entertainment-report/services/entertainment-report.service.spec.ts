import { TestBed } from '@angular/core/testing';

import { EntertainmentReportService } from './entertainment-report.service';

describe('EntertainmentReportService', () => {
  let service: EntertainmentReportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntertainmentReportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
