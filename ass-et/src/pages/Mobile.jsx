import { Badge, Avatar, Icon } from '../components/UI';
import { Loading, ErrorState } from '../components/States';
import { useData } from '../lib/useData';
import { interventiApi } from '../lib/api';

export default function Mobile() {
  const { data, loading, error, reload } = useData(() => interventiApi.list(), []);

  return (
    <main className="main">
      <div className="content" style={{ background: 'var(--hf-surface-2)', overflowX: 'auto' }}>
        {loading && <Loading />}
        {error && <ErrorState error={error} onRetry={reload} />}
        {!loading && !error && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, minHeight: '100%', padding: '20px 0' }}>
            <PhoneLista interventi={data || []} />
            <PhoneDettaglio intervento={(data || []).find(i => i.stato === 'Attesa pezzi') || (data || [])[0]} />
            <PhoneScanner interventi={data || []} />
          </div>
        )}
      </div>
    </main>
  );
}

function Phone({ children }) {
  return (
    <div className="phone-frame">
      <div className="phone-screen">
        <div className="phone-notch" />
        <div className="phone-status"><span>9:42</span><span>5G · 87%</span></div>
        {children}
      </div>
    </div>
  );
}

function PhoneLista({ interventi }) {
  const miei = interventi.filter(i => !['Consegnato', 'Non riparabile'].includes(i.stato)).slice(0, 6);
  return (
    <Phone>
      <div className="phone-body" style={{ paddingTop: 4 }}>
        <div className="row between" style={{ alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase', letterSpacing: 0.04, fontWeight: 500 }}>Ciao Luca</div>
            <div style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.1 }}>I miei interventi</div>
          </div>
          <Avatar name="Luca M" tone="green" size="md" />
        </div>
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {[`Tutti ${miei.length}`, 'Lab', 'Attesa', 'Pronti'].map((f, i) => (
            <span key={f} className={`pill ${i === 0 ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>{f}</span>
          ))}
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
          {miei.map(t => (
            <div key={t.id} className="card compact" style={{ fontSize: 13 }}>
              <div className="row between" style={{ marginBottom: 4 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>#{t.numero}</span>
                <Badge tone={t.stato_tone}>{t.stato}</Badge>
              </div>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{t.cliente?.nome || '—'}</div>
              <div style={{ fontSize: 12, color: 'var(--hf-text-2)' }}>{t.dispositivo}</div>
              <div style={{ fontSize: 11, color: 'var(--hf-text-3)', fontStyle: 'italic', marginTop: 2 }}>
                "{(t.difetto || '').substring(0, 40)}"
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="phone-nav">
        {[['home', 'Home'], ['list', 'Lavori'], ['box', 'Magaz.'], ['camera', 'Scan']].map(([ico, lbl], i) => (
          <div key={ico} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '0 8px' }}>
            <Icon name={ico} style={{ color: i === 1 ? 'var(--hf-text)' : 'var(--hf-text-3)' }} />
            <span style={{ fontSize: 10, color: i === 1 ? 'var(--hf-text)' : 'var(--hf-text-3)', fontWeight: i === 1 ? 600 : 400 }}>{lbl}</span>
          </div>
        ))}
      </div>
    </Phone>
  );
}

function PhoneDettaglio({ intervento }) {
  if (!intervento) return <Phone><div className="phone-body" style={{ alignItems: 'center', justifyContent: 'center', color: 'var(--hf-text-3)' }}>Nessun intervento</div></Phone>;
  const t = intervento;
  return (
    <Phone>
      <div className="phone-body" style={{ paddingTop: 4 }}>
        <div className="row center" style={{ gap: 8 }}>
          <span style={{ fontSize: 18, color: 'var(--hf-text-2)' }}>‹</span>
          <div style={{ flex: 1 }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>INTERVENTO</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>#{t.numero} · {t.cliente?.nome || '—'}</div>
          </div>
          <Badge tone={t.stato_tone}>{t.stato}</Badge>
        </div>
        <div className="card compact">
          <div style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase' }}>DISPOSITIVO</div>
          <div style={{ fontWeight: 500, fontSize: 14, marginTop: 2 }}>{t.dispositivo}</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{t.seriale || '—'}</div>
        </div>
        <div className="card compact">
          <div style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase', marginBottom: 4 }}>DIFETTO</div>
          <div style={{ fontSize: 13, color: 'var(--hf-text-2)' }}>{t.difetto || '—'}</div>
        </div>
        {(t.pezzi || []).length > 0 && (
          <div className="card compact" style={{ background: 'var(--hf-amber-soft)', borderColor: 'var(--hf-amber)' }}>
            <div className="row between">
              <span style={{ fontWeight: 500, fontSize: 13 }}>{t.pezzi[0].nome}</span>
              <span className="mono strong" style={{ fontSize: 13 }}>€ {t.pezzi[0].costo_acq}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{t.pezzi[0].stato}</div>
          </div>
        )}
        <div className="card compact">
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Cambia stato</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {['Diagnosi', 'Attesa pezzi', 'In lavoraz.', 'Pronto'].map(s => (
              <span key={s} className={`pill ${t.stato.startsWith(s.split(' ')[0]) ? 'active' : ''}`}>{s}</span>
            ))}
          </div>
        </div>
        <div style={{ flex: 1 }} />
        <div className="row center" style={{ gap: 6 }}>
          <button className="btn" style={{ flex: 1, justifyContent: 'center' }}>📞 Cliente</button>
          <button className="btn primary" style={{ flex: 1, justifyContent: 'center' }}>✉ SMS</button>
        </div>
      </div>
    </Phone>
  );
}

function PhoneScanner({ interventi }) {
  return (
    <Phone>
      <div className="phone-body" style={{ paddingTop: 4 }}>
        <div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase', letterSpacing: 0.04 }}>Scansiona</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>Trova intervento</div>
        </div>
        <div style={{ flex: 1, background: '#1a1816', borderRadius: 14, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
          <div style={{ position: 'absolute', inset: '18% 14%', border: '2.5px solid var(--hf-accent)', borderRadius: 10 }}>
            {[
              { top: -12, left: -12, borderTop: '3px solid var(--hf-accent)', borderLeft: '3px solid var(--hf-accent)' },
              { top: -12, right: -12, borderTop: '3px solid var(--hf-accent)', borderRight: '3px solid var(--hf-accent)' },
              { bottom: -12, left: -12, borderBottom: '3px solid var(--hf-accent)', borderLeft: '3px solid var(--hf-accent)' },
              { bottom: -12, right: -12, borderBottom: '3px solid var(--hf-accent)', borderRight: '3px solid var(--hf-accent)' },
            ].map((st, i) => <span key={i} style={{ position: 'absolute', width: 18, height: 18, ...st }} />)}
          </div>
          <div style={{ position: 'absolute', left: '14%', right: '14%', top: '50%', height: 2, background: 'var(--hf-accent)', boxShadow: '0 0 16px var(--hf-accent)' }} />
          <div style={{ position: 'absolute', bottom: 18, left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 13 }}>Inquadra il QR della bolla</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['QR / barcode', 'NFC tag', 'Seriale'].map((m, i) => <span key={m} className={`pill ${i === 0 ? 'active' : ''}`}>{m}</span>)}
        </div>
        <div className="card compact">
          <div style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase', letterSpacing: 0.04, marginBottom: 6 }}>RECENTI</div>
          <div className="col" style={{ gap: 6, fontSize: 12 }}>
            {interventi.slice(0, 3).map(t => (
              <div key={t.id} className="row between">
                <span><b>#{t.numero}</b> {t.cliente?.nome || '—'}</span>
                <span className="mono" style={{ color: 'var(--hf-text-3)' }}>{t.stato}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
}
