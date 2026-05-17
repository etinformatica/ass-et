import { useState } from 'react';
import { Badge, Btn, Topbar, Icon } from '../components/UI';
import { Loading, ErrorState } from '../components/States';
import { Modal, ConfirmDialog, Field } from '../components/Modal';
import { useData } from '../lib/useData';
import { magazzinoApi, ordiniApi } from '../lib/api';

const CATEGORIE = ['Tutti', 'Storage', 'Memorie', 'Display', 'Batterie', 'Tastiere', 'Accessori'];
const EMPTY = { sku: '', nome: '', categoria: 'Accessori', stock: 0, min_stock: 0, costo_acq: 0, prezzo_vend: 0, fornitore: '' };

export default function Magazzino() {
  const mag = useData(() => magazzinoApi.list(), []);
  const ordini = useData(() => ordiniApi.list(), []);
  const [cat, setCat] = useState('Tutti');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const list = mag.data || [];
  const sottoscorta = list.filter(a => a.stock < a.min_stock);
  const filtered = list
    .filter(a => cat === 'Tutti' || a.categoria === cat)
    .filter(a => !q.trim() || a.nome.toLowerCase().includes(q.toLowerCase()) || a.sku.toLowerCase().includes(q.toLowerCase()));

  const valoreCosto = list.reduce((s, a) => s + Number(a.costo_acq) * a.stock, 0);
  const valoreVend = list.reduce((s, a) => s + Number(a.prezzo_vend) * a.stock, 0);

  async function save(form) {
    setBusy(true);
    try {
      const payload = { ...form, stock: Number(form.stock), min_stock: Number(form.min_stock), costo_acq: Number(form.costo_acq), prezzo_vend: Number(form.prezzo_vend) };
      if (editing && editing.id) await magazzinoApi.update(editing.id, payload);
      else await magazzinoApi.create(payload);
      setEditing(null);
      mag.reload();
    } catch (e) { alert('Errore: ' + e.message); } finally { setBusy(false); }
  }
  async function doDelete() {
    setBusy(true);
    try { await magazzinoApi.remove(toDelete.id); setToDelete(null); mag.reload(); }
    catch (e) { alert('Errore: ' + e.message); } finally { setBusy(false); }
  }
  const margine = a => Number(a.prezzo_vend) ? Math.round((1 - Number(a.costo_acq) / Number(a.prezzo_vend)) * 100) : 0;

  return (
    <main className="main">
      <Topbar
        crumbs={['Magazzino']}
        right={
          <>
            <Btn size="sm">Inventario fisico</Btn>
            <Btn size="sm" tone="primary" icon="plus" onClick={() => setEditing({ ...EMPTY })}>Nuovo articolo</Btn>
          </>
        }
      />
      <div className="content">
        <div className="page-head">
          <div>
            <div className="page-title">Magazzino</div>
            <div className="page-sub">{list.length} articoli · € {valoreCosto.toLocaleString('it-IT')} a costo · € {valoreVend.toLocaleString('it-IT')} valore vendita</div>
          </div>
          <div className="row center" style={{ gap: 6, flexWrap: 'wrap' }}>
            {CATEGORIE.map(c => <Btn key={c} size="sm" tone={cat === c ? 'primary' : ''} onClick={() => setCat(c)}>{c}</Btn>)}
          </div>
        </div>

        {mag.loading && <Loading />}
        {mag.error && <ErrorState error={mag.error} onRetry={mag.reload} />}
        {!mag.loading && !mag.error && (
          <>
            <div className="kpi-grid kpi-grid-4">
              <div className="card kpi"><div className="kpi-label">Sottoscorta</div><div className="kpi-value" style={{ color: 'var(--hf-amber)' }}>{sottoscorta.length}</div><span className="kpi-trend down">↑ da riordinare</span></div>
              <div className="card kpi"><div className="kpi-label">Articoli totali</div><div className="kpi-value">{list.length}</div><span className="kpi-trend flat">• catalogo</span></div>
              <div className="card kpi"><div className="kpi-label">Valore a costo</div><div className="kpi-value sm">€ {valoreCosto.toLocaleString('it-IT')}</div><span className="kpi-trend flat">• immobilizzato</span></div>
              <div className="card kpi"><div className="kpi-label">Margine potenziale</div><div className="kpi-value sm">€ {(valoreVend - valoreCosto).toLocaleString('it-IT')}</div><span className="kpi-trend up">↑ su vendita stock</span></div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
              <div className="card" style={{ padding: 0, borderColor: 'var(--hf-amber)' }}>
                <div className="alert-banner">
                  <span style={{ fontSize: 14 }}>⚠</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Sottoscorta — azione richiesta</span>
                  <Badge tone="amber" dot={false}>{sottoscorta.length} articoli</Badge>
                </div>
                {sottoscorta.length > 0 ? (
                  <table className="data-table">
                    <thead><tr><th>Articolo</th><th>Stock</th><th>Min</th><th>Da ord.</th><th>Fornitore</th><th>€ cad.</th></tr></thead>
                    <tbody>
                      {sottoscorta.map(a => (
                        <tr key={a.id} onClick={() => setEditing(a)}>
                          <td><div className="strong">{a.nome}</div><div className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{a.sku}</div></td>
                          <td><Badge tone={a.stock === 0 ? 'red' : 'amber'}>{a.stock} / {a.min_stock}</Badge></td>
                          <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{a.min_stock}</td>
                          <td className="strong">{a.min_stock - a.stock}</td>
                          <td>{a.fornitore}</td>
                          <td className="mono">€ {a.costo_acq}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <div style={{ padding: 16, fontSize: 13, color: 'var(--hf-text-3)', textAlign: 'center' }}>Nessun articolo sottoscorta 🎉</div>}
              </div>

              <div className="card">
                <div className="row between" style={{ marginBottom: 10 }}>
                  <div className="card-title">Ordini in arrivo</div>
                  {ordini.data && <Badge tone="amber" dot={false}>{ordini.data.length}</Badge>}
                </div>
                {ordini.loading ? <Loading /> : (
                  <div className="col" style={{ gap: 10 }}>
                    {(ordini.data || []).map((o, i) => (
                      <div key={o.id} className="row center" style={{ gap: 10, paddingTop: i > 0 ? 10 : 0, borderTop: i > 0 ? '1px solid var(--hf-border)' : 'none' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="row center" style={{ gap: 6, marginBottom: 2 }}>
                            <span className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{o.codice}</span>
                            <Badge tone={o.stato_tone}>{o.stato}</Badge>
                          </div>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{o.fornitore}</div>
                          <div style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{o.articoli}</div>
                        </div>
                        <div className="mono strong">€ {o.totale}</div>
                      </div>
                    ))}
                    {(ordini.data || []).length === 0 && <div style={{ fontSize: 13, color: 'var(--hf-text-3)' }}>Nessun ordine in arrivo.</div>}
                  </div>
                )}
              </div>
            </div>

            <div className="table-wrap">
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hf-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Catalogo articoli</span>
                <Badge tone="gray" dot={false}>{filtered.length}</Badge>
                <div style={{ flex: 1 }} />
                <div className="search-box" style={{ minWidth: 240 }}>
                  <Icon name="search" />
                  <input value={q} onChange={e => setQ(e.target.value)} placeholder="SKU, nome…" style={{ border: 'none', background: 'transparent', outline: 'none', font: 'inherit', fontSize: 13, width: '100%' }} />
                </div>
              </div>
              <table className="data-table">
                <thead><tr><th>SKU</th><th>Articolo</th><th>Categoria</th><th>Stock</th><th>€ acq.</th><th>€ vend.</th><th>Margine</th><th>Fornitore</th><th></th></tr></thead>
                <tbody>
                  {filtered.map(a => (
                    <tr key={a.id} onClick={() => setEditing(a)}>
                      <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{a.sku}</td>
                      <td className="strong">{a.nome}</td>
                      <td style={{ color: 'var(--hf-text-3)' }}>{a.categoria}</td>
                      <td><Badge tone={a.stock < a.min_stock ? (a.stock === 0 ? 'red' : 'amber') : 'green'} dot={false}>{a.stock}</Badge></td>
                      <td className="mono" style={{ color: 'var(--hf-text-3)' }}>€ {a.costo_acq}</td>
                      <td className="mono strong">€ {a.prezzo_vend}</td>
                      <td><Badge tone="accent">{margine(a)}%</Badge></td>
                      <td style={{ color: 'var(--hf-text-2)' }}>{a.fornitore}</td>
                      <td onClick={e => e.stopPropagation()} style={{ whiteSpace: 'nowrap' }}>
                        <button className="btn ghost sm" style={{ padding: 4 }} onClick={() => setEditing(a)}><Icon name="edit" /></button>
                        <button className="btn ghost sm" style={{ padding: 4 }} onClick={() => setToDelete(a)}><Icon name="trash" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {editing && <ArticoloForm initial={editing} onClose={() => setEditing(null)} onSave={save} busy={busy} />}
      {toDelete && <ConfirmDialog message={`Eliminare l'articolo "${toDelete.nome}" (${toDelete.sku})?`} onConfirm={doDelete} onClose={() => setToDelete(null)} busy={busy} />}
    </main>
  );
}

function ArticoloForm({ initial, onClose, onSave, busy }) {
  const [f, setF] = useState({
    sku: initial.sku || '', nome: initial.nome || '', categoria: initial.categoria || 'Accessori',
    stock: initial.stock ?? 0, min_stock: initial.min_stock ?? 0,
    costo_acq: initial.costo_acq ?? 0, prezzo_vend: initial.prezzo_vend ?? 0, fornitore: initial.fornitore || '',
  });
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  return (
    <Modal
      title={initial.id ? 'Modifica articolo' : 'Nuovo articolo'}
      onClose={onClose}
      footer={<><Btn onClick={onClose}>Annulla</Btn><Btn tone="accent" onClick={() => f.sku.trim() && f.nome.trim() && onSave(f)}>{busy ? 'Salvo…' : 'Salva'}</Btn></>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="SKU"><input className="input mono" value={f.sku} onChange={e => set('sku', e.target.value)} autoFocus /></Field>
        <Field label="Categoria">
          <select className="input" value={f.categoria} onChange={e => set('categoria', e.target.value)}>
            {CATEGORIE.filter(c => c !== 'Tutti').map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Nome articolo"><input className="input" value={f.nome} onChange={e => set('nome', e.target.value)} /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Stock"><input className="input mono" type="number" value={f.stock} onChange={e => set('stock', e.target.value)} /></Field>
        <Field label="Stock minimo"><input className="input mono" type="number" value={f.min_stock} onChange={e => set('min_stock', e.target.value)} /></Field>
        <Field label="Costo acquisto €"><input className="input mono" type="number" value={f.costo_acq} onChange={e => set('costo_acq', e.target.value)} /></Field>
        <Field label="Prezzo vendita €"><input className="input mono" type="number" value={f.prezzo_vend} onChange={e => set('prezzo_vend', e.target.value)} /></Field>
      </div>
      <Field label="Fornitore"><input className="input" value={f.fornitore} onChange={e => set('fornitore', e.target.value)} /></Field>
    </Modal>
  );
}
