/* ═══════════════════════════════
   PORTFOLIO — main.js
═══════════════════════════════ */

history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ─── DATA ───────────────────────────────────────────────
const BASH_LINES = [
  { prompt: '$ ', cmd: 'whoami',        output: 'arno_delort'       },
  { prompt: '$ ', cmd: 'cat status.txt',output: 'Init() → IT'       },
  { prompt: '$ ', cmd: 'ls skills/',    output: 'dev/ secu/ ux/'    },
  { prompt: '$ ', cmd: './emerge.exe',  output: '[███░░░] 42%'       },
];

const TERM_NAME_TEXT = 'Arno\nDelort';

const TERM_OUTPUT_LINES = [
  { p: '$ ', c: 'cat reconversion.log' },
  { out: '12ans restauration → init() IT' },
  { out: 'dev + sécu + expérimentation'   },
  { out: 'emerge.exe running...'          },
];

const GLOSS_ITEMS = [
  { key: 'NOM',       sep: '──────────────────', val: 'Arno Dlt',           cls: 'cyan'  },
  { key: 'STATUT',    sep: '─────────────',      val: 'Init() → IT'                      },
  { key: 'FORMATION', sep: '────────────',        val: 'Learning'                         },
  { key: 'SPÉC.',     sep: '────────────────',   val: 'Search In Progress'               },
  { key: 'LOAD',      sep: '───────────────',    val: '███░░░░ 28%',        cls: 'green' },
];

// ─── TYPEWRITER ─────────────────────────────────────────
function typeWriter(el, text, speed = 40) {
  return new Promise(resolve => {
    let i = 0;
    el.textContent = '';
    const interval = setInterval(() => {
      el.textContent += text[i];
      i++;
      if (i >= text.length) {
        clearInterval(interval);
        resolve();
      }
    }, speed);
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── HERO INIT ──────────────────────────────────────────
async function initHero() {
  await sleep(400);

  // 1. BASH — lignes une par une
  const bashContainer = document.getElementById('bashLines');
  for (const line of BASH_LINES) {
    const div = document.createElement('div');
    div.classList.add('bash-line');
    div.innerHTML = `<span class="p">${line.prompt}</span><span class="c">${line.cmd}</span>`;
    bashContainer.appendChild(div);

    await sleep(80);
    div.classList.add('visible');
    await sleep(200);

    if (line.output) {
      const out = document.createElement('span');
      out.classList.add('o');
      div.appendChild(out);
      await typeWriter(out, line.output, 25);
    }

    await sleep(120);
  }

  // curseur bash
  const cursorDiv = document.createElement('div');
  cursorDiv.classList.add('bash-line', 'visible');
  cursorDiv.innerHTML = `<span class="p">$ </span><span class="cursor-blink"></span>`;
  bashContainer.appendChild(cursorDiv);

  await sleep(300);

  // 2. TERMINAL — nom en typewriter
  const termName = document.getElementById('termName');
  await typeWriter(termName, 'Arno\nDelort', 60);

  await sleep(200);

  // output terminal
  const termOutput = document.getElementById('termOutput');
  for (const line of TERM_OUTPUT_LINES) {
    const p = document.createElement('p');
    if (line.p) {
      p.innerHTML = `<span class="p">${line.p}</span><span class="c">${line.c}</span>`;
      termOutput.appendChild(p);
      await sleep(100);
    } else {
      p.style.paddingLeft = '14px';
      p.style.color = 'rgba(255,255,255,0.45)';
      p.style.fontSize = '10px';
      termOutput.appendChild(p);
      await typeWriter(p, line.out, 18);
    }
    await sleep(80);
  }

  await sleep(400);

  // 3. GLOSSAIRE — rows en cascade style bloc
  const glossContainer = document.getElementById('glossBlock');
  for (const item of GLOSS_ITEMS) {
    const div = document.createElement('div');
    div.classList.add('gloss-row');
    div.innerHTML = `
      <span class="gloss-key">${item.key}</span>
      <span class="gloss-sep">${item.sep}</span>
      <span class="gloss-val ${item.cls || ''}">${item.val}</span>
    `;
    glossContainer.appendChild(div);
    await sleep(50);
    div.classList.add('visible');
    await sleep(160);
  }

  await sleep(500);

  // 4. WDK bar apparaît
  document.getElementById('heroWdk').classList.add('visible');
}

// ─── TRACKER MOUSE ──────────────────────────────────────
function initTracker() {
  const grid     = document.getElementById('trackerGrid');
  const hero     = document.querySelector('.hero');
  const COLS     = 30;
  const ROWS     = 16;
  const cells    = [];
  const heat     = new Array(COLS * ROWS).fill(0);

  for (let i = 0; i < COLS * ROWS; i++) {
    const cell = document.createElement('div');
    cell.classList.add('tracker-cell');
    grid.appendChild(cell);
    cells.push(cell);
  }

  function setHeat(col, row, val) {
    if (col < 0 || col >= COLS || row < 0 || row >= ROWS) return;
    const idx = row * COLS + col;
    heat[idx] = Math.max(heat[idx], val);
  }

  function tick() {
    for (let i = 0; i < cells.length; i++) {
      heat[i] *= 0.96;
      const h = heat[i];
      cells[i].classList.remove('hot', 'warm', 'cool');
      if      (h > 0.65) cells[i].classList.add('hot');
      else if (h > 0.3)  cells[i].classList.add('warm');
      else if (h > 0.08) cells[i].classList.add('cool');
    }
    requestAnimationFrame(tick);
  }
  tick();

  const coordX = document.getElementById('coordX');
  const coordY = document.getElementById('coordY');
  const cicada = document.getElementById('cicadaAscii');
  const wdkText = document.getElementById('wdkText');

  hero.addEventListener('mousemove', e => {
    const rect   = hero.getBoundingClientRect();
    const xRatio = (e.clientX - rect.left)  / rect.width;
    const yRatio = (e.clientY - rect.top)   / rect.height;
    const col    = Math.floor(xRatio * COLS);
    const row    = Math.floor(yRatio * ROWS);

    for (let dc = -2; dc <= 2; dc++) {
      for (let dr = -2; dr <= 2; dr++) {
        const dist = Math.sqrt(dc * dc + dr * dr);
        setHeat(col + dc, row + dr, Math.max(0, 1 - dist * 0.4));
      }
    }

    // cicada reveal sur la zone terminal
    if (xRatio > 0.2 && xRatio < 0.8) {
      cicada.classList.add('visible');
    } else {
      cicada.classList.remove('visible');
    }

    // WDK reveal en bas
    if (yRatio > 0.75) {
      wdkText.classList.add('revealed');
    } else {
      wdkText.classList.remove('revealed');
    }
  });

  hero.addEventListener('mouseleave', () => {
    cicada.classList.remove('visible');
    wdkText.classList.remove('revealed');
    coordX.textContent = '000';
    coordY.textContent = '000';
  });
}

// ─── CONTACT MAILTO ─────────────────────────────────────
function initContact() {
  const btn     = document.getElementById('sendBtn');
  const mail    = document.getElementById('inputMail');
  const sujet   = document.getElementById('inputSujet');
  const message = document.getElementById('inputMessage');
  const EMAIL   = 'arno.dlt@pm.me';

  if (!btn) return;

  btn.addEventListener('click', () => {
    const s = sujet.value.trim()   || 'Contact depuis portfolio';
    const m = message.value.trim() || '';

    if (!m) {
      btn.textContent = '[ Corps vide — message non envoyé ]';
      setTimeout(() => { btn.textContent = '[ Envoyer ]'; }, 2000);
      return;
    }

    const link = 'mailto:' + EMAIL
      + '?subject=' + encodeURIComponent(s)
      + '&body='    + encodeURIComponent(m);

    window.location.href = link;
    btn.textContent = '[ Message ouvert dans votre client mail ]';
    setTimeout(() => { btn.textContent = '[ Envoyer ]'; }, 3000);
  });
}

const indexBtn = document.querySelector('a[href="#projets"].nav-link');
const popup = document.getElementById('indexPopup');

indexBtn.addEventListener('click', e => {
  e.preventDefault();
  popup.classList.toggle('visible');
});

document.addEventListener('click', e => {
  if (!popup.contains(e.target) && !indexBtn.contains(e.target)) {
    popup.classList.remove('visible');
  }
});

function scrollToTop() {
  window.scrollTo(0, 0);
}

// ─── NAV ACTIVE ─────────────────────────────────────────
function initNavActive() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        links.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

// ─── BOOT ────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initTracker();
  initHero();
  initContact();
  initNavActive();
  initProjets();
});

function initProjets() {
  document.querySelectorAll('.projet-item').forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.target;
      window.location.href = `projets/${target}.html`;
    });
  });
}
