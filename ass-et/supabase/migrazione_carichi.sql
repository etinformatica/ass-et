-- ============================================================
-- MIGRAZIONE ADDITIVA — Storico carichi magazzino
-- ============================================================
-- Eseguire UNA VOLTA nella SQL Editor di Supabase.
--
-- SICURO: NON azzera né modifica i dati esistenti. Aggiunge solo
-- la tabella `carichi_magazzino`, il trigger che incrementa lo
-- stock e la policy di accesso. Ri-eseguibile senza danni.
-- ============================================================

create table if not exists carichi_magazzino (
  id             uuid primary key default gen_random_uuid(),
  magazzino_id   uuid references magazzino(id) on delete set null,
  sku            text,
  nome           text,
  qty            integer not null,
  costo_acq      numeric(10,2),
  numero_fattura text,
  fornitore      text,
  data_carico    date not null default current_date,
  created_at     timestamptz not null default now()
);

-- Incrementa lo stock dell'articolo quando si registra un carico
create or replace function applica_carico_magazzino()
returns trigger
language plpgsql
as $$
begin
  if new.magazzino_id is not null then
    update magazzino
       set stock = stock + new.qty,
           costo_acq = coalesce(new.costo_acq, costo_acq)
     where id = new.magazzino_id;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_applica_carico on carichi_magazzino;
create trigger trg_applica_carico
after insert on carichi_magazzino
for each row execute function applica_carico_magazzino();

-- Accesso aperto (coerente con le altre tabelle, nessun login)
alter table carichi_magazzino enable row level security;
drop policy if exists "anon_all" on carichi_magazzino;
create policy "anon_all" on carichi_magazzino
  for all to anon, authenticated using (true) with check (true);

-- Fine migrazione.
