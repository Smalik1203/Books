/* ============================================================
   Studio viewer — zoom, paging, calibration, build.

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
  /* A cover is one sheet, not a run of pages, so its bar carries neither
     pager nor spread. Rather than a second viewer that would drift from
     this one, every control a cover leaves out is reached through these
     — absent means nothing to do, not a crash. */
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
    ppmm: Number(localStorage.getItem('ll.ppmm')) || CSS_PX_PER_MM,
  };

  /* ---- loading the book ---------------------------------- */
  function src() {
    const base = state.sheet === 'bleed' ? cfg.bleedUrl : cfg.trimUrl;
    return base + (state.view === 'spread' ? '?view=spread' : '');
  }
  function load() {
    frame.src = src();
    /* Trim is what the reader gets and what the viewer opens on, so
       there is no button for it: Bleed is a switch, and off means
       trim. A pressed pair where one of them was always the answer
       was two controls doing one control's work. */
    press('sheet-bleed', state.sheet === 'bleed');
    press('view-spread', state.view === 'spread');
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
      const sheetH = sheetHeightMm() * CSS_PX_PER_MM + 40;
      return Math.min(padW / contentW, (stage.clientHeight - 24) / sheetH);
    }
    if (state.zoom === 'actual') return state.ppmm / CSS_PX_PER_MM;
    return Number(state.zoom);
  }

  // CSS zoom, not a transform: zoom reflows, so the scrollbars stay honest.
  function applyZoom() {
    const perRow = state.view === "spread" ? 2 : 1;
    const contentW = Math.round(sheetWidthMm() * CSS_PX_PER_MM * perRow) + 40;
    inner.style.width = contentW + "px";
    fitFrame();

    const k = Math.max(ZOOMS[0], Math.min(ZOOMS[ZOOMS.length - 1], factor(contentW)));
    inner.style.zoom = String(k);
    state.k = k;

    set('zoom-level', 'textContent', Math.round(k * 100) + '%');
    set('zoom-out', 'disabled', k <= ZOOMS[0] + 1e-9);
    set('zoom-in', 'disabled', k >= ZOOMS[ZOOMS.length - 1] - 1e-9);
    fitIcon();
    for (const b of document.querySelectorAll('[data-zoom]')) {
      b.setAttribute('aria-checked', String(b.dataset.zoom === String(state.zoom)));
    }
    calState();
    at = [];                 // every page offset just moved with the zoom
    syncPage();
  }

  /* The fit button shows the mode it is in, not the mode it would give:
     a sheet with the arrows running down it for fit to page, across it
     for fit to width, and the tooltip saying the same thing the picture
     does. A control that names its own opposite has to be read twice.

     At a fixed percentage neither fit is in force, so it shows the page
     icon unpressed — which is also what clicking will give, since the
     toggle returns to fit to page from anywhere that is not fit to
     width. */
  function fitIcon() {
    const wide = state.zoom === 'fitw';
    for (const svg of document.querySelectorAll('#fit-toggle svg')) {
      /* toggleAttribute, not .hidden. `hidden` is an IDL property of
         HTMLElement and an SVG element is not one, so `svg.hidden = true`
         quietly sets a JavaScript expando and leaves the attribute — and
         the CSS that keys off it — untouched. The two icons came out
         exactly inverted, and a check that read `.hidden` back agreed
         with itself and passed. */
      svg.toggleAttribute('hidden', (svg.dataset.fit === 'fitw') !== wide);
    }
    press('fit-toggle', state.zoom === 'fit' || wide);
    set('fit-toggle', 'title', wide
      ? 'Fit to width — click for fit to page'
      : 'Fit to page — click for fit to width');
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
    wireKeys(frame.contentDocument);   // a fresh document, listening to nothing
    // the book reloads itself on save; keep the frame height honest
    setTimeout(applyZoom, 400);
  });
  window.addEventListener('resize', applyZoom);

  /* ---- paging -------------------------------------------- */
  let pages = [];
  function countPages() {
    const doc = frame.contentDocument;
    pages = doc ? [...doc.querySelectorAll('.page')] : [];
    at = [];
    set('page-count', 'textContent', '/ ' + pages.length);
    set('page-no', 'max', pages.length);
  }
  /* Where each page starts, measured down the stage. A page's rect is
     taken inside the iframe, which does not scroll — it is laid out at
     its full height — so the top is its offset into the book, and the
     zoom is what turns that into stage pixels.

     Cached, and remeasured when the zoom or the book changes. It is
     read on every scroll event, and reaching across into another
     document twenty-eight times a frame to learn what has not moved is
     work for nothing. */
  let at = [];
  function measurePages() {
    const k = Number(inner.style.zoom) || 1;
    at = pages.map((el) => el.getBoundingClientRect().top * k);
  }
  const showPage = (i) =>
    set('page-no', 'value', (pages[i] && pages[i].dataset.folio) || String(i + 1));

  function goto(n) {
    if (!pages.length) return;
    if (at.length !== pages.length) measurePages();
    const i = Math.max(1, Math.min(pages.length, n)) - 1;
    stage.scrollTop = at[i] - 10;
    showPage(i);
  }

  /* Which page the stage is actually showing. Without this the box says
     1 all the way to the end of the chapter as soon as you scroll or
     arrow rather than type — which is what made the arrow keys feel as
     though they had done nothing.

     Synchronous, deliberately. The first version threw the work into
     requestAnimationFrame behind a busy flag, and a background tab
     suspends rAF: the flag never cleared and the counter stuck at
     whatever page it was on when the tab lost focus. Scroll events are
     already coalesced to the frame, and a scan of a cached array is
     nothing. */
  function syncPage() {
    if (!pages.length) return;
    if (at.length !== pages.length) measurePages();
    const y = stage.scrollTop + 24;
    let i = 0;
    while (i + 1 < at.length && at[i + 1] <= y) i++;
    showPage(i);
  }
  stage.addEventListener('scroll', syncPage, { passive: true });

  /* ---- controls ------------------------------------------ */
  on('sheet-bleed', 'onclick', () => {
    state.sheet = state.sheet === 'bleed' ? 'trim' : 'bleed';
    load();
  });
  /* Both switches, both off by default, and neither with a button for
     the state it is already in: pages is the view a chapter opens on
     and the trim is the sheet it opens on. */
  on('view-spread', 'onclick', () => {
    state.view = state.view === 'spread' ? 'pages' : 'spread';
    load();
  });

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
  /* Fit to width from fit to page, and fit to page from anywhere else —
     so the button is a way back from a percentage as well as a toggle
     between the two fits. */
  on('fit-toggle', 'onclick', () => setZoom(state.zoom === 'fit' ? 'fitw' : 'fit'));
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
  function onZoomKey(e) {
    if (typing()) return;
    if (e.key === 'Escape') { closeMenu(); closeCal(); return; }
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.key === '=' || e.key === '+') { e.preventDefault(); step(1); }
    else if (e.key === '-' || e.key === '_') { e.preventDefault(); step(-1); }
    else if (e.key === '0') { e.preventDefault(); setZoom('fit'); }
  }
  const pageNo = () => Number(($('page-no') || {}).value || 0);
  on('page-no', 'onchange', () => goto(pageNo()));
  /* Reading the book from the keyboard.

     The ‹ › buttons went when the cluster took Chrome's shape, and
     Chrome has no such pair either — it pages with the keyboard. But
     the book is in an iframe, and the thing that scrolls is the stage
     around it, so nothing here has focus by default and the arrow keys
     did nothing at all. They are answered here rather than left to the
     browser, which is also why they can be given Chrome's meanings:
     up and down scroll, left and right turn the page. */
  const LINE = 64;                                   // about three lines, at fit

  /* Whether a key belongs to a field rather than to the book. Read from
     whichever document has focus, since these handlers run in two. */
  const typing = () => {
    for (const doc of [document, frame.contentDocument]) {
      const el = doc && doc.activeElement;
      if (el && /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) return true;
    }
    return false;
  };
  /* The counter is brought up to date here rather than left to the
     scroll event. The event is dispatched on a rendering step, so a
     window that is not being painted — hidden, minimised, behind
     another — delivers none of them, and the box would sit on the page
     it was on when the window went away. The listener stays for the
     wheel; the keys do not need it. */
  const scrollBy = (dy) => { stage.scrollTop += dy; syncPage(); };

  /* Whether there is anywhere left to go sideways in that direction.
     Not merely "is the content wider than the stage": at 200% it always
     is, so left and right used to scroll for ever and never turn a page
     — the far edge was a dead end. Asked this way they scroll while
     there is something to scroll to and turn the page at the margin,
     which is what they do in any reader. */
  const roomX = (dir) => {
    const max = stage.scrollWidth - stage.clientWidth;
    if (max <= 1) return false;
    return dir > 0 ? stage.scrollLeft < max - 1 : stage.scrollLeft > 1;
  };

  function onReadKey(e) {
    if (typing()) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const screenful = stage.clientHeight * 0.9;
    switch (e.key) {
      case 'ArrowDown':  scrollBy(LINE); break;
      case 'ArrowUp':    scrollBy(-LINE); break;
      case 'PageDown':   goto(pageNo() + 1); break;
      case 'PageUp':     goto(pageNo() - 1); break;
      case ' ':          e.shiftKey ? scrollBy(-screenful) : scrollBy(screenful); break;
      case 'Home':       goto(1); break;
      case 'End':        goto(pages.length); break;
      case 'ArrowRight':
        if (roomX(1)) stage.scrollLeft += LINE; else goto(pageNo() + 1);
        break;
      case 'ArrowLeft':
        if (roomX(-1)) stage.scrollLeft -= LINE; else goto(pageNo() - 1);
        break;
      default: return;
    }
    e.preventDefault();
  }

  /* Both handlers go on both documents. A key is delivered to whichever
     document has focus, and one click on the book moves that into the
     iframe — after which every one of these went to the book's own
     document, which listens for nothing, and the keyboard was simply
     dead until the reader thought to click the toolbar. The book's
     document is replaced on every load, so this is done again there. */
  function wireKeys(doc) {
    if (!doc) return;
    doc.addEventListener('keydown', onZoomKey);
    doc.addEventListener('keydown', onReadKey);
  }
  wireKeys(document);
  /* What the last build came to, and only while there is something to
     say. It used to be a permanent strip under the bar. */
  function say(text, bad) {
    const el = $('build-log');
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('bar__log--bad', !!bad);
    el.hidden = !text;
    el.title = text;
  }

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
      say(out.ok ? out.summary : ('failed — ' + out.summary), !out.ok);
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
      say('failed — ' + e.message, true);
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
    say('Not built yet — press Build.', true);
  });

  sizeCard();
  load();
})();
