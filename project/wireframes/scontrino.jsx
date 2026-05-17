// Bolla accettazione + scontrino — 2 varianti stampabili A6/A5

const Bolla = () => (
  <div className="sheet" style={{ padding:30, background:'#fdfbf3', display:'flex', flexDirection:'column' }}>
    <div className="row between" style={{ alignItems:'flex-start' }}>
      <div>
        <Logo size={36} />
        <div className="mono tiny muted" style={{ marginTop:4 }}>
          Centro Assistenza Informatica<br/>
          Via dell'Officina 14 · 40123 Bologna<br/>
          P.IVA 01234567890 · Tel 051 123 4567
        </div>
      </div>
      <div style={{ textAlign:'right' }}>
        <div className="ribbon">BOLLA DI ACCETTAZIONE</div>
        <div className="title" style={{ fontSize:48, marginTop:8 }}>#2411</div>
        <div className="mono xs muted">15/05/2026 · 09:42<br/>Operatore: Marco T.</div>
      </div>
    </div>

    <HR thick style={{ margin:'14px 0 10px' }} />

    <div className="row gap-4">
      <div className="grow">
        <div className="mono tiny muted" style={{ textTransform:'uppercase' }}>Cliente</div>
        <div className="hand" style={{ fontSize:30, lineHeight:1 }}>Bianchi Mario</div>
        <div className="hand md" style={{ marginTop:4 }}>
          Tel 349 12 34 567 · m.bianchi@gmail.com<br/>
          CF BNCMRA70R12A944J · Via Roma 12, Bologna
        </div>
      </div>
      <Box style={{ width:200, padding:'8px 12px' }}>
        <div className="mono tiny muted">PRIORITÀ</div>
        <div className="hand lg">Normale</div>
        <div className="mono tiny muted" style={{ marginTop:4 }}>TECNICO ASSEGNATO</div>
        <div className="hand lg">Luca M.</div>
        <div className="mono tiny muted" style={{ marginTop:4 }}>TEMPO STIMATO</div>
        <div className="hand lg">2-3 giorni</div>
      </Box>
    </div>

    <HR style={{ margin:'10px 0' }} />

    <div>
      <div className="mono tiny muted" style={{ textTransform:'uppercase' }}>Dispositivo consegnato</div>
      <table className="tbl" style={{ marginTop:6, fontSize:16 }}>
        <tbody>
          <tr><td style={{ width:140 }} className="muted">Tipo</td><td className="hand md">Notebook</td></tr>
          <tr><td className="muted">Marca / Modello</td><td className="hand md">HP Pavilion 15-ec0035nl</td></tr>
          <tr><td className="muted">N° seriale</td><td className="mono">5CD9472X3R</td></tr>
          <tr><td className="muted">Accessori</td><td>Alimentatore, borsa, mouse USB</td></tr>
          <tr><td className="muted">Stato estetico</td><td>Buono — graffi sul coperchio</td></tr>
          <tr><td className="muted">Password (riservata)</td><td className="mono">●●●●●●●●</td></tr>
        </tbody>
      </table>
    </div>

    <div style={{ marginTop:12 }}>
      <div className="mono tiny muted" style={{ textTransform:'uppercase' }}>Difetto dichiarato dal cliente</div>
      <Box style={{ background:'#fff', marginTop:4, padding:'10px 14px', minHeight:80 }}>
        <span className="hand" style={{ fontSize:20 }}>
          Non si avvia. La ventola gira ma lo schermo resta nero.<br/>
          Il cliente dichiara che è caduto a terra il giorno precedente.
        </span>
      </Box>
    </div>

    <HR style={{ margin:'12px 0' }} />

    <div className="row gap-4">
      <Box hi style={{ flex:1.4, padding:'10px 14px' }}>
        <div className="mono tiny muted" style={{ textTransform:'uppercase' }}>Preventivo massimo autorizzato</div>
        <div className="title" style={{ fontSize:46 }}>€ 150,00 <span className="muted" style={{ fontSize:18 }}>iva inclusa</span></div>
        <div className="mono tiny muted">Oltre questa cifra il cliente sarà ricontattato per autorizzazione.</div>
      </Box>
      <div className="grow col gap-2" style={{ justifyContent:'center' }}>
        <Chk on>Cliente autorizza diagnosi gratuita</Chk>
        <Chk on>Riparazione fino al massimo autorizzato senza ulteriore conferma</Chk>
        <Chk on>Accetta SMS al cambio di stato</Chk>
        <Chk>Backup dati richiesto (€ 30,00 aggiuntivi)</Chk>
      </div>
    </div>

    <HR style={{ margin:'12px 0' }} />

    <div style={{ fontSize:11, color:'var(--ink-3)', lineHeight:1.3 }}>
      Il cliente dichiara di aver letto e accettato le condizioni generali del servizio (retro). I dati personali sono trattati ai sensi del Reg. UE 679/2016. Le riparazioni non ritirate entro 90 giorni dalla notifica saranno gestite come previsto dall'art. 1147 c.c. La garanzia sulla riparazione è di 90 giorni dalla consegna e copre il solo pezzo sostituito.
    </div>

    <div className="row gap-6" style={{ marginTop:16, alignItems:'flex-end' }}>
      <div className="grow" style={{ borderBottom:'1.6px solid var(--ink)', paddingBottom:2 }}>
        <span className="hand" style={{ fontSize:30, fontStyle:'italic', color:'var(--ink-2)' }}>M. Bianchi</span>
      </div>
      <div className="grow" style={{ borderBottom:'1.6px solid var(--ink)', paddingBottom:2 }}>
        <span className="hand" style={{ fontSize:24, color:'var(--ink-3)' }}>(timbro centro)</span>
      </div>
    </div>
    <div className="row gap-6" style={{ marginTop:2 }}>
      <span className="grow mono tiny muted">FIRMA DEL CLIENTE — per accettazione e privacy</span>
      <span className="grow mono tiny muted">FIRMA DELL'OPERATORE</span>
    </div>

    {/* QR + barcode mock */}
    <div className="row between" style={{ marginTop:16, alignItems:'center' }}>
      <div className="row gap-3" style={{ alignItems:'center' }}>
        <Placeholder style={{ width:60, height:60 }}>QR<br/>#2411</Placeholder>
        <div className="mono tiny muted">scansiona per stato live<br/>assistenza.et-info.it/2411</div>
      </div>
      <div className="mono" style={{ letterSpacing:4, fontSize:20 }}>‖|‖||‖|‖||‖‖|‖||‖ 2411</div>
    </div>
  </div>
);

// scontrino piccolo per ritiro / cassa
const Scontrino = () => (
  <div className="sheet" style={{ padding:24, background:'#fdfbf3', display:'flex', justifyContent:'center', alignItems:'flex-start' }}>
    <div style={{
      width:340, background:'#fff', padding:'18px 16px', boxShadow:'3px 3px 0 var(--rule)',
      border:'1.6px solid var(--rule)', borderRadius:'4px 4px 12px 12px',
      fontFamily:'JetBrains Mono, monospace', fontSize:12, color:'var(--ink)',
      position:'relative'
    }}>
      <div style={{ textAlign:'center' }}>
        <Logo size={28} />
        <div style={{ marginTop:6 }}>Centro Assistenza Ass-et</div>
        <div className="muted" style={{ fontSize:10 }}>Via dell'Officina 14 · Bologna<br/>P.IVA 01234567890</div>
      </div>
      <div style={{ borderTop:'1px dashed var(--rule)', borderBottom:'1px dashed var(--rule)', margin:'10px 0', padding:'4px 0', textAlign:'center' }}>
        SCONTRINO RIPARAZIONE · #2376
      </div>
      <div style={{ display:'flex', justifyContent:'space-between' }}><span>Data</span><span>15/05/26 11:30</span></div>
      <div style={{ display:'flex', justifyContent:'space-between' }}><span>Cliente</span><span>Esposito Anna</span></div>
      <div style={{ display:'flex', justifyContent:'space-between' }}><span>Disp.</span><span>iPhone 12</span></div>
      <div style={{ borderTop:'1px dashed var(--rule)', margin:'8px 0' }}></div>
      <div style={{ display:'flex', justifyContent:'space-between' }}><span>Sost. vetro</span><span>€ 85,00</span></div>
      <div style={{ display:'flex', justifyContent:'space-between' }}><span>Manodopera</span><span>€ 35,00</span></div>
      <div style={{ borderTop:'1px dashed var(--rule)', margin:'8px 0' }}></div>
      <div style={{ display:'flex', justifyContent:'space-between' }}><span>Imponibile</span><span>€ 98,36</span></div>
      <div style={{ display:'flex', justifyContent:'space-between' }}><span>IVA 22%</span><span>€ 21,64</span></div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:16, fontWeight:'bold', marginTop:6 }}>
        <span>TOTALE</span><span>€ 120,00</span>
      </div>
      <div style={{ borderTop:'1px dashed var(--rule)', margin:'8px 0' }}></div>
      <div style={{ display:'flex', justifyContent:'space-between' }}><span>Contanti</span><span>€ 120,00</span></div>
      <div style={{ display:'flex', justifyContent:'space-between' }}><span>Resto</span><span>€ 0,00</span></div>
      <div style={{ borderTop:'1px dashed var(--rule)', margin:'10px 0' }}></div>
      <div style={{ textAlign:'center', fontSize:10 }} className="muted">
        Garanzia 90gg sul pezzo sostituito<br/>
        Conservare lo scontrino<br/><br/>
        Grazie!
      </div>
      <div style={{ textAlign:'center', marginTop:10 }}>
        <div style={{ letterSpacing:3, fontSize:18 }}>‖|‖||‖|‖||‖ 2376</div>
      </div>
      {/* tear */}
      <div style={{
        position:'absolute', left:-1, right:-1, bottom:-6, height:10,
        backgroundImage:'radial-gradient(circle at 6px 0, #fff 5px, transparent 5.5px)',
        backgroundSize:'12px 10px', backgroundPosition:'0 0', backgroundRepeat:'repeat-x'
      }}></div>
    </div>

    {/* explanation card */}
    <div className="col gap-3" style={{ marginLeft:24, width:280 }}>
      <Box className="fill-2">
        <div className="hand lg">Stampa al ritiro</div>
        <HR />
        <div className="hand md" style={{ marginTop:6, lineHeight:1.3 }}>
          Layout su carta termica 80mm.
          Contiene riepilogo intervento, pezzi e totale.
          Stampato dalla cassa al click su <b>“consegna + incasso”</b>.
        </div>
      </Box>
      <Box hi>
        <div className="hand md">Varianti utili</div>
        <ul style={{ margin:'4px 0 0 16px', fontSize:14 }}>
          <li>scontrino normale</li>
          <li>fattura A4 (priv./azienda)</li>
          <li>fattura elettronica (SDI)</li>
          <li>nota di credito</li>
          <li>preventivo (PDF)</li>
        </ul>
      </Box>
      <div className="stickynote">aggiungere QR<br/>per fattura via mail?</div>
    </div>
  </div>
);

window.Bolla = Bolla; window.Scontrino = Scontrino;
