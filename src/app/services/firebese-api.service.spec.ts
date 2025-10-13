import { TestBed } from '@angular/core/testing';

import { FirebeseApiService } from './firebese-api.service';

describe('FirebeseApiService', () => {
  let service: FirebeseApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebeseApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
