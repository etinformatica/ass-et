import { useState } from 'react';
import { Modal, Field } from './Modal';
import { Btn } from './UI';
import { Loading } from './States';
import { useData } from '../lib/useData';
import { magazzinoApi, fornitoriApi } from '../lib/api';

// Modal "Aggiungi pezzo" usato sia da Dettaglio (salva subito su DB) sia da
// Accettazione (accumula in una bozza locale). Il parent decide come persistere
// il payload tramite onCommit(payload) → Promise.
export default function PezzoModal({ onClose, onCommit }) {
  const { data: mag, loading } = useData(() => magazzinoApi.list(), []);
  const { data: forn } = useData(() => fornitoriApi.list(), []);
  const [tab, setTab] = useState('magazzino');

  // --- tab Da magazzino
  const [sel, setSel] = useState('');
  const [qty, setQty] = useState(1);

  // --- tab Da ordinare
  const [gen, setGen] = useState({
    nome: '', descrizione: '', qty: 1,
    costo_acq: '', prezzo_vend: '',
    fornitore_id: '', note: '',
  });

  // --- tab Recuperato/usato
  const [rec, setRec] = useState({
    nome: '', descrizione: '', qty: 1,
    costo_acq: '', prezzo_vend: '', note: '',
  });

  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const setG = (k, v) => setGen(s => ({ ...s, [k]: v }));
  const setR = (k, v) => setRec(s => ({ ...s, [k]: v }));

  async function commit(payload) {
    setBusy(true); setErr(null);
    try {
      await onCommit(payload);
    } catch (e) { alert('Errore: ' + e.message); setBusy(false); }
  }

  async function saveMagazzino() {
    const a = (mag || []).find(m => m.id === sel);
    if (!a) { setErr('Seleziona un articolo.'); return; }
    await commit({
      magazzino_id: a.id, sku: a.sku, nome: a.nome, qty: Number(qty),
      costo_acq: a.costo_acq, prezzo_vend: a.prezzo_vend,
      stato: a.stock >= qty ? 'A stock' : 'Da ordinare',
      stato_tone: a.stock >= qty ? 'green' : 'amber',
    });
  }
  async function saveGenerico() {
    if (!gen.nome.trim()) { setErr('Il nome del pezzo è obbligatorio.'); return; }
    if (!(Number(gen.qty) > 0)) { setErr('Quantità non valida.'); return; }
    const up = v => (typeof v === 'string' ? v.toUpperCase() : v);
    await commit({
      magazzino_id: null,
      fornitore_id: gen.fornitore_id || null,
      sku: null,
      nome: up(gen.nome.trim()),
      descrizione: up(gen.descrizione.trim() || ''),
      note: up(gen.note.trim() || ''),
      qty: Number(gen.qty),
      costo_acq: gen.costo_acq === '' ? 0 : Number(gen.costo_acq),
      prezzo_vend: gen.prezzo_vend === '' ? 0 : Number(gen.prezzo_vend),
      stato: 'Da ordinare',
      stato_tone: 'amber',
    });
  }
  async function saveRecuperato() {
    if (!rec.nome.trim()) { setErr('Il nome del pezzo è obbligatorio.'); return; }
    if (!(Number(rec.qty) > 0)) { setErr('Quantità non valida.'); return; }
    const up = v => (typeof v === 'string' ? v.toUpperCase() : v);
    await commit({
      magazzino_id: null,
      sku: null,
      nome: up(rec.nome.trim()),
      descrizione: up(rec.descrizione.trim() || ''),
      note: up(rec.note.trim() || ''),
      qty: Number(rec.qty),
      costo_acq: rec.costo_acq === '' ? 0 : Number(rec.costo_acq),
      prezzo_vend: rec.prezzo_vend === '' ? 0 : Number(rec.prezzo_vend),
      stato: 'A stock',
      stato_tone: 'green',
    });
  }
  const save = tab === 'magazzino' ? saveMagazzino : tab === 'generico' ? saveGenerico : saveRecuperato;

  return (
    <Modal title="Aggiungi pezzo" onClose={onClose} width={560}
      footer={<><Btn onClick={onClose}>Annulla</Btn><Btn tone="accent" onClick={save}>{busy ? 'Aggiungo…' : 'Aggiungi'}</Btn></>}>
      <div className="tabs">
        <div className={`tab ${tab === 'magazzino' ? 'active' : ''}`} onClick={() => setTab('magazzino')}>📦 Da magazzino</div>
        <div className={`tab ${tab === 'generico' ? 'active' : ''}`} onClick={() => setTab('generico')}>🛒 Da ordinare</div>
        <div className={`tab ${tab === 'recuperato' ? 'active' : ''}`} onClick={() => setTab('recuperato')}>🔧 Recuperato/usato</div>
      </div>
      {err && (
        <div className="card" style={{ borderColor: 'var(--hf-red)', background: 'var(--hf-red-soft)', color: 'var(--hf-red)', fontSize: 13, padding: '8px 12px' }}>
          ⚠ {err}
        </div>
      )}
      {tab === 'magazzino' && (loading ? <Loading /> : (
        <>
          <Field label="Articolo">
            <select className="input" value={sel} onChange={e => setSel(e.target.value)}>
              <option value="">— seleziona —</option>
              {(mag || []).map(m => (
                <option key={m.id} value={m.id}>{m.nome}{m.sku ? ` (${m.sku})` : ''} · stock {m.stock} · € {m.prezzo_vend}</option>
              ))}
            </select>
          </Field>
          <Field label="Quantità">
            <input className="input mono" type="number" min={1} value={qty} onChange={e => setQty(e.target.value)} />
          </Field>
        </>
      ))}
      {tab === 'generico' && (
        <>
          <div style={{ fontSize: 12, color: 'var(--hf-text-3)', marginTop: -4 }}>
            Per pezzi non ancora a catalogo. Comparirà nella lista "Da ordinare" della pagina Fornitori.
          </div>
          <Field label="Nome pezzo">
            <input className="input" value={gen.nome} onChange={e => setG('nome', e.target.value)} placeholder="Es: Vetro fotocamera iPhone 14 Pro" autoFocus />
          </Field>
          <Field label="Descrizione (facoltativa)">
            <input className="input" value={gen.descrizione} onChange={e => setG('descrizione', e.target.value)} placeholder="Modello, codice ricambio, colore…" />
          </Field>
          <div className="responsive-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <Field label="Quantità"><input className="input mono" type="number" min={1} value={gen.qty} onChange={e => setG('qty', e.target.value)} /></Field>
            <Field label="Costo stimato € cad."><input className="input mono" type="number" step="0.01" value={gen.costo_acq} onChange={e => setG('costo_acq', e.target.value)} placeholder="0,00" /></Field>
            <Field label="Prezzo vendita stimato € cad."><input className="input mono" type="number" step="0.01" value={gen.prezzo_vend} onChange={e => setG('prezzo_vend', e.target.value)} placeholder="0,00" /></Field>
          </div>
          <Field label="Fornitore suggerito (facoltativo)">
            <select className="input" value={gen.fornitore_id} onChange={e => setG('fornitore_id', e.target.value)}>
              <option value="">— non ancora deciso —</option>
              {(forn || []).map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>
          </Field>
          <Field label="Note (facoltative)">
            <textarea className="input" rows={2} value={gen.note} onChange={e => setG('note', e.target.value)} placeholder="Link, specifiche, alternative…" style={{ resize: 'vertical' }} />
          </Field>
        </>
      )}
      {tab === 'recuperato' && (
        <>
          <div style={{ fontSize: 12, color: 'var(--hf-text-3)', marginTop: -4 }}>
            Per pezzi già disponibili in laboratorio (recuperati da altri apparecchi, usati, fondi di magazzino). Nessuna fattura richiesta, va direttamente in "A stock".
          </div>
          <Field label="Nome pezzo">
            <input className="input" value={rec.nome} onChange={e => setR('nome', e.target.value)} placeholder="Es: Vetro fotocamera iPhone 14 Pro" autoFocus />
          </Field>
          <Field label="Descrizione (facoltativa)">
            <input className="input" value={rec.descrizione} onChange={e => setR('descrizione', e.target.value)} placeholder="Stato, provenienza, modello…" />
          </Field>
          <div className="responsive-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
            <Field label="Quantità"><input className="input mono" type="number" min={1} value={rec.qty} onChange={e => setR('qty', e.target.value)} /></Field>
            <Field label="Costo € cad."><input className="input mono" type="number" step="0.01" value={rec.costo_acq} onChange={e => setR('costo_acq', e.target.value)} placeholder="0,00" /></Field>
            <Field label="Prezzo vendita € cad."><input className="input mono" type="number" step="0.01" value={rec.prezzo_vend} onChange={e => setR('prezzo_vend', e.target.value)} placeholder="0,00" /></Field>
          </div>
          <Field label="Note (facoltative)">
            <textarea className="input" rows={2} value={rec.note} onChange={e => setR('note', e.target.value)} placeholder="Provenienza, condizioni, garanzia…" style={{ resize: 'vertical' }} />
          </Field>
        </>
      )}
    </Modal>
  );
}
