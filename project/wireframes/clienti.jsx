// Anagrafica clienti — 2 varianti

// A) Lista + scheda cliente (master/detail)
const ClientsA = () => (
  <div className="sheet" style={{ display:'flex' }}>
    <Sidebar active="clients" />
    <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
      <TopBar
        title="Clienti"
        sub="1.247 anagrafiche · 86 attivi negli ultimi 90gg"
        breadcrumbs="HOME / CLIENTI"
        right={<>
          <Search placeholder="cerca nome, tel, P.IVA…" w={260} />
          <Btn size="sm">📥 importa</Btn>
          <Btn size="sm" tone="primary">+ nuovo cliente</Btn>
        </>}
      />
      <div style={{ flex:1, display:'flex', minHeight:0 }}>
        {/* list */}
        <div style={{ width:340, borderRight:'1.6px solid var(--rule)', display:'flex', flexDirection:'column' }}>
          <div className="row gap-2 wrap" style={{ padding:'8px 10px', borderBottom:'1.4px solid var(--rule)' }}>
            <Pill tone="dark">tutti</Pill>
            <Pill>privati</Pill>
            <Pill>aziende</Pill>
            <Pill tone="hi">A-Z ↓</Pill>
          </div>
          <div style={{ flex:1, overflow:'auto' }}>
            {[
              ['B','Bianchi Mario','349 12 34 567','3 interv. · ultimo 12/04','€ 420',true],
              ['B','Bruno Tommaso','340 99 88 777','1 interv. · 8gg fa','€ 190'],
              ['C','Caputo Marco','339 11 22 333','5 interv. · 25gg fa','€ 980'],
              ['C','Conti Paolo','333 22 11 444','2 interv. · 4gg fa','€ 0'],
              ['D','De Luca Filippo','347 55 66 777','1 interv. · 6gg fa','€ 140'],
              ['E','Esposito Anna','349 12 34 567','7 interv. · 3gg fa','€ 1.240'],
              ['G','Greco Lucia','388 44 55 666','1 interv. · 3gg fa','€ 90'],
              ['M','Marini Andrea','333 77 88 999','1 interv. · 7gg fa','€ 220'],
              ['R','Rossi Giulia','345 11 22 333','4 interv. · 2gg fa','€ 980'],
              ['V','Verdi srl ★','06 1234 5678','12 interv. · oggi','€ 4.200'],
            ].map((r,i) => (
              <div key={r[1]} style={{
                padding:'8px 12px', borderBottom:'1px dashed var(--rule)',
                background: r[5] ? 'var(--hi)' : 'transparent',
                display:'flex', gap:10, alignItems:'center'
              }}>
                <div className="hand" style={{
                  width:34, height:34, borderRadius:'50%',
                  border:'1.6px solid var(--rule)', display:'flex',
                  alignItems:'center', justifyContent:'center', fontSize:18, flex:'none',
                  background:'#fff'
                }}>{r[0]}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div className="hand md" style={{ lineHeight:1 }}>{r[1]}</div>
                  <div className="mono tiny muted">{r[2]} · {r[3]}</div>
                </div>
                <span className="hand md">{r[4]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* detail */}
        <div style={{ flex:1, padding:'18px 22px', display:'flex', flexDirection:'column', gap:14, minWidth:0 }}>
          <div className="row between" style={{ alignItems:'flex-start' }}>
            <div className="row gap-3" style={{ alignItems:'center' }}>
              <div className="hand" style={{
                width:64, height:64, borderRadius:'50%',
                border:'2px solid var(--rule)', display:'flex',
                alignItems:'center', justifyContent:'center', fontSize:36,
                background:'var(--hi)'
              }}>B</div>
              <div>
                <div className="title">Bianchi Mario</div>
                <div className="subtitle">Cliente privato · dal 14/03/2023 · ID #1042</div>
              </div>
            </div>
            <div className="row gap-2">
              <Btn size="sm">📞 349 12 34 567</Btn>
              <Btn size="sm">✉ m.bianchi@gmail.com</Btn>
              <Btn size="sm" tone="hi">+ nuovo intervento</Btn>
              <Btn size="sm">⋯</Btn>
            </div>
          </div>

          <div className="row gap-3">
            {[
              ['Interventi totali','3'],
              ['Speso totale','€ 420'],
              ['Scontrino medio','€ 140'],
              ['Ultimo accesso','12/04/2026'],
            ].map(([k,v]) => (
              <Box key={k} className="grow" style={{ padding:'8px 12px' }}>
                <div className="mono tiny muted" style={{ textTransform:'uppercase' }}>{k}</div>
                <div className="hand xl">{v}</div>
              </Box>
            ))}
          </div>

          <div className="row gap-3" style={{ flex:1, minHeight:0 }}>
            <Box className="grow" style={{ display:'flex', flexDirection:'column', minHeight:0 }}>
              <div className="hand lg">Storico interventi</div>
              <table className="tbl" style={{ marginTop:4 }}>
                <thead><tr><th>N°</th><th>Data</th><th>Dispositivo</th><th>Esito</th><th>Totale</th></tr></thead>
                <tbody>
                  <tr><td className="mono xs">#2411</td><td className="mono xs">15/05</td><td className="hand md">HP Pavilion 15</td><td><Pill>in accettazione</Pill></td><td className="hand md">—</td></tr>
                  <tr><td className="mono xs">#2287</td><td className="mono xs">12/04</td><td className="hand md">HP Pavilion 15</td><td><Pill tone="dark">consegnato</Pill></td><td className="hand md">€ 180</td></tr>
                  <tr><td className="mono xs">#2104</td><td className="mono xs">28/01</td><td className="hand md">iPhone 11</td><td><Pill tone="dark">consegnato</Pill></td><td className="hand md">€ 95</td></tr>
                  <tr><td className="mono xs">#1856</td><td className="mono xs">04/10/25</td><td className="hand md">HP Pavilion 15</td><td><Pill tone="dark">consegnato</Pill></td><td className="hand md">€ 145</td></tr>
                </tbody>
              </table>
            </Box>
            <div className="col gap-3" style={{ width:280 }}>
              <Box>
                <div className="hand lg">Anagrafica</div>
                <HR />
                <div className="col gap-2" style={{ fontSize:14, marginTop:4 }}>
                  <div><span className="muted">CF:</span> <span className="mono xs">BNCMRA70…</span></div>
                  <div><span className="muted">Indirizzo:</span><br/>Via Roma 12, Bologna</div>
                  <div><span className="muted">P.IVA:</span> —</div>
                  <div><span className="muted">SDI / PEC:</span> —</div>
                </div>
              </Box>
              <Box className="fill-2">
                <div className="hand lg">Note</div>
                <HR />
                <div className="hand md" style={{ marginTop:6 }}>
                  Cliente fedele. Preferisce essere richiamato dopo le 18:00.
                  Mai pagato in ritardo.
                </div>
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// B) Tile-style + filtri visuali — focus su CRM leggero
const ClientsB = () => (
  <div className="sheet" style={{ display:'flex', flexDirection:'column' }}>
    <TopBar
      title="Clienti"
      sub="Cosa ti serve? Cerca, filtra, raggruppa."
      breadcrumbs="HOME / CLIENTI"
      right={<>
        <Btn size="sm">📥 importa CSV</Btn>
        <Btn size="sm" tone="primary">+ nuovo cliente</Btn>
      </>}
    />
    <div style={{ padding:18, display:'flex', flexDirection:'column', gap:14, flex:1, minHeight:0 }}>
      <Box>
        <div className="row gap-3" style={{ alignItems:'center' }}>
          <Search placeholder="nome, telefono, email, P.IVA, seriale…" w={400} />
          <span className="mono tiny muted">FILTRA PER:</span>
          <Pill tone="dark">tutti 1247</Pill>
          <Pill>privati 1102</Pill>
          <Pill>aziende 145</Pill>
          <Pill tone="hi">attivi 90gg 86</Pill>
          <Pill tone="warn">dormienti &gt;1 anno 380</Pill>
          <Pill tone="ok">VIP ★ 12</Pill>
        </div>
      </Box>

      <div className="row gap-3" style={{ flex:1, minHeight:0 }}>
        {/* tile grid */}
        <div className="grow" style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:12, alignContent:'start' }}>
          {[
            ['Verdi srl','★ VIP','12 int. · €4.200','oggi · #2409','hi'],
            ['Esposito Anna','7 int.','€ 1.240','3gg · #2408','ok'],
            ['Caputo Marco','5 int.','€ 980','25gg · #2402',''],
            ['Rossi Giulia','4 int.','€ 980','2gg · #2410',''],
            ['Bianchi Mario','3 int.','€ 420','oggi · #2411','hi'],
            ['Conti Paolo','2 int.','€ 0 (non rip.)','4gg · #2407','warn'],
            ['Marini Andrea','1 int.','€ 220','7gg · #2401',''],
            ['Greco Lucia','1 int.','€ 90','3gg · #2404',''],
            ['Bruno Tommaso','1 int.','€ 190','8gg · #2394',''],
          ].map(([n,tag,stat,last,tone],i) => (
            <Box key={n} shadow style={{ padding:14 }}>
              <div className="row between" style={{ alignItems:'flex-start' }}>
                <div className="row gap-3" style={{ alignItems:'center' }}>
                  <div className="hand" style={{
                    width:42, height:42, borderRadius:'50%',
                    border:'1.6px solid var(--rule)', display:'flex',
                    alignItems:'center', justifyContent:'center', fontSize:22,
                    background:'#fff'
                  }}>{n[0]}</div>
                  <div>
                    <div className="hand lg" style={{ lineHeight:1 }}>{n}</div>
                    <div className="mono tiny muted">{stat}</div>
                  </div>
                </div>
                {tag && <Pill tone={tone}>{tag}</Pill>}
              </div>
              <HR style={{ margin:'8px 0' }} />
              <div className="row between" style={{ alignItems:'center' }}>
                <span className="mono tiny muted">ultimo intervento</span>
                <span className="hand md">{last}</span>
              </div>
              <div className="row gap-2" style={{ marginTop:6 }}>
                <Btn size="sm" tone="ghost">📞</Btn>
                <Btn size="sm" tone="ghost">✉</Btn>
                <Btn size="sm" tone="ghost">apri →</Btn>
              </div>
            </Box>
          ))}
        </div>

        {/* side analytics */}
        <div className="col gap-3" style={{ width:280 }}>
          <Box className="fill-2">
            <div className="hand lg">Nuovi clienti</div>
            <div className="row" style={{ alignItems:'end', height:80, gap:6, marginTop:8 }}>
              {[5,8,12,7,9,14,11].map((h,i) => (
                <div key={i} className="grow col center">
                  <div className="bar" style={{ width:'100%', height:`${h*7}%`, background: i===6?'var(--hi)':'var(--ink)' }}></div>
                  <span className="mono tiny muted">sett{i+1}</span>
                </div>
              ))}
            </div>
            <HR style={{ margin:'8px 0' }} />
            <div className="row between"><span>Q1 2026</span><span className="hand md">+47</span></div>
            <div className="row between"><span>questo mese</span><span className="hand md"><span className="hi-mark">+18</span></span></div>
          </Box>
          <Box>
            <div className="hand lg">Da contattare</div>
            <ul style={{ margin:'4px 0 0 16px', padding:0, fontSize:14 }}>
              <li>Esposito A. — pronto ritiro</li>
              <li>Conti P. — esito n.r.</li>
              <li>Studio LM — pronto</li>
              <li>Greco L. — preventivo OK?</li>
            </ul>
          </Box>
        </div>
      </div>
    </div>
  </div>
);

window.ClientsA = ClientsA; window.ClientsB = ClientsB;
