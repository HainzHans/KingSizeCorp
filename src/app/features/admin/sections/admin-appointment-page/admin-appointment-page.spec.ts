import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAppointmentPage } from './admin-appointment-page';

describe('AdminAppointmentPage', () => {
  let component: AdminAppointmentPage;
  let fixture: ComponentFixture<AdminAppointmentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAppointmentPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminAppointmentPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
