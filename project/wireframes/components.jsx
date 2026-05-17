// Shared sketch primitives + nav scaffolds for the wireframes.

const Box = ({ children, style, className = '', tilt, double, fill, shadow, dashed, dotted, hi, note, ...rest }) => {
  const cls = ['box',
    className,
    tilt === 'l' && 'tilt-l',
    tilt === 'r' && 'tilt-r',
    double && 'double',
    fill === true ? 'fill' : fill === 2 ? 'fill-2' : '',
    shadow && 'shadow',
    dashed && 'dashed',
    dotted && 'dotted',
    hi && 'hi',
    note && 'note',
  ].filter(Boolean).join(' ');
  return <div className={cls} style={style} {...rest}>{children}</div>;
};

const Pill = ({ children, tone = '' }) => (
  <span className={`pill ${tone}`}><span className="dot"></span>{children}</span>
);

const Btn = ({ children, tone = '', size = '', icon }) => (
  <span className={`btn ${tone} ${size}`}>{icon && <span className="mono tiny">{icon}</span>}{children}</span>
);

const Field = ({ label, value, box, w, placeholder }) => (
  <div className={`field ${box ? 'box-style' : ''}`} style={{ width: w }}>
    <span className="lbl">{label}</span>
    <span className="val" style={{ color: value ? undefined : 'var(--muted)' }}>
      {value || placeholder || '________________'}
    </span>
  </div>
);

const Chk = ({ on, children }) => (
  <span className="chk"><span className={`chk-box ${on ? 'on' : ''}`}></span>{children}</span>
);

const Rad = ({ on, children }) => (
  <span className="chk"><span className={`radio ${on ? 'on' : ''}`}></span>{children}</span>
);

const HR = ({ thick, solid, style }) => <div className={`hr ${thick ? 'thick' : ''} ${solid ? 'solid' : ''}`} style={style}></div>;

const Arrow = ({ dir = '→', style }) => <span className="arrow" style={style}>{dir}</span>;

const Annot = ({ children, tone = '', style }) => <span className={`annot ${tone}`} style={style}>{children}</span>;

const Placeholder = ({ children, style, diag }) => (
  <div className={`placeholder ${diag ? 'diag' : ''}`} style={style}>{children}</div>
);

const Logo = ({ size = 28 }) => (
  <div style={{ display:'flex', alignItems:'center', gap:8 }}>
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect x="3" y="3" width="34" height="34" rx="7" fill="none" stroke="var(--ink)" strokeWidth="2"/>
      <path d="M11 26 L11 14 L20 14 L20 20 L29 20 L29 26" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="29" cy="14" r="2.4" fill="var(--hi)" stroke="var(--ink)" strokeWidth="1.5"/>
    </svg>
    <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
      <span className="hand" style={{ fontSize:22 }}>Ass-et</span>
      <span className="mono tiny muted" style={{ fontSize:9 }}>centro assistenza</span>
    </div>
  </div>
);

// Sidebar nav (used in desktop variants)
const Sidebar = ({ active = 'dashboard', wide = false }) => {
  const items = [
    ['dashboard', '⌂', 'Dashboard'],
    ['accept', '+', 'Accettazione'],
    ['tickets', '⚙', 'Interventi'],
    ['clients', '☺', 'Clienti'],
    ['warehouse', '▦', 'Magazzino'],
    ['accounting', '€', 'Contabilità'],
    ['reports', '📊', 'Report'],
  ];
  return (
    <div style={{
      width: wide ? 210 : 170, flex:'none', background:'var(--paper-2)',
      borderRight:'1.6px solid var(--rule)', padding:'14px 10px',
      display:'flex', flexDirection:'column', gap:10
    }}>
      <Logo />
      <div style={{ height:6 }}></div>
      <div className="col" style={{ gap:2 }}>
        {items.map(([id, ico, label]) => (
          <div key={id} className={`nav-item ${active===id?'active':''}`}>
            <span className="ico" style={{
              display:'inline-flex', alignItems:'center', justifyContent:'center',
              border:'none', width:18, height:18, fontSize:14
            }}>{ico}</span>
            {label}
          </div>
        ))}
      </div>
      <div style={{ flex:1 }}></div>
      <Box className="thin" style={{ fontSize:12, padding:'8px 10px' }}>
        <div className="hand md">Marco T.</div>
        <div className="mono tiny muted">Tecnico · banco</div>
      </Box>
    </div>
  );
};

// Top bar — desktop
const TopBar = ({ title, sub, right, breadcrumbs }) => (
  <div className="row between" style={{ alignItems:'flex-end', padding:'14px 22px 10px', borderBottom:'1.6px solid var(--rule)' }}>
    <div className="col" style={{ gap:2 }}>
      {breadcrumbs && <div className="mono tiny muted">{breadcrumbs}</div>}
      <div className="title">{title}</div>
      {sub && <div className="subtitle">{sub}</div>}
    </div>
    <div className="row gap-2" style={{ alignItems:'center' }}>{right}</div>
  </div>
);

// search box
const Search = ({ placeholder = 'cerca…', w = 240 }) => (
  <div className="box thin" style={{ width:w, padding:'5px 10px', display:'flex', alignItems:'center', gap:6 }}>
    <span className="mono xs muted">⌕</span>
    <span className="mono xs muted">{placeholder}</span>
  </div>
);

// Caption (label at top-left of an artboard, scribbled)
const Caption = ({ children, sub }) => (
  <div style={{ position:'absolute', top:-46, left:0, display:'flex', flexDirection:'column', gap:0, lineHeight:1.1 }}>
    <span className="hand" style={{ fontSize:22, color:'var(--ink-2)' }}>{children}</span>
    {sub && <span className="mono tiny muted">{sub}</span>}
  </div>
);

Object.assign(window, { Box, Pill, Btn, Field, Chk, Rad, HR, Arrow, Annot, Placeholder, Logo, Sidebar, TopBar, Search, Caption });
