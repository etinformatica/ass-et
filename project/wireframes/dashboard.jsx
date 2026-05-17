// Dashboard wireframes — 4 varianti

// A) Classica con sidebar + KPI + lista interventi recenti
const DashA = () => (
  <div className="sheet" style={{ display:'flex' }}>
    <Sidebar active="dashboard" />
    <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
      <TopBar
        title="Dashboard"
        sub="Panoramica del giorno · lun 15 mag 2026"
        breadcrumbs="HOME / DASHBOARD"
        right={<>
          <Search placeholder="cerca cliente, intervento, n°…" w={300} />
          <Btn size="sm" tone="ghost">🔔 3</Btn>
          <Btn size="sm" tone="primary" icon="+">Nuova accettazione</Btn>
        </>}
      />
      <div style={{ padding:'18px 22px', display:'flex', flexDirection:'column', gap:16, flex:1 }}>

        {/* KPI strip */}
        <div className="row gap-3">
          {[
            ['In lavorazione','24',null,'+3 da ieri'],
            ['Pronti per ritiro','7','ok','azione'],
            ['In attesa pezzi','5','warn','> 3gg : 2'],
            ['Incasso oggi','€ 1.240','hi','12 fatture'],
            ['Margine mese','€ 6.480','','+18% vs apr'],
          ].map(([k,v,t,note]) => (
            <Box key={k} className="grow" style={{ padding:'10px 14px' }} shadow>
              <div className="mono tiny muted" style={{ textTransform:'uppercase' }}>{k}</div>
              <div className="hand" style={{ fontSize:34, lineHeight:1 }}>
                {t==='hi' ? <span className="hi-mark">{v}</span> : v}
              </div>
              <div className="row between" style={{ marginTop:4 }}>
                <span className="xs muted">{note}</span>
                {t && <Pill tone={t}>{t==='warn'?'attenzione':t==='ok'?'ok':'•'}</Pill>}
              </div>
            </Box>
          ))}
        </div>

        <div className="row gap-3" style={{ flex:1, minHeight:0 }}>
          {/* Interventi recenti */}
          <Box className="grow" style={{ display:'flex', flexDirection:'column', minHeight:0 }}>
            <div className="row between" style={{ alignItems:'center', marginBottom:6 }}>
              <div className="hand lg">Interventi recenti</div>
              <div className="row gap-2">
                <Pill tone="dark">tutti 24</Pill>
                <Pill>in diagnosi 8</Pill>
                <Pill tone="warn">attesa pezzi 5</Pill>
                <Pill tone="ok">pronti 7</Pill>
              </div>
            </div>
            <table className="tbl">
              <thead><tr>
                <th style={{width:50}}>N°</th><th>Cliente</th><th>Dispositivo</th>
                <th>Difetto</th><th>Tecnico</th><th>Stato</th><th>Ingr.</th>
              </tr></thead>
              <tbody>
                {[
                  ['#2410','Bianchi Mario','HP Pavilion 15','non si avvia, ventola','Luca','in diagnosi','13/05'],
                  ['#2409','Rossi Giulia','MacBook Air M1','tastiera bagnata','Marco','attesa pezzi','13/05'],
                  ['#2408','Verdi srl','Dell OptiPlex','molto lento, virus?','Luca','in lavorazione','12/05'],
                  ['#2407','Esposito Anna','iPhone 12','vetro rotto','Sara','pronto','12/05'],
                  ['#2406','Conti Paolo','Lenovo IdeaPad','HDD click click','Luca','non riparabile','11/05'],
                  ['#2405','Studio Neri','HP LaserJet','stampa righe','Marco','consegnato','10/05'],
                  ['#2404','Romano Luigi','Asus ROG','overheat in gaming','Sara','in lavorazione','10/05'],
                ].map(r => (
                  <tr key={r[0]}>
                    <td className="mono xs">{r[0]}</td>
                    <td className="hand md">{r[1]}</td>
                    <td>{r[2]}</td>
                    <td className="muted xs">{r[3]}</td>
                    <td><Pill>{r[4]}</Pill></td>
                    <td><Pill tone={r[5]==='pronto'?'ok':r[5]==='attesa pezzi'?'warn':r[5]==='consegnato'?'dark':r[5]==='non riparabile'?'warn':''}>{r[5]}</Pill></td>
                    <td className="mono xs muted">{r[6]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          {/* Right column */}
          <div className="col gap-3" style={{ width:300 }}>
            <Box>
              <div className="hand lg">Da fare oggi</div>
              <div className="col gap-2" style={{ marginTop:6 }}>
                <Chk on>Chiamare Bianchi M. — preventivo</Chk>
                <Chk>Ordinare 2× SSD 1TB Crucial</Chk>
                <Chk>Ritirare ricambi da DigitalParts</Chk>
                <Chk>Chiudere intervento #2398</Chk>
                <Chk>Inviare fattura Studio Neri</Chk>
              </div>
            </Box>
            <Box hi>
              <div className="hand md">⚠ Scorte minime</div>
              <ul style={{ margin:'4px 0 0 16px', padding:0, fontSize:14 }}>
                <li>SSD 1TB NVMe — <b>2</b> (min 5)</li>
                <li>Pasta term. Kryonaut — <b>1</b></li>
                <li>Tastiera MBA M1 IT — <b>0</b></li>
              </ul>
            </Box>
            <Box>
              <div className="hand lg">Incassi settimana</div>
              <div className="row gap-2" style={{ alignItems:'end', height:80, marginTop:8 }}>
                {[40,65,35,80,55,90,72].map((h,i) => (
                  <div key={i} className="grow" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:3 }}>
                    <div className="bar" style={{ width:'100%', height:`${h}%`, background: i===6?'var(--hi)':'var(--ink)' }}></div>
                    <span className="mono tiny muted">{['L','M','M','G','V','S','D'][i]}</span>
                  </div>
                ))}
              </div>
            </Box>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// B) Dashboard "operativa" — focus su pipeline e azioni rapide al banco
const DashB = () => (
  <div className="sheet" style={{ display:'flex', flexDirection:'column' }}>
    {/* topbar full */}
    <div className="row between" style={{ padding:'12px 22px', borderBottom:'2px solid var(--rule)', alignItems:'center' }}>
      <div className="row gap-4" style={{ alignItems:'center' }}>
        <Logo />
        <div className="row gap-3">
          {['Dashboard','Accettazione','Interventi','Clienti','Magazzino','Contabilità','Report'].map((t,i) => (
            <span key={t} className="hand md" style={{
              padding:'4px 8px', borderBottom: i===0 ? '3px solid var(--ink)' : '3px solid transparent',
              fontWeight: i===0 ? 700 : 500
            }}>{t}</span>
          ))}
        </div>
      </div>
      <div className="row gap-2" style={{ alignItems:'center' }}>
        <Search placeholder="🔍 cerca tutto…" w={260} />
        <Btn size="sm">🔔 3</Btn>
        <span className="hand md">Marco T.</span>
      </div>
    </div>

    <div style={{ padding:'18px 22px', display:'flex', flexDirection:'column', gap:18, flex:1 }}>
      {/* big quick actions */}
      <div className="row gap-3">
        <Box className="grow" style={{ background:'var(--ink)', color:'var(--paper)', padding:'18px 22px' }}>
          <div className="hand" style={{ fontSize:30, color:'var(--paper)' }}>+ Nuova accettazione</div>
          <div className="mono tiny" style={{ color:'#cfc8b8', marginTop:4 }}>Apri scheda intervento al banco — F2</div>
        </Box>
        <Box className="grow" hi style={{ padding:'18px 22px' }}>
          <div className="hand" style={{ fontSize:30 }}>↗ Ritiro / consegna</div>
          <div className="mono tiny muted" style={{ marginTop:4 }}>Cerca per N°, telefono, nome — F3</div>
        </Box>
        <Box className="grow" style={{ padding:'18px 22px' }}>
          <div className="hand" style={{ fontSize:30 }}>€ Vendita banco</div>
          <div className="mono tiny muted" style={{ marginTop:4 }}>Scarica magazzino, emette scontrino</div>
        </Box>
      </div>

      {/* pipeline funnel */}
      <Box style={{ padding:14 }}>
        <div className="row between" style={{ alignItems:'center', marginBottom:10 }}>
          <div className="hand lg">Pipeline interventi</div>
          <span className="mono xs muted">aggiornato 2 min fa · 49 attivi</span>
        </div>
        <div className="row gap-2" style={{ alignItems:'stretch' }}>
          {[
            ['Accettazione',3,''],
            ['Diagnosi',8,''],
            ['Attesa pezzi',5,'warn'],
            ['Attesa OK cliente',4,'note'],
            ['In lavorazione',12,'hi'],
            ['Pronti ritiro',7,'ok'],
            ['Consegnati (oggi)',10,'dark'],
          ].map(([l,n,t]) => (
            <Box key={l} className="grow" style={{ padding:'10px 12px', minHeight:90 }}>
              <div className="row between"><span className="mono tiny muted">{l.toUpperCase()}</span><Pill tone={t}>{t||'•'}</Pill></div>
              <div className="hand" style={{ fontSize:46, lineHeight:1 }}>{n}</div>
              <div className="mono tiny muted">apri lista →</div>
            </Box>
          ))}
        </div>
      </Box>

      <div className="row gap-3" style={{ flex:1, minHeight:0 }}>
        <Box className="grow">
          <div className="hand lg">Pronti per ritiro · chiama il cliente</div>
          <table className="tbl" style={{ marginTop:6 }}>
            <thead><tr><th>N°</th><th>Cliente</th><th>Tel</th><th>Dispositivo</th><th>Totale</th><th>Pronto da</th><th></th></tr></thead>
            <tbody>
              {[
                ['#2407','Esposito Anna','349 12 34 567','iPhone 12 — vetro','€ 95,00','12/05 · 14:20','📞 chiama'],
                ['#2401','Studio Neri','06 4455 778','HP LaserJet','€ 60,00','11/05 · 09:00','✉ sms'],
                ['#2395','Conti Paolo','333 22 11 444','Lenovo IdeaPad','€ 0,00 (n.r.)','10/05 · 16:30','📞 chiama'],
              ].map(r => (
                <tr key={r[0]}>
                  <td className="mono xs">{r[0]}</td>
                  <td className="hand md">{r[1]}</td>
                  <td className="mono xs">{r[2]}</td>
                  <td>{r[3]}</td>
                  <td className="hand md">{r[4]}</td>
                  <td className="mono xs muted">{r[5]}</td>
                  <td><Btn size="sm" tone="hi">{r[6]}</Btn></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Box>

        <div className="col gap-3" style={{ width:280 }}>
          <Box className="fill-2">
            <div className="hand lg">€ Giornata</div>
            <div className="row between" style={{ marginTop:6 }}>
              <div><div className="mono tiny muted">RICAVI</div><div className="hand xl">1.240</div></div>
              <div><div className="mono tiny muted">COSTI</div><div className="hand xl muted">320</div></div>
            </div>
            <HR style={{ margin:'8px 0' }} />
            <div className="row between"><span>Margine</span><span className="hand lg"><span className="hi-mark">€ 920</span></span></div>
          </Box>
          <Box>
            <div className="hand lg">Tecnici · ore oggi</div>
            <div className="col gap-2" style={{ marginTop:6 }}>
              {[['Luca','6h','5 int.'],['Marco','4h','3 int.'],['Sara','7h','6 int.']].map(([n,h,i]) => (
                <div key={n} className="row between" style={{ alignItems:'center' }}>
                  <span className="hand md">{n}</span>
                  <div className="row gap-2"><Pill>{h}</Pill><Pill tone="dark">{i}</Pill></div>
                </div>
              ))}
            </div>
          </Box>
        </div>
      </div>
    </div>
  </div>
);

// C) Dashboard "amministrazione" — orientata a contabilità / management
const DashC = () => (
  <div className="sheet" style={{ display:'flex' }}>
    <Sidebar active="dashboard" wide />
    <div style={{ flex:1, padding:'18px 24px', display:'flex', flexDirection:'column', gap:16, minWidth:0 }}>
      <div className="row between" style={{ alignItems:'flex-end' }}>
        <div>
          <span className="ribbon">vista titolare</span>
          <div className="title" style={{ marginTop:6 }}>Andamento <span className="hi-mark">maggio 2026</span></div>
          <div className="subtitle">Ricavi, costi e margine — confronto col mese precedente</div>
        </div>
        <div className="row gap-2">
          <Btn size="sm">◄ aprile</Btn>
          <Btn size="sm" tone="hi">maggio ●</Btn>
          <Btn size="sm">giugno ►</Btn>
          <Btn size="sm">📥 esporta</Btn>
        </div>
      </div>

      <div className="row gap-3">
        {[
          ['Ricavi','€ 18.420','+12%','hi'],
          ['Costi pezzi','€ 6.180','+4%',''],
          ['Costi mag. fissi','€ 1.250','=',''],
          ['Margine lordo','€ 10.990','+18%','ok'],
          ['Interventi chiusi','142','+9','dark'],
          ['Scontrino medio','€ 129,7','+€8','note'],
        ].map(([k,v,d,t]) => (
          <Box key={k} className="grow" shadow style={{ padding:'10px 14px' }}>
            <div className="mono tiny muted" style={{ textTransform:'uppercase' }}>{k}</div>
            <div className="hand xl" style={{ lineHeight:1 }}>{v}</div>
            <div className="row between" style={{ marginTop:4, alignItems:'center' }}>
              <span className="xs muted">vs apr</span>
              <Pill tone={t}>{d}</Pill>
            </div>
          </Box>
        ))}
      </div>

      <div className="row gap-3" style={{ flex:1, minHeight:0 }}>
        <Box className="grow">
          <div className="row between"><div className="hand lg">Ricavi vs costi · ultimi 6 mesi</div><div className="row gap-2"><Pill tone="dark">ricavi</Pill><Pill>costi</Pill><Pill tone="hi">margine</Pill></div></div>
          {/* sketch bar chart */}
          <div style={{ position:'relative', height:240, marginTop:12, borderLeft:'1.6px solid var(--rule)', borderBottom:'1.6px solid var(--rule)' }}>
            <div className="row" style={{ alignItems:'end', height:'100%', padding:'0 12px', gap:24 }}>
              {[
                ['Dic',14,6,8],
                ['Gen',13,5,8],
                ['Feb',15,6,9],
                ['Mar',17,7,10],
                ['Apr',16,7,9],
                ['Mag',18,7,11],
              ].map(([m,r,c,mg]) => (
                <div key={m} className="grow row" style={{ alignItems:'end', gap:3, height:'100%' }}>
                  <div className="bar" style={{ width:14, height:`${r*5}%`, background:'var(--ink)' }}></div>
                  <div className="bar" style={{ width:14, height:`${c*5}%`, background:'#fff', border:'1.4px solid var(--rule)' }}></div>
                  <div className="bar hi" style={{ width:14, height:`${mg*5}%` }}></div>
                  <div className="mono tiny muted" style={{ position:'absolute', bottom:-18 }}>{m}</div>
                </div>
              ))}
            </div>
            <span className="annot" style={{ position:'absolute', right:24, top:-2 }}>↑ +18% margine!</span>
          </div>
        </Box>

        <Box style={{ width:300 }}>
          <div className="hand lg">Top categorie di intervento</div>
          <div className="col gap-2" style={{ marginTop:8 }}>
            {[
              ['Sostituzione SSD/HDD',38,'€ 4.320'],
              ['Rimozione virus',24,'€ 1.680'],
              ['Vetro/display smartphone',22,'€ 2.860'],
              ['Pulizia + pasta term.',18,'€ 1.080'],
              ['Recupero dati',12,'€ 2.940'],
              ['Reinstallazione SO',10,'€ 600'],
            ].map(([n,c,t],i) => (
              <div key={n}>
                <div className="row between"><span className="hand md">{n}</span><span className="mono xs muted">{c}× · {t}</span></div>
                <div style={{ height:8, background:'#fff', border:'1.2px solid var(--rule)', borderRadius:3, overflow:'hidden', marginTop:2 }}>
                  <div className="bar hi" style={{ width:`${100-i*14}%`, height:'100%' }}></div>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </div>

      <div className="row gap-3">
        <Box className="grow">
          <div className="hand lg">Fornitori · spese mese</div>
          <table className="tbl" style={{ marginTop:4 }}>
            <thead><tr><th>Fornitore</th><th>Ordini</th><th>Speso</th><th>Ultima fattura</th></tr></thead>
            <tbody>
              <tr><td className="hand md">DigitalParts srl</td><td>8</td><td className="hand md">€ 3.240</td><td className="mono xs muted">12/05</td></tr>
              <tr><td className="hand md">RAMItalia</td><td>3</td><td className="hand md">€ 1.180</td><td className="mono xs muted">09/05</td></tr>
              <tr><td className="hand md">PhonePartsEU</td><td>5</td><td className="hand md">€ 1.760</td><td className="mono xs muted">06/05</td></tr>
            </tbody>
          </table>
        </Box>
        <Box hi style={{ width:300 }}>
          <div className="hand lg">Alert</div>
          <ul style={{ margin:'4px 0 0 16px', padding:0, fontSize:14, lineHeight:1.4 }}>
            <li>3 interventi {">"} 14gg senza chiusura</li>
            <li>2 ordini fornitori in ritardo</li>
            <li>5 fatture da emettere</li>
            <li>Inventario fisico mai fatto</li>
          </ul>
        </Box>
      </div>
    </div>
  </div>
);

// D) Dashboard "minimal / tile" — esplorativa, big-numbers + sketch icons
const DashD = () => (
  <div className="sheet" style={{ padding:24, display:'flex', flexDirection:'column', gap:16 }}>
    <div className="row between" style={{ alignItems:'center' }}>
      <Logo size={40} />
      <div className="row gap-3" style={{ alignItems:'center' }}>
        <span className="hand md muted">lun 15 mag · ore 09:42</span>
        <Btn size="sm">esci</Btn>
      </div>
    </div>
    <div className="title" style={{ fontSize:60, lineHeight:1 }}>Ciao Marco, <span className="hi-mark">7 ritiri</span> oggi.</div>
    <div className="subtitle" style={{ fontSize:18 }}>Apri quello che ti serve. Tutto il resto è in archivio.</div>

    <div className="row gap-3" style={{ flex:1, minHeight:0 }}>
      {/* big tiles grid */}
      <div style={{ flex:1, display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gridTemplateRows:'repeat(2, 1fr)', gap:14 }}>
        <Box style={{ background:'var(--ink)', color:'var(--paper)', display:'flex', flexDirection:'column', justifyContent:'space-between' }} shadow>
          <div className="hand" style={{ fontSize:30, color:'var(--paper)' }}>+ Accetta</div>
          <div className="mono xs" style={{ color:'#cfc8b8' }}>nuovo dispositivo al banco</div>
        </Box>
        <Box hi shadow style={{ display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <div className="hand" style={{ fontSize:30 }}>↗ Ritira</div>
          <div className="mono xs muted">7 pronti per il ritiro</div>
        </Box>
        <Box shadow style={{ display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <div className="hand" style={{ fontSize:30 }}>⚙ Interventi</div>
          <div className="mono xs muted">24 attivi · 5 attesa pezzi</div>
        </Box>
        <Box shadow style={{ display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <div className="hand" style={{ fontSize:30 }}>☺ Clienti</div>
          <div className="mono xs muted">1.247 registrati</div>
        </Box>
        <Box shadow style={{ display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <div className="hand" style={{ fontSize:30 }}>▦ Magazzino</div>
          <div className="mono xs muted">3 sottoscorta · ordina</div>
        </Box>
        <Box shadow style={{ display:'flex', flexDirection:'column', justifyContent:'space-between' }}>
          <div className="hand" style={{ fontSize:30 }}>€ Conti</div>
          <div className="mono xs muted">€ 1.240 oggi</div>
        </Box>
      </div>

      {/* side: glance */}
      <div className="col gap-3" style={{ width:300 }}>
        <Box className="fill-2">
          <div className="hand lg">Settimana a colpo d'occhio</div>
          <div className="row" style={{ alignItems:'end', height:90, marginTop:8, gap:6 }}>
            {[40,65,35,80,55,90,72].map((h,i) => (
              <div key={i} className="grow col center">
                <div className="bar" style={{ width:'100%', height:`${h}%`, background:i===6?'var(--hi)':'var(--ink)' }}></div>
                <span className="mono tiny muted">{['L','M','M','G','V','S','D'][i]}</span>
              </div>
            ))}
          </div>
          <HR style={{ margin:'10px 0' }} />
          <div className="row between"><span>Incasso sett.</span><span className="hand lg"><span className="hi-mark">€ 4.380</span></span></div>
          <div className="row between"><span>Interventi chiusi</span><span className="hand lg">31</span></div>
        </Box>
        <div className="stickynote">
          richiamare<br/>il sig. <u>Bianchi</u> per<br/>il preventivo HP!
        </div>
      </div>
    </div>
  </div>
);

window.DashA = DashA; window.DashB = DashB; window.DashC = DashC; window.DashD = DashD;
