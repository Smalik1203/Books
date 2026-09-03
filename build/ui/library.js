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

  function apply() {
    const cls = pickClass.value;
    const sub = pickSubject.value;
    const chosen = cls && sub;

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
      empty.textContent = 'No '
        + sub.toLowerCase()
        + ' chapters in Class ' + cls.replace(/^class-/, '') + ' yet.';
      show(empty, true);
      return;
    }

    show(set, true);
    show(sets.find((s) => s.dataset.class === cls && s.dataset.covers), true);
  }

  pickClass.addEventListener('change', apply);
  pickSubject.addEventListener('change', apply);
  apply();
})();
