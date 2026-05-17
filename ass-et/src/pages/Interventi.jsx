import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Btn, Avatar, Topbar, Icon, Pill } from '../components/UI';
import { TICKETS } from '../data';

const STATUS_FILTERS = [
  { label: 'Tutti', count: 49 },
  { label: 'Accettazione', count: 3 },
  { label: 'Diagnosi', count: 8 },
  { label: 'Attesa pezzi', count: 5 },
  { label: 'Attesa cliente', count: 4 },
  { label: 'In lavorazione', count: 12 },
  { label: 'Pronti', count: 7 },
  { label: 'Consegnati', count: 10 },
];

export default function Interventi() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('Tutti');
  const [view, setView] = useState('Tabella');

  const filtered = filter === 'Tutti'
    ? TICKETS
    : TICKETS.filter(t => t.stato === filter || (filter === 'Pronti' && t.stato === 'Pronto') || (filter === 'Consegnati' && t.stato === 'Consegnato'));

  return (
    <main className="main">
      <Topbar
        crumbs={['Interventi']}
        right={
          <>
            <Btn size="sm" icon="filter">Filtri</Btn>
            <Btn size="sm">Esporta</Btn>
            <Btn tone="primary" size="sm" icon="plus" onClick={() => navigate('/accettazione')}>
              Nuova accettazione
            </Btn>
          </>
        }
      />

      <div className="content">
        <div className="page-head">
          <div>
            <div className="page-title">Interventi</div>
            <div className="page-sub">142 totali · 49 attivi · 7 da chiamare per il ritiro</div>
          </div>
          <div className="row center" style={{ gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--hf-text-3)', marginRight: 4 }}>Vista:</span>
            <div
              style={{
                display: 'flex',
                background: 'var(--hf-surface)',
                border: '1px solid var(--hf-border)',
                borderRadius: 7,
                padding: 2,
              }}
            >
              {['Tabella', 'Kanban'].map(v => (
                <span
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: '4px 10px',
                    fontSize: 12,
                    fontWeight: 500,
                    borderRadius: 5,
                    cursor: 'pointer',
                    background: view === v ? 'var(--hf-surface-2)' : 'transparent',
                    color: view === v ? 'var(--hf-text)' : 'var(--hf-text-3)',
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* status filter bar */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {STATUS_FILTERS.map(({ label, count }) => (
            <Pill key={label} active={filter === label} onClick={() => setFilter(label)}>
              {label}
              <span
                style={{
                  marginLeft: 4,
                  fontSize: 11,
                  color: filter === label ? 'rgba(255,255,255,0.7)' : 'var(--hf-text-3)',
                }}
              >
                {count}
              </span>
            </Pill>
          ))}
          <div style={{ flex: 1 }} />
          <div className="search-box" style={{ minWidth: 240 }}>
            <Icon name="search" />
            <span style={{ color: 'var(--hf-text-3)', fontSize: 13 }}>Cerca n°, cliente, seriale…</span>
          </div>
        </div>

        {view === 'Tabella' ? (
          <TableView tickets={filtered} navigate={navigate} />
        ) : (
          <KanbanView tickets={filtered} navigate={navigate} />
        )}
      </div>
    </main>
  );
}

function TableView({ tickets, navigate }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ width: 30 }}><span className="check" /></th>
            <th>N°</th>
            <th>Cliente</th>
            <th>Dispositivo</th>
            <th>Difetto</th>
            <th>Stato</th>
            <th>Tecnico</th>
            <th>Aperto</th>
            <th style={{ textAlign: 'right' }}>Max €</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(r => (
            <tr key={r.id} onClick={() => navigate(`/interventi/${r.id}`)}>
              <td onClick={e => e.stopPropagation()}><span className="check" /></td>
              <td className="mono" style={{ color: 'var(--hf-text-3)' }}>#{r.id}</td>
              <td className="strong">{r.cliente}</td>
              <td style={{ color: 'var(--hf-text-2)' }}>{r.dispositivo}</td>
              <td style={{ color: 'var(--hf-text-3)', fontSize: 12, maxWidth: 180 }}>
                {r.difetto.substring(0, 50)}{r.difetto.length > 50 ? '…' : ''}
              </td>
              <td><Badge tone={r.statoTone}>{r.stato}</Badge></td>
              <td>
                <div className="row center" style={{ gap: 6 }}>
                  <Avatar name={r.tecnico} tone={r.tecnicoTone} size="sm" />
                  {r.tecnico}
                </div>
              </td>
              <td style={{ color: 'var(--hf-text-3)' }}>{r.aperto}</td>
              <td className="mono" style={{ textAlign: 'right' }}>€ {r.maxPreventivo}</td>
              <td className="mono" style={{ fontSize: 12, color: r.stato === 'Pronto' ? 'var(--hf-accent)' : 'var(--hf-text-3)' }}>
                {r.stato === 'Pronto' ? 'chiama!' : '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid var(--hf-border)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 12,
          color: 'var(--hf-text-3)',
        }}
      >
        <span>{tickets.length} di 49 mostrati</span>
        <div className="row center" style={{ gap: 4 }}>
          {['‹', '1', '2', '3', '4', '5', '›'].map((p, i) => (
            <Btn key={i} size="sm" tone={p === '2' ? 'primary' : ''}>{p}</Btn>
          ))}
        </div>
      </div>
    </div>
  );
}

const KANBAN_COLS = [
  { id: 'Accettazione', tone: 'gray' },
  { id: 'Diagnosi', tone: 'gray' },
  { id: 'Attesa pezzi', tone: 'amber' },
  { id: 'Attesa cliente', tone: 'blue' },
  { id: 'In lavorazione', tone: 'violet' },
  { id: 'Pronto', tone: 'green' },
  { id: 'Consegnato', tone: 'gray' },
  { id: 'Non riparabile', tone: 'red' },
];

function KanbanView({ tickets, navigate }) {
  return (
    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, minHeight: 0, flex: 1 }}>
      {KANBAN_COLS.map(col => {
        const cards = tickets.filter(t => t.stato === col.id);
        return (
          <div
            key={col.id}
            style={{
              minWidth: 200,
              flex: '0 0 200px',
              background: 'var(--hf-surface-2)',
              border: '1px solid var(--hf-border)',
              borderRadius: 10,
              padding: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
            }}
          >
            <div className="row between" style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{col.id}</span>
              <Badge tone={col.tone} dot={false}>{cards.length}</Badge>
            </div>
            {cards.map(t => (
              <div
                key={t.id}
                className="card compact"
                style={{ cursor: 'pointer', fontSize: 13, gap: 6 }}
                onClick={() => navigate(`/interventi/${t.id}`)}
              >
                <div className="row between">
                  <span className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>#{t.id}</span>
                  <span style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{t.aperto}</span>
                </div>
                <div style={{ fontWeight: 500 }}>{t.cliente}</div>
                <div style={{ fontSize: 12, color: 'var(--hf-text-2)' }}>{t.dispositivo}</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
