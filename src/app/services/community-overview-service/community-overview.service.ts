// src/app/services/community-overview-service/community-overview.service.ts
import { Injectable } from '@angular/core';
import { supabase } from '../../core/supabase.client';

export interface CommunityMember {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  status: 'pending' | 'paid' | 'cancelled' | 'expired';
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class CommunityOverviewService {
  async getMembers(): Promise<CommunityMember[]> {
    const { data, error } = await supabase
      .from('community_subscriptions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as CommunityMember[];
  }
}
