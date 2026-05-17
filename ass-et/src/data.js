// Mock data for Ass-et — computer repair center management system

export const TICKETS = [
  { id: '2411', cliente: 'Bianchi Mario', tel: '349 12 34 567', email: 'm.bianchi@gmail.com', dispositivo: 'HP Pavilion 15', marca: 'HP', modello: 'Pavilion 15-ec0035nl', seriale: '5CD9472X3R', difetto: 'Non si avvia. La ventola gira ma lo schermo resta nero. Cliente dichiara caduta.', stato: 'Accettazione', statoTone: 'gray', tecnico: 'Luca M.', tecnicoTone: 'green', aperto: '15/05', maxPreventivo: 150, totaleStimato: null, margineAtteso: null, priorita: 'Normale', note: [], pezzi: [], attivita: [{ ts: '15/05 09:14', autore: 'Marco T.', tipo: 'accettazione', testo: 'Intervento accettato. Cliente segnala caduta.' }] },
  { id: '2410', cliente: 'Rossi Giulia', tel: '345 11 22 333', email: 'giulia.rossi@gmail.com', dispositivo: 'MacBook Air M1', marca: 'Apple', modello: 'MacBook Air M1 2021', seriale: 'C02G3QH4Q6L4', difetto: 'Tastiera bagnata di caffè. Non risponde la fila "asdf". Macchina si avvia, il resto funziona.', stato: 'Attesa pezzi', statoTone: 'amber', tecnico: 'Marco T.', tecnicoTone: 'blue', aperto: '13/05', maxPreventivo: 280, totaleStimato: 223, margineAtteso: 126, priorita: 'Normale', note: [], pezzi: [{ sku: 'KB-MBA-M1-IT', nome: 'Tastiera MBA M1 IT', qty: 1, costoAcq: 89, prezzoVend: 149, stato: 'In arrivo 18/05', stateTone: 'amber' }, { sku: 'PASTA-KRY', nome: 'Pasta termica Kryonaut', qty: 1, costoAcq: 8, prezzoVend: 14, stato: 'A stock', stateTone: 'green' }], attivita: [{ ts: '13/05 14:10', autore: 'Marco T.', tipo: 'accettazione', testo: 'Intervento accettato.' }, { ts: '13/05 14:12', autore: 'Sistema', tipo: 'sms', testo: 'SMS conferma inviato a Giulia · letto' }, { ts: '13/05 16:05', autore: 'Luca M.', tipo: 'diagnosi', testo: 'Confermato. Top-case da sostituire. Ordino il pezzo a RAMItalia.' }, { ts: '14/05 09:00', autore: 'Luca M.', tipo: 'stato', testo: 'Stato → Attesa pezzi · ordine O-0144 (RAMItalia)' }, { ts: '16/05 11:30', autore: 'RAMItalia', tipo: 'fornitore', testo: 'Conferma fornitore: consegna 18/05' }] },
  { id: '2409', cliente: 'Verdi srl', tel: '06 4455 778', email: 'admin@verdisrl.it', dispositivo: 'Dell OptiPlex 7090', marca: 'Dell', modello: 'OptiPlex 7090', seriale: 'HX4K29B', difetto: 'Molto lento, sospetto virus/malware. Avvio impiega 8 minuti.', stato: 'In lavorazione', statoTone: 'violet', tecnico: 'Luca M.', tecnicoTone: 'green', aperto: '13/05', maxPreventivo: 100, totaleStimato: 85, margineAtteso: 55, priorita: 'Normale', note: [], pezzi: [], attivita: [] },
  { id: '2408', cliente: 'Esposito Anna', tel: '349 55 66 777', email: 'anna.esposito@email.it', dispositivo: 'iPhone 12', marca: 'Apple', modello: 'iPhone 12 nero 128GB', seriale: 'F17D38XABC1', difetto: 'Vetro frontale rotto dopo caduta. Display funzionante.', stato: 'Pronto', statoTone: 'green', tecnico: 'Sara R.', tecnicoTone: 'amber', aperto: '12/05', maxPreventivo: 120, totaleStimato: 95, margineAtteso: 60, priorita: 'Normale', note: [], pezzi: [{ sku: 'GLASS-IPH12', nome: 'Vetro iPhone 12 nero', qty: 1, costoAcq: 18, prezzoVend: 35, stato: 'Usato', stateTone: 'green' }], attivita: [] },
  { id: '2407', cliente: 'Conti Paolo', tel: '333 22 11 444', email: 'paolo.conti@gmail.com', dispositivo: 'Lenovo IdeaPad', marca: 'Lenovo', modello: 'IdeaPad 3 15ALC6', seriale: 'PF3K8L01', difetto: 'HDD con rumori di click. Dati non accessibili. Non riparabile.', stato: 'Non riparabile', statoTone: 'red', tecnico: 'Luca M.', tecnicoTone: 'green', aperto: '12/05', maxPreventivo: 200, totaleStimato: 0, margineAtteso: 0, priorita: 'Bassa', note: [], pezzi: [], attivita: [] },
  { id: '2406', cliente: 'Studio Neri', tel: '02 8765 432', email: 'info@studioneri.it', dispositivo: 'HP LaserJet Pro', marca: 'HP', modello: 'LaserJet Pro M404n', seriale: 'PHBBK1234', difetto: 'Stampa con righe verticali nere. Tamburo difettoso.', stato: 'Consegnato', statoTone: 'gray', tecnico: 'Marco T.', tecnicoTone: 'blue', aperto: '11/05', maxPreventivo: 80, totaleStimato: 60, margineAtteso: 35, priorita: 'Bassa', note: [], pezzi: [], attivita: [] },
  { id: '2405', cliente: 'Romano Luigi', tel: '329 88 77 666', email: 'luigi.romano@hotmail.it', dispositivo: 'Asus ROG Strix', marca: 'Asus', modello: 'ROG Strix G15', seriale: 'G1501LDAS8', difetto: 'Surriscaldamento in gaming. Pasta termica esaurita, ventole sporche.', stato: 'In lavorazione', statoTone: 'violet', tecnico: 'Sara R.', tecnicoTone: 'amber', aperto: '10/05', maxPreventivo: 150, totaleStimato: 80, margineAtteso: 52, priorita: 'Normale', note: [], pezzi: [], attivita: [] },
  { id: '2404', cliente: 'Greco Lucia', tel: '347 11 22 333', email: 'lucia.greco@libero.it', dispositivo: 'iPad 9 gen', marca: 'Apple', modello: 'iPad 9a generazione 64GB', seriale: 'DMPRXHP1AAB', difetto: 'Batteria si scarica in 2 ore. Cliente vuole conferma preventivo.', stato: 'Attesa cliente', statoTone: 'blue', tecnico: 'Sara R.', tecnicoTone: 'amber', aperto: '10/05', maxPreventivo: 90, totaleStimato: 65, margineAtteso: 38, priorita: 'Bassa', note: [], pezzi: [], attivita: [] },
  { id: '2403', cliente: 'De Luca Filippo', tel: '340 33 44 555', email: 'filippo.deluca@gmail.com', dispositivo: 'Samsung S22', marca: 'Samsung', modello: 'Galaxy S22 256GB', seriale: 'R5CT108MLD0', difetto: 'Vetro retro rotto. Display ok. Solo estetico.', stato: 'Diagnosi', statoTone: 'gray', tecnico: 'Sara R.', tecnicoTone: 'amber', aperto: '09/05', maxPreventivo: 140, totaleStimato: null, margineAtteso: null, priorita: 'Bassa', note: [], pezzi: [], attivita: [] },
  { id: '2402', cliente: 'Caputo Marco', tel: '335 55 66 777', email: 'm.caputo@gmail.com', dispositivo: 'HP Envy 13', marca: 'HP', modello: 'Envy 13-ba1011nl', seriale: 'CND1299PK5', difetto: 'Non carica + alcuni tasti non funzionano. Connettore danneggiato.', stato: 'Attesa pezzi', statoTone: 'amber', tecnico: 'Luca M.', tecnicoTone: 'green', aperto: '09/05', maxPreventivo: 170, totaleStimato: 140, margineAtteso: 80, priorita: 'Normale', note: [], pezzi: [], attivita: [] },
  { id: '2401', cliente: 'Marini Andrea', tel: '333 77 88 999', email: 'andrea.marini@gmail.com', dispositivo: 'iMac 2019', marca: 'Apple', modello: 'iMac 27" 2019', seriale: 'C02Z2KGKMD6N', difetto: 'Si spegne dopo 1 ora di utilizzo. Probabile problema alimentatore o termica.', stato: 'Diagnosi', statoTone: 'gray', tecnico: 'Marco T.', tecnicoTone: 'blue', aperto: '08/05', maxPreventivo: 220, totaleStimato: null, margineAtteso: null, priorita: 'Urgente', note: [], pezzi: [], attivita: [] },
];

export const CLIENTI = [
  { id: 'C001', nome: 'Bianchi Mario', tel: '349 12 34 567', email: 'm.bianchi@gmail.com', cf: 'BNCMRA70R12A944J', tipo: 'Privato', interventi: 3, spesaTotale: 285, primoIntervento: '2023-04-12', ultimoIntervento: '15/05/2026' },
  { id: 'C002', nome: 'Rossi Giulia', tel: '345 11 22 333', email: 'giulia.rossi@gmail.com', cf: 'RSSGLA92T61L219X', tipo: 'Privato', interventi: 4, spesaTotale: 980, primoIntervento: '2022-09-01', ultimoIntervento: '13/05/2026' },
  { id: 'C003', nome: 'Verdi srl', tel: '06 4455 778', email: 'admin@verdisrl.it', cf: '03941200510', tipo: 'Azienda', interventi: 12, spesaTotale: 4200, primoIntervento: '2021-01-15', ultimoIntervento: '13/05/2026' },
  { id: 'C004', nome: 'Esposito Anna', tel: '349 55 66 777', email: 'anna.esposito@email.it', cf: 'SPSNN90P65A509R', tipo: 'Privato', interventi: 2, spesaTotale: 190, primoIntervento: '2024-06-20', ultimoIntervento: '12/05/2026' },
  { id: 'C005', nome: 'Conti Paolo', tel: '333 22 11 444', email: 'paolo.conti@gmail.com', cf: 'CNTPLA85T14H501M', tipo: 'Privato', interventi: 1, spesaTotale: 0, primoIntervento: '12/05/2026', ultimoIntervento: '12/05/2026' },
  { id: 'C006', nome: 'Studio Neri', tel: '02 8765 432', email: 'info@studioneri.it', cf: '07812300158', tipo: 'Azienda', interventi: 7, spesaTotale: 1840, primoIntervento: '2022-03-10', ultimoIntervento: '11/05/2026' },
  { id: 'C007', nome: 'Romano Luigi', tel: '329 88 77 666', email: 'luigi.romano@hotmail.it', cf: 'RMNLGU88P20G702K', tipo: 'Privato', interventi: 2, spesaTotale: 220, primoIntervento: '2024-11-05', ultimoIntervento: '10/05/2026' },
];

export const MAGAZZINO = [
  { sku: 'SSD-1TB-NVME', nome: 'SSD NVMe 1TB Crucial P3', categoria: 'Storage', stock: 2, minStock: 5, costoAcq: 62, prezzoVend: 119, fornitore: 'DigitalParts', margine: 48, rotazione: '8 gg', sottoscorta: true },
  { sku: 'SSD-500-NVME', nome: 'SSD NVMe 500GB Crucial', categoria: 'Storage', stock: 7, minStock: 3, costoAcq: 38, prezzoVend: 75, fornitore: 'DigitalParts', margine: 49, rotazione: '7 gg', sottoscorta: false },
  { sku: 'SSD-2TB-NVME', nome: 'SSD NVMe 2TB Crucial P3', categoria: 'Storage', stock: 3, minStock: 2, costoAcq: 118, prezzoVend: 219, fornitore: 'DigitalParts', margine: 46, rotazione: '15 gg', sottoscorta: false },
  { sku: 'RAM-16-DDR4', nome: 'RAM 16GB DDR4 SODIMM', categoria: 'Memorie', stock: 9, minStock: 4, costoAcq: 38, prezzoVend: 75, fornitore: 'RAMItalia', margine: 49, rotazione: '9 gg', sottoscorta: false },
  { sku: 'RAM-8-DDR4', nome: 'RAM 8GB DDR4 SODIMM', categoria: 'Memorie', stock: 6, minStock: 3, costoAcq: 22, prezzoVend: 45, fornitore: 'RAMItalia', margine: 51, rotazione: '11 gg', sottoscorta: false },
  { sku: 'GLASS-IPH12', nome: 'Vetro iPhone 12 nero', categoria: 'Display', stock: 12, minStock: 5, costoAcq: 18, prezzoVend: 35, fornitore: 'PhonePartsEU', margine: 49, rotazione: '3 gg', sottoscorta: false },
  { sku: 'GLASS-IPH13', nome: 'Vetro iPhone 13 nero', categoria: 'Display', stock: 8, minStock: 4, costoAcq: 22, prezzoVend: 42, fornitore: 'PhonePartsEU', margine: 48, rotazione: '5 gg', sottoscorta: false },
  { sku: 'BATT-IPAD9', nome: 'Batteria iPad 9 gen', categoria: 'Batterie', stock: 5, minStock: 3, costoAcq: 24, prezzoVend: 38, fornitore: 'PhonePartsEU', margine: 37, rotazione: '12 gg', sottoscorta: false },
  { sku: 'PASTA-KRY', nome: 'Pasta termica Kryonaut 1g', categoria: 'Accessori', stock: 1, minStock: 4, costoAcq: 8, prezzoVend: 14, fornitore: 'DigitalParts', margine: 43, rotazione: '6 gg', sottoscorta: true },
  { sku: 'KB-MBA-M1-IT', nome: 'Tastiera MacBook Air M1 IT', categoria: 'Tastiere', stock: 0, minStock: 2, costoAcq: 89, prezzoVend: 149, fornitore: 'RAMItalia', margine: 40, rotazione: '18 gg', sottoscorta: true },
  { sku: 'CHARGER-USB-C', nome: 'Alimentatore USB-C 65W', categoria: 'Accessori', stock: 4, minStock: 3, costoAcq: 18, prezzoVend: 35, fornitore: 'DigitalParts', margine: 49, rotazione: '10 gg', sottoscorta: false },
];

export const ORDINI_FORNITORE = [
  { id: 'O-0142', fornitore: 'DigitalParts', articoli: 'SSD 1TB ×3, RAM 16GB ×2', totale: 420, stato: 'In ritardo', stateTone: 'red', data: 'atteso 10/05' },
  { id: 'O-0143', fornitore: 'PhonePartsEU', articoli: 'Vetri iPhone 13 ×4', totale: 220, stato: 'In transito', stateTone: 'gray', data: '17/05' },
  { id: 'O-0144', fornitore: 'RAMItalia', articoli: 'Tastiera MBA M1 IT ×1', totale: 95, stato: 'In transito', stateTone: 'gray', data: '18/05' },
];

export const TECNICI = [
  { id: 'luca', nome: 'Luca M.', tone: 'green', ruolo: 'Tecnico laboratorio', interventiAttivi: 5 },
  { id: 'marco', nome: 'Marco T.', tone: 'blue', ruolo: 'Tecnico banco', interventiAttivi: 3 },
  { id: 'sara', nome: 'Sara R.', tone: 'amber', ruolo: 'Tecnico laboratorio', interventiAttivi: 4 },
];

export const STATUS_OPTIONS = [
  { id: 'Accettazione', tone: 'gray' },
  { id: 'Diagnosi', tone: 'gray' },
  { id: 'Attesa pezzi', tone: 'amber' },
  { id: 'Attesa cliente', tone: 'blue' },
  { id: 'In lavorazione', tone: 'violet' },
  { id: 'Pronto', tone: 'green' },
  { id: 'Consegnato', tone: 'gray' },
  { id: 'Non riparabile', tone: 'red' },
];

export const STATUS_TRACK = ['Accettazione', 'Diagnosi', 'Attesa pezzi', 'In lavorazione', 'Pronto', 'Consegnato'];

export const KPI_DASHBOARD = {
  interventiAttivi: 49,
  prontiRitiro: 7,
  attesaPezzi: 5,
  incassoOggi: '€ 1.240',
  margineMese: '€ 6.480',
};

export const KPI_CONTABILITA = {
  ricavi: '€ 18.420',
  costiPezzi: '€ 6.180',
  manodopera: '€ 1.250',
  margineLordo: '€ 10.990',
  marginePerc: '59,7%',
  interventi: 142,
};

export const AVATAR_TONES = {
  'Luca M.': 'green',
  'Marco T.': 'blue',
  'Sara R.': 'amber',
};
