import { useParams, useNavigate } from 'react-router-dom';
import { Badge, Btn, Avatar, Topbar, Icon } from '../components/UI';
import { TICKETS, STATUS_TRACK } from '../data';

export default function Dettaglio() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket = TICKETS.find(t => t.id === id);

  if (!ticket) {
    return (
      <main className="main">
        <div className="content" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center', color: 'var(--hf-text-3)' }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>⚠</div>
            <div style={{ fontWeight: 600 }}>Intervento #{id} non trovato</div>
            <Btn style={{ marginTop: 16 }} onClick={() => navigate('/interventi')}>← Torna agli interventi</Btn>
          </div>
        </div>
      </main>
    );
  }

  const trackIdx = STATUS_TRACK.indexOf(ticket.stato);

  const pezziCosto = ticket.pezzi.reduce((s, p) => s + p.costoAcq * p.qty, 0);
  const pezziVendita = ticket.pezzi.reduce((s, p) => s + p.prezzoVend * p.qty, 0);
  const manodopera = 60;
  const totale = ticket.totaleStimato || (pezziVendita + manodopera);
  const margine = ticket.margineAtteso || (totale - pezziCosto - manodopera * 0.4);

  return (
    <main className="main">
      <Topbar
        crumbs={['Interventi', `#${ticket.id}`]}
        right={
          <>
            <Btn size="sm" icon="bell">SMS</Btn>
            <Btn size="sm">Stampa bolla</Btn>
            <Btn size="sm" tone="primary">Cambia stato</Btn>
          </>
        }
      />

      <div className="content">
        {/* page head */}
        <div className="page-head">
          <div>
            <div className="row center" style={{ gap: 10, marginBottom: 4 }}>
              <span className="mono" style={{ color: 'var(--hf-text-3)', fontSize: 13 }}>#{ticket.id}</span>
              <Badge tone={ticket.statoTone}>{ticket.stato}</Badge>
              {ticket.pezzi.length > 0 && (
                <Badge tone="gray" dot={false}>{ticket.pezzi.length} pezz{ticket.pezzi.length > 1 ? 'i' : 'o'} · €{pezziVendita}</Badge>
              )}
            </div>
            <div className="page-title">{ticket.dispositivo} · {ticket.cliente}</div>
            <div className="page-sub">
              Aperto {ticket.aperto} · Tecnico {ticket.tecnico} · Tel {ticket.tel}
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
            <span style={{ fontSize: 12, color: 'var(--hf-text-3)' }}>Importo previsto</span>
            <span style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em' }}>€ {ticket.maxPreventivo},00</span>
            <span style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>max autorizzato</span>
          </div>
        </div>

        {/* status track */}
        <div className="card" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {STATUS_TRACK.map((step, i, arr) => {
              const done = i < trackIdx;
              const active = i === trackIdx;
              const idle = i > trackIdx;
              return (
                <div key={step} style={{ display: 'flex', alignItems: 'center', flex: i < arr.length - 1 ? 1 : 'none' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 90 }}>
                    <div
                      style={{
                        width: 24, height: 24, borderRadius: '50%',
                        background: done ? 'var(--hf-green)' : active ? 'var(--hf-amber)' : 'var(--hf-surface-2)',
                        border: `2px solid ${done ? 'var(--hf-green)' : active ? 'var(--hf-amber)' : 'var(--hf-border-2)'}`,
                        color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: 11, fontWeight: 700,
                      }}
                    >
                      {done ? '✓' : active ? '●' : ''}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: idle ? 'var(--hf-text-4)' : 'var(--hf-text)', textAlign: 'center' }}>
                      {step}
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div
                      style={{
                        flex: 1, height: 2,
                        background: done ? 'var(--hf-green)' : 'var(--hf-border)',
                        marginBottom: 20,
                        marginLeft: -4, marginRight: -4,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, minHeight: 0 }}>
          <div className="col" style={{ gap: 16 }}>
            {/* difetto e diagnosi */}
            <div className="card">
              <div className="row between" style={{ marginBottom: 10 }}>
                <div className="card-title">Difetto e diagnosi</div>
                <Btn size="sm" tone="ghost" icon="plus">Nota</Btn>
              </div>

              <div className="col" style={{ gap: 14 }}>
                {ticket.attivita.length > 0 ? (
                  ticket.attivita.map((a, i) => (
                    <div key={i}>
                      <div className="row center" style={{ gap: 8, marginBottom: 4 }}>
                        <Avatar name={a.autore} tone={a.autore === 'Luca M.' ? 'green' : a.autore === 'Marco T.' ? 'blue' : 'amber'} size="sm" />
                        <span style={{ fontWeight: 500, fontSize: 13 }}>{a.autore}</span>
                        <span style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{a.ts} · {a.tipo}</span>
                      </div>
                      <div style={{ marginLeft: 30, fontSize: 13, color: 'var(--hf-text-2)' }}>{a.testo}</div>
                    </div>
                  ))
                ) : (
                  <div>
                    <div className="row center" style={{ gap: 8, marginBottom: 4 }}>
                      <Avatar name="Marco T." tone="blue" size="sm" />
                      <span style={{ fontWeight: 500, fontSize: 13 }}>Marco T.</span>
                      <span style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{ticket.aperto} · accettazione</span>
                    </div>
                    <div style={{ marginLeft: 30, fontSize: 13, color: 'var(--hf-text-2)' }}>{ticket.difetto}</div>
                  </div>
                )}
              </div>
            </div>

            {/* pezzi */}
            <div className="card" style={{ padding: 0 }}>
              <div
                style={{
                  padding: '14px 16px',
                  borderBottom: '1px solid var(--hf-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ fontWeight: 600, fontSize: 14 }}>Pezzi assegnati</div>
                <Btn size="sm" icon="plus">Aggiungi da magazzino</Btn>
              </div>
              {ticket.pezzi.length > 0 ? (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>SKU</th>
                      <th>Articolo</th>
                      <th>Q.</th>
                      <th>Costo</th>
                      <th>Vendita</th>
                      <th>Stato</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ticket.pezzi.map(p => (
                      <tr key={p.sku}>
                        <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{p.sku}</td>
                        <td className="strong">{p.nome}</td>
                        <td>×{p.qty}</td>
                        <td className="mono" style={{ color: 'var(--hf-text-3)' }}>€ {p.costoAcq}</td>
                        <td className="mono strong">€ {p.prezzoVend}</td>
                        <td><Badge tone={p.stateTone}>{p.stato}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: 16, textAlign: 'center', color: 'var(--hf-text-3)', fontSize: 13 }}>
                  Nessun pezzo assegnato
                </div>
              )}
            </div>

            {/* attivita timeline */}
            {ticket.attivita.length > 0 && (
              <div className="card">
                <div className="card-title" style={{ marginBottom: 12 }}>Attività</div>
                <div className="col" style={{ gap: 10, fontSize: 13 }}>
                  {ticket.attivita.map((a, i) => (
                    <div key={i} className="row" style={{ gap: 10, alignItems: 'flex-start' }}>
                      <span className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)', width: 80, flex: 'none', paddingTop: 2 }}>
                        {a.ts}
                      </span>
                      <span
                        style={{
                          width: 6, height: 6, borderRadius: '50%', marginTop: 7, flex: 'none',
                          background: a.tipo === 'sms' ? 'var(--hf-blue)' : a.tipo === 'diagnosi' ? 'var(--hf-green)' : a.tipo === 'stato' ? 'var(--hf-amber)' : 'var(--hf-text-3)',
                        }}
                      />
                      <span style={{ color: 'var(--hf-text-2)' }}>{a.testo}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* right rail */}
          <div className="col" style={{ gap: 16 }}>
            {/* riepilogo € */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 10 }}>Riepilogo €</div>
              <div className="col" style={{ gap: 8, fontSize: 13 }}>
                <div className="row between">
                  <span style={{ color: 'var(--hf-text-3)' }}>Max autorizzato</span>
                  <span className="mono strong">€ {ticket.maxPreventivo},00</span>
                </div>
                {pezziVendita > 0 && (
                  <div className="row between">
                    <span style={{ color: 'var(--hf-text-3)' }}>Pezzi</span>
                    <span className="mono">€ {pezziVendita},00</span>
                  </div>
                )}
                <div className="row between">
                  <span style={{ color: 'var(--hf-text-3)' }}>Manodopera</span>
                  <span className="mono">€ {manodopera},00</span>
                </div>
                <div
                  style={{
                    borderTop: '1px solid var(--hf-border)',
                    paddingTop: 8,
                    marginTop: 4,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>Totale stimato</span>
                  <span style={{ fontWeight: 600, fontSize: 18, letterSpacing: '-0.01em' }}>€ {totale},00</span>
                </div>
                <div className="row between" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>
                  <span>Margine atteso</span>
                  <span>€ {Math.round(margine)},00 · {Math.round((margine / totale) * 100)}%</span>
                </div>
              </div>
            </div>

            {/* cliente */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 10 }}>Cliente</div>
              <div className="row center" style={{ gap: 10, marginBottom: 10 }}>
                <Avatar name={ticket.cliente} tone="blue" size="md" />
                <div>
                  <div style={{ fontWeight: 500 }}>{ticket.cliente}</div>
                  <div style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{ticket.tel}</div>
                </div>
              </div>
              <div className="row center" style={{ gap: 6 }}>
                <Btn size="sm" icon="phone">Chiama</Btn>
                <Btn size="sm" icon="mail">SMS</Btn>
              </div>
            </div>

            {/* priorita / tecnico */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 10 }}>Lavorazione</div>
              <div className="col" style={{ gap: 10 }}>
                <div>
                  <span className="field-label">Priorità</span>
                  <div className="row center" style={{ gap: 6 }}>
                    {['Bassa', 'Normale', 'Urgente'].map(p => (
                      <span key={p} className={`pill ${p === ticket.priorita ? 'active' : ''}`}>{p}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="field-label">Tecnico</span>
                  <div className="row center" style={{ gap: 8, padding: '7px 10px', background: 'var(--hf-surface)', border: '1px solid var(--hf-border)', borderRadius: 6 }}>
                    <Avatar name={ticket.tecnico} tone={ticket.tecnicoTone} size="sm" />
                    <span style={{ fontSize: 13 }}>{ticket.tecnico}</span>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 4 }}>
              <Btn style={{ width: '100%', justifyContent: 'center' }} onClick={() => navigate('/interventi')}>
                ← Torna agli interventi
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
