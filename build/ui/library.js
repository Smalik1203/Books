/* ============================================================
   Studio library — the class and subject chooser.

   Separate from app.js, which drives the viewer: the two pages
   share a stylesheet and nothing else, and a viewer that knows
   about the library is a viewer with a reason to break when the
   library changes.

   The server renders every class-and-subject pair and every
   class's covers, each tagged and hidden. All this does is decide
   which one is on show. Both choices are required — a class on its
   own is not a selection, it is half of one.

   Everything is read off those sections, and nothing off a second
   list kept beside them. An earlier version took the subjects from
   a data attribute on the select, which meant a stale server could
   serve markup without it and this script would enable an empty
   dropdown and say nothing was wrong. What is on the page is now
   the only source of what the dropdowns offer.
   ============================================================ */
(() => {
  const pickClass = document.getElementById('pick-class');
  const pickSubject = document.getElementById('pick-subject');
  if (!pickClass || !pickSubject) return;          // nothing in pages/ yet

  const sets = [...document.querySelectorAll('.lib-set')];
  const prompt = document.getElementById('lib-prompt');
  const empty = document.getElementById('lib-empty');

  /* hidden, not style.display: the markup ships with the attribute, so
     using anything else here would leave two mechanisms disagreeing. */
  const show = (el, on) => { if (el) el.hidden = !on; };

  /* The subjects a class actually has sections for, in the order the
     server rendered them. Derived per class, so a class carrying only
     Science offers only Science and nothing has to be kept in step. */
  const subjectsOf = (cls) => sets
    .filter((s) => s.dataset.class === cls && s.dataset.subject)
    .map((s) => s.dataset.subject);

  const option = (value, text) => {
    const o = document.createElement('option');
    o.value = value;
    o.textContent = text;
    return o;
  };

  /* Rebuilt rather than merely enabled, so a reader never reads a subject
     off a dropdown that cannot yet be acted on — and so a choice cannot
     survive the class it belonged to being cleared. */
  function fillSubjects(cls) {
    const keep = pickSubject.value;
    const list = cls ? subjectsOf(cls) : [];
    pickSubject.textContent = '';

    if (!cls) {
      pickSubject.appendChild(option('', 'Choose a class first'));
      pickSubject.disabled = true;
      return;
    }
    if (!list.length) {
      // a class with no sections at all: say so rather than offer nothing
      pickSubject.appendChild(option('', 'No subjects in this class'));
      pickSubject.disabled = true;
      return;
    }
    pickSubject.appendChild(option('', 'Choose a subject'));
    list.forEach((s) => pickSubject.appendChild(option(s, s)));
    pickSubject.disabled = false;
    if (list.includes(keep)) pickSubject.value = keep;
  }

  function apply() {
    const cls = pickClass.value;
    const sub = pickSubject.value;
    const chosen = Boolean(cls && sub);

    sets.forEach((s) => show(s, false));
    show(prompt, !chosen);
    show(empty, false);
    if (!chosen) return;

    const set = sets.find((s) => s.dataset.class === cls && s.dataset.subject === sub);
    const count = set ? Number(set.dataset.count) : 0;

    if (!count) {
      /* The pair exists but holds nothing — Science, today. Say so, and
         leave the covers hidden: they belong to the book, and there is no
         book of this subject to belong to. */
      empty.textContent = 'No ' + sub.toLowerCase()
        + ' chapters in Class ' + cls.replace(/^class-/, '') + ' yet.';
      show(empty, true);
      return;
    }

    show(set, true);
    show(sets.find((s) => s.dataset.class === cls && s.dataset.covers), true);
  }

  /* ---- Remembering the choice ------------------------------
     The back arrow in a chapter goes to "/", and this page opened
     with both dropdowns empty — so coming back from a chapter meant
     choosing the class and the subject again to reach the list you
     had just been looking at. The arrow means "back to the
     chapters", not "start over".

     Two sources, in order. The link the reader arrived on carries
     the chapter's own class and subject, which is right even for a
     chapter opened by its address without ever touching this page.
     Failing that, the last choice made here — so opening the studio
     fresh puts you back where you left off.

     Neither is trusted: a class or subject that no longer has a
     section is ignored, and the dropdowns stay as they were. */
  const KEY = 'll.pick';
  const remember = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(
        { cls: pickClass.value, sub: pickSubject.value }));
    } catch { /* private window, or storage refused — not worth a failure */ }
  };
  const recall = () => {
    let kept = {};
    try { kept = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { /* no storage */ }
    const q = new URLSearchParams(location.search);
    if (!q.get('class')) return kept;
    /* A cover belongs to a class and to no subject, so its link carries
       only the class. Falling through to the remembered subject is what
       stops the arrow on a cover landing on the prompt. */
    return {
      cls: q.get('class'),
      sub: q.get('subject') || (q.get('class') === kept.cls ? kept.sub : '') || '',
    };
  };

  function restore() {
    const { cls, sub } = recall();
    if (!cls || ![...pickClass.options].some((o) => o.value === cls)) return;
    pickClass.value = cls;
    fillSubjects(cls);
    if (sub && subjectsOf(cls).includes(sub)) pickSubject.value = sub;
  }

  /* The subject list is rebuilt when the class changes and not otherwise:
     rebuilding it on its own change would replace the element the reader
     just used, under their cursor. */
  pickClass.addEventListener('change', () => {
    fillSubjects(pickClass.value);
    remember();
    apply();
  });
  pickSubject.addEventListener('change', () => { remember(); apply(); });

  fillSubjects(pickClass.value);
  restore();
  apply();
})();
