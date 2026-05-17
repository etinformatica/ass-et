import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Btn, Avatar, Topbar, Icon, Pill } from '../components/UI';
import { Loading, ErrorState, EmptyState } from '../components/States';
import { ConfirmDialog } from '../components/Modal';
import { useData } from '../lib/useData';
import { interventiApi } from '../lib/api';

const FILTERS = ['Tutti', 'Accettazione', 'Diagnosi', 'Attesa pezzi', 'Attesa cliente', 'In lavorazione', 'Pronto', 'Consegnato', 'Non riparabile'];

export default function Interventi() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useData(() => interventiApi.list(), []);
  const [filter, setFilter] = useState('Tutti');
  const [view, setView] = useState('Tabella');
  const [q, setQ] = useState('');
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const list = data || [];
  const filtered = list
    .filter(t => filter === 'Tutti' || t.stato === filter)
    .filter(t => {
      if (!q.trim()) return true;
      const s = q.toLowerCase();
      return (
        String(t.numero).includes(s) ||
        (t.cliente?.nome || '').toLowerCase().includes(s) ||
        (t.dispositivo || '').toLowerCase().includes(s) ||
        (t.seriale || '').toLowerCase().includes(s)
      );
    });

  async function doDelete() {
    setBusy(true);
    try {
      await interventiApi.remove(toDelete.id);
      setToDelete(null);
      reload();
    } catch (e) {
      alert('Errore: ' + e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="main">
      <Topbar
        crumbs={['Interventi']}
        right={
          <>
            <Btn size="sm" icon="filter">Filtri</Btn>
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
            <div className="page-sub">
              {list.length} totali · {list.filter(t => !['Consegnato', 'Non riparabile'].includes(t.stato)).length} attivi
            </div>
          </div>
          <div className="row center" style={{ gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--hf-text-3)', marginRight: 4 }}>Vista:</span>
            <div style={{ display: 'flex', background: 'var(--hf-surface)', border: '1px solid var(--hf-border)', borderRadius: 7, padding: 2 }}>
              {['Tabella', 'Kanban'].map(v => (
                <span
                  key={v}
                  onClick={() => setView(v)}
                  style={{
                    padding: '4px 10px', fontSize: 12, fontWeight: 500, borderRadius: 5, cursor: 'pointer',
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

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {FILTERS.map(f => {
            const count = f === 'Tutti' ? list.length : list.filter(t => t.stato === f).length;
            return (
              <Pill key={f} active={filter === f} onClick={() => setFilter(f)}>
                {f}<span style={{ marginLeft: 4, fontSize: 11, color: filter === f ? 'rgba(255,255,255,0.7)' : 'var(--hf-text-3)' }}>{count}</span>
              </Pill>
            );
          })}
          <div style={{ flex: 1 }} />
          <div className="search-box" style={{ minWidth: 240 }}>
            <Icon name="search" />
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Cerca n°, cliente, seriale…"
              style={{ border: 'none', background: 'transparent', outline: 'none', font: 'inherit', fontSize: 13, color: 'var(--hf-text)', width: '100%' }}
            />
          </div>
        </div>

        {loading && <Loading />}
        {error && <ErrorState error={error} onRetry={reload} />}
        {!loading && !error && (
          filtered.length === 0 ? (
            <div className="card"><EmptyState title="Nessun intervento" sub="Crea la prima accettazione." action={<Btn tone="primary" icon="plus" onClick={() => navigate('/accettazione')}>Nuova accettazione</Btn>} /></div>
          ) : view === 'Tabella' ? (
            <TableView tickets={filtered} navigate={navigate} onDelete={setToDelete} total={list.length} />
          ) : (
            <KanbanView tickets={filtered} navigate={navigate} />
          )
        )}
      </div>

      {toDelete && (
        <ConfirmDialog
          message={`Eliminare l'intervento #${toDelete.numero} di ${toDelete.cliente?.nome || '—'}? L'operazione è irreversibile.`}
          onConfirm={doDelete}
          onClose={() => setToDelete(null)}
          busy={busy}
        />
      )}
    </main>
  );
}

function TableView({ tickets, navigate, onDelete, total }) {
  return (
    <div className="table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            <th>N°</th><th>Cliente</th><th>Dispositivo</th><th>Difetto</th>
            <th>Stato</th><th>Tecnico</th><th>Aperto</th><th style={{ textAlign: 'right' }}>Max €</th><th></th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(r => (
            <tr key={r.id} onClick={() => navigate(`/interventi/${r.id}`)}>
              <td className="mono" style={{ color: 'var(--hf-text-3)' }}>#{r.numero}</td>
              <td className="strong">{r.cliente?.nome || '—'}</td>
              <td style={{ color: 'var(--hf-text-2)' }}>{r.dispositivo}</td>
              <td style={{ color: 'var(--hf-text-3)', fontSize: 12, maxWidth: 180 }}>
                {(r.difetto || '').substring(0, 48)}{(r.difetto || '').length > 48 ? '…' : ''}
              </td>
              <td><Badge tone={r.stato_tone}>{r.stato}</Badge></td>
              <td>
                {r.tecnico ? (
                  <div className="row center" style={{ gap: 6 }}>
                    <Avatar name={r.tecnico.nome} tone={r.tecnico.tone} size="sm" />{r.tecnico.nome}
                  </div>
                ) : <span style={{ color: 'var(--hf-text-4)' }}>—</span>}
              </td>
              <td style={{ color: 'var(--hf-text-3)' }}>{new Date(r.created_at).toLocaleDateString('it-IT')}</td>
              <td className="mono" style={{ textAlign: 'right' }}>€ {r.max_preventivo}</td>
              <td onClick={e => e.stopPropagation()}>
                <button className="btn ghost sm" title="Elimina" onClick={() => onDelete(r)} style={{ padding: 4 }}>
                  <Icon name="trash" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ padding: '10px 16px', borderTop: '1px solid var(--hf-border)', fontSize: 12, color: 'var(--hf-text-3)' }}>
        {tickets.length} di {total} interventi
      </div>
    </div>
  );
}

const KANBAN_COLS = [
  { id: 'Accettazione', tone: 'gray' }, { id: 'Diagnosi', tone: 'gray' },
  { id: 'Attesa pezzi', tone: 'amber' }, { id: 'Attesa cliente', tone: 'blue' },
  { id: 'In lavorazione', tone: 'violet' }, { id: 'Pronto', tone: 'green' },
  { id: 'Consegnato', tone: 'gray' }, { id: 'Non riparabile', tone: 'red' },
];

function KanbanView({ tickets, navigate }) {
  return (
    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 8, flex: 1, minHeight: 0 }}>
      {KANBAN_COLS.map(col => {
        const cards = tickets.filter(t => t.stato === col.id);
        return (
          <div key={col.id} style={{ minWidth: 210, flex: '0 0 210px', background: 'var(--hf-surface-2)', border: '1px solid var(--hf-border)', borderRadius: 10, padding: 10, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div className="row between" style={{ marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600 }}>{col.id}</span>
              <Badge tone={col.tone} dot={false}>{cards.length}</Badge>
            </div>
            {cards.map(t => (
              <div key={t.id} className="card compact" style={{ cursor: 'pointer', fontSize: 13, gap: 6 }} onClick={() => navigate(`/interventi/${t.id}`)}>
                <div className="row between">
                  <span className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>#{t.numero}</span>
                  <span style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{new Date(t.created_at).toLocaleDateString('it-IT')}</span>
                </div>
                <div style={{ fontWeight: 500 }}>{t.cliente?.nome || '—'}</div>
                <div style={{ fontSize: 12, color: 'var(--hf-text-2)' }}>{t.dispositivo}</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
