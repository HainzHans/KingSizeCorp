export interface Recording {
  id:          string;
  title:       string;
  recorded_on: string;        // Supabase liefert: 'YYYY-MM-DD'
  zoom_url:    string;
  passcode:    string | null;
  description: string | null;
  created_at:  string;
}

// Für das Erstellen — id und created_at werden von Supabase gesetzt.
export type CreateRecordingDto = Omit<Recording, 'id' | 'created_at'>;

// Für das Bearbeiten — alle Felder optional.
export type UpdateRecordingDto = Partial<CreateRecordingDto>;
