-- ============================================================
-- Ass-et · Centro Assistenza — Schema database (Supabase / PostgreSQL)
-- ============================================================
-- Eseguire questo file nella SQL Editor di Supabase.
--
-- ATTENZIONE: questo script AZZERA COMPLETAMENTE il database
-- (tutte le tabelle vengono eliminate e ricreate VUOTE, tecnici
-- inclusi). Non ci sono dati demo: si parte da zero.
--
-- Numerazione interventi: formato ANNO-progressivo (es. 2026-0001).
-- Il progressivo riparte automaticamente da 1 a ogni anno nuovo.
-- ============================================================

-- Estensione per uuid
create extension if not exists "pgcrypto";

-- ---------- Pulizia totale (azzera tutto) ----------
drop table if exists intervento_foto cascade;
drop table if exists intervento_attivita cascade;
drop table if exists intervento_pezzi cascade;
drop table if exists carichi_magazzino cascade;
drop table if exists fatture cascade;
drop table if exists ordini_fornitore cascade;
drop table if exists interventi cascade;
drop table if exists magazzino cascade;
drop table if exists fornitori cascade;
drop table if exists clienti cascade;
drop table if exists tecnici cascade;
drop table if exists impostazioni cascade;
drop sequence if exists intervento_numero_seq;
drop function if exists assign_intervento_numero cascade;
drop function if exists applica_carico_magazzino cascade;

-- ---------- TECNICI ----------
create table tecnici (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  tone        text not null default 'gray',
  ruolo       text not null default 'Tecnico',
  created_at  timestamptz not null default now()
);

-- ---------- IMPOSTAZIONI (chiave/valore) ----------
create table impostazioni (
  chiave      text primary key,
  valore      text,
  updated_at  timestamptz not null default now()
);

-- ---------- CLIENTI ----------
create table clienti (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  tel         text,
  email       text,
  cf          text,
  tipo        text not null default 'Privato',  -- 'Privato' | 'Azienda'
  created_at  timestamptz not null default now()
);

-- ---------- MAGAZZINO ----------
create table magazzino (
  id          uuid primary key default gen_random_uuid(),
  sku         text unique,
  nome        text not null,
  categoria   text not null default 'Accessori',
  stock       integer not null default 0,
  min_stock   integer not null default 0,
  costo_acq   numeric(10,2) not null default 0,
  prezzo_vend numeric(10,2) not null default 0,
  fornitore   text,
  created_at  timestamptz not null default now()
);

-- ---------- INTERVENTI ----------
-- numero = ANNO-progressivo (es. 2026-0001), generato in automatico.
-- 'anno' e 'prog' vengono assegnati dal trigger; 'numero' è derivato.
create table interventi (
  id              uuid primary key default gen_random_uuid(),
  anno            integer not null default extract(year from now())::int,
  prog            integer not null,
  numero          text generated always as
                    (anno::text || '-' || lpad(prog::text, 4, '0')) stored,
  cliente_id      uuid references clienti(id) on delete set null,
  dispositivo     text not null default '',
  marca           text,
  modello         text,
  seriale         text,
  difetto         text,
  difetto_riscontrato text,
  stato           text not null default 'Accettazione',
  stato_tone      text not null default 'gray',
  tecnico_id      uuid references tecnici(id) on delete set null,
  priorita        text not null default 'Normale',
  max_preventivo  numeric(10,2) not null default 0,
  manodopera      numeric(10,2) not null default 0,
  totale_stimato  numeric(10,2),
  margine_atteso  numeric(10,2),
  accessori       text,
  stato_estetico  text,
  password_cliente text,
  ubicazione      text not null default 'IN LABORATORIO',
  created_at      timestamptz not null default now(),
  unique (anno, prog)
);

-- Assegna anno + progressivo prima dell'inserimento.
-- Il lock per-anno evita numeri duplicati con inserimenti concorrenti.
create function assign_intervento_numero()
returns trigger
language plpgsql
as $$
begin
  if new.anno is null then
    new.anno := extract(year from now())::int;
  end if;
  if new.prog is null then
    perform pg_advisory_xact_lock(hashtext('intervento_anno_' || new.anno));
    select coalesce(max(prog), 0) + 1
      into new.prog
      from interventi
     where anno = new.anno;
  end if;
  return new;
end;
$$;

create trigger trg_assign_intervento_numero
before insert on interventi
for each row execute function assign_intervento_numero();

-- ---------- PEZZI ASSEGNATI A UN INTERVENTO ----------
create table intervento_pezzi (
  id            uuid primary key default gen_random_uuid(),
  intervento_id uuid not null references interventi(id) on delete cascade,
  magazzino_id  uuid references magazzino(id) on delete set null,
  fornitore_id  uuid references fornitori(id) on delete set null,
  sku           text,
  nome          text not null,
  descrizione   text,
  note          text,
  qty           integer not null default 1,
  costo_acq     numeric(10,2) not null default 0,
  prezzo_vend   numeric(10,2) not null default 0,
  stato         text not null default 'A stock',
  stato_tone    text not null default 'green',
  created_at    timestamptz not null default now()
);

-- ---------- TIMELINE / ATTIVITÀ DI UN INTERVENTO ----------
create table intervento_attivita (
  id            uuid primary key default gen_random_uuid(),
  intervento_id uuid not null references interventi(id) on delete cascade,
  autore        text not null default 'Sistema',
  tipo          text not null default 'nota',
  testo         text not null,
  created_at    timestamptz not null default now()
);

-- ---------- ORDINI FORNITORE ----------
create table ordini_fornitore (
  id          uuid primary key default gen_random_uuid(),
  codice      text not null,
  fornitore   text not null,
  articoli    text,
  totale      numeric(10,2) not null default 0,
  stato       text not null default 'In transito',
  stato_tone  text not null default 'gray',
  data_attesa text,
  created_at  timestamptz not null default now()
);

-- ---------- FATTURE ----------
create table fatture (
  id          uuid primary key default gen_random_uuid(),
  codice      text not null,
  tipo        text not null default 'Fatt. privato',
  cliente     text,
  riferimento text,
  importo     numeric(10,2) not null default 0,
  scadenza    text,
  stato       text not null default 'In termini',
  stato_tone  text not null default 'green',
  created_at  timestamptz not null default now()
);

-- ---------- CARICHI MAGAZZINO (storico ingressi merce) ----------
-- ---------- FORNITORI ----------
create table fornitori (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null unique,
  tel         text,
  email       text,
  indirizzo   text,
  p_iva       text,
  note        text,
  created_at  timestamptz not null default now()
);

-- Ogni carico registra n° fattura fornitore, data e quantità.
-- Un trigger incrementa lo stock dell'articolo collegato.
create table carichi_magazzino (
  id             uuid primary key default gen_random_uuid(),
  magazzino_id   uuid references magazzino(id) on delete set null,
  fornitore_id   uuid references fornitori(id) on delete set null,
  sku            text,
  nome           text,
  qty            integer not null,
  costo_acq      numeric(10,2),
  numero_fattura text,
  fornitore      text,
  data_carico    date not null default current_date,
  created_at     timestamptz not null default now()
);

create function applica_carico_magazzino()
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

create trigger trg_applica_carico
after insert on carichi_magazzino
for each row execute function applica_carico_magazzino();

-- Trigger UPDATE: applica il delta di qty (e gestisce cambio articolo)
create function aggiorna_stock_su_update_carico()
returns trigger
language plpgsql
as $$
begin
  if old.magazzino_id is not distinct from new.magazzino_id then
    if old.qty <> new.qty and new.magazzino_id is not null then
      update magazzino set stock = stock + (new.qty - old.qty) where id = new.magazzino_id;
    end if;
  else
    if old.magazzino_id is not null then
      update magazzino set stock = stock - old.qty where id = old.magazzino_id;
    end if;
    if new.magazzino_id is not null then
      update magazzino set stock = stock + new.qty where id = new.magazzino_id;
    end if;
  end if;
  return new;
end;
$$;

create trigger trg_aggiorna_carico
after update on carichi_magazzino
for each row execute function aggiorna_stock_su_update_carico();

-- Trigger DELETE: sottrae lo stock
create function aggiorna_stock_su_delete_carico()
returns trigger
language plpgsql
as $$
begin
  if old.magazzino_id is not null then
    update magazzino set stock = stock - old.qty where id = old.magazzino_id;
  end if;
  return old;
end;
$$;

create trigger trg_elimina_carico
after delete on carichi_magazzino
for each row execute function aggiorna_stock_su_delete_carico();

-- ---------- FOTO INTERVENTI ----------
-- Le immagini risiedono nel bucket Storage "interventi-foto" (privato).
-- Qui tracciamo solo il path; la URL viene generata firmata dal client.
create table intervento_foto (
  id            uuid primary key default gen_random_uuid(),
  intervento_id uuid not null references interventi(id) on delete cascade,
  path          text not null,
  created_at    timestamptz not null default now()
);
create index idx_intervento_foto_intervento on intervento_foto(intervento_id);

-- ============================================================
-- ROW LEVEL SECURITY — accesso ai soli utenti autenticati
-- Solo chi ha effettuato il login (Supabase Auth) può leggere/scrivere.
-- La registrazione pubblica va disattivata dalla dashboard Supabase;
-- gli account dipendenti si creano da Authentication → Users.
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array[
    'tecnici','impostazioni','clienti','magazzino','interventi',
    'intervento_pezzi','intervento_attivita','ordini_fornitore','fatture',
    'carichi_magazzino','intervento_foto','fornitori'
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

-- ============================================================
-- Valori di default (solo impostazioni: il resto resta vuoto)
-- ============================================================
insert into impostazioni (chiave, valore) values
  ('tecnico_nome',  'Tecnico'),
  ('tecnico_ruolo', 'Tecnico · banco'),
  ('tecnico_tone',  'violet')
on conflict (chiave) do nothing;

-- Fine schema.
