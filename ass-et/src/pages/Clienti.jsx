import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Btn, Avatar, Topbar, Icon } from '../components/UI';
import { Loading, ErrorState, EmptyState } from '../components/States';
import { Modal, ConfirmDialog, Field } from '../components/Modal';
import { useData } from '../lib/useData';
import { clientiApi, interventiApi } from '../lib/api';

const EMPTY = { nome: '', tel: '', email: '', cf: '', tipo: 'Privato' };

export default function Clienti() {
  const navigate = useNavigate();
  const clienti = useData(() => clientiApi.list(), []);
  const interventi = useData(() => interventiApi.list(), []);
  const [selectedId, setSelectedId] = useState(null);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);   // {} = nuovo, oggetto = modifica
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const list = clienti.data || [];
  const allInt = interventi.data || [];
  const filtered = list.filter(c => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return c.nome.toLowerCase().includes(s) || (c.tel || '').includes(s) || (c.cf || '').toLowerCase().includes(s);
  });
  const selected = list.find(c => c.id === selectedId) || filtered[0] || list[0];
  const clienteInt = selected ? allInt.filter(i => i.cliente_id === selected.id) : [];
  const spesa = clienteInt.reduce((s, i) => s + Number(i.totale_stimato || 0), 0);

  async function save(form) {
    setBusy(true);
    try {
      const up = v => (typeof v === 'string' ? v.toUpperCase() : v);
      const payload = { ...form, nome: up(form.nome), cf: up(form.cf) };
      if (editing && editing.id) await clientiApi.update(editing.id, payload);
      else await clientiApi.create(payload);
      setEditing(null);
      clienti.reload();
    } catch (e) { alert('Errore: ' + e.message); } finally { setBusy(false); }
  }
  async function doDelete() {
    setBusy(true);
    try { await clientiApi.remove(toDelete.id); setToDelete(null); setSelectedId(null); clienti.reload(); }
    catch (e) { alert('Errore: ' + e.message); } finally { setBusy(false); }
  }

  return (
    <main className="main">
      <Topbar
        crumbs={['Clienti']}
        right={<Btn size="sm" tone="primary" icon="plus" onClick={() => setEditing({ ...EMPTY })}>Nuovo cliente</Btn>}
      />
      <div className="content">
        <div className="page-head">
          <div>
            <div className="page-title">Anagrafica clienti</div>
            <div className="page-sub">{list.length} clienti registrati</div>
          </div>
          <div className="search-box" style={{ minWidth: 280 }}>
            <Icon name="search" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Nome, telefono, CF…" style={{ border: 'none', background: 'transparent', outline: 'none', font: 'inherit', fontSize: 13, width: '100%' }} />
          </div>
        </div>

        {clienti.loading && <Loading />}
        {clienti.error && <ErrorState error={clienti.error} onRetry={clienti.reload} />}
        {!clienti.loading && !clienti.error && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16, minHeight: 0, flex: 1 }}>
            <div className="table-wrap" style={{ overflowY: 'auto' }}>
              <table className="data-table">
                <thead><tr><th>Cliente</th><th>Tipo</th><th>Tel</th><th></th></tr></thead>
                <tbody>
                  {filtered.map(c => (
                    <tr key={c.id} onClick={() => setSelectedId(c.id)} style={{ background: selected?.id === c.id ? 'var(--hf-accent-soft)' : undefined }}>
                      <td><div className="row center" style={{ gap: 8 }}><Avatar name={c.nome} tone={c.tipo === 'Azienda' ? 'blue' : 'violet'} size="sm" /><span className="strong">{c.nome}</span></div></td>
                      <td><Badge tone={c.tipo === 'Azienda' ? 'blue' : 'gray'}>{c.tipo}</Badge></td>
                      <td className="mono" style={{ fontSize: 12, color: 'var(--hf-text-3)' }}>{c.tel}</td>
                      <td onClick={e => e.stopPropagation()} style={{ whiteSpace: 'nowrap' }}>
                        <button className="btn ghost sm" style={{ padding: 4 }} onClick={() => setEditing(c)}><Icon name="edit" /></button>
                        <button className="btn ghost sm" style={{ padding: 4 }} onClick={() => setToDelete(c)}><Icon name="trash" /></button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={4}><EmptyState title="Nessun cliente" /></td></tr>}
                </tbody>
              </table>
            </div>

            {selected && (
              <div className="col" style={{ gap: 16 }}>
                <div className="card">
                  <div className="row center" style={{ gap: 12, marginBottom: 14 }}>
                    <Avatar name={selected.nome} tone={selected.tipo === 'Azienda' ? 'blue' : 'violet'} size="md" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 18, letterSpacing: '-0.01em' }}>{selected.nome}</div>
                      <Badge tone={selected.tipo === 'Azienda' ? 'blue' : 'gray'} dot={false}>{selected.tipo}</Badge>
                    </div>
                    <Btn size="sm" icon="edit" onClick={() => setEditing(selected)}>Modifica</Btn>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                    <div><div className="field-label">Telefono</div><div className="mono">{selected.tel || '—'}</div></div>
                    <div><div className="field-label">Email</div><div style={{ color: 'var(--hf-text-2)' }}>{selected.email || '—'}</div></div>
                    <div><div className="field-label">CF / P.IVA</div><div className="mono">{selected.cf || '—'}</div></div>
                    <div><div className="field-label">Cliente dal</div><div style={{ color: 'var(--hf-text-2)' }}>{new Date(selected.created_at).toLocaleDateString('it-IT')}</div></div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  <div className="card kpi"><div className="kpi-label">Interventi</div><div className="kpi-value sm">{clienteInt.length}</div></div>
                  <div className="card kpi"><div className="kpi-label">Spesa stimata</div><div className="kpi-value sm">€ {spesa.toLocaleString('it-IT')}</div></div>
                  <div className="card kpi"><div className="kpi-label">Scontrino medio</div><div className="kpi-value sm">€ {clienteInt.length ? Math.round(spesa / clienteInt.length) : 0}</div></div>
                </div>

                <div className="card" style={{ padding: 0, flex: 1 }}>
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hf-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>Storico interventi</span>
                    <Btn size="sm" tone="primary" icon="plus" onClick={() => navigate('/accettazione')}>Nuovo</Btn>
                  </div>
                  {clienteInt.length > 0 ? (
                    <table className="data-table">
                      <thead><tr><th>N°</th><th>Dispositivo</th><th>Aperto</th><th>Stato</th><th>Totale</th></tr></thead>
                      <tbody>
                        {clienteInt.map(t => (
                          <tr key={t.id} onClick={() => navigate(`/interventi/${t.id}`)}>
                            <td className="mono" style={{ color: 'var(--hf-text-3)' }}>#{t.numero}</td>
                            <td className="strong">{t.dispositivo}</td>
                            <td style={{ color: 'var(--hf-text-3)' }}>{new Date(t.created_at).toLocaleDateString('it-IT')}</td>
                            <td><Badge tone={t.stato_tone}>{t.stato}</Badge></td>
                            <td className="mono">{t.totale_stimato ? `€ ${t.totale_stimato}` : '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <EmptyState title="Nessun intervento" sub="Questo cliente non ha ancora interventi." />
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {editing && <ClienteForm initial={editing} onClose={() => setEditing(null)} onSave={save} busy={busy} />}
      {toDelete && <ConfirmDialog message={`Eliminare il cliente "${toDelete.nome}"? Gli interventi collegati resteranno ma senza cliente.`} onConfirm={doDelete} onClose={() => setToDelete(null)} busy={busy} />}
    </main>
  );
}

function ClienteForm({ initial, onClose, onSave, busy }) {
  const [f, setF] = useState({ nome: initial.nome || '', tel: initial.tel || '', email: initial.email || '', cf: initial.cf || '', tipo: initial.tipo || 'Privato' });
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  return (
    <Modal
      title={initial.id ? 'Modifica cliente' : 'Nuovo cliente'}
      onClose={onClose}
      footer={<><Btn onClick={onClose}>Annulla</Btn><Btn tone="accent" onClick={() => f.nome.trim() && onSave(f)}>{busy ? 'Salvo…' : 'Salva'}</Btn></>}
    >
      <Field label="Tipo">
        <select className="input" value={f.tipo} onChange={e => set('tipo', e.target.value)}><option>Privato</option><option>Azienda</option></select>
      </Field>
      <Field label={f.tipo === 'Azienda' ? 'Ragione sociale' : 'Nome e cognome'}>
        <input className="input" value={f.nome} onChange={e => set('nome', e.target.value)} autoFocus />
      </Field>
      <Field label="Telefono"><input className="input mono" value={f.tel} onChange={e => set('tel', e.target.value)} /></Field>
      <Field label="Email"><input className="input" value={f.email} onChange={e => set('email', e.target.value)} /></Field>
      <Field label={f.tipo === 'Azienda' ? 'P.IVA' : 'Codice fiscale'}><input className="input mono" value={f.cf} onChange={e => set('cf', e.target.value)} /></Field>
    </Modal>
  );
}
