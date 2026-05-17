// Main app — design canvas with all wireframe sections

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#ffe066",
  "showAnnotations": true,
  "paperGrain": true,
  "tilt": true
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply tweaks to CSS variables
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--hi', t.accent);
    // mute the secondary highlight tone (50% mix with white)
    const c = t.accent;
    root.style.setProperty('--hi-2', c + '99'); // alpha approximate
    document.body.classList.toggle('no-annot', !t.showAnnotations);
    document.body.classList.toggle('no-grain', !t.paperGrain);
    document.body.classList.toggle('no-tilt', !t.tilt);
  }, [t.accent, t.showAnnotations, t.paperGrain, t.tilt]);

  const SECTIONS = [
    {
      id: 'intro', title: '0 · Premessa',
      subtitle: 'Sistema visivo + flusso d\'uso ipotizzato',
      boards: [
        { id:'intro-1', label:'Sistema · paper + ink', width:1200, height:680, content:<Intro/> },
      ]
    },
    {
      id: 'dashboard', title: '1 · Dashboard',
      subtitle: '4 angolazioni — operativa, amministrativa, minimal, classica',
      boards: [
        { id:'dash-a', label:'A · Classica (sidebar + KPI)', width:1280, height:800, content:<DashA/> },
        { id:'dash-b', label:'B · Operativa (banco + pipeline)', width:1280, height:800, content:<DashB/> },
        { id:'dash-c', label:'C · Vista titolare (€)', width:1280, height:800, content:<DashC/> },
        { id:'dash-d', label:'D · Minimal tiles', width:1280, height:800, content:<DashD/> },
      ]
    },
    {
      id: 'accept', title: '2 · Accettazione nuovo intervento',
      subtitle: 'Il momento chiave: cliente al banco, dispositivo in consegna',
      boards: [
        { id:'acc-a', label:'A · Form classico (3 colonne)', width:1280, height:820, content:<AcceptA/> },
        { id:'acc-b', label:'B · Wizard a step (touch)', width:1280, height:820, content:<AcceptB/> },
        { id:'acc-c', label:'C · Single-screen rapida', width:1280, height:820, content:<AcceptC/> },
      ]
    },
    {
      id: 'tickets', title: '3 · Lista interventi',
      subtitle: 'Tabella, kanban, master/detail — tre modi di guardare la stessa coda',
      boards: [
        { id:'tic-a', label:'A · Tabella + filtri', width:1280, height:820, content:<TicketsA/> },
        { id:'tic-b', label:'B · Kanban per stato', width:1280, height:820, content:<TicketsB/> },
        { id:'tic-c', label:'C · Master/detail (scheda)', width:1280, height:820, content:<TicketsC/> },
      ]
    },
    {
      id: 'clients', title: '4 · Anagrafica clienti',
      subtitle: 'Schede con storico e mini-CRM',
      boards: [
        { id:'cli-a', label:'A · Lista + scheda', width:1280, height:820, content:<ClientsA/> },
        { id:'cli-b', label:'B · Tile CRM visuale', width:1280, height:820, content:<ClientsB/> },
      ]
    },
    {
      id: 'accounting', title: '5 · Contabilità',
      subtitle: 'Margine per intervento, P&L mensile, fornitori',
      boards: [
        { id:'acc-1', label:'A · Per intervento (€ e %)', width:1280, height:820, content:<AccountingA/> },
        { id:'acc-2', label:'B · Vista mese · P&L', width:1280, height:820, content:<AccountingB/> },
        { id:'acc-3', label:'C · Fornitori & acquisti', width:1280, height:820, content:<AccountingC/> },
      ]
    },
    {
      id: 'print', title: '6 · Stampa · bolla + scontrino',
      subtitle: 'Documenti carta — bolla A5 al cliente, scontrino termico al ritiro',
      boards: [
        { id:'print-a', label:'Bolla di accettazione (A5)', width:780, height:1040, content:<Bolla/> },
        { id:'print-b', label:'Scontrino al ritiro (80mm)', width:780, height:760, content:<Scontrino/> },
      ]
    },
    {
      id: 'mobile', title: '7 · Mobile · tecnico in laboratorio',
      subtitle: 'L\'app sul telefono: per aggiornare stato senza tornare al banco',
      boards: [
        { id:'mob-a', label:'A · Lista miei interventi', width:380, height:740, content:<MobileA/> },
        { id:'mob-b', label:'B · Dettaglio intervento', width:380, height:740, content:<MobileB/> },
        { id:'mob-c', label:'C · Scanner QR/seriale', width:380, height:740, content:<MobileC/> },
      ]
    },
    {
      id: 'wh', title: '8 · Magazzino',
      subtitle: 'Dashboard, lista, dettaglio, carico merce, scarico su intervento',
      boards: [
        { id:'wh-dash', label:'A · Dashboard magazzino', width:1280, height:820, content:<WhDash/> },
        { id:'wh-list', label:'B · Lista articoli', width:1280, height:820, content:<WhList/> },
        { id:'wh-det', label:'C · Dettaglio articolo', width:1280, height:820, content:<WhDetail/> },
        { id:'wh-car', label:'D · Carico merce (ricezione ordine)', width:1280, height:820, content:<WhCarico/> },
        { id:'wh-sca', label:'E · Scarico su intervento (modale)', width:1280, height:820, content:<WhScarico/> },
      ]
    },
    {
      id: 'flow1', title: '9 · Flusso · Chiusura + incasso',
      subtitle: 'Storyboard: dal "marca pronto" al cliente che esce con scontrino',
      boards: [
        { id:'f1-s1', label:'1 · Riepilogo finale lavoro', width:1280, height:820, content:<F1_S1/> },
        { id:'f1-s2', label:'2 · Cliente arriva, banco', width:1280, height:820, content:<F1_S2/> },
        { id:'f1-s3', label:'3 · Consegna + cassa', width:1280, height:820, content:<F1_S3/> },
        { id:'f1-s4', label:'4 · Conferma + registrazioni', width:1280, height:820, content:<F1_S4/> },
      ]
    },
    {
      id: 'flow2', title: '10 · Flusso · Ordine fornitore',
      subtitle: 'Dal suggerimento automatico alla ricezione del DDT',
      boards: [
        { id:'f2-s1', label:'1 · Suggerimento + carrello', width:1280, height:820, content:<F2_S1/> },
        { id:'f2-s2', label:'2 · Ordine pronto da inviare', width:1280, height:820, content:<F2_S2/> },
        { id:'f2-s3', label:'3 · Tracking + clienti collegati', width:1280, height:820, content:<F2_S3/> },
      ]
    },
    {
      id: 'flow3', title: '11 · Flusso · Comunicazione cliente',
      subtitle: 'SMS automatici, portale pubblico stato intervento, recensione post-consegna',
      boards: [
        { id:'f3-s1', label:'1 · Template SMS + log invii', width:1280, height:820, content:<F3_S1/> },
        { id:'f3-s2', label:'2 · Portale stato (vista cliente)', width:1280, height:820, content:<F3_S2/> },
        { id:'f3-s3', label:'3 · Post-consegna + recensione', width:1280, height:820, content:<F3_S3/> },
      ]
    },
    {
      id: 'hifi', title: '12 · HI-FI · direzione visiva proposta',
      subtitle: 'Versione hi-fi delle 3 schermate più usate · estetica pulita "Linear/Notion" · clay accent',
      boards: [
        { id:'hf-dash', label:'Hi-fi · Dashboard', width:1320, height:860, content:<HifiDash/> },
        { id:'hf-tic-list', label:'Hi-fi · Lista interventi', width:1320, height:860, content:<HifiTickets/> },
        { id:'hf-acc', label:'Hi-fi · Accettazione', width:1320, height:860, content:<HifiAccept/> },
        { id:'hf-tic', label:'Hi-fi · Dettaglio intervento', width:1320, height:860, content:<HifiTicket/> },
        { id:'hf-wh', label:'Hi-fi · Magazzino', width:1320, height:860, content:<HifiWarehouse/> },
        { id:'hf-cnt', label:'Hi-fi · Contabilità', width:1320, height:860, content:<HifiAccounting/> },
        { id:'hf-mob', label:'Hi-fi · Mobile · 3 schermate', width:1200, height:820, content:<HifiMobile/> },
      ]
    },
  ];

  return (
    <>
      <DesignCanvas
        title="Ass-et · centro assistenza"
        subtitle="Wireframes lo-fi · esplorazione del design space · v1"
      >
        {SECTIONS.map(s => (
          <DCSection key={s.id} id={s.id} title={s.title} subtitle={s.subtitle}>
            {s.boards.map(b => (
              <DCArtboard key={b.id} id={b.id} label={b.label} width={b.width} height={b.height}>
                {b.content}
              </DCArtboard>
            ))}
          </DCSection>
        ))}
      </DesignCanvas>

      <TweaksPanel title="Tweaks">
        <TweakSection title="Stile">
          <TweakColor
            label="Accento (evidenziatore)"
            value={t.accent}
            options={['#ffe066','#ffd166','#caffbf','#a0c4ff','#ffadad','#fdffb6']}
            onChange={v => setTweak('accent', v)}
          />
          <TweakToggle
            label="Grana della carta"
            value={t.paperGrain}
            onChange={v => setTweak('paperGrain', v)}
          />
          <TweakToggle
            label="Inclinazione box (tilt)"
            value={t.tilt}
            onChange={v => setTweak('tilt', v)}
          />
          <TweakToggle
            label="Annotazioni a margine"
            value={t.showAnnotations}
            onChange={v => setTweak('showAnnotations', v)}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

// --- Intro board ---
function Intro() {
  return (
    <div className="sheet" style={{ padding:36, display:'flex', flexDirection:'column', gap:18 }}>
      <div className="row between" style={{ alignItems:'flex-start' }}>
        <div>
          <span className="ribbon">progetto · ass-et</span>
          <div className="title" style={{ fontSize:64, marginTop:8 }}>
            Gestionale per <span className="hi-mark">centro assistenza</span>
          </div>
          <div className="subtitle" style={{ fontSize:20 }}>
            Wireframes lo-fi · 7 sezioni · 19 schermate · Italiano
          </div>
        </div>
        <Logo size={56} />
      </div>

      <div className="row gap-4" style={{ flex:1, minHeight:0 }}>
        <Box className="grow" shadow>
          <div className="hand lg">Cosa stiamo esplorando</div>
          <HR />
          <ol className="hand md" style={{ margin:'8px 0 0 18px', padding:0, lineHeight:1.4 }}>
            <li>Dashboard — <i>quale "casa" serve davvero</i></li>
            <li>Accettazione — <i>il momento al banco, fluido e completo</i></li>
            <li>Interventi — <i>tabella, kanban o split</i></li>
            <li>Clienti — <i>storico e mini-CRM</i></li>
            <li>Contabilità — <i>margine vero, non solo fatturato</i></li>
            <li>Stampe — <i>bolla cliente + scontrino cassa</i></li>
            <li>Mobile — <i>app del tecnico in laboratorio</i></li>
            <li><b>Magazzino</b> — <i>dashboard, articoli, carico/scarico</i> <span className="annot ok" style={{fontSize:14}}>nuovo!</span></li>
            <li><b>Flussi storyboard</b> — <i>chiusura+incasso, ordine fornitore, SMS</i> <span className="annot ok" style={{fontSize:14}}>nuovo!</span></li>
            <li><b>Hi-fi</b> — <i>direzione visiva delle 3 schermate chiave</i> <span className="annot ok" style={{fontSize:14}}>nuovo!</span></li>
          </ol>
        </Box>

        <Box className="grow" shadow>
          <div className="hand lg">Sistema visivo</div>
          <HR />
          <div className="col gap-3" style={{ marginTop:6 }}>
            <div className="row gap-3" style={{ alignItems:'center' }}>
              <div style={{ width:50, height:30, background:'var(--paper)', border:'1.6px solid var(--rule)' }}></div>
              <span className="hand md">carta · #fbf8f1</span>
              <div style={{ width:50, height:30, background:'var(--ink)' }}></div>
              <span className="hand md">inchiostro · #1f1d1a</span>
            </div>
            <div className="row gap-3" style={{ alignItems:'center' }}>
              <div style={{ width:50, height:30, background:'var(--hi)', border:'1.6px solid var(--rule)' }}></div>
              <span className="hand md">evidenziatore</span>
              <div style={{ width:50, height:30, background:'var(--warn)' }}></div>
              <span className="hand md" style={{ color:'var(--warn)' }}>urgente</span>
              <div style={{ width:50, height:30, background:'var(--ok)' }}></div>
              <span className="hand md" style={{ color:'var(--ok)' }}>ok</span>
            </div>
            <div className="row gap-3 wrap">
              <Pill>in diagnosi</Pill>
              <Pill tone="warn">attesa pezzi</Pill>
              <Pill tone="note">attesa cliente</Pill>
              <Pill tone="hi">in lavorazione</Pill>
              <Pill tone="ok">pronto</Pill>
              <Pill tone="dark">consegnato</Pill>
            </div>
            <div className="row gap-2" style={{ alignItems:'center' }}>
              <Btn size="sm">ghost</Btn>
              <Btn size="sm">default</Btn>
              <Btn size="sm" tone="hi">accent</Btn>
              <Btn size="sm" tone="primary">primary</Btn>
              <Btn size="sm" tone="warn">danger</Btn>
            </div>
            <div className="mono tiny muted">
              Font: <b>Caveat</b> (titoli) · <b>Kalam</b> (corpo) · <b>JetBrains Mono</b> (id, codici)
            </div>
          </div>
        </Box>

        <Box style={{ width:300 }} hi shadow>
          <div className="hand lg">Come navigare</div>
          <HR />
          <div className="hand md" style={{ marginTop:8, lineHeight:1.4 }}>
            • <b>Pan</b>: trascina lo sfondo<br/>
            • <b>Zoom</b>: rotella o pizzica<br/>
            • <b>Focus</b>: click ⤢ in alto a destra di una scheda<br/>
            • <b>Riordina</b>: trascina dalla maniglia ⋮⋮<br/>
            • <b>Tweaks</b>: pannello in basso a destra
          </div>
          <HR style={{ margin:'10px 0' }} />
          <div className="mono tiny muted">
            Tutto è ipotesi — wireframe lo-fi.<br/>
            Concentriamoci su <b>struttura</b> e <b>flusso</b>,<br/>
            non su pixel e colori.
          </div>
        </Box>
      </div>

      <div className="row between" style={{ alignItems:'center' }}>
        <span className="annot">↳ scorri in basso per esplorare le sezioni</span>
        <span className="mono tiny muted">v1 · 15 maggio 2026</span>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
