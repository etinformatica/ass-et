import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Badge, Btn, Avatar, Topbar, Icon, Pill } from '../components/UI';
import { Loading, ErrorState, EmptyState } from '../components/States';
import { ConfirmDialog } from '../components/Modal';
import { useData } from '../lib/useData';
import { interventiApi } from '../lib/api';
import { STATI, STATO_TONE } from '../lib/stati';

const FILTERS = ['Tutti', ...STATI.map(s => s.stato)];

export default function Interventi() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialFilter = searchParams.get('stato') && FILTERS.includes(searchParams.get('stato'))
    ? searchParams.get('stato') : 'Tutti';
  const { data, loading, error, reload } = useData(() => interventiApi.list(), []);
  const [filter, setFilter] = useState(initialFilter);
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

  async function changeStato(id, stato) {
    try {
      await interventiApi.update(id, { stato, stato_tone: STATO_TONE[stato] || 'gray' });
      reload();
    } catch (e) { alert('Errore: ' + e.message); }
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
            <TableView tickets={filtered} navigate={navigate} onDelete={setToDelete} onStato={changeStato} total={list.length} />
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

function StatoCell({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const tone = STATO_TONE[value] || 'gray';

  function handleClick(e) {
    e.stopPropagation();
    if (!open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      const popW = 180;
      const left = Math.max(8, Math.min(r.left, window.innerWidth - popW - 8));
      setPos({ top: r.bottom + 4, left });
    }
    setOpen(o => !o);
  }

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        className={`badge ${tone}`}
        onClick={handleClick}
        title="Clicca per cambiare stato"
        style={{ position: 'relative', border: '1px solid transparent', cursor: 'pointer', padding: '3px 22px 3px 10px', font: 'inherit', fontSize: 11, fontWeight: 500 }}
      >
        {value}
        <span style={{ position: 'absolute', right: 7, top: '50%', transform: 'translateY(-50%)', fontSize: 9, opacity: 0.7 }}>▼</span>
      </button>
      {open && (
        <>
          <div onClick={e => { e.stopPropagation(); setOpen(false); }} style={{ position: 'fixed', inset: 0, zIndex: 900 }} />
          <div
            onClick={e => e.stopPropagation()}
            style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 901,
              background: 'var(--hf-surface)', border: '1px solid var(--hf-border)', borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.18)', padding: 6, minWidth: 180 }}
          >
            {STATI.map(s => (
              <button
                key={s.stato}
                type="button"
                onClick={() => { onChange(s.stato); setOpen(false); }}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '6px 6px',
                  background: s.stato === value ? 'var(--hf-surface-2)' : 'transparent',
                  border: 'none', borderRadius: 5, cursor: 'pointer' }}
              >
                <Badge tone={s.tone}>{s.stato}</Badge>
              </button>
            ))}
          </div>
        </>
      )}
    </>
  );
}

function TableView({ tickets, navigate, onDelete, onStato, total }) {
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
              <td>
                <StatoCell value={r.stato} onChange={s => onStato(r.id, s)} />
                {r.ubicazione === 'DAL CLIENTE' && (
                  <span className="badge amber" title="Dispositivo presso il cliente" style={{ marginLeft: 6, padding: '2px 6px' }}>🏠 dal cliente</span>
                )}
              </td>
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

const KANBAN_COLS = STATI.map(s => ({ id: s.stato, tone: s.tone }));

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
