import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedienteForm } from './expediente-form';

describe('ExpedienteForm', () => {
  let component: ExpedienteForm;
  let fixture: ComponentFixture<ExpedienteForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpedienteForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExpedienteForm);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});




