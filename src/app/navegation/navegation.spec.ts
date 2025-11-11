import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Navegation } from './navegation';

describe('Navegation', () => {
  let component: Navegation;
  let fixture: ComponentFixture<Navegation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Navegation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Navegation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});