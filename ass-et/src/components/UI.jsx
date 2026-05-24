// Shared UI primitives

export function Badge({ tone = 'gray', dot = true, children }) {
  return (
    <span className={`badge ${tone}`}>
      {dot && <span className="dot" />}
      {children}
    </span>
  );
}

export function Btn({ children, tone = '', size = '', onClick, icon, style }) {
  return (
    <button className={`btn ${tone} ${size}`} onClick={onClick} style={style}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}

export function Avatar({ name, tone = 'violet', size = 'sm' }) {
  const tones = {
    violet: { bg: 'var(--hf-violet-soft)', fg: 'var(--hf-violet)' },
    blue: { bg: 'var(--hf-blue-soft)', fg: 'var(--hf-blue)' },
    green: { bg: 'var(--hf-green-soft)', fg: 'var(--hf-green)' },
    amber: { bg: 'var(--hf-amber-soft)', fg: 'var(--hf-amber)' },
    accent: { bg: 'var(--hf-accent-soft)', fg: 'var(--hf-accent)' },
    gray: { bg: 'var(--hf-surface-2)', fg: 'var(--hf-text-2)' },
  };
  const t = tones[tone] || tones.violet;
  const initials = name.split(' ').map(n => n[0]).slice(0, 2).join('');
  return (
    <span className={`avatar ${size}`} style={{ background: t.bg, color: t.fg }}>
      {initials}
    </span>
  );
}

export function Icon({ name, style }) {
  const paths = {
    home: <path d="M3 9l5-5 5 5v5a1 1 0 01-1 1h-3v-3H7v3H4a1 1 0 01-1-1V9z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />,
    plus: <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />,
    list: <><path d="M3 4h10M3 8h10M3 12h10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></>,
    users: <><circle cx="6" cy="6" r="2.4" stroke="currentColor" strokeWidth="1.4" fill="none" /><path d="M2 14c0-2.2 1.8-4 4-4s4 1.8 4 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" /><circle cx="11" cy="5" r="1.8" stroke="currentColor" strokeWidth="1.4" fill="none" /></>,
    box: <><path d="M2 5l6-2 6 2v6l-6 2-6-2V5z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" /><path d="M2 5l6 2 6-2M8 7v6" stroke="currentColor" strokeWidth="1.4" fill="none" /></>,
    chart: <><path d="M3 13h11M5 11V7M8 11V4M11 11V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" /></>,
    euro: <><path d="M11 4.5a3.5 3.5 0 100 7M3 7h6M3 9h6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" /></>,
    search: <><circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.4" fill="none" /><path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></>,
    bell: <path d="M8 2c-2 0-3.5 1.5-3.5 3.5V8L3 10h10l-1.5-2V5.5C11.5 3.5 10 2 8 2zM6 12a2 2 0 004 0" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />,
    arrow: <path d="M5 8h6m-2-2l2 2-2 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    filter: <path d="M2 3h12l-4 5v5l-4-2V8L2 3z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />,
    camera: <><rect x="2" y="5" width="12" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill="none" /><circle cx="8" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.4" fill="none" /><path d="M6 5l1-1.5h2L10 5" stroke="currentColor" strokeWidth="1.4" fill="none" /></>,
    chevron: <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    settings: <><circle cx="8" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.4" fill="none" /><path d="M8 2v1.5M8 12.5V14M2 8h1.5M12.5 8H14M3.8 3.8l1 1M9.2 9.2l1 1M3.8 12.2l1-1M9.2 6.8l1-1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></>,
    x: <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />,
    check: <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />,
    edit: <><path d="M11 2.5l2.5 2.5L5 13.5H2.5V11L11 2.5z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" /></>,
    trash: <><path d="M3 5h10M6 5V3h4v2M5 5l1 8h4l1-8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" /></>,
    phone: <path d="M5 3h2l1 3-1.5 1.5c.8 1.8 2.2 3.2 4 4L12 10l3 1v2c0 1-1 2-2 1.5C5 12 2 4 3 3z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />,
    mail: <><rect x="2" y="4" width="12" height="9" rx="1" stroke="currentColor" strokeWidth="1.4" fill="none" /><path d="M2 4l6 5 6-5" stroke="currentColor" strokeWidth="1.4" /></>,
    qr: <><rect x="2" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.4" fill="none" /><rect x="9" y="2" width="5" height="5" stroke="currentColor" strokeWidth="1.4" fill="none" /><rect x="2" y="9" width="5" height="5" stroke="currentColor" strokeWidth="1.4" fill="none" /><path d="M9 9h1v1h-1zM11 9h3v1h-3zM9 11h2v1h-2zM11 11h3v3h-1v-2h-2z" fill="currentColor" /></>,
  };
  return (
    <svg viewBox="0 0 16 16" style={{ width: 16, height: 16, display: 'inline-block', verticalAlign: 'middle', ...style }}>
      {paths[name] || null}
    </svg>
  );
}

export function SearchBox({ placeholder = 'Cerca interventi, clienti, articoli…' }) {
  return (
    <button
      type="button"
      className="search-box"
      onClick={() => window.dispatchEvent(new Event('open-global-search'))}
      title="Cerca (Ctrl/Cmd+K)"
      style={{ cursor: 'pointer', textAlign: 'left' }}
    >
      <Icon name="search" />
      <span style={{ flex: 1 }}>{placeholder}</span>
      <span className="search-kbd mono">⌘K</span>
    </button>
  );
}

export function Topbar({ crumbs = [], right }) {
  return (
    <div className="topbar">
      <button
        type="button"
        className="hamburger"
        onClick={() => document.body.classList.toggle('sidebar-open')}
        aria-label="Apri menu"
      >☰</button>
      {crumbs.map((c, i, arr) => (
        <span key={i}>
          {i > 0 && <span className="topbar-sep" style={{ marginRight: 12 }}>/</span>}
          <span className={i === arr.length - 1 ? 'topbar-title' : 'topbar-sub'}>{c}</span>
        </span>
      ))}
      <div className="topbar-spacer" />
      <SearchBox />
      <div className="topbar-right">{right}</div>
    </div>
  );
}

export function Pill({ children, active, onClick }) {
  return (
    <span className={`pill ${active ? 'active' : ''}`} onClick={onClick}>
      {children}
    </span>
  );
}

export function Tabs({ tabs, active, onChange }) {
  return (
    <div className="tabs">
      {tabs.map(t => (
        <div
          key={t}
          className={`tab ${active === t ? 'active' : ''}`}
          onClick={() => onChange(t)}
        >
          {t}
        </div>
      ))}
    </div>
  );
}

export function KpiCard({ label, value, trend, trendDir, amber }) {
  return (
    <div className="card kpi" style={amber ? { color: 'var(--hf-amber)' } : {}}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value sm" style={amber ? { color: 'var(--hf-amber)' } : {}}>{value}</div>
      {trend && <span className={`kpi-trend ${trendDir || 'flat'}`}>{trendDir === 'up' ? '↑' : trendDir === 'down' ? '↓' : '•'} {trend}</span>}
    </div>
  );
}

export function ProgressBar({ pct, green }) {
  return (
    <div className="bar-track">
      <div className="bar-fill" style={{ width: `${pct}%`, background: green ? 'var(--hf-green)' : 'var(--hf-accent)' }} />
    </div>
  );
}
