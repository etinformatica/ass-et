import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Badge, Btn, Topbar, Icon } from '../components/UI';
import { Loading, ErrorState, EmptyState } from '../components/States';
import { Modal, ConfirmDialog, Field } from '../components/Modal';
import { useData } from '../lib/useData';
import { fornitoriApi, carichiApi, magazzinoApi } from '../lib/api';
import { GruppoCarico } from '../components/Carichi';
import { groupByFattura } from '../lib/carichi';

const EMPTY = { nome: '', tel: '', email: '', indirizzo: '', p_iva: '', note: '' };

export default function Fornitori() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fornitori = useData(() => fornitoriApi.list(), []);
  const articoli = useData(() => magazzinoApi.list(), []);
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  const [caricoModal, setCaricoModal] = useState(null); // null | { fornitoreId }
  const [reloadTick, setReloadTick] = useState(0);

  const list = fornitori.data || [];
  const filtered = list.filter(f => {
    const s = q.trim().toLowerCase();
    if (!s) return true;
    return (
      (f.nome || '').toLowerCase().includes(s) ||
      (f.tel || '').toLowerCase().includes(s) ||
      (f.email || '').toLowerCase().includes(s) ||
      (f.p_iva || '').toLowerCase().includes(s)
    );
  });
  const selected = id ? list.find(f => f.id === id) : null;

  async function save(form) {
    setBusy(true);
    try {
      const up = v => (typeof v === 'string' ? v.toUpperCase() : v);
      const payload = {
        nome: up(form.nome.trim()),
        tel: form.tel?.trim() || null,
        email: form.email?.trim() || null,
        indirizzo: up(form.indirizzo?.trim() || ''),
        p_iva: up(form.p_iva?.trim() || ''),
        note: up(form.note?.trim() || ''),
      };
      if (editing && editing.id) await fornitoriApi.update(editing.id, payload);
      else await fornitoriApi.create(payload);
      setEditing(null);
      fornitori.reload();
    } catch (e) {
      alert('Errore: ' + (e.message || e.code || 'salvataggio fallito'));
    } finally { setBusy(false); }
  }
  async function doDelete() {
    setBusy(true);
    try {
      await fornitoriApi.remove(toDelete.id);
      if (selected?.id === toDelete.id) navigate('/fornitori');
      setToDelete(null);
      fornitori.reload();
    } catch (e) { alert('Errore: ' + e.message); }
    finally { setBusy(false); }
  }

  return (
    <main className="main">
      <Topbar
        crumbs={['Fornitori', ...(selected ? [selected.nome] : [])]}
        right={
          <>
            <Btn size="sm" icon="box" onClick={() => setCaricoModal({ fornitoreId: selected?.id || null })}>Nuovo carico</Btn>
            <Btn size="sm" tone="primary" icon="plus" onClick={() => setEditing({ ...EMPTY })}>Nuovo fornitore</Btn>
          </>
        }
      />
      <div className="content">
        <div className="page-head">
          <div>
            <div className="page-title">Fornitori</div>
            <div className="page-sub">{list.length} anagrafiche · clicca un fornitore per vedere lo storico dei carichi</div>
          </div>
          <label className="search-box" style={{ minWidth: 280 }}>
            <Icon name="search" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Cerca nome, tel, email, P.IVA…" autoComplete="off" />
          </label>
        </div>

        {fornitori.loading && <Loading />}
        {fornitori.error && <ErrorState error={fornitori.error} onRetry={fornitori.reload} />}

        {!fornitori.loading && !fornitori.error && list.length === 0 && (
          <div className="card"><EmptyState title="Nessun fornitore" sub="Crea la prima anagrafica per usarla nei carichi merce." action={<Btn tone="primary" icon="plus" onClick={() => setEditing({ ...EMPTY })}>Nuovo fornitore</Btn>} /></div>
        )}

        {!fornitori.loading && !fornitori.error && list.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1.6fr' : '1fr', gap: 16, minHeight: 0 }}>
            <div className="table-wrap">
              <table className="data-table">
                <thead><tr><th>Nome</th><th>Tel</th><th>P.IVA</th><th></th></tr></thead>
                <tbody>
                  {filtered.map(f => (
                    <tr key={f.id}
                      onClick={() => navigate(`/fornitori/${f.id}`)}
                      style={{ background: selected?.id === f.id ? 'var(--hf-surface-2)' : undefined }}>
                      <td className="strong">{f.nome}</td>
                      <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{f.tel || '—'}</td>
                      <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{f.p_iva || '—'}</td>
                      <td onClick={e => e.stopPropagation()} style={{ whiteSpace: 'nowrap' }}>
                        <button className="btn ghost sm" style={{ padding: 4 }} title="Modifica" onClick={() => setEditing(f)}><Icon name="edit" /></button>
                        <button className="btn ghost sm" style={{ padding: 4 }} title="Elimina" onClick={() => setToDelete(f)}><Icon name="trash" /></button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && <tr><td colSpan={4} style={{ textAlign: 'center', padding: 24, color: 'var(--hf-text-3)' }}>Nessun risultato.</td></tr>}
                </tbody>
              </table>
            </div>

            {selected && (
              <FornitoreDetail
                key={`${selected.id}-${reloadTick}`}
                fornitore={selected}
                onEdit={() => setEditing(selected)}
                onClose={() => navigate('/fornitori')}
                onNuovoCarico={() => setCaricoModal({ fornitoreId: selected.id })}
                onCarichiChanged={() => { setReloadTick(t => t + 1); articoli.reload(); }}
              />
            )}
          </div>
        )}
      </div>

      {editing && <FornitoreForm initial={editing} onClose={() => setEditing(null)} onSave={save} busy={busy} />}
      {toDelete && <ConfirmDialog message={`Eliminare il fornitore "${toDelete.nome}"? I carichi storici resteranno (con riferimento svuotato).`} onConfirm={doDelete} onClose={() => setToDelete(null)} busy={busy} />}
      {caricoModal && (
        <CaricoMultiModal
          articoli={articoli.data || []}
          fornitori={list}
          fornitoreInitial={caricoModal.fornitoreId}
          onFornitoriReload={fornitori.reload}
          onClose={() => setCaricoModal(null)}
          onSaved={() => { setCaricoModal(null); setReloadTick(t => t + 1); articoli.reload(); }}
        />
      )}
    </main>
  );
}

function FornitoreDetail({ fornitore, onEdit, onClose, onNuovoCarico, onCarichiChanged }) {
  const carichi = useData(() => carichiApi.listByFornitore(fornitore.id), [fornitore.id]);
  const list = carichi.data || [];
  const totalePezzi = list.reduce((s, c) => s + Number(c.qty || 0), 0);
  const totaleSpeso = list.reduce((s, c) => s + Number(c.qty || 0) * Number(c.costo_acq || 0), 0);
  const groups = useMemo(
    () => groupByFattura((carichi.data || []).map(c => ({ ...c, fornitore_rel: { id: fornitore.id, nome: fornitore.nome } }))),
    [carichi.data, fornitore.id, fornitore.nome]
  );

  const [headerEdit, setHeaderEdit] = useState(null); // { gruppo }
  const [groupToDelete, setGroupToDelete] = useState(null);

  async function updateRiga(r, patch) {
    try {
      await carichiApi.update(r.id, patch);
      carichi.reload();
      onCarichiChanged?.();
    } catch (e) { alert('Errore: ' + e.message); }
  }
  async function deleteRiga(r) {
    if (!confirm(`Eliminare la riga "${r.nome}"? Lo stock dell'articolo verrà ridotto di ${r.qty}.`)) return;
    try {
      await carichiApi.remove(r.id);
      carichi.reload();
      onCarichiChanged?.();
    } catch (e) { alert('Errore: ' + e.message); }
  }
  async function deleteGruppo(g) {
    try {
      await Promise.all(g.righe.map(r => carichiApi.remove(r.id)));
      setGroupToDelete(null);
      carichi.reload();
      onCarichiChanged?.();
    } catch (e) { alert('Errore: ' + e.message); }
  }
  async function saveHeader(g, patch) {
    try {
      await Promise.all(g.righe.map(r => carichiApi.update(r.id, patch)));
      setHeaderEdit(null);
      carichi.reload();
      onCarichiChanged?.();
    } catch (e) { alert('Errore: ' + e.message); }
  }

  return (
    <div className="col" style={{ gap: 12, minHeight: 0 }}>
      <div className="card">
        <div className="row between" style={{ alignItems: 'flex-start', marginBottom: 10 }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{fornitore.nome}</div>
            {fornitore.p_iva && <div className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>P.IVA {fornitore.p_iva}</div>}
          </div>
          <div className="row" style={{ gap: 4 }}>
            <Btn size="sm" tone="primary" icon="box" onClick={onNuovoCarico}>+ nuovo carico</Btn>
            <Btn size="sm" icon="edit" onClick={onEdit}>Modifica</Btn>
            <Btn size="sm" onClick={onClose}>✕</Btn>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
          <div><span style={{ color: 'var(--hf-text-3)' }}>Telefono</span><div className="mono">{fornitore.tel || '—'}</div></div>
          <div><span style={{ color: 'var(--hf-text-3)' }}>Email</span><div className="mono" style={{ textTransform: 'none' }}>{fornitore.email || '—'}</div></div>
          <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'var(--hf-text-3)' }}>Indirizzo</span><div>{fornitore.indirizzo || '—'}</div></div>
          {fornitore.note && <div style={{ gridColumn: '1 / -1' }}><span style={{ color: 'var(--hf-text-3)' }}>Note</span><div style={{ color: 'var(--hf-text-2)' }}>{fornitore.note}</div></div>}
        </div>
      </div>

      <div className="kpi-grid kpi-grid-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="card kpi"><div className="kpi-label">Fatture</div><div className="kpi-value sm">{groups.length}</div></div>
        <div className="card kpi"><div className="kpi-label">Pezzi acquistati</div><div className="kpi-value sm">{totalePezzi}</div></div>
        <div className="card kpi"><div className="kpi-label">Totale speso</div><div className="kpi-value sm">€ {totaleSpeso.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div></div>
      </div>

      <div className="table-wrap" style={{ minHeight: 0 }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--hf-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 14 }}>Storico carichi · per fattura</span>
          <Badge tone="gray" dot={false}>{groups.length}</Badge>
        </div>
        {carichi.loading && <Loading />}
        {carichi.error && <ErrorState error={carichi.error} onRetry={carichi.reload} />}
        {!carichi.loading && !carichi.error && (
          groups.length === 0 ? (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--hf-text-3)', fontSize: 13 }}>Nessun carico da questo fornitore. <Btn size="sm" tone="accent" onClick={onNuovoCarico} style={{ marginLeft: 8 }}>Registra il primo</Btn></div>
          ) : (
            groups.map(g => (
              <GruppoCarico
                key={g.key}
                gruppo={g}
                readonly={false}
                renderActions={() => (
                  <span style={{ display: 'inline-flex', gap: 2, marginLeft: 4 }}>
                    <button className="btn ghost sm" style={{ padding: 4 }} title="Modifica testata" onClick={() => setHeaderEdit({ gruppo: g })}><Icon name="edit" /></button>
                    <button className="btn ghost sm" style={{ padding: 4 }} title="Elimina fattura" onClick={() => setGroupToDelete(g)}><Icon name="trash" /></button>
                  </span>
                )}
                renderRow={(r) => <RigaCaricoEdit key={r.id} riga={r} onUpdate={updateRiga} onDelete={deleteRiga} />}
              />
            ))
          )
        )}
      </div>

      {headerEdit && (
        <HeaderEditModal
          gruppo={headerEdit.gruppo}
          onClose={() => setHeaderEdit(null)}
          onSave={(patch) => saveHeader(headerEdit.gruppo, patch)}
        />
      )}
      {groupToDelete && (
        <ConfirmDialog
          message={`Eliminare l'intera fattura ${groupToDelete.numero_fattura || '(senza numero)'} del ${groupToDelete.data_carico ? new Date(groupToDelete.data_carico).toLocaleDateString('it-IT') : '—'}? Tutte le ${groupToDelete.righe.length} righe verranno rimosse e lo stock corrispondente ridotto.`}
          onConfirm={() => deleteGruppo(groupToDelete)}
          onClose={() => setGroupToDelete(null)}
        />
      )}
    </div>
  );
}

function RigaCaricoEdit({ riga, onUpdate, onDelete }) {
  return (
    <tr key={riga.id}>
      <td className="strong">{riga.nome || '—'}</td>
      <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{riga.sku || '—'}</td>
      <td style={{ textAlign: 'right' }}>
        <InlineNum key={`q-${riga.id}-${riga.qty}`} value={riga.qty} min={1} onSave={(n) => onUpdate(riga, { qty: n })} width={56} />
      </td>
      <td style={{ textAlign: 'right' }}>
        <InlineNum key={`c-${riga.id}-${riga.costo_acq}`} value={riga.costo_acq ?? 0} step={0.01} onSave={(n) => onUpdate(riga, { costo_acq: n })} width={80} mono />
      </td>
      <td className="mono strong" style={{ textAlign: 'right' }}>€ {(Number(riga.qty || 0) * Number(riga.costo_acq || 0)).toFixed(2).replace('.', ',')}</td>
      <td>
        <button className="btn ghost sm" style={{ padding: 4 }} title="Elimina riga" onClick={() => onDelete(riga)}><Icon name="trash" /></button>
      </td>
    </tr>
  );
}

function InlineNum({ value, onSave, min, step = 1, width = 60, mono = false }) {
  const [v, setV] = useState(value ?? 0);
  function commit() {
    let n = Number(v);
    if (!isFinite(n)) n = 0;
    if (min != null) n = Math.max(min, n);
    if (n !== Number(value)) onSave(n);
    setV(n);
  }
  return (
    <input
      className={`input ${mono ? 'mono' : ''}`}
      type="number"
      step={step}
      min={min}
      value={v}
      onChange={e => setV(e.target.value)}
      onBlur={commit}
      onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }}
      style={{ width, textAlign: 'right', padding: '4px 8px', fontSize: 12 }}
    />
  );
}

function HeaderEditModal({ gruppo, onClose, onSave }) {
  const [data, setData] = useState(gruppo.data_carico || '');
  const [num, setNum] = useState(gruppo.numero_fattura || '');
  return (
    <Modal
      title="Modifica testata fattura"
      onClose={onClose}
      footer={<><Btn onClick={onClose}>Annulla</Btn><Btn tone="accent" onClick={() => onSave({ data_carico: data || null, numero_fattura: num.trim() || null })}>Salva</Btn></>}
    >
      <Field label="Data carico"><input className="input mono" type="date" value={data} onChange={e => setData(e.target.value)} /></Field>
      <Field label="N° fattura"><input className="input mono" value={num} onChange={e => setNum(e.target.value)} placeholder="es. 2026/142" /></Field>
      <div style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>
        La modifica si applica a tutte le {gruppo.righe.length} righe della fattura.
      </div>
    </Modal>
  );
}

function CaricoMultiModal({ articoli, fornitori, fornitoreInitial, onFornitoriReload, onClose, onSaved }) {
  const oggi = new Date().toISOString().slice(0, 10);
  const [fornitoreId, setFornitoreId] = useState(fornitoreInitial || '');
  const [data, setData] = useState(oggi);
  const [numero, setNumero] = useState('');
  const [righe, setRighe] = useState([{ key: 1, magazzino_id: '', qty: 1, costo: '' }]);
  const [nextKey, setNextKey] = useState(2);
  const [nuovoForn, setNuovoForn] = useState(null); // {nome,tel,p_iva} | null
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const allCarichi = useData(() => carichiApi.list(), []);

  // mappa magazzino_id → { ultimo: carico più recente, fornitori: Set di nomi distinti }
  const acquistiByArticolo = useMemo(() => {
    const m = new Map();
    for (const c of allCarichi.data || []) {
      if (!c.magazzino_id) continue;
      let e = m.get(c.magazzino_id);
      if (!e) { e = { righe: [], fornitori: new Set() }; m.set(c.magazzino_id, e); }
      e.righe.push(c);
      const fn = c.fornitore_rel?.nome || c.fornitore;
      if (fn) e.fornitori.add(fn);
    }
    for (const e of m.values()) {
      e.righe.sort((a, b) => (b.data_carico || '').localeCompare(a.data_carico || ''));
      e.ultimo = e.righe[0];
    }
    return m;
  }, [allCarichi.data]);

  function renderHint(magId) {
    if (!magId) return null;
    const e = acquistiByArticolo.get(magId);
    if (!e || !e.ultimo) return <span style={{ color: 'var(--hf-text-4)' }}>Mai acquistato prima</span>;
    const u = e.ultimo;
    const lastName = u.fornitore_rel?.nome || u.fornitore || '— senza fornitore —';
    const lastDate = u.data_carico ? new Date(u.data_carico).toLocaleDateString('it-IT') : '—';
    const others = Array.from(e.fornitori).filter(n => n !== lastName);
    return (
      <span>
        Ultimo: <strong>{lastDate}</strong> da <strong>{lastName}</strong> a € {u.costo_acq != null ? u.costo_acq : '—'} cad.
        {others.length > 0 && <span style={{ color: 'var(--hf-text-3)' }}>{` · anche da ${others.slice(0, 2).join(', ')}${others.length > 2 ? ` +${others.length - 2}` : ''}`}</span>}
      </span>
    );
  }

  function addRiga() {
    setRighe(rs => [...rs, { key: nextKey, magazzino_id: '', qty: 1, costo: '' }]);
    setNextKey(k => k + 1);
  }
  function updateRiga(key, patch) {
    setRighe(rs => rs.map(r => r.key === key ? { ...r, ...patch } : r));
  }
  function removeRiga(key) {
    setRighe(rs => rs.length === 1 ? rs : rs.filter(r => r.key !== key));
  }
  function pickArticolo(key, magId) {
    const a = (articoli || []).find(x => x.id === magId);
    updateRiga(key, { magazzino_id: magId, costo: a ? (a.costo_acq ?? '') : '' });
  }

  async function creaFornitoreInline() {
    if (!nuovoForn?.nome?.trim()) { setErr('Il nome del fornitore è obbligatorio.'); return; }
    setBusy(true);
    setErr(null);
    try {
      const up = v => (typeof v === 'string' ? v.toUpperCase() : v);
      const created = await fornitoriApi.create({
        nome: up(nuovoForn.nome.trim()),
        tel: nuovoForn.tel?.trim() || null,
        p_iva: up(nuovoForn.p_iva?.trim() || ''),
      });
      await onFornitoriReload();
      setFornitoreId(created.id);
      setNuovoForn(null);
    } catch (e) {
      setErr('Errore creazione fornitore: ' + (e.message || 'duplicato?'));
    } finally { setBusy(false); }
  }

  async function submit() {
    setErr(null);
    const validRighe = righe
      .filter(r => r.magazzino_id && Number(r.qty) > 0)
      .map(r => {
        const a = (articoli || []).find(x => x.id === r.magazzino_id);
        return {
          magazzino_id: r.magazzino_id,
          sku: a?.sku || null,
          nome: a?.nome || null,
          qty: Number(r.qty),
          costo_acq: r.costo === '' || r.costo == null ? null : Number(r.costo),
        };
      });
    if (validRighe.length === 0) { setErr('Aggiungi almeno una riga con articolo e quantità.'); return; }

    const fornitoreObj = (fornitori || []).find(f => f.id === fornitoreId);
    const testata = {
      fornitore_id: fornitoreId || null,
      fornitore: fornitoreObj ? fornitoreObj.nome : null,
      data_carico: data || oggi,
      numero_fattura: numero.trim() || null,
    };

    setBusy(true);
    try {
      for (const r of validRighe) {
        await carichiApi.create({ ...testata, ...r });
      }
      onSaved();
    } catch (e) {
      setErr('Errore salvataggio: ' + (e.message || 'verifica i dati'));
    } finally { setBusy(false); }
  }

  const totaleDoc = righe.reduce((s, r) => s + Number(r.qty || 0) * Number(r.costo || 0), 0);

  return (
    <Modal
      title="Nuovo carico merce"
      onClose={onClose}
      width={780}
      footer={<><Btn onClick={onClose}>Annulla</Btn><Btn tone="accent" onClick={submit}>{busy ? 'Salvo…' : `Registra carico (€ ${totaleDoc.toFixed(2).replace('.', ',')})`}</Btn></>}
    >
      {err && (
        <div className="card" style={{ borderColor: 'var(--hf-red)', background: 'var(--hf-red-soft)', color: 'var(--hf-red)', fontSize: 13, padding: '8px 12px' }}>
          ⚠ {err}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr', gap: 12 }}>
        <div>
          <span className="field-label">Fornitore</span>
          {nuovoForn ? (
            <div className="card tinted" style={{ padding: 8 }}>
              <Field label="Nome"><input className="input" value={nuovoForn.nome} onChange={e => setNuovoForn(s => ({ ...s, nome: e.target.value }))} autoFocus /></Field>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <Field label="Tel"><input className="input mono" type="tel" value={nuovoForn.tel || ''} onChange={e => setNuovoForn(s => ({ ...s, tel: e.target.value }))} /></Field>
                <Field label="P.IVA"><input className="input mono" value={nuovoForn.p_iva || ''} onChange={e => setNuovoForn(s => ({ ...s, p_iva: e.target.value }))} /></Field>
              </div>
              <div className="row" style={{ gap: 4 }}>
                <Btn size="sm" onClick={() => setNuovoForn(null)}>annulla</Btn>
                <Btn size="sm" tone="accent" onClick={creaFornitoreInline}>Crea e usa</Btn>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 6 }}>
              <select className="input" value={fornitoreId} onChange={e => setFornitoreId(e.target.value)} style={{ flex: 1 }}>
                <option value="">— seleziona —</option>
                {(fornitori || []).map(f => <option key={f.id} value={f.id}>{f.nome}</option>)}
              </select>
              <Btn size="sm" onClick={() => setNuovoForn({ nome: '', tel: '', p_iva: '' })}>+ nuovo</Btn>
            </div>
          )}
        </div>
        <Field label="Data carico"><input className="input mono" type="date" value={data} onChange={e => setData(e.target.value)} /></Field>
        <Field label="N° fattura"><input className="input mono" value={numero} onChange={e => setNumero(e.target.value)} placeholder="es. 2026/142" /></Field>
      </div>

      <div className="table-wrap" style={{ marginTop: 8 }}>
        <div style={{ padding: '10px 14px', borderBottom: '1px solid var(--hf-border)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontWeight: 600, fontSize: 13 }}>Articoli della fattura</span>
          <Badge tone="gray" dot={false}>{righe.length}</Badge>
          <div style={{ flex: 1 }} />
          <Btn size="sm" onClick={addRiga}>+ aggiungi riga</Btn>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Articolo</th>
              <th style={{ width: 90, textAlign: 'right' }}>Q.</th>
              <th style={{ width: 110, textAlign: 'right' }}>€ cad.</th>
              <th style={{ width: 110, textAlign: 'right' }}>€ totale</th>
              <th style={{ width: 36 }}></th>
            </tr>
          </thead>
          <tbody>
            {righe.map(r => [
              <tr key={r.key}>
                <td>
                  <select className="input" value={r.magazzino_id} onChange={e => pickArticolo(r.key, e.target.value)} style={{ minWidth: 0 }}>
                    <option value="">— seleziona —</option>
                    {(articoli || []).map(a => <option key={a.id} value={a.id}>{a.nome}{a.sku ? ` (${a.sku})` : ''} · stock {a.stock}</option>)}
                  </select>
                </td>
                <td><input className="input mono" type="number" min={1} value={r.qty} onChange={e => updateRiga(r.key, { qty: e.target.value })} style={{ textAlign: 'right', padding: '4px 6px' }} /></td>
                <td><input className="input mono" type="number" step="0.01" value={r.costo} onChange={e => updateRiga(r.key, { costo: e.target.value })} placeholder="0,00" style={{ textAlign: 'right', padding: '4px 6px' }} /></td>
                <td className="mono" style={{ textAlign: 'right' }}>€ {(Number(r.qty || 0) * Number(r.costo || 0)).toFixed(2).replace('.', ',')}</td>
                <td><button className="btn ghost sm" style={{ padding: 4 }} title="Rimuovi riga" onClick={() => removeRiga(r.key)} disabled={righe.length === 1}><Icon name="trash" /></button></td>
              </tr>,
              r.magazzino_id && (
                <tr key={`${r.key}-hint`}>
                  <td colSpan={5} style={{ padding: '4px 12px 8px', borderTop: 'none', fontSize: 11, color: 'var(--hf-text-2)', background: 'var(--hf-surface-2)' }}>
                    {renderHint(r.magazzino_id)}
                  </td>
                </tr>
              ),
            ])}
          </tbody>
        </table>
      </div>

      <div className="row between" style={{ fontSize: 13, marginTop: 4 }}>
        <span style={{ color: 'var(--hf-text-3)' }}>Totale documento</span>
        <span className="mono strong" style={{ fontSize: 16 }}>€ {totaleDoc.toFixed(2).replace('.', ',')}</span>
      </div>
    </Modal>
  );
}

function FornitoreForm({ initial, onClose, onSave, busy }) {
  const [f, setF] = useState({
    nome: initial.nome || '', tel: initial.tel || '', email: initial.email || '',
    indirizzo: initial.indirizzo || '', p_iva: initial.p_iva || '', note: initial.note || '',
  });
  const [err, setErr] = useState(null);
  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  function submit() {
    if (!f.nome.trim()) { setErr('Il nome del fornitore è obbligatorio.'); return; }
    setErr(null);
    onSave(f);
  }
  return (
    <Modal
      title={initial.id ? 'Modifica fornitore' : 'Nuovo fornitore'}
      onClose={onClose}
      footer={<><Btn onClick={onClose}>Annulla</Btn><Btn tone="accent" onClick={submit}>{busy ? 'Salvo…' : 'Salva'}</Btn></>}
    >
      {err && (
        <div className="card" style={{ borderColor: 'var(--hf-red)', background: 'var(--hf-red-soft)', color: 'var(--hf-red)', fontSize: 13, padding: '8px 12px' }}>
          ⚠ {err}
        </div>
      )}
      <Field label="Nome / ragione sociale"><input className="input" value={f.nome} onChange={e => set('nome', e.target.value)} autoFocus /></Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Field label="Telefono"><input className="input mono" type="tel" value={f.tel} onChange={e => set('tel', e.target.value)} /></Field>
        <Field label="Email"><input className="input mono" type="email" value={f.email} onChange={e => set('email', e.target.value)} /></Field>
      </div>
      <Field label="Indirizzo"><input className="input" value={f.indirizzo} onChange={e => set('indirizzo', e.target.value)} /></Field>
      <Field label="P.IVA"><input className="input mono" value={f.p_iva} onChange={e => set('p_iva', e.target.value)} /></Field>
      <Field label="Note"><textarea className="input" rows={2} value={f.note} onChange={e => set('note', e.target.value)} /></Field>
    </Modal>
  );
}
