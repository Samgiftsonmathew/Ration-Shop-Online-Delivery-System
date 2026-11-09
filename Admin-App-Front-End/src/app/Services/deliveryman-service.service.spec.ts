import { TestBed } from '@angular/core/testing';

import { DeliverymanServiceService } from './deliveryman-service.service';

describe('DeliverymanServiceService', () => {
  let service: DeliverymanServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeliverymanServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
