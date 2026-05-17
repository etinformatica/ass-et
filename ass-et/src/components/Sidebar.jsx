import { NavLink } from 'react-router-dom';
import { Icon, Avatar } from './UI';

const NAV = [
  { path: '/', label: 'Dashboard', icon: 'home', count: null },
  { path: '/accettazione', label: 'Nuova accettazione', icon: 'plus', count: null, accent: true },
  { path: '/interventi', label: 'Interventi', icon: 'list', count: '49' },
  { path: '/clienti', label: 'Clienti', icon: 'users', count: '1.2k' },
  { path: '/magazzino', label: 'Magazzino', icon: 'box', count: '3', countAccent: true },
  { path: '/contabilita', label: 'Contabilità', icon: 'euro', count: null },
  { path: '/mobile', label: 'App Mobile', icon: 'qr', count: null },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">A</div>
        <div>
          <div className="brand-name">Ass-et</div>
          <div className="brand-suffix mono">v 2.4</div>
        </div>
      </div>

      <div className="section-label">workspace</div>

      {NAV.map(({ path, label, icon, count, countAccent }) => (
        <NavLink
          key={path}
          to={path}
          end={path === '/'}
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
        >
          {({ isActive }) => (
            <>
              <Icon name={icon} style={{ color: isActive ? 'var(--hf-text)' : 'var(--hf-text-3)' }} />
              <span>{label}</span>
              {count && (
                <span className={`nav-count mono ${countAccent ? 'accent' : ''}`}>{count}</span>
              )}
            </>
          )}
        </NavLink>
      ))}

      <div className="sidebar-user">
        <Avatar name="Marco T" tone="violet" size="sm" />
        <div>
          <div className="sidebar-user-name">Marco T.</div>
          <div className="sidebar-user-role">Tecnico · banco</div>
        </div>
      </div>
    </aside>
  );
}
