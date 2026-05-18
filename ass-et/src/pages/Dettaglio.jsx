import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge, Btn, Avatar, Topbar, Icon } from '../components/UI';
import { Loading, ErrorState } from '../components/States';
import { Modal, ConfirmDialog, Field } from '../components/Modal';
import { useData } from '../lib/useData';
import { useImpostazioni } from '../lib/useImpostazioni';
import { interventiApi, magazzinoApi } from '../lib/api';

const STATUS_TRACK = ['Accettazione', 'Diagnosi', 'Attesa pezzi', 'In lavorazione', 'Pronto', 'Consegnato'];
const STATUS_OPTIONS = [
  ['Accettazione', 'gray'], ['Diagnosi', 'gray'], ['Attesa pezzi', 'amber'],
  ['Attesa cliente', 'blue'], ['In lavorazione', 'violet'], ['Pronto', 'green'],
  ['Consegnato', 'gray'], ['Non riparabile', 'red'],
];

export default function Dettaglio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: t, loading, error, reload } = useData(() => interventiApi.get(id), [id]);
  const { tecnicoNome, tecnicoTone } = useImpostazioni();
  const [statoModal, setStatoModal] = useState(false);
  const [notaModal, setNotaModal] = useState(false);
  const [pezzoModal, setPezzoModal] = useState(false);
  const [delModal, setDelModal] = useState(false);
  const [busy, setBusy] = useState(false);

  if (loading) return <main className="main"><Topbar crumbs={['Interventi', '…']} /><div className="content"><Loading /></div></main>;
  if (error) return <main className="main"><Topbar crumbs={['Interventi']} /><div className="content"><ErrorState error={error} onRetry={reload} /></div></main>;
  if (!t) {
    return (
      <main className="main">
        <Topbar crumbs={['Interventi', '?']} />
        <div className="content" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: 'var(--hf-text-3)' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>⚠</div>
            <div style={{ fontWeight: 600 }}>Intervento non trovato</div>
            <Btn style={{ marginTop: 16 }} onClick={() => navigate('/interventi')}>← Torna agli interventi</Btn>
          </div>
        </div>
      </main>
    );
  }

  const trackIdx = STATUS_TRACK.indexOf(t.stato);
  const pezzi = t.pezzi || [];
  const attivita = (t.attivita || []).slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const pezziVendita = pezzi.reduce((s, p) => s + Number(p.prezzo_vend) * p.qty, 0);
  const pezziCosto = pezzi.reduce((s, p) => s + Number(p.costo_acq) * p.qty, 0);
  const manodopera = Number(t.manodopera) || 0;
  const totale = manodopera + pezziVendita;
  const margine = totale - pezziCosto;

  async function changeStato(stato, tone) {
    setBusy(true);
    try {
      await interventiApi.update(t.id, { stato, stato_tone: tone });
      await interventiApi.addAttivita(t.id, { autore: tecnicoNome, tipo: 'stato', testo: `Stato → ${stato}` });
      setStatoModal(false);
      reload();
    } catch (e) { alert('Errore: ' + e.message); } finally { setBusy(false); }
  }

  async function doDelete() {
    setBusy(true);
    try {
      await interventiApi.remove(t.id);
      navigate('/interventi');
    } catch (e) { alert('Errore: ' + e.message); setBusy(false); }
  }

  async function saveCosti(fields) {
    try {
      const mano = fields.manodopera != null ? Number(fields.manodopera) || 0 : manodopera;
      const tot = mano + pezziVendita;
      await interventiApi.update(t.id, { ...fields, totale_stimato: tot, margine_atteso: tot - pezziCosto });
      reload();
    } catch (e) { alert('Errore: ' + e.message); }
  }

  async function saveDifettoRiscontrato(testo) {
    try { await interventiApi.update(t.id, { difetto_riscontrato: testo }); reload(); }
    catch (e) { alert('Errore: ' + e.message); }
  }

  return (
    <main className="main">
      <Topbar
        crumbs={['Interventi', `#${t.numero}`]}
        right={
          <>
            <Btn size="sm" icon="trash" onClick={() => setDelModal(true)}>Elimina</Btn>
            <Btn size="sm" tone="primary" onClick={() => setStatoModal(true)}>Cambia stato</Btn>
          </>
        }
      />

      <div className="content">
        <div className="page-head">
          <div>
            <div className="row center" style={{ gap: 10, marginBottom: 4 }}>
              <span className="mono" style={{ color: 'var(--hf-text-3)', fontSize: 13 }}>#{t.numero}</span>
              <Badge tone={t.stato_tone}>{t.stato}</Badge>
              {pezzi.length > 0 && <Badge tone="gray" dot={false}>{pezzi.length} pezz{pezzi.length > 1 ? 'i' : 'o'} · €{pezziVendita}</Badge>}
            </div>
            <div className="page-title">{t.dispositivo} · {t.cliente?.nome || '—'}</div>
            <div className="page-sub">
              Aperto {new Date(t.created_at).toLocaleDateString('it-IT')} · Tecnico {t.tecnico?.nome || '—'} · Tel {t.cliente?.tel || '—'}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--hf-text-3)' }}>Importo previsto</span>
            <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>€ {t.max_preventivo},00</span>
            <span style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>max autorizzato</span>
          </div>
        </div>

        {/* status track */}
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {STATUS_TRACK.map((step, i, arr) => {
              const done = i < trackIdx, active = i === trackIdx, idle = i > trackIdx;
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < arr.length - 1 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 90 }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: done ? 'var(--hf-green)' : active ? 'var(--hf-amber)' : 'var(--hf-surface-2)',
                      border: `2px solid ${done ? 'var(--hf-green)' : active ? 'var(--hf-amber)' : 'var(--hf-border-2)'}`,
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                    }}>{done ? '✓' : active ? '●' : ''}</div>
                    <div style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: idle ? 'var(--hf-text-4)' : 'var(--hf-text)', textAlign: 'center' }}>{step}</div>
                  </div>
                  {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: done ? 'var(--hf-green)' : 'var(--hf-border)', marginBottom: 20, marginLeft: -4, marginRight: -4 }} />}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, minHeight: 0 }}>
          <div className="col" style={{ gap: 16 }}>
            <div className="card">
              <div className="row between" style={{ marginBottom: 10 }}>
                <div className="card-title">Difetto e diagnosi</div>
                <Btn size="sm" tone="ghost" icon="plus" onClick={() => setNotaModal(true)}>Nota</Btn>
              </div>
              <div style={{ marginBottom: 8 }}>
                <span className="field-label">Dichiarato dal cliente</span>
                <div style={{ fontSize: 13, color: 'var(--hf-text-2)', padding: '10px 12px', background: 'var(--hf-surface-2)', borderRadius: 8 }}>
                  {t.difetto || 'Nessun difetto dichiarato.'}
                </div>
              </div>
              <DifettoRiscontrato
                key={t.difetto_riscontrato || ''}
                value={t.difetto_riscontrato || ''}
                onSave={saveDifettoRiscontrato}
              />
              <div style={{ height: 6 }} />
              <div className="col" style={{ gap: 14 }}>
                {attivita.filter(a => ['diagnosi', 'nota', 'accettazione'].includes(a.tipo)).map(a => (
                  <div key={a.id}>
                    <div className="row center" style={{ gap: 8, marginBottom: 4 }}>
                      <Avatar name={a.autore} tone={a.autore === tecnicoNome ? tecnicoTone : 'gray'} size="sm" />
                      <span style={{ fontWeight: 500, fontSize: 13 }}>{a.autore}</span>
                      <span style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>
                        {new Date(a.created_at).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })} · {a.tipo}
                      </span>
                    </div>
                    <div style={{ marginLeft: 30, fontSize: 13, color: 'var(--hf-text-2)' }}>{a.testo}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--hf-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Pezzi assegnati</div>
                <Btn size="sm" icon="plus" onClick={() => setPezzoModal(true)}>Aggiungi da magazzino</Btn>
              </div>
              {pezzi.length > 0 ? (
                <table className="data-table">
                  <thead><tr><th>SKU</th><th>Articolo</th><th>Q.</th><th>Costo</th><th>Vendita</th><th>Stato</th><th></th></tr></thead>
                  <tbody>
                    {pezzi.map(p => (
                      <tr key={p.id}>
                        <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{p.sku || '—'}</td>
                        <td className="strong">{p.nome}</td>
                        <td>×{p.qty}</td>
                        <td className="mono" style={{ color: 'var(--hf-text-3)' }}>€ {p.costo_acq}</td>
                        <td className="mono strong">€ {p.prezzo_vend}</td>
                        <td><Badge tone={p.stato_tone}>{p.stato}</Badge></td>
                        <td>
                          <button className="btn ghost sm" style={{ padding: 4 }} onClick={async () => { await interventiApi.removePezzo(p.id); reload(); }}>
                            <Icon name="trash" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: 16, textAlign: 'center', color: 'var(--hf-text-3)', fontSize: 13 }}>Nessun pezzo assegnato</div>
              )}
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: 12 }}>Attività</div>
              <div className="col" style={{ gap: 10, fontSize: 13 }}>
                {attivita.length === 0 && <div style={{ color: 'var(--hf-text-3)' }}>Nessuna attività.</div>}
                {attivita.map(a => (
                  <div key={a.id} className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
                    <span className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)', width: 92, flex: 'none', paddingTop: 2 }}>
                      {new Date(a.created_at).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', marginTop: 7, flex: 'none', background: a.tipo === 'sms' ? 'var(--hf-blue)' : a.tipo === 'diagnosi' ? 'var(--hf-green)' : a.tipo === 'stato' ? 'var(--hf-amber)' : 'var(--hf-text-3)' }} />
                    <span style={{ color: 'var(--hf-text-2)' }}><b>{a.autore}</b> · {a.testo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col" style={{ gap: 16 }}>
            <div className="card">
              <div className="card-title" style={{ marginBottom: 10 }}>Riepilogo €</div>
              <div className="col" style={{ gap: 10, fontSize: 13 }}>
                <div className="row between" style={{ alignItems: 'center' }}>
                  <span style={{ color: 'var(--hf-text-3)' }}>Max autorizzato</span>
                  <EditEuro key={`max-${t.max_preventivo}`} value={Number(t.max_preventivo) || 0} onSave={v => saveCosti({ max_preventivo: v })} />
                </div>
                <div className="row between" style={{ alignItems: 'center' }}>
                  <span style={{ color: 'var(--hf-text-3)' }}>Manodopera</span>
                  <EditEuro key={`man-${manodopera}`} value={manodopera} onSave={v => saveCosti({ manodopera: v })} />
                </div>
                <div className="row between"><span style={{ color: 'var(--hf-text-3)' }}>Costo pezzi</span><span className="mono">€ {pezziVendita},00</span></div>
                <div style={{ borderTop: '1px solid var(--hf-border)', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontWeight: 600 }}>Totale</span>
                  <span style={{ fontWeight: 600, fontSize: 18 }}>€ {Math.round(totale)},00</span>
                </div>
                <div className="row between" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>
                  <span>Margine</span>
                  <span>€ {Math.round(margine)},00 · {totale ? Math.round((margine / totale) * 100) : 0}%</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>
                  Max, manodopera e pezzi sono modificabili per rettifiche. Il totale si aggiorna da solo.
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: 10 }}>Cliente</div>
              <div className="row center" style={{ gap: 10, marginBottom: 10 }}>
                <Avatar name={t.cliente?.nome || '?'} tone="blue" size="md" />
                <div>
                  <div style={{ fontWeight: 500 }}>{t.cliente?.nome || '—'}</div>
                  <div style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{t.cliente?.tel || '—'}</div>
                </div>
              </div>
              {(() => {
                const tel = (t.cliente?.tel || '').replace(/\s+/g, '');
                if (!tel)
                  return <div style={{ fontSize: 12, color: 'var(--hf-text-3)' }}>Nessun numero per questo cliente.</div>;
                return (
                  <div className="row center" style={{ gap: 6 }}>
                    <a className="btn sm" href={`tel:${tel}`} style={{ textDecoration: 'none' }}><Icon name="phone" />Chiama</a>
                    <a className="btn sm" href={`sms:${tel}`} style={{ textDecoration: 'none' }}><Icon name="mail" />SMS</a>
                  </div>
                );
              })()}
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: 10 }}>Lavorazione</div>
              <div className="col" style={{ gap: 10 }}>
                <div>
                  <span className="field-label">Priorità</span>
                  <div className="row center" style={{ gap: 6 }}>
                    {['Bassa', 'Normale', 'Urgente'].map(p => (
                      <span key={p} className={`pill ${p === t.priorita ? 'active' : ''}`}
                        onClick={async () => { await interventiApi.update(t.id, { priorita: p }); reload(); }}>{p}</span>
                    ))}
                  </div>
                </div>
                {t.tecnico && (
                  <div>
                    <span className="field-label">Tecnico</span>
                    <div className="row center" style={{ gap: 8, padding: '7px 10px', background: 'var(--hf-surface)', border: '1px solid var(--hf-border)', borderRadius: 6 }}>
                      <Avatar name={t.tecnico.nome} tone={t.tecnico.tone} size="sm" />
                      <span style={{ fontSize: 13 }}>{t.tecnico.nome}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Btn style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/interventi')}>← Torna agli interventi</Btn>
          </div>
        </div>
      </div>

      {statoModal && <StatoModal current={t.stato} onPick={changeStato} onClose={() => setStatoModal(false)} busy={busy} />}
      {notaModal && <NotaModal interventoId={t.id} autoreDefault={tecnicoNome} onClose={() => setNotaModal(false)} onSaved={() => { setNotaModal(false); reload(); }} />}
      {pezzoModal && <PezzoModal interventoId={t.id} onClose={() => setPezzoModal(false)} onSaved={() => { setPezzoModal(false); reload(); }} />}
      {delModal && <ConfirmDialog message={`Eliminare l'intervento #${t.numero}? Operazione irreversibile.`} onConfirm={doDelete} onClose={() => setDelModal(false)} busy={busy} />}
    </main>
  );
}

function StatoModal({ current, onPick, onClose, busy }) {
  return (
    <Modal title="Cambia stato intervento" onClose={onClose} width={420}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {STATUS_OPTIONS.map(([s, tone]) => (
          <button key={s} className="btn" disabled={busy}
            style={{ borderColor: s === current ? 'var(--hf-accent)' : undefined, background: s === current ? 'var(--hf-accent-soft)' : undefined }}
            onClick={() => onPick(s, tone)}>
            <Badge tone={tone}>{s}</Badge>
          </button>
        ))}
      </div>
    </Modal>
  );
}

function NotaModal({ interventoId, autoreDefault, onClose, onSaved }) {
  const [autore, setAutore] = useState(autoreDefault || 'Tecnico');
  const [tipo, setTipo] = useState('nota');
  const [testo, setTesto] = useState('');
  const [busy, setBusy] = useState(false);
  async function save() {
    if (!testo.trim()) return;
    setBusy(true);
    try { await interventiApi.addAttivita(interventoId, { autore, tipo, testo }); onSaved(); }
    catch (e) { alert('Errore: ' + e.message); setBusy(false); }
  }
  return (
    <Modal title="Aggiungi nota" onClose={onClose}
      footer={<><Btn onClick={onClose}>Annulla</Btn><Btn tone="accent" onClick={save}>{busy ? 'Salvo…' : 'Salva nota'}</Btn></>}>
      <Field label="Autore">
        <select className="input" value={autore} onChange={e => setAutore(e.target.value)}>
          <option>{autoreDefault || 'Tecnico'}</option>
          <option>Sistema</option>
        </select>
      </Field>
      <Field label="Tipo">
        <select className="input" value={tipo} onChange={e => setTipo(e.target.value)}>
          <option value="nota">nota</option><option value="diagnosi">diagnosi</option><option value="sms">sms</option>
        </select>
      </Field>
      <Field label="Testo">
        <textarea className="input" rows={4} value={testo} onChange={e => setTesto(e.target.value)} placeholder="Scrivi la nota…" style={{ resize: 'vertical' }} />
      </Field>
    </Modal>
  );
}

function PezzoModal({ interventoId, onClose, onSaved }) {
  const { data: mag, loading } = useData(() => magazzinoApi.list(), []);
  const [sel, setSel] = useState('');
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  async function save() {
    const a = (mag || []).find(m => m.id === sel);
    if (!a) return;
    setBusy(true);
    try {
      await interventiApi.addPezzo(interventoId, {
        magazzino_id: a.id, sku: a.sku, nome: a.nome, qty: Number(qty),
        costo_acq: a.costo_acq, prezzo_vend: a.prezzo_vend,
        stato: a.stock >= qty ? 'A stock' : 'Da ordinare',
        stato_tone: a.stock >= qty ? 'green' : 'amber',
      });
      onSaved();
    } catch (e) { alert('Errore: ' + e.message); setBusy(false); }
  }
  return (
    <Modal title="Aggiungi pezzo da magazzino" onClose={onClose}
      footer={<><Btn onClick={onClose}>Annulla</Btn><Btn tone="accent" onClick={save} >{busy ? 'Aggiungo…' : 'Aggiungi'}</Btn></>}>
      {loading ? <Loading /> : (
        <>
          <Field label="Articolo">
            <select className="input" value={sel} onChange={e => setSel(e.target.value)}>
              <option value="">— seleziona —</option>
              {(mag || []).map(m => (
                <option key={m.id} value={m.id}>{m.nome} ({m.sku}) · stock {m.stock} · € {m.prezzo_vend}</option>
              ))}
            </select>
          </Field>
          <Field label="Quantità">
            <input className="input" type="number" min={1} value={qty} onChange={e => setQty(e.target.value)} />
          </Field>
        </>
      )}
    </Modal>
  );
}

function EditEuro({ value, onSave }) {
  const [v, setV] = useState(value ?? 0);
  function commit() {
    const n = Number(v) || 0;
    if (n !== (Number(value) || 0)) onSave(n);
  }
  return (
    <span className="row center" style={{ gap: 4 }}>
      <span className="mono" style={{ color: 'var(--hf-text-3)' }}>€</span>
      <input
        className="input mono"
        type="number"
        value={v}
        onChange={e => setV(e.target.value)}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }}
        style={{ width: 90, textAlign: 'right', padding: '4px 8px' }}
      />
    </span>
  );
}

function DifettoRiscontrato({ value, onSave }) {
  const [v, setV] = useState(value || '');
  const dirty = v !== (value || '');
  return (
    <div>
      <span className="field-label">Riscontrato dal tecnico (diagnosi)</span>
      <textarea
        className="input"
        rows={3}
        value={v}
        onChange={e => setV(e.target.value)}
        placeholder="Difetto effettivamente riscontrato dopo la diagnosi…"
        style={{ resize: 'vertical', lineHeight: 1.5 }}
      />
      <div className="row" style={{ justifyContent: 'flex-end', marginTop: 6 }}>
        <Btn size="sm" tone={dirty ? 'accent' : ''} onClick={() => dirty && onSave(v.trim())}>
          {dirty ? 'Salva diagnosi' : 'Salvato'}
        </Btn>
      </div>
    </div>
  );
}
