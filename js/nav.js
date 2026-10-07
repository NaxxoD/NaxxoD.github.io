/* ═══════════════════════════════
   NAV POPUP — partagé pages projet
═══════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  const indexBtn = document.querySelector('.nav-link-index');
  const popup    = document.getElementById('indexPopup');

  if (!indexBtn || !popup) return;

  indexBtn.addEventListener('click', e => {
    e.preventDefault();
    popup.classList.toggle('visible');
  });

  document.addEventListener('click', e => {
    if (!popup.contains(e.target) && !indexBtn.contains(e.target)) {
      popup.classList.remove('visible');
    }
  });
});
