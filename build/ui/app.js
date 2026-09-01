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
    $('sheet-trim').setAttribute('aria-pressed', state.sheet === 'trim');
    $('sheet-bleed').setAttribute('aria-pressed', state.sheet === 'bleed');
    $('view-pages').setAttribute('aria-pressed', state.view === 'pages');
    $('view-spread').setAttribute('aria-pressed', state.view === 'spread');
    $('view-impose').setAttribute('aria-pressed', state.view === 'impose');
    $('sig-size').hidden = state.view !== 'impose';
    // page nav and the sheet toggle mean nothing on a press sheet
    const onSheet = state.view === 'impose';
    for (const id of ['prev', 'next', 'page-no', 'sheet-trim', 'sheet-bleed']) {
      $(id).disabled = onSheet;
    }
    if (onSheet) $('page-count').textContent = '';
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
    if (doc && doc.documentElement) frame.style.height = doc.documentElement.scrollHeight + "px";

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

  frame.addEventListener('load', () => {
    applyZoom();
    countPages();
    // the book reloads itself on save; keep the frame height honest
    setTimeout(applyZoom, 400);
  });
  window.addEventListener('resize', applyZoom);

  /* ---- paging -------------------------------------------- */
  let pages = [];
  function countPages() {
    const doc = frame.contentDocument;
    pages = doc ? [...doc.querySelectorAll('.page')] : [];
    if (state.view !== 'impose') $('page-count').textContent = 'of ' + pages.length;
    $('page-no').max = pages.length;
  }
  function goto(n) {
    if (!pages.length) return;
    const i = Math.max(1, Math.min(pages.length, n)) - 1;
    const k = Number(inner.style.zoom) || 1;
    stage.scrollTop = pages[i].getBoundingClientRect().top * k - 10;
    $("page-no").value = pages[i].dataset.folio || String(i + 1);
  }

  /* ---- controls ------------------------------------------ */
  $('sheet-trim').onclick  = () => { state.sheet = 'trim';  load(); };
  $('sheet-bleed').onclick = () => { state.sheet = 'bleed'; load(); };
  $('view-pages').onclick  = () => { state.view = 'pages';  load(); };
  $('view-spread').onclick = () => { state.view = 'spread'; load(); };
  $('view-impose').onclick = () => { state.view = 'impose'; load(); };
  $('sig-size').onchange = (e) => { state.sig = Number(e.target.value); load(); };
  for (const b of document.querySelectorAll('[data-zoom]')) {
    b.onclick = () => { state.zoom = b.dataset.zoom; applyZoom(); };
  }
  $('prev').onclick = () => goto(Number($('page-no').value) - 1);
  $('next').onclick = () => goto(Number($('page-no').value) + 1);
  $('page-no').onchange = () => goto(Number($('page-no').value));
  $('print').onclick = () => { frame.contentWindow.focus(); frame.contentWindow.print(); };

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
        body: JSON.stringify({ target: cfg.target, pdf: true, bleed: true }),
      });
      const out = await r.json();
      $('build-log').textContent = out.ok ? out.summary : ('failed — ' + out.summary);
      if (out.ok) load();
    } catch (e) {
      $('build-log').textContent = 'failed — ' + e.message;
    }
    btn.textContent = was;
    btn.disabled = false;
  };

  sizeCard();
  load();
})();
