import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitasMain } from './citas-main';

describe('CitasMain', () => {
  let component: CitasMain;
  let fixture: ComponentFixture<CitasMain>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CitasMain]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitasMain);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
