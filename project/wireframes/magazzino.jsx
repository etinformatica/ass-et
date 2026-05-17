// Magazzino — 5 schermate

// 1) Dashboard magazzino — alert, sottoscorta, top movimentati
const WhDash = () => (
  <div className="sheet" style={{ display:'flex' }}>
    <Sidebar active="warehouse" />
    <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
      <TopBar
        title="Magazzino"
        sub="238 articoli a stock · €8.420 a costo · 3 sottoscorta"
        breadcrumbs="HOME / MAGAZZINO"
        right={<>
          <Search placeholder="cerca articolo / SKU…" w={260} />
          <Btn size="sm">📦 inventario</Btn>
          <Btn size="sm" tone="primary">+ nuovo articolo</Btn>
        </>}
      />
      <div style={{ padding:'14px 22px', display:'flex', flexDirection:'column', gap:14, flex:1, minHeight:0 }}>
        {/* KPI strip */}
        <div className="row gap-3">
          {[
            ['Articoli a stock','238','+12 mese',''],
            ['Valore a costo','€ 8.420','+€640','dark'],
            ['Valore a vendita','€ 14.120','margine 40%','hi'],
            ['Sottoscorta','3','urgente','warn'],
            ['In arrivo','7 ordini','€ 2.340','note'],
            ['Movimentati mese','142 mov.','78 scarico','ok'],
          ].map(([k,v,d,t]) => (
            <Box key={k} className="grow" shadow style={{ padding:'8px 12px' }}>
              <div className="mono tiny muted" style={{ textTransform:'uppercase' }}>{k}</div>
              <div className="hand xl">{v}</div>
              <div className="row between"><span className="xs muted">{d}</span><Pill tone={t}>•</Pill></div>
            </Box>
          ))}
        </div>

        <div className="row gap-3" style={{ flex:1, minHeight:0 }}>
          {/* SOTTOSCORTA */}
          <Box className="grow" style={{ display:'flex', flexDirection:'column' }}>
            <div className="row between"><div className="hand lg">⚠ Sottoscorta — azione richiesta</div><Btn size="sm" tone="hi">genera ordine →</Btn></div>
            <HR />
            <table className="tbl">
              <thead><tr><th>SKU</th><th>Articolo</th><th>Stock</th><th>Min</th><th>Da ord.</th><th>Fornitore preferito</th><th>€ cad.</th><th></th></tr></thead>
              <tbody>
                {[
                  ['SSD-1TB-NVME','SSD NVMe 1TB Crucial P3','2','5','3','DigitalParts','€ 62','warn'],
                  ['PASTA-KRY','Pasta term. Kryonaut 1g','1','4','3','DigitalParts','€ 8','warn'],
                  ['KB-MBA-M1-IT','Tastiera MacBook Air M1 IT','0','2','2','RAMItalia','€ 89','warn'],
                  ['GLASS-IPH13','Vetro iPhone 13 nero','1','3','2','PhonePartsEU','€ 28',''],
                  ['RAM-16-DDR5','RAM 16GB DDR5 SODIMM','4','6','2','RAMItalia','€ 48',''],
                ].map(r => (
                  <tr key={r[0]}>
                    <td className="mono xs">{r[0]}</td>
                    <td className="hand md">{r[1]}</td>
                    <td><Pill tone={r[7]}>{r[2]}</Pill></td>
                    <td className="mono xs muted">{r[3]}</td>
                    <td className="hand md">{r[4]}</td>
                    <td className="xs">{r[5]}</td>
                    <td className="mono xs">{r[6]}</td>
                    <td><Chk on /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>

          {/* movimentati */}
          <Box style={{ width:320 }}>
            <div className="hand lg">Top movimentati (30gg)</div>
            <HR />
            <div className="col gap-2" style={{ marginTop:6 }}>
              {[
                ['Vetro iPhone 12',14,'€ 35','€ 490'],
                ['Pasta term. Kryonaut',12,'€ 14','€ 168'],
                ['SSD NVMe 1TB',8,'€ 119','€ 952'],
                ['Batteria iPad 9',6,'€ 38','€ 228'],
                ['Tastiera MBA M1',4,'€ 149','€ 596'],
              ].map(([n,c,p,t],i) => (
                <div key={n}>
                  <div className="row between"><span className="hand md">{n}</span><span className="mono xs">×{c}</span></div>
                  <div style={{ height:6, background:'#fff', border:'1.2px solid var(--rule)', borderRadius:3, marginTop:2 }}>
                    <div className="bar hi" style={{ width:`${100-i*15}%`, height:'100%' }}></div>
                  </div>
                  <div className="row between"><span className="mono tiny muted">venduto {t}</span><span className="mono tiny muted">{p}/pz</span></div>
                </div>
              ))}
            </div>
          </Box>
        </div>

        <div className="row gap-3">
          <Box className="grow">
            <div className="hand lg">In arrivo — ordini aperti</div>
            <HR />
            <table className="tbl">
              <thead><tr><th>Ord.</th><th>Fornitore</th><th>Articoli</th><th>€</th><th>Atteso</th></tr></thead>
              <tbody>
                <tr><td className="mono xs">O-0142</td><td className="hand md">DigitalParts</td><td>SSD 1TB ×3 · RAM 16GB ×2</td><td className="hand md">€ 420</td><td><Pill tone="warn">in ritardo</Pill></td></tr>
                <tr><td className="mono xs">O-0143</td><td className="hand md">PhonePartsEU</td><td>vetri iPhone 13 ×4</td><td className="hand md">€ 220</td><td><Pill>17/05</Pill></td></tr>
                <tr><td className="mono xs">O-0144</td><td className="hand md">RAMItalia</td><td>tastiera MBA M1 IT ×2</td><td className="hand md">€ 178</td><td><Pill>18/05</Pill></td></tr>
              </tbody>
            </table>
          </Box>
          <Box className="fill-2" style={{ width:280 }}>
            <div className="hand lg">Movimenti recenti</div>
            <HR />
            <div className="col gap-2" style={{ marginTop:4, fontSize:13 }}>
              <div><span className="mono tiny muted">oggi 09:41 ·</span> <Pill tone="warn">scarico</Pill> vetro iPh12 → #2376</div>
              <div><span className="mono tiny muted">oggi 08:30 ·</span> <Pill tone="ok">carico</Pill> +5 RAM 16GB DDR4</div>
              <div><span className="mono tiny muted">ier. 17:20 ·</span> <Pill tone="warn">scarico</Pill> SSD 1TB → #2410</div>
              <div><span className="mono tiny muted">ier. 16:00 ·</span> <Pill tone="ok">carico</Pill> +3 batterie iPad</div>
              <div><span className="mono tiny muted">ier. 14:11 ·</span> <Pill tone="warn">scarico</Pill> pasta term. → #2398</div>
              <div className="row between" style={{ marginTop:6 }}><Btn size="sm" tone="ghost">tutti i movimenti →</Btn></div>
            </div>
          </Box>
        </div>
      </div>
    </div>
  </div>
);

// 2) Lista articoli — tabella con filtri laterali
const WhList = () => (
  <div className="sheet" style={{ display:'flex' }}>
    <Sidebar active="warehouse" />
    <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
      <TopBar
        title="Articoli a stock"
        sub="238 articoli · 47 categorie · vista: tutti"
        breadcrumbs="HOME / MAGAZZINO / ARTICOLI"
        right={<>
          <Search placeholder="cerca SKU, nome, fornitore…" w={280} />
          <Btn size="sm">📥 export</Btn>
          <Btn size="sm" tone="primary">+ articolo</Btn>
        </>}
      />
      <div style={{ flex:1, display:'flex', minHeight:0 }}>
        <div style={{ width:220, borderRight:'1.6px solid var(--rule)', padding:14, display:'flex', flexDirection:'column', gap:12 }}>
          <div>
            <div className="hand md">Categoria</div>
            <div className="col gap-2" style={{ marginTop:4 }}>
              {[
                ['Tutti',238,true],
                ['Storage (SSD/HDD)',42],
                ['Memorie RAM',38],
                ['Display / vetri',54],
                ['Batterie',28],
                ['Tastiere',22],
                ['Alimentatori',18],
                ['Cavi / connettori',24],
                ['Consumabili',12],
              ].map(([n,c,a]) => (
                <div key={n} className="row between" style={{
                  fontSize:14, padding:'2px 6px', borderRadius:4,
                  background:a?'var(--hi)':'transparent', fontWeight:a?700:400
                }}>
                  <span>{n}</span><span className="mono xs muted">{c}</span>
                </div>
              ))}
            </div>
          </div>
          <HR />
          <div>
            <div className="hand md">Fornitore</div>
            <div className="col gap-2" style={{ marginTop:4 }}>
              <Chk on>Tutti</Chk>
              <Chk>DigitalParts srl</Chk>
              <Chk>RAMItalia</Chk>
              <Chk>PhonePartsEU</Chk>
              <Chk>LocalStock IT</Chk>
            </div>
          </div>
          <HR />
          <div>
            <div className="hand md">Stato scorte</div>
            <div className="col gap-2" style={{ marginTop:4 }}>
              <Rad on>tutti</Rad>
              <Rad>solo disponibili</Rad>
              <Rad>sottoscorta</Rad>
              <Rad>esauriti</Rad>
            </div>
          </div>
        </div>

        <div style={{ flex:1, padding:14, minWidth:0 }}>
          <div className="row gap-2" style={{ marginBottom:8 }}>
            <Pill tone="dark">238 risultati</Pill>
            <Pill>ordina: nome ↑</Pill>
            <span style={{flex:1}}></span>
            <span className="mono xs muted">pag. 1 / 8</span>
          </div>
          <Box style={{ padding:0 }}>
            <table className="tbl">
              <thead><tr>
                <th style={{ width:28 }}><Chk /></th>
                <th>SKU</th><th>Articolo</th><th>Categoria</th><th>Stock</th><th>Min</th>
                <th>€ acq.</th><th>€ vend.</th><th>%</th><th>Fornitore</th><th></th>
              </tr></thead>
              <tbody>
                {[
                  ['BATT-IPAD9','Batteria iPad 9 gen','Batterie','5','3','€ 24','€ 38','37%','PhonePartsEU',''],
                  ['CABLE-USBC1M','Cavo USB-C 1m PD','Cavi','24','10','€ 3,50','€ 12','71%','LocalStock',''],
                  ['DISP-IPH13','Display iPhone 13 OLED','Display','3','3','€ 88','€ 180','51%','PhonePartsEU','warn'],
                  ['GLASS-IPH12','Vetro iPhone 12 nero','Display','12','5','€ 18','€ 35','49%','PhonePartsEU',''],
                  ['GLASS-IPH13','Vetro iPhone 13 nero','Display','1','3','€ 22','€ 45','51%','PhonePartsEU','warn'],
                  ['KB-MBA-M1-IT','Tastiera MBA M1 IT','Tastiere','0','2','€ 89','€ 149','40%','RAMItalia','warn'],
                  ['PASTA-KRY','Pasta term. Kryonaut 1g','Consumab.','1','4','€ 8','€ 14','43%','DigitalParts','warn'],
                  ['PSU-65W-USBC','Alim. 65W USB-C universale','Alim.','8','5','€ 18','€ 39','54%','LocalStock',''],
                  ['RAM-16-DDR4','RAM 16GB DDR4 SODIMM','RAM','9','6','€ 38','€ 75','49%','RAMItalia',''],
                  ['RAM-16-DDR5','RAM 16GB DDR5 SODIMM','RAM','4','6','€ 48','€ 95','49%','RAMItalia','warn'],
                  ['SSD-1TB-NVME','SSD NVMe 1TB Crucial P3','Storage','2','5','€ 62','€ 119','48%','DigitalParts','warn'],
                  ['SSD-500-NVME','SSD NVMe 500GB Crucial','Storage','7','4','€ 38','€ 75','49%','DigitalParts',''],
                  ['SSD-2TB-NVME','SSD NVMe 2TB Crucial P3','Storage','3','2','€ 118','€ 219','46%','DigitalParts',''],
                ].map(r => (
                  <tr key={r[0]}>
                    <td><Chk /></td>
                    <td className="mono xs">{r[0]}</td>
                    <td className="hand md">{r[1]}</td>
                    <td className="xs muted">{r[2]}</td>
                    <td><Pill tone={r[9]}>{r[3]}</Pill></td>
                    <td className="mono xs muted">{r[4]}</td>
                    <td className="mono xs">{r[5]}</td>
                    <td className="hand md">{r[6]}</td>
                    <td><Pill tone="hi">{r[7]}</Pill></td>
                    <td className="xs">{r[8]}</td>
                    <td className="mono xs muted">⋯</td>
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

// 3) Dettaglio articolo
const WhDetail = () => (
  <div className="sheet" style={{ display:'flex' }}>
    <Sidebar active="warehouse" />
    <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
      <div style={{ padding:'14px 22px', borderBottom:'1.6px solid var(--rule)' }}>
        <div className="mono xs muted">MAGAZZINO / ARTICOLI / SSD-1TB-NVME</div>
        <div className="row between" style={{ alignItems:'flex-start', marginTop:4 }}>
          <div className="row gap-3" style={{ alignItems:'center' }}>
            <Placeholder style={{ width:80, height:80 }}>foto<br/>articolo</Placeholder>
            <div>
              <div className="title">SSD NVMe 1TB Crucial P3</div>
              <div className="subtitle">SKU: SSD-1TB-NVME · Categoria: Storage · Aggiunto 12/01/2024</div>
              <div className="row gap-2" style={{ marginTop:4 }}>
                <Pill tone="warn">sottoscorta 2/5</Pill>
                <Pill>fornitore: DigitalParts</Pill>
                <Pill tone="hi">venduto 8× / 30gg</Pill>
              </div>
            </div>
          </div>
          <div className="row gap-2">
            <Btn size="sm">✏ modifica</Btn>
            <Btn size="sm">📤 scarica</Btn>
            <Btn size="sm" tone="hi">📥 carica</Btn>
            <Btn size="sm" tone="primary">+ ordine fornitore</Btn>
          </div>
        </div>
      </div>

      <div style={{ flex:1, display:'flex', gap:14, padding:18, minHeight:0 }}>
        <div className="col gap-3 grow" style={{ minWidth:0 }}>
          <div className="row gap-3">
            <Box className="grow">
              <div className="hand lg">Prezzi & margine</div>
              <HR />
              <table className="tbl">
                <tbody>
                  <tr><td className="muted">Costo medio acquisto</td><td className="hand md">€ 62,00</td><td className="mono tiny muted">ultimo: € 60</td></tr>
                  <tr><td className="muted">Prezzo di vendita</td><td className="hand md">€ 119,00</td><td className="mono tiny muted">iva incl. → € 145,18</td></tr>
                  <tr><td className="muted">Margine cad.</td><td className="hand md"><span className="hi-mark">€ 57</span></td><td className="mono tiny muted">48% lordo</td></tr>
                  <tr><td className="muted">Margine totale (mese)</td><td className="hand md">€ 456</td><td className="mono tiny muted">8 venduti</td></tr>
                </tbody>
              </table>
            </Box>
            <Box className="grow">
              <div className="hand lg">Scorte</div>
              <HR />
              <table className="tbl">
                <tbody>
                  <tr><td className="muted">Disponibili ora</td><td className="hand xl"><span style={{color:'var(--warn)'}}>2</span></td></tr>
                  <tr><td className="muted">Soglia minima</td><td className="hand md">5</td></tr>
                  <tr><td className="muted">In ordine (in arrivo)</td><td className="hand md">3 <span className="mono tiny muted">→ O-0142</span></td></tr>
                  <tr><td className="muted">Riservati su interventi</td><td className="hand md">1 <span className="mono tiny muted">→ #2410</span></td></tr>
                  <tr><td className="muted">Venduti 30gg</td><td className="hand md">8</td></tr>
                  <tr><td className="muted">Rotazione</td><td className="hand md">3,8gg</td></tr>
                </tbody>
              </table>
            </Box>
          </div>

          <Box>
            <div className="row between">
              <div className="hand lg">Storico movimenti</div>
              <div className="row gap-2"><Pill tone="dark">tutti</Pill><Pill tone="ok">carico</Pill><Pill tone="warn">scarico</Pill></div>
            </div>
            <HR />
            <table className="tbl">
              <thead><tr><th>Data</th><th>Tipo</th><th>Q.</th><th>Riferimento</th><th>€ unit.</th><th>Operatore</th><th>Note</th></tr></thead>
              <tbody>
                <tr><td className="mono xs">14/05 17:20</td><td><Pill tone="warn">scarico</Pill></td><td>-1</td><td className="mono xs">→ intervento #2410</td><td>€ 62</td><td>Luca</td><td className="xs muted">MBA tastiera (riservato)</td></tr>
                <tr><td className="mono xs">12/05 09:00</td><td><Pill tone="warn">scarico</Pill></td><td>-1</td><td className="mono xs">→ vendita banco #V-118</td><td>€ 62</td><td>Marco</td><td className="xs muted">cliente diretto</td></tr>
                <tr><td className="mono xs">08/05 11:30</td><td><Pill tone="ok">carico</Pill></td><td>+5</td><td className="mono xs">← ord. O-0138 DigitalParts</td><td>€ 60</td><td>Marco</td><td className="xs muted">prezzo migliorato</td></tr>
                <tr><td className="mono xs">02/05 15:40</td><td><Pill tone="warn">scarico</Pill></td><td>-2</td><td className="mono xs">→ intervento #2380</td><td>€ 62</td><td>Luca</td><td></td></tr>
                <tr><td className="mono xs">29/04 10:12</td><td><Pill tone="warn">scarico</Pill></td><td>-1</td><td className="mono xs">→ intervento #2371</td><td>€ 62</td><td>Sara</td><td></td></tr>
                <tr><td className="mono xs">22/04 14:00</td><td><Pill tone="ok">carico</Pill></td><td>+8</td><td className="mono xs">← ord. O-0131 DigitalParts</td><td>€ 62</td><td>Marco</td><td></td></tr>
              </tbody>
            </table>
          </Box>
        </div>

        <div className="col gap-3" style={{ width:300 }}>
          <Box>
            <div className="hand lg">Fornitori</div>
            <HR />
            <div className="col gap-2" style={{ fontSize:14, marginTop:4 }}>
              <div className="row between"><span className="hand md">DigitalParts srl ★</span><span className="mono xs">€ 62</span></div>
              <div className="mono tiny muted">consegna 2-3gg · preferito</div>
              <HR />
              <div className="row between"><span className="hand md">RAMItalia</span><span className="mono xs">€ 65</span></div>
              <div className="mono tiny muted">consegna 1-2gg</div>
              <HR />
              <div className="row between"><span className="hand md">PhonePartsEU</span><span className="mono xs">€ 68</span></div>
              <div className="mono tiny muted">consegna 5-7gg</div>
              <Btn size="sm" style={{ marginTop:8 }}>+ aggiungi fornitore</Btn>
            </div>
          </Box>

          <Box className="fill-2">
            <div className="hand lg">Specifiche</div>
            <HR />
            <table className="tbl">
              <tbody>
                <tr><td className="muted">Marca</td><td>Crucial</td></tr>
                <tr><td className="muted">Modello</td><td>P3 CT1000P3SSD8</td></tr>
                <tr><td className="muted">Form factor</td><td>M.2 2280</td></tr>
                <tr><td className="muted">Garanzia</td><td>5 anni</td></tr>
                <tr><td className="muted">Compatibilità</td><td className="xs">notebook recenti, desktop</td></tr>
              </tbody>
            </table>
          </Box>

          <div className="stickynote">verificare prezzo<br/>su DigitalParts<br/>per ordine giugno</div>
        </div>
      </div>
    </div>
  </div>
);

// 4) Movimento di carico — ricezione ordine fornitore
const WhCarico = () => (
  <div className="sheet" style={{ display:'flex', flexDirection:'column' }}>
    <TopBar
      title="Carico merce · ordine O-0142"
      sub="Stai ricevendo un ordine da DigitalParts srl · DDT 4421 del 14/05"
      breadcrumbs="HOME / MAGAZZINO / MOVIMENTI / CARICO"
      right={<>
        <Btn size="sm">← annulla</Btn>
        <Btn size="sm">salva bozza</Btn>
        <Btn size="sm" tone="primary">conferma carico + stampa</Btn>
      </>}
    />
    <div style={{ flex:1, display:'flex', gap:14, padding:18, minHeight:0 }}>
      <div className="col gap-3 grow" style={{ minWidth:0 }}>
        <Box>
          <div className="hand lg">Articoli ricevuti</div>
          <HR />
          <table className="tbl">
            <thead><tr>
              <th>SKU</th><th>Articolo</th><th>Atteso</th><th>Ricevuto</th>
              <th>€ atteso</th><th>€ effettivo</th><th>Lotto/Note</th><th></th>
            </tr></thead>
            <tbody>
              <tr style={{ background:'#fff' }}>
                <td className="mono xs">SSD-1TB-NVME</td>
                <td className="hand md">SSD NVMe 1TB Crucial P3</td>
                <td className="mono xs">3</td>
                <td><Field label="" value="3" w={50} box /></td>
                <td className="mono xs">€ 62</td>
                <td><Field label="" value="€ 60" w={70} box /></td>
                <td><Field label="" value="L240514" w={120} box /></td>
                <td><Pill tone="ok">match</Pill></td>
              </tr>
              <tr>
                <td className="mono xs">RAM-16-DDR5</td>
                <td className="hand md">RAM 16GB DDR5 SODIMM</td>
                <td className="mono xs">2</td>
                <td><Field label="" value="2" w={50} box /></td>
                <td className="mono xs">€ 48</td>
                <td><Field label="" value="€ 48" w={70} box /></td>
                <td><Field label="" value="—" w={120} box /></td>
                <td><Pill tone="ok">match</Pill></td>
              </tr>
              <tr>
                <td className="mono xs">PASTA-KRY</td>
                <td className="hand md">Pasta term. Kryonaut 1g</td>
                <td className="mono xs">5</td>
                <td><Field label="" value="4" w={50} box /></td>
                <td className="mono xs">€ 8</td>
                <td><Field label="" value="€ 8" w={70} box /></td>
                <td><Field label="" value="1 mancante!" w={120} box /></td>
                <td><Pill tone="warn">−1</Pill></td>
              </tr>
            </tbody>
          </table>
          <div className="row between" style={{ marginTop:10 }}>
            <Btn size="sm" tone="ghost">+ riga manuale</Btn>
            <span className="mono tiny muted">📷 scansiona barcode per aggiungere riga</span>
          </div>
        </Box>

        <Box className="fill-2">
          <div className="hand lg">Note</div>
          <HR />
          <div className="box thin" style={{ background:'#fff', padding:8, marginTop:6, minHeight:60 }}>
            <span className="hand md">Confezione pasta term. arrivata con 1 unità mancante. Aprire reclamo a DigitalParts.</span>
          </div>
        </Box>
      </div>

      <Box style={{ width:320, padding:14, display:'flex', flexDirection:'column' }}>
        <span className="ribbon">riepilogo</span>
        <HR style={{ margin:'10px 0' }} />
        <table className="tbl">
          <tbody>
            <tr><td className="muted">Fornitore</td><td className="hand md">DigitalParts srl</td></tr>
            <tr><td className="muted">Ordine</td><td className="mono xs">O-0142 del 09/05</td></tr>
            <tr><td className="muted">DDT</td><td className="mono xs">4421 del 14/05</td></tr>
            <tr><td className="muted">Operatore</td><td>Marco T.</td></tr>
            <tr><td className="muted">Articoli ricevuti</td><td className="hand md">9 su 10</td></tr>
          </tbody>
        </table>
        <HR style={{ margin:'10px 0' }} />
        <div className="col gap-2" style={{ fontSize:14 }}>
          <div className="row between"><span>Costo atteso</span><span className="hand md">€ 420,00</span></div>
          <div className="row between"><span>Costo effettivo</span><span className="hand md">€ 410,00</span></div>
          <div className="row between"><span>Risparmio</span><span className="hand md"><span className="hi-mark">€ 10</span></span></div>
        </div>
        <HR style={{ margin:'10px 0' }} />
        <div className="col gap-2">
          <Chk on>Aggiorna stock automaticamente</Chk>
          <Chk on>Registra in contabilità (acquisti)</Chk>
          <Chk>Aggiorna costo medio articoli</Chk>
          <Chk>Notifica chi ha riservato pezzi</Chk>
        </div>
        <div style={{ flex:1 }}></div>
        <Btn tone="primary" size="lg" style={{ marginTop:12 }}>✓ conferma carico</Btn>
        <div className="mono tiny muted" style={{ textAlign:'center', marginTop:4 }}>etichette stampate dopo conferma</div>
      </Box>
    </div>
  </div>
);

// 5) Scarico pezzo da intervento (modale)
const WhScarico = () => (
  <div className="sheet" style={{ background:'rgba(0,0,0,0.25)', display:'flex', alignItems:'center', justifyContent:'center', position:'relative' }}>
    {/* dimmed bg representing the ticket detail */}
    <div style={{ position:'absolute', inset:0, opacity:0.25 }}>
      <TicketsC/>
    </div>
    {/* modal */}
    <Box style={{ width:680, background:'var(--paper)', position:'relative', zIndex:2, padding:0 }} shadow>
      <div className="row between" style={{ padding:'12px 16px', borderBottom:'1.6px solid var(--rule)', alignItems:'center' }}>
        <div>
          <div className="mono tiny muted">SCARICO MAGAZZINO</div>
          <div className="hand lg" style={{ lineHeight:1 }}>Aggiungi pezzi a intervento <b>#2410</b> · Rossi G.</div>
        </div>
        <Btn size="sm" tone="ghost">✕</Btn>
      </div>
      <div style={{ padding:16, display:'flex', flexDirection:'column', gap:12 }}>
        <Box>
          <Search placeholder="🔍 cerca articolo per SKU, nome, scansiona barcode…" w="100%" />
          <div className="mono tiny muted" style={{ marginTop:4 }}>premi tab dopo lo scan o usa 📷 fotocamera</div>
        </Box>

        <Box>
          <div className="row between"><div className="hand md">Pezzi selezionati (2)</div><Btn size="sm" tone="ghost">+ riga manuale</Btn></div>
          <HR />
          <table className="tbl">
            <thead><tr><th>SKU</th><th>Articolo</th><th>Stock</th><th>Q.</th><th>€ cad.</th><th>€ tot</th><th></th></tr></thead>
            <tbody>
              <tr>
                <td className="mono xs">KB-MBA-M1-IT</td>
                <td className="hand md">Tastiera MacBook Air M1 IT</td>
                <td><Pill tone="warn">0 + 2 in arrivo</Pill></td>
                <td><Field label="" value="1" w={50} box /></td>
                <td className="mono xs">€ 149</td>
                <td className="hand md">€ 149,00</td>
                <td><Btn size="sm" tone="ghost">✕</Btn></td>
              </tr>
              <tr>
                <td className="mono xs">PASTA-KRY</td>
                <td className="hand md">Pasta term. Kryonaut 1g</td>
                <td><Pill tone="warn">1</Pill></td>
                <td><Field label="" value="1" w={50} box /></td>
                <td className="mono xs">€ 14</td>
                <td className="hand md">€ 14,00</td>
                <td><Btn size="sm" tone="ghost">✕</Btn></td>
              </tr>
            </tbody>
          </table>
        </Box>

        <Box hi>
          <div className="row gap-3" style={{ alignItems:'center' }}>
            <span className="annot" style={{ color:'var(--warn)' }}>⚠ attenzione</span>
            <span className="hand md">La tastiera è a stock 0. Vuoi <b>riservarla dall'ordine O-0144</b> (atteso 18/05)?</span>
          </div>
          <div className="row gap-2" style={{ marginTop:6 }}>
            <Rad on>riserva su ordine in arrivo (sposta intervento → "attesa pezzi")</Rad>
          </div>
          <div className="row gap-2" style={{ marginTop:2 }}>
            <Rad>ordina ora (apri nuovo ordine fornitore)</Rad>
          </div>
        </Box>

        <div className="row between" style={{ alignItems:'center' }}>
          <div className="col gap-2">
            <Chk on>Aggiungi al totale dell'intervento</Chk>
            <Chk on>Cambia stato → <b>attesa pezzi</b></Chk>
            <Chk>Avvisa cliente via SMS</Chk>
          </div>
          <div className="col gap-2" style={{ textAlign:'right' }}>
            <div className="mono tiny muted">TOTALE SCARICO</div>
            <div className="title" style={{ fontSize:34, lineHeight:1 }}><span className="hi-mark">€ 163,00</span></div>
          </div>
        </div>
      </div>
      <div className="row between" style={{ padding:'10px 16px', borderTop:'1.6px solid var(--rule)' }}>
        <Btn>annulla</Btn>
        <div className="row gap-2">
          <Btn>salva senza scaricare</Btn>
          <Btn tone="primary">✓ scarica e collega</Btn>
        </div>
      </div>
    </Box>
  </div>
);

window.WhDash = WhDash;
window.WhList = WhList;
window.WhDetail = WhDetail;
window.WhCarico = WhCarico;
window.WhScarico = WhScarico;
