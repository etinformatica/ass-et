// Stato apertura sidebar gestito tramite classe sul <body>.
// Compatibile col layout responsive: su desktop la classe non ha effetto.
export function toggleSidebar() {
  document.body.classList.toggle('sidebar-open');
}

export function closeSidebar() {
  document.body.classList.remove('sidebar-open');
}
