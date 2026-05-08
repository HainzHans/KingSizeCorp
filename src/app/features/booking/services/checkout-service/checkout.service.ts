import { Injectable } from '@angular/core';
import {supabase} from '../../../../core/supabase.client';

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

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {

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

}
