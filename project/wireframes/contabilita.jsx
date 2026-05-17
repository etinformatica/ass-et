// Contabilità — 3 varianti (per-intervento margine, vista mensile, fornitori)

// A) Tabella per-intervento: ricavo, costo pezzi, margine, esportazione
const AccountingA = () => (
  <div className="sheet" style={{ display:'flex' }}>
    <Sidebar active="accounting" />
    <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
      <TopBar
        title="Contabilità · per intervento"
        sub="Costi pezzi vs ricavi, margine per ogni assistenza"
        breadcrumbs="HOME / CONTABILITÀ / INTERVENTI"
        right={<>
          <Pill>maggio 2026</Pill>
          <Btn size="sm">◄</Btn><Btn size="sm">►</Btn>
          <Btn size="sm">📥 esporta XLS</Btn>
          <Btn size="sm" tone="primary">chiudi periodo</Btn>
        </>}
      />
      <div style={{ padding:'14px 22px', flex:1, display:'flex', flexDirection:'column', gap:14, minHeight:0 }}>
        {/* totals strip */}
        <div className="row gap-3">
          {[
            ['Ricavi periodo','€ 18.420','+12% vs apr','hi'],
            ['Costi pezzi','€ 6.180','+4% vs apr',''],
            ['Manodopera','€ 1.250','=',''],
            ['Margine lordo','€ 10.990','+18%','ok'],
            ['Margine %','59,7 %','+3 pt','ok'],
            ['Interventi','142','—','dark'],
          ].map(([k,v,d,t]) => (
            <Box key={k} className="grow" shadow style={{ padding:'8px 12px' }}>
              <div className="mono tiny muted" style={{ textTransform:'uppercase' }}>{k}</div>
              <div className="hand xl">{v}</div>
              <Pill tone={t}>{d}</Pill>
            </Box>
          ))}
        </div>

        <Box className="grow" style={{ display:'flex', flexDirection:'column', minHeight:0 }}>
          <div className="row between" style={{ marginBottom:6 }}>
            <div className="hand lg">Interventi del periodo</div>
            <div className="row gap-2">
              <Pill tone="dark">consegnati 138</Pill>
              <Pill tone="warn">aperti 4</Pill>
              <Pill>ordina per margine ↓</Pill>
            </div>
          </div>
          <table className="tbl">
            <thead><tr>
              <th>N°</th><th>Chiuso</th><th>Cliente</th><th>Lavorazione</th><th>Pezzi</th>
              <th>Ricavo</th><th>Costo pezzi</th><th>Mano-op.</th><th>Margine</th><th>%</th>
            </tr></thead>
            <tbody>
              {[
                ['#2406','11/05','Studio Neri','tamburo HP LJ',         '€ 22','€ 80','€ 22','€ 12','€ 46','57%'],
                ['#2402','09/05','Caputo M.','batt + tast HP Envy',     '€ 45','€ 170','€ 45','€ 30','€ 95','55%'],
                ['#2400','09/05','Studio LM','manutenz.',                '€ 0','€ 80','€ 0','€ 25','€ 55','68%'],
                ['#2398','08/05','Sanna R.','overheat + paste term.',   '€ 12','€ 90','€ 12','€ 25','€ 53','58%'],
                ['#2393','07/05','Russo G.','vetro iPhone 11',           '€ 28','€ 95','€ 28','€ 18','€ 49','51%',],
                ['#2388','05/05','Conti A.','SSD 1TB + clone',           '€ 89','€ 220','€ 89','€ 35','€ 96','43%'],
                ['#2384','04/05','Greco L.','batteria iPad',             '€ 24','€ 90','€ 24','€ 18','€ 48','53%'],
                ['#2380','03/05','Bianchi P.','RAM 16GB DDR4',           '€ 38','€ 110','€ 38','€ 20','€ 52','47%'],
                ['#2376','02/05','Esposito A.','vetro iPhone 12',        '€ 35','€ 120','€ 35','€ 22','€ 63','52%','best'],
                ['#2370','01/05','Verdi srl','manutenz. flotta 5 PC',    '€ 0','€ 400','€ 0','€ 120','€ 280','70%','best'],
              ].map(r => (
                <tr key={r[0]}>
                  <td className="mono xs">{r[0]}</td>
                  <td className="mono xs muted">{r[1]}</td>
                  <td className="hand md">{r[2]}</td>
                  <td className="xs muted">{r[3]}</td>
                  <td className="mono xs">{r[4]}</td>
                  <td className="hand md">{r[5]}</td>
                  <td className="hand md muted">{r[6]}</td>
                  <td className="hand md muted">{r[7]}</td>
                  <td className="hand md"><span className={r[10]==='best'?'hi-mark':''}>{r[8]}</span></td>
                  <td><Pill tone={parseInt(r[9])>=60?'ok':parseInt(r[9])>=50?'':'warn'}>{r[9]}</Pill></td>
                </tr>
              ))}
              <tr style={{ borderTop:'2px solid var(--rule)' }}>
                <td colSpan="5" className="hand md" style={{ textAlign:'right', padding:'8px' }}>TOTALI (10 mostrati)</td>
                <td className="hand md">€ 1.455</td>
                <td className="hand md">€ 293</td>
                <td className="hand md">€ 325</td>
                <td className="hand md"><span className="hi-mark">€ 837</span></td>
                <td className="hand md">57,5%</td>
              </tr>
            </tbody>
          </table>
        </Box>
      </div>
    </div>
  </div>
);

// B) Vista mese — P&L semplificato + grafico
const AccountingB = () => (
  <div className="sheet" style={{ display:'flex' }}>
    <Sidebar active="accounting" />
    <div style={{ flex:1, padding:'18px 24px', display:'flex', flexDirection:'column', gap:14, minWidth:0 }}>
      <div className="row between" style={{ alignItems:'flex-end' }}>
        <div>
          <span className="ribbon">conto economico semplificato</span>
          <div className="title" style={{ marginTop:6 }}>Maggio 2026 · <span className="hi-mark">€ 10.990</span> di margine</div>
          <div className="subtitle">Aggiornato in tempo reale dalle assistenze chiuse e dai movimenti di magazzino</div>
        </div>
        <div className="row gap-2"><Btn size="sm">◄ aprile</Btn><Btn size="sm" tone="hi">maggio ●</Btn><Btn size="sm">giugno ►</Btn></div>
      </div>

      <div className="row gap-3" style={{ flex:1, minHeight:0 }}>
        {/* "T account" P&L */}
        <Box className="grow" style={{ display:'flex', flexDirection:'column' }}>
          <div className="hand lg">Ricavi vs Costi</div>
          <HR />
          <div className="row" style={{ flex:1, gap:0, marginTop:8 }}>
            <div style={{ flex:1, padding:'4px 12px', borderRight:'2px solid var(--rule)' }}>
              <div className="mono tiny muted" style={{ textTransform:'uppercase' }}>+ entrate</div>
              <div className="col gap-2" style={{ marginTop:6, fontSize:15 }}>
                <div className="row between"><span>Riparazioni</span><span className="hand md">€ 15.420</span></div>
                <div className="row between"><span>Vendita banco</span><span className="hand md">€ 2.450</span></div>
                <div className="row between"><span>Diagnosi a pagamento</span><span className="hand md">€ 350</span></div>
                <div className="row between"><span>Recupero dati</span><span className="hand md">€ 200</span></div>
                <HR />
                <div className="row between"><span className="hand md">Totale</span><span className="hand lg"><span className="hi-mark">€ 18.420</span></span></div>
              </div>
            </div>
            <div style={{ flex:1, padding:'4px 12px' }}>
              <div className="mono tiny muted" style={{ textTransform:'uppercase' }}>− uscite</div>
              <div className="col gap-2" style={{ marginTop:6, fontSize:15 }}>
                <div className="row between"><span>Pezzi (scaricati)</span><span className="hand md">€ 6.180</span></div>
                <div className="row between"><span>Acquisti fornitori</span><span className="hand md">€ 4.820 <span className="mono tiny muted">→ stock</span></span></div>
                <div className="row between"><span>Manodopera tecnici</span><span className="hand md">€ 1.250</span></div>
                <div className="row between"><span>Spedizioni</span><span className="hand md">€ 180</span></div>
                <HR />
                <div className="row between"><span className="hand md">Totale costi periodo</span><span className="hand lg">€ 7.430</span></div>
              </div>
            </div>
          </div>
          <HR style={{ margin:'10px 0' }} />
          <div className="row between" style={{ padding:'0 12px' }}>
            <span className="hand lg">Margine lordo</span>
            <span className="title"><span className="hi-mark">€ 10.990</span></span>
          </div>
        </Box>

        <div className="col gap-3" style={{ width:340 }}>
          <Box>
            <div className="hand lg">Andamento 12 mesi</div>
            <div style={{ position:'relative', height:160, marginTop:8 }}>
              <svg viewBox="0 0 320 140" style={{ width:'100%', height:'100%' }}>
                <path d="M 5 100 Q 30 90 50 92 T 95 80 T 140 72 T 185 70 T 230 55 T 275 60 T 315 30"
                  fill="none" stroke="var(--ink)" strokeWidth="2.2" strokeLinecap="round"/>
                <path d="M 5 100 Q 30 90 50 92 T 95 80 T 140 72 T 185 70 T 230 55 T 275 60 T 315 30 L 315 140 L 5 140 Z"
                  fill="var(--hi)" opacity="0.35"/>
                <circle cx="315" cy="30" r="4" fill="var(--ink)"/>
                <text x="295" y="22" fontFamily="Kalam" fontSize="11" fill="var(--ink)">mag</text>
              </svg>
            </div>
            <div className="row between"><span className="mono xs muted">giu '25</span><span className="mono xs muted">mag '26</span></div>
          </Box>
          <Box className="fill-2">
            <div className="hand lg">Da emettere</div>
            <HR />
            <div className="col gap-2" style={{ marginTop:4, fontSize:14 }}>
              <div className="row between"><span>Fatture aperte</span><span className="hand md">5 · € 820</span></div>
              <div className="row between"><span>Scontrini oggi</span><span className="hand md">12 · € 1.240</span></div>
              <div className="row between"><span>Da incassare</span><span className="hand md"><span className="hi-mark">€ 480</span></span></div>
            </div>
          </Box>
        </div>
      </div>
    </div>
  </div>
);

// C) Fornitori + Costi magazzino — vista acquisti
const AccountingC = () => (
  <div className="sheet" style={{ display:'flex' }}>
    <Sidebar active="accounting" />
    <div style={{ flex:1, padding:'18px 22px', display:'flex', flexDirection:'column', gap:14, minWidth:0 }}>
      <TopBar
        title="Acquisti & fornitori"
        sub="Spese di magazzino del periodo, ordini aperti, posizione fornitori"
        right={<>
          <Btn size="sm">+ nuovo fornitore</Btn>
          <Btn size="sm" tone="primary">+ ordine</Btn>
        </>}
      />

      <div className="row gap-3">
        {[
          ['Speso periodo','€ 4.820',''],
          ['Ordini aperti','7 · € 2.340','warn'],
          ['Da pagare 30gg','€ 1.180','hi'],
          ['Risparmio prezzi','€ 320','ok'],
        ].map(([k,v,t]) => (
          <Box key={k} className="grow" shadow><div className="mono tiny muted" style={{ textTransform:'uppercase' }}>{k}</div><div className="hand xl">{v}</div><Pill tone={t}>•</Pill></Box>
        ))}
      </div>

      <div className="row gap-3" style={{ flex:1, minHeight:0 }}>
        <Box className="grow" style={{ display:'flex', flexDirection:'column' }}>
          <div className="hand lg">Fornitori</div>
          <table className="tbl" style={{ marginTop:6 }}>
            <thead><tr>
              <th>Fornitore</th><th>Ordini mese</th><th>Speso</th>
              <th>Ultimo</th><th>Pagam.</th><th>Saldo</th><th></th>
            </tr></thead>
            <tbody>
              <tr><td className="hand md">DigitalParts srl</td><td>8</td><td className="hand md">€ 3.240</td><td className="mono xs muted">12/05</td><td>30gg DF</td><td className="hand md"><span className="hi-mark">€ 1.080</span></td><td><Btn size="sm">apri</Btn></td></tr>
              <tr><td className="hand md">RAMItalia</td><td>3</td><td className="hand md">€ 1.180</td><td className="mono xs muted">09/05</td><td>RB 60gg</td><td className="hand md">€ 620</td><td><Btn size="sm">apri</Btn></td></tr>
              <tr><td className="hand md">PhonePartsEU</td><td>5</td><td className="hand md">€ 1.760</td><td className="mono xs muted">06/05</td><td>anticipo</td><td className="hand md">€ 0</td><td><Btn size="sm">apri</Btn></td></tr>
              <tr><td className="hand md">LocalStock IT</td><td>2</td><td className="hand md">€ 480</td><td className="mono xs muted">03/05</td><td>contanti</td><td className="hand md">€ 0</td><td><Btn size="sm">apri</Btn></td></tr>
            </tbody>
          </table>
          <HR style={{ margin:'10px 0' }} />
          <div className="hand lg">Ordini aperti</div>
          <table className="tbl" style={{ marginTop:6 }}>
            <thead><tr><th>Ordine</th><th>Fornitore</th><th>Articoli</th><th>Per</th><th>€</th><th>Atteso</th></tr></thead>
            <tbody>
              <tr><td className="mono xs">O-0142</td><td className="hand md">DigitalParts</td><td>SSD 1TB ×3 · RAM 16GB ×2</td><td className="mono xs muted">#2410, #2398</td><td className="hand md">€ 420</td><td><Pill tone="warn">in ritardo</Pill></td></tr>
              <tr><td className="mono xs">O-0143</td><td className="hand md">PhonePartsEU</td><td>vetri iPhone 13 ×4</td><td className="mono xs muted">stock</td><td className="hand md">€ 220</td><td><Pill>17/05</Pill></td></tr>
              <tr><td className="mono xs">O-0144</td><td className="hand md">RAMItalia</td><td>tastiera MBA M1 IT</td><td className="mono xs muted">#2410</td><td className="hand md">€ 95</td><td><Pill>18/05</Pill></td></tr>
            </tbody>
          </table>
        </Box>

        <Box style={{ width:300 }}>
          <div className="hand lg">Valore di magazzino</div>
          <HR />
          <div className="col gap-2" style={{ marginTop:6, fontSize:14 }}>
            <div className="row between"><span>Pezzi a stock</span><span className="hand md">238</span></div>
            <div className="row between"><span>Valore a costo</span><span className="hand md">€ 8.420</span></div>
            <div className="row between"><span>Valore a vendita</span><span className="hand md"><span className="hi-mark">€ 14.120</span></span></div>
            <HR />
            <div className="row between"><span>Margine atteso</span><span className="hand md">€ 5.700</span></div>
            <div className="row between"><span>Margine %</span><span className="hand md">40,4 %</span></div>
          </div>
          <HR style={{ margin:'10px 0' }} />
          <div className="hand lg">Pezzi sottoscorta</div>
          <ul style={{ margin:'4px 0 0 16px', padding:0, fontSize:14 }}>
            <li>SSD 1TB NVMe — <b>2/5</b></li>
            <li>Pasta term. Kryonaut — <b>1/4</b></li>
            <li>Tast. MBA M1 IT — <b>0/2</b></li>
            <li>Vetro iPh. 13 — <b>1/3</b></li>
          </ul>
          <Btn size="sm" tone="hi" style={{ marginTop:8 }}>genera ordine →</Btn>
        </Box>
      </div>
    </div>
  </div>
);

window.AccountingA = AccountingA;
window.AccountingB = AccountingB;
window.AccountingC = AccountingC;
