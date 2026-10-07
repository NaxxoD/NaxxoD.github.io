/* ═══════════════════════════════
   PROJET PAGE JS
═══════════════════════════════ */

history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ── LIGHTBOX ─────────────────────
// Images longues → nouvel onglet
const OPEN_IN_TAB = ['Benchmark', 'Patch', 'Code', 'Vuln'];

function openLightbox(el) {
  const img = el.querySelector('img');

  // Si c'est une image longue/dense → ouvrir dans un onglet
  const isLong = OPEN_IN_TAB.some(keyword => img.src.includes(keyword));
  if (isLong) {
    window.open(img.src, '_blank');
    return;
  }

  // Sinon lightbox normale
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}

// fermer avec Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeLightbox();
});
