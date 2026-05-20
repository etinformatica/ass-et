// Stati intervento — fonte unica di verità.
// 'tone' è il colore del Badge (vedi src/index.css → .badge.<tone>).
export const STATI = [
  { stato: 'Accettazione',   tone: 'gray' },
  { stato: 'Diagnosi',       tone: 'gray' },
  { stato: 'Attesa pezzi',   tone: 'amber' },
  { stato: 'Attesa cliente', tone: 'blue' },
  { stato: 'In lavorazione', tone: 'violet' },
  { stato: 'Pronto',         tone: 'green' },
  { stato: 'Consegnato',     tone: 'gray' },
  { stato: 'Incassato',      tone: 'violet' },
  { stato: 'Non riparabile', tone: 'red' },
];

export const STATO_TONE = Object.fromEntries(STATI.map(s => [s.stato, s.tone]));

// Timeline lineare in dettaglio intervento (esclude lo stato "blocco" Non riparabile).
export const STATUS_TRACK = [
  'Accettazione', 'Diagnosi', 'Attesa pezzi', 'In lavorazione',
  'Pronto', 'Consegnato', 'Incassato',
];

// Stati considerati "chiusi positivamente" per la contabilità.
export const STATI_CHIUSI    = ['Consegnato', 'Incassato'];
export const STATO_DA_INCASSARE = 'Consegnato';
export const STATO_INCASSATO    = 'Incassato';
