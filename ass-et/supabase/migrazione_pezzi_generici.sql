-- ============================================================
-- MIGRAZIONE ADDITIVA — Pezzi generici (da ordinare) con fornitore
-- ============================================================
-- Eseguire UNA VOLTA nella SQL Editor di Supabase.
-- SICURO: non cancella dati. Aggiunge a intervento_pezzi:
--   * fornitore_id  → fornitore suggerito per il pezzo da ordinare
--   * descrizione   → descrizione estesa (opzionale)
--   * note          → note libere (es. specifiche, link, ecc.)
-- I pezzi generici sono quelli senza magazzino_id (già ammesso).
-- ============================================================

alter table intervento_pezzi
  add column if not exists fornitore_id uuid references fornitori(id) on delete set null,
  add column if not exists descrizione text,
  add column if not exists note text;

-- Indice per la vista "Da ordinare" raggruppata per fornitore
create index if not exists idx_intervento_pezzi_stato_fornitore
  on intervento_pezzi(stato, fornitore_id);

-- Fine migrazione.
