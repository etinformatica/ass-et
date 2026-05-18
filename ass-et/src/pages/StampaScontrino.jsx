import { useParams, useNavigate } from 'react-router-dom';
import { Btn } from '../components/UI';
import { Loading, ErrorState } from '../components/States';
import { useData } from '../lib/useData';
import { useImpostazioni } from '../lib/useImpostazioni';
import { interventiApi } from '../lib/api';

const PRINT_CSS = `
@media print {
  .no-print { display: none !important; }
  body { background: #fff !important; }
  @page { size: 80mm auto; margin: 3mm; }
  .scontrino { width: auto !important; border: none !important; box-shadow: none !important; padding: 0 !important; }
}
`;

export default function StampaScontrino() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: t, loading, error, reload } = useData(() => interventiApi.get(id), [id]);
  const { tecnicoNome, tecnicoRuolo } = useImpostazioni();

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex' }}><Loading /></div>;
  if (error) return <div className="content"><ErrorState error={error} onRetry={reload} /></div>;
  if (!t) return <div className="content">Intervento non trovato.</div>;

  const data = t.created_at ? new Date(t.created_at).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—';
  const riga = { display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 2 };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--hf-surface-2)', padding: 24 }}>
      <style>{PRINT_CSS}</style>

      <div className="no-print" style={{ display: 'flex', gap: 8, marginBottom: 16, justifyContent: 'center' }}>
        <Btn onClick={() => navigate(`/interventi/${t.id}`)}>← Indietro</Btn>
        <Btn tone="primary" onClick={() => window.print()}>Stampa scontrino</Btn>
      </div>

      <div
        className="scontrino"
        style={{
          width: 300, margin: '0 auto', background: '#fff', color: '#000',
          border: '1px solid var(--hf-border)', borderRadius: 6, padding: 16,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 12, lineHeight: 1.5,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>CENTRO ASSISTENZA</div>
          <div>{tecnicoNome} · {tecnicoRuolo}</div>
        </div>
        <div style={{ borderTop: '1px dashed #000', borderBottom: '1px dashed #000', padding: '6px 0', textAlign: 'center', fontWeight: 700, marginBottom: 8 }}>
          RICEVUTA DI ACCETTAZIONE
        </div>

        <div style={riga}><span>Intervento</span><span><b>#{t.numero}</b></span></div>
        <div style={riga}><span>Data</span><span>{data}</span></div>

        <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />
        <div style={{ fontWeight: 700, marginBottom: 2 }}>CLIENTE</div>
        <div>{t.cliente?.nome || '—'}</div>
        <div>Tel: {t.cliente?.tel || '—'}</div>

        <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />
        <div style={{ fontWeight: 700, marginBottom: 2 }}>DISPOSITIVO</div>
        <div>{t.dispositivo || '—'}</div>
        {(t.marca || t.modello) && <div>{[t.marca, t.modello].filter(Boolean).join(' ')}</div>}
        <div>S/N: {t.seriale || '—'}</div>

        <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />
        <div style={{ fontWeight: 700, marginBottom: 2 }}>DIFETTO DICHIARATO</div>
        <div>{t.difetto || '—'}</div>

        <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />
        <div style={riga}><span>Accessori</span><span>{t.accessori || '—'}</span></div>
        <div style={riga}><span>Stato estetico</span><span>{t.stato_estetico || '—'}</span></div>
        <div style={riga}><span>Max autorizzato</span><span><b>€ {t.max_preventivo || 0}</b></span></div>

        <div style={{ borderTop: '1px dashed #000', margin: '8px 0' }} />
        <div style={{ fontSize: 10, marginBottom: 18 }}>
          Il cliente autorizza la lavorazione fino all'importo massimo indicato.
          La merce non ritirata entro 90 giorni potrà essere smaltita.
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ flex: 1, borderTop: '1px solid #000', paddingTop: 2, textAlign: 'center', fontSize: 10 }}>Data</div>
          <div style={{ flex: 1.4, borderTop: '1px solid #000', paddingTop: 2, textAlign: 'center', fontSize: 10 }}>Firma cliente</div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 12, fontSize: 10 }}>Grazie — conservi questa ricevuta</div>
      </div>
    </div>
  );
}
