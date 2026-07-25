import { Injectable } from '@angular/core';
import { supabase } from '../../../core/supabase.client';
import { MemberBooking } from '../../models/member-booking.model';
import { toGermanDate } from '../../utils/date.util';

interface BookingRow {
  status: string;
  user_id: string | null;
  appointments: {
    type:  string;
    date:  string;
    time:  string;
    price: number;
  } | null;
}

/** Buchungen des eingeloggten Users – für den Mitgliederbereich. */
@Injectable({ providedIn: 'root' })
export class MemberBookingService {

  async getMyBookings(): Promise<MemberBooking[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Zusätzlich zur RLS explizit auf die eigene user_id filtern: der Admin
    // sähe über seine Policy sonst alle Buchungen.
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        status,
        user_id,
        appointments (
          type,
          date,
          time,
          price
        )
      `)
      .eq('user_id', user.id)
      .in('status', ['paid', 'pending'])
      .returns<BookingRow[]>();

    if (error) throw error;

    return (data ?? [])
      .map(row => ({
        type:   this.typeLabel(row.appointments?.type),
        date:   toGermanDate(row.appointments?.date),
        time:   (row.appointments?.time ?? '').slice(0, 5),
        status: row.status === 'paid' ? 'Abgeschlossen' : 'Ausstehend',
        price:  row.appointments?.price ?? 0,
      }) as MemberBooking)
      .sort((a, b) => a.date.localeCompare(b.date));
  }

  private typeLabel(type: string | undefined): string {
    switch (type) {
      case 'livetrading': return 'Live Trading';
      case 'community':   return 'Community';
      case 'mentoring':   return 'Mentoring';
      default:            return 'Buchung';
    }
  }
}
