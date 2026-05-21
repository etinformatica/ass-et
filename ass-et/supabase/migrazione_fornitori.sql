-- ============================================================
-- MIGRAZIONE ADDITIVA — Anagrafica fornitori
-- ============================================================
-- Eseguire UNA VOLTA nella SQL Editor di Supabase.
-- SICURO: non cancella dati. Crea la tabella fornitori, collega i
-- carichi_magazzino esistenti tramite fornitore_id e abilita RLS.
-- Ri-eseguibile senza danni.
-- ============================================================

-- 1) Tabella fornitori
create table if not exists fornitori (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null unique,
  tel         text,
  email       text,
  indirizzo   text,
  p_iva       text,
  note        text,
  created_at  timestamptz not null default now()
);

alter table fornitori enable row level security;
drop policy if exists "auth_all" on fornitori;
create policy "auth_all" on fornitori for all to authenticated using (true) with check (true);

-- 2) FK su carichi_magazzino (snapshot testuale resta come storico)
alter table carichi_magazzino
  add column if not exists fornitore_id uuid references fornitori(id) on delete set null;
create index if not exists idx_carichi_fornitore on carichi_magazzino(fornitore_id);

-- 3) Backfill: crea anagrafiche dai fornitori già citati in carichi e
--    nel catalogo magazzino (nomi normalizzati in maiuscolo).
insert into fornitori (nome)
select distinct upper(trim(fornitore))
  from carichi_magazzino
 where fornitore is not null and trim(fornitore) <> ''
 on conflict (nome) do nothing;

insert into fornitori (nome)
select distinct upper(trim(fornitore))
  from magazzino
 where fornitore is not null and trim(fornitore) <> ''
 on conflict (nome) do nothing;

-- 4) Collega i carichi esistenti al fornitore di anagrafica
update carichi_magazzino c
   set fornitore_id = f.id
  from fornitori f
 where c.fornitore_id is null
   and c.fornitore is not null
   and upper(trim(c.fornitore)) = f.nome;

-- Fine migrazione.
