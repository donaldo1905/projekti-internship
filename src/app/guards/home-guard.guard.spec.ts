import { TestBed } from '@angular/core/testing';

import { HomeGuardGuard } from './home-guard.guard';

describe('HomeGuardGuard', () => {
  let guard: HomeGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(HomeGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
