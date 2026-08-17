import { AppointmentType } from './appointment.model';

export interface BookingPayload {
  // Buchung MIT Termin: appointment_id wird gesetzt.
  // Buchung OHNE Termin: appointment_id entfällt, stattdessen wird der
  // Produkttyp mitgegeben, damit das Backend Preis/Produkt bestimmen kann.
  appointment_id?: string;
  type?:           AppointmentType;
  customer_name:   string;
  customer_email:  string;
  customer_phone:  string;
}
