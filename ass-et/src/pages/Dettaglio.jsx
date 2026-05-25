import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge, Btn, Avatar, Topbar, Icon } from '../components/UI';
import { Loading, ErrorState } from '../components/States';
import { Modal, ConfirmDialog, Field } from '../components/Modal';
import { useData } from '../lib/useData';
import { useImpostazioni } from '../lib/useImpostazioni';
import { interventiApi, magazzinoApi, fotoApi, fornitoriApi, carichiApi } from '../lib/api';
import { STATI, STATUS_TRACK, STATO_TONE } from '../lib/stati';

export default function Dettaglio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: t, loading, error, reload } = useData(() => interventiApi.get(id), [id]);
  const { tecnicoNome, tecnicoTone } = useImpostazioni();
  const [statoModal, setStatoModal] = useState(false);
  const [notaModal, setNotaModal] = useState(false);
  const [pezzoModal, setPezzoModal] = useState(false);
  const [ordinaPezzo, setOrdinaPezzo] = useState(null);
  const [delModal, setDelModal] = useState(false);
  const [caricoPezzo, setCaricoPezzo] = useState(null);
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

  async function saveTotale(nuovoTotale) {
    try {
      const mano = Math.max(0, Number(nuovoTotale) - pezziVendita);
      await interventiApi.update(t.id, {
        manodopera: mano,
        totale_stimato: Number(nuovoTotale),
        margine_atteso: Number(nuovoTotale) - pezziCosto,
      });
      reload();
    } catch (e) { alert('Errore: ' + e.message); }
  }

  async function persistTotalsFromPezzi(pezziArray) {
    const v = pezziArray.reduce((s, x) => s + Number(x.prezzo_vend) * x.qty, 0);
    const c = pezziArray.reduce((s, x) => s + Number(x.costo_acq) * x.qty, 0);
    const tot = manodopera + v;
    await interventiApi.update(t.id, { totale_stimato: tot, margine_atteso: tot - c });
  }

  async function updatePezzo(p, patch) {
    try {
      await interventiApi.updatePezzo(p.id, patch);
      const next = pezzi.map(x => x.id === p.id ? { ...x, ...patch } : x);
      await persistTotalsFromPezzi(next);
      reload();
    } catch (e) { alert('Errore: ' + e.message); }
  }

  async function deletePezzo(p) {
    try {
      await interventiApi.removePezzo(p.id);
      await persistTotalsFromPezzi(pezzi.filter(x => x.id !== p.id));
      reload();
    } catch (e) { alert('Errore: ' + e.message); }
  }

  async function deleteAttivita(a) {
    if (!window.confirm(`Eliminare questa attività?\n\n"${a.testo}"`)) return;
    try {
      await interventiApi.removeAttivita(a.id);
      reload();
    } catch (e) { alert('Errore: ' + e.message); }
  }

  async function saveCaricoPezzo(form) {
    try {
      const p = caricoPezzo;
      let magazzino_id = p.magazzino_id;
      if (!magazzino_id) {
        const articolo = await magazzinoApi.create({
          sku: p.sku || null,
          nome: p.nome,
          categoria: 'Accessori',
          stock: 0,
          min_stock: 0,
          costo_acq: Number(form.costo_acq) || 0,
          prezzo_vend: Number(p.prezzo_vend) || 0,
          fornitore: form.fornitore_nome || '',
        });
        magazzino_id = articolo.id;
      }
      await interventiApi.updatePezzo(p.id, { magazzino_id, stato: 'A stock', stato_tone: 'green' });
      await carichiApi.create({
        magazzino_id,
        fornitore_id: form.fornitore_id || null,
        sku: p.sku || null,
        nome: p.nome,
        qty: Number(form.qty) || p.qty,
        costo_acq: Number(form.costo_acq) || 0,
        numero_fattura: form.numero_fattura?.trim() || null,
        fornitore: form.fornitore_nome || null,
        data_carico: form.data_carico,
      });
      await interventiApi.addAttivita(t.id, {
        autore: tecnicoNome,
        tipo: 'nota',
        testo: `Carico registrato: ${p.nome} · Fatt. ${form.numero_fattura || '—'} · ${form.fornitore_nome || 'fornitore non assegnato'}`,
      });
      setCaricoPezzo(null);
      reload();
    } catch (e) { alert('Errore: ' + e.message); }
  }

  async function saveOrdinaPezzo(form) {
    try {
      const p = ordinaPezzo;
      await interventiApi.updatePezzo(p.id, {
        stato: 'Ordinato',
        stato_tone: 'violet',
        fornitore_id: form.fornitore_id || null,
        data_ordine: form.data_ordine,
        riferimento_ordine: form.riferimento_ordine?.trim() || null,
      });
      await interventiApi.addAttivita(t.id, {
        autore: tecnicoNome,
        tipo: 'nota',
        testo: `Pezzo ordinato: ${p.nome} · ${form.fornitore_nome || 'fornitore non assegnato'}${form.riferimento_ordine ? ` · rif. ${form.riferimento_ordine}` : ''}`,
      });
      setOrdinaPezzo(null);
      reload();
    } catch (e) { alert('Errore: ' + e.message); }
  }

  async function saveDifettoRiscontrato(testo) {
    try { await interventiApi.update(t.id, { difetto_riscontrato: testo }); reload(); }
    catch (e) { alert('Errore: ' + e.message); }
  }

  async function saveDataIntervento(isoDate) {
    try {
      const old = new Date(t.created_at);
      const [y, m, d] = isoDate.split('-').map(Number);
      const nuovo = new Date(y, m - 1, d, old.getHours(), old.getMinutes(), old.getSeconds());
      await interventiApi.update(t.id, { created_at: nuovo.toISOString() });
      reload();
    } catch (e) { alert('Errore: ' + e.message); }
  }

  return (
    <main className="main">
      <Topbar
        crumbs={['Interventi', `#${t.numero}`]}
        right={
          <>
            <Btn size="sm" onClick={() => navigate(`/interventi/${t.id}/scontrino`)}>Stampa</Btn>
            <Btn size="sm" onClick={() => navigate(`/interventi/${t.id}/etichetta`)}>Etichetta</Btn>
            <Btn size="sm" icon="trash" onClick={() => setDelModal(true)}>Elimina</Btn>
            <Btn size="sm" tone="primary" onClick={() => setStatoModal(true)}>Cambia stato</Btn>
          </>
        }
      />

      <div className="content">
        <div className="page-head">
          <div>
            <div className="row center" style={{ gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
              <span className="mono" style={{ color: 'var(--hf-text-3)', fontSize: 13 }}>#{t.numero}</span>
              <EditData key={`d-${t.created_at}`} value={t.created_at} onSave={saveDataIntervento} />
              <Badge tone={t.stato_tone}>{t.stato}</Badge>
              <UbicazioneBadge ubicazione={t.ubicazione} onChange={(v) => saveCosti({ ubicazione: v })} />
              {pezzi.length > 0 && <Badge tone="gray" dot={false}>{pezzi.length} pezz{pezzi.length > 1 ? 'i' : 'o'} · €{pezziVendita}</Badge>}
            </div>
            <div className="page-title">{t.dispositivo} · {t.cliente?.nome || '—'}</div>
            <div className="page-sub row center" style={{ gap: 6, flexWrap: 'wrap' }}>
              <span>Tecnico {t.tecnico?.nome || '—'} · Tel {t.cliente?.tel || '—'}</span>
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
                  <button
                    type="button"
                    disabled={busy || active}
                    onClick={() => changeStato(step, STATO_TONE[step] || 'gray')}
                    title={active ? `Stato corrente: ${step}` : `Imposta stato: ${step}`}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 90,
                      background: 'transparent', border: 'none', padding: 0, cursor: active || busy ? 'default' : 'pointer' }}
                  >
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%',
                      background: done ? 'var(--hf-green)' : active ? 'var(--hf-amber)' : 'var(--hf-surface-2)',
                      border: `2px solid ${done ? 'var(--hf-green)' : active ? 'var(--hf-amber)' : 'var(--hf-border-2)'}`,
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                      transition: 'transform .12s ease',
                    }}>{done ? '✓' : active ? '●' : ''}</div>
                    <div style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: idle ? 'var(--hf-text-4)' : 'var(--hf-text)', textAlign: 'center' }}>{step}</div>
                  </button>
                  {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: done ? 'var(--hf-green)' : 'var(--hf-border)', marginBottom: 20, marginLeft: -4, marginRight: -4 }} />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="responsive-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, minHeight: 0 }}>
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
                  <div key={a.id} className="attivita-item" style={{ position: 'relative' }}>
                    <div className="row center" style={{ gap: 8, marginBottom: 4 }}>
                      <Avatar name={a.autore} tone={a.autore === tecnicoNome ? tecnicoTone : 'gray'} size="sm" />
                      <span style={{ fontWeight: 500, fontSize: 13 }}>{a.autore}</span>
                      <span style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>
                        {new Date(a.created_at).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })} · {a.tipo}
                      </span>
                      <button className="btn ghost sm attivita-del" title="Elimina"
                        onClick={() => deleteAttivita(a)}
                        style={{ marginLeft: 'auto', padding: 2, opacity: 0.5 }}>
                        <Icon name="trash" />
                      </button>
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
                        <td><EditNum key={`q-${p.id}-${p.qty}`} value={p.qty} min={1} step={1} onSave={n => updatePezzo(p, { qty: n })} width={56} /></td>
                        <td className="mono" style={{ color: 'var(--hf-text-3)' }}>€ {p.costo_acq}</td>
                        <td><span className="row center" style={{ gap: 4, justifyContent: 'flex-start' }}>
                          <span className="mono" style={{ color: 'var(--hf-text-3)' }}>€</span>
                          <EditNum key={`v-${p.id}-${p.prezzo_vend}`} value={p.prezzo_vend} step={0.01} onSave={n => updatePezzo(p, { prezzo_vend: n })} width={80} mono />
                        </span></td>
                        <td><Badge tone={p.stato_tone}>{p.stato}</Badge></td>
                        <td style={{ whiteSpace: 'nowrap' }}>
                          {p.stato === 'Da ordinare' && (
                            <button className="btn ghost sm" title="Marca come ordinato (data + rif. ordine)"
                              style={{ padding: '4px 6px', fontSize: 13, lineHeight: 1 }} onClick={() => setOrdinaPezzo(p)}>
                              🛒
                            </button>
                          )}
                          {p.stato !== 'A stock' && (
                            <button className="btn ghost sm" title="Registra arrivo (fattura/data/fornitore)"
                              style={{ padding: 4 }} onClick={() => setCaricoPezzo(p)}>
                              <Icon name="box" />
                            </button>
                          )}
                          <button className="btn ghost sm" title="Elimina pezzo"
                            style={{ padding: 4 }} onClick={() => deletePezzo(p)}>
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

            <FotoCard interventoId={t.id} />

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
                    <span style={{ color: 'var(--hf-text-2)', flex: 1, minWidth: 0 }}><b>{a.autore}</b> · {a.testo}</span>
                    <button className="btn ghost sm" title="Elimina" onClick={() => deleteAttivita(a)}
                      style={{ padding: 2, opacity: 0.4, flex: 'none' }}>
                      <Icon name="trash" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="col" style={{ gap: 16 }}>
            <div className="card">
              <div className="card-title" style={{ marginBottom: 8 }}>Riepilogo €</div>
              <div title="Tetto autorizzato dal cliente al momento dell'accettazione"
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                  padding: '6px 10px', borderRadius: 6, background: 'var(--hf-amber-soft)',
                  color: 'var(--hf-amber)', fontSize: 12, marginBottom: 12 }}>
                <span style={{ fontWeight: 500 }}>🛡 Max autorizzato cliente</span>
                <EditEuro key={`max-${t.max_preventivo}`} value={Number(t.max_preventivo) || 0} onSave={v => saveCosti({ max_preventivo: v })} />
              </div>
              <div className="col" style={{ gap: 10, fontSize: 13 }}>
                <div>
                  <div className="row between" style={{ alignItems: 'baseline', marginBottom: 6 }}>
                    <span style={{ color: 'var(--hf-text-3)', fontSize: 12 }}>
                      Pezzi {pezzi.length > 0 && <span>({pezzi.length})</span>}
                    </span>
                  </div>
                  {pezzi.length === 0 ? (
                    <div style={{ fontSize: 12, color: 'var(--hf-text-4)' }}>Nessun pezzo assegnato.</div>
                  ) : (
                    <div className="col" style={{ gap: 4 }}>
                      {pezzi.map(p => (
                        <div key={p.id} className="row between" style={{ fontSize: 12, alignItems: 'baseline' }}>
                          <span style={{ minWidth: 0, color: 'var(--hf-text-2)' }}>
                            <span className="mono" style={{ color: 'var(--hf-text-3)', marginRight: 6 }}>{p.qty}×</span>
                            {p.nome}
                          </span>
                          <span className="mono">€ {(Number(p.prezzo_vend) * p.qty).toFixed(2).replace('.', ',')}</span>
                        </div>
                      ))}
                      <div className="row between" style={{ marginTop: 4, fontSize: 12, color: 'var(--hf-text-3)' }}>
                        <span>Subtotale pezzi</span>
                        <span className="mono">€ {pezziVendita.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="row between" style={{ borderTop: '1px solid var(--hf-border)', paddingTop: 8, alignItems: 'center' }}>
                  <span style={{ color: 'var(--hf-text-3)' }}>Manodopera</span>
                  <EditEuro key={`man-${manodopera}`} value={manodopera} onSave={v => saveCosti({ manodopera: v })} />
                </div>

                <div style={{ borderTop: '1px solid var(--hf-border)', paddingTop: 8, marginTop: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600 }}>Totale</span>
                  <EditEuro key={`tot-${totale}`} value={totale} onSave={saveTotale} bigger />
                </div>
                <div className="row between" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>
                  <span>Margine</span>
                  <span>€ {margine.toFixed(2).replace('.', ',')} · {totale ? Math.round((margine / totale) * 100) : 0}%</span>
                </div>
                <div style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>
                  Modifica il <strong>Totale</strong> e la manodopera viene ricalcolata automaticamente (Totale − pezzi).
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
      {caricoPezzo && <CaricoPezzoModal pezzo={caricoPezzo} onClose={() => setCaricoPezzo(null)} onSave={saveCaricoPezzo} />}
      {ordinaPezzo && <OrdinaPezzoModal pezzo={ordinaPezzo} onClose={() => setOrdinaPezzo(null)} onSave={saveOrdinaPezzo} />}
      {delModal && <ConfirmDialog message={`Eliminare l'intervento #${t.numero}? Operazione irreversibile.`} onConfirm={doDelete} onClose={() => setDelModal(false)} busy={busy} />}
    </main>
  );
}

const UBICAZIONI = [
  { v: 'IN LABORATORIO', tone: 'gray',  label: '🏷 In laboratorio' },
  { v: 'DAL CLIENTE',    tone: 'amber', label: '🏠 Dal cliente' },
];

function UbicazioneBadge({ ubicazione, onChange }) {
  const [open, setOpen] = useState(false);
  const value = ubicazione || 'IN LABORATORIO';
  const cur = UBICAZIONI.find(u => u.v === value) || UBICAZIONI[0];
  return (
    <span style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        className={`badge ${cur.tone}`}
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        title="Dove si trova il dispositivo"
        style={{ border: '1px solid transparent', cursor: 'pointer', padding: '3px 22px 3px 10px', font: 'inherit', fontSize: 11, fontWeight: 500 }}
      >
        {cur.label}
        <span style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', fontSize: 9, opacity: 0.7 }}>▼</span>
      </button>
      {open && (
        <>
          <div onClick={() => setOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 900 }} />
          <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, zIndex: 901,
            background: 'var(--hf-surface)', border: '1px solid var(--hf-border)', borderRadius: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.18)', padding: 6, minWidth: 180 }}>
            {UBICAZIONI.map(u => (
              <button
                key={u.v}
                type="button"
                onClick={() => { onChange(u.v); setOpen(false); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 6px',
                  background: u.v === value ? 'var(--hf-surface-2)' : 'transparent',
                  border: 'none', borderRadius: 5, cursor: 'pointer' }}
              >
                <Badge tone={u.tone}>{u.label}</Badge>
              </button>
            ))}
          </div>
        </>
      )}
    </span>
  );
}

function FotoCard({ interventoId }) {
  const { data, loading, error, reload } = useData(() => fotoApi.list(interventoId), [interventoId]);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState(null);

  async function onPick(e) {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0) return;
    setBusy(true);
    try {
      for (const f of files) await fotoApi.upload(interventoId, f);
      reload();
    } catch (err) { alert('Errore caricamento: ' + err.message); }
    finally { setBusy(false); }
  }

  async function onDelete(row) {
    if (!confirm('Eliminare questa foto?')) return;
    setBusy(true);
    try { await fotoApi.remove(row); reload(); }
    catch (err) { alert('Errore: ' + err.message); }
    finally { setBusy(false); }
  }

  const foto = data || [];

  return (
    <div className="card">
      <div className="row between" style={{ marginBottom: 12, alignItems: 'center' }}>
        <div className="card-title" style={{ margin: 0 }}>Foto</div>
        <label className="btn sm" style={{ cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1 }}>
          <Icon name="camera" />
          {busy ? 'Carico…' : 'Aggiungi foto'}
          <input type="file" accept="image/*" multiple capture="environment" disabled={busy} onChange={onPick} style={{ display: 'none' }} />
        </label>
      </div>
      {loading && <Loading />}
      {error && <ErrorState error={error} onRetry={reload} />}
      {!loading && !error && foto.length === 0 && (
        <div style={{ fontSize: 13, color: 'var(--hf-text-3)' }}>Nessuna foto. Tocca "Aggiungi foto" per scattare o scegliere dalla galleria.</div>
      )}
      {!loading && !error && foto.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 8 }}>
          {foto.map(f => (
            <div key={f.id} style={{ position: 'relative', aspectRatio: '1 / 1', borderRadius: 6, overflow: 'hidden', border: '1px solid var(--hf-border)', background: 'var(--hf-surface-2)' }}>
              {f.url ? (
                <img src={f.url} alt="" onClick={() => setPreview(f.url)}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'zoom-in', display: 'block' }} />
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--hf-text-4)', fontSize: 11 }}>—</div>
              )}
              <button onClick={() => onDelete(f)} disabled={busy} title="Elimina"
                style={{ position: 'absolute', top: 4, right: 4, width: 22, height: 22, borderRadius: 4, border: 'none', background: 'rgba(0,0,0,0.55)', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="trash" />
              </button>
            </div>
          ))}
        </div>
      )}
      {preview && (
        <div onClick={() => setPreview(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out', padding: 20 }}>
          <img src={preview} alt="" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
        </div>
      )}
    </div>
  );
}

function StatoModal({ current, onPick, onClose, busy }) {
  return (
    <Modal title="Cambia stato intervento" onClose={onClose} width={420}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {STATI.map(({ stato, tone }) => (
          <button key={stato} className="btn" disabled={busy}
            style={{ borderColor: stato === current ? 'var(--hf-accent)' : undefined, background: stato === current ? 'var(--hf-accent-soft)' : undefined }}
            onClick={() => onPick(stato, tone)}>
            <Badge tone={tone}>{stato}</Badge>
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
  const { data: forn } = useData(() => fornitoriApi.list(), []);
  const [tab, setTab] = useState('magazzino'); // 'magazzino' | 'generico'

  // --- tab Da magazzino
  const [sel, setSel] = useState('');
  const [qty, setQty] = useState(1);

  // --- tab Generico
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

  async function saveMagazzino() {
    const a = (mag || []).find(m => m.id === sel);
    if (!a) { setErr('Seleziona un articolo.'); return; }
    setBusy(true); setErr(null);
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
  async function saveGenerico() {
    if (!gen.nome.trim()) { setErr('Il nome del pezzo è obbligatorio.'); return; }
    if (!(Number(gen.qty) > 0)) { setErr('Quantità non valida.'); return; }
    setBusy(true); setErr(null);
    try {
      const up = v => (typeof v === 'string' ? v.toUpperCase() : v);
      await interventiApi.addPezzo(interventoId, {
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
      onSaved();
    } catch (e) { alert('Errore: ' + e.message); setBusy(false); }
  }
  async function saveRecuperato() {
    if (!rec.nome.trim()) { setErr('Il nome del pezzo è obbligatorio.'); return; }
    if (!(Number(rec.qty) > 0)) { setErr('Quantità non valida.'); return; }
    setBusy(true); setErr(null);
    try {
      const up = v => (typeof v === 'string' ? v.toUpperCase() : v);
      await interventiApi.addPezzo(interventoId, {
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
      onSaved();
    } catch (e) { alert('Errore: ' + e.message); setBusy(false); }
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

function EditNum({ value, onSave, min, step = 1, width = 60, mono = false }) {
  const [v, setV] = useState(value ?? 0);
  function focus(e) {
    if (Number(v) === 0) setV('');
    e.currentTarget.select();
  }
  function commit() {
    let n = Number(v);
    if (!isFinite(n)) n = 0;
    if (min != null) n = Math.max(min, n);
    if (n !== Number(value)) onSave(n);
    setV(n);
  }
  return (
    <input
      className={`input ${mono ? 'mono' : ''}`}
      type="number"
      step={step}
      min={min}
      value={v}
      onChange={e => setV(e.target.value)}
      onFocus={focus}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }}
      style={{ width, textAlign: 'right', padding: '4px 8px', fontSize: 12 }}
    />
  );
}

function CaricoPezzoModal({ pezzo, onClose, onSave }) {
  const { data: fornitori } = useData(() => fornitoriApi.list(), []);
  const oggi = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({
    numero_fattura: '',
    data_carico: oggi,
    fornitore_id: pezzo.fornitore_id || '',
    qty: pezzo.qty || 1,
    costo_acq: pezzo.costo_acq || 0,
  });
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const isGenerico = !pezzo.magazzino_id;

  async function submit() {
    if (!f.fornitore_id) { alert('Seleziona il fornitore.'); return; }
    const fornitoreSel = (fornitori || []).find(x => x.id === f.fornitore_id);
    setBusy(true);
    await onSave({
      ...f,
      fornitore_nome: fornitoreSel?.nome || '',
    });
    setBusy(false);
  }

  return (
    <Modal
      title={`Registra carico — ${pezzo.nome}`}
      onClose={onClose}
      footer={<><Btn onClick={onClose}>Annulla</Btn><Btn tone="accent" onClick={submit}>{busy ? 'Salvo…' : 'Salva carico'}</Btn></>}
    >
      {isGenerico && (
        <div style={{ background: 'var(--hf-amber-soft)', color: 'var(--hf-amber)', padding: '8px 10px', borderRadius: 6, fontSize: 12, marginBottom: 4 }}>
          Pezzo generico: verrà creato un articolo a catalogo magazzino al primo carico.
        </div>
      )}
      <Field label="Fornitore *">
        <select className="input" value={f.fornitore_id} onChange={e => set('fornitore_id', e.target.value)}>
          <option value="">— seleziona —</option>
          {(fornitori || []).map(x => <option key={x.id} value={x.id}>{x.nome}</option>)}
        </select>
      </Field>
      <div className="row" style={{ gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="N° fattura">
            <input className="input" value={f.numero_fattura} onChange={e => set('numero_fattura', e.target.value)} placeholder="es. 2026/0123" />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="Data">
            <input className="input" type="date" value={f.data_carico} onChange={e => set('data_carico', e.target.value)} />
          </Field>
        </div>
      </div>
      <div className="row" style={{ gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="Quantità">
            <input className="input" type="number" min="1" value={f.qty}
              onChange={e => set('qty', e.target.value)}
              onFocus={e => { if (Number(f.qty) === 0) set('qty', ''); e.currentTarget.select(); }}
              onBlur={() => { if (f.qty === '') set('qty', pezzo.qty || 1); }} />
          </Field>
        </div>
        <div style={{ flex: 1 }}>
          <Field label="€ costo">
            <input className="input mono" type="number" step="0.01" value={f.costo_acq}
              onChange={e => set('costo_acq', e.target.value)}
              onFocus={e => { if (Number(f.costo_acq) === 0) set('costo_acq', ''); e.currentTarget.select(); }}
              onBlur={() => { if (f.costo_acq === '') set('costo_acq', 0); }} />
          </Field>
        </div>
      </div>
    </Modal>
  );
}

function OrdinaPezzoModal({ pezzo, onClose, onSave }) {
  const { data: fornitori } = useData(() => fornitoriApi.list(), []);
  const oggi = new Date().toISOString().slice(0, 10);
  const [f, setF] = useState({
    fornitore_id: pezzo.fornitore_id || '',
    data_ordine: oggi,
    riferimento_ordine: '',
  });
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));

  async function submit() {
    if (!f.fornitore_id) { alert('Seleziona il fornitore.'); return; }
    const fornitoreSel = (fornitori || []).find(x => x.id === f.fornitore_id);
    setBusy(true);
    await onSave({ ...f, fornitore_nome: fornitoreSel?.nome || '' });
    setBusy(false);
  }

  return (
    <Modal
      title={`Marca come ordinato — ${pezzo.nome}`}
      onClose={onClose}
      footer={<><Btn onClick={onClose}>Annulla</Btn><Btn tone="accent" onClick={submit}>{busy ? 'Salvo…' : 'Conferma ordine'}</Btn></>}
    >
      <div style={{ fontSize: 12, color: 'var(--hf-text-3)', marginTop: -4 }}>
        Registra l'ordine al fornitore. Quando arriverà userai "Registra arrivo" per inserire la fattura.
      </div>
      <Field label="Fornitore *">
        <select className="input" value={f.fornitore_id} onChange={e => set('fornitore_id', e.target.value)}>
          <option value="">— seleziona —</option>
          {(fornitori || []).map(x => <option key={x.id} value={x.id}>{x.nome}</option>)}
        </select>
      </Field>
      <div className="row" style={{ gap: 10 }}>
        <div style={{ flex: 1 }}>
          <Field label="Data ordine">
            <input className="input" type="date" value={f.data_ordine} onChange={e => set('data_ordine', e.target.value)} />
          </Field>
        </div>
        <div style={{ flex: 1.4 }}>
          <Field label="Rif. ordine (facoltativo)">
            <input className="input" value={f.riferimento_ordine} onChange={e => set('riferimento_ordine', e.target.value)} placeholder="es. AMZ-2026-12345" />
          </Field>
        </div>
      </div>
    </Modal>
  );
}

function EditData({ value, onSave }) {
  const iso = value ? new Date(value).toISOString().slice(0, 10) : '';
  const [v, setV] = useState(iso);
  function commit() {
    if (v && v !== iso) onSave(v);
  }
  return (
    <input
      type="date"
      className="input mono"
      value={v}
      onChange={e => setV(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }}
      title="Modifica data intervento"
      style={{ padding: '2px 6px', fontSize: 12, color: 'var(--hf-text-2)', border: '1px dashed var(--hf-border-2)', background: 'transparent', borderRadius: 4 }}
    />
  );
}

function EditEuro({ value, onSave, bigger = false }) {
  const [v, setV] = useState(value ?? 0);
  function focus(e) {
    if (Number(v) === 0) setV('');
    e.currentTarget.select();
  }
  function commit() {
    const n = Number(v) || 0;
    if (n !== (Number(value) || 0)) onSave(n);
    if (v === '') setV(0);
  }
  return (
    <span className="row center" style={{ gap: 4 }}>
      <span className="mono" style={{ color: 'var(--hf-text-3)', fontSize: bigger ? 16 : undefined }}>€</span>
      <input
        className="input mono"
        type="number"
        value={v}
        onChange={e => setV(e.target.value)}
        onFocus={focus}
        onBlur={commit}
        onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }}
        style={{ width: bigger ? 110 : 90, textAlign: 'right', padding: bigger ? '6px 10px' : '4px 8px',
          fontSize: bigger ? 16 : undefined, fontWeight: bigger ? 600 : undefined }}
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
