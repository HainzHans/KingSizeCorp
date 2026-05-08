export interface UserPurchase {
  type:   string;
  date:   string;
  time:   string;
  status: 'Abgeschlossen' | 'Ausstehend';
  price:  number;
}
