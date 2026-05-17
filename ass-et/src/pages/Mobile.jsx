import { Badge, Avatar, Icon } from '../components/UI';

export default function Mobile() {
  return (
    <main className="main">
      <div className="content" style={{ background: 'var(--hf-surface-2)', overflowX: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24, minHeight: '100%', padding: '20px 0' }}>
          <PhoneLista />
          <PhoneDettaglio />
          <PhoneScanner />
        </div>
      </div>
    </main>
  );
}

function Phone({ title, children }) {
  return (
    <div className="phone-frame">
      <div className="phone-screen">
        <div className="phone-notch" />
        <div className="phone-status">
          <span>9:42</span>
          <span>5G · 87%</span>
        </div>
        {children}
      </div>
    </div>
  );
}

const MY_TICKETS = [
  { id: '#2411', nome: 'Bianchi M.', dev: 'HP Pavilion 15', prob: 'non si avvia', stato: 'Accettazione', tone: 'gray', eta: 'oggi' },
  { id: '#2410', nome: 'Rossi G.', dev: 'MacBook Air M1', prob: 'tastiera bagnata', stato: 'Attesa pezzi', tone: 'amber', eta: '3gg' },
  { id: '#2409', nome: 'Verdi srl', dev: 'Dell OptiPlex', prob: 'virus, lento', stato: 'In lavorazione', tone: 'violet', eta: '3gg' },
  { id: '#2405', nome: 'Romano L.', dev: 'Asus ROG', prob: 'overheat gaming', stato: 'In lavorazione', tone: 'violet', eta: '6gg' },
  { id: '#2408', nome: 'Esposito A.', dev: 'iPhone 12', prob: 'vetro', stato: 'Pronto', tone: 'green', eta: '4gg' },
];

function PhoneLista() {
  return (
    <Phone title="Lista interventi">
      <div className="phone-body" style={{ paddingTop: 4 }}>
        <div className="row between" style={{ alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase', letterSpacing: 0.04, fontWeight: 500 }}>Ciao Luca</div>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.1 }}>I miei interventi</div>
          </div>
          <Avatar name="Luca M" tone="green" size="md" />
        </div>

        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {['Tutti 5', 'Lab 2', 'Attesa 2', 'Pronti 1'].map((f, i) => (
            <span key={f} className={`pill ${i === 0 ? 'active' : ''}`} style={{ whiteSpace: 'nowrap' }}>{f}</span>
          ))}
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto' }}>
          {MY_TICKETS.map(t => (
            <div key={t.id} className="card compact" style={{ fontSize: 13 }}>
              <div className="row between" style={{ marginBottom: 4 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{t.id} · {t.eta}</span>
                <Badge tone={t.tone}>{t.stato}</Badge>
              </div>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{t.nome}</div>
              <div style={{ fontSize: 12, color: 'var(--hf-text-2)' }}>{t.dev}</div>
              <div style={{ fontSize: 11, color: 'var(--hf-text-3)', fontStyle: 'italic', marginTop: 2 }}>"{t.prob}"</div>
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

function PhoneDettaglio() {
  return (
    <Phone title="Dettaglio intervento">
      <div className="phone-body" style={{ paddingTop: 4 }}>
        <div className="row center" style={{ gap: 8 }}>
          <span style={{ fontSize: 18, color: 'var(--hf-text-2)' }}>‹</span>
          <div style={{ flex: 1 }}>
            <div className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>INTERVENTO</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>#2410 · Rossi G.</div>
          </div>
          <Badge tone="amber">Attesa pezzi</Badge>
        </div>

        <div className="card compact">
          <div style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase' }}>DISPOSITIVO</div>
          <div style={{ fontWeight: 500, fontSize: 14, marginTop: 2 }}>MacBook Air M1 · 2021</div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>C02G3QH4Q6L4</div>
        </div>

        <div className="card compact" style={{ background: 'var(--hf-amber-soft)', borderColor: 'var(--hf-amber)' }}>
          <div className="row between">
            <span style={{ fontWeight: 500, fontSize: 13 }}>Tastiera MBA M1 IT</span>
            <span className="mono strong" style={{ fontSize: 13 }}>€ 89</span>
          </div>
          <div style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>ordinata 14/05 · RAMItalia · atteso 18/05</div>
        </div>

        <div className="card compact">
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>Cambia stato</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {['Diagnosi', 'Attesa pezzi', 'In lavoraz.', 'Pronto'].map((s, i) => (
              <span key={s} className={`pill ${i === 1 ? 'active' : ''}`}>{s}</span>
            ))}
          </div>
        </div>

        <div className="card compact">
          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6 }}>+ Nota del tecnico</div>
          <div
            style={{
              height: 50, border: '1.5px dashed var(--hf-border-2)', borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, color: 'var(--hf-text-3)',
            }}
          >
            Tocca per scrivere o 🎙 dettare
          </div>
          <div className="row center" style={{ gap: 6, marginTop: 8 }}>
            <button className="btn sm" style={{ flex: 1, justifyContent: 'center' }}>
              <Icon name="camera" />Foto
            </button>
            <button className="btn sm" style={{ flex: 1, justifyContent: 'center' }}>
              <Icon name="plus" />Pezzo
            </button>
          </div>
        </div>

        <div style={{ flex: 1 }} />
        <div className="row center" style={{ gap: 6 }}>
          <button className="btn" style={{ flex: 1, justifyContent: 'center' }}>📞 Cliente</button>
          <button className="btn primary" style={{ flex: 1, justifyContent: 'center' }}>✉ SMS aggiorna</button>
        </div>
      </div>
    </Phone>
  );
}

function PhoneScanner() {
  return (
    <Phone title="Scanner QR">
      <div className="phone-body" style={{ paddingTop: 4 }}>
        <div>
          <div className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase', letterSpacing: 0.04 }}>Scansiona</div>
          <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.01em' }}>Trova intervento</div>
        </div>

        {/* scanner viewfinder */}
        <div style={{ flex: 1, background: '#1a1816', borderRadius: 14, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 240 }}>
          {/* frame */}
          <div style={{ position: 'absolute', inset: '18% 14%', border: '2.5px solid var(--hf-accent)', borderRadius: 10, pointerEvents: 'none' }}>
            {/* corners */}
            {[['top:-12px;left:-12px', 'Top Left'], ['top:-12px;right:-12px', 'Top Right'], ['bottom:-12px;left:-12px', 'Bot Left'], ['bottom:-12px;right:-12px', 'Bot Right']].map((_, i) => {
              const styles = [
                { top: -12, left: -12, borderTop: '3px solid var(--hf-accent)', borderLeft: '3px solid var(--hf-accent)' },
                { top: -12, right: -12, borderTop: '3px solid var(--hf-accent)', borderRight: '3px solid var(--hf-accent)' },
                { bottom: -12, left: -12, borderBottom: '3px solid var(--hf-accent)', borderLeft: '3px solid var(--hf-accent)' },
                { bottom: -12, right: -12, borderBottom: '3px solid var(--hf-accent)', borderRight: '3px solid var(--hf-accent)' },
              ];
              return <span key={i} style={{ position: 'absolute', width: 18, height: 18, ...styles[i] }} />;
            })}
          </div>
          {/* scan beam */}
          <div style={{ position: 'absolute', left: '14%', right: '14%', top: '50%', height: 2, background: 'var(--hf-accent)', boxShadow: '0 0 16px var(--hf-accent)' }} />
          <div style={{ position: 'absolute', bottom: 18, left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 13 }}>
            Inquadra il QR della bolla
          </div>
        </div>

        <div style={{ display: 'flex', gap: 6 }}>
          {['QR / barcode', 'NFC tag', 'Seriale'].map((m, i) => (
            <span key={m} className={`pill ${i === 0 ? 'active' : ''}`}>{m}</span>
          ))}
        </div>

        <div className="card compact">
          <div style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase', letterSpacing: 0.04, marginBottom: 6 }}>RECENTI</div>
          <div className="col" style={{ gap: 6, fontSize: 12 }}>
            {[['#2410', 'Rossi G.', '2 min'], ['#2409', 'Verdi srl', '15 min'], ['#2405', 'Romano L.', '1h']].map(([n, c, t]) => (
              <div key={n} className="row between">
                <span><b>{n}</b> {c}</span>
                <span className="mono" style={{ color: 'var(--hf-text-3)' }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Phone>
  );
}
