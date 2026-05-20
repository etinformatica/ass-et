-- ============================================================
-- MIGRAZIONE ADDITIVA — Foto interventi
-- ============================================================
-- Eseguire UNA VOLTA nella SQL Editor di Supabase.
-- SICURO: non cancella dati. Crea:
--   • bucket Storage "interventi-foto" (privato)
--   • policy Storage per i soli autenticati
--   • tabella intervento_foto con RLS authenticated
-- ============================================================

-- 1) Bucket Storage (privato → accesso tramite signed URL)
insert into storage.buckets (id, name, public)
values ('interventi-foto', 'interventi-foto', false)
on conflict (id) do nothing;

-- 2) Storage policies: solo utenti loggati possono leggere/scrivere
do $$
begin
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'interventi_foto_select') then
    create policy "interventi_foto_select" on storage.objects
      for select to authenticated using (bucket_id = 'interventi-foto');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'interventi_foto_insert') then
    create policy "interventi_foto_insert" on storage.objects
      for insert to authenticated with check (bucket_id = 'interventi-foto');
  end if;
  if not exists (select 1 from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname = 'interventi_foto_delete') then
    create policy "interventi_foto_delete" on storage.objects
      for delete to authenticated using (bucket_id = 'interventi-foto');
  end if;
end $$;

-- 3) Tabella di tracking
create table if not exists intervento_foto (
  id            uuid primary key default gen_random_uuid(),
  intervento_id uuid not null references interventi(id) on delete cascade,
  path          text not null,
  created_at    timestamptz not null default now()
);
create index if not exists idx_intervento_foto_intervento on intervento_foto(intervento_id);

alter table intervento_foto enable row level security;
drop policy if exists "auth_all" on intervento_foto;
create policy "auth_all" on intervento_foto for all to authenticated using (true) with check (true);

-- Fine migrazione.
