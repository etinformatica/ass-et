import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Btn, Avatar, Topbar, Icon } from '../components/UI';
import { CLIENTI, TICKETS } from '../data';

export default function Clienti() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(CLIENTI[0]);

  const clienteTickets = TICKETS.filter(t => t.cliente === selected.nome);

  return (
    <main className="main">
      <Topbar
        crumbs={['Clienti']}
        right={
          <>
            <Btn size="sm" icon="filter">Filtri</Btn>
            <Btn size="sm" tone="primary" icon="plus">Nuovo cliente</Btn>
          </>
        }
      />

      <div className="content">
        <div className="page-head">
          <div>
            <div className="page-title">Anagrafica clienti</div>
            <div className="page-sub">1.247 clienti registrati · 3 nuovi questo mese</div>
          </div>
          <div className="search-box" style={{ minWidth: 280 }}>
            <Icon name="search" />
            <span style={{ color: 'var(--hf-text-3)', fontSize: 13 }}>Nome, telefono, CF…</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 16, minHeight: 0, flex: 1 }}>
          {/* lista */}
          <div className="table-wrap" style={{ overflowY: 'auto' }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hf-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Clienti</span>
              <Badge tone="gray" dot={false}>1.247</Badge>
              <div style={{ flex: 1 }} />
              <div className="tabs" style={{ borderBottom: 'none' }}>
                <div className="tab active">Tutti</div>
                <div className="tab">Privati</div>
                <div className="tab">Aziende</div>
              </div>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Tipo</th>
                  <th>Interventi</th>
                  <th>Spesa tot.</th>
                  <th>Ultimo</th>
                </tr>
              </thead>
              <tbody>
                {CLIENTI.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    style={{ background: selected.id === c.id ? 'var(--hf-accent-soft)' : undefined }}
                  >
                    <td>
                      <div className="row center" style={{ gap: 8 }}>
                        <Avatar name={c.nome} tone={c.tipo === 'Azienda' ? 'blue' : 'violet'} size="sm" />
                        <span className="strong">{c.nome}</span>
                      </div>
                    </td>
                    <td>
                      <Badge tone={c.tipo === 'Azienda' ? 'blue' : 'gray'}>{c.tipo}</Badge>
                    </td>
                    <td className="mono">{c.interventi}</td>
                    <td className="mono">€ {c.spesaTotale.toLocaleString('it-IT')}</td>
                    <td style={{ color: 'var(--hf-text-3)', fontSize: 12 }}>{c.ultimoIntervento}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* scheda cliente */}
          <div className="col" style={{ gap: 16 }}>
            <div className="card">
              <div className="row center" style={{ gap: 12, marginBottom: 14 }}>
                <Avatar name={selected.nome} tone={selected.tipo === 'Azienda' ? 'blue' : 'violet'} size="md" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 18, letterSpacing: '-0.01em' }}>{selected.nome}</div>
                  <Badge tone={selected.tipo === 'Azienda' ? 'blue' : 'gray'} dot={false}>{selected.tipo}</Badge>
                </div>
                <div className="row center" style={{ gap: 6 }}>
                  <Btn size="sm" icon="phone">Chiama</Btn>
                  <Btn size="sm" icon="mail">Email</Btn>
                  <Btn size="sm" icon="edit" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                <div>
                  <div className="field-label">Telefono</div>
                  <div className="mono">{selected.tel}</div>
                </div>
                <div>
                  <div className="field-label">Email</div>
                  <div style={{ color: 'var(--hf-text-2)' }}>{selected.email}</div>
                </div>
                <div>
                  <div className="field-label">Codice fiscale / P.IVA</div>
                  <div className="mono">{selected.cf}</div>
                </div>
                <div>
                  <div className="field-label">Cliente dal</div>
                  <div style={{ color: 'var(--hf-text-2)' }}>{selected.primoIntervento}</div>
                </div>
              </div>
            </div>

            {/* KPI cliente */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div className="card kpi">
                <div className="kpi-label">Interventi</div>
                <div className="kpi-value sm">{selected.interventi}</div>
              </div>
              <div className="card kpi">
                <div className="kpi-label">Spesa totale</div>
                <div className="kpi-value sm">€ {selected.spesaTotale.toLocaleString('it-IT')}</div>
              </div>
              <div className="card kpi">
                <div className="kpi-label">Scontrino medio</div>
                <div className="kpi-value sm">
                  € {selected.interventi > 0 ? Math.round(selected.spesaTotale / selected.interventi) : 0}
                </div>
              </div>
            </div>

            {/* storico interventi */}
            <div className="card" style={{ padding: 0, flex: 1 }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hf-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Storico interventi</span>
                <Btn size="sm" tone="primary" icon="plus" onClick={() => navigate('/accettazione')}>
                  Nuovo
                </Btn>
              </div>
              {clienteTickets.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>N°</th>
                      <th>Dispositivo</th>
                      <th>Aperto</th>
                      <th>Stato</th>
                      <th>Totale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clienteTickets.map(t => (
                      <tr key={t.id} onClick={() => navigate(`/interventi/${t.id}`)}>
                        <td className="mono" style={{ color: 'var(--hf-text-3)' }}>#{t.id}</td>
                        <td className="strong">{t.dispositivo}</td>
                        <td style={{ color: 'var(--hf-text-3)' }}>{t.aperto}</td>
                        <td><Badge tone={t.statoTone}>{t.stato}</Badge></td>
                        <td className="mono">{t.totaleStimato ? `€ ${t.totaleStimato}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: 24, textAlign: 'center', color: 'var(--hf-text-3)', fontSize: 13 }}>
                  Nessun intervento trovato
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
