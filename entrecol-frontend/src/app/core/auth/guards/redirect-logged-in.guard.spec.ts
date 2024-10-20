import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { redirectLoggedInGuard } from './redirect-logged-in.guard';

describe('redirectLoggedInGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      redirectLoggedInGuard(...guardParameters),
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
