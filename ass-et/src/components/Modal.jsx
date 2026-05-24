import { useEffect } from 'react';
import { Icon, Btn } from './UI';

export function Modal({ title, onClose, children, footer, width = 480 }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="modal-overlay"
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(24,20,16,0.45)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '60px 20px', overflowY: 'auto',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="card modal-card"
        style={{ width, maxWidth: '100%', padding: 0, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}
      >
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--hf-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 15 }}>{title}</span>
          <button className="btn ghost sm" onClick={onClose} style={{ padding: 4 }}>
            <Icon name="x" />
          </button>
        </div>
        <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {children}
        </div>
        {footer && (
          <div
            style={{
              padding: '12px 18px',
              borderTop: '1px solid var(--hf-border)',
              display: 'flex', justifyContent: 'flex-end', gap: 8,
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({ title = 'Conferma eliminazione', message, onConfirm, onClose, busy }) {
  return (
    <Modal
      title={title}
      onClose={onClose}
      width={400}
      footer={
        <>
          <Btn onClick={onClose}>Annulla</Btn>
          <Btn tone="accent" onClick={onConfirm}>{busy ? 'Elimino…' : 'Elimina'}</Btn>
        </>
      }
    >
      <div style={{ fontSize: 13, color: 'var(--hf-text-2)', lineHeight: 1.6 }}>{message}</div>
    </Modal>
  );
}

export function Field({ label, children }) {
  return (
    <label style={{ display: 'block' }}>
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}
