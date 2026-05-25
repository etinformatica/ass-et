-- Stato 'Ordinato' per pezzi intervento: tra 'Da ordinare' e 'A stock'.
-- Aggiunge metadati ordine al pezzo (data e riferimento opzionale).

alter table intervento_pezzi
  add column if not exists data_ordine date,
  add column if not exists riferimento_ordine text;
