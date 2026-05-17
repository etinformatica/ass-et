import { useState } from 'react';
import { Badge, Btn, Avatar, Topbar, Icon, ProgressBar } from '../components/UI';
import { MAGAZZINO, ORDINI_FORNITORE } from '../data';

const CATEGORIE = ['Tutti', 'Storage', 'Memorie', 'Display', 'Batterie', 'Tastiere', 'Accessori'];
const TOP_MOV = [
  ['Vetro iPhone 12 nero', 14, '€ 490', 90],
  ['Pasta term. Kryonaut', 12, '€ 168', 77],
  ['SSD NVMe 1TB', 8, '€ 952', 62],
  ['Batteria iPad 9', 6, '€ 228', 46],
  ['Tastiera MBA M1', 4, '€ 596', 32],
];

export default function Magazzino() {
  const [cat, setCat] = useState('Tutti');
  const sottoscorta = MAGAZZINO.filter(a => a.sottoscorta);
  const filtered = cat === 'Tutti' ? MAGAZZINO : MAGAZZINO.filter(a => a.categoria === cat);

  return (
    <main className="main">
      <Topbar
        crumbs={['Magazzino']}
        right={
          <>
            <Btn size="sm">Inventario fisico</Btn>
            <Btn size="sm">Nuovo articolo</Btn>
            <Btn size="sm" tone="primary" icon="plus">Ordine fornitore</Btn>
          </>
        }
      />

      <div className="content">
        <div className="page-head">
          <div>
            <div className="page-title">Magazzino</div>
            <div className="page-sub">238 articoli · €8.420 a costo · €14.120 valore di vendita</div>
          </div>
          <div className="row center" style={{ gap: 6 }}>
            {CATEGORIE.map(c => (
              <Btn key={c} size="sm" tone={cat === c ? 'primary' : ''} onClick={() => setCat(c)}>{c}</Btn>
            ))}
          </div>
        </div>

        {/* KPI */}
        <div className="kpi-grid kpi-grid-4">
          <div className="card kpi">
            <div className="kpi-label">Sottoscorta</div>
            <div className="kpi-value" style={{ color: 'var(--hf-amber)' }}>3</div>
            <span className="kpi-trend down">↑ +1 vs ieri</span>
          </div>
          <div className="card kpi">
            <div className="kpi-label">In arrivo</div>
            <div className="kpi-value">7</div>
            <span className="kpi-trend flat">• €2.340 · 4 fornitori</span>
          </div>
          <div className="card kpi">
            <div className="kpi-label">Movimentati (30gg)</div>
            <div className="kpi-value">142</div>
            <span className="kpi-trend up">↑ +18% vs mese prec.</span>
          </div>
          <div className="card kpi">
            <div className="kpi-label">Margine atteso</div>
            <div className="kpi-value">€ 5.700</div>
            <span className="kpi-trend flat">• 40,4% medio</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 16 }}>
          {/* sottoscorta */}
          <div className="card" style={{ padding: 0, borderColor: 'var(--hf-amber)' }}>
            <div className="alert-banner">
              <span style={{ fontSize: 14 }}>⚠</span>
              <span style={{ fontWeight: 600, fontSize: 14 }}>Sottoscorta — azione richiesta</span>
              <Badge tone="amber" dot={false}>{sottoscorta.length} articoli</Badge>
              <div style={{ flex: 1 }} />
              <Btn size="sm" tone="accent">Genera ordine fornitore →</Btn>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th><span className="check on" /></th>
                  <th>Articolo</th>
                  <th>Stock</th>
                  <th>Min</th>
                  <th>Da ord.</th>
                  <th>Fornitore</th>
                  <th>€ cad.</th>
                </tr>
              </thead>
              <tbody>
                {sottoscorta.map(a => (
                  <tr key={a.sku}>
                    <td><span className="check on" /></td>
                    <td>
                      <div className="strong">{a.nome}</div>
                      <div className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{a.sku}</div>
                    </td>
                    <td>
                      <Badge tone={a.stock === 0 ? 'red' : 'amber'}>
                        {a.stock} / {a.minStock}
                      </Badge>
                    </td>
                    <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{a.minStock}</td>
                    <td className="strong">{a.minStock - a.stock}</td>
                    <td>{a.fornitore}</td>
                    <td className="mono">€ {a.costoAcq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="col" style={{ gap: 16 }}>
            {/* top movimentati */}
            <div className="card">
              <div className="card-title" style={{ marginBottom: 12 }}>Top movimentati (30gg)</div>
              <div className="col" style={{ gap: 10 }}>
                {TOP_MOV.map(([n, c, t, pct]) => (
                  <div key={n}>
                    <div className="row between" style={{ fontSize: 12, marginBottom: 3 }}>
                      <span style={{ fontWeight: 500 }}>{n}</span>
                      <span className="mono" style={{ color: 'var(--hf-text-3)' }}>×{c} · {t}</span>
                    </div>
                    <ProgressBar pct={pct} />
                  </div>
                ))}
              </div>
            </div>

            {/* ordini in arrivo */}
            <div className="card">
              <div className="row between" style={{ marginBottom: 10 }}>
                <div className="card-title">Ordini in arrivo</div>
                <Badge tone="amber" dot={false}>1 in ritardo</Badge>
              </div>
              <div className="col" style={{ gap: 10 }}>
                {ORDINI_FORNITORE.map((o, i) => (
                  <div
                    key={o.id}
                    className="row center"
                    style={{
                      gap: 10, paddingTop: i > 0 ? 10 : 0,
                      borderTop: i > 0 ? '1px solid var(--hf-border)' : 'none',
                    }}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="row center" style={{ gap: 6, marginBottom: 2 }}>
                        <span className="mono" style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{o.id}</span>
                        <Badge tone={o.stateTone}>{o.stato}</Badge>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{o.fornitore}</div>
                      <div style={{ fontSize: 11, color: 'var(--hf-text-3)' }}>{o.articoli}</div>
                    </div>
                    <div className="mono strong">€ {o.totale}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* catalogo articoli */}
        <div className="table-wrap">
          <div
            style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--hf-border)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 14 }}>Catalogo articoli</span>
            <Badge tone="gray" dot={false}>{filtered.length}</Badge>
            <div style={{ flex: 1 }} />
            <div className="search-box" style={{ minWidth: 240 }}>
              <Icon name="search" />
              <span style={{ color: 'var(--hf-text-3)', fontSize: 13 }}>SKU, nome…</span>
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Articolo</th>
                <th>Categoria</th>
                <th>Stock</th>
                <th>€ acq.</th>
                <th>€ vend.</th>
                <th>Margine</th>
                <th>Fornitore</th>
                <th>Rotazione</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.sku}>
                  <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{a.sku}</td>
                  <td className="strong">{a.nome}</td>
                  <td style={{ color: 'var(--hf-text-3)' }}>{a.categoria}</td>
                  <td>
                    <Badge tone={a.sottoscorta ? (a.stock === 0 ? 'red' : 'amber') : 'green'} dot={false}>
                      {a.stock}
                    </Badge>
                  </td>
                  <td className="mono" style={{ color: 'var(--hf-text-3)' }}>€ {a.costoAcq}</td>
                  <td className="mono strong">€ {a.prezzoVend}</td>
                  <td><Badge tone="accent">{a.margine}%</Badge></td>
                  <td style={{ color: 'var(--hf-text-2)' }}>{a.fornitore}</td>
                  <td className="mono" style={{ color: 'var(--hf-text-3)', fontSize: 11 }}>{a.rotazione}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
