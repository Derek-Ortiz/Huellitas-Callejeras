import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasEdit } from './citas-edit';

describe('CitasEdit', () => {
  let component: CitasEdit;
  let fixture: ComponentFixture<CitasEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CitasEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
