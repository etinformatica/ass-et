import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Btn, Avatar, Topbar } from '../components/UI';
import { Loading, ErrorState } from '../components/States';
import { useData } from '../lib/useData';
import { useImpostazioni } from '../lib/useImpostazioni';
import { interventiApi, magazzinoApi, pezziApi } from '../lib/api';

const ATTIVI = ['Accettazione', 'Diagnosi', 'Attesa pezzi', 'Attesa cliente', 'In lavorazione', 'Pronto'];
const MESI = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];

function inRange(dateStr, range, now) {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  if (range === 'oggi') return d.toDateString() === now.toDateString();
  if (range === 'settimana') {
    const start = new Date(now); start.setDate(now.getDate() - 6); start.setHours(0, 0, 0, 0);
    return d >= start;
  }
  if (range === 'mese') return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  return true;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { tecnicoNome } = useImpostazioni();
  const interventi = useData(() => interventiApi.list(), []);
  const magazzino = useData(() => magazzinoApi.list(), []);
  const inArrivo = useData(() => pezziApi.listByStato(['Da ordinare', 'Ordinato']), []);
  const [range, setRange] = useState('settimana');

  if (interventi.loading || magazzino.loading)
    return <main className="main"><Topbar crumbs={['Dashboard']} /><div className="content"><Loading /></div></main>;
  if (interventi.error)
    return <main className="main"><Topbar crumbs={['Dashboard']} /><div className="content"><ErrorState error={interventi.error} onRetry={interventi.reload} /></div></main>;

  const now = new Date();
  const list = interventi.data || [];
  const mag = magazzino.data || [];
  const attivi = list.filter(i => ATTIVI.includes(i.stato));
  const pronti = list.filter(i => i.stato === 'Pronto');
  const attesaPezzi = list.filter(i => i.stato === 'Attesa pezzi');
  const inLavorazione = list.filter(i => i.stato === 'In lavorazione').map(i => {
    const pezzi = i.pezzi || [];
    const arrivati = pezzi.filter(p => p.stato === 'A stock').length;
    return { ...i, _pezziTot: pezzi.length, _pezziArrivati: arrivati };
  });
  const sottoscorta = mag.filter(a => a.stock < a.min_stock);

  const periodList = list.filter(i => inRange(i.created_at, range, now));
  const ricaviStimati = periodList.reduce((s, i) => s + Number(i.totale_stimato || 0), 0);
  const margineStimato = periodList.reduce((s, i) => s + Number(i.margine_atteso || 0), 0);

  // Incassi ultimi 7 giorni: per ogni intervento "Incassato" cerca la data dell'ultima
  // attività di tipo "stato" che indica il passaggio a Incassato; fallback su created_at.
  const incassiSettimana = (() => {
    const giorni = [];
    for (let k = 6; k >= 0; k--) {
      const d = new Date(now); d.setDate(now.getDate() - k); d.setHours(0, 0, 0, 0);
      giorni.push({ d, totale: 0 });
    }
    list.filter(i => i.stato === 'Incassato').forEach(i => {
      const att = (i.attivita || [])
        .filter(a => a.tipo === 'stato' && /Incassato/i.test(a.testo || ''))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
      const incassoDate = new Date(att?.created_at || i.created_at);
      incassoDate.setHours(0, 0, 0, 0);
      const slot = giorni.find(g => g.d.getTime() === incassoDate.getTime());
      if (slot) slot.totale += Number(i.totale_stimato || 0);
    });
    const max = Math.max(...giorni.map(g => g.totale), 1);
    const dow = ['D', 'L', 'M', 'M', 'G', 'V', 'S'];
    return giorni.map((g, i) => ({
      label: dow[g.d.getDay()],
      totale: g.totale,
      h: (g.totale / max) * 100,
      isToday: i === 6,
    }));
  })();
  const incassiSettimanaTot = incassiSettimana.reduce((s, g) => s + g.totale, 0);

  const rangeLabel = range === 'oggi' ? 'oggi'
    : range === 'settimana' ? 'ultimi 7 giorni'
    : MESI[now.getMonth()].toLowerCase();

  return (
    <main className="main">
      <Topbar
        crumbs={['Dashboard']}
        right={
          <>
            <Btn tone="ghost" size="sm" icon="bell" />
            <Btn tone="primary" size="sm" icon="plus" onClick={() => navigate('/accettazione')}>
              Nuova accettazione
            </Btn>
          </>
        }
      />

      <div className="content">
        <div className="page-head">
          <div>
            <div className="page-title">Buongiorno {tecnicoNome} 👋</div>
            <div className="page-sub">
              {pronti.length} ritiri da chiamare · {sottoscorta.length} articoli sottoscorta
            </div>
          </div>
          <div className="row center">
            <Btn size="sm" tone={range === 'oggi' ? 'primary' : undefined} onClick={() => setRange('oggi')}>Oggi</Btn>
            <Btn size="sm" tone={range === 'settimana' ? 'primary' : undefined} onClick={() => setRange('settimana')}>Questa settimana</Btn>
            <Btn size="sm" tone={range === 'mese' ? 'primary' : undefined} onClick={() => setRange('mese')}>{MESI[now.getMonth()]}</Btn>
          </div>
        </div>

        <div className="kpi-grid kpi-grid-6">
          {[
            { l: 'Interventi attivi', v: String(attivi.length), t: 'flat', d: `${list.length} totali`, to: '/interventi' },
            { l: 'Pronti per ritiro', v: String(pronti.length), t: 'up', d: 'azione', to: '/interventi?stato=Pronto' },
            { l: 'In attesa pezzi', v: String(attesaPezzi.length), t: 'down', d: 'da seguire', to: '/interventi?stato=Attesa+pezzi' },
            { l: 'Pezzi in arrivo', v: String((inArrivo.data || []).length), t: 'flat', d: 'da ordinare + ordinati', to: '/fornitori?tab=ordinare' },
            { l: 'Ricavi stimati', v: `€ ${ricaviStimati.toLocaleString('it-IT')}`, t: 'up', d: rangeLabel },
            { l: 'Margine atteso', v: `€ ${margineStimato.toLocaleString('it-IT')}`, t: 'up', d: rangeLabel },
          ].map(k => (
            <div
              key={k.l}
              className="card kpi"
              onClick={k.to ? () => navigate(k.to) : undefined}
              style={k.to ? { cursor: 'pointer' } : undefined}
              title={k.to ? 'Apri elenco' : undefined}
            >
              <div className="kpi-label">{k.l}</div>
              <div className="kpi-value">{k.v}</div>
              <span className={`kpi-trend ${k.t}`}>{k.t === 'up' ? '↑' : k.t === 'down' ? '↓' : '•'} {k.d}</span>
            </div>
          ))}
        </div>

        <div className="responsive-stack" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, minHeight: 0 }}>
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--hf-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Interventi · {rangeLabel}</span>
              <Badge tone="gray" dot={false}>{periodList.length}</Badge>
              <div style={{ flex: 1 }} />
              <Btn size="sm" onClick={() => navigate('/interventi')}>Vedi tutti →</Btn>
            </div>
            <table className="data-table">
              <thead>
                <tr><th>N°</th><th>Cliente</th><th>Dispositivo</th><th>Stato</th><th>Tecnico</th></tr>
              </thead>
              <tbody>
                {periodList.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign: 'center', padding: 20, color: 'var(--hf-text-3)', fontSize: 13 }}>Nessun intervento nel periodo selezionato.</td></tr>
                )}
                {periodList.slice(0, 8).map(r => (
                  <tr key={r.id} onClick={() => navigate(`/interventi/${r.id}`)}>
                    <td className="mono" style={{ color: 'var(--hf-text-3)' }}>#{r.numero}</td>
                    <td className="strong">{r.cliente?.nome || '—'}</td>
                    <td style={{ color: 'var(--hf-text-2)' }}>{r.dispositivo}</td>
                    <td><Badge tone={r.stato_tone}>{r.stato}</Badge></td>
                    <td>
                      {r.tecnico ? (
                        <div className="row center" style={{ gap: 6 }}>
                          <Avatar name={r.tecnico.nome} tone={r.tecnico.tone} size="sm" />
                          {r.tecnico.nome}
                        </div>
                      ) : <span style={{ color: 'var(--hf-text-4)' }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col" style={{ gap: 16 }}>
            <div className="card">
              <div className="row between" style={{ marginBottom: 12 }}>
                <div className="card-title">Pronti per ritiro</div>
                <Badge tone="green">{pronti.length} da chiamare</Badge>
              </div>
              <div className="col" style={{ gap: 10 }}>
                {pronti.length === 0 && <div style={{ fontSize: 13, color: 'var(--hf-text-3)' }}>Nessun intervento pronto.</div>}
                {pronti.slice(0, 4).map(r => (
                  <div key={r.id} className="row center" style={{ gap: 10, cursor: 'pointer' }} onClick={() => navigate(`/interventi/${r.id}`)}>
                    <Avatar name={r.cliente?.nome || '?'} tone="green" />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{r.cliente?.nome}</div>
                      <div style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{r.dispositivo} · #{r.numero}</div>
                    </div>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 500 }}>
                      {r.totale_stimato ? `€ ${r.totale_stimato}` : '—'}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="row between" style={{ marginBottom: 12 }}>
                <div className="card-title">In lavorazione</div>
                <Badge tone="violet">{inLavorazione.length}</Badge>
              </div>
              <div className="col" style={{ gap: 10 }}>
                {inLavorazione.length === 0 && (
                  <div style={{ fontSize: 13, color: 'var(--hf-text-3)' }}>Nessun intervento in lavorazione.</div>
                )}
                {inLavorazione.slice(0, 5).map(r => {
                  const tot = r._pezziTot, arr = r._pezziArrivati;
                  const completo = tot === 0 || arr === tot;
                  return (
                    <div key={r.id} className="row center" style={{ gap: 10, cursor: 'pointer' }} onClick={() => navigate(`/interventi/${r.id}`)}>
                      <Avatar name={r.cliente?.nome || '?'} tone="violet" />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{r.cliente?.nome || '—'}</div>
                        <div style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{r.dispositivo} · #{r.numero}</div>
                      </div>
                      {tot > 0 ? (
                        <Badge tone={completo ? 'green' : 'amber'} dot={false}>
                          {completo ? `${tot} pezz${tot > 1 ? 'i' : 'o'} ✓` : `${arr}/${tot} arrivati`}
                        </Badge>
                      ) : (
                        <Badge tone="gray" dot={false}>senza pezzi</Badge>
                      )}
                    </div>
                  );
                })}
                {inLavorazione.length > 5 && (
                  <div onClick={() => navigate('/interventi?stato=In lavorazione')}
                    style={{ fontSize: 12, color: 'var(--hf-accent)', cursor: 'pointer', textAlign: 'center', paddingTop: 4 }}>
                    Vedi tutti ({inLavorazione.length}) →
                  </div>
                )}
              </div>
            </div>

            <div className="card">
              <div className="row between" style={{ marginBottom: 12 }}>
                <div className="card-title">Incassi settimana</div>
                <span className="mono" style={{ fontSize: 12, fontWeight: 600 }}>€ {incassiSettimanaTot.toFixed(2).replace('.', ',')}</span>
              </div>
              {incassiSettimanaTot === 0 ? (
                <div style={{ padding: '16px 8px', textAlign: 'center', fontSize: 12, color: 'var(--hf-text-3)' }}>
                  Nessun intervento incassato negli ultimi 7 giorni.
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'end', gap: 8, height: 90 }}>
                  {incassiSettimana.map((g, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                      title={`${g.label} · € ${g.totale.toFixed(2).replace('.', ',')}`}>
                      <div className={`chart-bar ${g.isToday ? 'accent' : (g.totale === 0 ? 'muted' : '')}`}
                        style={{ width: '100%', height: `${Math.max(g.h, g.totale > 0 ? 6 : 2)}%`, minHeight: 2 }} />
                      <span className="mono" style={{ fontSize: 10, color: 'var(--hf-text-3)' }}>{g.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card" style={{ borderColor: 'var(--hf-amber)', background: 'var(--hf-amber-soft)' }}>
              <div className="row center" style={{ gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>⚠</span>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{sottoscorta.length} articoli sottoscorta</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--hf-text-2)', lineHeight: 1.6 }}>
                {sottoscorta.slice(0, 3).map(a => (
                  <div key={a.id}>{a.nome} ({a.stock}/{a.min_stock})</div>
                ))}
                {sottoscorta.length === 0 && <span>Nessun articolo sottoscorta.</span>}
              </div>
              <div style={{ marginTop: 10 }}>
                <Btn size="sm" tone="accent" onClick={() => navigate('/magazzino')}>Vai al magazzino →</Btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
