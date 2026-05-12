import { TestBed } from '@angular/core/testing';

import { BookedAppointmentService } from './booked-appointment.service';

describe('BookedAppointmentService', () => {
  let service: BookedAppointmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookedAppointmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
