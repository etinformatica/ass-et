import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge } from './UI';
import { interventiApi, clientiApi, magazzinoApi } from '../lib/api';
import { STATO_TONE } from '../lib/stati';

// Ricerca globale: aperta da Ctrl/Cmd+K o cliccando la barra in alto.
// Cerca su interventi, clienti, magazzino. Click su un risultato → naviga.
export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [interventi, setInterventi] = useState([]);
  const [clienti, setClienti] = useState([]);
  const [magazzino, setMagazzino] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function onOpen() {
      setOpen(true);
      setQ('');
      setLoading(true);
      setTimeout(() => inputRef.current?.focus(), 30);
      try {
        const [i, c, m] = await Promise.all([
          interventiApi.list().catch(() => []),
          clientiApi.list().catch(() => []),
          magazzinoApi.list().catch(() => []),
        ]);
        setInterventi(i || []);
        setClienti(c || []);
        setMagazzino(m || []);
      } finally {
        setLoading(false);
      }
    }
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        window.dispatchEvent(new Event('open-global-search'));
      }
    }
    window.addEventListener('open-global-search', onOpen);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('open-global-search', onOpen);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  if (!open) return null;

  const s = q.trim().toLowerCase();
  const matchInt = !s ? [] : interventi.filter(t =>
    String(t.numero || '').toLowerCase().includes(s) ||
    (t.cliente?.nome || '').toLowerCase().includes(s) ||
    (t.dispositivo || '').toLowerCase().includes(s) ||
    (t.seriale || '').toLowerCase().includes(s)
  ).slice(0, 8);
  const matchCli = !s ? [] : clienti.filter(c =>
    (c.nome || '').toLowerCase().includes(s) ||
    (c.tel || '').toLowerCase().includes(s) ||
    (c.email || '').toLowerCase().includes(s)
  ).slice(0, 6);
  const matchMag = !s ? [] : magazzino.filter(a =>
    (a.nome || '').toLowerCase().includes(s) ||
    (a.sku || '').toLowerCase().includes(s)
  ).slice(0, 6);

  const totale = matchInt.length + matchCli.length + matchMag.length;

  function go(path) { setOpen(false); navigate(path); }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
  }

  return (
    <div
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 1000,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: '10vh 20px 20px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 640, background: 'var(--hf-surface)',
          border: '1px solid var(--hf-border)', borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)', overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 16px', borderBottom: '1px solid var(--hf-border)' }}>
          <span style={{ fontSize: 16, color: 'var(--hf-text-3)' }}>🔎</span>
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Cerca interventi, clienti, articoli…"
            autoComplete="off"
            className="no-uppercase"
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', font: 'inherit', fontSize: 15, color: 'var(--hf-text)' }}
          />
          <button type="button" onClick={() => setOpen(false)} title="Chiudi (Esc)"
            style={{ border: '1px solid var(--hf-border)', background: 'var(--hf-bg)', color: 'var(--hf-text-3)', borderRadius: 5, padding: '2px 7px', fontSize: 11, cursor: 'pointer' }}>
            Esc
          </button>
        </div>

        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
          {loading && <div style={{ padding: 20, textAlign: 'center', color: 'var(--hf-text-3)', fontSize: 13 }}>Carico…</div>}
          {!loading && !s && (
            <div style={{ padding: 20, color: 'var(--hf-text-3)', fontSize: 13, lineHeight: 1.6 }}>
              Digita per cercare in tutto il gestionale.<br />
              Risultati su <b>interventi</b> (n°, cliente, dispositivo, seriale), <b>clienti</b> (nome, telefono, email) e <b>magazzino</b> (nome, SKU).
            </div>
          )}
          {!loading && s && totale === 0 && (
            <div style={{ padding: 20, color: 'var(--hf-text-3)', fontSize: 13 }}>Nessun risultato per "{q}".</div>
          )}

          {matchInt.length > 0 && (
            <SectionHeader label={`Interventi (${matchInt.length})`} />
          )}
          {matchInt.map(t => (
            <Row key={`i-${t.id}`} onClick={() => go(`/interventi/${t.id}`)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0, flex: 1 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)', minWidth: 56 }}>#{t.numero}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.cliente?.nome || '—'}</div>
                  <div style={{ fontSize: 11, color: 'var(--hf-text-3)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.dispositivo}{t.seriale ? ` · ${t.seriale}` : ''}</div>
                </div>
              </div>
              <Badge tone={STATO_TONE[t.stato] || 'gray'}>{t.stato}</Badge>
            </Row>
          ))}

          {matchCli.length > 0 && <SectionHeader label={`Clienti (${matchCli.length})`} />}
          {matchCli.map(c => (
            <Row key={`c-${c.id}`} onClick={() => go(`/clienti?id=${c.id}`)}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{c.nome}</div>
                <div style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{[c.tel, c.email].filter(Boolean).join(' · ') || '—'}</div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{c.tipo}</span>
            </Row>
          ))}

          {matchMag.length > 0 && <SectionHeader label={`Magazzino (${matchMag.length})`} />}
          {matchMag.map(a => (
            <Row key={`m-${a.id}`} onClick={() => go('/magazzino')}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{a.nome}</div>
                <div style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{a.sku || 'senza SKU'} · stock {a.stock} · € {a.prezzo_vend}</div>
              </div>
              <Badge tone={a.stock < a.min_stock ? 'amber' : 'gray'}>{a.categoria}</Badge>
            </Row>
          ))}
        </div>

        <div style={{ padding: '8px 14px', borderTop: '1px solid var(--hf-border)', fontSize: 11, color: 'var(--hf-text-3)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Tip: apri con Ctrl/Cmd+K · chiudi con Esc</span>
          {s && <span>{totale} risultati</span>}
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ label }) {
  return (
    <div style={{ padding: '8px 14px', fontSize: 11, fontWeight: 600, color: 'var(--hf-text-3)', textTransform: 'uppercase', letterSpacing: 0.04, background: 'var(--hf-surface-2)', borderTop: '1px solid var(--hf-border)' }}>
      {label}
    </div>
  );
}

function Row({ children, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', borderTop: '1px solid var(--hf-border)' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'var(--hf-surface-2)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {children}
    </div>
  );
}
