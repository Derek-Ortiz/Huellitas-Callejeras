import { TestBed } from '@angular/core/testing';

import { MedicineModalSwitch } from './medicine-modal-switch';

describe('MedicineModalSwitch', () => {
  let service: MedicineModalSwitch;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicineModalSwitch);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
