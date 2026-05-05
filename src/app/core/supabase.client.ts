import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.NG_APP_SUPABASE_URL,
  import.meta.env.NG_APP_SUPABASE_PUBLIC_KEY,
);
