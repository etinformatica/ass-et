import { useState, useEffect } from 'react';
import { supabase } from './supabase';

// Ritorna:
//   undefined  → sessione ancora in caricamento
//   null       → utente NON autenticato
//   object     → utente autenticato (session di Supabase)
export function useSession() {
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setSession(data.session ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s ?? null);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return session;
}
