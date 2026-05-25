import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Badge, Btn, Avatar, Topbar } from '../components/UI';
import { Loading, ErrorState } from '../components/States';
import { useData } from '../lib/useData';
import { useImpostazioni } from '../lib/useImpostazioni';
import { clientiApi, tecniciApi, interventiApi } from '../lib/api';
import { Combo } from '../components/Combo';
import PezzoModal from '../components/PezzoModal';

const DEVICE_TYPES = ['PC fisso', 'Notebook', 'Smartphone', 'Tablet', 'Stampante', 'Altro'];

export default function Accettazione() {
  const navigate = useNavigate();
  const clienti = useData(() => clientiApi.list(), []);
  const tecnici = useData(() => tecniciApi.list(), []);
  const interventi = useData(() => interventiApi.list(), []);
  const { tecnicoNome } = useImpostazioni();

  const [clienteMode, setClienteMode] = useState('Esistente');
  const [clienteId, setClienteId] = useState('');
  const [clienteQuery, setClienteQuery] = useState('');
  const [nuovoCliente, setNuovoCliente] = useState({ nome: '', tel: '', email: '', cf: '', tipo: 'Privato' });
  const [deviceType, setDeviceType] = useState('Notebook');
  const [form, setForm] = useState({
    marca: '', modello: '', seriale: '', difetto: '', accessori: '',
    stato_estetico: '', password_cliente: '', priorita: 'Normale',
    max_preventivo: '', tecnico_id: '', ubicazione: 'IN LABORATORIO',
  });
  const [pezziDraft, setPezziDraft] = useState([]);
  const [pezzoModal, setPezzoModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  // Distinct di marche e modelli dagli interventi passati, per i suggerimenti.
  const marcheNote = useMemo(() => {
    const s = new Set();
    for (const t of interventi.data || []) if (t.marca) s.add(t.marca);
    return Array.from(s).sort();
  }, [interventi.data]);
  const modelliNoti = useMemo(() => {
    const s = new Set();
    for (const t of interventi.data || []) if (t.modello) s.add(t.modello);
    return Array.from(s).sort();
  }, [interventi.data]);

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
        ubicazione: form.ubicazione || 'IN LABORATORIO',
      });
      await interventiApi.addAttivita(intervento.id, {
        autore: tecnicoNome, tipo: 'accettazione', testo: 'Intervento accettato al banco.',
      });
      for (const p of pezziDraft) {
        await interventiApi.addPezzo(intervento.id, p);
      }
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

        <div className="responsive-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
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
                  <label className="field-label">Seleziona cliente · cerca nome, telefono o email</label>
                  <Combo
                    value={clienteQuery}
                    onChange={(v) => { setClienteQuery(v); if (!v) setClienteId(''); }}
                    onPick={(c) => { setClienteId(c.id); setClienteQuery(`${c.nome} · ${c.tel || 's/tel'}`); }}
                    options={clienti.data || []}
                    getLabel={(c) => `${c.nome} · ${c.tel || 's/tel'}${c.email ? ' · ' + c.email : ''}`}
                    placeholder="Inizia a digitare nome, telefono o email…"
                    maxShown={12}
                  />
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
              <div className="responsive-stack" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr', gap: 10, marginBottom: 10 }}>
                <div><label className="field-label">Marca</label>
                  <Combo value={form.marca} onChange={(v) => set('marca', v)} options={marcheNote} placeholder="HP, Apple, Samsung…" />
                </div>
                <div><label className="field-label">Modello</label>
                  <Combo value={form.modello} onChange={(v) => set('modello', v)} options={modelliNoti} placeholder="Pavilion 15, iPhone 13…" />
                </div>
                <div><label className="field-label">Seriale / IMEI</label><input className="input mono" value={form.seriale} onChange={e => set('seriale', e.target.value)} /></div>
              </div>
              <div className="responsive-stack" style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr', gap: 10 }}>
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

            {/* PEZZI */}
            <div className="card">
              <div className="row between" style={{ marginBottom: 12 }}>
                <div className="row center" style={{ gap: 8 }}><StepDot n={4} /><span style={{ fontWeight: 600, fontSize: 15 }}>Pezzi previsti (facoltativo)</span></div>
                <Btn size="sm" icon="plus" onClick={() => setPezzoModal(true)}>Aggiungi pezzo</Btn>
              </div>
              {pezziDraft.length === 0 ? (
                <div style={{ fontSize: 12, color: 'var(--hf-text-3)' }}>
                  Se sai già quali pezzi serviranno, aggiungili qui. Verranno creati al salvataggio dell'intervento. Puoi anche aggiungerli più tardi dal dettaglio.
                </div>
              ) : (
                <div className="col" style={{ gap: 6 }}>
                  {pezziDraft.map((p, i) => (
                    <div key={i} className="row center" style={{ gap: 10, padding: '8px 10px', background: 'var(--hf-surface)', border: '1px solid var(--hf-border)', borderRadius: 6 }}>
                      <Badge tone={p.stato_tone} dot={false}>{p.stato}</Badge>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{p.nome}</div>
                        {p.descrizione && <div style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{p.descrizione}</div>}
                      </div>
                      <span className="mono" style={{ fontSize: 12, color: 'var(--hf-text-3)' }}>q.{p.qty}</span>
                      <span className="mono" style={{ fontSize: 12 }}>€ {Number(p.prezzo_vend || 0).toFixed(2).replace('.', ',')}</span>
                      <button className="btn ghost sm" title="Rimuovi" style={{ padding: 4 }}
                        onClick={() => setPezziDraft(d => d.filter((_, j) => j !== i))}>
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
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
                <div>
                  <label className="field-label">Dispositivo qui in laboratorio?</label>
                  <div className="row center" style={{ gap: 6 }}>
                    {[
                      { v: 'IN LABORATORIO', l: 'In laboratorio' },
                      { v: 'DAL CLIENTE', l: 'Restituito al cliente' },
                    ].map(opt => (
                      <span key={opt.v} className={`pill ${form.ubicazione === opt.v ? 'active' : ''}`} onClick={() => set('ubicazione', opt.v)}>{opt.l}</span>
                    ))}
                  </div>
                  {form.ubicazione === 'DAL CLIENTE' && (
                    <div style={{ fontSize: 11, color: 'var(--hf-amber)', marginTop: 4 }}>
                      ⚠ Stai accettando il lavoro ma il dispositivo torna dal cliente (es. in attesa pezzo). Verrà segnalato chiaramente nell'intervento.
                    </div>
                  )}
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

      {pezzoModal && (
        <PezzoModal
          onClose={() => setPezzoModal(false)}
          onCommit={async (p) => {
            setPezziDraft(d => [...d, p]);
            setPezzoModal(false);
          }}
        />
      )}
    </main>
  );
}

function StepDot({ n }) {
  return (
    <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--hf-text)', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{n}</span>
  );
}
