import { TestBed } from '@angular/core/testing';

import { ChoiseService } from './choise.service';

describe('ChoiseService', () => {
  let service: ChoiseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChoiseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
