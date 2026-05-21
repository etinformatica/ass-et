import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Btn, Topbar, Icon } from '../components/UI';
import { Loading, ErrorState } from '../components/States';
import { Modal, ConfirmDialog, Field } from '../components/Modal';
import { useData } from '../lib/useData';
import { magazzinoApi, ordiniApi, carichiApi, fornitoriApi } from '../lib/api';

const CATEGORIE = ['Tutti', 'Storage', 'Memorie', 'Display', 'Batterie', 'Tastiere', 'Accessori'];
const EMPTY = { sku: '', nome: '', categoria: 'Accessori', stock: 0, min_stock: 0, costo_acq: 0, prezzo_vend: 0, fornitore: '' };

export default function Magazzino() {
  const mag = useData(() => magazzinoApi.list(), []);
  const ordini = useData(() => ordiniApi.list(), []);
  const carichi = useData(() => carichiApi.list(), []);
  const fornitori = useData(() => fornitoriApi.list(), []);
  const [cat, setCat] = useState('Tutti');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [caricoOpen, setCaricoOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const list = mag.data || [];
  const sottoscorta = list.filter(a => a.stock < a.min_stock);
  const filtered = list
    .filter(a => cat === 'Tutti' || a.categoria === cat)
    .filter(a => {
      const s = q.trim().toLowerCase();
      if (!s) return true;
      return (
        (a.nome || '').toLowerCase().includes(s) ||
        (a.sku || '').toLowerCase().includes(s) ||
        (a.categoria || '').toLowerCase().includes(s) ||
        (a.fornitore || '').toLowerCase().includes(s)
      );
    });

  const valoreCosto = list.reduce((s, a) => s + Number(a.costo_acq) * a.stock, 0);
  const valoreVend = list.reduce((s, a) => s + Number(a.prezzo_vend) * a.stock, 0);

  async function save({ articolo, carico }) {
    setBusy(true);
    try {
      const up = v => (typeof v === 'string' ? v.toUpperCase() : v);
      const payload = {
        sku: articolo.sku?.trim() ? up(articolo.sku.trim()) : null,
        nome: up(articolo.nome), categoria: articolo.categoria,
        min_stock: Number(articolo.min_stock), costo_acq: Number(articolo.costo_acq),
        prezzo_vend: Number(articolo.prezzo_vend), fornitore: up(articolo.fornitore),
      };
      if (editing && editing.id) {
        await magazzinoApi.update(editing.id, { ...payload, stock: Number(articolo.stock) });
      } else {
        // Nuovo articolo: stock parte da 0, poi il carico iniziale (via trigger) lo incrementa
        const created = await magazzinoApi.create({ ...payload, stock: 0 });
        if (carico && Number(carico.qty) > 0) {
          await carichiApi.create({
            magazzino_id: created.id,
            sku: created.sku,
            nome: created.nome,
            qty: Number(carico.qty),
            costo_acq: carico.costo_acq === '' || carico.costo_acq == null ? Number(articolo.costo_acq) : Number(carico.costo_acq),
            numero_fattura: carico.numero_fattura?.trim() || null,
            fornitore: (carico.fornitore || articolo.fornitore || '').trim() || null,
            data_carico: carico.data_carico || new Date().toISOString().slice(0, 10),
          });
        }
      }
      setEditing(null);
      mag.reload();
      carichi.reload();
    } catch (e) { alert('Errore: ' + e.message); } finally { setBusy(false); }
  }
  async function doDelete() {
    setBusy(true);
    try { await magazzinoApi.remove(toDelete.id); setToDelete(null); mag.reload(); }
    catch (e) { alert('Errore: ' + e.message); } finally { setBusy(false); }
  }
  async function saveCarico(c) {
    setBusy(true);
    try {
      await carichiApi.create(c);
      setCaricoOpen(false);
      mag.reload();
      carichi.reload();
    } catch (e) { alert('Errore: ' + e.message); } finally { setBusy(false); }
  }
  const margine = a => Number(a.prezzo_vend) ? Math.round((1 - Number(a.costo_acq) / Number(a.prezzo_vend)) * 100) : 0;

  return (
    <main className="main">
      <Topbar
        crumbs={['Magazzino']}
        right={
          <>
            <Btn size="sm" icon="box" onClick={() => setCaricoOpen(true)}>Carico merce</Btn>
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
                <label className="search-box" style={{ minWidth: 260, cursor: 'text' }}>
                  <Icon name="search" />
                  <input
                    value={q}
                    onChange={e => setQ(e.target.value)}
                    placeholder="Cerca SKU, nome, categoria, fornitore…"
                    autoComplete="off"
                    style={{ border: 'none', background: 'transparent', outline: 'none', font: 'inherit', fontSize: 13, color: 'var(--hf-text)', width: '100%', flex: 1 }}
                  />
                  {q && (
                    <button type="button" onClick={() => setQ('')} title="Pulisci" style={{ border: 'none', background: 'transparent', color: 'var(--hf-text-3)', cursor: 'pointer', padding: 0, fontSize: 14, lineHeight: 1 }}>×</button>
                  )}
                </label>
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

            <div className="table-wrap">
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hf-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Storico carichi merce</span>
                <Badge tone="gray" dot={false}>{(carichi.data || []).length}</Badge>
                <div style={{ flex: 1 }} />
                <Btn size="sm" icon="box" onClick={() => setCaricoOpen(true)}>Nuovo carico</Btn>
              </div>
              {carichi.loading ? <Loading /> : (
                <table className="data-table">
                  <thead><tr><th>Data</th><th>Articolo</th><th>Q.tà</th><th>€ acq.</th><th>N° fattura</th><th>Fornitore</th></tr></thead>
                  <tbody>
                    {(carichi.data || []).map(c => (
                      <tr key={c.id}>
                        <td className="mono" style={{ color: 'var(--hf-text-3)' }}>
                          {c.data_carico ? new Date(c.data_carico).toLocaleDateString('it-IT') : '—'}
                        </td>
                        <td><div className="strong">{c.nome || '—'}</div><div className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{c.sku || ''}</div></td>
                        <td className="strong">+{c.qty}</td>
                        <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{c.costo_acq != null ? `€ ${c.costo_acq}` : '—'}</td>
                        <td className="mono">{c.numero_fattura || '—'}</td>
                        <td style={{ color: 'var(--hf-text-2)' }}>
                          {c.fornitore_rel?.id ? (
                            <Link to={`/fornitori/${c.fornitore_rel.id}`} style={{ color: 'var(--hf-accent)', textDecoration: 'none' }}>
                              {c.fornitore_rel.nome}
                            </Link>
                          ) : (c.fornitore || '—')}
                        </td>
                      </tr>
                    ))}
                    {(carichi.data || []).length === 0 && (
                      <tr><td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--hf-text-3)' }}>Nessun carico registrato.</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}
      </div>

      {editing && <ArticoloForm initial={editing} onClose={() => setEditing(null)} onSave={save} busy={busy} />}
      {caricoOpen && <CaricoModal articoli={list} fornitori={fornitori.data || []} onFornitoriReload={fornitori.reload} onClose={() => setCaricoOpen(false)} onSave={saveCarico} busy={busy} />}
      {toDelete && <ConfirmDialog message={`Eliminare l'articolo "${toDelete.nome}" (${toDelete.sku})?`} onConfirm={doDelete} onClose={() => setToDelete(null)} busy={busy} />}
    </main>
  );
}

function ArticoloForm({ initial, onClose, onSave, busy }) {
  const isNew = !initial.id;
  const oggi = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({
    sku: initial.sku || '', nome: initial.nome || '', categoria: initial.categoria || 'Accessori',
    stock: initial.stock ?? 0, min_stock: initial.min_stock ?? 0,
    costo_acq: initial.costo_acq ?? 0, prezzo_vend: initial.prezzo_vend ?? 0, fornitore: initial.fornitore || '',
  });
  // Carico iniziale (solo per nuovo articolo)
  const [c, setC] = useState({ qty: 0, numero_fattura: '', data_carico: oggi });
  const [err, setErr] = useState(null);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const setCar = (k, v) => setC(s => ({ ...s, [k]: v }));
  function submit() {
    if (!f.nome.trim()) { setErr('Il nome articolo è obbligatorio.'); return; }
    setErr(null);
    onSave({ articolo: f, carico: isNew ? c : null });
  }
  return (
    <Modal
      title={isNew ? 'Nuovo articolo' : 'Modifica articolo'}
      onClose={onClose}
      footer={<><Btn onClick={onClose}>Annulla</Btn><Btn tone="accent" onClick={submit}>{busy ? 'Salvo…' : 'Salva'}</Btn></>}
    >
      {err && (
        <div className="card" style={{ borderColor: 'var(--hf-red)', background: 'var(--hf-red-soft)', color: 'var(--hf-red)', fontSize: 13, padding: '8px 12px' }}>
          ⚠ {err}
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="SKU (facoltativo)"><input className="input mono" value={f.sku} onChange={e => set('sku', e.target.value)} autoFocus /></Field>
        <Field label="Categoria">
          <select className="input" value={f.categoria} onChange={e => set('categoria', e.target.value)}>
            {CATEGORIE.filter(c => c !== 'Tutti').map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Nome articolo"><input className="input" value={f.nome} onChange={e => set('nome', e.target.value)} /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {!isNew && <Field label="Stock"><input className="input mono" type="number" value={f.stock} onChange={e => set('stock', e.target.value)} /></Field>}
        <Field label="Stock minimo"><input className="input mono" type="number" value={f.min_stock} onChange={e => set('min_stock', e.target.value)} /></Field>
        <Field label="Costo acquisto €"><input className="input mono" type="number" value={f.costo_acq} onChange={e => set('costo_acq', e.target.value)} /></Field>
        <Field label="Prezzo vendita €"><input className="input mono" type="number" value={f.prezzo_vend} onChange={e => set('prezzo_vend', e.target.value)} /></Field>
      </div>
      <Field label="Fornitore"><input className="input" value={f.fornitore} onChange={e => set('fornitore', e.target.value)} /></Field>

      {isNew && (
        <div style={{ borderTop: '1px solid var(--hf-border)', paddingTop: 12, marginTop: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Carico iniziale (opzionale)</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <Field label="Quantità"><input className="input mono" type="number" min={0} value={c.qty} onChange={e => setCar('qty', e.target.value)} /></Field>
            <Field label="N° fattura fornitore"><input className="input mono" value={c.numero_fattura} onChange={e => setCar('numero_fattura', e.target.value)} placeholder="es. 2026/142" /></Field>
            <Field label="Data fattura"><input className="input mono" type="date" value={c.data_carico} onChange={e => setCar('data_carico', e.target.value)} /></Field>
          </div>
          <div style={{ fontSize: 11, color: 'var(--hf-text-3)', marginTop: 4 }}>
            Se indichi una quantità, lo stock viene caricato e registrato nello storico carichi con n° fattura e data.
          </div>
        </div>
      )}
    </Modal>
  );
}

function CaricoModal({ articoli, fornitori, onFornitoriReload, onClose, onSave, busy }) {
  const oggi = new Date().toISOString().slice(0, 10);
  const [sel, setSel] = useState('');
  const [qty, setQty] = useState(1);
  const [costo, setCosto] = useState('');
  const [numeroFattura, setNumeroFattura] = useState('');
  const [fornitoreId, setFornitoreId] = useState('');
  const [data, setData] = useState(oggi);
  const [err, setErr] = useState(null);
  const [nuovoOpen, setNuovoOpen] = useState(false);
  const [nuovo, setNuovo] = useState({ nome: '', tel: '', p_iva: '' });
  const [nuovoBusy, setNuovoBusy] = useState(false);

  function pickArticolo(id) {
    setSel(id);
    const a = (articoli || []).find(x => x.id === id);
    if (a) {
      setCosto(a.costo_acq ?? '');
      // se l'articolo ha un fornitore di default come testo, prova a matcharlo all'anagrafica
      if (a.fornitore && !fornitoreId) {
        const match = (fornitori || []).find(f => f.nome === a.fornitore.toUpperCase().trim());
        if (match) setFornitoreId(match.id);
      }
    }
  }

  async function creaNuovoFornitore() {
    if (!nuovo.nome.trim()) { setErr('Il nome del fornitore è obbligatorio.'); return; }
    setNuovoBusy(true);
    setErr(null);
    try {
      const up = v => (typeof v === 'string' ? v.toUpperCase() : v);
      const created = await fornitoriApi.create({
        nome: up(nuovo.nome.trim()),
        tel: nuovo.tel?.trim() || null,
        p_iva: up(nuovo.p_iva?.trim() || ''),
      });
      await onFornitoriReload();
      setFornitoreId(created.id);
      setNuovoOpen(false);
      setNuovo({ nome: '', tel: '', p_iva: '' });
    } catch (e) {
      setErr('Errore creazione fornitore: ' + (e.message || 'duplicato?'));
    } finally { setNuovoBusy(false); }
  }

  function submit() {
    const a = (articoli || []).find(x => x.id === sel);
    if (!a) { setErr('Seleziona un articolo.'); return; }
    if (!(Number(qty) > 0)) { setErr('La quantità deve essere maggiore di zero.'); return; }
    setErr(null);
    const fornitoreObj = (fornitori || []).find(f => f.id === fornitoreId);
    onSave({
      magazzino_id: a.id,
      sku: a.sku,
      nome: a.nome,
      qty: Number(qty),
      costo_acq: costo === '' ? null : Number(costo),
      numero_fattura: numeroFattura.trim() || null,
      fornitore_id: fornitoreId || null,
      fornitore: fornitoreObj ? fornitoreObj.nome : null,
      data_carico: data || oggi,
    });
  }

  return (
    <Modal
      title="Carico merce"
      onClose={onClose}
      footer={<><Btn onClick={onClose}>Annulla</Btn><Btn tone="accent" onClick={submit}>{busy ? 'Carico…' : 'Registra carico'}</Btn></>}
    >
      {err && (
        <div className="card" style={{ borderColor: 'var(--hf-red)', background: 'var(--hf-red-soft)', color: 'var(--hf-red)', fontSize: 13, padding: '8px 12px' }}>
          ⚠ {err}
        </div>
      )}
      {(articoli || []).length === 0 && (
        <div className="card" style={{ borderColor: 'var(--hf-amber)', background: 'var(--hf-amber-soft)', color: 'var(--hf-text-2)', fontSize: 13, padding: '8px 12px' }}>
          Nessun articolo in catalogo. Crea prima un articolo con "Nuovo articolo", poi registra il carico.
        </div>
      )}
      <Field label="Articolo">
        <select className="input" value={sel} onChange={e => pickArticolo(e.target.value)}>
          <option value="">— seleziona —</option>
          {(articoli || []).map(a => (
            <option key={a.id} value={a.id}>{a.nome} ({a.sku}) · stock {a.stock}</option>
          ))}
        </select>
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Quantità caricata"><input className="input mono" type="number" min={1} value={qty} onChange={e => setQty(e.target.value)} /></Field>
        <Field label="Costo acquisto € (cad.)"><input className="input mono" type="number" value={costo} onChange={e => setCosto(e.target.value)} placeholder="0" /></Field>
        <Field label="N° fattura fornitore"><input className="input mono" value={numeroFattura} onChange={e => setNumeroFattura(e.target.value)} placeholder="es. 2026/142" /></Field>
        <Field label="Data carico"><input className="input mono" type="date" value={data} onChange={e => setData(e.target.value)} /></Field>
      </div>

      {nuovoOpen ? (
        <div className="card tinted" style={{ padding: 10 }}>
          <div className="row between" style={{ marginBottom: 8, alignItems: 'center' }}>
            <strong style={{ fontSize: 13 }}>Nuovo fornitore</strong>
            <button className="btn ghost sm" onClick={() => setNuovoOpen(false)}>annulla</button>
          </div>
          <Field label="Nome / ragione sociale"><input className="input" value={nuovo.nome} onChange={e => setNuovo(s => ({ ...s, nome: e.target.value }))} autoFocus /></Field>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Field label="Telefono"><input className="input mono" type="tel" value={nuovo.tel} onChange={e => setNuovo(s => ({ ...s, tel: e.target.value }))} /></Field>
            <Field label="P.IVA"><input className="input mono" value={nuovo.p_iva} onChange={e => setNuovo(s => ({ ...s, p_iva: e.target.value }))} /></Field>
          </div>
          <Btn tone="accent" size="sm" onClick={creaNuovoFornitore}>{nuovoBusy ? 'Salvo…' : 'Crea e usa'}</Btn>
        </div>
      ) : (
        <Field label="Fornitore">
          <div style={{ display: 'flex', gap: 6 }}>
            <select className="input" value={fornitoreId} onChange={e => setFornitoreId(e.target.value)} style={{ flex: 1 }}>
              <option value="">— nessuno —</option>
              {(fornitori || []).map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
            </select>
            <Btn size="sm" onClick={() => setNuovoOpen(true)}>+ nuovo</Btn>
          </div>
        </Field>
      )}
    </Modal>
  );
}
