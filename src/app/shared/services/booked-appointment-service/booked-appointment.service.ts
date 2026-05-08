import { Injectable } from '@angular/core';
import {supabase} from '../../../core/supabase.client';
import {BookedAppointment} from '../../models/booked-appointment.model';

@Injectable({
  providedIn: 'root',
})
export class BookedAppointmentService {

  async getUpcomingBooked(): Promise<BookedAppointment[]> {
    const today = new Date();
    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

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
      .eq('status', 'paid');

    if (error) throw error;

    return (data ?? [])
      .map((b: any) => ({
        id:             b.appointments?.id,
        date:           b.appointments?.date,
        time:           b.appointments?.time,
        type:           b.appointments?.type,
        price:          b.appointments?.price,
        customer_name:  b.customer_name,
        customer_email: b.customer_email,
        customer_phone: b.customer_phone,
      }))
      .filter(b => b.date >= dateStr)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      });
  }

}
