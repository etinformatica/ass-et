import { useState } from 'react';
import { Badge, Btn, Topbar, Icon } from '../components/UI';
import { Loading, ErrorState } from '../components/States';
import { Modal, ConfirmDialog, Field } from '../components/Modal';
import { useData } from '../lib/useData';
import { interventiApi, fattureApi } from '../lib/api';

const TABS = ['Vista mese · P&L', 'Fatture & corrispettivi'];
const EMPTY = { codice: '', tipo: 'Fatt. privato', cliente: '', riferimento: '', importo: 0, scadenza: '', stato: 'In termini', stato_tone: 'green' };
const STATO_TONE = { 'In termini': 'green', 'In scadenza': 'amber', 'Da sollecitare': 'red', 'Pagata': 'gray' };

export default function Contabilita() {
  const interventi = useData(() => interventiApi.list(), []);
  const fatture = useData(() => fattureApi.list(), []);
  const [tab, setTab] = useState('Vista mese · P&L');
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const list = interventi.data || [];
  const chiusi = list.filter(i => ['Consegnato', 'Pronto'].includes(i.stato));
  const ricavi = list.reduce((s, i) => s + Number(i.totale_stimato || 0), 0);
  const costiPezzi = list.reduce((s, i) => s + (i.pezzi || []).reduce((a, p) => a + Number(p.costo_acq) * p.qty, 0), 0);
  const margine = list.reduce((s, i) => s + Number(i.margine_atteso || 0), 0);
  const marginePerc = ricavi ? Math.round((margine / ricavi) * 100) : 0;

  async function save(form) {
    setBusy(true);
    try {
      const payload = { ...form, importo: Number(form.importo), stato_tone: STATO_TONE[form.stato] || 'gray' };
      if (editing && editing.id) await fattureApi.update(editing.id, payload);
      else await fattureApi.create(payload);
      setEditing(null);
      fatture.reload();
    } catch (e) { alert('Errore: ' + e.message); } finally { setBusy(false); }
  }
  async function doDelete() {
    setBusy(true);
    try { await fattureApi.remove(toDelete.id); setToDelete(null); fatture.reload(); }
    catch (e) { alert('Errore: ' + e.message); } finally { setBusy(false); }
  }

  const fattureList = fatture.data || [];
  const totFatture = fattureList.reduce((s, f) => s + Number(f.importo), 0);

  return (
    <main className="main">
      <Topbar
        crumbs={['Contabilità', 'Maggio 2026']}
        right={<Btn size="sm" tone="primary" icon="plus" onClick={() => setEditing({ ...EMPTY })}>Nuova fattura</Btn>}
      />
      <div className="content">
        <div className="page-head">
          <div>
            <div className="page-title">Contabilità · Maggio 2026</div>
            <div className="page-sub">Dati calcolati in tempo reale dagli interventi · {chiusi.length} chiusi/pronti</div>
          </div>
        </div>

        <div className="tabs">{TABS.map(t => <div key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</div>)}</div>

        {(interventi.loading || fatture.loading) && <Loading />}
        {interventi.error && <ErrorState error={interventi.error} onRetry={interventi.reload} />}

        {!interventi.loading && !interventi.error && tab === 'Vista mese · P&L' && (
          <>
            <div className="kpi-grid kpi-grid-6">
              {[
                ['Ricavi stimati', `€ ${ricavi.toLocaleString('it-IT')}`, 'aperti', 'up'],
                ['Costi pezzi', `€ ${costiPezzi.toLocaleString('it-IT')}`, 'reali', 'flat'],
                ['Manodopera', '€ 1.250', 'stima', 'flat'],
                ['Margine', `€ ${margine.toLocaleString('it-IT')}`, 'atteso', 'up'],
                ['Margine %', `${marginePerc}%`, 'medio', 'up'],
                ['Interventi', String(list.length), 'totali', 'up'],
              ].map(([l, v, d, t]) => (
                <div key={l} className="card kpi">
                  <div className="kpi-label">{l}</div>
                  <div className="kpi-value sm">{v}</div>
                  <span className={`kpi-trend ${t}`}>{t === 'up' ? '↑' : '•'} {d}</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
              <div className="card">
                <div className="row between" style={{ marginBottom: 14 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Conto economico semplificato</span>
                  <span style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>aggiornato dagli interventi</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                  <div style={{ paddingRight: 16, borderRight: '1px solid var(--hf-border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase', letterSpacing: 0.04, marginBottom: 8, fontWeight: 500 }}>+ Entrate</div>
                    <div className="col" style={{ gap: 8, fontSize: 13 }}>
                      <div className="row between"><span>Riparazioni stimate</span><span className="mono">€ {ricavi.toLocaleString('it-IT')}</span></div>
                      <div className="row between"><span>Vendita banco</span><span className="mono">€ 2.450</span></div>
                      <div className="row between"><span>Diagnosi a pagamento</span><span className="mono">€ 350</span></div>
                      <div style={{ borderTop: '1px solid var(--hf-border)', paddingTop: 8, marginTop: 4 }} className="row between">
                        <span style={{ fontWeight: 600 }}>Totale</span><span style={{ fontWeight: 600, fontSize: 18 }}>€ {(ricavi + 2800).toLocaleString('it-IT')}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ paddingLeft: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase', letterSpacing: 0.04, marginBottom: 8, fontWeight: 500 }}>− Uscite</div>
                    <div className="col" style={{ gap: 8, fontSize: 13 }}>
                      <div className="row between"><span>Pezzi (a costo)</span><span className="mono">€ {costiPezzi.toLocaleString('it-IT')}</span></div>
                      <div className="row between"><span>Manodopera tecnici</span><span className="mono">€ 1.250</span></div>
                      <div className="row between"><span>Spedizioni</span><span className="mono">€ 180</span></div>
                      <div style={{ borderTop: '1px solid var(--hf-border)', paddingTop: 8, marginTop: 4 }} className="row between">
                        <span style={{ fontWeight: 600 }}>Totale costi</span><span style={{ fontWeight: 600, fontSize: 18 }}>€ {(costiPezzi + 1430).toLocaleString('it-IT')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 18, padding: '14px 16px', background: 'var(--hf-accent-soft)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Margine lordo stimato</span>
                  <span style={{ fontWeight: 600, fontSize: 30, letterSpacing: '-0.02em', color: 'var(--hf-accent)' }}>€ {(ricavi + 2800 - costiPezzi - 1430).toLocaleString('it-IT')}</span>
                </div>
              </div>

              <div className="card">
                <div className="row between" style={{ marginBottom: 12 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Andamento 12 mesi</span>
                  <div className="row center" style={{ gap: 8, fontSize: 11 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: 'var(--hf-text)', display: 'inline-block' }} />Ricavi</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><span style={{ width: 8, height: 8, background: 'var(--hf-accent)', display: 'inline-block' }} />Margine</span>
                  </div>
                </div>
                <div style={{ position: 'relative', height: 140 }}>
                  <svg viewBox="0 0 300 120" style={{ width: '100%', height: '100%' }}>
                    <defs><linearGradient id="fade" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#d97757" stopOpacity="0.25" /><stop offset="100%" stopColor="#d97757" stopOpacity="0" /></linearGradient></defs>
                    <path d="M 5 85 L 30 80 L 55 78 L 80 70 L 105 60 L 130 56 L 155 50 L 180 48 L 205 42 L 230 38 L 255 30 L 280 22" fill="none" stroke="#1a1816" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 5 100 L 30 95 L 55 92 L 80 85 L 105 78 L 130 75 L 155 68 L 180 65 L 205 58 L 230 55 L 255 48 L 280 40" fill="none" stroke="#d97757" strokeWidth="2" strokeLinecap="round" />
                    <path d="M 5 100 L 30 95 L 55 92 L 80 85 L 105 78 L 130 75 L 155 68 L 180 65 L 205 58 L 230 55 L 255 48 L 280 40 L 280 120 L 5 120 Z" fill="url(#fade)" />
                  </svg>
                </div>
                <div className="row between mono" style={{ fontSize: 11, color: 'var(--hf-text-3)', marginTop: 4 }}><span>giu '25</span><span>mag '26</span></div>
              </div>
            </div>
          </>
        )}

        {!fatture.loading && tab === 'Fatture & corrispettivi' && (
          <div className="table-wrap">
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hf-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Fatture</span>
              <Badge tone="amber" dot={false}>{fattureList.length} · € {totFatture.toLocaleString('it-IT')}</Badge>
            </div>
            <table className="data-table">
              <thead><tr><th>Doc.</th><th>Tipo</th><th>Cliente</th><th>Rif.</th><th>Importo</th><th>Scadenza</th><th>Stato</th><th></th></tr></thead>
              <tbody>
                {fattureList.map(f => (
                  <tr key={f.id} onClick={() => setEditing(f)}>
                    <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{f.codice}</td>
                    <td>{f.tipo}</td>
                    <td className="strong">{f.cliente}</td>
                    <td className="mono" style={{ fontSize: 11 }}>{f.riferimento}</td>
                    <td className="mono strong">€ {f.importo},00</td>
                    <td style={{ color: 'var(--hf-text-3)' }}>{f.scadenza}</td>
                    <td><Badge tone={f.stato_tone}>{f.stato}</Badge></td>
                    <td onClick={e => e.stopPropagation()} style={{ whiteSpace: 'nowrap' }}>
                      <button className="btn ghost sm" style={{ padding: 4 }} onClick={() => setEditing(f)}><Icon name="edit" /></button>
                      <button className="btn ghost sm" style={{ padding: 4 }} onClick={() => setToDelete(f)}><Icon name="trash" /></button>
                    </td>
                  </tr>
                ))}
                {fattureList.length === 0 && <tr><td colSpan={8} style={{ textAlign: 'center', padding: 24, color: 'var(--hf-text-3)' }}>Nessuna fattura.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {editing && <FatturaForm initial={editing} onClose={() => setEditing(null)} onSave={save} busy={busy} />}
      {toDelete && <ConfirmDialog message={`Eliminare la fattura ${toDelete.codice}?`} onConfirm={doDelete} onClose={() => setToDelete(null)} busy={busy} />}
    </main>
  );
}

function FatturaForm({ initial, onClose, onSave, busy }) {
  const [f, setF] = useState({
    codice: initial.codice || '', tipo: initial.tipo || 'Fatt. privato', cliente: initial.cliente || '',
    riferimento: initial.riferimento || '', importo: initial.importo ?? 0, scadenza: initial.scadenza || '', stato: initial.stato || 'In termini',
  });
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  return (
    <Modal
      title={initial.id ? 'Modifica fattura' : 'Nuova fattura'}
      onClose={onClose}
      footer={<><Btn onClick={onClose}>Annulla</Btn><Btn tone="accent" onClick={() => f.codice.trim() && onSave(f)}>{busy ? 'Salvo…' : 'Salva'}</Btn></>}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Codice"><input className="input mono" value={f.codice} onChange={e => set('codice', e.target.value)} placeholder="F-0143" autoFocus /></Field>
        <Field label="Tipo">
          <select className="input" value={f.tipo} onChange={e => set('tipo', e.target.value)}>
            <option>Fatt. privato</option><option>Fatt. elettronica</option><option>Scontrino</option>
          </select>
        </Field>
      </div>
      <Field label="Cliente"><input className="input" value={f.cliente} onChange={e => set('cliente', e.target.value)} /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Riferimento"><input className="input mono" value={f.riferimento} onChange={e => set('riferimento', e.target.value)} placeholder="#2409" /></Field>
        <Field label="Importo €"><input className="input mono" type="number" value={f.importo} onChange={e => set('importo', e.target.value)} /></Field>
        <Field label="Scadenza"><input className="input" value={f.scadenza} onChange={e => set('scadenza', e.target.value)} placeholder="30gg DF" /></Field>
        <Field label="Stato">
          <select className="input" value={f.stato} onChange={e => set('stato', e.target.value)}>
            <option>In termini</option><option>In scadenza</option><option>Da sollecitare</option><option>Pagata</option>
          </select>
        </Field>
      </div>
    </Modal>
  );
}
