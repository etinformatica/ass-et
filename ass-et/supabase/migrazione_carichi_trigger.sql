-- ============================================================
-- MIGRAZIONE ADDITIVA — Trigger UPDATE/DELETE su carichi_magazzino
-- ============================================================
-- Eseguire UNA VOLTA nella SQL Editor di Supabase.
-- SICURO: non cancella dati. Aggiunge due trigger che mantengono
-- coerente lo stock dell'articolo quando una riga di carico viene
-- modificata o eliminata. Ri-eseguibile (uso create or replace).
-- ============================================================

-- AFTER UPDATE: applica il delta di qty (e gestisce cambio articolo)
create or replace function aggiorna_stock_su_update_carico()
returns trigger
language plpgsql
as $$
begin
  if old.magazzino_id is not distinct from new.magazzino_id then
    if old.qty <> new.qty and new.magazzino_id is not null then
      update magazzino
         set stock = stock + (new.qty - old.qty)
       where id = new.magazzino_id;
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

drop trigger if exists trg_aggiorna_carico on carichi_magazzino;
create trigger trg_aggiorna_carico
after update on carichi_magazzino
for each row execute function aggiorna_stock_su_update_carico();

-- AFTER DELETE: sottrae lo stock
create or replace function aggiorna_stock_su_delete_carico()
returns trigger
language plpgsql
as $$
begin
  if old.magazzino_id is not null then
    update magazzino
       set stock = stock - old.qty
     where id = old.magazzino_id;
  end if;
  return old;
end;
$$;

drop trigger if exists trg_elimina_carico on carichi_magazzino;
create trigger trg_elimina_carico
after delete on carichi_magazzino
for each row execute function aggiorna_stock_su_delete_carico();

-- Fine migrazione.
