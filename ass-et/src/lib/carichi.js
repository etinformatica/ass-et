// Raggruppa una lista di carichi_magazzino per "documento" virtuale:
// chiave = (fornitore_id | nome testuale) + numero_fattura + data_carico.
// Restituisce un array ordinato per data desc.
export function groupByFattura(carichi) {
  const map = new Map();
  for (const c of carichi || []) {
    const fid = c.fornitore_id || `tx:${c.fornitore || ''}`;
    const key = `${fid}|${c.numero_fattura || ''}|${c.data_carico || ''}`;
    if (!map.has(key)) {
      map.set(key, {
        key,
        fornitore_id: c.fornitore_id || null,
        fornitore_nome: c.fornitore_rel?.nome || c.fornitore || null,
        numero_fattura: c.numero_fattura || null,
        data_carico: c.data_carico || null,
        righe: [],
      });
    }
    map.get(key).righe.push(c);
  }
  const out = Array.from(map.values()).map(g => ({
    ...g,
    qtyTot: g.righe.reduce((s, r) => s + Number(r.qty || 0), 0),
    totale: g.righe.reduce((s, r) => s + Number(r.qty || 0) * Number(r.costo_acq || 0), 0),
  }));
  out.sort((a, b) => (b.data_carico || '').localeCompare(a.data_carico || ''));
  return out;
}
