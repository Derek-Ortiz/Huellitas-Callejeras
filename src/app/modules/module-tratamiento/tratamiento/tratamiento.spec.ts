import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tratamiento } from './tratamiento';

describe('Tratamiento', () => {
  let component: Tratamiento;
  let fixture: ComponentFixture<Tratamiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Tratamiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tratamiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
