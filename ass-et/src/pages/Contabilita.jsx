import { useState } from 'react';
import { Badge, Btn, Topbar, ProgressBar } from '../components/UI';

const TABS = ['Per intervento', 'Vista mese · P&L', 'Fornitori & acquisti', 'Fatture & corrispettivi'];

const TOP_CAT = [
  ['Sostituzione SSD/HDD', 38, '€ 4.320', 95],
  ['Vetri smartphone', 22, '€ 2.860', 62],
  ['Rimozione virus', 24, '€ 1.680', 37],
  ['Pulizia + pasta term.', 18, '€ 1.080', 24],
  ['Recupero dati', 12, '€ 2.940', 64],
];

const FATTURE = [
  { id: 'F-0142', tipo: 'Fatt. elettronica', cliente: 'Verdi srl', ref: '#2409', importo: 320, scadenza: '30gg DF', stato: 'In scadenza', tone: 'amber' },
  { id: 'F-0141', tipo: 'Fatt. privato', cliente: 'Marini A.', ref: '#2401', importo: 220, scadenza: '15 gg', stato: 'In termini', tone: 'green' },
  { id: 'F-0138', tipo: 'Fatt. elettronica', cliente: 'Studio Neri', ref: '#2406', importo: 60, scadenza: '30gg DF', stato: 'In termini', tone: 'green' },
  { id: 'F-0133', tipo: 'Fatt. elettronica', cliente: 'Tech Hub spa', ref: '#2378', importo: 480, scadenza: 'scaduta 4gg', stato: 'Da sollecitare', tone: 'red' },
];

export default function Contabilita() {
  const [tab, setTab] = useState('Vista mese · P&L');

  return (
    <main className="main">
      <Topbar
        crumbs={['Contabilità', 'Maggio 2026']}
        right={
          <>
            <Btn size="sm">‹ Aprile</Btn>
            <Btn size="sm" tone="primary">Maggio 2026 ▾</Btn>
            <Btn size="sm">Giugno ›</Btn>
            <Btn size="sm">Esporta</Btn>
          </>
        }
      />

      <div className="content">
        <div className="page-head">
          <div>
            <div className="page-title">Contabilità · Maggio 2026</div>
            <div className="page-sub">Margine lordo €10.990 · +18% vs aprile · 142 interventi chiusi</div>
          </div>
        </div>

        {/* tabs */}
        <div className="tabs">
          {TABS.map(t => (
            <div key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</div>
          ))}
        </div>

        {/* KPI */}
        <div className="kpi-grid kpi-grid-6">
          {[
            ['Ricavi', '€ 18.420', '+12%', 'up'],
            ['Costi pezzi', '€ 6.180', '+4%', 'flat'],
            ['Manodopera', '€ 1.250', '=', 'flat'],
            ['Margine lordo', '€ 10.990', '+18%', 'up'],
            ['Margine %', '59,7%', '+3pt', 'up'],
            ['Interventi', '142', '+9', 'up'],
          ].map(([l, v, d, t]) => (
            <div key={l} className="card kpi">
              <div className="kpi-label">{l}</div>
              <div className="kpi-value sm">{v}</div>
              <span className={`kpi-trend ${t}`}>{t === 'up' ? '↑' : t === 'down' ? '↓' : '•'} {d}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
          {/* P&L T-account */}
          <div className="card">
            <div className="row between" style={{ marginBottom: 14 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Conto economico semplificato</span>
              <span style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>aggiornato in tempo reale</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              <div style={{ paddingRight: 16, borderRight: '1px solid var(--hf-border)' }}>
                <div style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase', letterSpacing: 0.04, marginBottom: 8, fontWeight: 500 }}>+ Entrate</div>
                <div className="col" style={{ gap: 8, fontSize: 13 }}>
                  {[['Riparazioni', '€ 15.420'], ['Vendita banco', '€ 2.450'], ['Diagnosi a pagamento', '€ 350'], ['Recupero dati', '€ 200']].map(([n, v]) => (
                    <div key={n} className="row between"><span>{n}</span><span className="mono">{v}</span></div>
                  ))}
                  <div style={{ borderTop: '1px solid var(--hf-border)', paddingTop: 8, marginTop: 4 }} className="row between">
                    <span style={{ fontWeight: 600 }}>Totale</span>
                    <span style={{ fontWeight: 600, fontSize: 18 }}>€ 18.420</span>
                  </div>
                </div>
              </div>
              <div style={{ paddingLeft: 16 }}>
                <div style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase', letterSpacing: 0.04, marginBottom: 8, fontWeight: 500 }}>− Uscite</div>
                <div className="col" style={{ gap: 8, fontSize: 13 }}>
                  {[['Pezzi (scaricati)', '€ 6.180'], ['Acquisti fornitori', '€ 4.820'], ['Manodopera tecnici', '€ 1.250'], ['Spedizioni', '€ 180']].map(([n, v]) => (
                    <div key={n} className="row between"><span>{n}</span><span className="mono">{v}</span></div>
                  ))}
                  <div style={{ borderTop: '1px solid var(--hf-border)', paddingTop: 8, marginTop: 4 }} className="row between">
                    <span style={{ fontWeight: 600 }}>Totale costi</span>
                    <span style={{ fontWeight: 600, fontSize: 18 }}>€ 7.430</span>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ marginTop: 18, padding: '14px 16px', background: 'var(--hf-accent-soft)', borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Margine lordo</span>
              <span style={{ fontWeight: 600, fontSize: 30, letterSpacing: '-0.02em', color: 'var(--hf-accent)' }}>€ 10.990</span>
            </div>
          </div>

          {/* right: trend + categorie */}
          <div className="col" style={{ gap: 16 }}>
            <div className="card">
              <div className="row between" style={{ marginBottom: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Andamento 12 mesi</span>
                <div className="row center" style={{ gap: 8, fontSize: 11 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, background: 'var(--hf-text)', display: 'inline-block' }} />Ricavi
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, background: 'var(--hf-accent)', display: 'inline-block' }} />Margine
                  </span>
                </div>
              </div>
              <div style={{ position: 'relative', height: 120 }}>
                <svg viewBox="0 0 300 120" style={{ width: '100%', height: '100%' }}>
                  <defs>
                    <linearGradient id="fade" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#d97757" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#d97757" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M 5 85 L 30 80 L 55 78 L 80 70 L 105 60 L 130 56 L 155 50 L 180 48 L 205 42 L 230 38 L 255 30 L 280 22"
                    fill="none" stroke="#1a1816" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 5 100 L 30 95 L 55 92 L 80 85 L 105 78 L 130 75 L 155 68 L 180 65 L 205 58 L 230 55 L 255 48 L 280 40"
                    fill="none" stroke="#d97757" strokeWidth="2" strokeLinecap="round" />
                  <path d="M 5 100 L 30 95 L 55 92 L 80 85 L 105 78 L 130 75 L 155 68 L 180 65 L 205 58 L 230 55 L 255 48 L 280 40 L 280 120 L 5 120 Z"
                    fill="url(#fade)" />
                  <circle cx="280" cy="22" r="3" fill="#1a1816" />
                  <circle cx="280" cy="40" r="3" fill="#d97757" />
                </svg>
              </div>
              <div className="row between mono" style={{ fontSize: 11, color: 'var(--hf-text-3)', marginTop: 4 }}>
                <span>giu '25</span><span>mag '26</span>
              </div>
            </div>

            <div className="card">
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 12 }}>Top categorie · maggio</div>
              <div className="col" style={{ gap: 8 }}>
                {TOP_CAT.map(([n, c, t, pct]) => (
                  <div key={n}>
                    <div className="row between" style={{ fontSize: 12, marginBottom: 3 }}>
                      <span style={{ fontWeight: 500 }}>{n}</span>
                      <span className="mono" style={{ color: 'var(--hf-text-3)' }}>{c}× · {t}</span>
                    </div>
                    <ProgressBar pct={pct} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* fatture */}
        <div className="table-wrap">
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hf-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Da emettere / da incassare</span>
            <Badge tone="amber" dot={false}>5 fatture · €820</Badge>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Doc.</th><th>Tipo</th><th>Cliente</th><th>Riferimento</th><th>Importo</th><th>Scadenza</th><th>Stato</th>
              </tr>
            </thead>
            <tbody>
              {FATTURE.map(f => (
                <tr key={f.id}>
                  <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{f.id}</td>
                  <td>{f.tipo}</td>
                  <td className="strong">{f.cliente}</td>
                  <td className="mono" style={{ fontSize: 11 }}>{f.ref}</td>
                  <td className="mono strong">€ {f.importo},00</td>
                  <td style={{ color: 'var(--hf-text-3)' }}>{f.scadenza}</td>
                  <td><Badge tone={f.tone}>{f.stato}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
