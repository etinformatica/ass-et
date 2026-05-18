-- ============================================================
-- MIGRAZIONE — Sicurezza: accesso ai soli utenti autenticati
-- ============================================================
-- Eseguire nella SQL Editor di Supabase DOPO aver:
--   1) creato almeno un utente in Authentication → Users
--   2) disattivato la registrazione pubblica
--      (Authentication → Sign In / Providers → "Allow new users
--       to sign up" = OFF)
--   3) pubblicato il nuovo codice con la schermata di login
--
-- Da questo momento i dati NON sono più accessibili senza login.
-- NON cancella dati. Ri-eseguibile senza danni.
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array[
    'tecnici','impostazioni','clienti','magazzino','interventi',
    'intervento_pezzi','intervento_attivita','ordini_fornitore','fatture',
    'carichi_magazzino'
  ]
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "anon_all" on %I;', t);
    execute format('drop policy if exists "auth_all" on %I;', t);
    execute format(
      'create policy "auth_all" on %I for all to authenticated using (true) with check (true);',
      t
    );
  end loop;
end $$;

-- Fine migrazione.
