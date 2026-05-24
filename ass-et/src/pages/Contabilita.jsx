import { useState } from 'react';
import { Badge, Btn, Topbar, Icon } from '../components/UI';
import { Loading, ErrorState } from '../components/States';
import { Modal, ConfirmDialog, Field } from '../components/Modal';
import { useData } from '../lib/useData';
import { interventiApi, fattureApi } from '../lib/api';
import { STATO_DA_INCASSARE, STATO_INCASSATO } from '../lib/stati';

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
  const chiusi = list.filter(i => ['Consegnato', 'Pronto', 'Incassato'].includes(i.stato));
  const ricavi = list.reduce((s, i) => s + Number(i.totale_stimato || 0), 0);
  const costiPezzi = list.reduce((s, i) => s + (i.pezzi || []).reduce((a, p) => a + Number(p.costo_acq) * p.qty, 0), 0);
  const margine = list.reduce((s, i) => s + Number(i.margine_atteso || 0), 0);
  const marginePerc = ricavi ? Math.round((margine / ricavi) * 100) : 0;

  const daIncassareList = list.filter(i => i.stato === STATO_DA_INCASSARE);
  const incassatoList   = list.filter(i => i.stato === STATO_INCASSATO);
  // "Netto" = totale incassato meno costi pezzi (= margine_atteso).
  const daIncassareNetto = daIncassareList.reduce((s, i) => s + Number(i.margine_atteso || 0), 0);
  const incassatoNetto   = incassatoList.reduce((s, i) => s + Number(i.margine_atteso || 0), 0);
  const daIncassareLordo = daIncassareList.reduce((s, i) => s + Number(i.totale_stimato || 0), 0);
  const incassatoLordo   = incassatoList.reduce((s, i) => s + Number(i.totale_stimato || 0), 0);

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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="card" style={{ borderColor: 'var(--hf-amber)', background: 'var(--hf-amber-soft)' }}>
                <div className="row between" style={{ marginBottom: 6 }}>
                  <span className="kpi-label" style={{ color: 'var(--hf-amber)' }}>Da incassare · netto</span>
                  <Badge tone="amber">{daIncassareList.length} interventi</Badge>
                </div>
                <div className="kpi-value">€ {daIncassareNetto.toLocaleString('it-IT')}</div>
                <div style={{ fontSize: 11, color: 'var(--hf-text-3)', marginTop: 4 }}>
                  Margine atteso · lordo € {daIncassareLordo.toLocaleString('it-IT')}
                </div>
              </div>
              <div className="card" style={{ borderColor: 'var(--hf-green)', background: 'var(--hf-green-soft)' }}>
                <div className="row between" style={{ marginBottom: 6 }}>
                  <span className="kpi-label" style={{ color: 'var(--hf-green)' }}>Incassato · netto</span>
                  <Badge tone="green">{incassatoList.length} interventi</Badge>
                </div>
                <div className="kpi-value">€ {incassatoNetto.toLocaleString('it-IT')}</div>
                <div style={{ fontSize: 11, color: 'var(--hf-text-3)', marginTop: 4 }}>
                  Margine già incassato · lordo € {incassatoLordo.toLocaleString('it-IT')}
                </div>
              </div>
            </div>

            <div className="kpi-grid kpi-grid-6">
              {[
                ['Ricavi stimati', `€ ${ricavi.toLocaleString('it-IT')}`, 'da interventi'],
                ['Costi pezzi', `€ ${costiPezzi.toLocaleString('it-IT')}`, 'reali'],
                ['Margine', `€ ${margine.toLocaleString('it-IT')}`, 'atteso'],
                ['Margine %', `${marginePerc}%`, 'medio'],
                ['Interventi', String(list.length), 'totali'],
                ['Fatturato', `€ ${totFatture.toLocaleString('it-IT')}`, `${fattureList.length} fatture`],
              ].map(([l, v, d]) => (
                <div key={l} className="card kpi">
                  <div className="kpi-label">{l}</div>
                  <div className="kpi-value sm">{v}</div>
                  <span className="kpi-trend flat">• {d}</span>
                </div>
              ))}
            </div>

            <div className="responsive-stack" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
              <div className="card">
                <div className="row between" style={{ marginBottom: 14 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Conto economico semplificato</span>
                  <span style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>calcolato dai dati reali</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                  <div style={{ paddingRight: 16, borderRight: '1px solid var(--hf-border)' }}>
                    <div style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase', letterSpacing: 0.04, marginBottom: 8, fontWeight: 500 }}>+ Entrate</div>
                    <div className="col" style={{ gap: 8, fontSize: 13 }}>
                      <div className="row between"><span>Riparazioni stimate</span><span className="mono">€ {ricavi.toLocaleString('it-IT')}</span></div>
                      <div style={{ borderTop: '1px solid var(--hf-border)', paddingTop: 8, marginTop: 4 }} className="row between">
                        <span style={{ fontWeight: 600 }}>Totale</span><span style={{ fontWeight: 600, fontSize: 18 }}>€ {ricavi.toLocaleString('it-IT')}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ paddingLeft: 16 }}>
                    <div style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase', letterSpacing: 0.04, marginBottom: 8, fontWeight: 500 }}>− Uscite</div>
                    <div className="col" style={{ gap: 8, fontSize: 13 }}>
                      <div className="row between"><span>Pezzi (a costo)</span><span className="mono">€ {costiPezzi.toLocaleString('it-IT')}</span></div>
                      <div style={{ borderTop: '1px solid var(--hf-border)', paddingTop: 8, marginTop: 4 }} className="row between">
                        <span style={{ fontWeight: 600 }}>Totale costi</span><span style={{ fontWeight: 600, fontSize: 18 }}>€ {costiPezzi.toLocaleString('it-IT')}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 18, padding: '14px 16px', background: 'var(--hf-accent-soft)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Margine lordo stimato</span>
                  <span style={{ fontWeight: 600, fontSize: 30, letterSpacing: '-0.02em', color: 'var(--hf-accent)' }}>€ {(ricavi - costiPezzi).toLocaleString('it-IT')}</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--hf-text-3)', marginTop: 10 }}>
                  Stima basata su totale e costo pezzi degli interventi. Manodopera e altre spese non sono tracciate.
                </div>
              </div>

              <div className="card">
                <div className="row between" style={{ marginBottom: 12 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Riepilogo fatture</span>
                  <Badge tone="gray" dot={false}>{fattureList.length} · € {totFatture.toLocaleString('it-IT')}</Badge>
                </div>
                {(() => {
                  const byStato = {};
                  fattureList.forEach(f => {
                    const k = f.stato || '—';
                    if (!byStato[k]) byStato[k] = { n: 0, tot: 0, tone: f.stato_tone || 'gray' };
                    byStato[k].n += 1;
                    byStato[k].tot += Number(f.importo) || 0;
                  });
                  const entries = Object.entries(byStato);
                  if (entries.length === 0)
                    return <div style={{ fontSize: 13, color: 'var(--hf-text-3)' }}>Nessuna fattura registrata.</div>;
                  return (
                    <div className="col" style={{ gap: 10 }}>
                      {entries.map(([stato, v], i) => (
                        <div key={stato} className="row between" style={{ paddingTop: i > 0 ? 10 : 0, borderTop: i > 0 ? '1px solid var(--hf-border)' : 'none' }}>
                          <div className="row center" style={{ gap: 8 }}>
                            <Badge tone={v.tone}>{stato}</Badge>
                            <span style={{ fontSize: 12, color: 'var(--hf-text-3)' }}>{v.n} doc.</span>
                          </div>
                          <span className="mono strong">€ {v.tot.toLocaleString('it-IT')}</span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
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
  const [err, setErr] = useState(null);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  function submit() {
    if (!f.codice.trim()) { setErr('Il codice documento è obbligatorio.'); return; }
    setErr(null);
    onSave(f);
  }
  return (
    <Modal
      title={initial.id ? 'Modifica fattura' : 'Nuova fattura'}
      onClose={onClose}
      footer={<><Btn onClick={onClose}>Annulla</Btn><Btn tone="accent" onClick={submit}>{busy ? 'Salvo…' : 'Salva'}</Btn></>}
    >
      {err && (
        <div className="card" style={{ borderColor: 'var(--hf-red)', background: 'var(--hf-red-soft)', color: 'var(--hf-red)', fontSize: 13, padding: '8px 12px' }}>
          ⚠ {err}
        </div>
      )}
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
        <Field label="Importo €"><input className="input mono" type="number" value={f.importo} onChange={e => set('importo', e.target.value)} onFocus={e => { if (Number(f.importo) === 0) set('importo', ''); e.target.select(); }} /></Field>
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
