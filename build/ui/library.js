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
     off a dropdown that cannot yet be acted on — and rebuilt back to the
     prompt, so no choice survives the class it was made about.

     A subject is a choice about a class. "Science" held over from Class 9
     into Class 8 looks like the same choice when it is a different book,
     and the list it was chosen from has been replaced underneath it. The
     one place a subject is set on a class the reader did not just pick is
     restore(), which sets it itself, after this. */
  function fillSubjects(cls) {
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
      /* The pair exists but holds nothing — Mathematics II and Science,
         today. Say so, and leave the covers hidden: they belong to the
         book, and there is no book of this subject to belong to.

         The subject goes in as it is written and is not lowercased. It
         was, while the subjects were single words; "Mathematics II" comes
         back from that as "mathematics ii", and a roman numeral in lower
         case reads as a typo rather than as a numeral. */
      empty.textContent = 'No ' + sub
        + ' chapters in Class ' + cls.replace(/^class-/, '') + ' yet.';
      show(empty, true);
      return;
    }

    show(set, true);
    show(sets.find((s) => s.dataset.class === cls && s.dataset.covers), true);
  }

  /* ---- Arriving with a choice already made -----------------
     The back arrow in a chapter goes to "/", and this page opened
     with both dropdowns empty — so coming back from a chapter meant
     choosing the class and the subject again to reach the list you
     had just been looking at. The arrow means "back to the
     chapters", not "start over".

     So the link carries the choice: the back arrow puts the
     chapter's own class and subject in the query, which is right
     even for a chapter opened by its address without ever touching
     this page. **The address is the only source.** Opening the
     studio at a bare "/" chooses nothing — that is the front door,
     and a front door that quietly reopens the last room is a front
     door you cannot use to start somewhere else.

     Storage is kept for one job only: a cover belongs to a class
     and to no subject, so its arrow can only carry the class, and
     the subject is filled in from the last one chosen. That is a
     link with half its answer missing, not a bare arrival.

     Nothing here is trusted: a class or subject with no section is
     ignored and the dropdowns stay as they were. */
  const KEY = 'll.pick';
  const remember = () => {
    try {
      localStorage.setItem(KEY, JSON.stringify(
        { cls: pickClass.value, sub: pickSubject.value }));
    } catch { /* private window, or storage refused — not worth a failure */ }
  };
  const recall = () => {
    const q = new URLSearchParams(location.search);
    if (!q.get('class')) return {};            // a bare "/" starts fresh
    let kept = {};
    try { kept = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { /* no storage */ }
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
