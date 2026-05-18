import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Btn } from '../components/UI';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pw,
    });
    if (error) {
      setErr('Email o password non corretti.');
      setBusy(false);
    }
    // Se ok, onAuthStateChange aggiorna la sessione e l'app entra da sola.
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--hf-surface-2)', padding: 20 }}>
      <form onSubmit={submit} className="card" style={{ width: 360, maxWidth: '100%', padding: 28 }}>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Ass-et</div>
        <div style={{ fontSize: 13, color: 'var(--hf-text-3)', marginBottom: 20 }}>
          Accedi per gestire il centro assistenza
        </div>

        {err && (
          <div className="card" style={{ borderColor: 'var(--hf-red)', background: 'var(--hf-red-soft)', color: 'var(--hf-red)', fontSize: 13, padding: '8px 12px', marginBottom: 14 }}>
            ⚠ {err}
          </div>
        )}

        <label className="field-label">Email</label>
        <input
          className="input"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          autoFocus
          required
          style={{ marginBottom: 12 }}
        />

        <label className="field-label">Password</label>
        <input
          className="input"
          type="password"
          value={pw}
          onChange={e => setPw(e.target.value)}
          required
          style={{ marginBottom: 18 }}
        />

        <Btn tone="primary" style={{ width: '100%', justifyContent: 'center' }}>
          {busy ? 'Accesso…' : 'Accedi'}
        </Btn>

        <div style={{ fontSize: 11, color: 'var(--hf-text-3)', marginTop: 14, lineHeight: 1.6 }}>
          Gli account vengono creati dall'amministratore. La registrazione
          pubblica è disattivata.
        </div>
      </form>
    </div>
  );
}
