import { useNavigate } from 'react-router-dom';
import { Badge, Btn, Avatar, Topbar, Icon } from '../components/UI';
import { TICKETS, AVATAR_TONES } from '../data';

const PRONTI = TICKETS.filter(t => t.stato === 'Pronto');

export default function Dashboard() {
  const navigate = useNavigate();

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
        {/* page head */}
        <div className="page-head">
          <div>
            <div className="page-title">Buongiorno Marco 👋</div>
            <div className="page-sub">
              Lunedì 16 maggio 2026 · 7 ritiri da chiamare · 3 articoli sottoscorta
            </div>
          </div>
          <div className="row center">
            <Btn size="sm">Oggi</Btn>
            <Btn size="sm" tone="primary">Questa settimana</Btn>
            <Btn size="sm">Maggio</Btn>
          </div>
        </div>

        {/* KPI strip */}
        <div className="kpi-grid kpi-grid-5">
          {[
            ['Interventi attivi', '49', 'flat', '+3 oggi'],
            ['Pronti per ritiro', '7', 'up', 'azione'],
            ['In attesa pezzi', '5', 'down', '>3gg: 2'],
            ['Incasso oggi', '€ 1.240', 'up', '+18%'],
            ['Margine mese', '€ 6.480', 'up', '+12%'],
          ].map(([l, v, t, d]) => (
            <div key={l} className="card kpi">
              <div className="kpi-label">{l}</div>
              <div className="kpi-value">{v}</div>
              <span className={`kpi-trend ${t}`}>
                {t === 'up' ? '↑' : t === 'down' ? '↓' : '•'} {d}
              </span>
            </div>
          ))}
        </div>

        {/* main grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16, minHeight: 0 }}>
          {/* interventi table */}
          <div className="card" style={{ padding: 0 }}>
            <div
              style={{
                padding: '14px 16px',
                borderBottom: '1px solid var(--hf-border)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 14 }}>Interventi recenti</span>
              <Badge tone="gray" dot={false}>24</Badge>
              <div style={{ flex: 1 }} />
              <div className="tabs" style={{ borderBottom: 'none' }}>
                <div className="tab active">Tutti</div>
                <div className="tab">Miei</div>
                <div className="tab">Pronti</div>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>N°</th>
                  <th>Cliente</th>
                  <th>Dispositivo</th>
                  <th>Stato</th>
                  <th>Tecnico</th>
                  <th>Aperto</th>
                </tr>
              </thead>
              <tbody>
                {TICKETS.slice(0, 7).map(r => (
                  <tr key={r.id} onClick={() => navigate(`/interventi/${r.id}`)}>
                    <td className="mono" style={{ color: 'var(--hf-text-3)' }}>#{r.id}</td>
                    <td className="strong">{r.cliente}</td>
                    <td style={{ color: 'var(--hf-text-2)' }}>{r.dispositivo}</td>
                    <td><Badge tone={r.statoTone}>{r.stato}</Badge></td>
                    <td>
                      <div className="row center" style={{ gap: 6 }}>
                        <Avatar name={r.tecnico} tone={r.tecnicoTone} size="sm" />
                        {r.tecnico}
                      </div>
                    </td>
                    <td style={{ color: 'var(--hf-text-3)' }}>{r.aperto}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* right rail */}
          <div className="col" style={{ gap: 16 }}>
            {/* pronti per ritiro */}
            <div className="card">
              <div className="row between" style={{ marginBottom: 12 }}>
                <div className="card-title">Pronti per ritiro</div>
                <Badge tone="green">7 da chiamare</Badge>
              </div>
              <div className="col" style={{ gap: 10 }}>
                {PRONTI.slice(0, 3).map(r => (
                  <div key={r.id} className="row center" style={{ gap: 10 }}>
                    <Avatar name={r.cliente} tone={AVATAR_TONES[r.tecnico] || 'gray'} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{r.cliente}</div>
                      <div style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>
                        {r.dispositivo} · #{r.id}
                      </div>
                    </div>
                    <div className="mono" style={{ fontSize: 13, fontWeight: 500 }}>
                      {r.totaleStimato ? `€ ${r.totaleStimato},00` : '—'}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ borderTop: '1px solid var(--hf-border)', marginTop: 12, paddingTop: 12 }}>
                <Btn size="sm" onClick={() => navigate('/interventi')}>
                  Vedi tutti i {PRONTI.length} pronti →
                </Btn>
              </div>
            </div>

            {/* weekly chart */}
            <div className="card">
              <div className="row between" style={{ marginBottom: 12 }}>
                <div className="card-title">Incassi settimana</div>
                <span style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>€ 4.380</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'end', gap: 8, height: 80 }}>
                {[40, 65, 35, 80, 55, 90, 72].map((h, i) => (
                  <div
                    key={i}
                    style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                  >
                    <div
                      className={`chart-bar ${i === 6 ? 'accent' : ''}`}
                      style={{ width: '100%', height: `${h}%` }}
                    />
                    <span className="mono" style={{ fontSize: 10, color: 'var(--hf-text-3)' }}>
                      {['L', 'M', 'M', 'G', 'V', 'S', 'D'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* alert sottoscorta */}
            <div
              className="card"
              style={{ borderColor: 'var(--hf-amber)', background: 'var(--hf-amber-soft)' }}
            >
              <div className="row center" style={{ gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 14 }}>⚠</span>
                <span style={{ fontWeight: 600, fontSize: 13 }}>3 articoli sottoscorta</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--hf-text-2)', lineHeight: 1.5 }}>
                SSD 1TB NVMe (2/5)
                <br />
                Pasta term. Kryonaut (1/4)
                <br />
                Tastiera MBA M1 IT (0/2)
              </div>
              <div style={{ marginTop: 10 }}>
                <Btn size="sm" tone="accent" onClick={() => navigate('/magazzino')}>
                  Genera ordine fornitore →
                </Btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
