import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalTreatment } from './modal-treatment';

describe('ModalTreatment', () => {
  let component: ModalTreatment;
  let fixture: ComponentFixture<ModalTreatment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalTreatment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalTreatment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
