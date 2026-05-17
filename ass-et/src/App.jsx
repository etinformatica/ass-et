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

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
