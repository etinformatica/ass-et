import { Link } from 'react-router-dom';
import { Badge } from './UI';

// Renderer di un gruppo (testata + righe).
// renderActions(gruppo): nodi extra nella testata (es. ✎/🗑).
// renderRow(riga): personalizza la riga (es. editabile).
export function GruppoCarico({ gruppo, readonly = true, renderActions, renderRow }) {
  const dataStr = gruppo.data_carico ? new Date(gruppo.data_carico).toLocaleDateString('it-IT') : '—';
  return (
    <div style={{ borderTop: '1px solid var(--hf-border)' }}>
      <div style={{ padding: '10px 16px', background: 'var(--hf-surface-2)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <span className="mono" style={{ fontSize: 12, color: 'var(--hf-text-3)' }}>{dataStr}</span>
        <Badge tone="gray">Fatt. {gruppo.numero_fattura || '—'}</Badge>
        {gruppo.fornitore_id ? (
          <Link to={`/fornitori/${gruppo.fornitore_id}`} style={{ color: 'var(--hf-accent)', textDecoration: 'none', fontWeight: 500, fontSize: 13 }}>
            {gruppo.fornitore_nome}
          </Link>
        ) : (
          <span style={{ fontWeight: 500, fontSize: 13 }}>{gruppo.fornitore_nome || '— fornitore non assegnato —'}</span>
        )}
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: 'var(--hf-text-3)' }}>
          {gruppo.righe.length} articol{gruppo.righe.length === 1 ? 'o' : 'i'} · {gruppo.qtyTot} pezzi ·{' '}
        </span>
        <span className="mono strong" style={{ fontSize: 13 }}>€ {gruppo.totale.toFixed(2).replace('.', ',')}</span>
        {!readonly && renderActions && renderActions(gruppo)}
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Articolo</th><th>SKU</th>
            <th style={{ textAlign: 'right' }}>Q.</th>
            <th style={{ textAlign: 'right' }}>€ cad.</th>
            <th style={{ textAlign: 'right' }}>€ totale</th>
            {!readonly && <th></th>}
          </tr>
        </thead>
        <tbody>
          {gruppo.righe.map(r => renderRow ? renderRow(r) : (
            <tr key={r.id}>
              <td className="strong">{r.nome || '—'}</td>
              <td className="mono" style={{ color: 'var(--hf-text-3)' }}>{r.sku || '—'}</td>
              <td className="mono" style={{ textAlign: 'right' }}>{r.qty}</td>
              <td className="mono" style={{ textAlign: 'right', color: 'var(--hf-text-3)' }}>{r.costo_acq != null ? `€ ${r.costo_acq}` : '—'}</td>
              <td className="mono strong" style={{ textAlign: 'right' }}>€ {(Number(r.qty || 0) * Number(r.costo_acq || 0)).toFixed(2).replace('.', ',')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
