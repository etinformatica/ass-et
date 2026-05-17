// Hi-fi · Lista interventi (con toggle vista tabella / kanban)

const HifiTickets = () => (
  <div className="hifi">
    <div className="hifi-shell">
      <HFSidebar active="tickets"/>
      <main className="hifi-main">
        <HFTopbar crumbs={['Interventi']} right={<>
          <HFBtn size="sm" icon="filter">Filtri</HFBtn>
          <HFBtn size="sm">Esporta</HFBtn>
          <HFBtn size="sm" tone="primary" icon="plus">Nuova accettazione</HFBtn>
        </>}/>
        <div className="hifi-content">
          <div className="hifi-page-head">
            <div>
              <div className="hifi-page-title">Interventi</div>
              <div className="hifi-page-sub">142 totali · 49 attivi · 7 da chiamare per il ritiro</div>
            </div>
            <div style={{ display:'flex', gap:6, alignItems:'center' }}>
              <span style={{ fontSize:12, color:'var(--hf-text-3)', marginRight:4 }}>Vista:</span>
              <div style={{ display:'flex', background:'var(--hf-surface)', border:'1px solid var(--hf-border)', borderRadius:7, padding:2 }}>
                <span style={{ padding:'4px 10px', fontSize:12, fontWeight:500, borderRadius:5, background:'var(--hf-surface-2)', color:'var(--hf-text)' }}>Tabella</span>
                <span style={{ padding:'4px 10px', fontSize:12, color:'var(--hf-text-3)' }}>Kanban</span>
                <span style={{ padding:'4px 10px', fontSize:12, color:'var(--hf-text-3)' }}>Timeline</span>
              </div>
            </div>
          </div>

          {/* status filter bar */}
          <div style={{ display:'flex', gap:6, flexWrap:'wrap', alignItems:'center' }}>
            <span className="hifi-pill active">Tutti<span style={{marginLeft:6, fontSize:11, color:'#fff', opacity:0.7}}>49</span></span>
            <span className="hifi-pill">Accettazione <span style={{marginLeft:4, color:'var(--hf-text-3)'}}>3</span></span>
            <span className="hifi-pill">Diagnosi <span style={{marginLeft:4, color:'var(--hf-text-3)'}}>8</span></span>
            <span className="hifi-pill">Attesa pezzi <span style={{marginLeft:4, color:'var(--hf-amber)'}}>5</span></span>
            <span className="hifi-pill">Attesa cliente <span style={{marginLeft:4, color:'var(--hf-blue)'}}>4</span></span>
            <span className="hifi-pill">In lavorazione <span style={{marginLeft:4, color:'var(--hf-violet)'}}>12</span></span>
            <span className="hifi-pill">Pronti <span style={{marginLeft:4, color:'var(--hf-green)'}}>7</span></span>
            <span className="hifi-pill">Consegnati <span style={{marginLeft:4, color:'var(--hf-text-3)'}}>10</span></span>
            <span style={{ flex:1 }}></span>
            <div className="hifi-search" style={{ minWidth:240 }}>
              <HFIcon name="search"/><span>Cerca n°, cliente, seriale…</span>
            </div>
          </div>

          {/* table */}
          <div className="hifi-card" style={{ padding:0 }}>
            <table className="hifi-table">
              <thead><tr>
                <th style={{ width:30 }}><span className="hifi-check"></span></th>
                <th>N°</th>
                <th>Cliente</th>
                <th>Dispositivo</th>
                <th>Difetto</th>
                <th>Stato</th>
                <th>Tecnico</th>
                <th>Aperto</th>
                <th style={{ textAlign:'right' }}>Max €</th>
                <th></th>
              </tr></thead>
              <tbody>
                {[
                  // [n°, cliente, dispositivo, difetto, stato, tone, tecnico, avatarTone, aperto, max, atteso]
                  ['2411','Bianchi Mario','HP Pavilion 15','Non si avvia, ventola sì','Accettazione','gray','Luca M.','green','15/05','€ 150','—'],
                  ['2410','Rossi Giulia','MacBook Air M1','Tastiera bagnata','Attesa pezzi','amber','Marco T.','blue','13/05','€ 280','18/05'],
                  ['2409','Verdi srl','Dell OptiPlex 7090','Lento, sospetto virus','In lavorazione','violet','Luca M.','green','13/05','€ 100','—'],
                  ['2408','Esposito Anna','iPhone 12','Vetro rotto','Pronto','green','Sara R.','amber','12/05','€ 120','chiama!'],
                  ['2407','Conti Paolo','Lenovo IdeaPad','HDD difettoso (click)','Non riparabile','red','Luca M.','green','12/05','€ 200','—'],
                  ['2406','Studio Neri','HP LaserJet Pro','Stampa con righe','Consegnato','gray','Marco T.','blue','11/05','€ 80','—'],
                  ['2405','Romano Luigi','Asus ROG Strix','Overheat in gaming','In lavorazione','violet','Sara R.','amber','10/05','€ 150','—'],
                  ['2404','Greco Lucia','iPad 9 gen','Batteria scarica subito','Attesa cliente','blue','Sara R.','amber','10/05','€ 90','prev.OK?'],
                  ['2403','De Luca Filippo','Samsung S22','Vetro retro rotto','Diagnosi','gray','Sara R.','amber','09/05','€ 140','—'],
                  ['2402','Caputo Marco','HP Envy 13','Non carica + tasti','Attesa pezzi','amber','Luca M.','green','09/05','€ 170','18/05'],
                  ['2401','Marini Andrea','iMac 2019','Si spegne dopo 1h','Diagnosi','gray','Marco T.','blue','08/05','€ 220','—'],
                ].map(r => (
                  <tr key={r[0]}>
                    <td><span className="hifi-check"></span></td>
                    <td className="mono" style={{ color:'var(--hf-text-3)' }}>#{r[0]}</td>
                    <td className="strong">{r[1]}</td>
                    <td style={{ color:'var(--hf-text-2)' }}>{r[2]}</td>
                    <td style={{ color:'var(--hf-text-3)', fontSize:12, maxWidth:200 }}>{r[3]}</td>
                    <td><HFBadge tone={r[5]}>{r[4]}</HFBadge></td>
                    <td><div style={{ display:'flex', alignItems:'center', gap:6 }}><HFAvatar name={r[6]} tone={r[7]}/>{r[6]}</div></td>
                    <td style={{ color:'var(--hf-text-3)' }}>{r[8]}</td>
                    <td className="mono" style={{ textAlign:'right' }}>{r[9]}</td>
                    <td className="mono" style={{ color:r[10]==='chiama!'?'var(--hf-accent)':'var(--hf-text-3)', fontSize:12 }}>{r[10]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding:'10px 16px', borderTop:'1px solid var(--hf-border)', display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:12, color:'var(--hf-text-3)' }}>
              <span>11 di 49 mostrati</span>
              <div style={{ display:'flex', gap:6 }}>
                <HFBtn size="sm">‹</HFBtn>
                <HFBtn size="sm">1</HFBtn>
                <HFBtn size="sm" tone="primary">2</HFBtn>
                <HFBtn size="sm">3</HFBtn>
                <HFBtn size="sm">4</HFBtn>
                <HFBtn size="sm">5</HFBtn>
                <HFBtn size="sm">›</HFBtn>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
);

// Hi-fi · Magazzino dashboard
const HifiWarehouse = () => (
  <div className="hifi">
    <div className="hifi-shell">
      <HFSidebar active="warehouse"/>
      <main className="hifi-main">
        <HFTopbar crumbs={['Magazzino']} right={<>
          <HFBtn size="sm">Inventario fisico</HFBtn>
          <HFBtn size="sm">Nuovo articolo</HFBtn>
          <HFBtn size="sm" tone="primary" icon="plus">Ordine fornitore</HFBtn>
        </>}/>
        <div className="hifi-content">
          <div className="hifi-page-head">
            <div>
              <div className="hifi-page-title">Magazzino</div>
              <div className="hifi-page-sub">238 articoli · €8.420 a costo · €14.120 valore di vendita</div>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              <HFBtn size="sm" tone="primary">Tutti</HFBtn>
              <HFBtn size="sm">Storage</HFBtn>
              <HFBtn size="sm">Display</HFBtn>
              <HFBtn size="sm">RAM</HFBtn>
              <HFBtn size="sm">Altro</HFBtn>
            </div>
          </div>

          {/* KPI */}
          <div className="hifi-kpi-row" style={{ gridTemplateColumns:'repeat(4, 1fr)' }}>
            <div className="hifi-card hifi-kpi">
              <div className="hifi-kpi-label">Sottoscorta</div>
              <div className="hifi-kpi-value" style={{ color:'var(--hf-amber)' }}>3</div>
              <span className="hifi-kpi-trend down">↑ +1 vs ieri</span>
            </div>
            <div className="hifi-card hifi-kpi">
              <div className="hifi-kpi-label">In arrivo</div>
              <div className="hifi-kpi-value">7</div>
              <span className="hifi-kpi-trend flat">€ 2.340 · 4 fornitori</span>
            </div>
            <div className="hifi-card hifi-kpi">
              <div className="hifi-kpi-label">Movimentati (30gg)</div>
              <div className="hifi-kpi-value">142</div>
              <span className="hifi-kpi-trend up">+18% vs mese prec.</span>
            </div>
            <div className="hifi-card hifi-kpi">
              <div className="hifi-kpi-label">Margine atteso</div>
              <div className="hifi-kpi-value">€ 5.700</div>
              <span className="hifi-kpi-trend flat">40,4% medio</span>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:16 }}>
            {/* Sottoscorta alert table */}
            <div className="hifi-card" style={{ padding:0, borderColor:'var(--hf-amber)' }}>
              <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--hf-border)', display:'flex', alignItems:'center', gap:8, background:'var(--hf-amber-soft)' }}>
                <span style={{ fontSize:14 }}>⚠</span>
                <span style={{ fontWeight:600, fontSize:14 }}>Sottoscorta — azione richiesta</span>
                <HFBadge tone="amber" dot={false}>3 articoli</HFBadge>
                <div style={{ flex:1 }}></div>
                <HFBtn size="sm" tone="accent">Genera ordine fornitore →</HFBtn>
              </div>
              <table className="hifi-table">
                <thead><tr>
                  <th><span className="hifi-check on"></span></th>
                  <th>Articolo</th><th>Stock</th><th>Min</th><th>Da ord.</th><th>Fornitore</th><th>€ cad.</th><th>Per</th>
                </tr></thead>
                <tbody>
                  <tr>
                    <td><span className="hifi-check on"></span></td>
                    <td><div className="strong">SSD NVMe 1TB Crucial P3</div><div className="mono" style={{fontSize:11, color:'var(--hf-text-3)'}}>SSD-1TB-NVME</div></td>
                    <td><HFBadge tone="amber">2 / 5</HFBadge></td>
                    <td className="mono" style={{color:'var(--hf-text-3)'}}>5</td>
                    <td className="strong">3</td>
                    <td>DigitalParts <span style={{color:'var(--hf-amber)'}}>★</span></td>
                    <td className="mono">€ 62</td>
                    <td style={{ fontSize:11, color:'var(--hf-text-3)' }}>scorta + #2410</td>
                  </tr>
                  <tr>
                    <td><span className="hifi-check on"></span></td>
                    <td><div className="strong">Pasta termica Kryonaut 1g</div><div className="mono" style={{fontSize:11, color:'var(--hf-text-3)'}}>PASTA-KRY</div></td>
                    <td><HFBadge tone="amber">1 / 4</HFBadge></td>
                    <td className="mono" style={{color:'var(--hf-text-3)'}}>4</td>
                    <td className="strong">3</td>
                    <td>DigitalParts <span style={{color:'var(--hf-amber)'}}>★</span></td>
                    <td className="mono">€ 8</td>
                    <td style={{ fontSize:11, color:'var(--hf-text-3)' }}>scorta</td>
                  </tr>
                  <tr>
                    <td><span className="hifi-check on"></span></td>
                    <td><div className="strong">Tastiera MacBook Air M1 IT</div><div className="mono" style={{fontSize:11, color:'var(--hf-text-3)'}}>KB-MBA-M1-IT</div></td>
                    <td><HFBadge tone="red">0 / 2</HFBadge></td>
                    <td className="mono" style={{color:'var(--hf-text-3)'}}>2</td>
                    <td className="strong">2</td>
                    <td>RAMItalia</td>
                    <td className="mono">€ 89</td>
                    <td style={{ fontSize:11, color:'var(--hf-text-3)' }}>#2410 attesa</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="hifi-card">
                <div className="hifi-card-title" style={{ marginBottom:12 }}>Top movimentati (30gg)</div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {[
                    ['Vetro iPhone 12 nero',14,'€ 490',90],
                    ['Pasta term. Kryonaut',12,'€ 168',77],
                    ['SSD NVMe 1TB',8,'€ 952',62],
                    ['Batteria iPad 9',6,'€ 228',46],
                    ['Tastiera MBA M1',4,'€ 596',32],
                  ].map(([n,c,t,pct]) => (
                    <div key={n}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:3 }}>
                        <span style={{ fontWeight:500 }}>{n}</span>
                        <span className="mono" style={{ color:'var(--hf-text-3)' }}>×{c} · {t}</span>
                      </div>
                      <div className="hifi-bar accent"><div style={{ width:pct+'%' }}></div></div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hifi-card">
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                  <div className="hifi-card-title">Ordini in arrivo</div>
                  <HFBadge tone="amber" dot={false}>1 in ritardo</HFBadge>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                  {[
                    ['O-0142','DigitalParts','SSD 1TB ×3, RAM 16GB ×2','€ 420','red','In ritardo'],
                    ['O-0143','PhonePartsEU','vetri iPhone 13 ×4','€ 220','gray','17/05'],
                    ['O-0144','RAMItalia','tastiera MBA M1 IT','€ 95','gray','18/05'],
                  ].map(r => (
                    <div key={r[0]} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderTop: r[0]!=='O-0142'?'1px solid var(--hf-border)':'none' }}>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:2 }}>
                          <span className="mono" style={{ fontSize:11, color:'var(--hf-text-3)' }}>{r[0]}</span>
                          <HFBadge tone={r[4]}>{r[5]}</HFBadge>
                        </div>
                        <div style={{ fontSize:13, fontWeight:500 }}>{r[1]}</div>
                        <div style={{ fontSize:11, color:'var(--hf-text-3)' }}>{r[2]}</div>
                      </div>
                      <div className="mono strong">{r[3]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* lista articoli */}
          <div className="hifi-card" style={{ padding:0 }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--hf-border)', display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontWeight:600, fontSize:14 }}>Catalogo articoli</span>
              <HFBadge tone="gray" dot={false}>238</HFBadge>
              <div style={{ flex:1 }}></div>
              <div className="hifi-search" style={{ minWidth:240 }}>
                <HFIcon name="search"/><span>SKU, nome…</span>
              </div>
            </div>
            <table className="hifi-table">
              <thead><tr>
                <th>SKU</th><th>Articolo</th><th>Categoria</th><th>Stock</th><th>€ acq.</th><th>€ vend.</th><th>Margine</th><th>Fornitore</th><th>Rotazione</th>
              </tr></thead>
              <tbody>
                {[
                  ['SSD-500-NVME','SSD NVMe 500GB Crucial','Storage','7','€ 38','€ 75','49%','DigitalParts','7,2 gg'],
                  ['SSD-2TB-NVME','SSD NVMe 2TB Crucial P3','Storage','3','€ 118','€ 219','46%','DigitalParts','15 gg'],
                  ['RAM-16-DDR4','RAM 16GB DDR4 SODIMM','Memorie','9','€ 38','€ 75','49%','RAMItalia','9 gg'],
                  ['GLASS-IPH12','Vetro iPhone 12 nero','Display','12','€ 18','€ 35','49%','PhonePartsEU','3,1 gg'],
                  ['BATT-IPAD9','Batteria iPad 9 gen','Batterie','5','€ 24','€ 38','37%','PhonePartsEU','12 gg'],
                ].map(r => (
                  <tr key={r[0]}>
                    <td className="mono" style={{ color:'var(--hf-text-3)' }}>{r[0]}</td>
                    <td className="strong">{r[1]}</td>
                    <td style={{ color:'var(--hf-text-3)' }}>{r[2]}</td>
                    <td className="mono"><HFBadge tone="green" dot={false}>{r[3]}</HFBadge></td>
                    <td className="mono" style={{ color:'var(--hf-text-3)' }}>{r[4]}</td>
                    <td className="mono strong">{r[5]}</td>
                    <td><HFBadge tone="accent">{r[6]}</HFBadge></td>
                    <td style={{ color:'var(--hf-text-2)' }}>{r[7]}</td>
                    <td className="mono" style={{ color:'var(--hf-text-3)', fontSize:11 }}>{r[8]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
);

// Hi-fi · Contabilità (con tabs)
const HifiAccounting = () => (
  <div className="hifi">
    <div className="hifi-shell">
      <HFSidebar active="accounting"/>
      <main className="hifi-main">
        <HFTopbar crumbs={['Contabilità','Maggio 2026']} right={<>
          <HFBtn size="sm">‹ Aprile</HFBtn>
          <HFBtn size="sm" tone="primary">Maggio 2026 ▾</HFBtn>
          <HFBtn size="sm">Giugno ›</HFBtn>
          <HFBtn size="sm">Esporta</HFBtn>
        </>}/>
        <div className="hifi-content">
          <div className="hifi-page-head">
            <div>
              <div className="hifi-page-title">Contabilità · Maggio 2026</div>
              <div className="hifi-page-sub">Margine lordo €10.990 · +18% vs aprile · 142 interventi chiusi</div>
            </div>
          </div>

          {/* tabs */}
          <div className="hifi-tabs">
            <div className="hifi-tab">Per intervento</div>
            <div className="hifi-tab active">Vista mese · P&L</div>
            <div className="hifi-tab">Fornitori & acquisti</div>
            <div className="hifi-tab">Fatture &amp; corrispettivi</div>
          </div>

          {/* KPI */}
          <div className="hifi-kpi-row" style={{ gridTemplateColumns:'repeat(6, 1fr)' }}>
            {[
              ['Ricavi','€ 18.420','+12%','up'],
              ['Costi pezzi','€ 6.180','+4%','flat'],
              ['Manodopera','€ 1.250','=','flat'],
              ['Margine lordo','€ 10.990','+18%','up'],
              ['Margine %','59,7%','+3pt','up'],
              ['Interventi','142','+9','up'],
            ].map(([l,v,d,t]) => (
              <div key={l} className="hifi-card hifi-kpi">
                <div className="hifi-kpi-label">{l}</div>
                <div className="hifi-kpi-value" style={{ fontSize:22 }}>{v}</div>
                <span className={`hifi-kpi-trend ${t}`}>{t==='up'?'↑':t==='down'?'↓':'•'} {d}</span>
              </div>
            ))}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1.6fr 1fr', gap:16 }}>
            {/* P&L T-account */}
            <div className="hifi-card">
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
                <span style={{ fontWeight:600, fontSize:14 }}>Conto economico semplificato</span>
                <span style={{ fontSize:11, color:'var(--hf-text-3)' }}>aggiornato in tempo reale dalle assistenze chiuse</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0 }}>
                <div style={{ paddingRight:16, borderRight:'1px solid var(--hf-border)' }}>
                  <div style={{ fontSize:11, color:'var(--hf-text-3)', textTransform:'uppercase', letterSpacing:0.04, marginBottom:8, fontWeight:500 }}>+ Entrate</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8, fontSize:13 }}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}><span>Riparazioni</span><span className="mono">€ 15.420</span></div>
                    <div style={{ display:'flex', justifyContent:'space-between' }}><span>Vendita banco</span><span className="mono">€ 2.450</span></div>
                    <div style={{ display:'flex', justifyContent:'space-between' }}><span>Diagnosi a pagamento</span><span className="mono">€ 350</span></div>
                    <div style={{ display:'flex', justifyContent:'space-between' }}><span>Recupero dati</span><span className="mono">€ 200</span></div>
                    <div style={{ borderTop:'1px solid var(--hf-border)', paddingTop:8, marginTop:4, display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontWeight:600 }}>Totale</span>
                      <span style={{ fontWeight:600, fontSize:18 }}>€ 18.420</span>
                    </div>
                  </div>
                </div>
                <div style={{ paddingLeft:16 }}>
                  <div style={{ fontSize:11, color:'var(--hf-text-3)', textTransform:'uppercase', letterSpacing:0.04, marginBottom:8, fontWeight:500 }}>− Uscite</div>
                  <div style={{ display:'flex', flexDirection:'column', gap:8, fontSize:13 }}>
                    <div style={{ display:'flex', justifyContent:'space-between' }}><span>Pezzi (scaricati)</span><span className="mono">€ 6.180</span></div>
                    <div style={{ display:'flex', justifyContent:'space-between' }}><span>Acquisti fornitori <span style={{fontSize:10, color:'var(--hf-text-3)'}}>(→stock)</span></span><span className="mono" style={{color:'var(--hf-text-3)'}}>€ 4.820</span></div>
                    <div style={{ display:'flex', justifyContent:'space-between' }}><span>Manodopera tecnici</span><span className="mono">€ 1.250</span></div>
                    <div style={{ display:'flex', justifyContent:'space-between' }}><span>Spedizioni</span><span className="mono">€ 180</span></div>
                    <div style={{ borderTop:'1px solid var(--hf-border)', paddingTop:8, marginTop:4, display:'flex', justifyContent:'space-between' }}>
                      <span style={{ fontWeight:600 }}>Totale costi periodo</span>
                      <span style={{ fontWeight:600, fontSize:18 }}>€ 7.430</span>
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ marginTop:18, padding:'14px 16px', background:'var(--hf-accent-soft)', borderRadius:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontWeight:600, fontSize:15 }}>Margine lordo</span>
                <span style={{ fontWeight:600, fontSize:30, letterSpacing:'-0.02em', color:'var(--hf-accent)' }}>€ 10.990</span>
              </div>
            </div>

            {/* right side: trend + categories */}
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              <div className="hifi-card">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
                  <span style={{ fontWeight:600, fontSize:14 }}>Andamento 12 mesi</span>
                  <div style={{ display:'flex', gap:8, fontSize:11 }}>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8, height:8, background:'var(--hf-text)' }}></span>Ricavi</span>
                    <span style={{ display:'flex', alignItems:'center', gap:4 }}><span style={{ width:8, height:8, background:'var(--hf-accent)' }}></span>Margine</span>
                  </div>
                </div>
                <div style={{ position:'relative', height:120 }}>
                  <svg viewBox="0 0 300 120" style={{ width:'100%', height:'100%' }}>
                    <defs>
                      <linearGradient id="hf-fade" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#d97757" stopOpacity="0.25"/>
                        <stop offset="100%" stopColor="#d97757" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    <path d="M 5 85 L 30 80 L 55 78 L 80 70 L 105 60 L 130 56 L 155 50 L 180 48 L 205 42 L 230 38 L 255 30 L 280 22"
                      fill="none" stroke="#1a1816" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M 5 100 L 30 95 L 55 92 L 80 85 L 105 78 L 130 75 L 155 68 L 180 65 L 205 58 L 230 55 L 255 48 L 280 40"
                      fill="none" stroke="#d97757" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M 5 100 L 30 95 L 55 92 L 80 85 L 105 78 L 130 75 L 155 68 L 180 65 L 205 58 L 230 55 L 255 48 L 280 40 L 280 120 L 5 120 Z"
                      fill="url(#hf-fade)"/>
                    <circle cx="280" cy="22" r="3" fill="#1a1816"/>
                    <circle cx="280" cy="40" r="3" fill="#d97757"/>
                  </svg>
                </div>
                <div style={{ display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--hf-text-3)', marginTop:4 }} className="mono">
                  <span>giu '25</span><span>mag '26</span>
                </div>
              </div>

              <div className="hifi-card">
                <div style={{ fontWeight:600, fontSize:14, marginBottom:12 }}>Top categorie · maggio</div>
                <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                  {[
                    ['Sostituzione SSD/HDD',38,'€ 4.320',95],
                    ['Vetri smartphone',22,'€ 2.860',62],
                    ['Rimozione virus',24,'€ 1.680',37],
                    ['Pulizia + pasta term.',18,'€ 1.080',24],
                    ['Recupero dati',12,'€ 2.940',64],
                  ].map(([n,c,t,pct]) => (
                    <div key={n}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:12, marginBottom:3 }}>
                        <span style={{ fontWeight:500 }}>{n}</span>
                        <span className="mono" style={{ color:'var(--hf-text-3)' }}>{c}× · {t}</span>
                      </div>
                      <div className="hifi-bar accent"><div style={{ width:pct+'%' }}></div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* fatture aperte */}
          <div className="hifi-card" style={{ padding:0 }}>
            <div style={{ padding:'12px 16px', borderBottom:'1px solid var(--hf-border)', display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ fontWeight:600, fontSize:14 }}>Da emettere / da incassare</span>
              <HFBadge tone="amber" dot={false}>5 fatture · €820</HFBadge>
            </div>
            <table className="hifi-table">
              <thead><tr><th>Doc.</th><th>Tipo</th><th>Cliente</th><th>Riferimento</th><th>Importo</th><th>Scadenza</th><th>Stato</th></tr></thead>
              <tbody>
                <tr><td className="mono" style={{color:'var(--hf-text-3)'}}>F-0142</td><td>Fatt. elettronica</td><td className="strong">Verdi srl</td><td className="mono" style={{fontSize:11}}>#2409</td><td className="mono strong">€ 320,00</td><td>30gg DF</td><td><HFBadge tone="amber">In scadenza</HFBadge></td></tr>
                <tr><td className="mono" style={{color:'var(--hf-text-3)'}}>F-0141</td><td>Fatt. privato</td><td className="strong">Marini A.</td><td className="mono" style={{fontSize:11}}>#2401</td><td className="mono strong">€ 220,00</td><td>15 gg</td><td><HFBadge tone="green">In termini</HFBadge></td></tr>
                <tr><td className="mono" style={{color:'var(--hf-text-3)'}}>F-0138</td><td>Fatt. elettronica</td><td className="strong">Studio Neri</td><td className="mono" style={{fontSize:11}}>#2406</td><td className="mono strong">€ 60,00</td><td>30gg DF</td><td><HFBadge tone="green">In termini</HFBadge></td></tr>
                <tr><td className="mono" style={{color:'var(--hf-text-3)'}}>F-0133</td><td>Fatt. elettronica</td><td className="strong">Tech Hub spa</td><td className="mono" style={{fontSize:11}}>#2378</td><td className="mono strong">€ 480,00</td><td>scaduta 4gg</td><td><HFBadge tone="red">Da sollecitare</HFBadge></td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
);

// Hi-fi · Mobile (tecnico in laboratorio)
const HifiMobile = () => {
  const Phone = ({ children }) => (
    <div style={{
      width:340, height:720,
      background:'#0a0908', borderRadius:42, padding:11,
      boxShadow:'0 12px 40px rgba(0,0,0,0.25)'
    }}>
      <div style={{ width:'100%', height:'100%', background:'var(--hf-bg)', borderRadius:32, overflow:'hidden', position:'relative', fontFamily:'Geist, system-ui, sans-serif' }}>
        <div style={{ position:'absolute', top:8, left:'50%', transform:'translateX(-50%)', width:90, height:22, background:'#0a0908', borderRadius:'0 0 14px 14px', zIndex:5 }}></div>
        <div style={{ display:'flex', justifyContent:'space-between', padding:'12px 22px 6px', fontFamily:'Geist Mono, monospace', fontSize:11, color:'var(--hf-text)' }}>
          <span>9:42</span><span>5G · 87%</span>
        </div>
        {children}
      </div>
    </div>
  );

  return (
    <div className="hifi" style={{ background:'var(--hf-surface-2)', padding:30, display:'flex', justifyContent:'center', alignItems:'center', gap:24 }}>
      {/* Lista */}
      <Phone>
        <div style={{ padding:'8px 16px 16px', display:'flex', flexDirection:'column', gap:12, height:'calc(100% - 30px)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <div>
              <div style={{ fontSize:11, color:'var(--hf-text-3)', textTransform:'uppercase', letterSpacing:0.04, fontWeight:500 }}>Ciao Luca</div>
              <div style={{ fontSize:20, fontWeight:600, letterSpacing:'-0.01em', lineHeight:1.1 }}>I miei interventi</div>
            </div>
            <HFAvatar name="Luca M" tone="green" size="md"/>
          </div>

          <div style={{ display:'flex', gap:6, overflowX:'auto', marginLeft:-2, marginRight:-2, padding:'0 2px' }}>
            <span className="hifi-pill active">Tutti 5</span>
            <span className="hifi-pill">Lab 2</span>
            <span className="hifi-pill">Attesa 2</span>
            <span className="hifi-pill">Pronti 1</span>
          </div>

          <div style={{ flex:1, display:'flex', flexDirection:'column', gap:8, overflowY:'auto' }}>
            {[
              ['#2411','Bianchi M.','HP Pavilion 15','non si avvia','Accettazione','gray','oggi'],
              ['#2410','Rossi G.','MacBook Air M1','tastiera bagnata','Attesa pezzi','amber','3gg'],
              ['#2409','Verdi srl','Dell OptiPlex','virus, lento','In lavorazione','violet','3gg'],
              ['#2405','Romano L.','Asus ROG','overheat gaming','In lavorazione','violet','6gg'],
              ['#2408','Esposito A.','iPhone 12','vetro','Pronto','green','4gg'],
            ].map(r => (
              <div key={r[0]} className="hifi-card compact" style={{ padding:'10px 12px' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                  <span className="mono" style={{ fontSize:11, color:'var(--hf-text-3)' }}>{r[0]} · {r[6]}</span>
                  <HFBadge tone={r[5]}>{r[4]}</HFBadge>
                </div>
                <div style={{ fontWeight:500, fontSize:14 }}>{r[1]}</div>
                <div style={{ fontSize:12, color:'var(--hf-text-2)' }}>{r[2]}</div>
                <div style={{ fontSize:11, color:'var(--hf-text-3)', fontStyle:'italic', marginTop:2 }}>"{r[3]}"</div>
              </div>
            ))}
          </div>

          <div style={{ display:'flex', justifyContent:'space-around', borderTop:'1px solid var(--hf-border)', padding:'10px 0 0', margin:'4px -16px -16px' }}>
            {[['home','Home'],['list','Lavori'],['box','Magaz.'],['camera','Scan']].map(([i,l],k) => (
              <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2 }}>
                <HFIcon name={i} style={{ color: k===1?'var(--hf-text)':'var(--hf-text-3)' }}/>
                <span style={{ fontSize:10, color: k===1?'var(--hf-text)':'var(--hf-text-3)', fontWeight: k===1?600:400 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </Phone>

      {/* Dettaglio */}
      <Phone>
        <div style={{ padding:'8px 16px 16px', display:'flex', flexDirection:'column', gap:12, height:'calc(100% - 30px)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:18, color:'var(--hf-text-2)' }}>‹</span>
            <div style={{ flex:1 }}>
              <div className="mono" style={{ fontSize:11, color:'var(--hf-text-3)' }}>INTERVENTO</div>
              <div style={{ fontSize:18, fontWeight:600 }}>#2410 · Rossi G.</div>
            </div>
            <HFBadge tone="amber">Attesa pezzi</HFBadge>
          </div>

          <div className="hifi-card compact">
            <div style={{ fontSize:11, color:'var(--hf-text-3)', textTransform:'uppercase' }}>DISPOSITIVO</div>
            <div style={{ fontWeight:500, fontSize:14, marginTop:2 }}>MacBook Air M1 · 2021</div>
            <div className="mono" style={{ fontSize:11, color:'var(--hf-text-3)' }}>C02G3QH4Q6L4</div>
          </div>

          <div className="hifi-card compact" style={{ background:'var(--hf-amber-soft)', borderColor:'var(--hf-amber)' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontWeight:500, fontSize:13 }}>Tastiera MBA M1 IT</span>
              <span className="mono strong" style={{ fontSize:13 }}>€ 89</span>
            </div>
            <div style={{ fontSize:11, color:'var(--hf-text-3)' }}>ordinata 14/05 · DigitalParts · atteso 18/05</div>
          </div>

          <div className="hifi-card compact">
            <div style={{ fontSize:12, fontWeight:600, marginBottom:6 }}>Cambia stato</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
              <span className="hifi-pill">Diagnosi</span>
              <span className="hifi-pill active">Attesa pezzi</span>
              <span className="hifi-pill">In lavoraz.</span>
              <span className="hifi-pill">Pronto</span>
            </div>
          </div>

          <div className="hifi-card compact">
            <div style={{ fontSize:12, fontWeight:600, marginBottom:6 }}>+ Nota del tecnico</div>
            <div style={{ height:50, border:'1.5px dashed var(--hf-border-2)', borderRadius:6, display:'flex', alignItems:'center', justifyContent:'center', fontSize:11, color:'var(--hf-text-3)' }}>
              Tocca per scrivere o 🎙 dettare
            </div>
            <div style={{ display:'flex', gap:6, marginTop:8 }}>
              <HFBtn size="sm" icon="camera">Foto</HFBtn>
              <HFBtn size="sm" icon="plus">Pezzo</HFBtn>
            </div>
          </div>

          <div style={{ flex:1 }}></div>
          <div style={{ display:'flex', gap:6 }}>
            <HFBtn style={{ flex:1, justifyContent:'center' }}>📞 Cliente</HFBtn>
            <HFBtn tone="primary" style={{ flex:1, justifyContent:'center' }}>✉ SMS aggiorna</HFBtn>
          </div>
        </div>
      </Phone>

      {/* Scanner */}
      <Phone>
        <div style={{ padding:'8px 16px 16px', display:'flex', flexDirection:'column', gap:12, height:'calc(100% - 30px)' }}>
          <div>
            <div className="mono" style={{ fontSize:11, color:'var(--hf-text-3)', textTransform:'uppercase', letterSpacing:0.04 }}>Scansiona</div>
            <div style={{ fontSize:20, fontWeight:600, letterSpacing:'-0.01em' }}>Trova intervento</div>
          </div>

          <div style={{
            flex:1, background:'#1a1816', borderRadius:14, position:'relative', overflow:'hidden',
            display:'flex', alignItems:'center', justifyContent:'center'
          }}>
            <div style={{
              position:'absolute', inset:'18% 14%',
              border:'2.5px solid var(--hf-accent)', borderRadius:10
            }}>
              <span style={{ position:'absolute', top:-12, left:-12, width:18, height:18, borderTop:'3px solid var(--hf-accent)', borderLeft:'3px solid var(--hf-accent)' }}></span>
              <span style={{ position:'absolute', top:-12, right:-12, width:18, height:18, borderTop:'3px solid var(--hf-accent)', borderRight:'3px solid var(--hf-accent)' }}></span>
              <span style={{ position:'absolute', bottom:-12, left:-12, width:18, height:18, borderBottom:'3px solid var(--hf-accent)', borderLeft:'3px solid var(--hf-accent)' }}></span>
              <span style={{ position:'absolute', bottom:-12, right:-12, width:18, height:18, borderBottom:'3px solid var(--hf-accent)', borderRight:'3px solid var(--hf-accent)' }}></span>
            </div>
            <div style={{
              position:'absolute', left:'14%', right:'14%', top:'50%',
              height:2, background:'var(--hf-accent)', boxShadow:'0 0 16px var(--hf-accent)'
            }}></div>
            <div style={{ position:'absolute', bottom:18, left:0, right:0, textAlign:'center', color:'#fff', fontSize:13 }}>
              Inquadra il QR della bolla
            </div>
          </div>

          <div style={{ display:'flex', gap:6 }}>
            <span className="hifi-pill active">QR / barcode</span>
            <span className="hifi-pill">NFC tag</span>
            <span className="hifi-pill">Seriale</span>
          </div>

          <div className="hifi-card compact">
            <div style={{ fontSize:11, color:'var(--hf-text-3)', textTransform:'uppercase', letterSpacing:0.04, marginBottom:6 }}>RECENTI</div>
            <div style={{ display:'flex', flexDirection:'column', gap:6, fontSize:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span><b>#2410</b> Rossi G.</span><span className="mono" style={{ color:'var(--hf-text-3)' }}>2 min</span></div>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span><b>#2409</b> Verdi srl</span><span className="mono" style={{ color:'var(--hf-text-3)' }}>15 min</span></div>
              <div style={{ display:'flex', justifyContent:'space-between' }}><span><b>#2405</b> Romano L.</span><span className="mono" style={{ color:'var(--hf-text-3)' }}>1h</span></div>
            </div>
          </div>
        </div>
      </Phone>
    </div>
  );
};

window.HifiTickets = HifiTickets;
window.HifiWarehouse = HifiWarehouse;
window.HifiAccounting = HifiAccounting;
window.HifiMobile = HifiMobile;
