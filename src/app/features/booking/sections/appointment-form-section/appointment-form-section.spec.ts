import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppointmentFormSection } from './appointment-form-section';

describe('AppointmentFormSection', () => {
  let component: AppointmentFormSection;
  let fixture: ComponentFixture<AppointmentFormSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentFormSection],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointmentFormSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
