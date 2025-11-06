import { TestBed } from '@angular/core/testing';

import { TreatmentModal } from './treatment-modal';

describe('TreatmentModal', () => {
  let service: TreatmentModal;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TreatmentModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
