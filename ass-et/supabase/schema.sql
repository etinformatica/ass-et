-- ============================================================
-- Ass-et · Centro Assistenza — Schema database (Supabase / PostgreSQL)
-- Eseguire questo file UNA VOLTA nella SQL Editor di Supabase.
-- Crea le tabelle, le policy (accesso aperto, no login) e i dati demo.
-- ============================================================

-- Estensione per uuid
create extension if not exists "pgcrypto";

-- ---------- Pulizia (per re-run sicuri) ----------
drop table if exists intervento_attivita cascade;
drop table if exists intervento_pezzi cascade;
drop table if exists fatture cascade;
drop table if exists ordini_fornitore cascade;
drop table if exists interventi cascade;
drop table if exists magazzino cascade;
drop table if exists clienti cascade;
drop table if exists tecnici cascade;
drop sequence if exists intervento_numero_seq;

-- ---------- Sequenza per il numero intervento visibile (#2412...) ----------
create sequence intervento_numero_seq start 2412;

-- ---------- TECNICI ----------
create table tecnici (
  id          uuid primary key default gen_random_uuid(),
  nome        text not null,
  tone        text not null default 'gray',
  ruolo       text not null default 'Tecnico',
  created_at  timestamptz not null default now()
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
  sku         text unique not null,
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
create table interventi (
  id              uuid primary key default gen_random_uuid(),
  numero          integer unique not null default nextval('intervento_numero_seq'),
  cliente_id      uuid references clienti(id) on delete set null,
  dispositivo     text not null default '',
  marca           text,
  modello         text,
  seriale         text,
  difetto         text,
  stato           text not null default 'Accettazione',
  stato_tone      text not null default 'gray',
  tecnico_id      uuid references tecnici(id) on delete set null,
  priorita        text not null default 'Normale',
  max_preventivo  numeric(10,2) not null default 0,
  totale_stimato  numeric(10,2),
  margine_atteso  numeric(10,2),
  accessori       text,
  stato_estetico  text,
  password_cliente text,
  created_at      timestamptz not null default now()
);

-- ---------- PEZZI ASSEGNATI A UN INTERVENTO ----------
create table intervento_pezzi (
  id            uuid primary key default gen_random_uuid(),
  intervento_id uuid not null references interventi(id) on delete cascade,
  magazzino_id  uuid references magazzino(id) on delete set null,
  sku           text,
  nome          text not null,
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

-- ============================================================
-- ROW LEVEL SECURITY — accesso aperto (nessun login)
-- Policy permissive: la chiave anon può fare tutto.
-- Quando aggiungerai l'autenticazione, restringeremo queste policy.
-- ============================================================
do $$
declare t text;
begin
  foreach t in array array[
    'tecnici','clienti','magazzino','interventi',
    'intervento_pezzi','intervento_attivita','ordini_fornitore','fatture'
  ]
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "anon_all" on %I;', t);
    execute format(
      'create policy "anon_all" on %I for all to anon, authenticated using (true) with check (true);',
      t
    );
  end loop;
end $$;

-- ============================================================
-- DATI DEMO (seed)
-- ============================================================

-- Tecnici
insert into tecnici (nome, tone, ruolo) values
  ('Luca M.',  'green', 'Tecnico laboratorio'),
  ('Marco T.', 'blue',  'Tecnico banco'),
  ('Sara R.',  'amber', 'Tecnico laboratorio');

-- Clienti
insert into clienti (nome, tel, email, cf, tipo, created_at) values
  ('Bianchi Mario',    '349 12 34 567', 'm.bianchi@gmail.com',     'BNCMRA70R12A944J', 'Privato', '2023-04-12'),
  ('Rossi Giulia',     '345 11 22 333', 'giulia.rossi@gmail.com',  'RSSGLA92T61L219X', 'Privato', '2022-09-01'),
  ('Verdi srl',        '06 4455 778',   'admin@verdisrl.it',       '03941200510',      'Azienda', '2021-01-15'),
  ('Esposito Anna',    '349 55 66 777', 'anna.esposito@email.it',  'SPSNN90P65A509R',  'Privato', '2024-06-20'),
  ('Conti Paolo',      '333 22 11 444', 'paolo.conti@gmail.com',   'CNTPLA85T14H501M', 'Privato', '2026-05-12'),
  ('Studio Neri',      '02 8765 432',   'info@studioneri.it',      '07812300158',      'Azienda', '2022-03-10'),
  ('Romano Luigi',     '329 88 77 666', 'luigi.romano@hotmail.it', 'RMNLGU88P20G702K', 'Privato', '2024-11-05');

-- Magazzino
insert into magazzino (sku, nome, categoria, stock, min_stock, costo_acq, prezzo_vend, fornitore) values
  ('SSD-1TB-NVME',  'SSD NVMe 1TB Crucial P3',     'Storage',   2, 5,  62, 119, 'DigitalParts'),
  ('SSD-500-NVME',  'SSD NVMe 500GB Crucial',      'Storage',   7, 3,  38,  75, 'DigitalParts'),
  ('SSD-2TB-NVME',  'SSD NVMe 2TB Crucial P3',     'Storage',   3, 2, 118, 219, 'DigitalParts'),
  ('RAM-16-DDR4',   'RAM 16GB DDR4 SODIMM',        'Memorie',   9, 4,  38,  75, 'RAMItalia'),
  ('RAM-8-DDR4',    'RAM 8GB DDR4 SODIMM',         'Memorie',   6, 3,  22,  45, 'RAMItalia'),
  ('GLASS-IPH12',   'Vetro iPhone 12 nero',        'Display',  12, 5,  18,  35, 'PhonePartsEU'),
  ('GLASS-IPH13',   'Vetro iPhone 13 nero',        'Display',   8, 4,  22,  42, 'PhonePartsEU'),
  ('BATT-IPAD9',    'Batteria iPad 9 gen',         'Batterie',  5, 3,  24,  38, 'PhonePartsEU'),
  ('PASTA-KRY',     'Pasta termica Kryonaut 1g',   'Accessori', 1, 4,   8,  14, 'DigitalParts'),
  ('KB-MBA-M1-IT',  'Tastiera MacBook Air M1 IT',  'Tastiere',  0, 2,  89, 149, 'RAMItalia'),
  ('CHARGER-USB-C', 'Alimentatore USB-C 65W',      'Accessori', 4, 3,  18,  35, 'DigitalParts');

-- Interventi (collegati ai clienti/tecnici per nome)
insert into interventi
  (cliente_id, dispositivo, marca, modello, seriale, difetto, stato, stato_tone, tecnico_id, priorita, max_preventivo, totale_stimato, margine_atteso)
select c.id, x.dispositivo, x.marca, x.modello, x.seriale, x.difetto, x.stato, x.stato_tone, t.id, x.priorita, x.max_preventivo, x.totale_stimato, x.margine_atteso
from (values
  ('Bianchi Mario','HP Pavilion 15','HP','Pavilion 15-ec0035nl','5CD9472X3R','Non si avvia. La ventola gira ma lo schermo resta nero. Cliente dichiara caduta.','Accettazione','gray','Luca M.','Normale',150,null,null),
  ('Rossi Giulia','MacBook Air M1','Apple','MacBook Air M1 2021','C02G3QH4Q6L4','Tastiera bagnata di caffè. Non risponde la fila "asdf". Macchina si avvia.','Attesa pezzi','amber','Marco T.','Normale',280,223,126),
  ('Verdi srl','Dell OptiPlex 7090','Dell','OptiPlex 7090','HX4K29B','Molto lento, sospetto virus/malware. Avvio impiega 8 minuti.','In lavorazione','violet','Luca M.','Normale',100,85,55),
  ('Esposito Anna','iPhone 12','Apple','iPhone 12 nero 128GB','F17D38XABC1','Vetro frontale rotto dopo caduta. Display funzionante.','Pronto','green','Sara R.','Normale',120,95,60),
  ('Conti Paolo','Lenovo IdeaPad','Lenovo','IdeaPad 3 15ALC6','PF3K8L01','HDD con rumori di click. Dati non accessibili.','Non riparabile','red','Luca M.','Bassa',200,0,0),
  ('Studio Neri','HP LaserJet Pro','HP','LaserJet Pro M404n','PHBBK1234','Stampa con righe verticali nere. Tamburo difettoso.','Consegnato','gray','Marco T.','Bassa',80,60,35),
  ('Romano Luigi','Asus ROG Strix','Asus','ROG Strix G15','G1501LDAS8','Surriscaldamento in gaming. Pasta termica esaurita.','In lavorazione','violet','Sara R.','Normale',150,80,52),
  ('Bianchi Mario','iPad 9 gen','Apple','iPad 9a generazione 64GB','DMPRXHP1AAB','Batteria si scarica in 2 ore. Cliente vuole conferma preventivo.','Attesa cliente','blue','Sara R.','Bassa',90,65,38)
) as x(cliente,dispositivo,marca,modello,seriale,difetto,stato,stato_tone,tecnico,priorita,max_preventivo,totale_stimato,margine_atteso)
join clienti c on c.nome = x.cliente
left join tecnici t on t.nome = x.tecnico;

-- Pezzi su intervento #Rossi Giulia (Attesa pezzi)
insert into intervento_pezzi (intervento_id, sku, nome, qty, costo_acq, prezzo_vend, stato, stato_tone)
select i.id, 'KB-MBA-M1-IT', 'Tastiera MBA M1 IT', 1, 89, 149, 'In arrivo 18/05', 'amber'
from interventi i join clienti c on i.cliente_id = c.id
where c.nome = 'Rossi Giulia';

insert into intervento_pezzi (intervento_id, sku, nome, qty, costo_acq, prezzo_vend, stato, stato_tone)
select i.id, 'PASTA-KRY', 'Pasta termica Kryonaut', 1, 8, 14, 'A stock', 'green'
from interventi i join clienti c on i.cliente_id = c.id
where c.nome = 'Rossi Giulia';

-- Timeline su intervento #Rossi Giulia
insert into intervento_attivita (intervento_id, autore, tipo, testo, created_at)
select i.id, x.autore, x.tipo, x.testo, x.ts::timestamptz
from interventi i join clienti c on i.cliente_id = c.id,
(values
  ('Marco T.','accettazione','Intervento accettato.','2026-05-13 14:10'),
  ('Sistema','sms','SMS conferma inviato a Giulia · letto','2026-05-13 14:12'),
  ('Luca M.','diagnosi','Confermato. Top-case da sostituire. Ordino il pezzo a RAMItalia.','2026-05-13 16:05'),
  ('Luca M.','stato','Stato → Attesa pezzi · ordine O-0144 (RAMItalia)','2026-05-14 09:00'),
  ('RAMItalia','fornitore','Conferma fornitore: consegna 18/05','2026-05-16 11:30')
) as x(autore,tipo,testo,ts)
where c.nome = 'Rossi Giulia';

-- Ordini fornitore
insert into ordini_fornitore (codice, fornitore, articoli, totale, stato, stato_tone, data_attesa) values
  ('O-0142','DigitalParts','SSD 1TB ×3, RAM 16GB ×2','420','In ritardo','red','atteso 10/05'),
  ('O-0143','PhonePartsEU','Vetri iPhone 13 ×4','220','In transito','gray','17/05'),
  ('O-0144','RAMItalia','Tastiera MBA M1 IT ×1','95','In transito','gray','18/05');

-- Fatture
insert into fatture (codice, tipo, cliente, riferimento, importo, scadenza, stato, stato_tone) values
  ('F-0142','Fatt. elettronica','Verdi srl','#2409',320,'30gg DF','In scadenza','amber'),
  ('F-0141','Fatt. privato','Marini A.','#2401',220,'15 gg','In termini','green'),
  ('F-0138','Fatt. elettronica','Studio Neri','#2406',60,'30gg DF','In termini','green'),
  ('F-0133','Fatt. elettronica','Tech Hub spa','#2378',480,'scaduta 4gg','Da sollecitare','red');

-- Fine schema.
