import { TestBed } from '@angular/core/testing';

import { ProposeideaService } from './proposeidea.service';

describe('ProposeideaService', () => {
  let service: ProposeideaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProposeideaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
