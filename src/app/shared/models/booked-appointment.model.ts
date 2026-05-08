import {AppointmentSlot} from './appointment-slot.model';

export interface BookedAppointmentDB {
  id?: number;
  name: string;
  email: string;
  telephone: string;

  slot_id: number;
  appointments_slots?: AppointmentSlot;
}
