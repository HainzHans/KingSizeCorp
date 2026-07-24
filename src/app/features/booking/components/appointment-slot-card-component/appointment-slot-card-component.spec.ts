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
    fixture.componentRef.setInput('slot', {
      id: 'a1', type: 'mentoring', date: '2026-01-01', time: '14:00:00',
      price: 1600, stripe_price_id: null, status: 'available', created_at: '',
    });
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
