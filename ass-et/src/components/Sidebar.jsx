import { NavLink } from 'react-router-dom';
import { Icon, Avatar } from './UI';
import { useImpostazioni } from '../lib/useImpostazioni';

const NAV = [
  { path: '/', label: 'Dashboard', icon: 'home', count: null },
  { path: '/accettazione', label: 'Nuova accettazione', icon: 'plus', count: null, accent: true },
  { path: '/interventi', label: 'Interventi', icon: 'list', count: null },
  { path: '/clienti', label: 'Clienti', icon: 'users', count: null },
  { path: '/magazzino', label: 'Magazzino', icon: 'box', count: null },
  { path: '/contabilita', label: 'Contabilità', icon: 'euro', count: null },
  { path: '/impostazioni', label: 'Impostazioni', icon: 'settings', count: null },
];

export default function Sidebar() {
  const { tecnicoNome, tecnicoRuolo, tecnicoTone } = useImpostazioni();
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
        <Avatar name={tecnicoNome} tone={tecnicoTone} size="sm" />
        <div>
          <div className="sidebar-user-name">{tecnicoNome}</div>
          <div className="sidebar-user-role">{tecnicoRuolo}</div>
        </div>
      </div>
    </aside>
  );
}
