export type AppointmentType = 'livetrading' | 'mentoring' | 'community';
export type AppointmentStatus = 'available' | 'booked';

export interface Appointment {
  id: string;
  type: AppointmentType;
  date: string;         // Supabase liefert: 'YYYY-MM-DD'
  time: string;         // Supabase liefert: 'HH:MM:SS'
  price: number;
  stripe_price_id: string | null;
  status: AppointmentStatus;
  created_at: string;
}

// Für das Erstellen — id, status und created_at werden von Supabase gesetzt
export type CreateAppointmentDto = Omit<Appointment, 'id' | 'status' | 'created_at' | 'price'>;

// Für das Bearbeiten — alle Felder optional außer id
export type UpdateAppointmentDto = Partial<CreateAppointmentDto>;
