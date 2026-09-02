/* ============================================================
   Studio viewer — zoom, paging, calibration, print, build.
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
  // CSS zoom, not a transform: zoom reflows, so the scrollbars stay honest.
  function applyZoom() {
    const doc = frame.contentDocument;
    const perRow = state.view === "spread" ? 2 : 1;
    const contentW = state.view === "impose"
      ? Math.max(320, stage.clientWidth - 24)
      : Math.round(sheetWidthMm() * CSS_PX_PER_MM * perRow) + 40;
    inner.style.width = contentW + "px";
    fitFrame();

    let k = 1;
    if (state.zoom === "fit") k = Math.min(1, (stage.clientWidth - 24) / contentW);
    else if (state.zoom === "actual") k = state.ppmm / CSS_PX_PER_MM;
    else k = Number(state.zoom);
    inner.style.zoom = String(k);

    for (const b of document.querySelectorAll("[data-zoom]")) {
      b.setAttribute("aria-pressed", String(b.dataset.zoom === String(state.zoom)));
    }
    $("cal-val").textContent = state.ppmm.toFixed(3) + " px/mm";
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
    if (state.view !== 'impose') set('page-count', 'textContent', 'of ' + pages.length);
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
  for (const b of document.querySelectorAll('[data-zoom]')) {
    b.onclick = () => { state.zoom = b.dataset.zoom; applyZoom(); };
  }
  const pageNo = () => Number(($('page-no') || {}).value || 0);
  on('prev', 'onclick', () => goto(pageNo() - 1));
  on('next', 'onclick', () => goto(pageNo() + 1));
  on('page-no', 'onchange', () => goto(pageNo()));
  on('print', 'onclick', () => { frame.contentWindow.focus(); frame.contentWindow.print(); });

  /* ---- calibration --------------------------------------- */
  const panel = $('cal-panel');
  $('cal-open').onclick = () => { panel.hidden = !panel.hidden; sizeCard(); };
  function sizeCard() {
    // ISO/IEC 7810 ID-1: every bank card in the world is 85.60 x 53.98 mm
    $('cal-card').style.width = (85.6 * state.ppmm) + 'px';
    $('cal-card').style.height = (53.98 * state.ppmm) + 'px';
    $('cal-range').value = String(state.ppmm);
    $('cal-val').textContent = state.ppmm.toFixed(3) + ' px/mm';
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
