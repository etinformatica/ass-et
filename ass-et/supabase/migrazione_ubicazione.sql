-- ============================================================
-- MIGRAZIONE ADDITIVA — Ubicazione dispositivo
-- ============================================================
-- Eseguire UNA VOLTA nella SQL Editor di Supabase.
-- SICURO: non cancella dati. Aggiunge il campo "ubicazione" agli
-- interventi: serve a tracciare se il dispositivo è in laboratorio
-- o restituito al cliente in attesa di un pezzo.
-- ============================================================

alter table interventi
  add column if not exists ubicazione text not null default 'IN LABORATORIO';

-- Indice leggero per filtrare velocemente i dispositivi non in lab
create index if not exists idx_interventi_ubicazione on interventi(ubicazione);

-- Fine migrazione.
