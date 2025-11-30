import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusButtonsComponent } from './status-buttons';

describe('StatusButtonsComponent', () => {
  let component: StatusButtonsComponent;
  let fixture: ComponentFixture<StatusButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StatusButtonsComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
