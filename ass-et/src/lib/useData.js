import { useState, useEffect, useRef, useCallback } from 'react';

// Hook generico per il caricamento dati async.
// Gestisce loading/error ed espone reload() per ricaricare dopo una mutazione.
// `deps` è serializzato così la dependency list resta un array literal.
export function useData(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [tick, setTick] = useState(0);

  const fnRef = useRef(fn);
  // Aggiorna il riferimento dopo il render (consentito; non durante il render).
  useEffect(() => {
    fnRef.current = fn;
  });

  const depsKey = JSON.stringify(deps);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const res = await fnRef.current();
        if (!cancelled) setState({ data: res, loading: false, error: null });
      } catch (e) {
        if (!cancelled) setState({ data: null, loading: false, error: e });
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [depsKey, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);

  return { data: state.data, loading: state.loading, error: state.error, reload };
}
