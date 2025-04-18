import { TestBed } from '@angular/core/testing';

import { SagaService } from './saga.service';

describe('SagaService', () => {
  let service: SagaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SagaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
