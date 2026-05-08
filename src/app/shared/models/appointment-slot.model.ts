export interface AppointmentSlot {
  id?: number;
  date: string;
  time: string;

  booked_appointment_id?: number | null;
}
