// Accettazione — 3 varianti del modulo di accettazione cliente+dispositivo

// A) Form classico a colonne — desktop tradizionale
const AcceptA = () => (
  <div className="sheet" style={{ display:'flex' }}>
    <Sidebar active="accept" />
    <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
      <TopBar
        title="Nuova accettazione"
        sub="Compila la scheda — il numero #2411 sarà assegnato al salvataggio"
        breadcrumbs="HOME / ACCETTAZIONE / NUOVA"
        right={<>
          <Btn size="sm" tone="ghost">↺ azzera</Btn>
          <Btn size="sm">salva bozza</Btn>
          <Btn size="sm" tone="primary">salva + stampa bolla</Btn>
        </>}
      />
      <div style={{ padding:'18px 22px', display:'flex', gap:16, flex:1, overflow:'hidden' }}>

        <div className="col gap-3" style={{ flex:1.4, minWidth:0 }}>
          {/* Cliente */}
          <Box>
            <div className="row between"><div className="hand lg">1 · Cliente</div>
              <div className="row gap-2"><Rad on>Esistente</Rad><Rad>Nuovo</Rad><Rad>Azienda</Rad></div>
            </div>
            <HR style={{ margin:'8px 0' }} />
            <div className="row gap-3" style={{ alignItems:'end' }}>
              <Field label="Cerca cliente" value="Bianchi M…" w={260} box />
              <span className="annot">↳ trovato!</span>
            </div>
            <div className="row gap-3" style={{ marginTop:10 }}>
              <Field label="Nome e cognome" value="Bianchi Mario" w={240} />
              <Field label="Telefono" value="349 12 34 567" w={170} />
              <Field label="Email" value="m.bianchi@…" w={200} />
              <Field label="Cod. fiscale" value="BNCMRA70…" w={170} />
            </div>
          </Box>

          {/* Dispositivo */}
          <Box>
            <div className="hand lg">2 · Dispositivo</div>
            <HR style={{ margin:'8px 0' }} />
            <div className="row gap-3 wrap">
              <Rad on>PC fisso</Rad><Rad>Notebook</Rad><Rad>Smartphone</Rad>
              <Rad>Tablet</Rad><Rad>Stampante</Rad><Rad>Altro…</Rad>
            </div>
            <div className="row gap-3" style={{ marginTop:10 }}>
              <Field label="Marca" value="HP" w={140} />
              <Field label="Modello" value="Pavilion 15-ec0035nl" w={250} />
              <Field label="N° seriale" value="5CD9472X3R" w={170} />
              <Field label="Password" value="••••••••" w={140} />
            </div>
            <div className="row gap-3" style={{ marginTop:10 }}>
              <Field label="Accessori consegnati" value="Alimentatore, borsa, mouse USB" w={420} />
              <Field label="Stato estetico" value="Buono — graffi sul coperchio" w={300} />
            </div>
          </Box>

          {/* Difetto */}
          <Box>
            <div className="hand lg">3 · Difetto dichiarato</div>
            <HR style={{ margin:'8px 0' }} />
            <div className="box thin" style={{ minHeight:80, background:'#fff', padding:10 }}>
              <span className="hand md">Non si avvia. La ventola gira ma lo schermo resta nero.
              Il cliente dice che è caduto a terra ieri.</span>
            </div>
            <div className="row gap-3 wrap" style={{ marginTop:10 }}>
              <span className="mono tiny muted">SUGGERIMENTI:</span>
              <Pill>scheda madre</Pill><Pill>display</Pill><Pill>RAM</Pill>
              <Pill>alimentatore</Pill><Pill>SSD</Pill>
            </div>
          </Box>
        </div>

        {/* Right column — meta + foto + autorizz. */}
        <div className="col gap-3" style={{ width:340 }}>
          <Box>
            <div className="hand lg">4 · Lavorazione</div>
            <HR style={{ margin:'8px 0' }} />
            <div className="row gap-3 wrap">
              <Field label="Priorità" value="Normale" w={130} box />
              <Field label="Tecnico" value="Luca M." w={130} box />
            </div>
            <div className="row gap-3 wrap" style={{ marginTop:8 }}>
              <Field label="Tempo stimato" value="2-3 giorni" w={130} box />
              <Field label="Preventivo max" value="€ 150,00" w={130} box />
            </div>
            <div className="col gap-2" style={{ marginTop:10 }}>
              <Chk on>Cliente autorizza diagnosi gratuita</Chk>
              <Chk>Cliente autorizza riparazione fino al max</Chk>
              <Chk on>Avvisare via SMS al cambio stato</Chk>
              <Chk>Backup dati (a pagamento)</Chk>
            </div>
          </Box>

          <Box>
            <div className="hand lg">5 · Foto del dispositivo</div>
            <HR style={{ margin:'8px 0' }} />
            <div className="row gap-2" style={{ flexWrap:'wrap' }}>
              <Placeholder style={{ width:88, height:88 }}>foto 1<br/>fronte</Placeholder>
              <Placeholder style={{ width:88, height:88 }}>foto 2<br/>retro</Placeholder>
              <Placeholder style={{ width:88, height:88, borderStyle:'dashed', background:'transparent' }}>+ aggiungi</Placeholder>
            </div>
            <div className="mono tiny muted" style={{ marginTop:6 }}>fotocamera del banco · max 8 foto</div>
          </Box>

          <Box className="fill-2">
            <div className="hand lg">6 · Firma cliente</div>
            <HR style={{ margin:'8px 0' }} />
            <Placeholder style={{ height:80 }}>
              [ area firma su tablet ]<br/>il cliente firma le condizioni
            </Placeholder>
            <Chk on>Privacy + termini accettati</Chk>
          </Box>
        </div>
      </div>
    </div>
  </div>
);

// B) Wizard a step grandi — bancone tablet/touch
const AcceptB = () => (
  <div className="sheet" style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
    <div className="row between" style={{ alignItems:'center' }}>
      <div className="row gap-3" style={{ alignItems:'center' }}>
        <Btn size="sm">← annulla</Btn>
        <Logo />
      </div>
      <div className="hand lg">Nuova accettazione · step <span className="hi-mark">2 di 5</span></div>
      <Btn size="sm" tone="primary">prossimo →</Btn>
    </div>

    {/* stepper */}
    <div className="row gap-2" style={{ alignItems:'center' }}>
      {['Cliente','Dispositivo','Difetto','Foto + firma','Conferma'].map((s,i) => (
        <React.Fragment key={s}>
          <div className="row gap-2" style={{ alignItems:'center' }}>
            <div className="box thin" style={{
              width:34, height:34, borderRadius:'50%',
              display:'flex', alignItems:'center', justifyContent:'center',
              background: i<1?'var(--ink)':i===1?'var(--hi)':'transparent',
              color: i<1?'var(--paper)':'var(--ink)',
              borderColor:'var(--rule)', padding:0
            }}>{i<1 ? '✓' : i+1}</div>
            <span className="hand md" style={{ fontWeight: i===1?700:400 }}>{s}</span>
          </div>
          {i<4 && <div style={{ flex:1, height:2, background: i<1?'var(--ink)':'var(--rule)', opacity: i<1?1:0.3 }}></div>}
        </React.Fragment>
      ))}
    </div>

    {/* big content card */}
    <Box className="grow" shadow style={{ padding:'28px 36px', display:'flex', flexDirection:'column', gap:20 }}>
      <div className="title" style={{ fontSize:52 }}>Che dispositivo è?</div>
      <div className="subtitle">Tocca una categoria — i campi cambiano in base alla scelta</div>

      {/* category tiles */}
      <div className="row gap-3 wrap">
        {[
          ['PC fisso','desktop',true],
          ['Notebook','laptop'],
          ['Smartphone','phone'],
          ['Tablet','tablet'],
          ['Stampante','printer'],
          ['Altro…','?'],
        ].map(([n,_,on]) => (
          <Box key={n} className="grow" hi={on} style={{
            minWidth:160, padding:'22px 18px', textAlign:'center',
            border: on ? '2.4px solid var(--ink)' : '1.6px solid var(--rule)'
          }}>
            <Placeholder style={{ width:80, height:60, margin:'0 auto 8px' }} diag>{_}</Placeholder>
            <div className="hand lg">{n}</div>
          </Box>
        ))}
      </div>

      <HR />

      <div className="row gap-4" style={{ alignItems:'flex-start' }}>
        <div className="col gap-3 grow">
          <div className="hand lg">Marca e modello</div>
          <div className="row gap-3 wrap">
            <Field label="Marca" value="HP" w={200} box />
            <Field label="Modello" value="Pavilion 15-ec0035nl" w={300} box />
          </div>
          <Field label="N° seriale (incolla o scansiona)" value="5CD9472X3R   📷" w={400} box />
          <Field label="Password (se nota)" value="••••••••" w={260} box />
        </div>
        <div className="col gap-3" style={{ width:300 }}>
          <div className="hand lg">Accessori consegnati</div>
          <div className="col gap-2">
            <Chk on>Alimentatore</Chk>
            <Chk on>Borsa / custodia</Chk>
            <Chk on>Mouse / tastiera</Chk>
            <Chk>Cavo dati</Chk>
            <Chk>Cuffie</Chk>
            <Chk>SIM / SD card</Chk>
            <Chk>Manuali / scatola</Chk>
          </div>
        </div>
      </div>
    </Box>

    <div className="row between" style={{ alignItems:'center' }}>
      <Btn>← cliente</Btn>
      <span className="mono tiny muted">Esc per uscire · ←/→ tra gli step · Invio per avanzare</span>
      <Btn tone="primary" size="lg">avanti: difetto →</Btn>
    </div>
  </div>
);

// C) Single-screen "fast intake" — tutto in una schermata + sintesi a destra
const AcceptC = () => (
  <div className="sheet" style={{ display:'flex', flexDirection:'column' }}>
    <div className="row between" style={{ padding:'10px 18px', borderBottom:'1.6px solid var(--rule)', alignItems:'center' }}>
      <div className="row gap-3" style={{ alignItems:'center' }}>
        <Btn size="sm">← indietro</Btn>
        <span className="hand lg">Accettazione rapida</span>
        <span className="mono xs muted">scheda #2411 (provvisoria)</span>
      </div>
      <span className="annot">⏱ obiettivo: meno di 2 minuti</span>
    </div>

    <div style={{ flex:1, display:'flex', gap:16, padding:18 }}>
      {/* big columns of compact fields */}
      <div className="grow col gap-3" style={{ minWidth:0 }}>
        <div className="row gap-3">
          <Box className="grow" tilt="l">
            <span className="mono tiny muted">CLIENTE</span>
            <div className="row gap-3" style={{ marginTop:4, alignItems:'end' }}>
              <Field label="cerca / +nuovo" value="Bianchi M." w={180} />
              <Field label="tel" value="349 12 34 567" w={140} />
            </div>
            <div className="row gap-3" style={{ marginTop:6 }}>
              <Field label="email" value="m.bianchi@gmail.com" w={220} />
              <Field label="P.IVA / CF" value="—" w={130} />
            </div>
          </Box>
          <Box className="grow" tilt="r">
            <span className="mono tiny muted">DISPOSITIVO</span>
            <div className="row gap-2 wrap" style={{ marginTop:4 }}>
              {['PC','Notebook','Phone','Tablet','Stamp.','Altro'].map((t,i) => (
                <Pill key={t} tone={i===1?'dark':''}>{t}</Pill>
              ))}
            </div>
            <div className="row gap-3" style={{ marginTop:6 }}>
              <Field label="marca" value="HP" w={90} />
              <Field label="modello" value="Pavilion 15-ec0035nl" w={210} />
              <Field label="seriale" value="5CD9472X3R" w={140} />
            </div>
          </Box>
        </div>

        <Box>
          <span className="mono tiny muted">DIFETTO DICHIARATO</span>
          <div className="box thin" style={{ background:'#fff', padding:10, marginTop:4, minHeight:90 }}>
            <span className="hand md">Non si avvia. Ventola sì, schermo nero. Caduto ieri.</span>
          </div>
          <div className="row gap-2 wrap" style={{ marginTop:6 }}>
            <span className="mono tiny muted">TAG VELOCI:</span>
            <Pill tone="dark">non si accende</Pill>
            <Pill>caduta</Pill>
            <Pill>schermo nero</Pill>
            <Pill>display</Pill>
            <Pill>sk. madre</Pill>
          </div>
        </Box>

        <div className="row gap-3">
          <Box className="grow">
            <span className="mono tiny muted">ACCESSORI</span>
            <div className="row gap-3 wrap" style={{ marginTop:6 }}>
              <Chk on>alim.</Chk><Chk on>borsa</Chk><Chk>mouse</Chk>
              <Chk>cavo</Chk><Chk>SIM/SD</Chk><Chk>scatola</Chk>
            </div>
            <Field label="note estetiche" value="Graffi sul coperchio" w={300} />
          </Box>
          <Box className="grow">
            <span className="mono tiny muted">PARAMETRI</span>
            <div className="row gap-3 wrap" style={{ marginTop:4, alignItems:'end' }}>
              <Field label="priorità" value="Normale" w={110} />
              <Field label="tecnico" value="Luca" w={90} />
              <Field label="max €" value="150" w={70} />
              <Field label="password" value="●●●●●●" w={100} />
            </div>
            <div className="row gap-3 wrap" style={{ marginTop:6 }}>
              <Chk on>diagnosi grat.</Chk>
              <Chk on>SMS al cambio stato</Chk>
              <Chk>backup dati</Chk>
            </div>
          </Box>
        </div>
      </div>

      {/* right summary card */}
      <Box style={{ width:300, padding:14, display:'flex', flexDirection:'column' }}>
        <span className="ribbon">anteprima bolla</span>
        <div className="title" style={{ fontSize:30, marginTop:8 }}>#2411</div>
        <div className="mono xs muted">15/05/2026 · 09:42 · Marco T.</div>
        <HR style={{ margin:'8px 0' }} />
        <div className="col gap-2" style={{ fontSize:14 }}>
          <div><span className="muted">Cliente:</span><br/><span className="hand md">Bianchi Mario</span></div>
          <div><span className="muted">Disp.:</span><br/><span className="hand md">HP Pavilion 15-ec0035nl</span></div>
          <div><span className="muted">Difetto:</span><br/>Non si avvia, ventola sì. Caduto.</div>
          <div><span className="muted">Max:</span> <span className="hand md">€ 150,00</span></div>
        </div>
        <div style={{ flex:1 }}></div>
        <Placeholder style={{ height:60, marginTop:8 }}>firma cliente</Placeholder>
        <div className="col gap-2" style={{ marginTop:10 }}>
          <Btn tone="primary" size="lg">✓ accetta + stampa</Btn>
          <Btn>salva bozza</Btn>
        </div>
      </Box>
    </div>
  </div>
);

window.AcceptA = AcceptA; window.AcceptB = AcceptB; window.AcceptC = AcceptC;
