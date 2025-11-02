import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalMedicine } from './modal-medicine';

describe('ModalMedicine', () => {
  let component: ModalMedicine;
  let fixture: ComponentFixture<ModalMedicine>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalMedicine]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalMedicine);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
