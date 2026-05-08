import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentSlotCardComponent } from './appointment-slot-card-component';

describe('AppointmentSlotCardComponent', () => {
  let component: AppointmentSlotCardComponent;
  let fixture: ComponentFixture<AppointmentSlotCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentSlotCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentSlotCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
