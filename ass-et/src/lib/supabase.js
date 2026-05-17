import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Flag usato dalla UI per mostrare l'avviso di configurazione
export const SUPABASE_CONFIGURED = Boolean(url && anonKey);

// Se non configurato creiamo comunque un client placeholder per non rompere
// l'import; le query falliranno con un errore gestito dalla UI.
export const supabase = createClient(
  url || 'https://placeholder.supabase.co',
  anonKey || 'placeholder-anon-key'
);
