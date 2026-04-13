import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { pendingChangesGuard } from './pending-changes-guard';

describe('unsaveFormGuard', () => {
  const executeGuard: CanDeactivateFn<any> = (...guardParameters) =>
    TestBed.runInInjectionContext(() => pendingChangesGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
