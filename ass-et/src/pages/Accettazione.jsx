import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Btn, Avatar, Topbar } from '../components/UI';
import { Loading, ErrorState } from '../components/States';
import { useData } from '../lib/useData';
import { useImpostazioni } from '../lib/useImpostazioni';
import { clientiApi, tecniciApi, interventiApi } from '../lib/api';

const DEVICE_TYPES = ['PC fisso', 'Notebook', 'Smartphone', 'Tablet', 'Stampante', 'Altro'];

export default function Accettazione() {
  const navigate = useNavigate();
  const clienti = useData(() => clientiApi.list(), []);
  const tecnici = useData(() => tecniciApi.list(), []);
  const { tecnicoNome } = useImpostazioni();

  const [clienteMode, setClienteMode] = useState('Esistente');
  const [clienteId, setClienteId] = useState('');
  const [nuovoCliente, setNuovoCliente] = useState({ nome: '', tel: '', email: '', cf: '', tipo: 'Privato' });
  const [deviceType, setDeviceType] = useState('Notebook');
  const [form, setForm] = useState({
    marca: '', modello: '', seriale: '', difetto: '', accessori: '',
    stato_estetico: '', password_cliente: '', priorita: 'Normale',
    max_preventivo: '', tecnico_id: '',
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  if (clienti.loading || tecnici.loading)
    return <main className="main"><Topbar crumbs={['Interventi', 'Nuova accettazione']} /><div className="content"><Loading /></div></main>;
  if (clienti.error)
    return <main className="main"><Topbar crumbs={['Interventi', 'Nuova accettazione']} /><div className="content"><ErrorState error={clienti.error} onRetry={clienti.reload} /></div></main>;

  async function submit() {
    setErr(null);
    // Validazioni minime
    if (clienteMode === 'Esistente' && !clienteId) { setErr('Seleziona un cliente esistente.'); return; }
    if (clienteMode !== 'Esistente' && !nuovoCliente.nome.trim()) { setErr('Inserisci il nome del nuovo cliente.'); return; }
    if (!form.modello.trim() && !deviceType) { setErr('Indica almeno il dispositivo.'); return; }

    setSaving(true);
    const up = v => (typeof v === 'string' ? v.toUpperCase() : v);
    try {
      let cid = clienteId;
      if (clienteMode !== 'Esistente') {
        const created = await clientiApi.create({
          ...nuovoCliente,
          nome: up(nuovoCliente.nome),
          cf: up(nuovoCliente.cf),
          tipo: clienteMode === 'Azienda' ? 'Azienda' : 'Privato',
        });
        cid = created.id;
      }
      const intervento = await interventiApi.create({
        cliente_id: cid,
        dispositivo: up(`${form.marca} ${form.modello}`.trim() || deviceType),
        marca: up(form.marca),
        modello: up(form.modello),
        seriale: up(form.seriale),
        difetto: up(form.difetto),
        accessori: up(form.accessori),
        stato_estetico: up(form.stato_estetico),
        password_cliente: form.password_cliente, // password resta com'è digitata
        priorita: form.priorita,
        max_preventivo: Number(form.max_preventivo) || 0,
        tecnico_id: form.tecnico_id || null,
        stato: 'Accettazione',
        stato_tone: 'gray',
      });
      await interventiApi.addAttivita(intervento.id, {
        autore: tecnicoNome, tipo: 'accettazione', testo: 'Intervento accettato al banco.',
      });
      navigate(`/interventi/${intervento.id}`);
    } catch (e) {
      setErr(e.message);
      setSaving(false);
    }
  }

  const selectedCliente = (clienti.data || []).find(c => c.id === clienteId);

  return (
    <main className="main">
      <Topbar
        crumbs={['Interventi', 'Nuova accettazione']}
        right={
          <>
            <Btn size="sm" onClick={() => navigate('/interventi')}>Annulla</Btn>
            <Btn size="sm" tone="primary" onClick={submit}>
              {saving ? 'Salvataggio…' : 'Conferma e crea intervento'}
            </Btn>
          </>
        }
      />

      <div className="content">
        <div className="page-head">
          <div>
            <div className="page-title">Nuova accettazione</div>
            <div className="page-sub">Il numero intervento sarà assegnato al salvataggio · Operatore: {tecnicoNome}</div>
          </div>
          <Badge tone="gray" dot={false}>Bozza</Badge>
        </div>

        {err && (
          <div className="card" style={{ borderColor: 'var(--hf-red)', background: 'var(--hf-red-soft)', color: 'var(--hf-red)', fontSize: 13, padding: '10px 14px' }}>
            ⚠ {err}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
          <div className="col" style={{ gap: 16 }}>
            {/* CLIENTE */}
            <div className="card">
              <div className="row between" style={{ marginBottom: 14 }}>
                <div className="row center" style={{ gap: 8 }}><StepDot n={1} /><span style={{ fontWeight: 600, fontSize: 15 }}>Cliente</span></div>
                <div className="row center" style={{ gap: 6 }}>
                  {['Esistente', 'Nuovo', 'Azienda'].map(m => (
                    <span key={m} className={`pill ${clienteMode === m ? 'active' : ''}`} onClick={() => setClienteMode(m)}>{m}</span>
                  ))}
                </div>
              </div>

              {clienteMode === 'Esistente' ? (
                <div>
                  <label className="field-label">Seleziona cliente</label>
                  <select className="input" value={clienteId} onChange={e => setClienteId(e.target.value)}>
                    <option value="">— seleziona —</option>
                    {(clienti.data || []).map(c => (
                      <option key={c.id} value={c.id}>{c.nome} · {c.tel || 's/tel'}</option>
                    ))}
                  </select>
                  {selectedCliente && (
                    <div className="row center" style={{ gap: 10, padding: '10px 12px', background: 'var(--hf-accent-soft)', borderRadius: 8, marginTop: 12 }}>
                      <Avatar name={selectedCliente.nome} tone="accent" size="md" />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{selectedCliente.nome}</div>
                        <div style={{ fontSize: 12, color: 'var(--hf-text-3)' }}>
                          {selectedCliente.tel} · {selectedCliente.email} · {selectedCliente.tipo}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label className="field-label">{clienteMode === 'Azienda' ? 'Ragione sociale' : 'Nome e cognome'}</label>
                    <input className="input" value={nuovoCliente.nome} onChange={e => setNuovoCliente(c => ({ ...c, nome: e.target.value }))} placeholder={clienteMode === 'Azienda' ? 'Acme srl' : 'Mario Rossi'} />
                  </div>
                  <div><label className="field-label">Telefono</label><input className="input mono" value={nuovoCliente.tel} onChange={e => setNuovoCliente(c => ({ ...c, tel: e.target.value }))} /></div>
                  <div><label className="field-label">Email</label><input className="input" value={nuovoCliente.email} onChange={e => setNuovoCliente(c => ({ ...c, email: e.target.value }))} /></div>
                  <div style={{ gridColumn: '1 / -1' }}><label className="field-label">{clienteMode === 'Azienda' ? 'P.IVA' : 'Codice fiscale'}</label><input className="input mono" value={nuovoCliente.cf} onChange={e => setNuovoCliente(c => ({ ...c, cf: e.target.value }))} /></div>
                </div>
              )}
            </div>

            {/* DISPOSITIVO */}
            <div className="card">
              <div className="row center" style={{ gap: 8, marginBottom: 14 }}><StepDot n={2} /><span style={{ fontWeight: 600, fontSize: 15 }}>Dispositivo</span></div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
                {DEVICE_TYPES.map(d => <span key={d} className={`pill ${deviceType === d ? 'active' : ''}`} onClick={() => setDeviceType(d)}>{d}</span>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr', gap: 10, marginBottom: 10 }}>
                <div><label className="field-label">Marca</label><input className="input" value={form.marca} onChange={e => set('marca', e.target.value)} placeholder="HP" /></div>
                <div><label className="field-label">Modello</label><input className="input" value={form.modello} onChange={e => set('modello', e.target.value)} placeholder="Pavilion 15" /></div>
                <div><label className="field-label">Seriale / IMEI</label><input className="input mono" value={form.seriale} onChange={e => set('seriale', e.target.value)} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', gap: 10 }}>
                <div><label className="field-label">Accessori consegnati</label><input className="input" value={form.accessori} onChange={e => set('accessori', e.target.value)} placeholder="alimentatore, borsa…" /></div>
                <div><label className="field-label">Stato estetico</label><input className="input" value={form.stato_estetico} onChange={e => set('stato_estetico', e.target.value)} placeholder="Buono — graffi" /></div>
                <div><label className="field-label">Password</label><input className="input" value={form.password_cliente} onChange={e => set('password_cliente', e.target.value)} /></div>
              </div>
            </div>

            {/* DIFETTO */}
            <div className="card">
              <div className="row center" style={{ gap: 8, marginBottom: 14 }}><StepDot n={3} /><span style={{ fontWeight: 600, fontSize: 15 }}>Difetto dichiarato</span></div>
              <textarea className="input" rows={4} value={form.difetto} onChange={e => set('difetto', e.target.value)} placeholder="Descrivi il difetto dichiarato dal cliente…" style={{ resize: 'vertical', lineHeight: 1.5 }} />
              <div className="row center" style={{ gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                <span style={{ fontSize: 11, color: 'var(--hf-text-3)', textTransform: 'uppercase', letterSpacing: 0.04 }}>Sintomi rapidi:</span>
                {['non si accende', 'schermo rotto', 'non carica', 'virus/lento', 'tastiera', 'caduta/danno'].map(s => (
                  <span key={s} className="badge gray" style={{ cursor: 'pointer' }} onClick={() => set('difetto', form.difetto ? `${form.difetto}, ${s}` : s)}>{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col" style={{ gap: 16 }}>
            <div className="card">
              <div className="card-title" style={{ marginBottom: 12 }}>Lavorazione</div>
              <div className="col" style={{ gap: 10 }}>
                <div>
                  <label className="field-label">Priorità</label>
                  <div className="row center" style={{ gap: 6 }}>
                    {['Bassa', 'Normale', 'Urgente'].map(p => <span key={p} className={`pill ${form.priorita === p ? 'active' : ''}`} onClick={() => set('priorita', p)}>{p}</span>)}
                  </div>
                </div>
                <div>
                  <label className="field-label">Tecnico assegnato</label>
                  <select className="input" value={form.tecnico_id} onChange={e => set('tecnico_id', e.target.value)}>
                    <option value="">— non assegnato —</option>
                    {(tecnici.data || []).map(t => <option key={t.id} value={t.id}>{t.nome} · {t.ruolo}</option>)}
                  </select>
                </div>
                <div>
                  <label className="field-label">Preventivo max (€)</label>
                  <input className="input mono" type="number" value={form.max_preventivo} onChange={e => set('max_preventivo', e.target.value)} placeholder="0" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title" style={{ marginBottom: 8 }}>Foto</div>
              <div style={{ fontSize: 12, color: 'var(--hf-text-3)', lineHeight: 1.5 }}>
                Salva prima l'accettazione, poi apri l'intervento appena creato per scattare o caricare le foto del dispositivo.
              </div>
            </div>

            <div className="card tinted">
              <div style={{ fontSize: 12, color: 'var(--hf-text-3)', marginBottom: 6 }}>FIRMA CLIENTE</div>
              <div style={{ height: 60, border: '1.5px dashed var(--hf-border-2)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--hf-text-4)', fontSize: 12 }}>
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
    <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--hf-text)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{n}</span>
  );
}
