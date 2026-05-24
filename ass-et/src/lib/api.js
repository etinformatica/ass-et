import { supabase } from './supabase';

// Helper: lancia se Supabase risponde con errore
function chk({ data, error }) {
  if (error) throw error;
  return data;
}

// ---------------- CLIENTI ----------------
export const clientiApi = {
  async list() {
    return chk(await supabase.from('clienti').select('*').order('nome'));
  },
  async create(c) {
    return chk(await supabase.from('clienti').insert(c).select().single());
  },
  async update(id, patch) {
    return chk(await supabase.from('clienti').update(patch).eq('id', id).select().single());
  },
  async remove(id) {
    return chk(await supabase.from('clienti').delete().eq('id', id));
  },
};

// ---------------- TECNICI ----------------
export const tecniciApi = {
  async list() {
    return chk(await supabase.from('tecnici').select('*').order('nome'));
  },
};

// ---------------- IMPOSTAZIONI ----------------
export const impostazioniApi = {
  async getAll() {
    const rows = chk(await supabase.from('impostazioni').select('*'));
    return Object.fromEntries((rows || []).map(r => [r.chiave, r.valore]));
  },
  async set(chiave, valore) {
    return chk(
      await supabase
        .from('impostazioni')
        .upsert({ chiave, valore, updated_at: new Date().toISOString() }, { onConflict: 'chiave' })
        .select()
        .single()
    );
  },
};

// ---------------- MAGAZZINO ----------------
export const magazzinoApi = {
  async list() {
    return chk(await supabase.from('magazzino').select('*').order('nome'));
  },
  async create(a) {
    return chk(await supabase.from('magazzino').insert(a).select().single());
  },
  async update(id, patch) {
    return chk(await supabase.from('magazzino').update(patch).eq('id', id).select().single());
  },
  async remove(id) {
    return chk(await supabase.from('magazzino').delete().eq('id', id));
  },
};

// ---------------- CARICHI MAGAZZINO ----------------
export const carichiApi = {
  async list() {
    return chk(
      await supabase
        .from('carichi_magazzino')
        .select('*, fornitore_rel:fornitori(id, nome)')
        .order('created_at', { ascending: false })
    );
  },
  async listByFornitore(fornitoreId) {
    return chk(
      await supabase
        .from('carichi_magazzino')
        .select('*')
        .eq('fornitore_id', fornitoreId)
        .order('data_carico', { ascending: false })
    );
  },
  async listByMagazzino(magazzinoId) {
    return chk(
      await supabase
        .from('carichi_magazzino')
        .select('*, fornitore_rel:fornitori(id, nome)')
        .eq('magazzino_id', magazzinoId)
        .order('data_carico', { ascending: false })
    );
  },
  async create(c) {
    return chk(await supabase.from('carichi_magazzino').insert(c).select().single());
  },
  async update(id, patch) {
    return chk(await supabase.from('carichi_magazzino').update(patch).eq('id', id).select().single());
  },
  async remove(id) {
    return chk(await supabase.from('carichi_magazzino').delete().eq('id', id));
  },
};

// ---------------- FORNITORI ----------------
export const fornitoriApi = {
  async list() {
    return chk(await supabase.from('fornitori').select('*').order('nome'));
  },
  async get(id) {
    return chk(await supabase.from('fornitori').select('*').eq('id', id).single());
  },
  async create(f) {
    return chk(await supabase.from('fornitori').insert(f).select().single());
  },
  async update(id, patch) {
    return chk(await supabase.from('fornitori').update(patch).eq('id', id).select().single());
  },
  async remove(id) {
    return chk(await supabase.from('fornitori').delete().eq('id', id));
  },
};

// ---------------- PEZZI INTERVENTI ----------------
// API trasversale ai pezzi di tutti gli interventi (vista "Da ordinare").
export const pezziApi = {
  async listDaOrdinare() {
    return chk(await supabase
      .from('intervento_pezzi')
      .select('*, intervento:interventi!inner(id, numero, dispositivo, cliente:clienti(id, nome, tel)), fornitore_rel:fornitori(id, nome)')
      .eq('stato', 'Da ordinare')
      .order('created_at'));
  },
};

// ---------------- INTERVENTI ----------------
const INTERVENTO_SELECT = `
  *,
  cliente:clienti(*),
  tecnico:tecnici(*),
  pezzi:intervento_pezzi(*),
  attivita:intervento_attivita(*)
`;

export const interventiApi = {
  async list() {
    return chk(
      await supabase
        .from('interventi')
        .select(INTERVENTO_SELECT)
        .order('numero', { ascending: false })
    );
  },
  async get(id) {
    return chk(
      await supabase.from('interventi').select(INTERVENTO_SELECT).eq('id', id).single()
    );
  },
  async create(i) {
    return chk(await supabase.from('interventi').insert(i).select(INTERVENTO_SELECT).single());
  },
  async update(id, patch) {
    return chk(
      await supabase.from('interventi').update(patch).eq('id', id).select(INTERVENTO_SELECT).single()
    );
  },
  async remove(id) {
    return chk(await supabase.from('interventi').delete().eq('id', id));
  },
  async addAttivita(intervento_id, a) {
    return chk(
      await supabase
        .from('intervento_attivita')
        .insert({ intervento_id, ...a })
        .select()
        .single()
    );
  },
  async addPezzo(intervento_id, p) {
    return chk(
      await supabase
        .from('intervento_pezzi')
        .insert({ intervento_id, ...p })
        .select()
        .single()
    );
  },
  async updatePezzo(id, patch) {
    return chk(await supabase.from('intervento_pezzi').update(patch).eq('id', id).select().single());
  },
  async removePezzo(id) {
    return chk(await supabase.from('intervento_pezzi').delete().eq('id', id));
  },
};

// ---------------- ORDINI FORNITORE ----------------
export const ordiniApi = {
  async list() {
    return chk(await supabase.from('ordini_fornitore').select('*').order('codice', { ascending: false }));
  },
  async create(o) {
    return chk(await supabase.from('ordini_fornitore').insert(o).select().single());
  },
  async update(id, patch) {
    return chk(await supabase.from('ordini_fornitore').update(patch).eq('id', id).select().single());
  },
  async remove(id) {
    return chk(await supabase.from('ordini_fornitore').delete().eq('id', id));
  },
};

// ---------------- FATTURE ----------------
export const fattureApi = {
  async list() {
    return chk(await supabase.from('fatture').select('*').order('codice', { ascending: false }));
  },
  async create(f) {
    return chk(await supabase.from('fatture').insert(f).select().single());
  },
  async update(id, patch) {
    return chk(await supabase.from('fatture').update(patch).eq('id', id).select().single());
  },
  async remove(id) {
    return chk(await supabase.from('fatture').delete().eq('id', id));
  },
};

// ---------------- FOTO INTERVENTI ----------------
// Bucket Storage privato; le URL vengono firmate al volo.
const FOTO_BUCKET = 'interventi-foto';

export const fotoApi = {
  async list(interventoId) {
    const rows = chk(await supabase
      .from('intervento_foto')
      .select('*')
      .eq('intervento_id', interventoId)
      .order('created_at'));
    if (rows.length === 0) return [];
    const signed = await supabase.storage.from(FOTO_BUCKET).createSignedUrls(rows.map(r => r.path), 3600);
    if (signed.error) throw signed.error;
    const map = new Map(signed.data.map(s => [s.path, s.signedUrl]));
    return rows.map(r => ({ ...r, url: map.get(r.path) || null }));
  },
  async upload(interventoId, file) {
    const safe = (file.name || 'foto.jpg').replace(/[^A-Za-z0-9._-]/g, '_');
    const path = `${interventoId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
    const up = await supabase.storage.from(FOTO_BUCKET).upload(path, file, { upsert: false, contentType: file.type || undefined });
    if (up.error) throw up.error;
    return chk(await supabase.from('intervento_foto').insert({ intervento_id: interventoId, path }).select().single());
  },
  async remove(row) {
    const del = await supabase.storage.from(FOTO_BUCKET).remove([row.path]);
    if (del.error) throw del.error;
    return chk(await supabase.from('intervento_foto').delete().eq('id', row.id));
  },
};
