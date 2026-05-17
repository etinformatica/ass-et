import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Btn, Avatar, Topbar, Icon } from '../components/UI';

const DEVICE_TYPES = ['PC fisso', 'Notebook', 'Smartphone', 'Tablet', 'Stampante', 'Altro'];

export default function Accettazione() {
  const navigate = useNavigate();
  const [deviceType, setDeviceType] = useState('Notebook');
  const [priorita, setPriorita] = useState('Normale');
  const [clienteMode, setClienteMode] = useState('Esistente');

  return (
    <main className="main">
      <Topbar
        crumbs={['Interventi', 'Nuova accettazione']}
        right={
          <>
            <Btn size="sm" onClick={() => navigate('/interventi')}>Annulla</Btn>
            <Btn size="sm">Salva bozza</Btn>
            <Btn size="sm" tone="primary">Conferma e stampa bolla</Btn>
          </>
        }
      />

      <div className="content">
        <div className="page-head">
          <div>
            <div className="page-title">Nuova accettazione</div>
            <div className="page-sub">Numero #2412 sarà assegnato al salvataggio · Operatore: Marco T.</div>
          </div>
          <Badge tone="gray" dot={false}>Bozza</Badge>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
          <div className="col" style={{ gap: 16 }}>
            {/* step 1 — cliente */}
            <div className="card">
              <div className="row between" style={{ marginBottom: 14 }}>
                <div className="row center" style={{ gap: 8 }}>
                  <StepDot n={1} />
                  <span style={{ fontWeight: 600, fontSize: 15 }}>Cliente</span>
                </div>
                <div className="row center" style={{ gap: 6 }}>
                  {['Esistente', 'Nuovo', 'Azienda'].map(m => (
                    <span key={m} className={`pill ${clienteMode === m ? 'active' : ''}`} onClick={() => setClienteMode(m)}>{m}</span>
                  ))}
                </div>
              </div>

              {clienteMode === 'Esistente' && (
                <div
                  className="row center"
                  style={{
                    gap: 10, padding: '10px 12px',
                    background: 'var(--hf-accent-soft)', borderRadius: 8, marginBottom: 14,
                  }}
                >
                  <Avatar name="Bianchi Mario" tone="accent" size="md" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>Bianchi Mario</div>
                    <div style={{ fontSize: 12, color: 'var(--hf-text-3)' }}>
                      349 12 34 567 · m.bianchi@gmail.com · 3 interventi · cliente dal 2023
                    </div>
                  </div>
                  <Btn size="sm">Cambia</Btn>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <label className="field-label">Codice fiscale</label>
                  <div className="input mono" style={{ color: 'var(--hf-text-2)' }}>
                    {clienteMode === 'Esistente' ? 'BNCMRA70R12A944J' : ''}
                  </div>
                </div>
                <div>
                  <label className="field-label">Telefono</label>
                  <div className="input mono">{clienteMode === 'Esistente' ? '349 12 34 567' : ''}</div>
                </div>
                <div>
                  <label className="field-label">Email</label>
                  <div className="input">{clienteMode === 'Esistente' ? 'm.bianchi@gmail.com' : ''}</div>
                </div>
              </div>
            </div>

            {/* step 2 — dispositivo */}
            <div className="card">
              <div className="row center" style={{ gap: 8, marginBottom: 14 }}>
                <StepDot n={2} />
                <span style={{ fontWeight: 600, fontSize: 15 }}>Dispositivo</span>
              </div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                {DEVICE_TYPES.map(t => (
                  <span key={t} className={`pill ${deviceType === t ? 'active' : ''}`} onClick={() => setDeviceType(t)}>{t}</span>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr', gap: 10, marginBottom: 10 }}>
                <div>
                  <label className="field-label">Marca</label>
                  <input className="input" placeholder="HP" />
                </div>
                <div>
                  <label className="field-label">Modello</label>
                  <input className="input" placeholder="es. Pavilion 15-ec0035nl" />
                </div>
                <div>
                  <label className="field-label">Seriale / IMEI</label>
                  <input className="input mono" placeholder="seriale" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', gap: 10 }}>
                <div>
                  <label className="field-label">Accessori consegnati</label>
                  <input className="input" placeholder="es. alimentatore, borsa, mouse" />
                </div>
                <div>
                  <label className="field-label">Stato estetico</label>
                  <input className="input" placeholder="es. Buono — graffi su coperchio" />
                </div>
                <div>
                  <label className="field-label">Password</label>
                  <input className="input" type="password" placeholder="••••••••" />
                </div>
              </div>
            </div>

            {/* step 3 — difetto */}
            <div className="card">
              <div className="row center" style={{ gap: 8, marginBottom: 14 }}>
                <StepDot n={3} />
                <span style={{ fontWeight: 600, fontSize: 15 }}>Difetto dichiarato</span>
              </div>
              <textarea
                className="input"
                rows={4}
                placeholder="Descrivi il difetto dichiarato dal cliente…"
                style={{ resize: 'vertical', lineHeight: 1.5 }}
              />
              <div className="row center" style={{ gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase', letterSpacing: 0.04 }}>
                  Sintomi rapidi:
                </span>
                {['non si accende', 'schermo rotto', 'non carica', 'virus/lento', 'tastiera', 'caduta/danno'].map(s => (
                  <Badge key={s} tone="gray">{s}</Badge>
                ))}
                <Badge tone="accent">+ altro</Badge>
              </div>
            </div>
          </div>

          {/* right column */}
          <div className="col" style={{ gap: 16 }}>
            {/* lavorazione */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 12 }}>Lavorazione</div>
              <div className="col" style={{ gap: 10 }}>
                <div>
                  <label className="field-label">Priorità</label>
                  <div className="row center" style={{ gap: 6 }}>
                    {['Bassa', 'Normale', 'Urgente'].map(p => (
                      <span key={p} className={`pill ${priorita === p ? 'active' : ''}`} onClick={() => setPriorita(p)}>{p}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="field-label">Tecnico assegnato</label>
                  <div className="input row center" style={{ gap: 8 }}>
                    <Avatar name="Luca M" tone="green" size="sm" />
                    Luca M.
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div>
                    <label className="field-label">Tempo stimato</label>
                    <input className="input" placeholder="es. 2-3 giorni" />
                  </div>
                  <div>
                    <label className="field-label">Preventivo max</label>
                    <input className="input mono" placeholder="€ 0,00" />
                  </div>
                </div>
              </div>
            </div>

            {/* foto */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 10 }}>Foto</div>
              <div className="row center" style={{ gap: 8 }}>
                {['fronte', 'retro'].map(s => (
                  <div
                    key={s}
                    style={{
                      width: 80, height: 80, borderRadius: 6,
                      background: 'var(--hf-surface-2)', border: '1px solid var(--hf-border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--hf-text-4)', fontSize: 11,
                    }}
                  >
                    {s}
                  </div>
                ))}
                <div
                  style={{
                    width: 80, height: 80, borderRadius: 6,
                    border: '1.5px dashed var(--hf-border-2)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--hf-text-3)', fontSize: 11, gap: 4, cursor: 'pointer',
                  }}
                >
                  <Icon name="camera" />+ foto
                </div>
              </div>
            </div>

            {/* autorizzazioni */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 10 }}>Autorizzazioni</div>
              <div className="col" style={{ gap: 8, fontSize: 13 }}>
                {[
                  [true, 'Diagnosi gratuita'],
                  [false, 'Riparazione fino al max senza ulteriore conferma'],
                  [true, 'SMS al cambio di stato'],
                  [false, 'Backup dati (+€30)'],
                ].map(([on, label]) => (
                  <label key={label} className="row center" style={{ gap: 8 }}>
                    <span className={`check ${on ? 'on' : ''}`} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* firma */}
            <div className="card tinted">
              <div style={{ fontSize: 12, color: 'var(--hf-text-3)', marginBottom: 6 }}>FIRMA CLIENTE</div>
              <div
                style={{
                  height: 60, border: '1.5px dashed var(--hf-border-2)', borderRadius: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--hf-text-4)', fontSize: 12,
                }}
              >
                Firma sul tablet
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function StepDot({ n }) {
  return (
    <span
      style={{
        width: 22, height: 22, borderRadius: '50%',
        background: 'var(--hf-text)', color: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 600,
      }}
    >
      {n}
    </span>
  );
}
