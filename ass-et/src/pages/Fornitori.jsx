import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge, Btn, Topbar, Icon } from '../components/UI';
import { Loading, ErrorState, EmptyState } from '../components/States';
import { Modal, ConfirmDialog, Field } from '../components/Modal';
import { useData } from '../lib/useData';
import { fornitoriApi, carichiApi } from '../lib/api';

const EMPTY = { nome: '', tel: '', email: '', indirizzo: '', p_iva: '', note: '' };

export default function Fornitori() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fornitori = useData(() => fornitoriApi.list(), []);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const list = fornitori.data || [];
  const filtered = list.filter(f => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (
      (f.nome || '').toLowerCase().includes(s) ||
      (f.tel || '').toLowerCase().includes(s) ||
      (f.email || '').toLowerCase().includes(s) ||
      (f.p_iva || '').toLowerCase().includes(s)
    );
  });
  const selected = id ? list.find(f => f.id === id) : null;

  async function save(form) {
    setBusy(true);
    try {
      const up = v => (typeof v === 'string' ? v.toUpperCase() : v);
      const payload = {
        nome: up(form.nome.trim()),
        tel: form.tel?.trim() || null,
        email: form.email?.trim() || null,
        indirizzo: up(form.indirizzo?.trim() || ''),
        p_iva: up(form.p_iva?.trim() || ''),
        note: up(form.note?.trim() || ''),
      };
      if (editing && editing.id) await fornitoriApi.update(editing.id, payload);
      else await fornitoriApi.create(payload);
      setEditing(null);
      fornitori.reload();
    } catch (e) {
      alert('Errore: ' + (e.message || e.code || 'salvataggio fallito'));
    } finally { setBusy(false); }
  }
  async function doDelete() {
    setBusy(true);
    try {
      await fornitoriApi.remove(toDelete.id);
      if (selected?.id === toDelete.id) navigate('/fornitori');
      setToDelete(null);
      fornitori.reload();
    } catch (e) { alert('Errore: ' + e.message); }
    finally { setBusy(false); }
  }

  return (
    <main className="main">
      <Topbar
        crumbs={['Fornitori', ...(selected ? [selected.nome] : [])]}
        right={<Btn size="sm" tone="primary" icon="plus" onClick={() => setEditing({ ...EMPTY })}>Nuovo fornitore</Btn>}
      />
      <div className="content">
        <div className="page-head">
          <div>
            <div className="page-title">Fornitori</div>
            <div className="page-sub">{list.length} anagrafiche · clicca un fornitore per vedere lo storico dei carichi</div>
          </div>
          <label className="search-box" style={{ minWidth: 280 }}>
            <Icon name="search" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cerca nome, tel, email, P.IVA…" autoComplete="off" />
          </label>
        </div>

        {fornitori.loading && <Loading />}
        {fornitori.error && <ErrorState error={fornitori.error} onRetry={fornitori.reload} />}

        {!fornitori.loading && !fornitori.error && list.length === 0 && (
          <div className="card"><EmptyState title="Nessun fornitore" sub="Crea la prima anagrafica per usarla nei carichi merce." action={<Btn tone="primary" icon="plus" onClick={() => setEditing({ ...EMPTY })}>Nuovo fornitore</Btn>} /></div>
        )}

        {!fornitori.loading && !fornitori.error && list.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.6fr' : '1fr', gap: 16, minHeight: 0 }}>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Nome</th><th>Tel</th><th>P.IVA</th><th></th></tr></thead>
                <tbody>
                  {filtered.map(f => (
                    <tr key={f.id}
                      onClick={() => navigate(`/fornitori/${f.id}`)}
                      style={{ background: selected?.id === f.id ? 'var(--hf-surface-2)' : undefined }}>
                      <td className="strong">{f.nome}</td>
                      <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{f.tel || '—'}</td>
                      <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{f.p_iva || '—'}</td>
                      <td onClick={e => e.stopPropagation()} style={{ whiteSpace: 'nowrap' }}>
                        <button className="btn ghost sm" style={{ padding: 4 }} title="Modifica" onClick={() => setEditing(f)}><Icon name="edit" /></button>
                        <button className="btn ghost sm" style={{ padding: 4 }} title="Elimina" onClick={() => setToDelete(f)}><Icon name="trash" /></button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: 24, color: 'var(--hf-text-3)' }}>Nessun risultato.</td></tr>}
                </tbody>
              </table>
            </div>

            {selected && <FornitoreDetail key={selected.id} fornitore={selected} onEdit={() => setEditing(selected)} onClose={() => navigate('/fornitori')} />}
          </div>
        )}
      </div>

      {editing && <FornitoreForm initial={editing} onClose={() => setEditing(null)} onSave={save} busy={busy} />}
      {toDelete && <ConfirmDialog message={`Eliminare il fornitore "${toDelete.nome}"? I carichi storici resteranno (con riferimento svuotato).`} onConfirm={doDelete} onClose={() => setToDelete(null)} busy={busy} />}
    </main>
  );
}

function FornitoreDetail({ fornitore, onEdit, onClose }) {
  const carichi = useData(() => carichiApi.listByFornitore(fornitore.id), [fornitore.id]);
  const list = carichi.data || [];
  const totalePezzi = list.reduce((s, c) => s + Number(c.qty || 0), 0);
  const totaleSpeso = list.reduce((s, c) => s + Number(c.qty || 0) * Number(c.costo_acq || 0), 0);

  return (
    <div className="col" style={{ gap: 12, minHeight: 0 }}>
      <div className="card">
        <div className="row between" style={{ alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{fornitore.nome}</div>
            {fornitore.p_iva && <div className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>P.IVA {fornitore.p_iva}</div>}
          </div>
          <div className="row" style={{ gap: 4 }}>
            <Btn size="sm" icon="edit" onClick={onEdit}>Modifica</Btn>
            <Btn size="sm" onClick={onClose}>✕</Btn>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
          <div><span style={{ color: 'var(--hf-text-3)' }}>Telefono</span><div className="mono">{fornitore.tel || '—'}</div></div>
          <div><span style={{ color: 'var(--hf-text-3)' }}>Email</span><div className="mono" style={{ textTransform: 'none' }}>{fornitore.email || '—'}</div></div>
          <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'var(--hf-text-3)' }}>Indirizzo</span><div>{fornitore.indirizzo || '—'}</div></div>
          {fornitore.note && <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'var(--hf-text-3)' }}>Note</span><div style={{ color: 'var(--hf-text-2)' }}>{fornitore.note}</div></div>}
        </div>
      </div>

      <div className="kpi-grid kpi-grid-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card kpi"><div className="kpi-label">Carichi</div><div className="kpi-value sm">{list.length}</div></div>
        <div className="card kpi"><div className="kpi-label">Pezzi acquistati</div><div className="kpi-value sm">{totalePezzi}</div></div>
        <div className="card kpi"><div className="kpi-label">Totale speso</div><div className="kpi-value sm">€ {totaleSpeso.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div></div>
      </div>

      <div className="table-wrap" style={{ minHeight: 0 }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hf-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Storico carichi</span>
          <Badge tone="gray" dot={false}>{list.length}</Badge>
        </div>
        {carichi.loading && <Loading />}
        {carichi.error && <ErrorState error={carichi.error} onRetry={carichi.reload} />}
        {!carichi.loading && !carichi.error && (
          list.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--hf-text-3)', fontSize: 13 }}>Nessun carico registrato da questo fornitore.</div>
          ) : (
            <table className="data-table">
              <thead><tr><th>Data</th><th>Articolo</th><th>SKU</th><th style={{ textAlign: 'right' }}>Q.</th><th style={{ textAlign: 'right' }}>€ cad.</th><th style={{ textAlign: 'right' }}>Totale</th><th>N° fattura</th></tr></thead>
              <tbody>
                {list.map(c => (
                  <tr key={c.id}>
                    <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{c.data_carico ? new Date(c.data_carico).toLocaleDateString('it-IT') : '—'}</td>
                    <td className="strong">{c.nome || '—'}</td>
                    <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{c.sku || '—'}</td>
                    <td className="mono" style={{ textAlign: 'right' }}>{c.qty}</td>
                    <td className="mono" style={{ textAlign: 'right', color: 'var(--hf-text-3)' }}>{c.costo_acq != null ? `€ ${c.costo_acq}` : '—'}</td>
                    <td className="mono strong" style={{ textAlign: 'right' }}>€ {(Number(c.qty || 0) * Number(c.costo_acq || 0)).toFixed(2).replace('.', ',')}</td>
                    <td className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{c.numero_fattura || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}

function FornitoreForm({ initial, onClose, onSave, busy }) {
  const [f, setF] = useState({
    nome: initial.nome || '', tel: initial.tel || '', email: initial.email || '',
    indirizzo: initial.indirizzo || '', p_iva: initial.p_iva || '', note: initial.note || '',
  });
  const [err, setErr] = useState(null);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  function submit() {
    if (!f.nome.trim()) { setErr('Il nome del fornitore è obbligatorio.'); return; }
    setErr(null);
    onSave(f);
  }
  return (
    <Modal
      title={initial.id ? 'Modifica fornitore' : 'Nuovo fornitore'}
      onClose={onClose}
      footer={<><Btn onClick={onClose}>Annulla</Btn><Btn tone="accent" onClick={submit}>{busy ? 'Salvo…' : 'Salva'}</Btn></>}
    >
      {err && (
        <div className="card" style={{ borderColor: 'var(--hf-red)', background: 'var(--hf-red-soft)', color: 'var(--hf-red)', fontSize: 13, padding: '8px 12px' }}>
          ⚠ {err}
        </div>
      )}
      <Field label="Nome / ragione sociale"><input className="input" value={f.nome} onChange={e => set('nome', e.target.value)} autoFocus /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Telefono"><input className="input mono" type="tel" value={f.tel} onChange={e => set('tel', e.target.value)} /></Field>
        <Field label="Email"><input className="input mono" type="email" value={f.email} onChange={e => set('email', e.target.value)} /></Field>
      </div>
      <Field label="Indirizzo"><input className="input" value={f.indirizzo} onChange={e => set('indirizzo', e.target.value)} /></Field>
      <Field label="P.IVA"><input className="input mono" value={f.p_iva} onChange={e => set('p_iva', e.target.value)} /></Field>
      <Field label="Note"><textarea className="input" rows={2} value={f.note} onChange={e => set('note', e.target.value)} /></Field>
    </Modal>
  );
}
