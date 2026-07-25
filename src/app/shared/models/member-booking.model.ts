export interface MemberBooking {
  type:   string;
  date:   string;   // 'DD.MM.YYYY'
  time:   string;   // 'HH:MM'
  status: 'Abgeschlossen' | 'Ausstehend';
  price:  number;
}
