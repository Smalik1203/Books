/* ============================================================
   Studio viewer — zoom, paging, calibration, print, build.

   The zoom cluster is Chrome's PDF toolbar: minus, the level, plus,
   and a fit toggle, with the presets behind the level. It replaced
   four preset buttons and a Calibrate that read as broken — because
   until the screen is calibrated, Actual size and 100% are the same
   button pressed twice, and nothing said so. The menu says so now,
   and "fit" fits the page rather than only its width.
   The book itself lives in an iframe so its stylesheet and this
   one can never reach each other.
   ============================================================ */
(() => {
  const cfg = JSON.parse(document.getElementById('cfg').textContent);
  const frame = document.getElementById('frame');
  const inner = document.getElementById('inner');
  const stage = document.getElementById('stage');
  const $ = (id) => document.getElementById(id);
  /* A cover is one sheet, not a run of pages, so its bar carries no pager,
     no spread and no signature. Rather than a second viewer that would
     drift from this one, every control that a cover leaves out is reached
     through these — absent means nothing to do, not a crash. */
  const set = (id, attr, val) => { const el = $(id); if (el) el[attr] = val; };
  const press = (id, val) => { const el = $(id); if (el) el.setAttribute('aria-pressed', val); };
  const on = (id, ev, fn) => { const el = $(id); if (el) el[ev] = fn; };

  const CSS_PX_PER_MM = 96 / 25.4;                 // what the browser assumes
  // Chrome's own ladder, which is what the + and − buttons step along.
  const ZOOMS = [0.25, 0.33, 0.5, 0.67, 0.75, 0.9, 1, 1.1, 1.25, 1.5, 1.75, 2, 2.5, 3];
  const state = {
    sheet: 'trim',
    view: 'pages',
    zoom: 'fit',
    sig: 32,
    ppmm: Number(localStorage.getItem('ll.ppmm')) || CSS_PX_PER_MM,
  };

  /* ---- loading the book ---------------------------------- */
  function src() {
    if (state.view === 'impose') return cfg.imposeUrl + '?sig=' + state.sig;
    const base = state.sheet === 'bleed' ? cfg.bleedUrl : cfg.trimUrl;
    return base + (state.view === 'spread' ? '?view=spread' : '');
  }
  function load() {
    frame.src = src();
    press('sheet-trim', state.sheet === 'trim');
    press('sheet-bleed', state.sheet === 'bleed');
    press('view-pages', state.view === 'pages');
    press('view-spread', state.view === 'spread');
    press('view-impose', state.view === 'impose');
    set('sig-size', 'hidden', state.view !== 'impose');
    // page nav and the sheet toggle mean nothing on a press sheet
    const onSheet = state.view === 'impose';
    for (const id of ['prev', 'next', 'page-no', 'sheet-trim', 'sheet-bleed']) {
      set(id, 'disabled', onSheet);
    }
    if (onSheet) set('page-count', 'textContent', '');
  }

  /* ---- sizing -------------------------------------------- */
  function sheetWidthMm() {
    return state.sheet === 'bleed' ? cfg.mediaW : cfg.trimW;
  }
  function sheetHeightMm() {
    return state.sheet === 'bleed' ? cfg.mediaH : cfg.trimH;
  }

  /* What the level actually comes to, for each of the four kinds it
     can be. "fit" is the whole sheet inside the stage — width and
     height both — which is what fit to page means and what this
     used to get wrong: it fitted the width and capped at 100%, so a
     tall page still ran off the bottom. */
  function factor(contentW) {
    const padW = stage.clientWidth - 24;
    if (state.zoom === 'fitw') return padW / contentW;
    if (state.zoom === 'fit') {
      const perRow = state.view === 'spread' ? 2 : 1;
      const sheetH = sheetHeightMm() * CSS_PX_PER_MM + 40;
      return state.view === 'impose'
        ? Math.min(1, padW / contentW)
        : Math.min(padW / contentW, (stage.clientHeight - 24) / sheetH);
    }
    if (state.zoom === 'actual') return state.ppmm / CSS_PX_PER_MM;
    return Number(state.zoom);
  }

  // CSS zoom, not a transform: zoom reflows, so the scrollbars stay honest.
  function applyZoom() {
    const perRow = state.view === "spread" ? 2 : 1;
    const contentW = state.view === "impose"
      ? Math.max(320, stage.clientWidth - 24)
      : Math.round(sheetWidthMm() * CSS_PX_PER_MM * perRow) + 40;
    inner.style.width = contentW + "px";
    fitFrame();

    const k = Math.max(ZOOMS[0], Math.min(ZOOMS[ZOOMS.length - 1], factor(contentW)));
    inner.style.zoom = String(k);
    state.k = k;

    set('zoom-level', 'textContent', Math.round(k * 100) + '%');
    set('zoom-out', 'disabled', k <= ZOOMS[0] + 1e-9);
    set('zoom-in', 'disabled', k >= ZOOMS[ZOOMS.length - 1] - 1e-9);
    press('fit-toggle', state.zoom === 'fitw');
    set('fit-toggle', 'title', state.zoom === 'fitw' ? 'Fit to page' : 'Fit to width');
    for (const b of document.querySelectorAll('[data-zoom]')) {
      b.setAttribute('aria-checked', String(b.dataset.zoom === String(state.zoom)));
    }
    calState();
  }

  /* Until the screen is calibrated, Actual size and 100% are the same
     button pressed twice — which is why the old Calibrate read as
     broken. Say which of the two it is. */
  function calState() {
    const cal = Math.abs(state.ppmm - CSS_PX_PER_MM) > 1e-6;
    set('cal-state', 'textContent', cal ? 'calibrated' : '96 dpi');
    const v = $('cal-val');
    if (v) v.textContent = state.ppmm.toFixed(3) + ' px/mm';
  }

  // The book keeps growing after load — webfonts arrive, KaTeX lays out,
  // a save reloads it. Measured once, the iframe ends up a few pixels
  // short and grows a second scrollbar inside the one the stage already
  // has. Watch it instead.
  let watching = null;
  function fitFrame() {
    const doc = frame.contentDocument;
    if (!doc || !doc.documentElement) return;
    frame.style.height = doc.documentElement.scrollHeight + "px";
  }
  function watchFrame() {
    const doc = frame.contentDocument;
    if (!doc || !doc.documentElement) return;
    if (watching) watching.disconnect();
    watching = new ResizeObserver(fitFrame);
    watching.observe(doc.documentElement);
    if (doc.fonts) doc.fonts.ready.then(fitFrame);
  }

  frame.addEventListener('load', () => {
    applyZoom();
    countPages();
    watchFrame();
    // the book reloads itself on save; keep the frame height honest
    setTimeout(applyZoom, 400);
  });
  window.addEventListener('resize', applyZoom);

  /* ---- paging -------------------------------------------- */
  let pages = [];
  function countPages() {
    const doc = frame.contentDocument;
    pages = doc ? [...doc.querySelectorAll('.page')] : [];
    if (state.view !== 'impose') set('page-count', 'textContent', '/ ' + pages.length);
    set('page-no', 'max', pages.length);
  }
  function goto(n) {
    if (!pages.length) return;
    const i = Math.max(1, Math.min(pages.length, n)) - 1;
    const k = Number(inner.style.zoom) || 1;
    stage.scrollTop = pages[i].getBoundingClientRect().top * k - 10;
    set('page-no', 'value', pages[i].dataset.folio || String(i + 1));
  }

  /* ---- controls ------------------------------------------ */
  on('sheet-trim', 'onclick',  () => { state.sheet = 'trim';  load(); });
  on('sheet-bleed', 'onclick', () => { state.sheet = 'bleed'; load(); });
  on('view-pages', 'onclick',  () => { state.view = 'pages';  load(); });
  on('view-spread', 'onclick', () => { state.view = 'spread'; load(); });
  on('view-impose', 'onclick', () => { state.view = 'impose'; load(); });
  on('sig-size', 'onchange', (e) => { state.sig = Number(e.target.value); load(); });

  /* ---- zoom ---------------------------------------------- */
  const menu = $('zoom-menu');
  const closeMenu = () => { if (menu) { menu.hidden = true; set('zoom-level', 'ariaExpanded', 'false'); } };
  const closeCal = () => { const p = $('cal-panel'); if (p) p.hidden = true; };

  function setZoom(z) { state.zoom = z; applyZoom(); closeMenu(); }

  /* Stepping starts from where the level actually is, not from the
     last preset chosen — so + from "fit to page" at 63% goes to 67%
     and not to some remembered 100%. */
  function step(dir) {
    const k = state.k || 1;
    const next = dir > 0
      ? ZOOMS.find((z) => z > k + 1e-6)
      : [...ZOOMS].reverse().find((z) => z < k - 1e-6);
    if (next) setZoom(String(next));
  }
  on('zoom-out', 'onclick', () => step(-1));
  on('zoom-in', 'onclick', () => step(1));
  on('fit-toggle', 'onclick', () => setZoom(state.zoom === 'fitw' ? 'fit' : 'fitw'));
  on('zoom-level', 'onclick', (e) => {
    e.stopPropagation();
    closeCal();
    menu.hidden = !menu.hidden;
    set('zoom-level', 'ariaExpanded', String(!menu.hidden));
  });
  for (const b of document.querySelectorAll('[data-zoom]')) {
    b.onclick = () => setZoom(b.dataset.zoom);
  }
  document.addEventListener('click', (e) => {
    if (!e.target.closest || !e.target.closest('.zoom')) { closeMenu(); closeCal(); }
  });

  /* The shortcuts Chrome answers to, so the hands do not have to move.
     Not while a page number is being typed. */
  document.addEventListener('keydown', (e) => {
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
    if (e.key === 'Escape') { closeMenu(); closeCal(); return; }
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.key === '=' || e.key === '+') { e.preventDefault(); step(1); }
    else if (e.key === '-' || e.key === '_') { e.preventDefault(); step(-1); }
    else if (e.key === '0') { e.preventDefault(); setZoom('fit'); }
  });
  const pageNo = () => Number(($('page-no') || {}).value || 0);
  on('prev', 'onclick', () => goto(pageNo() - 1));
  on('next', 'onclick', () => goto(pageNo() + 1));
  on('page-no', 'onchange', () => goto(pageNo()));
  on('print', 'onclick', () => { frame.contentWindow.focus(); frame.contentWindow.print(); });

  /* ---- calibration --------------------------------------- */
  const panel = $('cal-panel');
  on('cal-open', 'onclick', (e) => {
    e.stopPropagation();
    closeMenu();
    panel.hidden = !panel.hidden;
    sizeCard();
  });
  on('cal-done', 'onclick', () => { closeCal(); setZoom('actual'); });
  function sizeCard() {
    // ISO/IEC 7810 ID-1: every bank card in the world is 85.60 x 53.98 mm
    $('cal-card').style.width = (85.6 * state.ppmm) + 'px';
    $('cal-card').style.height = (53.98 * state.ppmm) + 'px';
    $('cal-range').value = String(state.ppmm);
    calState();
  }
  $('cal-range').oninput = (e) => {
    state.ppmm = Number(e.target.value);
    localStorage.setItem('ll.ppmm', String(state.ppmm));
    sizeCard();
    if (state.zoom === 'actual') applyZoom();
  };
  $('cal-reset').onclick = () => {
    state.ppmm = CSS_PX_PER_MM;
    localStorage.removeItem('ll.ppmm');
    sizeCard();
    if (state.zoom === 'actual') applyZoom();
  };

  /* ---- build --------------------------------------------- */
  $('build').onclick = async () => {
    const btn = $('build');
    btn.disabled = true;
    const was = btn.textContent;
    btn.textContent = 'Building…';
    try {
      const r = await fetch('/api/build', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: cfg.target, kind: cfg.kind, pdf: true, bleed: true }),
      });
      const out = await r.json();
      $('build-log').textContent = out.ok ? out.summary : ('failed — ' + out.summary);
      if (out.ok) {
        load();
        // the artefacts the page was rendered without now exist
        document.querySelectorAll('a.btn--off').forEach((a) => {
          a.classList.remove('btn--off');
          a.removeAttribute('aria-disabled');
          a.removeAttribute('title');
        });
        const bleed = $('sheet-bleed');
        if (bleed) { bleed.disabled = false; bleed.removeAttribute('title'); }
      }
    } catch (e) {
      $('build-log').textContent = 'failed — ' + e.message;
    }
    btn.textContent = was;
    btn.disabled = false;
  };

  /* A greyed-out download link is still a link. Without this the browser
     follows it, saves the 404 body, and the download history fills up with
     plausible-looking .txt files. */
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[aria-disabled="true"]');
    if (!a) return;
    e.preventDefault();
    $('build-log').textContent = 'Not built yet — press Build.';
  });

  sizeCard();
  load();
})();
