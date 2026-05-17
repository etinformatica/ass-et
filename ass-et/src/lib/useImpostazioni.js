import { useData } from './useData';
import { impostazioniApi } from './api';

// Valori usati finché le impostazioni non sono caricate (o se la tabella
// non esiste ancora). L'app resta usabile senza configurazione.
const DEFAULTS = {
  tecnico_nome: 'Tecnico',
  tecnico_ruolo: 'Tecnico · banco',
  tecnico_tone: 'violet',
};

export function useImpostazioni() {
  const { data, loading, error, reload } = useData(() => impostazioniApi.getAll(), []);
  const s = { ...DEFAULTS, ...(data || {}) };
  return {
    tecnicoNome: s.tecnico_nome || DEFAULTS.tecnico_nome,
    tecnicoRuolo: s.tecnico_ruolo || DEFAULTS.tecnico_ruolo,
    tecnicoTone: s.tecnico_tone || DEFAULTS.tecnico_tone,
    loading,
    error,
    reload,
  };
}
