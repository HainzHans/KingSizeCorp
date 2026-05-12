import { Injectable } from '@angular/core';
import { supabase } from '../../../core/supabase.client';
import {CommunitySubscription} from '../../models/community-subscription.model';

@Injectable({ providedIn: 'root' })
export class CommunitySubscriptionService {

  async getCommunitySubscriptions(): Promise<CommunitySubscription[]> {
    const { data, error } = await supabase
      .from('community_subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as CommunitySubscription[];
  }

}
