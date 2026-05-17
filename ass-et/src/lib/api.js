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
