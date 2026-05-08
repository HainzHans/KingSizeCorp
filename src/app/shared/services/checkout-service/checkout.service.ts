import { Injectable } from '@angular/core';
import {supabase} from '../../../core/supabase.client';
import {CommunitySubscriptionPayload} from '../../models/community-subscription-payload.model';
import {BookingPayload} from '../../models/booking-payload';

@Injectable({
  providedIn: 'root',
})
export class CheckoutService {

  async createCheckout(payload: BookingPayload): Promise<string> {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: payload,
    });

    if (error) throw error;
    if (!data?.url) throw new Error('Keine Checkout-URL erhalten.');

    return data.url as string;
  }

  async createCommunityCheckout(payload: CommunitySubscriptionPayload): Promise<string> {
    const { data, error } = await supabase.functions.invoke('create-community-checkout', {
      body: payload,
    });

    if (error) throw error;
    if (!data?.url) throw new Error('Keine Checkout-URL erhalten.');

    return data.url as string;
  }

}
