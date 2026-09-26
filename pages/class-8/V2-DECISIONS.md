# Class 8 → maths-v2: decisions waiting for you

All 14 chapters were converted on 26 September 2026 (Mathematics I Ch 1–7,
Mathematics II Ch 1–7). Every chapter passes the builder, lone-words,
check-sums, orphans, check-labels, fit-options and its own check-numbers,
and both volumes bind. The work was done without asking you, as you asked.
These are the judgement calls left for you, most important first. Each
chapter's `EDIT-LOG.md` has the full detail.

## 1. Across the whole class

1. **NCERT citations need real page numbers.** Every exercise set ends with
   a line such as *NCERT, Figure it Out, §4.2*. No NCERT page numbers were
   anywhere in the repo, so 13 chapters cite **our own section numbers**,
   which may not match NCERT's. The exception is Mathematics I Ch 6, which
   has pp. 142–143, 149 and 154–156 from its old log, not yet checked
   against the book. Some notes cite NCERT's question range (e.g. Q1–16)
   for a set we shortened.
2. **Where the citation line sits.** The model chapter has none, so Class 8
   puts it as a small italic note (`c-practice__note`), the last line inside
   each exercise set. Confirm this, or choose another place.
3. **By the Book runs to 6–7 pages, not the 5 the recipe aims for**, in every
   chapter. Class 8 long answers and case passages at the larger size fit two
   cases to a page. In two chapters the last page holds only Q50, 13% full:
   Mathematics II Ch 1 and Mathematics I Ch 6. That is allowed, but it looks
   sparse.
4. **Exercise sets were shortened** to keep each set whole on one page. The
   biggest cut: **Mathematics I Ch 1, Set 1.6, from 19 questions to 10**.
   Others: Ch 1 Sets 1.4 and 1.5; Ch 2 Sets 2.2, 2.6 and 2.7 (5–6 each);
   Ch 5 §5.3 (8 against NCERT's 16); Ch 7 Sets 7.1 (5) and 7.4 (11);
   Mathematics II Ch 4 Set 4.3 (6 to 5).
5. **The tried-and-explained questions** that open Beyond the Book were kept
   word for word, as the recipe says, apart from small edits for the checks
   (logged). Several still carry coaching lines the model chapter does not
   have ("worth remembering", "A last piece of advice…"): Mathematics I
   Ch 1, Mathematics II Ch 3 and others. Cut them?
6. **Palette contrast.** Harbour (Mathematics I Ch 1) and marine
   (Mathematics II Ch 1) give white type at 6.96:1 and 6.93:1, just under
   the 7:1 the palettes aim for. Class 6's petrol is the same. They were
   kept so the hues stay evenly spaced.

## 2. May still follow NCERT too closely

Contexts, names, data and every question were replaced. These remain
because they are method, history or a classic idea. Say which to rewrite.

- **Mathematics I Ch 1:** the light-switch puzzle replaces NCERT's lockers,
  but it is the same classic puzzle underneath. The Hardy–Ramanujan 1729
  story is kept, in our words.
- **Mathematics I Ch 2:** the opener is still NCERT's idea (fold paper
  until it is thicker than the distance to the Moon), with new numbers
  (0.1 mm, 42 folds). The chessboard-rice story is kept.
- **Mathematics I Ch 3:** the Lebombo bone, the timeline, the figures
  showing 324, 7530 and 2634, and the term "landmark numbers".
- **Mathematics I Ch 5:** NCERT's methods, kept with new numbers: the
  four-number sign tree and the "always, sometimes or never" statements.
  The Aryabhata II sentence rests only on NCERT.
- **Mathematics I Ch 6:** the Brahmagupta/Sridharacharya history, the
  four-rectangles figure, and Ex 6.3 Q7, which is NCERT's question form.
- **Mathematics I Ch 7:** the cross-multiplication derivation and the
  Āryabhaṭa *trairāśika* history.
- **Mathematics II Ch 2:** the Śulbasūtra's six triples, Baudhāyana's √2,
  the Fermat–Wiles story and the four-triangle proof.
- **Mathematics II Ch 3:** four kept Beyond examples (Asha and Bina, the
  fruit drink, the 1 : 250 plan, 1200 travellers) were judged ours.
  Confirm.
- **Mathematics II Ch 4:** the Sierpiński and Koch dates, "eleven nets of a
  cube", and the coastline idea.
- **Mathematics II Ch 6:** the topics themselves (the date trick, calendar
  squares, digit reversal, ×1001). Ex 6.4 Q7 and Ex 6.5 Q2 keep standard
  facts with new numbers.
- **Mathematics II Ch 7:** the Śulbasūtra framing in §7.8, the land units
  (bigha, gaj, cent), and the standard proof figures in §7.4–7.7.

## 3. Content choices to confirm

- **Mathematics I Ch 4's topic list may be the old NCERT book's scope**
  (polygons, diagonals, angle sums, exterior angles, the parallelogram
  family), not *Ganita Prakash* Grade 8. **Check this against the real
  book.** Pythagoras was removed from its body, because Mathematics II
  teaches it later.
- **Mathematics I Ch 7:** the Binairo puzzle page was removed, because it
  used NCERT's grids and is not syllabus. Do you want a puzzle back, with
  our own grids?
- **Mathematics I Ch 5:** the Navakankari game corner was removed.
- **Mathematics I Ch 6:** NCERT's section titles for 6.3 and 6.4 were
  replaced with "Finding and Fixing Mistakes" and "Many Ways to See One
  Pattern".
- **Mathematics I Ch 3:** two facts were corrected: Roman numerals come from
  the Etruscan numerals, and Brahmagupta gave 0 ÷ 0 = 0. The direction of
  the rods in Fig. 3.5 (Chinese rod numerals) is still unverified.
- **Mathematics II Ch 6:** old Example 13 was wrong (it said 174 at most,
  but 27 × 8 = 216) and is fixed.
- **Mathematics II Ch 5:** By the Book cases 38 and 39 are shorter than the
  50–80 words the guide asks for (cut to fit; their tables carry the data).
- **Mathematics I Ch 2:** Beyond Q12 and Q13 write the matching options as
  "3, 2, 1, 4" rather than "P–3, Q–2…", unlike every other chapter.
  Matching lists in some chapters are three rows, not four.
- **Mathematics II Ch 7:** the two points in §7.9's key idea each wrap to
  two lines; the model's are one line each.
- **Mathematics I Ch 1:** the By the Book Q27 figure (the painted cube) has
  a lot of white space above the drawing.
- Pages were filled with new teaching rather than padding: new examples,
  Check rows and extra questions. Each is listed in its chapter's
  EDIT-LOG.md.

## 4. Tools (shared code: not changed except the first)

- `build/lone-words.mjs` only knew Windows Chrome paths. **Fixed** (it
  reads `CHROME`, adds `--no-sandbox` as root), in commit d9a1e47b.
- `build/check-sums.mjs` crashes on implied multiplication such as
  `2(6 + 12)`. The chapters write `2 \times (6 + 12)` to avoid it. Not
  fixed.
- `refit` measured By the Book and Beyond pages differently from the real
  build (111% against 94%), and does not keep the Summary on a page of its
  own. `gaps`/`repack` overstate the free space by 3–5 mm. Worked round
  by hand; not fixed.
- Three chapters deleted their old `stage2-bank.mjs`. The one-off Science
  review manifest
  `assets/design-history/science-g6-ch05-review/preserved.json` lists them,
  and every Class 8 page, by hash, so it was already out of date. Its audit
  would now fail on the missing files.
- Mathematics II Ch 5's Fig. 5.6 dividers print heavier than `dg-thin`
  suggests. This was so before the conversion.
