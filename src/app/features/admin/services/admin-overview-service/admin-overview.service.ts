import { Injectable } from '@angular/core';
import {supabase} from '../../../../core/supabase.client';

export interface UserPurchase {
  type:   string;
  date:   string;
  time:   string;
  status: 'Abgeschlossen' | 'Ausstehend';
  price:  number;
}

export interface UserRow {
  email:     string;
  name:      string;
  phone:     string;
  status:    'Abgeschlossen' | 'Ausstehend';
  purchases: UserPurchase[];
}

@Injectable({ providedIn: 'root' })
export class AdminOverviewService {

  async getUsers(): Promise<UserRow[]> {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
    customer_name,
    customer_email,
    customer_phone,
    status,
    appointments (
      type,
      date,
      time,
      price
    )
  `)
      .in('status', ['paid', 'pending']);

    if (error) throw error;

    // ── Nach E-Mail gruppieren ───────────────────────────
    const map = new Map<string, UserRow>();

    for (const booking of data ?? []) {
      const email = booking.customer_email;
      const appt  = booking.appointments as any;

      const purchase: UserPurchase = {
        type:   appt?.type === 'livetrading' ? 'Live Trading' : 'Mentoring',
        date:   this.formatDate(appt?.date ?? ''),
        time:   (appt?.time ?? '').slice(0, 5),
        status: booking.status === 'paid' ? 'Abgeschlossen' : 'Ausstehend',
        price:  appt?.price ?? 0,
      };

      if (map.has(email)) {
        map.get(email)!.purchases.push(purchase);
      } else {
        map.set(email, {
          email,
          name:      booking.customer_name,
          phone:     booking.customer_phone,
          status:    'Abgeschlossen',
          purchases: [purchase],
        });
      }
    }

    // ── User-Status berechnen ────────────────────────────
    for (const user of map.values()) {
      if (user.purchases.some(p => p.status === 'Ausstehend')) {
        user.status = 'Ausstehend';
      }
    }

    return Array.from(map.values());
  }

  private formatDate(date: string): string {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    return `${day}.${month}.${year}`;
  }
}
