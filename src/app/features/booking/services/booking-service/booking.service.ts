import { Injectable } from '@angular/core';
import {supabase} from '../../../../core/supabase.client';

export interface BookedAppointment {
  id:             string;
  date:           string;
  time:           string;
  type:           string;
  price:          number;
  customer_name:  string;
  customer_email: string;
  customer_phone: string;
}

export interface CreateBookingPayload {
  appointment_id:  string;
  customer_name:   string;
  customer_email:  string;
  customer_phone:  string;
}

export interface CreateCommunityBookingPayload {
  customer_name:  string;
  customer_email: string;
  customer_phone: string;
}

@Injectable({ providedIn: 'root' })
export class BookingService {

  async createCheckout(payload: CreateBookingPayload): Promise<string> {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: payload,
    });

    if (error) throw error;
    if (!data?.url) throw new Error('Keine Checkout-URL erhalten.');

    return data.url as string;
  }

  async createCommunityCheckout(payload: CreateCommunityBookingPayload): Promise<string> {
    const { data, error } = await supabase.functions.invoke('create-community-checkout', {
      body: payload,
    });

    if (error) throw error;
    if (!data?.url) throw new Error('Keine Checkout-URL erhalten.');

    return data.url as string;
  }

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
