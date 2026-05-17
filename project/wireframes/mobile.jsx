// Mobile — tecnico in laboratorio, stato interventi

const phoneShell = (children, label) => (
  <div className="phone">
    <div className="screen">
      <div className="notch"></div>
      {/* status bar */}
      <div className="row between" style={{ padding:'10px 22px 4px', fontFamily:'JetBrains Mono, monospace', fontSize:11 }}>
        <span>9:42</span>
        <span>···  ▮▮▮</span>
      </div>
      {children}
    </div>
  </div>
);

const MobileA = () => phoneShell(
  <div style={{ padding:'8px 14px 14px', display:'flex', flexDirection:'column', gap:10, height:'calc(100% - 30px)' }}>
    <div className="row between" style={{ alignItems:'center' }}>
      <div>
        <div className="mono tiny muted">CIAO LUCA</div>
        <div className="hand lg" style={{ lineHeight:1 }}>oggi <span className="hi-mark">5 interventi</span></div>
      </div>
      <div className="hand" style={{
        width:38, height:38, borderRadius:'50%', border:'1.6px solid var(--rule)',
        display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, background:'#fff'
      }}>L</div>
    </div>

    <div className="row gap-2">
      <Pill tone="dark">tutti 5</Pill>
      <Pill tone="warn">attesa 2</Pill>
      <Pill tone="hi">lab 2</Pill>
      <Pill tone="ok">pronti 1</Pill>
    </div>

    <div className="col gap-2" style={{ flex:1, overflow:'auto' }}>
      {[
        ['#2411','Bianchi M.','HP Pavilion 15','non si avvia','accettazione','warn','oggi'],
        ['#2410','Rossi G.','MBA M1','tastiera bagnata','attesa pezzi','warn','2gg'],
        ['#2409','Verdi srl','Dell OptiPlex','virus, lento','in lavorazione','hi','oggi'],
        ['#2405','Romano L.','Asus ROG','overheat','in lavorazione','hi','5gg'],
        ['#2408','Esposito A.','iPhone 12','vetro','pronto','ok','3gg'],
      ].map(r => (
        <Box key={r[0]} className="thin" style={{ padding:'8px 10px' }}>
          <div className="row between" style={{ alignItems:'flex-start' }}>
            <div>
              <div className="mono tiny muted">{r[0]} · {r[6]}</div>
              <div className="hand md" style={{ lineHeight:1 }}>{r[1]}</div>
              <div className="xs">{r[2]}</div>
            </div>
            <Pill tone={r[5]}>{r[4]}</Pill>
          </div>
          <div className="xs muted" style={{ fontStyle:'italic', marginTop:2 }}>“{r[3]}”</div>
        </Box>
      ))}
    </div>

    {/* bottom tab bar */}
    <div className="row between" style={{
      borderTop:'1.6px solid var(--rule)', padding:'8px 6px 4px', margin:'4px -14px -14px'
    }}>
      {[['⌂','home',false],['⚙','lavori',true],['▦','mag',false],['☺','clienti',false],['€','€',false]].map(([i,l,a],k) => (
        <div key={k} className="col center" style={{ flex:1 }}>
          <span className="hand" style={{ fontSize:20, fontWeight: a?700:400 }}>{i}</span>
          <span className="mono tiny" style={{ color: a?'var(--ink)':'var(--ink-3)', fontWeight: a?700:400 }}>{l}</span>
        </div>
      ))}
    </div>
  </div>,
  'lista'
);

const MobileB = () => phoneShell(
  <div style={{ padding:'8px 14px 14px', display:'flex', flexDirection:'column', gap:10, height:'calc(100% - 30px)' }}>
    <div className="row gap-3" style={{ alignItems:'center' }}>
      <span className="hand lg">‹</span>
      <div className="grow">
        <div className="mono tiny muted">INTERVENTO #2410</div>
        <div className="hand lg" style={{ lineHeight:1 }}>Rossi Giulia</div>
      </div>
      <Pill tone="warn">attesa pezzi</Pill>
    </div>

    <Box className="thin">
      <div className="mono tiny muted">DISPOSITIVO</div>
      <div className="hand md">MacBook Air M1 · 2021</div>
      <div className="mono tiny muted" style={{ marginTop:6 }}>SERIALE</div>
      <div className="mono xs">C02G3QH4Q6L4</div>
      <div className="mono tiny muted" style={{ marginTop:6 }}>DIFETTO</div>
      <div className="hand md">Tastiera bagnata (caffè). Non risponde la fila “asdf”.</div>
    </Box>

    <Box className="thin fill-2">
      <div className="row between"><div className="hand md">Pezzi ordinati</div><span className="annot" style={{fontSize:14}}>2gg di attesa</span></div>
      <HR />
      <div className="xs" style={{ marginTop:4 }}>
        Tastiera IT MBA M1 · €89 — DigitalParts<br/>
        <span className="muted">ordinato 13/05 · atteso 17/05</span>
      </div>
    </Box>

    <Box className="thin">
      <div className="hand md">Cambia stato</div>
      <HR />
      <div className="row gap-2 wrap" style={{ marginTop:6 }}>
        <Pill>diagnosi</Pill>
        <Pill tone="warn">attesa pezzi ●</Pill>
        <Pill tone="note">attesa cliente</Pill>
        <Pill tone="hi">in lavorazione</Pill>
        <Pill tone="ok">pronto</Pill>
        <Pill tone="dark">consegnato</Pill>
      </div>
    </Box>

    <Box className="thin">
      <div className="hand md">+ Note del tecnico</div>
      <HR />
      <div className="placeholder" style={{ minHeight:48, marginTop:4 }}>tocca per dettare ↓ o scrivere</div>
      <div className="row gap-2" style={{ marginTop:6 }}>
        <Btn size="sm">📷 foto</Btn>
        <Btn size="sm">🎙 nota vocale</Btn>
        <Btn size="sm">+ pezzo</Btn>
      </div>
    </Box>

    <div style={{ flex:1 }}></div>
    <div className="row gap-2">
      <Btn className="grow">📞 cliente</Btn>
      <Btn className="grow" tone="hi">✉ SMS aggiorna</Btn>
    </div>
  </div>,
  'dettaglio'
);

const MobileC = () => phoneShell(
  <div style={{ padding:'8px 14px 14px', display:'flex', flexDirection:'column', gap:10, height:'calc(100% - 30px)' }}>
    <div>
      <div className="mono tiny muted">SCAN SCHEDA</div>
      <div className="hand lg" style={{ lineHeight:1 }}>Cerca un intervento</div>
    </div>

    {/* scanner area */}
    <Box className="thin" style={{
      flex:1, padding:0, position:'relative', overflow:'hidden',
      background:'repeating-linear-gradient(45deg, transparent 0 8px, rgba(0,0,0,0.05) 8px 9px)'
    }}>
      <div style={{
        position:'absolute', inset:'15% 12%', border:'2.4px dashed var(--ink)',
        borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center'
      }}>
        <div className="hand lg" style={{ color:'var(--ink-2)' }}>📷</div>
      </div>
      <div style={{
        position:'absolute', left:'12%', right:'12%', top:'50%',
        height:2, background:'var(--warn)', boxShadow:'0 0 8px var(--warn)'
      }}></div>
      <div style={{ position:'absolute', bottom:12, left:0, right:0, textAlign:'center' }}>
        <span className="hand md">inquadra il QR della bolla</span>
      </div>
    </Box>

    <div className="row gap-2 wrap">
      <Pill tone="dark">QR / barcode</Pill>
      <Pill>NFC tag pezzo</Pill>
      <Pill>seriale</Pill>
    </div>

    <Box className="thin fill-2">
      <div className="mono tiny muted">RECENTI</div>
      <div className="col gap-2" style={{ marginTop:4, fontSize:14 }}>
        <div className="row between"><span className="hand md">#2410 Rossi G.</span><span className="mono tiny muted">2 min fa</span></div>
        <div className="row between"><span className="hand md">#2409 Verdi srl</span><span className="mono tiny muted">15 min fa</span></div>
        <div className="row between"><span className="hand md">#2405 Romano L.</span><span className="mono tiny muted">1h fa</span></div>
      </div>
    </Box>
  </div>,
  'scan'
);

window.MobileA = MobileA; window.MobileB = MobileB; window.MobileC = MobileC;
