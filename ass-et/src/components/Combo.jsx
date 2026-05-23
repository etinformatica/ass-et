import { useState, useRef, useEffect } from 'react';

// Input di testo con dropdown di suggerimenti. Free-text (puoi digitare
// anche valori non in lista).
//   value, onChange  → valore stringa controllato
//   options          → array di stringhe da suggerire
//   getLabel(opt)    → opzionale, default String(opt)
//   getValue(opt)    → opzionale, default String(opt) (cosa va in onChange)
//   maxShown         → quanti suggerimenti mostrare (def. 8)
export function Combo({ value, onChange, onPick, options = [], placeholder, autoFocus,
  className = 'input', style, getLabel, getValue, maxShown = 8, leftIcon }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    function onDoc(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const term = (value || '').trim().toLowerCase();
  const fmtLabel = (o) => getLabel ? getLabel(o) : String(o ?? '');
  const fmtValue = (o) => getValue ? getValue(o) : String(o ?? '');
  const filtered = options
    .filter(o => {
      const lbl = fmtLabel(o).toLowerCase();
      if (!term) return true;
      return lbl.includes(term) && lbl !== term;
    })
    .slice(0, maxShown);

  function pick(o) {
    onChange(fmtValue(o));
    if (onPick) onPick(o);
    setOpen(false);
    inputRef.current?.blur();
  }

  return (
    <div ref={ref} style={{ position: 'relative', ...style }}>
      {leftIcon && <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: 'var(--hf-text-3)', pointerEvents: 'none' }}>{leftIcon}</span>}
      <input
        ref={inputRef}
        className={className}
        value={value || ''}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        style={leftIcon ? { paddingLeft: 28 } : undefined}
      />
      {open && filtered.length > 0 && (
        <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 2, zIndex: 80,
          background: 'var(--hf-surface)', border: '1px solid var(--hf-border)', borderRadius: 6,
          boxShadow: 'var(--hf-shadow)', maxHeight: 220, overflowY: 'auto' }}>
          {filtered.map((o, i) => (
            <div
              key={i}
              onMouseDown={e => { e.preventDefault(); pick(o); }}
              style={{ padding: '6px 10px', cursor: 'pointer', fontSize: 13, borderTop: i > 0 ? '1px solid var(--hf-border)' : 'none' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--hf-accent-soft)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {fmtLabel(o)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
