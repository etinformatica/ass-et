// Hi-fi screens — clean professional aesthetic
// Inspired by Linear/Notion/Stripe. Geist + Geist Mono.

// ---------- Shared HI-FI primitives ----------
const HFIcon = ({ name, style }) => {
  const paths = {
    home: <path d="M3 9l5-5 5 5v5a1 1 0 01-1 1h-3v-3H7v3H4a1 1 0 01-1-1V9z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>,
    plus: <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>,
    list: <><path d="M3 4h10M3 8h10M3 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></>,
    users: <><circle cx="6" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M2 14c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/><circle cx="11" cy="5" r="1.8" stroke="currentColor" strokeWidth="1.4" fill="none"/></>,
    box: <><path d="M2 5l6-2 6 2v6l-6 2-6-2V5z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/><path d="M2 5l6 2 6-2M8 7v6" stroke="currentColor" strokeWidth="1.4" fill="none"/></>,
    chart: <><path d="M3 13h11M5 11V7M8 11V4M11 11V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/></>,
    euro: <><path d="M11 4.5a3.5 3.5 0 100 7M3 7h6M3 9h6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/></>,
    search: <><circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></>,
    bell: <path d="M8 2c-2 0-3.5 1.5-3.5 3.5V8L3 10h10l-1.5-2V5.5C11.5 3.5 10 2 8 2zM6 12a2 2 0 004 0" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>,
    arrow: <path d="M5 8h6m-2-2l2 2-2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    chevron: <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
    filter: <path d="M2 3h12l-4 5v5l-4-2V8L2 3z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>,
    camera: <><rect x="2" y="5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none"/><circle cx="8" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M6 5l1-1.5h2L10 5" stroke="currentColor" strokeWidth="1.4" fill="none"/></>,
  };
  return (
    <svg viewBox="0 0 16 16" className="hifi-i" style={style}>{paths[name]}</svg>
  );
};

const HFBadge = ({ tone='gray', children, dot=true }) => (
  <span className={`hifi-badge ${tone}`}>{dot && <span className="dot"></span>}{children}</span>
);

const HFBtn = ({ children, tone='', size='', icon }) => (
  <button className={`hifi-btn ${tone} ${size}`}>{icon && <HFIcon name={icon}/>}{children}</button>
);

const HFAvatar = ({ name, tone='violet', size='sm' }) => {
  const tones = {
    violet: { bg:'var(--hf-violet-soft)', fg:'var(--hf-violet)' },
    blue: { bg:'var(--hf-blue-soft)', fg:'var(--hf-blue)' },
    green: { bg:'var(--hf-green-soft)', fg:'var(--hf-green)' },
    amber: { bg:'var(--hf-amber-soft)', fg:'var(--hf-amber)' },
    accent: { bg:'var(--hf-accent-soft)', fg:'var(--hf-accent)' },
    gray: { bg:'var(--hf-surface-2)', fg:'var(--hf-text-2)' },
  };
  const t = tones[tone] || tones.violet;
  const initials = name.split(' ').map(n => n[0]).slice(0,2).join('');
  return (
    <span className={`hifi-avatar-${size}`} style={{ background:t.bg, color:t.fg }}>{initials}</span>
  );
};

const HFSidebar = ({ active }) => {
  const items = [
    ['dashboard','home','Dashboard',null],
    ['accept','plus','Nuova accettazione',null,'accent'],
    ['tickets','list','Interventi','49'],
    ['clients','users','Clienti','1.2k'],
    ['warehouse','box','Magazzino','3','accent'],
    ['accounting','euro','Contabilità',null],
    ['reports','chart','Report',null],
  ];
  return (
    <aside className="hifi-sidebar">
      <div className="hifi-brand">
        <div className="hifi-brand-mark">A</div>
        <div>
          <div className="hifi-brand-name">Ass-et</div>
          <div className="hifi-brand-suffix">v 2.4</div>
        </div>
      </div>
      <div className="hifi-section-label">workspace</div>
      {items.map(([id,ico,label,count,countTone]) => (
        <div key={id} className={`hifi-nav ${active===id?'active':''}`}>
          <HFIcon name={ico} style={{color: active===id?'var(--hf-text)':'var(--hf-text-3)'}}/>
          <span>{label}</span>
          {count && <span className={`hifi-nav-count ${countTone||''}`}>{count}</span>}
        </div>
      ))}
      <div className="hifi-user">
        <HFAvatar name="Marco T" tone="violet"/>
        <div>
          <div className="hifi-user-name">Marco T.</div>
          <div className="hifi-user-role">Tecnico · banco</div>
        </div>
      </div>
    </aside>
  );
};

const HFTopbar = ({ crumbs, right }) => (
  <div className="hifi-topbar">
    {crumbs.map((c,i,arr) => (
      <React.Fragment key={i}>
        <span className={i===arr.length-1?'hifi-topbar-title':'hifi-topbar-sub'}>{c}</span>
        {i<arr.length-1 && <span className="hifi-topbar-sep">/</span>}
      </React.Fragment>
    ))}
    <div className="hifi-topbar-spacer"></div>
    <div className="hifi-search">
      <HFIcon name="search"/>
      <span>Cerca tutto…</span>
      <span className="hifi-search-kbd">⌘K</span>
    </div>
    {right}
  </div>
);

// =================== HI-FI · DASHBOARD ===================
const HifiDash = () => (
  <div className="hifi">
    <div className="hifi-shell">
      <HFSidebar active="dashboard"/>
      <main className="hifi-main">
        <HFTopbar crumbs={['Dashboard']} right={<>
          <HFBtn icon="bell" tone="ghost" size="sm"/>
          <HFBtn tone="primary" icon="plus">Nuova accettazione</HFBtn>
        </>}/>
        <div className="hifi-content">
          <div className="hifi-page-head">
            <div>
              <div className="hifi-page-title">Buongiorno Marco 👋</div>
              <div className="hifi-page-sub">Lunedì 16 maggio · 7 ritiri da chiamare · 3 articoli sottoscorta</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <HFBtn size="sm">Oggi</HFBtn>
              <HFBtn size="sm" tone="primary">Questa settimana</HFBtn>
              <HFBtn size="sm">Maggio</HFBtn>
            </div>
          </div>

          {/* KPI strip */}
          <div className="hifi-kpi-row">
            {[
              ['Interventi attivi','49',null,'flat','+3 oggi'],
              ['Pronti per ritiro','7',null,'up','azione'],
              ['In attesa pezzi','5',null,'down','>3gg: 2'],
              ['Incasso oggi','€ 1.240',null,'up','+18%'],
              ['Margine mese','€ 6.480',null,'up','+12%'],
            ].map(([l,v,_,t,d]) => (
              <div key={l} className="hifi-card hifi-kpi">
                <div className="hifi-kpi-label">{l}</div>
                <div className="hifi-kpi-value">{v}</div>
                <span className={`hifi-kpi-trend ${t}`}>{t==='up'?'↑':t==='down'?'↓':'•'} {d}</span>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:16 }}>
            {/* Tickets table */}
            <div className="hifi-card" style={{ padding:0 }}>
              <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--hf-border)', display:'flex', alignItems:'center', gap:10 }}>
                <span style={{ fontWeight:600, fontSize:14 }}>Interventi recenti</span>
                <HFBadge tone="gray" dot={false}>24</HFBadge>
                <div style={{ flex:1 }}></div>
                <div className="hifi-tabs" style={{ borderBottom:'none' }}>
                  <div className="hifi-tab active">Tutti</div>
                  <div className="hifi-tab">Miei</div>
                  <div className="hifi-tab">Pronti</div>
                </div>
              </div>
              <table className="hifi-table">
                <thead><tr>
                  <th>N°</th><th>Cliente</th><th>Dispositivo</th>
                  <th>Stato</th><th>Tecnico</th><th>Aperto</th>
                </tr></thead>
                <tbody>
                  {[
                    ['2411','Bianchi Mario','HP Pavilion 15','Accettazione','gray','Luca M.','green','oggi'],
                    ['2410','Rossi Giulia','MacBook Air M1','Attesa pezzi','amber','Marco T.','blue','3gg'],
                    ['2409','Verdi srl','Dell OptiPlex 7090','In lavorazione','violet','Luca M.','green','3gg'],
                    ['2408','Esposito Anna','iPhone 12','Pronto per ritiro','green','Sara R.','amber','4gg'],
                    ['2407','Conti Paolo','Lenovo IdeaPad','Non riparabile','red','Luca M.','green','4gg'],
                    ['2406','Studio Neri','HP LaserJet Pro','Consegnato','gray','Marco T.','blue','5gg'],
                    ['2405','Romano Luigi','Asus ROG Strix','In lavorazione','violet','Sara R.','amber','6gg'],
                  ].map(r => (
                    <tr key={r[0]}>
                      <td className="mono" style={{ color:'var(--hf-text-3)' }}>#{r[0]}</td>
                      <td className="strong">{r[1]}</td>
                      <td style={{ color:'var(--hf-text-2)' }}>{r[2]}</td>
                      <td><HFBadge tone={r[4]}>{r[3]}</HFBadge></td>
                      <td><div style={{ display:'flex', alignItems:'center', gap:6 }}><HFAvatar name={r[5]} tone={r[6]}/>{r[5]}</div></td>
                      <td style={{ color:'var(--hf-text-3)' }}>{r[7]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Right rail */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="hifi-card">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <div className="hifi-card-title">Pronti per ritiro</div>
                  <HFBadge tone="green">7 da chiamare</HFBadge>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {[
                    ['Esposito Anna','iPhone 12 · vetro','€ 95,00','green','#2408'],
                    ['Studio Neri','HP LaserJet','€ 60,00','green','#2400'],
                    ['Conti Paolo','Lenovo · n. ripar.','€ 0,00','red','#2407'],
                  ].map(r => (
                    <div key={r[4]} style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <HFAvatar name={r[0]} tone={r[3]}/>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:500 }}>{r[0]}</div>
                        <div style={{ fontSize:11, color:'var(--hf-text-3)' }}>{r[1]} · {r[4]}</div>
                      </div>
                      <div style={{ fontSize:13, fontWeight:500, fontFamily:'Geist Mono, monospace' }}>{r[2]}</div>
                    </div>
                  ))}
                </div>
                <div style={{ borderTop:'1px solid var(--hf-border)', marginTop:12, paddingTop:12 }}>
                  <HFBtn size="sm">Vedi tutti i 7 pronti →</HFBtn>
                </div>
              </div>

              <div className="hifi-card">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <div className="hifi-card-title">Incassi settimana</div>
                  <span style={{ fontSize:11, color:'var(--hf-text-3)' }}>€ 4.380</span>
                </div>
                <div style={{ display:'flex', alignItems:'end', gap:8, height:80 }}>
                  {[40,65,35,80,55,90,72].map((h,i) => (
                    <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                      <div className={`hifi-chart-bar ${i===6?'accent':''}`} style={{ width:'100%', height:`${h}%` }}></div>
                      <span className="mono" style={{ fontSize:10, color:'var(--hf-text-3)' }}>{['L','M','M','G','V','S','D'][i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hifi-card" style={{ borderColor:'var(--hf-amber)', background:'var(--hf-amber-soft)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                  <span style={{ fontSize:14 }}>⚠</span>
                  <span style={{ fontWeight:600, fontSize:13 }}>3 articoli sottoscorta</span>
                </div>
                <div style={{ fontSize:12, color:'var(--hf-text-2)', lineHeight:1.5 }}>
                  SSD 1TB NVMe (2/5)<br/>
                  Pasta term. Kryonaut (1/4)<br/>
                  Tastiera MBA M1 IT (0/2)
                </div>
                <div style={{ marginTop:10 }}>
                  <HFBtn size="sm" tone="accent">Genera ordine fornitore →</HFBtn>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
);

// =================== HI-FI · ACCETTAZIONE ===================
const HifiAccept = () => (
  <div className="hifi">
    <div className="hifi-shell">
      <HFSidebar active="accept"/>
      <main className="hifi-main">
        <HFTopbar crumbs={['Interventi','Nuova accettazione']} right={<>
          <HFBtn size="sm">Annulla</HFBtn>
          <HFBtn size="sm">Salva bozza</HFBtn>
          <HFBtn size="sm" tone="primary">Conferma e stampa bolla</HFBtn>
        </>}/>
        <div className="hifi-content">
          <div className="hifi-page-head">
            <div>
              <div className="hifi-page-title">Nuova accettazione</div>
              <div className="hifi-page-sub">Numero #2411 sarà assegnato al salvataggio · Operatore: Marco T.</div>
            </div>
            <HFBadge tone="gray" dot={false}>Bozza</HFBadge>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:16 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Cliente */}
              <div className="hifi-card">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                    <span style={{ width:22, height:22, borderRadius:'50%', background:'var(--hf-text)', color:'#fff', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600 }}>1</span>
                    <span style={{ fontWeight:600, fontSize:15 }}>Cliente</span>
                  </div>
                  <div style={{ display:'flex', gap:6 }}>
                    <span className="hifi-pill active">Esistente</span>
                    <span className="hifi-pill">Nuovo</span>
                    <span className="hifi-pill">Azienda</span>
                  </div>
                </div>
                <div style={{ display:'flex', gap:10, alignItems:'flex-end', padding:'10px 12px', background:'var(--hf-accent-soft)', borderRadius:8, marginBottom:14 }}>
                  <HFAvatar name="Bianchi Mario" tone="accent" size="md"/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:14 }}>Bianchi Mario</div>
                    <div style={{ fontSize:12, color:'var(--hf-text-3)' }}>349 12 34 567 · m.bianchi@gmail.com · 3 interventi · cliente dal 2023</div>
                  </div>
                  <HFBtn size="sm">Cambia</HFBtn>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10 }}>
                  <div>
                    <label className="hifi-label">Codice fiscale</label>
                    <div className="hifi-input mono" style={{ color:'var(--hf-text-2)' }}>BNCMRA70R12A944J</div>
                  </div>
                  <div>
                    <label className="hifi-label">Telefono</label>
                    <div className="hifi-input mono">349 12 34 567</div>
                  </div>
                  <div>
                    <label className="hifi-label">Email</label>
                    <div className="hifi-input">m.bianchi@gmail.com</div>
                  </div>
                </div>
              </div>

              {/* Dispositivo */}
              <div className="hifi-card">
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                  <span style={{ width:22, height:22, borderRadius:'50%', background:'var(--hf-text)', color:'#fff', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600 }}>2</span>
                  <span style={{ fontWeight:600, fontSize:15 }}>Dispositivo</span>
                </div>
                <div style={{ display:'flex', gap:6, marginBottom:14, flexWrap:'wrap' }}>
                  {['PC fisso','Notebook','Smartphone','Tablet','Stampante','Altro'].map((t,i) => (
                    <span key={t} className={`hifi-pill ${i===1?'active':''}`}>{t}</span>
                  ))}
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr 1.5fr', gap:10, marginBottom:10 }}>
                  <div><label className="hifi-label">Marca</label><div className="hifi-input">HP</div></div>
                  <div><label className="hifi-label">Modello</label><div className="hifi-input">Pavilion 15-ec0035nl</div></div>
                  <div><label className="hifi-label">Seriale</label><div className="hifi-input mono">5CD9472X3R</div></div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'2fr 1.5fr 1fr', gap:10 }}>
                  <div><label className="hifi-label">Accessori consegnati</label><div className="hifi-input" style={{color:'var(--hf-text-2)'}}>Alimentatore, borsa, mouse USB</div></div>
                  <div><label className="hifi-label">Stato estetico</label><div className="hifi-input" style={{color:'var(--hf-text-2)'}}>Buono — graffi su coperchio</div></div>
                  <div><label className="hifi-label">Password</label><div className="hifi-input mono">••••••••</div></div>
                </div>
              </div>

              {/* Difetto */}
              <div className="hifi-card">
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                  <span style={{ width:22, height:22, borderRadius:'50%', background:'var(--hf-text)', color:'#fff', display:'inline-flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:600 }}>3</span>
                  <span style={{ fontWeight:600, fontSize:15 }}>Difetto dichiarato</span>
                </div>
                <div className="hifi-input" style={{ minHeight:80, padding:'10px 12px', whiteSpace:'pre-wrap' }}>
                  Non si avvia. La ventola gira ma lo schermo resta nero.{'\n'}Il cliente dichiara che è caduto a terra ieri.
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:10, flexWrap:'wrap' }}>
                  <span style={{ fontSize:11, color:'var(--hf-text-3)', textTransform:'uppercase', letterSpacing:0.04 }}>Sintomi rilevati:</span>
                  <HFBadge tone="gray">non si accende</HFBadge>
                  <HFBadge tone="gray">caduta</HFBadge>
                  <HFBadge tone="gray">schermo nero</HFBadge>
                  <HFBadge tone="accent">+ aggiungi</HFBadge>
                </div>
              </div>
            </div>

            {/* Right summary */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="hifi-card">
                <div className="hifi-card-title" style={{ marginBottom:12 }}>Lavorazione</div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  <div>
                    <label className="hifi-label">Priorità</label>
                    <div style={{ display:'flex', gap:6 }}>
                      <span className="hifi-pill">Bassa</span>
                      <span className="hifi-pill active">Normale</span>
                      <span className="hifi-pill">Urgente</span>
                    </div>
                  </div>
                  <div>
                    <label className="hifi-label">Tecnico assegnato</label>
                    <div className="hifi-input" style={{ display:'flex', alignItems:'center', gap:8 }}>
                      <HFAvatar name="Luca M" tone="green"/> Luca M.
                    </div>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                    <div><label className="hifi-label">Tempo stimato</label><div className="hifi-input">2-3 giorni</div></div>
                    <div><label className="hifi-label">Preventivo max</label><div className="hifi-input mono">€ 150,00</div></div>
                  </div>
                </div>
              </div>

              <div className="hifi-card">
                <div className="hifi-card-title" style={{ marginBottom:10 }}>Foto</div>
                <div style={{ display:'flex', gap:8 }}>
                  <div style={{ width:80, height:80, borderRadius:6, background:'var(--hf-surface-2)', border:'1px solid var(--hf-border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--hf-text-4)', fontSize:11 }}>fronte</div>
                  <div style={{ width:80, height:80, borderRadius:6, background:'var(--hf-surface-2)', border:'1px solid var(--hf-border)', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--hf-text-4)', fontSize:11 }}>retro</div>
                  <div style={{ width:80, height:80, borderRadius:6, border:'1.5px dashed var(--hf-border-2)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'var(--hf-text-3)', fontSize:11, gap:4 }}>
                    <HFIcon name="camera"/>+ foto
                  </div>
                </div>
              </div>

              <div className="hifi-card">
                <div className="hifi-card-title" style={{ marginBottom:10 }}>Autorizzazioni</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8, fontSize:13 }}>
                  <label style={{ display:'flex', alignItems:'center', gap:8 }}><span className="hifi-check on"></span>Diagnosi gratuita</label>
                  <label style={{ display:'flex', alignItems:'center', gap:8 }}><span className="hifi-check"></span>Riparazione fino al max senza ulteriore conferma</label>
                  <label style={{ display:'flex', alignItems:'center', gap:8 }}><span className="hifi-check on"></span>SMS al cambio di stato</label>
                  <label style={{ display:'flex', alignItems:'center', gap:8 }}><span className="hifi-check"></span>Backup dati (+€30)</label>
                </div>
              </div>

              <div className="hifi-card tinted">
                <div style={{ fontSize:12, color:'var(--hf-text-3)', marginBottom:6 }}>FIRMA CLIENTE</div>
                <div style={{ height:60, border:'1.5px dashed var(--hf-border-2)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', color:'var(--hf-text-4)', fontSize:12 }}>
                  Firma sul tablet
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
);

// =================== HI-FI · INTERVENTO DETTAGLIO ===================
const HifiTicket = () => (
  <div className="hifi">
    <div className="hifi-shell">
      <HFSidebar active="tickets"/>
      <main className="hifi-main">
        <HFTopbar crumbs={['Interventi','#2410']} right={<>
          <HFBtn size="sm" icon="bell">SMS</HFBtn>
          <HFBtn size="sm">Stampa bolla</HFBtn>
          <HFBtn size="sm" tone="primary">Cambia stato</HFBtn>
        </>}/>
        <div className="hifi-content">
          <div className="hifi-page-head">
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:4 }}>
                <span className="mono" style={{ color:'var(--hf-text-3)', fontSize:13 }}>#2410</span>
                <HFBadge tone="amber">Attesa pezzi</HFBadge>
                <HFBadge tone="gray" dot={false}>2 pezzi · €163</HFBadge>
              </div>
              <div className="hifi-page-title">MacBook Air M1 · Rossi Giulia</div>
              <div className="hifi-page-sub">Aperto 13/05 · in attesa da 3gg · Tecnico Luca M. · Tel 345 11 22 333</div>
            </div>
            <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:4 }}>
              <span style={{ fontSize:12, color:'var(--hf-text-3)' }}>Importo previsto</span>
              <span style={{ fontSize:28, fontWeight:600, letterSpacing:'-0.02em' }}>€ 280,00</span>
              <span style={{ fontSize:11, color:'var(--hf-text-3)' }}>max autorizzato</span>
            </div>
          </div>

          {/* Status track */}
          <div className="hifi-card" style={{ padding:'12px 16px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:0 }}>
              {[
                ['Accettato','13/05','done'],
                ['Diagnosi','13/05','done'],
                ['Attesa pezzi','14/05','active'],
                ['In lavorazione','—','idle'],
                ['Pronto','—','idle'],
                ['Consegnato','—','idle'],
              ].map(([n,d,s],i,arr) => (
                <React.Fragment key={n}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:4, minWidth:90 }}>
                    <div style={{
                      width:24, height:24, borderRadius:'50%',
                      background: s==='done'?'var(--hf-green)':s==='active'?'var(--hf-amber)':'var(--hf-surface-2)',
                      border: '2px solid '+(s==='done'?'var(--hf-green)':s==='active'?'var(--hf-amber)':'var(--hf-border-2)'),
                      color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, fontWeight:700
                    }}>{s==='done'?'✓':s==='active'?'●':''}</div>
                    <div style={{ fontSize:12, fontWeight: s==='active'?600:400, color: s==='idle'?'var(--hf-text-4)':'var(--hf-text)' }}>{n}</div>
                    <div className="mono" style={{ fontSize:10, color:'var(--hf-text-3)' }}>{d}</div>
                  </div>
                  {i<arr.length-1 && <div style={{ flex:1, height:2, background: s==='done'?'var(--hf-green)':'var(--hf-border)', marginTop:-20 }}></div>}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:16 }}>
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Difetto + diagnosi */}
              <div className="hifi-card">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:10 }}>
                  <div className="hifi-card-title">Difetto e diagnosi</div>
                  <HFBtn size="sm" tone="ghost" icon="plus">Nota</HFBtn>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <HFAvatar name="Marco T" tone="violet"/>
                      <span style={{ fontWeight:500, fontSize:13 }}>Marco T.</span>
                      <span style={{ fontSize:11, color:'var(--hf-text-3)' }}>13/05 · 14:10 · accettazione</span>
                    </div>
                    <div style={{ marginLeft:30, fontSize:13, color:'var(--hf-text-2)' }}>
                      Cliente segnala tastiera bagnata di caffè. Non risponde la fila "asdf". Macchina si avvia, tutto il resto funziona.
                    </div>
                  </div>
                  <div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                      <HFAvatar name="Luca M" tone="green"/>
                      <span style={{ fontWeight:500, fontSize:13 }}>Luca M.</span>
                      <span style={{ fontSize:11, color:'var(--hf-text-3)' }}>13/05 · 16:05 · diagnosi</span>
                    </div>
                    <div style={{ marginLeft:30, fontSize:13, color:'var(--hf-text-2)' }}>
                      Confermato. Top-case da sostituire (la tastiera M1 non è rimovibile). Residui di liquido visibili anche su trackpad ma sembra funzionare ancora. Ordino il pezzo a RAMItalia.
                    </div>
                  </div>
                </div>
              </div>

              {/* Pezzi */}
              <div className="hifi-card" style={{ padding:0 }}>
                <div style={{ padding:'14px 16px', borderBottom:'1px solid var(--hf-border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div style={{ fontWeight:600, fontSize:14 }}>Pezzi assegnati</div>
                  <HFBtn size="sm" icon="plus">Aggiungi da magazzino</HFBtn>
                </div>
                <table className="hifi-table">
                  <thead><tr>
                    <th>SKU</th><th>Articolo</th><th>Q.</th><th>Costo</th><th>Vendita</th><th>Stato</th>
                  </tr></thead>
                  <tbody>
                    <tr>
                      <td className="mono" style={{ color:'var(--hf-text-3)' }}>KB-MBA-M1-IT</td>
                      <td className="strong">Tastiera MBA M1 IT</td>
                      <td>×1</td>
                      <td className="mono" style={{ color:'var(--hf-text-3)' }}>€ 89</td>
                      <td className="mono strong">€ 149</td>
                      <td><HFBadge tone="amber">In arrivo 18/05</HFBadge></td>
                    </tr>
                    <tr>
                      <td className="mono" style={{ color:'var(--hf-text-3)' }}>PASTA-KRY</td>
                      <td className="strong">Pasta termica Kryonaut</td>
                      <td>×1</td>
                      <td className="mono" style={{ color:'var(--hf-text-3)' }}>€ 8</td>
                      <td className="mono strong">€ 14</td>
                      <td><HFBadge tone="green">A stock</HFBadge></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Timeline */}
              <div className="hifi-card">
                <div className="hifi-card-title" style={{ marginBottom:12 }}>Attività</div>
                <div style={{ display:'flex', flexDirection:'column', gap:10, fontSize:13 }}>
                  {[
                    ['13/05 14:10','Marco T. ha accettato l\'intervento','violet'],
                    ['13/05 14:12','SMS conferma inviato a Giulia · letto','blue'],
                    ['13/05 16:05','Luca M. ha completato la diagnosi','green'],
                    ['14/05 09:00','Stato → Attesa pezzi · ordine O-0144 (RAMItalia)','amber'],
                    ['14/05 09:01','SMS attesa pezzi inviato · letto','blue'],
                    ['16/05 11:30','Conferma fornitore: consegna 18/05','gray'],
                  ].map((r,i) => (
                    <div key={i} style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                      <span className="mono" style={{ fontSize:11, color:'var(--hf-text-3)', width:80, flex:'none', paddingTop:2 }}>{r[0]}</span>
                      <span style={{ width:6, height:6, borderRadius:'50%', background:`var(--hf-${r[2]})`, marginTop:7, flex:'none' }}></span>
                      <span style={{ color:'var(--hf-text-2)' }}>{r[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right rail */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="hifi-card">
                <div className="hifi-card-title" style={{ marginBottom:10 }}>Riepilogo €</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8, fontSize:13 }}>
                  <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:'var(--hf-text-3)' }}>Max autorizzato</span><span className="mono strong">€ 280,00</span></div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:'var(--hf-text-3)' }}>Pezzi</span><span className="mono">€ 163,00</span></div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}><span style={{ color:'var(--hf-text-3)' }}>Manodopera (1,5h)</span><span className="mono">€ 60,00</span></div>
                  <div style={{ borderTop:'1px solid var(--hf-border)', paddingTop:8, marginTop:4, display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                    <span style={{ fontWeight:600 }}>Totale stimato</span>
                    <span style={{ fontWeight:600, fontSize:18, letterSpacing:'-0.01em' }}>€ 223,00</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--hf-text-3)' }}>
                    <span>Margine atteso</span><span>€ 126,00 · 56%</span>
                  </div>
                </div>
              </div>

              <div className="hifi-card">
                <div className="hifi-card-title" style={{ marginBottom:10 }}>Cliente</div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                  <HFAvatar name="Rossi Giulia" tone="blue" size="md"/>
                  <div>
                    <div style={{ fontWeight:500 }}>Rossi Giulia</div>
                    <div style={{ fontSize:11, color:'var(--hf-text-3)' }}>4 interventi · €980 spesi</div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:6 }}>
                  <HFBtn size="sm">📞 Chiama</HFBtn>
                  <HFBtn size="sm">✉ SMS</HFBtn>
                </div>
              </div>

              <div className="hifi-card">
                <div className="hifi-card-title" style={{ marginBottom:10 }}>Foto</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6 }}>
                  <div style={{ aspectRatio:'1/1', borderRadius:6, background:'var(--hf-surface-2)', border:'1px solid var(--hf-border)' }}></div>
                  <div style={{ aspectRatio:'1/1', borderRadius:6, background:'var(--hf-surface-2)', border:'1px solid var(--hf-border)' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
);

window.HifiDash = HifiDash;
window.HifiAccept = HifiAccept;
window.HifiTicket = HifiTicket;
