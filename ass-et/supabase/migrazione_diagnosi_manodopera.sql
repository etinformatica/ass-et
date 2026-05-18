-- ============================================================
-- MIGRAZIONE ADDITIVA — Diagnosi e manodopera negli interventi
-- ============================================================
-- Eseguire UNA VOLTA nella SQL Editor di Supabase.
--
-- SICURO: NON azzera né modifica i dati esistenti. Aggiunge solo
-- due colonne alla tabella `interventi`. Ri-eseguibile senza danni.
-- ============================================================

alter table interventi
  add column if not exists difetto_riscontrato text;

alter table interventi
  add column if not exists manodopera numeric(10,2) not null default 0;

-- Fine migrazione.
