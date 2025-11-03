import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTreatment } from './add-treatment';

describe('AddTreatment', () => {
  let component: AddTreatment;
  let fixture: ComponentFixture<AddTreatment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddTreatment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTreatment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
