import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Interventi from './pages/Interventi';
import Dettaglio from './pages/Dettaglio';
import Accettazione from './pages/Accettazione';
import Clienti from './pages/Clienti';
import Magazzino from './pages/Magazzino';
import Contabilita from './pages/Contabilita';
import Impostazioni from './pages/Impostazioni';
import Login from './pages/Login';
import StampaScontrino from './pages/StampaScontrino';
import StampaEtichetta from './pages/StampaEtichetta';
import { useSession } from './lib/useSession';
import { SUPABASE_CONFIGURED } from './lib/supabase';
import { Loading, ConfigNotice } from './components/States';

export default function App() {
  return (
    <BrowserRouter>
      <Gate />
    </BrowserRouter>
  );
}

function Gate() {
  const session = useSession();

  if (!SUPABASE_CONFIGURED)
    return <div className="content" style={{ minHeight: '100vh' }}><ConfigNotice /></div>;

  if (session === undefined)
    return <div style={{ minHeight: '100vh', display: 'flex' }}><Loading label="Verifica accesso…" /></div>;

  if (!session) return <Login />;

  return (
    <Routes>
      <Route path="/interventi/:id/scontrino" element={<StampaScontrino />} />
      <Route path="/interventi/:id/etichetta" element={<StampaEtichetta />} />
      <Route
        path="*"
        element={
          <div className="app-shell">
            <Sidebar />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/interventi" element={<Interventi />} />
              <Route path="/interventi/:id" element={<Dettaglio />} />
              <Route path="/accettazione" element={<Accettazione />} />
              <Route path="/clienti" element={<Clienti />} />
              <Route path="/magazzino" element={<Magazzino />} />
              <Route path="/contabilita" element={<Contabilita />} />
              <Route path="/impostazioni" element={<Impostazioni />} />
            </Routes>
          </div>
        }
      />
    </Routes>
  );
}
