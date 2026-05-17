// Flussi storyboard — 3 sequenze: chiusura+incasso, ordine fornitore, ritiro/consegna

// Helper: little step header card
const StepCap = ({ n, title, sub }) => (
  <div className="row gap-3" style={{ alignItems:'center', position:'absolute', top:-46, left:0 }}>
    <div className="hand" style={{
      width:36, height:36, borderRadius:'50%', background:'var(--ink)', color:'var(--paper)',
      display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:700
    }}>{n}</div>
    <div>
      <div className="hand lg" style={{ lineHeight:1 }}>{title}</div>
      {sub && <div className="mono tiny muted">{sub}</div>}
    </div>
  </div>
);

// =============================================================
// FLOW 1 · Chiusura intervento + incasso
// =============================================================

const F1_S1 = () => (
  // technico chiude lavoro → schermata intervento, "marca come pronto"
  <div className="sheet" style={{ display:'flex' }}>
    <Sidebar active="tickets" />
    <div style={{ flex:1, padding:'18px 22px', display:'flex', flexDirection:'column', gap:14, minWidth:0 }}>
      <div>
        <div className="mono xs muted">SCHEDA INTERVENTO #2410 · in lavorazione</div>
        <div className="title">Rossi Giulia <span className="muted">·</span> MacBook Air M1</div>
      </div>
      <div className="row gap-3" style={{ flex:1, minHeight:0 }}>
        <div className="col gap-3 grow" style={{ minWidth:0 }}>
          <Box>
            <div className="hand lg">Riepilogo finale</div>
            <HR />
            <table className="tbl">
              <thead><tr><th>Articolo</th><th>Q.</th><th>€ cad.</th><th>€ tot</th></tr></thead>
              <tbody>
                <tr><td className="hand md">Tastiera MBA M1 IT</td><td>1</td><td>€ 149</td><td className="hand md">€ 149,00</td></tr>
                <tr><td className="hand md">Pasta termica Kryonaut</td><td>1</td><td>€ 14</td><td className="hand md">€ 14,00</td></tr>
                <tr><td className="hand md">Manodopera (1,5h)</td><td>1,5</td><td>€ 40</td><td className="hand md">€ 60,00</td></tr>
                <tr><td className="hand md">Pulizia interna</td><td>1</td><td>€ 25</td><td className="hand md">€ 25,00</td></tr>
              </tbody>
            </table>
            <HR />
            <div className="col gap-2" style={{ marginTop:6, fontSize:14 }}>
              <div className="row between"><span className="muted">Pezzi</span><span className="hand md">€ 163,00</span></div>
              <div className="row between"><span className="muted">Manodopera</span><span className="hand md">€ 85,00</span></div>
              <div className="row between"><span className="muted">Sconto fedeltà</span><span className="hand md" style={{color:'var(--warn)'}}>−€ 8,00</span></div>
              <div className="row between"><span className="hand md">Totale (iva incl.)</span><span className="hand xl"><span className="hi-mark">€ 240,00</span></span></div>
            </div>
          </Box>

          <Box>
            <div className="hand lg">Note di chiusura (al cliente)</div>
            <HR />
            <div className="box thin" style={{ background:'#fff', padding:10, marginTop:6, minHeight:70 }}>
              <span className="hand md">Sostituita tastiera completa. Pulito coperchio inferiore da residui di liquido. Pasta termica nuova su CPU. Test funzionale: 100% tasti OK, batteria 92% salute, temperature in idle 35°C.</span>
            </div>
          </Box>
        </div>

        <Box style={{ width:340 }} className="fill-2">
          <div className="hand lg">Prossimo passo →</div>
          <HR />
          <div className="hand md" style={{ marginTop:6 }}>
            Tutto in regola. Marca l'intervento come <b>pronto per ritiro</b> e avvisa la cliente.
          </div>
          <div className="col gap-2" style={{ marginTop:10 }}>
            <Chk on>Cambia stato → <b>pronto per ritiro</b></Chk>
            <Chk on>Invia SMS a 345 11 22 333</Chk>
            <Chk on>Genera preavviso fattura</Chk>
            <Chk>Stampa scheda di consegna</Chk>
          </div>
          <HR style={{ margin:'10px 0' }} />
          <div className="mono tiny muted">ANTEPRIMA SMS:</div>
          <div className="box thin" style={{ background:'#fff', padding:8, marginTop:4, fontSize:13 }}>
            "Ciao Giulia! Il tuo MacBook è pronto. Importo €240. Passa quando vuoi entro le 19. — Ass-et 051 1234567"
          </div>
          <Btn tone="primary" size="lg" style={{ marginTop:12 }}>✓ pronto + SMS</Btn>
        </Box>
      </div>
    </div>
  </div>
);

const F1_S2 = () => (
  // cliente arriva al banco → cerca intervento
  <div className="sheet" style={{ display:'flex', flexDirection:'column' }}>
    <div className="row between" style={{ padding:'14px 22px', borderBottom:'1.6px solid var(--rule)', alignItems:'center' }}>
      <Logo />
      <div className="hand lg">Ritiro / consegna al banco</div>
      <Btn size="sm">esci</Btn>
    </div>
    <div style={{ flex:1, padding:24, display:'flex', flexDirection:'column', alignItems:'center', gap:18 }}>
      <div className="title" style={{ fontSize:44, textAlign:'center' }}>
        Cerca l'intervento da consegnare
      </div>
      <div className="subtitle">scansiona la bolla, inserisci il numero o cerca per cliente</div>

      <Box style={{ width:'70%', maxWidth:600, padding:22 }}>
        <div className="row gap-2">
          <Box className="grow" style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span className="hand lg">🔍</span>
            <span className="hand" style={{ fontSize:24 }}>#2410</span>
            <span className="muted hand md" style={{ marginLeft:'auto' }}>(o nome cliente, telefono…)</span>
          </Box>
          <Btn tone="primary" size="lg">cerca →</Btn>
        </div>
        <div className="row gap-2" style={{ marginTop:12, alignItems:'center' }}>
          <span className="mono tiny muted">OPPURE:</span>
          <Btn size="sm">📷 scansiona QR bolla</Btn>
          <Btn size="sm">📋 lista pronti (7)</Btn>
        </div>
      </Box>

      <Box style={{ width:'70%', maxWidth:600 }} hi>
        <div className="hand lg">Match trovato</div>
        <HR />
        <div className="row between" style={{ marginTop:8 }}>
          <div>
            <div className="hand" style={{ fontSize:30, lineHeight:1 }}>Rossi Giulia</div>
            <div className="hand md">#2410 · MacBook Air M1 · pronto da 2h</div>
            <div className="mono tiny muted">Tel 345 11 22 333 · ingresso 13/05</div>
          </div>
          <div style={{ textAlign:'right' }}>
            <div className="mono tiny muted">DA INCASSARE</div>
            <div className="title">€ 240,00</div>
          </div>
        </div>
        <Btn tone="primary" size="lg" style={{ marginTop:12, width:'100%', justifyContent:'center' }}>apri consegna →</Btn>
      </Box>
    </div>
  </div>
);

const F1_S3 = () => (
  // Schermata di consegna + cassa
  <div className="sheet" style={{ display:'flex' }}>
    <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
      <div className="row between" style={{ padding:'12px 22px', borderBottom:'1.6px solid var(--rule)', alignItems:'center' }}>
        <div>
          <div className="mono tiny muted">CONSEGNA · #2410</div>
          <div className="title">Rossi Giulia <span className="muted">·</span> MacBook Air M1</div>
        </div>
        <Pill tone="ok">pronto per ritiro · 2h fa</Pill>
      </div>

      <div style={{ flex:1, display:'flex', gap:14, padding:18, minHeight:0 }}>
        <div className="col gap-3 grow">
          <Box>
            <div className="hand lg">Lavoro eseguito</div>
            <HR />
            <table className="tbl">
              <tbody>
                <tr><td className="hand md">Tastiera MBA M1 IT</td><td className="mono xs">×1</td><td className="hand md">€ 149,00</td></tr>
                <tr><td className="hand md">Pasta termica Kryonaut</td><td className="mono xs">×1</td><td className="hand md">€ 14,00</td></tr>
                <tr><td className="hand md">Manodopera (1,5h)</td><td className="mono xs">×1,5</td><td className="hand md">€ 60,00</td></tr>
                <tr><td className="hand md">Pulizia interna</td><td className="mono xs">×1</td><td className="hand md">€ 25,00</td></tr>
                <tr><td className="hand md">Sconto fedeltà</td><td></td><td className="hand md" style={{color:'var(--warn)'}}>−€ 8,00</td></tr>
              </tbody>
            </table>
          </Box>

          <Box>
            <div className="hand lg">Controllo consegna</div>
            <HR />
            <div className="col gap-2" style={{ marginTop:6 }}>
              <Chk on>Dispositivo consegnato e provato davanti al cliente</Chk>
              <Chk on>Accessori restituiti (alimentatore, custodia)</Chk>
              <Chk on>Bolla di accettazione riconsegnata firmata</Chk>
              <Chk>Bagaglio dati restituito (HDD vecchio / chiavetta)</Chk>
              <Chk on>Spiegata garanzia 90gg sul pezzo sostituito</Chk>
            </div>
          </Box>
        </div>

        <Box style={{ width:380, padding:14 }}>
          <span className="ribbon">cassa</span>
          <div className="title" style={{ fontSize:50, lineHeight:1, marginTop:8 }}><span className="hi-mark">€ 240,00</span></div>
          <div className="mono xs muted">iva 22% inclusa · imp. € 196,72</div>

          <HR style={{ margin:'12px 0' }} />

          <div className="hand md">Pagamento</div>
          <div className="row gap-2 wrap" style={{ marginTop:6 }}>
            <Pill tone="dark">contanti</Pill>
            <Pill tone="hi">POS ●</Pill>
            <Pill>bonifico</Pill>
            <Pill>fattura aziende</Pill>
            <Pill>split</Pill>
          </div>

          <div className="col gap-3" style={{ marginTop:14 }}>
            <Field label="Importo ricevuto" value="€ 240,00" w="100%" box />
            <Field label="Resto" value="€ 0,00" w="100%" box />
          </div>

          <HR style={{ margin:'10px 0' }} />

          <div className="hand md">Documento</div>
          <div className="row gap-2 wrap" style={{ marginTop:4 }}>
            <Rad on>scontrino</Rad>
            <Rad>fattura privato</Rad>
            <Rad>fattura elettronica</Rad>
          </div>

          <div className="col gap-2" style={{ marginTop:10 }}>
            <Chk on>Invia ricevuta via email</Chk>
            <Chk on>Cambia stato → <b>consegnato</b></Chk>
            <Chk>Chiedi recensione Google in 24h</Chk>
          </div>

          <Btn tone="primary" size="lg" style={{ marginTop:14, width:'100%', justifyContent:'center', fontSize:22 }}>
            ✓ INCASSA + STAMPA
          </Btn>
        </Box>
      </div>
    </div>
  </div>
);

const F1_S4 = () => (
  // conferma — registrazione in contabilità
  <div className="sheet" style={{ display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:20, padding:30 }}>
    <div className="hand" style={{ fontSize:120, color:'var(--ok)' }}>✓</div>
    <div className="title" style={{ fontSize:54, textAlign:'center' }}>
      Consegnato. <span className="hi-mark">€ 240</span> incassati.
    </div>
    <div className="subtitle">Intervento #2410 chiuso · scontrino stampato · scaricati 2 pezzi dal magazzino</div>

    <div className="row gap-3" style={{ marginTop:18 }}>
      <Box style={{ minWidth:200 }}>
        <div className="mono tiny muted" style={{ textTransform:'uppercase' }}>Ricavo</div>
        <div className="hand xl">€ 240,00</div>
      </Box>
      <Box style={{ minWidth:200 }}>
        <div className="mono tiny muted" style={{ textTransform:'uppercase' }}>Costo pezzi</div>
        <div className="hand xl">€ 97,00</div>
      </Box>
      <Box style={{ minWidth:200 }} hi>
        <div className="mono tiny muted" style={{ textTransform:'uppercase' }}>Margine</div>
        <div className="hand xl">€ 143,00 · 59,6%</div>
      </Box>
    </div>

    <div className="hr" style={{ margin:'10px 0', width:'60%' }}></div>

    <div className="col gap-2" style={{ alignItems:'center', maxWidth:500, fontSize:15 }}>
      <span className="mono tiny muted">REGISTRATO AUTOMATICAMENTE IN:</span>
      <div className="row gap-2 wrap" style={{ justifyContent:'center' }}>
        <Pill tone="dark">contabilità · ricavi mag.</Pill>
        <Pill tone="dark">scarico magazzino ×2</Pill>
        <Pill tone="dark">storico cliente</Pill>
        <Pill tone="dark">report tecnico (Luca)</Pill>
      </div>
    </div>

    <div className="row gap-3" style={{ marginTop:20 }}>
      <Btn>vedi scheda intervento</Btn>
      <Btn>vedi scheda cliente</Btn>
      <Btn tone="primary" size="lg">+ prossimo cliente →</Btn>
    </div>
  </div>
);

// =============================================================
// FLOW 2 · Ordine fornitore end-to-end
// =============================================================

const F2_S1 = () => (
  // Step 1 — proposta automatica dal sistema (sottoscorta o riservati)
  <div className="sheet" style={{ display:'flex' }}>
    <Sidebar active="warehouse" />
    <div style={{ flex:1, padding:'18px 22px', display:'flex', flexDirection:'column', gap:14 }}>
      <div className="row between" style={{ alignItems:'flex-end' }}>
        <div>
          <div className="mono xs muted">MAGAZZINO / ORDINI / NUOVO</div>
          <div className="title">Nuovo ordine fornitore</div>
          <div className="subtitle">Suggerimento del sistema in base a sottoscorta e pezzi riservati</div>
        </div>
        <div className="row gap-2">
          <Btn size="sm">parti da zero</Btn>
          <Btn size="sm" tone="hi">accetta suggerimento ▾</Btn>
        </div>
      </div>

      <Box hi>
        <div className="hand lg">⚡ Suggerimento automatico</div>
        <HR />
        <div className="hand md" style={{ marginTop:6 }}>
          Hai <b>3 articoli sottoscorta</b> e <b>2 pezzi riservati</b> su interventi aperti.
          Conviene fare un unico ordine a <b>DigitalParts srl</b> (5 articoli, € 480 totali).
        </div>
        <div className="row gap-2" style={{ marginTop:8 }}>
          <Btn size="sm">vedi solo sottoscorta</Btn>
          <Btn size="sm">solo riservati su interventi</Btn>
          <Btn size="sm" tone="primary">aggiungi tutto al nuovo ordine →</Btn>
        </div>
      </Box>

      <div className="row gap-3" style={{ flex:1, minHeight:0 }}>
        <Box className="grow">
          <div className="hand lg">Articoli da ordinare</div>
          <HR />
          <table className="tbl">
            <thead><tr><th><Chk on /></th><th>Articolo</th><th>Stock</th><th>Riservati</th><th>Da ord.</th><th>Fornitore</th><th>€ cad.</th><th>Per</th></tr></thead>
            <tbody>
              <tr><td><Chk on /></td><td className="hand md">SSD NVMe 1TB Crucial</td><td><Pill tone="warn">2/5</Pill></td><td>1 (#2410)</td><td className="hand md">3</td><td>DigitalParts ★</td><td className="mono xs">€ 62</td><td className="xs muted">scorta + #2410</td></tr>
              <tr><td><Chk on /></td><td className="hand md">Pasta term. Kryonaut</td><td><Pill tone="warn">1/4</Pill></td><td>0</td><td className="hand md">3</td><td>DigitalParts ★</td><td className="mono xs">€ 8</td><td className="xs muted">scorta</td></tr>
              <tr><td><Chk on /></td><td className="hand md">Tastiera MBA M1 IT</td><td><Pill tone="warn">0/2</Pill></td><td>1 (#2410)</td><td className="hand md">2</td><td>RAMItalia</td><td className="mono xs">€ 89</td><td className="xs muted"><span className="annot">⚠ fornitore diverso!</span></td></tr>
              <tr><td><Chk on /></td><td className="hand md">RAM 16GB DDR5</td><td><Pill tone="warn">4/6</Pill></td><td>0</td><td className="hand md">2</td><td>RAMItalia</td><td className="mono xs">€ 48</td><td className="xs muted">scorta</td></tr>
              <tr><td><Chk /></td><td className="hand md">Vetro iPhone 13</td><td><Pill tone="warn">1/3</Pill></td><td>0</td><td className="hand md">2</td><td>PhonePartsEU</td><td className="mono xs">€ 28</td><td className="xs muted">scorta</td></tr>
            </tbody>
          </table>
        </Box>

        <Box style={{ width:300 }} className="fill-2">
          <div className="hand lg">Raggruppa per fornitore</div>
          <HR />
          <div className="col gap-3" style={{ marginTop:6 }}>
            <div className="box thin" style={{ background:'#fff', padding:10 }}>
              <div className="row between"><span className="hand md">DigitalParts ★</span><Pill tone="dark">2 art.</Pill></div>
              <div className="mono tiny muted">€ 210 · cons. 2-3gg</div>
            </div>
            <div className="box thin" style={{ background:'#fff', padding:10 }}>
              <div className="row between"><span className="hand md">RAMItalia</span><Pill tone="dark">2 art.</Pill></div>
              <div className="mono tiny muted">€ 274 · cons. 1-2gg</div>
            </div>
          </div>
          <HR style={{ margin:'10px 0' }} />
          <div className="hand md">Totale ordine</div>
          <div className="title">€ 484,00</div>
          <Btn tone="primary" size="lg" style={{ marginTop:12, width:'100%', justifyContent:'center' }}>
            crea 2 ordini →
          </Btn>
        </Box>
      </div>
    </div>
  </div>
);

const F2_S2 = () => (
  // ordine creato → invio
  <div className="sheet" style={{ display:'flex' }}>
    <Sidebar active="warehouse" />
    <div style={{ flex:1, padding:'18px 22px', display:'flex', flexDirection:'column', gap:14 }}>
      <TopBar
        title="Ordine O-0145 · DigitalParts srl"
        sub="Bozza · da inviare al fornitore"
        breadcrumbs="MAGAZZINO / ORDINI / O-0145"
        right={<>
          <Btn size="sm">stampa PDF</Btn>
          <Btn size="sm">scarica XML</Btn>
          <Btn size="sm" tone="primary">📧 invia al fornitore</Btn>
        </>}
      />

      <div className="row gap-3" style={{ flex:1, minHeight:0 }}>
        <Box className="grow">
          <div className="hand lg">Articoli</div>
          <HR />
          <table className="tbl">
            <thead><tr><th>SKU</th><th>Articolo</th><th>Q.</th><th>€ cad.</th><th>€ tot</th><th>Per</th></tr></thead>
            <tbody>
              <tr><td className="mono xs">SSD-1TB-NVME</td><td className="hand md">SSD NVMe 1TB Crucial P3</td><td>3</td><td>€ 62</td><td className="hand md">€ 186,00</td><td className="xs muted">scorta + #2410</td></tr>
              <tr><td className="mono xs">PASTA-KRY</td><td className="hand md">Pasta term. Kryonaut 1g</td><td>3</td><td>€ 8</td><td className="hand md">€ 24,00</td><td className="xs muted">scorta</td></tr>
            </tbody>
          </table>
          <HR />
          <div className="row between"><span className="hand md">Totale (iva escl.)</span><span className="hand xl"><span className="hi-mark">€ 210,00</span></span></div>

          <HR style={{ margin:'14px 0' }} />
          <div className="hand lg">Anteprima email al fornitore</div>
          <div className="box thin" style={{ background:'#fff', padding:12, marginTop:6, fontSize:14, lineHeight:1.4 }}>
            <div><b>A:</b> ordini@digitalparts.it</div>
            <div><b>Oggetto:</b> Ordine Ass-et · O-0145 del 16/05/2026</div>
            <HR />
            <p>Buongiorno,<br/>vi inoltro l'ordine n. O-0145 in allegato (PDF + XML).</p>
            <p>Articoli:<br/>
            – 3× SSD NVMe 1TB Crucial P3 (SKU SSD-1TB-NVME)<br/>
            – 3× Pasta term. Kryonaut 1g (SKU PASTA-KRY)</p>
            <p>Consegna richiesta: prima possibile.<br/>Grazie,<br/>Marco · Ass-et</p>
          </div>
        </Box>

        <Box style={{ width:300 }} className="fill-2">
          <div className="hand lg">Riepilogo</div>
          <HR />
          <table className="tbl">
            <tbody>
              <tr><td className="muted">Fornitore</td><td className="hand md">DigitalParts srl</td></tr>
              <tr><td className="muted">Email ordini</td><td className="mono xs">ordini@digitalparts.it</td></tr>
              <tr><td className="muted">Pagamento</td><td>30gg DF</td></tr>
              <tr><td className="muted">Cons. attesa</td><td>2-3gg</td></tr>
              <tr><td className="muted">Articoli</td><td className="hand md">2 · 6 pezzi</td></tr>
              <tr><td className="muted">Totale</td><td className="hand md">€ 210,00</td></tr>
            </tbody>
          </table>
          <HR style={{ margin:'10px 0' }} />
          <div className="col gap-2">
            <Chk on>Riserva pezzi su interventi collegati</Chk>
            <Chk on>Aggiorna stato #2410 → <b>attesa pezzi</b></Chk>
            <Chk>Crea promemoria sollecito (5gg)</Chk>
          </div>
          <Btn tone="primary" size="lg" style={{ marginTop:12, width:'100%', justifyContent:'center' }}>📧 invia ora</Btn>
        </Box>
      </div>
    </div>
  </div>
);

const F2_S3 = () => (
  // ordine in transito → tracking
  <div className="sheet" style={{ display:'flex' }}>
    <Sidebar active="warehouse" />
    <div style={{ flex:1, padding:'18px 22px', display:'flex', flexDirection:'column', gap:14 }}>
      <div className="row between" style={{ alignItems:'flex-end' }}>
        <div>
          <span className="ribbon">tracking ordine</span>
          <div className="title" style={{ marginTop:6 }}>O-0145 · in arrivo</div>
          <div className="subtitle">Atteso il 18/05 · DigitalParts srl · DDT confermato</div>
        </div>
        <div className="row gap-2">
          <Btn size="sm">📞 fornitore</Btn>
          <Btn size="sm">sollecita</Btn>
          <Btn size="sm" tone="primary">▶ ricevi carico</Btn>
        </div>
      </div>

      {/* Timeline orizzontale */}
      <Box style={{ padding:'18px 22px' }}>
        <div className="row" style={{ alignItems:'center', justifyContent:'space-between' }}>
          {[
            ['Ordine creato','✓','16/05 09:42','ok'],
            ['Inviato al fornitore','✓','16/05 09:45','ok'],
            ['Confermato','✓','16/05 11:30','ok'],
            ['In transito','●','17/05 — ora','hi'],
            ['Ricevuto','○','18/05 atteso',''],
            ['Caricato a stock','○','—',''],
          ].map(([n,m,d,t],i,arr) => (
            <React.Fragment key={n}>
              <div className="col center" style={{ width:120, gap:4 }}>
                <div className="hand" style={{
                  width:46, height:46, borderRadius:'50%',
                  border:'2px solid var(--rule)',
                  background: t==='ok'?'var(--ok)':t==='hi'?'var(--hi)':'#fff',
                  color: t==='ok'?'#fff':'var(--ink)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:24, fontWeight:700
                }}>{m}</div>
                <div className="hand md" style={{ textAlign:'center', lineHeight:1.1 }}>{n}</div>
                <div className="mono tiny muted">{d}</div>
              </div>
              {i<arr.length-1 && <div style={{ flex:1, height:3, background: i<2 ? 'var(--ink)' : i===2 ? 'var(--hi)' : 'var(--rule)', opacity: i<3?1:0.3, margin:'0 -10px' }}></div>}
            </React.Fragment>
          ))}
        </div>
      </Box>

      <div className="row gap-3" style={{ flex:1 }}>
        <Box className="grow">
          <div className="hand lg">Interventi in attesa di questi pezzi</div>
          <HR />
          <table className="tbl">
            <thead><tr><th>Intervento</th><th>Cliente</th><th>Pezzo</th><th>Cliente avvisato</th></tr></thead>
            <tbody>
              <tr><td className="mono xs">#2410</td><td className="hand md">Rossi Giulia</td><td>SSD 1TB (×1)</td><td><Pill tone="ok">SMS 16/05</Pill></td></tr>
              <tr><td className="mono xs">#2402</td><td className="hand md">Caputo Marco</td><td>SSD 1TB (×1)</td><td><Pill tone="ok">SMS 16/05</Pill></td></tr>
            </tbody>
          </table>
        </Box>
        <Box style={{ width:300 }} className="fill-2">
          <div className="hand lg">Cosa farà il sistema quando arriva</div>
          <HR />
          <ol className="hand md" style={{ margin:'6px 0 0 18px', padding:0, lineHeight:1.5 }}>
            <li>Aprire la schermata "carico merce"</li>
            <li>Confronta DDT con ordine</li>
            <li>Aggiorna stock magazzino</li>
            <li>Notifica i tecnici dei pezzi riservati</li>
            <li>Cambia stato interventi → <b>in lavorazione</b></li>
            <li>Avvisa clienti via SMS</li>
          </ol>
        </Box>
      </div>
    </div>
  </div>
);

// =============================================================
// FLOW 3 · Ritiro / consegna con SMS al cliente
// =============================================================

const F3_S1 = () => (
  // SMS del sistema al cliente (preview su phone mockup + log lato tecnico)
  <div className="sheet" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:30, padding:30 }}>
    <div className="col gap-3" style={{ width:400 }}>
      <span className="ribbon">flow · notifica al cliente</span>
      <div className="title">Il sistema avvisa <span className="hi-mark">automaticamente</span></div>
      <div className="hand md" style={{ fontSize:18 }}>
        Quando un intervento cambia stato (es. "pronto"), il sistema invia un SMS al cliente
        usando il template configurato.
      </div>
      <Box>
        <div className="hand md">Template SMS · "Pronto per ritiro"</div>
        <HR />
        <div className="box thin" style={{ background:'#fff', padding:10, marginTop:6, fontSize:14, fontFamily:'JetBrains Mono, monospace' }}>
          Ciao {'{nome}'}!{'\n'}
          Il tuo {'{dispositivo}'} è pronto.{'\n'}
          Importo: € {'{totale}'}{'\n'}
          Passa quando vuoi entro le 19.{'\n'}
          — Ass-et 051 1234567
        </div>
        <div className="mono tiny muted" style={{ marginTop:4 }}>variabili: {'{nome}'} {'{dispositivo}'} {'{totale}'} {'{numero}'} {'{link_stato}'}</div>
      </Box>

      <Box>
        <div className="hand md">Log invii</div>
        <HR />
        <table className="tbl">
          <thead><tr><th>Quando</th><th>Cliente</th><th>Tipo</th><th>Stato</th></tr></thead>
          <tbody>
            <tr><td className="mono xs">09:42</td><td>Rossi G.</td><td>pronto</td><td><Pill tone="ok">consegnato</Pill></td></tr>
            <tr><td className="mono xs">09:11</td><td>Esposito A.</td><td>pronto</td><td><Pill tone="ok">letto</Pill></td></tr>
            <tr><td className="mono xs">ier.</td><td>Studio Neri</td><td>preventivo</td><td><Pill>inviato</Pill></td></tr>
            <tr><td className="mono xs">ier.</td><td>Caputo M.</td><td>attesa pezzi</td><td><Pill tone="ok">letto</Pill></td></tr>
          </tbody>
        </table>
      </Box>
    </div>

    {/* phone preview */}
    <div className="phone">
      <div className="screen">
        <div className="notch"></div>
        <div className="row between" style={{ padding:'10px 22px 4px', fontFamily:'JetBrains Mono, monospace', fontSize:11 }}>
          <span>9:42</span>
          <span>···  ▮▮▮</span>
        </div>
        <div style={{ padding:'8px 14px 14px', display:'flex', flexDirection:'column', gap:10 }}>
          <div className="row gap-2" style={{ alignItems:'center' }}>
            <span className="hand lg">‹</span>
            <div>
              <div className="hand md" style={{ lineHeight:1 }}>Ass-et</div>
              <div className="mono tiny muted">051 1234567</div>
            </div>
          </div>
          <HR />
          <div className="mono tiny muted" style={{ textAlign:'center' }}>oggi · 09:42</div>
          <div style={{
            background:'#dcf1ff', padding:'10px 12px', borderRadius:'14px 14px 14px 4px',
            maxWidth:'85%', fontSize:14, lineHeight:1.4
          }}>
            Ciao Giulia! Il tuo MacBook Air M1 è pronto.<br/>
            Importo: € 240,00<br/>
            Passa quando vuoi entro le 19.<br/>
            Stato: ass-et.it/2410<br/>
            — Ass-et 051 1234567
          </div>
          <div style={{
            alignSelf:'flex-end', background:'var(--hi)', padding:'10px 12px', borderRadius:'14px 14px 4px 14px',
            maxWidth:'85%', fontSize:14
          }}>Perfetto, arrivo dopo le 17 👍</div>
          <div className="mono tiny muted" style={{ textAlign:'center' }}>letto · 09:48</div>
        </div>
      </div>
    </div>

    {/* sticky note */}
    <div className="stickynote" style={{ width:200 }}>
      template editabili<br/>per OGNI stato!<br/><br/>
      anche email +<br/>WhatsApp Business?
    </div>
  </div>
);

const F3_S2 = () => (
  // pagina pubblica "stato del mio intervento" — view cliente
  <div className="sheet" style={{ background:'#f7f4ec', display:'flex', flexDirection:'column' }}>
    <div className="row between" style={{ padding:'18px 30px', borderBottom:'1.6px solid var(--rule)', alignItems:'center', background:'var(--paper)' }}>
      <Logo size={32} />
      <div className="row gap-3">
        <span className="mono xs muted">051 1234567</span>
        <span className="mono xs muted">via dell'Officina 14, Bologna</span>
      </div>
    </div>

    <div style={{ padding:30, flex:1, display:'flex', flexDirection:'column', gap:20, maxWidth:900, margin:'0 auto', width:'100%' }}>
      <div>
        <div className="mono xs muted">STATO DEL TUO INTERVENTO</div>
        <div className="title" style={{ fontSize:54 }}>Ciao Giulia, <span className="hi-mark">è pronto!</span></div>
        <div className="subtitle">Riparazione #2410 · MacBook Air M1 · aggiornato 2h fa</div>
      </div>

      {/* progress bar */}
      <Box>
        <div className="row" style={{ alignItems:'center', gap:0 }}>
          {[
            ['Accettato','✓','13/05','ok'],
            ['In diagnosi','✓','13/05','ok'],
            ['Attesa pezzi','✓','14/05','ok'],
            ['In lavorazione','✓','15/05','ok'],
            ['Pronto','●','oggi 09:42','hi'],
            ['Consegnato','○','—',''],
          ].map(([n,m,d,t],i,arr) => (
            <React.Fragment key={n}>
              <div className="col center" style={{ flex:1, gap:4 }}>
                <div className="hand" style={{
                  width:40, height:40, borderRadius:'50%',
                  border:'2px solid var(--rule)',
                  background: t==='ok'?'var(--ok)':t==='hi'?'var(--hi)':'#fff',
                  color: t==='ok'?'#fff':'var(--ink)',
                  display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700
                }}>{m}</div>
                <div className="hand md" style={{ fontSize:13, textAlign:'center' }}>{n}</div>
                <div className="mono tiny muted">{d}</div>
              </div>
              {i<arr.length-1 && <div style={{ width:30, height:3, background: i<4 ? 'var(--ink)' : 'var(--rule)', opacity: i<4?1:0.3 }}></div>}
            </React.Fragment>
          ))}
        </div>
      </Box>

      <div className="row gap-3">
        <Box className="grow">
          <div className="hand lg">Riepilogo</div>
          <HR />
          <table className="tbl">
            <tbody>
              <tr><td className="muted">Dispositivo</td><td className="hand md">MacBook Air M1</td></tr>
              <tr><td className="muted">Difetto</td><td>Tastiera bagnata</td></tr>
              <tr><td className="muted">Diagnosi</td><td>Sostituita tastiera + pulizia</td></tr>
              <tr><td className="muted">Pronto da</td><td className="hand md">oggi · 09:42</td></tr>
              <tr><td className="muted">Importo</td><td className="hand md"><span className="hi-mark">€ 240,00</span></td></tr>
            </tbody>
          </table>
        </Box>
        <Box className="fill-2" style={{ width:300 }}>
          <div className="hand lg">Quando posso passare?</div>
          <HR />
          <div className="hand md" style={{ marginTop:6 }}>
            Apertura oggi <b>9:00 – 19:00</b><br/>
            Domani 9:00 – 13:00<br/>
            <span className="mono tiny muted">via dell'Officina 14, Bologna</span>
          </div>
          <Btn tone="primary" size="lg" style={{ marginTop:10, width:'100%', justifyContent:'center' }}>📍 indicazioni</Btn>
          <Btn style={{ marginTop:6, width:'100%', justifyContent:'center' }}>📞 chiama</Btn>
        </Box>
      </div>

      <Box hi>
        <div className="row between" style={{ alignItems:'center' }}>
          <div>
            <div className="hand lg">Vuoi pagare prima e ritirare in fretta?</div>
            <div className="mono tiny muted">paga online con carta, arrivi e ti consegniamo in 1 minuto</div>
          </div>
          <Btn tone="primary" size="lg">paga online €240 →</Btn>
        </div>
      </Box>
    </div>
  </div>
);

const F3_S3 = () => (
  // Consegna eseguita — review automatica + storico
  <div className="sheet" style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:30, padding:30 }}>
    {/* phone mockup with review request */}
    <div className="phone">
      <div className="screen">
        <div className="notch"></div>
        <div className="row between" style={{ padding:'10px 22px 4px', fontFamily:'JetBrains Mono, monospace', fontSize:11 }}>
          <span>16:30</span>
          <span>···  ▮▮▮</span>
        </div>
        <div style={{ padding:'8px 14px 14px', display:'flex', flexDirection:'column', gap:10 }}>
          <div className="row gap-2" style={{ alignItems:'center' }}>
            <span className="hand lg">‹</span>
            <div>
              <div className="hand md" style={{ lineHeight:1 }}>Ass-et</div>
              <div className="mono tiny muted">051 1234567</div>
            </div>
          </div>
          <HR />
          <div style={{
            background:'#dcf1ff', padding:'10px 12px', borderRadius:'14px 14px 14px 4px',
            maxWidth:'90%', fontSize:14, lineHeight:1.4
          }}>
            Grazie Giulia per la fiducia! 🙏<br/>
            Garanzia 90gg sulla tastiera.<br/>
            Se ti va, lasciaci una recensione:<br/>
            <span style={{ color:'#2b6cb0' }}>g.page/r/ass-et</span>
          </div>
          <div className="mono tiny muted" style={{ textAlign:'center' }}>oggi · 16:30</div>
        </div>
      </div>
    </div>

    {/* admin view: timeline cliente */}
    <div className="col gap-3" style={{ width:420 }}>
      <span className="ribbon">storico cliente · vista interna</span>
      <div className="title">Rossi Giulia</div>

      <Box>
        <div className="hand lg">Timeline interventi #2410</div>
        <HR />
        <div className="col gap-2" style={{ marginTop:6, fontSize:14 }}>
          <div className="row gap-3"><span className="mono tiny muted" style={{ width:90 }}>13/05 14:10</span><span>Accettata · Marco T.</span></div>
          <div className="row gap-3"><span className="mono tiny muted" style={{ width:90 }}>13/05 14:11</span><span>📧 SMS ingresso → letto</span></div>
          <div className="row gap-3"><span className="mono tiny muted" style={{ width:90 }}>13/05 16:00</span><span>In diagnosi · Luca</span></div>
          <div className="row gap-3"><span className="mono tiny muted" style={{ width:90 }}>14/05 09:00</span><span>Attesa pezzi (tastiera ordinata)</span></div>
          <div className="row gap-3"><span className="mono tiny muted" style={{ width:90 }}>14/05 09:01</span><span>📧 SMS attesa pezzi → letto</span></div>
          <div className="row gap-3"><span className="mono tiny muted" style={{ width:90 }}>15/05 11:30</span><span>Pezzo arrivato, in lavorazione</span></div>
          <div className="row gap-3"><span className="mono tiny muted" style={{ width:90 }}>16/05 09:42</span><span>✅ Pronto per ritiro</span></div>
          <div className="row gap-3"><span className="mono tiny muted" style={{ width:90 }}>16/05 09:43</span><span>📧 SMS pronto → letto, risposta cliente</span></div>
          <div className="row gap-3"><span className="mono tiny muted" style={{ width:90 }}>16/05 16:25</span><span>Consegnato + incassato €240 (POS)</span></div>
          <div className="row gap-3"><span className="mono tiny muted" style={{ width:90 }}>16/05 16:30</span><span>📧 SMS ringraziamento + recensione</span></div>
        </div>
      </Box>

      <Box className="fill-2">
        <div className="row between"><span className="hand lg">+ 1 recensione 5★</span><span className="annot ok">automatico!</span></div>
        <div className="hand md" style={{ marginTop:4 }}>"Velocissimi e trasparenti, mi tenevano aggiornata via SMS. Tastiera del MacBook come nuova."</div>
      </Box>
    </div>
  </div>
);

window.F1_S1 = F1_S1; window.F1_S2 = F1_S2; window.F1_S3 = F1_S3; window.F1_S4 = F1_S4;
window.F2_S1 = F2_S1; window.F2_S2 = F2_S2; window.F2_S3 = F2_S3;
window.F3_S1 = F3_S1; window.F3_S2 = F3_S2; window.F3_S3 = F3_S3;
