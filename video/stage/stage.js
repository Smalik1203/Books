/* The stage runtime. Every video is one page and one function,
   seek(t): given a time in seconds it sets every animated element to
   where it is at that moment, from nothing. There is no clock and no
   CSS transition, so frame 1,000 comes out the same whether it is
   rendered first or last — which is what lets render.mjs capture the
   page one frame at a time and still get a smooth film.

   The timeline arrives as window.TIMELINE, worked out in render.mjs
   from the narration: a list of actions, each with an absolute start.
   An action names a selector and writes only its own properties, so a
   fade-in and a later move on one element do not fight. Before an
   action starts it writes nothing — unless it is the first thing to
   touch that property on that element, in which case it sets the
   starting state (a dot that pops in at 5s is invisible at 0s). */

(function () {
  const clamp = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
  const ease = {
    out: (p) => 1 - Math.pow(1 - p, 3),
    inout: (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2),
    back: (p) => { const c = 1.9; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); },
    linear: (p) => p,
  };

  /* Each kind: the properties it owns, and what it writes at progress p. */
  const KINDS = {
    fadeUp:  { props: ['op', 'ty'], apply: (s, p) => { s.op = p; s.ty = (1 - p) * 28; } },
    fadeIn:  { props: ['op'],       apply: (s, p) => { s.op = p; } },
    fadeOut: { props: ['op'],       apply: (s, p) => { s.op = 1 - p; }, first: 1 },
    dim:     { props: ['op'],       apply: (s, p, o) => { s.op = 1 - p * (1 - (o.to ?? 0.25)); }, first: 1 },
    pop:     { props: ['op', 'sc'], apply: (s, p) => { s.op = clamp(p * 3); s.sc = p; }, ease: 'back' },
    pulse:   { props: ['pz'],       apply: (s, p, o) => { s.pz = 1 + Math.sin(Math.PI * p) * (o.by ?? 0.18); }, ease: 'linear', first: 1 },
    draw:    { props: ['dash'],     apply: (s, p) => { s.dash = 1 - p; }, ease: 'inout' },
    wipe:    { props: ['clip'],     apply: (s, p) => { s.clip = (1 - p) * 100; }, ease: 'inout' },
    move:    { props: ['mx', 'my'], apply: (s, p, o) => { s.mx = (o.x ?? 0) * p; s.my = (o.y ?? 0) * p; }, ease: 'inout', first: 1 },
    count:   { props: ['text'],     apply: (s, p, o) => { s.text = String(Math.round(o.from + (o.to - o.from) * p)); }, ease: 'linear' },
  };

  const actions = (window.TIMELINE || []).map((a, n) => {
    const els = Array.from(document.querySelectorAll(a.s));
    if (!els.length) console.warn('no element for', a.s);
    return { ...a, n, els };
  }).sort((x, y) => x.start - y.start || x.n - y.n);

  const touched = new Set();
  for (const a of actions) for (const el of a.els) touched.add(el);
  for (const el of touched) {
    if (el instanceof SVGGeometryElement) el.setAttribute('pathLength', '1');
  }

  function seek(t) {
    const state = new Map();
    const seen = new Map();
    for (const el of touched) {
      state.set(el, { op: 1, ty: 0, sc: 1, pz: 1, mx: 0, my: 0, dash: null, clip: null, text: null, cls: {} });
      seen.set(el, new Set());
    }
    for (const a of actions) {
      a.els.forEach((el, i) => {
        const s = state.get(el), done = seen.get(el);
        const start = a.start + i * (a.stagger || 0);
        if (a.a === 'cls' || a.a === 'uncls') {
          const key = 'cls:' + a.c;
          if (t < start && done.has(key)) return;
          s.cls[a.c] = a.a === 'cls' ? t >= start : t < start;
          done.add(key);
          return;
        }
        const k = KINDS[a.a];
        if (!k) return;
        if (t < start) {
          /* A kind marked `first` leaves the element as it was before it
             starts (a fade-out does not hide a thing ahead of time). */
          if (k.first || k.props.every((p) => done.has(p))) return;
        }
        const p = (ease[a.ease || k.ease || 'out'])(clamp((t - start) / (a.dur || 0.6)));
        k.apply(s, p, a);
        k.props.forEach((p) => done.add(p));
      });
    }
    for (const [el, s] of state) {
      el.style.opacity = s.op;
      const tx = s.mx, ty = s.ty + s.my, sc = s.sc * s.pz;
      el.style.transform = (tx || ty || sc !== 1) ? `translate(${tx}px, ${ty}px) scale(${sc})` : '';
      if (s.dash !== null) { el.style.strokeDasharray = '1 1'; el.style.strokeDashoffset = s.dash; }
      if (s.clip !== null) el.style.clipPath = `inset(-10% ${s.clip}% -10% -2%)`;
      if (s.text !== null) el.textContent = s.text;
      for (const c in s.cls) el.classList.toggle(c, s.cls[c]);
    }
  }
  window.seek = seek;
  seek(0);

  /* Open the page with #play to watch it in a browser, narration and
     all, instead of rendering. */
  if (location.hash === '#play') {
    const audio = document.querySelector('audio');
    const t0 = performance.now();
    if (audio) audio.play().catch(() => {});
    const tick = () => {
      const t = audio && !audio.paused ? audio.currentTime : (performance.now() - t0) / 1000;
      seek(t);
      if (t < window.DURATION) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
})();
