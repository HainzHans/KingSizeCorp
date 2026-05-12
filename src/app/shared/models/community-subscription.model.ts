export interface CommunitySubscription {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  status: 'pending' | 'paid' | 'cancelled' | 'expired';
  created_at: string;
}
