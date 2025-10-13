import { TestBed } from '@angular/core/testing';

import { FluxCombineService } from './flux-combine.service';

describe('FluxCombineService', () => {
  let service: FluxCombineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FluxCombineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
