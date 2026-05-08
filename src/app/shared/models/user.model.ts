import {UserPurchase} from './user-purchase.model';

export interface User {
  email:     string;
  name:      string;
  phone:     string;
  status:    'Abgeschlossen' | 'Ausstehend';
  purchases: UserPurchase[];
}
