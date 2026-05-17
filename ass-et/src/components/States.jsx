import { SUPABASE_CONFIGURED } from '../lib/supabase';
import { Btn } from './UI';

export function Loading({ label = 'Caricamento…' }) {
  return (
    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--hf-text-3)', fontSize: 13, padding: 40 }}>
      <span className="spinner" />
      <span style={{ marginLeft: 10 }}>{label}</span>
      <style>{`.spinner{width:16px;height:16px;border:2px solid var(--hf-border-2);border-top-color:var(--hf-accent);border-radius:50%;display:inline-block;animation:spin .7s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  if (!SUPABASE_CONFIGURED) return <ConfigNotice />;
  return (
    <div className="card" style={{ borderColor: 'var(--hf-red)', background: 'var(--hf-red-soft)', textAlign: 'center', padding: 32 }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>⚠</div>
      <div style={{ fontWeight: 600, marginBottom: 4 }}>Errore di caricamento dati</div>
      <div style={{ fontSize: 13, color: 'var(--hf-text-2)', marginBottom: 16 }}>
        {error?.message || 'Impossibile contattare il database.'}
      </div>
      {onRetry && <Btn onClick={onRetry}>Riprova</Btn>}
    </div>
  );
}

export function EmptyState({ title = 'Nessun dato', sub, action }) {
  return (
    <div style={{ textAlign: 'center', padding: 40, color: 'var(--hf-text-3)' }}>
      <div style={{ fontWeight: 600, color: 'var(--hf-text-2)', marginBottom: 4 }}>{title}</div>
      {sub && <div style={{ fontSize: 13, marginBottom: 16 }}>{sub}</div>}
      {action}
    </div>
  );
}

export function ConfigNotice() {
  return (
    <div className="card" style={{ borderColor: 'var(--hf-amber)', background: 'var(--hf-amber-soft)', maxWidth: 560, margin: '40px auto', padding: 28 }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>🔌</div>
      <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 8 }}>Supabase non configurato</div>
      <div style={{ fontSize: 13, color: 'var(--hf-text-2)', lineHeight: 1.6 }}>
        Crea un file <code className="mono">.env</code> nella cartella <code className="mono">ass-et/</code> con:
        <pre className="mono" style={{ background: 'var(--hf-surface)', border: '1px solid var(--hf-border)', borderRadius: 6, padding: 12, marginTop: 10, fontSize: 12, overflowX: 'auto' }}>
{`VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...`}
        </pre>
        Poi riavvia <code className="mono">npm run dev</code>. In produzione le stesse variabili vanno impostate su Vercel.
      </div>
    </div>
  );
}
