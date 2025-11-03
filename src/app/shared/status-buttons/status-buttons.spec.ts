import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusButtons } from './status-buttons';

describe('StatusButtons', () => {
  let component: StatusButtons;
  let fixture: ComponentFixture<StatusButtons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusButtons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusButtons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
