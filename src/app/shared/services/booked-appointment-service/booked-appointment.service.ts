import { Injectable } from '@angular/core';
import {supabase} from '../../../core/supabase.client';
import {BookedAppointment} from '../../models/booked-appointment.model';
import {todayIsoDate} from '../../utils/date.util';

/** Rohform der Join-Abfrage: eine Buchung samt zugehörigem Termin. */
interface BookingWithAppointment {
  customer_name:  string;
  customer_email: string;
  customer_phone: string;
  appointments: {
    id:    string;
    date:  string;
    time:  string;
    type:  string;
    price: number;
  } | null;
}

@Injectable({
  providedIn: 'root',
})
export class BookedAppointmentService {

  async getUpcomingBooked(): Promise<BookedAppointment[]> {
    const today = todayIsoDate();

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        customer_name,
        customer_email,
        customer_phone,
        appointments (
          id,
          date,
          time,
          type,
          price
        )
      `)
      .eq('status', 'paid')
      .returns<BookingWithAppointment[]>();

    if (error) throw error;

    return (data ?? [])
      .map(booking => ({
        id:             booking.appointments?.id,
        date:           booking.appointments?.date,
        time:           booking.appointments?.time,
        type:           booking.appointments?.type,
        price:          booking.appointments?.price,
        customer_name:  booking.customer_name,
        customer_email: booking.customer_email,
        customer_phone: booking.customer_phone,
      }) as BookedAppointment)
      .filter(appointment => appointment.date >= today)
      .sort((a, b) =>
        a.date !== b.date
          ? a.date.localeCompare(b.date)
          : a.time.localeCompare(b.time)
      );
  }

}
