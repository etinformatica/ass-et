import { useParams, useNavigate } from 'react-router-dom';
import { Btn } from '../components/UI';
import { Loading, ErrorState } from '../components/States';
import { useData } from '../lib/useData';
import { interventiApi } from '../lib/api';

// ─── DIMENSIONE ETICHETTA DYMO ──────────────────────────────
// Se la stampa non combacia con la tua etichetta, modifica questi
// due valori (in millimetri) e ripubblica. Misure Dymo comuni:
//   99012  →  89 x 36     (indirizzi grande)
//   11354  →  57 x 32     (multiuso)
//   11352  →  54 x 25     (resi / piccola)
const LABEL_W = 89; // larghezza in mm
const LABEL_H = 36; // altezza in mm
// ────────────────────────────────────────────────────────────

export default function StampaEtichetta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: t, loading, error, reload } = useData(() => interventiApi.get(id), [id]);

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex' }}><Loading /></div>;
  if (error) return <div className="content"><ErrorState error={error} onRetry={reload} /></div>;
  if (!t) return <div className="content">Intervento non trovato.</div>;

  const data = t.created_at ? new Date(t.created_at).toLocaleDateString('it-IT') : '';

  const PRINT_CSS = `
@media print {
  .no-print { display: none !important; }
  body { background: #fff !important; }
  @page { size: ${LABEL_W}mm ${LABEL_H}mm; margin: 0; }
  .etichetta { width: ${LABEL_W}mm !important; height: ${LABEL_H}mm !important; border: none !important; box-shadow: none !important; border-radius: 0 !important; }
}
`;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--hf-surface-2)', padding: 24 }}>
      <style>{PRINT_CSS}</style>

      <div className="no-print" style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
        <Btn onClick={() => navigate(`/interventi/${t.id}`)}>← Indietro</Btn>
        <Btn tone="primary" onClick={() => window.print()}>Stampa etichetta</Btn>
      </div>

      <div style={{ textAlign: 'center', marginBottom: 12 }} className="no-print">
        <span style={{ fontSize: 12, color: 'var(--hf-text-3)' }}>
          Formato impostato: {LABEL_W} × {LABEL_H} mm. Se non combacia, è regolabile nel codice ({'LABEL_W / LABEL_H'}).
        </span>
      </div>

      <div
        className="etichetta"
        style={{
          width: `${LABEL_W}mm`, height: `${LABEL_H}mm`, margin: '0 auto',
          background: '#fff', color: '#000', border: '1px solid var(--hf-border)',
          borderRadius: 4, boxSizing: 'border-box', padding: '2mm 3mm',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', overflow: 'hidden',
        }}
      >
        <div style={{ fontSize: '5mm', fontWeight: 800, lineHeight: 1 }}>#{t.numero}</div>
        <div style={{ fontSize: '3.4mm', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {t.cliente?.nome || '—'}
        </div>
        <div style={{ fontSize: '3mm', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {t.dispositivo || '—'}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '2.8mm', color: '#333' }}>
          <span>{data}</span>
          <span>{t.cliente?.tel || ''}</span>
        </div>
      </div>
    </div>
  );
}
