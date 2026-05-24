import { useState } from 'react';
import { Btn, Avatar, Topbar } from '../components/UI';
import { Loading, ErrorState } from '../components/States';
import { useData } from '../lib/useData';
import { impostazioniApi } from '../lib/api';

const TONES = ['violet', 'blue', 'green', 'amber', 'accent', 'gray'];

export default function Impostazioni() {
  const { data, loading, error, reload } = useData(() => impostazioniApi.getAll(), []);

  if (loading)
    return <main className="main"><Topbar crumbs={['Impostazioni']} /><div className="content"><Loading /></div></main>;
  if (error)
    return <main className="main"><Topbar crumbs={['Impostazioni']} /><div className="content"><ErrorState error={error} onRetry={reload} /></div></main>;

  return <SettingsForm initial={data || {}} onReload={reload} />;
}

function SettingsForm({ initial, onReload }) {
  const [nome, setNome] = useState(initial.tecnico_nome || '');
  const [ruolo, setRuolo] = useState(initial.tecnico_ruolo || '');
  const [tone, setTone] = useState(initial.tecnico_tone || 'violet');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [err, setErr] = useState(null);

  async function save() {
    setErr(null);
    setSaved(false);
    if (!nome.trim()) { setErr('Il nome del tecnico non può essere vuoto.'); return; }
    setSaving(true);
    try {
      await impostazioniApi.set('tecnico_nome', nome.trim());
      await impostazioniApi.set('tecnico_ruolo', ruolo.trim());
      await impostazioniApi.set('tecnico_tone', tone);
      setSaved(true);
      onReload();
    } catch (e) {
      setErr(e.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="main">
      <Topbar
        crumbs={['Impostazioni']}
        right={
          <Btn size="sm" tone="primary" onClick={save}>
            {saving ? 'Salvataggio…' : 'Salva impostazioni'}
          </Btn>
        }
      />

      <div className="content">
        <div className="page-head">
          <div>
            <div className="page-title">Impostazioni</div>
            <div className="page-sub">Configura il tecnico/operatore mostrato nell'applicazione</div>
          </div>
        </div>

        {err && (
          <div className="card" style={{ borderColor: 'var(--hf-red)', background: 'var(--hf-red-soft)', color: 'var(--hf-red)', fontSize: 13, padding: '10px 14px' }}>
            ⚠ {err}
          </div>
        )}
        {saved && !err && (
          <div className="card" style={{ borderColor: 'var(--hf-green)', background: 'var(--hf-green-soft)', color: 'var(--hf-green)', fontSize: 13, padding: '10px 14px' }}>
            ✓ Impostazioni salvate.
          </div>
        )}

        <div className="responsive-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
          <div className="card">
            <div className="card-title" style={{ marginBottom: 14 }}>Tecnico / operatore</div>
            <div className="col" style={{ gap: 14 }}>
              <div>
                <label className="field-label">Nome tecnico</label>
                <input
                  className="input"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Es. Mario Rossi"
                />
              </div>
              <div>
                <label className="field-label">Qualifica / ruolo</label>
                <input
                  className="input"
                  value={ruolo}
                  onChange={e => setRuolo(e.target.value)}
                  placeholder="Es. Tecnico · banco"
                />
              </div>
              <div>
                <label className="field-label">Colore avatar</label>
                <div className="row center" style={{ gap: 6, flexWrap: 'wrap' }}>
                  {TONES.map(tn => (
                    <span
                      key={tn}
                      className={`pill ${tone === tn ? 'active' : ''}`}
                      onClick={() => setTone(tn)}
                      style={{ textTransform: 'capitalize' }}
                    >
                      {tn}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-title" style={{ marginBottom: 12 }}>Anteprima</div>
            <div className="row center" style={{ gap: 10, padding: '10px 12px', background: 'var(--hf-surface-2)', borderRadius: 8 }}>
              <Avatar name={nome || 'Tecnico'} tone={tone} size="md" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{nome || 'Tecnico'}</div>
                <div style={{ fontSize: 12, color: 'var(--hf-text-3)' }}>{ruolo || 'Tecnico · banco'}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--hf-text-3)', marginTop: 10 }}>
              Il nome appare nella barra laterale, in accettazione e nelle attività degli interventi.
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
