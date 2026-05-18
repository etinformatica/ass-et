-- ============================================================
-- MIGRAZIONE ADDITIVA — SKU magazzino non più obbligatorio
-- ============================================================
-- Eseguire UNA VOLTA nella SQL Editor di Supabase.
-- SICURO: non cancella dati. Rende lo SKU facoltativo.
-- (Il vincolo UNIQUE resta: in PostgreSQL ammette più valori NULL,
--  quindi puoi avere più articoli senza SKU.)
-- ============================================================

alter table magazzino alter column sku drop not null;

-- Fine migrazione.
