import { TestBed } from '@angular/core/testing';

import { TeamLeaderService } from './teamleader.service';

describe('TeamleaderService', () => {
  let service: TeamLeaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeamLeaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
