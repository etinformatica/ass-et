// Lista interventi — 3 varianti

// A) Tabella + filtri laterali — denso, da gestionale
const TicketsA = () => (
  <div className="sheet" style={{ display:'flex' }}>
    <Sidebar active="tickets" />
    <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
      <TopBar
        title="Interventi"
        sub="Tutti gli interventi · 142 totali · 49 attivi"
        breadcrumbs="HOME / INTERVENTI"
        right={<>
          <Search placeholder="cerca N° / cliente / seriale" w={260} />
          <Btn size="sm">📥 export CSV</Btn>
          <Btn size="sm" tone="primary">+ nuovo</Btn>
        </>}
      />
      <div style={{ flex:1, display:'flex', minHeight:0 }}>
        {/* filter sidebar */}
        <div style={{ width:220, borderRight:'1.6px solid var(--rule)', padding:14, display:'flex', flexDirection:'column', gap:14 }}>
          <div>
            <div className="hand md">Stato</div>
            <div className="col gap-2" style={{ marginTop:4 }}>
              {[
                ['Tutti',49,true],
                ['Accettazione',3],
                ['In diagnosi',8],
                ['Attesa pezzi',5],
                ['Attesa cliente',4],
                ['In lavorazione',12],
                ['Pronti ritiro',7],
                ['Consegnati',10],
                ['Non riparabile',2],
              ].map(([n,c,a]) => (
                <div key={n} className="row between" style={{
                  fontSize:14, padding:'2px 6px', borderRadius:4,
                  background: a?'var(--hi)':'transparent', fontWeight: a?700:400
                }}>
                  <span>{n}</span><span className="mono xs muted">{c}</span>
                </div>
              ))}
            </div>
          </div>
          <HR />
          <div>
            <div className="hand md">Tecnico</div>
            <div className="col gap-2" style={{ marginTop:4 }}>
              <Chk on>Tutti</Chk><Chk>Luca M.</Chk><Chk>Marco T.</Chk><Chk>Sara R.</Chk>
            </div>
          </div>
          <HR />
          <div>
            <div className="hand md">Priorità</div>
            <div className="col gap-2" style={{ marginTop:4 }}>
              <Chk>🔴 Urgente</Chk><Chk on>🟡 Normale</Chk><Chk>🟢 Bassa</Chk>
            </div>
          </div>
          <HR />
          <div>
            <div className="hand md">Periodo</div>
            <div className="col gap-2" style={{ marginTop:4 }}>
              <Rad on>questo mese</Rad><Rad>ultimi 7gg</Rad><Rad>personalizzato</Rad>
            </div>
          </div>
        </div>

        {/* table area */}
        <div style={{ flex:1, padding:14, minWidth:0 }}>
          <div className="row gap-2" style={{ marginBottom:8 }}>
            <Pill tone="dark">49 risultati</Pill>
            <Pill>ordinato per: data ingresso ↓</Pill>
            <span style={{ flex:1 }}></span>
            <span className="mono xs muted">pag. 1 / 3 · ‹ ›</span>
          </div>
          <Box style={{ padding:0, overflow:'hidden' }}>
            <table className="tbl">
              <thead><tr>
                <th style={{width:28}}><Chk /></th>
                <th>N°</th><th>Ingresso</th><th>Cliente</th><th>Dispositivo</th>
                <th>Difetto</th><th>Tecnico</th><th>Stato</th><th>Max €</th><th>Pezzi</th><th></th>
              </tr></thead>
              <tbody>
                {[
                  ['#2411','15/05','Bianchi Mario','HP Pavilion 15','non si avvia','Luca','accettazione','150','—',0],
                  ['#2410','13/05','Rossi Giulia','MacBook Air M1','tastiera bagnata','Marco','attesa pezzi','280','€ 89',1],
                  ['#2409','13/05','Verdi srl','Dell OptiPlex','lento, virus','Luca','in lavorazione','100','—',0],
                  ['#2408','12/05','Esposito Anna','iPhone 12','vetro rotto','Sara','pronto','120','€ 35',1],
                  ['#2407','12/05','Conti Paolo','Lenovo IdeaPad','HDD click','Luca','non riparabile','200','—',0],
                  ['#2406','11/05','Studio Neri','HP LaserJet','righe stampa','Marco','consegnato','80','€ 22',0],
                  ['#2405','10/05','Romano Luigi','Asus ROG','overheat','Sara','in lavorazione','150','€ 18',0],
                  ['#2404','10/05','Greco Lucia','iPad 9','batteria','Sara','attesa cliente','90','€ 24',1],
                  ['#2403','09/05','De Luca F.','Samsung S22','vetro retro','Sara','in diagnosi','140','—',0],
                  ['#2402','09/05','Caputo M.','HP Envy 13','non carica','Luca','attesa pezzi','170','€ 45',2],
                  ['#2401','08/05','Marini A.','iMac 2019','si spegne','Marco','in diagnosi','220','—',0],
                ].map(r => (
                  <tr key={r[0]}>
                    <td><Chk /></td>
                    <td className="mono xs">{r[0]}</td>
                    <td className="mono xs muted">{r[1]}</td>
                    <td className="hand md">{r[2]}</td>
                    <td>{r[3]}</td>
                    <td className="muted xs">{r[4]}</td>
                    <td><Pill>{r[5]}</Pill></td>
                    <td><Pill tone={
                      r[6]==='pronto'?'ok':
                      r[6]==='attesa pezzi'?'warn':
                      r[6]==='non riparabile'?'warn':
                      r[6]==='consegnato'?'dark':
                      r[6]==='attesa cliente'?'note':''
                    }>{r[6]}</Pill></td>
                    <td className="mono xs">{r[7]}</td>
                    <td className="mono xs muted">{r[8]} {r[9]>0 && <span className="annot" style={{fontSize:12}}>!</span>}</td>
                    <td><span className="mono xs muted">⋯</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </div>
      </div>
    </div>
  </div>
);

// B) Kanban — interventi per stato, drag&drop
const TicketsB = () => {
  const cols = [
    ['Accettazione','',[['#2411','Bianchi M.','HP Pavilion','oggi','€150']]],
    ['Diagnosi','',[
      ['#2403','De Luca F.','Samsung S22','3gg','€140'],
      ['#2401','Marini A.','iMac 2019','4gg','€220'],
      ['#2399','Costa G.','Dell XPS 13','5gg','€180'],
    ]],
    ['Attesa pezzi','warn',[
      ['#2410','Rossi G.','MacBook Air','2gg','€280','tastiera IT'],
      ['#2402','Caputo M.','HP Envy','4gg','€170','batteria + tast.'],
    ]],
    ['Attesa cliente','note',[
      ['#2404','Greco L.','iPad 9','3gg','€90','OK preventivo?'],
      ['#2396','Galli P.','Dell Latitude','6gg','€220','reso senza fix'],
    ]],
    ['In lavorazione','hi',[
      ['#2409','Verdi srl','Dell OptiPlex','oggi','€100'],
      ['#2405','Romano L.','Asus ROG','5gg','€150'],
      ['#2398','Sanna R.','MSI GE66','7gg','€220'],
      ['#2394','Bruno T.','HP Spectre','8gg','€190'],
    ]],
    ['Pronto','ok',[
      ['#2408','Esposito A.','iPhone 12','3gg','€120','chiama!'],
      ['#2400','Studio LM','HP LJ Pro','5gg','€80'],
    ]],
    ['Consegnato','dark',[
      ['#2406','Studio Neri','HP LaserJet','oggi','€80'],
      ['#2393','Russo G.','iPhone 11','1gg','€95'],
    ]],
  ];
  return (
    <div className="sheet" style={{ display:'flex', flexDirection:'column' }}>
      <TopBar
        title="Interventi · kanban"
        sub="Trascina le card tra le colonne per aggiornare lo stato"
        breadcrumbs="HOME / INTERVENTI / BOARD"
        right={<>
          <Pill>49 attivi</Pill>
          <Search placeholder="cerca…" w={200} />
          <Btn size="sm">⚙</Btn>
          <Btn size="sm" tone="primary">+ nuovo</Btn>
        </>}
      />
      <div style={{ padding:14, flex:1, display:'flex', gap:10, overflow:'auto' }}>
        {cols.map(([title, tone, cards]) => (
          <div key={title} className="k-col" style={{ minWidth:200 }}>
            <div className="row between" style={{ alignItems:'center' }}>
              <div className="hand md">{title}</div>
              <Pill tone={tone}>{cards.length}</Pill>
            </div>
            <HR />
            {cards.map(c => (
              <div key={c[0]} className={`k-card ${c[5]==='chiama!'?'urgent':''}`}>
                <div className="row between"><span className="mono tiny muted">{c[0]}</span><span className="mono tiny muted">{c[3]}</span></div>
                <div className="hand md" style={{ marginTop:2 }}>{c[1]}</div>
                <div className="xs muted">{c[2]}</div>
                <div className="row between" style={{ marginTop:4, alignItems:'center' }}>
                  <span className="mono tiny">{c[4]}</span>
                  {c[5] && <span className={`annot ${c[5]==='chiama!'?'':'note'}`} style={{fontSize:13}}>{c[5]}</span>}
                </div>
              </div>
            ))}
            <div className="k-card" style={{
              background:'transparent', borderStyle:'dashed', color:'var(--ink-3)',
              textAlign:'center', boxShadow:'none', cursor:'pointer'
            }}>+ aggiungi</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// C) Lista + dettaglio split — master/detail
const TicketsC = () => (
  <div className="sheet" style={{ display:'flex' }}>
    <Sidebar active="tickets" />
    <div style={{ flex:1, display:'flex', minWidth:0 }}>
      {/* master */}
      <div style={{ width:330, borderRight:'1.6px solid var(--rule)', display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'12px 12px 8px', borderBottom:'1.4px solid var(--rule)' }}>
          <div className="row between" style={{ alignItems:'center' }}>
            <span className="hand lg">Interventi</span>
            <Btn size="sm" tone="primary">+</Btn>
          </div>
          <Search placeholder="cerca…" w="100%" />
          <div className="row gap-2 wrap" style={{ marginTop:6 }}>
            <Pill tone="dark">tutti</Pill>
            <Pill>diagnosi</Pill>
            <Pill tone="warn">attesa pezzi</Pill>
            <Pill tone="ok">pronti</Pill>
          </div>
        </div>
        <div style={{ flex:1, overflow:'auto', padding:'8px 8px' }}>
          {[
            ['#2411','Bianchi Mario','HP Pavilion 15','non si avvia','accettazione','15/05',true],
            ['#2410','Rossi Giulia','MacBook Air M1','tastiera bagnata','attesa pezzi','13/05'],
            ['#2409','Verdi srl','Dell OptiPlex','virus, lento','in lavorazione','13/05'],
            ['#2408','Esposito Anna','iPhone 12','vetro rotto','pronto','12/05'],
            ['#2407','Conti Paolo','Lenovo IdeaPad','HDD','n. riparabile','12/05'],
            ['#2406','Studio Neri','HP LaserJet','righe','consegnato','11/05'],
            ['#2405','Romano L.','Asus ROG','overheat','in lavorazione','10/05'],
          ].map((r,i) => (
            <div key={r[0]} className="box thin" style={{
              padding:'8px 10px', marginBottom:6,
              background: r[6] ? 'var(--hi)' : '#fff',
              border: r[6] ? '2px solid var(--ink)' : '1.3px solid var(--rule)'
            }}>
              <div className="row between"><span className="mono tiny">{r[0]} · {r[5]}</span>
                <Pill tone={r[4]==='pronto'?'ok':r[4]==='attesa pezzi'?'warn':r[4]==='consegnato'?'dark':r[4]==='n. riparabile'?'warn':''}>{r[4]}</Pill>
              </div>
              <div className="hand md" style={{ lineHeight:1 }}>{r[1]}</div>
              <div className="xs">{r[2]}</div>
              <div className="xs muted" style={{ fontStyle:'italic' }}>“{r[3]}”</div>
            </div>
          ))}
        </div>
      </div>

      {/* detail */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <div style={{ padding:'14px 22px', borderBottom:'1.6px solid var(--rule)' }}>
          <div className="row between" style={{ alignItems:'flex-end' }}>
            <div>
              <div className="mono xs muted">SCHEDA INTERVENTO #2411 · in accettazione</div>
              <div className="title">Bianchi Mario <span className="muted">·</span> <span className="hi-mark">HP Pavilion 15</span></div>
              <div className="subtitle">Aperto oggi · ore 09:42 · Tecnico: Luca M. · Tel 349 12 34 567</div>
            </div>
            <div className="row gap-2">
              <Btn size="sm">📞</Btn><Btn size="sm">✉ SMS</Btn>
              <Btn size="sm">🖨 bolla</Btn>
              <Btn size="sm" tone="hi">cambia stato ▾</Btn>
            </div>
          </div>
        </div>

        <div style={{ flex:1, display:'flex', gap:14, padding:18, minHeight:0 }}>
          <div className="col gap-3 grow" style={{ minWidth:0 }}>
            <Box>
              <div className="row between"><div className="hand lg">Difetto + diagnosi</div><Btn size="sm" tone="ghost">+ nota</Btn></div>
              <HR />
              <div className="col gap-2" style={{ marginTop:6 }}>
                <div>
                  <span className="mono tiny muted">15/05 09:42 · Marco T. · accettazione</span><br/>
                  <span className="hand md">“Non si avvia, ventola sì, schermo nero. Caduto ieri.”</span>
                </div>
                <div>
                  <span className="mono tiny muted">— in attesa diagnosi —</span>
                </div>
              </div>
            </Box>
            <Box>
              <div className="row between"><div className="hand lg">Pezzi usati</div><Btn size="sm" tone="ghost">+ aggiungi da magazzino</Btn></div>
              <HR />
              <table className="tbl">
                <thead><tr><th>Cod.</th><th>Articolo</th><th>Q.</th><th>€ cad.</th><th>€ tot</th></tr></thead>
                <tbody>
                  <tr><td colSpan="5" className="muted xs" style={{ textAlign:'center', padding:18 }}>nessun pezzo ancora assegnato</td></tr>
                </tbody>
              </table>
            </Box>
            <Box>
              <div className="hand lg">Storia (timeline)</div>
              <HR />
              <div className="col gap-2" style={{ marginTop:6, fontSize:14 }}>
                <div className="row gap-3"><span className="mono tiny muted" style={{width:90}}>15/05 09:42</span><span>Accettata da Marco T. · stato → <b>accettazione</b></span></div>
                <div className="row gap-3"><span className="mono tiny muted" style={{width:90}}>15/05 09:43</span><span>Bolla stampata · firmata dal cliente</span></div>
                <div className="row gap-3"><span className="mono tiny muted" style={{width:90}}>15/05 09:45</span><span>SMS conferma inviato → 349 12 34 567</span></div>
              </div>
            </Box>
          </div>

          <div className="col gap-3" style={{ width:280 }}>
            <Box className="fill-2">
              <div className="hand lg">Riepilogo €</div>
              <HR />
              <div className="col gap-2" style={{ fontSize:14 }}>
                <div className="row between"><span>Max autorizzato</span><span className="hand md">€ 150,00</span></div>
                <div className="row between"><span>Pezzi</span><span className="hand md muted">€ 0,00</span></div>
                <div className="row between"><span>Manodopera</span><span className="hand md muted">€ 0,00</span></div>
                <HR />
                <div className="row between"><span className="hand md">Totale</span><span className="hand lg"><span className="hi-mark">€ 0,00</span></span></div>
              </div>
            </Box>
            <Box>
              <div className="hand lg">Foto</div>
              <HR />
              <div className="row gap-2 wrap" style={{ marginTop:4 }}>
                <Placeholder style={{ width:78, height:78 }} diag>fronte</Placeholder>
                <Placeholder style={{ width:78, height:78 }} diag>retro</Placeholder>
              </div>
            </Box>
            <div className="stickynote">cliente ha chiesto:<br/>“entro venerdì se si può”</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

window.TicketsA = TicketsA; window.TicketsB = TicketsB; window.TicketsC = TicketsC;
