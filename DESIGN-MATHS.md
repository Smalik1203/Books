# LearnLab Design System — Mathematics

The mathematics volumes: Class 6, Class 9 and Class 10 Mathematics I, and
Class 7 and Class 8 Mathematics I and II.

Read [DESIGN.md](DESIGN.md) first. Page grammar, the two sheets, the cover,
what the builder rejects and the rule that a panel is never divided apply to
these volumes and are not repeated here. Section numbers match the single file
this was split from, so §6a is still Beyond the Book.

---

## 1. Colour — three working colours, used semantically

**Maplitho matte print preparation:** see [PRINT-COLOUR.md](PRINT-COLOUR.md).
The palettes are authored in sRGB. A bleed PDF is not automatically a CMYK
PDF; final separation requires the printer's output profile and a paper proof.
The provisional uncoated profile check is repeatable with
`build/check-print-palettes.py`.

| | | means |
|---|---|---|
| **teal** `--teal` `#12503f` | structure | mathematics, core concept, the spine of the book |
| **rust** `--rust` `#b4462a` | action | a worked example, a measurement, something being done |
| **gold** `--gold` `#c1841c` | attention | a question put to the reader |

Each has one pale tint, used **only** as a panel background:
`--teal-tint`, `--rust-tint`, `--gold-tint`.

**Every component uses exactly one colour.** None mixes two. If a component
seems to need a second colour, it is doing two jobs and should be split.

**A chapter may move the palette, not the system.** `chapter.json` names a
`palette`, which loads `css/palette-<name>.css` over the tokens — the same
mechanism as an edition sheet. It moves all three working colours together.

**Each palette is a triad**: structure at hue *h*, action at *h*+120°,
attention at *h*+240°. Three facts follow, and they are the whole argument:

- **No two roles can look alike.** 120° is the furthest three hues can get
  from one another. The book default is not built this way — rust and gold
  sit **39°** apart — which is why action and attention always read as
  relatives, and why recolouring structure alone could never fix a warm
  chapter. Rotating one colour cannot repair a harmony the other two do not
  have.
- **A lightness ladder underneath.** Structure 0.41, action 0.52, attention
  0.63 in OKLCH; white on them runs about 9, 5.5 and 3.4 to one. So the roles
  separate by value as well as hue, and the hierarchy survives a mono proof.
- **Chroma stays low** — around 0.09. The triad is chosen for separation, not
  for brightness; at full chroma the same geometry gives an emerald title and
  a periwinkle reflect box, which is a toy, not a textbook.

Two failures worth not repeating, both found by rendering: recolour structure
to a *light* orange and a section head stops outranking a worked example; move
action to a cool colour while leaving attention gold and the chapter title —
which is action-coloured — turns green beside a warm numeral block.
Ink, rules and paper are neutral and belong to no component.

### The structure colour is per chapter

`--teal` is the *role*, not the hex. A chapter may own the structure hue so
that two chapters in the same class do not read identically, and the name is
kept only because renaming it would touch every stylesheet.

Declare four tones in `CHAPTER_PALETTES` in `build/build.mjs`, keyed by
chapter number — or `"palette"` in `chapter.json`:

```js
'3': { base: '#1c3a6b', deep: '#12294e', soft: '#5c7cad', tint: '#e8edf6' },
```

The builder emits them as `--ch-structure*`; `--teal*` reads through with the
original green as its fallback, so **a chapter with no entry is unchanged.**
Chapter 4 owns the green. Chapter 3 is indigo.

**Only the structure colour moves.** Rust and gold are common to the whole
book, so a page is still the three-colour system above — the same semantics,
in one different hue. Do not give a chapter its own action or attention
colour, and do not use a hue for structure that a diagram fill already uses
in the same chapter.

## 2. Typography — two faces, locked

| | | used for |
|---|---|---|
| **Source Serif 4** `--font-body` | body | running text and diagram labels; equations retain KaTeX |
| **Vollkorn** `--font-display` | display | headings, component labels, captions |

Approved 18 September 2026 after comparing actual maths pages: Source Serif 4
body at **500**, with the existing Vollkorn headings and labels retained.
Emphasis and headings stay at **700**. `css/maths-fonts.css` loads only for
maths chapters and bound maths volumes, leaving science unchanged. The roman
face is variable, so 500 is a real medium weight. Optical sizing is disabled
to match the approved preview. The shared tokens remain the fallback for other
subjects; do not change them to apply this maths pairing.

Numerals are **lining** throughout. Vollkorn defaults to oldstyle, which turns
`Fig. 4.1` into `Fig. 4.ı`.

### The scale

Seven sizes, named by role and never by number. **Nothing may sit off the
scale** — a literal `12pt` in a rule is a defect, not a nuance.

Sizes below are the standard trim's. An edition sheet moves the whole scale
together — never one step of it.

| token | size | used for |
|---|---|---|
| `--size-caption` | 8.5 pt | captions, hints, the aside in brackets |
| `--size-note` | 9 pt | panel text, exercises, legends, component tags, folio |
| `--size-body` | 10 pt | running text |
| `--size-concept` | 12 pt | concept headings, rubrics, the section numeral |
| `--size-section` | 14.5 pt | section headings |
| `--size-chapter` | 23 pt | chapter title |
| `--size-numeral` | 38 pt | chapter numeral |

### Two label treatments, not five

Every small label in the book is one of exactly two things:

- **Tag** — sits on a coloured ground. Display, bold, UPPERCASE, `--track-label`.
  `--size-concept` when it announces a division of the chapter (the practice
  band); `--size-note` when it labels a single component (the example tab, the
  reflect band).
- **Rubric** — sits on the paper. Display, bold, small caps, `--track-title`,
  `--size-concept`. Used by `h3`, the key-idea title and the summary title.

### Equations are one size, everywhere

KaTeX's roman has an x-height of 0.430 em against Spectral's 0.452 — measured,
not guessed — so maths is set at 1.05x the text size to sit on the same visual
line. That size is **absolute**, taken from `--size-body` rather than inherited.
A panel sets its prose a shade below running text; its mathematics does not
follow. Before this rule the same identity printed at 9.4 pt inside an example
and 10.8 pt in the paragraph beside it — which is what made the maths look
shrunken. Captions and asides are the one exception: there the maths follows
the caption size, or it would stand taller than its own line.

### Weight comes from leading, not from a heavier cut

Body sets at **500**. Not 600 — KaTeX ships one weight, so semibold prose next
to regular-weight algebra makes the maths look faint, trading one mismatch for
another. A page that reads too light is nearly always leading, not stroke:
`--lh-body` is 1.42, and that is the lever to reach for.

### Diagram type is specified in millimetres

SVG text is measured in viewBox units, and a unit is a different physical size
in every figure — the same `.dg-label` once printed at 5.1 pt in one figure and
10.3 pt in another. So diagram type is declared as a printed height
(`--dg-type`, `--dg-type-sm`) and the builder stamps every figure with its
viewBox width and its printed width so the value can be converted. Labels are
8.5 pt and measurements 7.5 pt in every figure in the book, whatever its
viewBox.


## 3. Hierarchy — five levels, each with a signature

A reader should be able to name the level without reading the words.

| level | signature |
|---|---|
| **1 Chapter** | teal numeral block bleeding off the spine, rust title, sketch, heavy rule |
| **2 Section** | teal numeral tab + display small caps + hairline rule beneath |
| **3 Concept** | teal display small caps. No tab, no rule, no panel |
| **4 Example** | rust tab over a tinted panel |
| **5 Practice** | teal band header over an open list |

Size alone is not a signature. Each level differs in *kind*.

## 4. The component library — seven, locked

**Reference tables, 20 September 2026:** in all mathematics classes, captions
sit below tables and images. Figure captions already follow their artwork in
source order; table captions use `caption-side: bottom`. Tables have a complete
grid, including outside and internal cell borders. Their headers use the
chapter's attention tint and deep attention ink, distinct from worked examples'
action colour. This is implemented in `css/maths-tables.css`, loaded for both
maths chapters and bound maths books. Existing cell padding and caption sizes
remain on the shared scale. Prose references such as "see Table 1.1" stay in
the prose; only the labelled caption belongs below the referenced object.

| component | colour | panel? |
|---|---|---|
| `.c-keyidea` | teal | no — a heavy rule above, a hairline below |
| `.c-example` | rust | **yes** — a worked instance |
| `.c-reflect` | gold | **yes** — a question for the reader, disc on the corner |
| `.c-practice` | teal | no — a band header over questions |
| `.c-tip` | teal | no — a disc between two rules, one breath |
| `.c-figure` | — | no — a diagram and its caption |
| `.c-summary` | teal | no — a rule and a numbered list |

Three more — the division opener, the difficulty tag and the answer key — are
added by §6a for Beyond the Book, and by nothing else. Four more are added by
§4a of [DESIGN-SCIENCE.md](DESIGN-SCIENCE.md) for the science volumes, and by nothing else.
The chapter structure in §5 adds eight more. They live in
`css/structure.css`; §5 lists them.

**Only two components are panels** — the example and the reflect prompt, both
of which the mockups called for. Everything else sits on the page, held by
rules and space. A tinted box with a rounded corner and a coloured bar down
one side is interface furniture; it is what made the book read as a
dashboard rather than a textbook.

A panel spans the **full measure**, with equal padding on both sides. The
example's tab sits astride its top-left corner — it is a label on the box, not
a column the text has to make room for. Indenting every line of an example to
clear a one-line tab throws away 33mm of measure and leaves a dead strip of
tint down the left of the page.

The reflect box follows the same rule: its disc and title band sit astride the
top edge as one unit — the disc caps the band rather than floating beside the
box — so the text keeps the full measure there too.

**The disc marks are line drawings, and the stylesheet owns them.** A page
supplies the path data and nothing else — no `fill`, no `stroke-width`, no
colour. Miss that and the outline closes and prints as a solid black shape,
with the stroke colour still applied on top, so it looks deliberate.

`.c-reflect` keeps one mark across the book — the gold bulb, because the
question it asks is always the same kind of question. **`.c-tip` takes a mark
from its own chapter's subject:** crossed axes and a plotted point for
coordinates, a square cut into a square, two rectangles and a smaller square
for identities, a circle with its centre and radius for circles. Three strokes,
no more — a fourth stops reading at 6mm. Never a generic mark: an open book or
a lightbulb says only "here is a remark", which the two rules already say.

Two treatments, and no others:

- **`.eq`** — a displayed equation. No background, no border, no decoration.
- **`.eq--anchor`** — an identity the chapter turns on. Teal rules above and
  below, larger, with real air around it.

Use `--anchor` sparingly. If every equation is anchored, none is. As a rule of
thumb: **at most one anchor per spread.**

`.work` holds stepped working; `.work--centred` centres a single line;
`.work--list` stacks statements that are independent of one another (a
reference list of identities, say) with no continuation indent.

**Fraction size is not a free choice.** A fraction that *is* the whole
expression — an exercise item, a line of working — is set display size
(`dfrac`). A fraction that is one term inside a longer expression, or that
sits in running prose, is set inline size (`frac`). Display fractions
overflow their line box, so any list of them takes `.c-parts--tall`, which
lets the maths set the row height instead of the leading. Without it the rows
collide, and the builder reports an overflow the page does not appear to have.

## 5. Chapter structure — what comes, in what order

Adopted 15 September 2026, and **revised the same day: the chapter body
keeps NCERT's structure.** The additions below — worked examples, checks,
practice in examination forms — were built into the body of all fifteen Class
7 chapters and taken back out at the user's direction. A teacher teaches the
NCERT chapter as NCERT wrote it, and a reader of a Class 7 page should meet
NCERT's order, sections and inquiry. The Cengage-style material goes in
**Beyond the Book** instead, in the shape set out at the top of §6a. Read the
rest of this section as what a chapter must offer its reader somewhere, and
as the reasons, not as the order of the chapter body. The components listed
at the end of this section are in `css/structure.css`; the case-question rules
there are used by Beyond the Book's practice stage.

**Why it was written.** An audit of all 56 maths chapters found the book
inconsistent with itself before it was behind anyone else:

- no chapter prints answers to its own exercise sets — only the Beyond the
  Book key exists;
- 10 chapters of 56 have end-of-chapter exercises. Class 7 Mathematics I
  stops after Chapter 4, and Class 9 after Chapter 6;
- worked examples run from none (Class 6 Ch 8, Class 7 Ch 6 and 7, Class 7
  II Ch 6, Class 9 Ch 1) to eighteen (Class 7 Ch 2);
- a rule is used and never stated. Class 7 Chapter 1 rounds numbers for
  four pages and never says when to round up.

It was also read against Cengage's *NCERT Plus Foundation Mathematics*
for Class 7, the book a school is most likely to set beside this one.

Four people open the book, for four reasons. A school chooses it, a teacher
sets homework from it, a student learns and revises from it, and a parent
checks it. Every part below is there for at least one of them.

### The chapter

    Opener        one page    our title, with the NCERT chapter named in one
                              line beneath it; a question set in an Indian situation;
                              three or four outcomes in plain words; Before
                              you start — three recall questions, answered at
                              the foot of the page
    Topic × n     2–4 pages   explore · explain · key idea · worked examples ·
                  each        check yourself · exercise set
    Close         5–7 pages   mind map · summary and vocabulary ·
                              end-of-chapter exercises
    Beyond the Book           §6a, unchanged

### A topic, in this order

1. **Explore.** A situation to guess at or try, half a page at most. A reader
   who has guessed reads on to find out if they were right. Longer than half
   a page, and a weak reader is lost before the idea has a name.
2. **Explain.** Running text and a figure, written to §10. The term is used
   here and glossed with `.term` where it first appears.
3. **Key idea.** The rule or definition in its exact wording (§10, *two
   registers*). This is what a student revises from the night before a
   test. A chapter that only shows a rule working has not given them one.
4. **Worked examples.** Two or three, rising: one direct, one applied, one
   that needs a reason. What is given; then one step a line in `.work`, with
   its reason where the class needs one; then the answer. A beginner learns
   more from a solved example than from struggling alone, so a topic with no
   example is a defect, not a style.
5. **Check yourself.** Three short questions straight after the examples,
   answered in the book of detailed answers. It catches a misreading before it
   becomes homework, and a teacher can run it in five minutes of class.
6. **Exercise set.** Numbered by chapter and set — *Exercise 1.2* — because
   that is how an Indian school sets homework. Graded inside the set: fluency,
   then application, then a question that needs thought.

Used where they fit, not on a schedule: **Did you know?**, Think and
Reflect, an activity that fits one class period, and a **common mistake**
set beside the example it belongs to.

### The close

- **Mind map.** One page, after the chapter and not before it. A map of ideas
  the reader has not met yet is a list of words; after the chapter it is the
  revision sheet.
- **Summary and vocabulary.** The summary as it is now (§4), then every term
  the chapter teaches, each with a one-line meaning.
- **End-of-chapter exercises, in every chapter,** in the forms school papers
  use: multiple choice, assertion–reason, very short, short and long answer,
  and two case-based questions. Grouped by the length of the answer and
  **never by marks.** §6a's reason holds here too: a book used in many
  schools cannot know how any one of them marks, and a printed mark makes the
  page look like an examination it is not.
- **No answer key.** The student book prints no answers to its checks,
  exercise sets or end-of-chapter exercises. Every answer, with its working,
  goes in the separate book of detailed answers. Class 7 Chapter 1 carried a
  three-page key for a day; it was taken out on 15 September 2026 and kept
  in the chapter's `ANSWERS.md` for that book. Two things stay: the Before
  you start answers on the opener, and Beyond the Book's own key (§6a).

### The book

At the front, how to use the book — one line for each component, with its
mark — and a syllabus table: chapter, NCERT chapter, suggested periods,
outcomes. At the back, a glossary that is also the index, a formula sheet,
and two model papers, half-yearly and annual.

### The companions

**The answers booklet** is its own printed booklet, one to a volume, and it
is where every answer in the book lives. The student book prints none:
a page of answers at the back is read before the question is tried, and a
chapter that answers itself cannot be set as homework. Beyond the Book's own
key is the single exception (§6a), because that division is written to be
read straight through.

What the booklet holds:

- **every question in the volume** — each chapter's exercise sets, whatever
  the chapter sets in its running text, and Beyond the Book's practice;
- **the working, not just the result.** An answer is set the way §5a asks an
  example to be set: *Solution*, a step to a row, *Answer*. A bare result is
  enough only where the question asks for a name, a word or a reading;
- **what a drawing must show,** for a construction, and any measurement it
  should give;
- **"answers will vary"** where that is the truth, with one worked instance
  under it, so a teacher marking thirty different answers has a model.

It is numbered by chapter and set — *Exercise 3.4, Q2* — so it is used
beside the book without a contents page. It is written from each chapter's
`ANSWERS.md`, which is kept beside the chapter's pages and updated whenever
a question changes; a question renumbered in the book and not in that file
is the way this goes wrong.

**The Teacher's handbook** holds period plans, activity notes and a question
bank.

### By class

| classes | weight |
|---|---|
| 3–5 | picture and activity first; short exercise sets; no examination forms |
| 6–8 | the full structure; end-of-chapter exercises mostly multiple choice and short answer |
| 9–10 | the full structure with every form; proofs stepped one statement to a line; the model papers matter most |

### What stays out

- **Work above the syllabus, inside the chapter.** It goes in Beyond the Book,
  which is marked as optional. A teacher who cannot tell what is examinable
  teaches all of it or none of it. Cengage sets negative powers of ten in a
  Class 7 chapter.
- **A fact nobody has checked.** Every Did you know? records its source in
  `EDIT-LOG.md`. Cengage prints the size of an atom twelve powers of ten too
  small, and nothing on its page looks wrong.
- **Mascots, tinted furniture, and a shortcut without its reason.** §4 says
  why for the furniture. A shortcut without its reason is something to
  memorise, which is §6a's objection to named moves.
- **Answers kept in an app.** Answers go in a printed book of their own.

### How this differs from the books beside it

| | what it does well | what it lacks | what this structure does instead |
|---|---|---|---|
| NCERT | inquiry; it sets the syllabus | few worked examples, little practice, no examination forms | keeps the inquiry and adds examples, practice and the forms |
| Cengage *NCERT Plus* | very large question banks | crowded pages, bare solutions, printed errors, solutions in an app | checked numbers, designed pages, a reason in every solution, a printed book of detailed answers |
| R. D. Sharma, R. S. Aggarwal | depth of practice | the formula comes before the idea | the same depth, with the idea first |
| question banks | the examination pattern | not a textbook | the pattern inside the textbook |

### What it will cost

More pages than first guessed. Class 7 Chapter 1 went from 18 body pages to
26, on a page that also grew from Crown Quarto to 196 × 276 mm: fourteen
worked examples in place of one, six checks, eight key ideas, the close and
twenty new end-of-chapter questions. With an answer key it came to 28; the
key is the one addition that went to its own book. Every rebuilt chapter is
refitted, because a source file is a printed page (CLAUDE.md, *Fitting
pages*). Every number a new example, check or question adds is
re-derived, as §10 requires of any printed value.

### The components it needs

In `css/structure.css`, which `book.css` loads after `bridge.css`. Each
takes one colour by the roles in §1, and none is a panel, because the book
has two (§4).

| component | colour | |
|---|---|---|
| `.chapterhead__source` | none | one quiet line under the chapter title naming the NCERT chapter. Our title stays the title: it is the book's, and it runs in the running head |
| `.c-goals` | teal | the opener's outcomes and its Before you start questions, answered at its foot |
| `.c-check` | gold | Check yourself: numbered questions put to the reader, answered in the book of detailed answers. A gold rule and a hairline, like `.c-try` |
| `.c-fact` | teal | Did you know?: one breath between two rules, like `.c-tip`, with a mark from the chapter's subject |
| `.c-mistake` | rust | a common mistake, set straight after the example it belongs to, because it is about something being done |
| `.c-mindmap` | teal | a rule and a title over an ordinary `--full` figure, drawn with the §6 vocabulary and nothing else. Words on the map are `.dg-note`; branch names and the hub are `.dg-label--on-fill` on `.dg-fill-teal`. No arrows and no × in the drawing: neither face is sure to carry them, and a fallback glyph is a third typeface |
| `.c-vocab` | teal | the chapter's terms, alphabetical, each with a one-line meaning |
| `.c-case` | gold | a case-based question's situation or table, set off from its parts |
| `.c-practice__sub`, `__note` | teal | a form inside the end-of-chapter exercises — *Choose the correct option*, *Assertion and reason* — and the one instruction that applies to the whole form |

The end-of-chapter exercises run to 35 questions in one numbered list, so
`components.css` now carries `data-start` counters to 40.

**Which of them a page actually uses.** The Class 7 rebuild put the chapter
body back to NCERT's structure, so of the components above only `.c-case`
and `.c-practice__sub` / `__note` are in the book, in Beyond the Book's
practice stage, beside `.c-practice__num` in `bridge.css`. The other six —
`.chapterhead__source`, `.c-goals`, `.c-check`, `.c-fact`, `.c-mistake`,
`.c-mindmap`, `.c-vocab` — are defined and used by nothing. They are what a
body built to this section would need, and the reasons for each still hold;
they are kept rather than deleted so that the next class to try it starts
from a library, not from scratch. Do not add one to a Class 7 chapter body.

## 5a. The bar a finished chapter clears

Written 16 September 2026, after Class 7 was read as a whole and rated by
part. Each line below is the level a chapter has to reach before it is
called finished, and each is countable, so a chapter can be checked rather
than admired. A chapter that misses one is not finished; the miss is logged
in its `EDIT-LOG.md` with what it needs.

**The chapter body keeps NCERT's structure (§5), so most of these are met in
Beyond the Book.** That is the point of the division: the NCERT chapter is
not crowded, and the examination work is a page turn away.

| what | the bar |
|---|---|
| worked examples | every topic of the chapter is worked somewhere the reader can find it: a type in Beyond the Book's Solved Examples for each, and at least twelve examples a chapter. No topic is taught and never worked |
| examples are stepped | *Solution*, then a step to a row in `.work__row`, then *Answer*. The maths carries the step; the reason is two to four words in a `.work__why` — the display face, italic, soft ink, no tint, because it is a remark about the working and not part of it. A `.chip` in a row means the other thing: a piece of the expression the text is pointing at. Never a paragraph with the working inside it |
| practice | every chapter's Beyond the Book runs one numbered list of at least 26 questions covering all six forms — multiple choice, assertion–reason, very short, short, long, case-based — with the multiple-choice answers spread across the four letters |
| nothing repeats | no example or question in Beyond the Book repeats one the chapter already sets. Checked against the body, phrase by phrase, before it goes in |
| answers | **every question in the volume is answered in the answers booklet** (§5, *The companions*), the chapter's own exercise sets included. The student book prints none, except Beyond the Book's own key. The chapter's answers are written as it is written, and kept in `ANSWERS.md` beside its pages: that file is the booklet's source, and a chapter is not finished without it. A question nothing answers is a defect, not a puzzle |
| rules stated | every rule the chapter uses is stated once in a `.c-keyidea`, in the words a paper will use (§10, *two registers*). A chapter that only shows a rule working has not given the student one to revise |
| terms | every term the topic's papers use appears in the body, glossed with `.term` where it first appears (§10, *required terms*) |
| numbers | every printed value — in the chapter, in Beyond the Book, in the answers — is re-derived by a script kept with the chapter's working notes. The script also checks that each multiple-choice question has exactly one right option and that it matches the printed key |
| facts | a Did you know? prints only with its source recorded in `EDIT-LOG.md`. No source, no fact |
| figures | a question that names a figure uses the values printed on that figure. If it needs other values it gets its own figure, numbered after the body's last |
| fitting | no page overflows; nothing runs more than 3 mm into the bottom margin; no opener is stranded at the foot; a page under 88% is held by a whole block that cannot move, and is logged |
| a question and its figure | a question that refers to a figure prints on the same page as that figure, or facing it. A reader who must turn the page to see what is being asked has to hold the question in their head while they do. Class 7 shipped two of these before anyone noticed — an exercise question whose figure was overleaf in Chapter 5, and another in Mathematics II Chapter 1 |
| colour is never the only carrier | a diagram's fills, a tinted mark and a coloured rule all have to survive a greyscale print and a colour-blind reader. Check a chapter in greyscale and in a colour-vision simulation before it is called finished. Class 7 alone carries about 1,800 filled shapes in its diagrams and 65 tinted term chips, and a tint that is doing the work alone fails both readers. Pair the colour with a name, a label, a shape or a position |
| language | §10 throughout: plain explanation, exact rule, no coaching register, sums set as maths |

**Book furniture is deliberately outside this bar.** The contents page, how
to use the book, the syllabus table, the glossary and index, the formula
sheet and the model papers (§5, *The book*) belong to the volume, not the
chapter, and are written once a volume's chapters are settled. A chapter is
finished without them; a volume is not.

## 6. Diagrams — first-class components

Every mathematical diagram is drawn with the vocabulary in `css/diagram.css`
and nothing else. A figure may not carry its own stylesheet, stroke widths or
colours.

**Strokes** — `.dg-line` (structural), `.dg-thin` (a cut or division),
`.dg-hidden` (an edge behind a solid), `.dg-ghost` (where a piece is going),
`.dg-dim` (a measurement — always rust), `.dg-move` (a rearrangement arrow).

**Fills, named by role** so a key swatch and its region cannot drift apart:
`.dg-fill-a` (first quantity), `.dg-fill-b` (products), `.dg-fill-c` (second
quantity), `.dg-fill-d` (units). Soft variants for dissections; three face
tints so every solid is lit the same way.

**Labels** — `.dg-label` for quantities (italic body serif, matching the
algebra in the text), `.dg-dim-label` for measurements (rust),
`.dg-note` for instructions like *moves* / *stays* (display face, so an
instruction can never be mistaken for a quantity).
`.dg-label--on-fill` where a label sits on a dark region.

**Coordinate graphs** are a frame with relations laid over it, and the two must
not compete. `.dg-grid` is the faintest thing in the figure, `.dg-axis` is quiet
structure, `.dg-tick` sets the axis numerals upright (they are numbers, not
quantities), and only `.dg-plot` carries mathematics. `.dg-plot-label` names a
relation and takes a paper knockout, so a label is never struck through by a
grid line or another plot.

Axes carry **no arrowhead**: the book's one marker is rust, which on an axis
reads as a measurement. The line running out to the frame says *continues*.

Where several relations share one pair of axes they are told apart by role, in
a fixed order, so the same relation keeps its colour across a series of
figures. `.dg-plot` follows the chapter's structure colour; `--b` is rust; and
`--c` is the diagram palette's green rather than a working colour — a chapter
that owns a warm structure hue would otherwise put three warm lines on one
pair of axes.

**One arrowhead in the whole book.** The builder puts a single `#dg-arrow`
marker in the page shell; every figure references it.

**Size comes from a scale**, not from a per-figure pixel width:
`.c-figure--sm` · `--md` · `--lg` · `--xl` · `--full`. The printed widths live
in the tokens — 42/51/59/71/126 mm on the standard trim, and a set of their
own on each edition.

**The steps are set against the height of the text block, not its width.** A
figure's height is its artwork's business; the width is all a stylesheet
controls, and what decides whether a figure packs onto a page is the fraction
of the page it eats vertically. Scale the steps with the measure instead and a
squarer trim grows every figure by a tenth as a share of the page, which is
enough to stop a heading seating under itself; the change from A4 to Crown
Quarto turned six short pages in one chapter into sixteen before this was
measured.

`--full` used to be the measure itself. It is a step now, for the same reason:
a full-measure grid came to 55% of a Crown Quarto page, and one chapter has
seven of them. It is still comfortably the largest, and still for the one
drawing that genuinely needs it — a **ruled coordinate grid**, where the tick
numerals collide long before the figure starts to look large. A diagram that
is not a grid does not get it.

A figure carries about **4.5 viewBox units per printed millimetre** — a
`--full` drawing has a viewBox 690 units wide, an `--xl` one 390. That is
what keeps a structural line the same weight on every page: strokes are
declared in viewBox units, so a figure drawn at a different density prints
a heavier or fainter line than its neighbour.

## 6a. Beyond the Book — a division, not a second book

### By the Book, and Beyond the Book for competitive examinations — 25 September 2026

Decided with the user, and built first in the specimen (`pages/_sample-2027-28/`);
the class books have not been converted yet. A chapter now ends in **two**
divisions, each with its own opener band and running head:

    The chapter      unchanged (§5)
    By the Book      p090–p099, data-board. Board-examination practice: one
                     numbered run of 50 — Very short answer 10 · Short
                     answer 10 · Long answer 10 · Assertion and reason 5 ·
                     Case-based 5 · Objective 10 — aimed at CBSE
                     Mathematics Standard. Opens with .c-bridge "By the
                     Book" (no strap). How every question is framed, and
                     how the division changes from Class 6 to 10, is in
                     BY-THE-BOOK.md.
    Beyond the Book  p101 up, data-bridge. Competitive examinations only:
                     1 Using What You Know, 2 Solved Examples,
                     3 Practice questions (the band reads "Practice questions")

- **Beyond the Book is organised by format, like By the Book** (26 September
  2026, maths-v2, Class 6 Chapter 1 first). Under the violet division band
  come the tried-and-explained questions with no stage head; then five
  parts — Single correct · More than one correct · Numerical answer ·
  Matching · Paragraph-based — each a standalone `.c-practice__sub` head
  with a rule, holding its two solved examples and then its practice
  questions (4 · 4 · 3 · 2 · 2, numbered 1–15 through the division). No
  numbered stage bands, no "Practice questions" band, no format tag on the
  example tab and no "Choose one correct option" line: the part head says
  it once. Answers keeps its stage head, without a numeral, because
  `repack` opens a fresh page on it; a standalone part head counts as an
  opener there, so it is never stranded at a page foot.
- **Five formats, not four.** *Paragraph-based* joins single correct, more than
  one correct, numerical answer and matching: one passage in a `.c-case`, then
  two or three parts (`.c-parts c-parts--1`), at least one with options and
  one numerical. Stage 2 ends on one paragraph-based example.
- **Stage 3 Practice is in the same five formats**, grouped under a
  `.c-practice__sub` naming the format, in the order of the examples. **No
  levels** — Level 1/2/3 heads were tried and rejected by the user — and no
  per-question format tag or note line: the sub-head names the format once.
  The specimen sets ten: 3 single, 3 multiple, 2 numerical, 1 matching,
  1 paragraph-based.
- **Classes 6–8 lean to olympiad reasoning, 9–10 to multi-step entrance
  problems**, always in the chapter's own mathematics. The page never names an
  examination; the specimen guide says it once.
- **The specimen is set larger.** It uses `css/edition-196x276-large.css`, which the class books adopt as they convert:
  the 196 x 276 page with running text at 11pt, panels at 10pt and captions at
  9pt; headings unchanged. The class books stay on `196x276`.
- **No answers in the specimen.** The class books keep a key; where it goes
  under this shape is still to be decided.

The specimen also opens with a guide, **Part 1 · The ClassBridge Approach**
(`c0-the-classbridge-approach`, `"order": 0`): how a chapter is built, how a
topic is taught, each component shown as it prints with a note, one question
of each By the Book form, the three Beyond stages, and a strand table from
Class 6 to 10. Its frames are in `css/guide.css`: `.g-part`, `.g-note`,
`.g-item` (a note and its first frame, one block, because the packer ignores
`break-after`), `.g-specimen`, `.g-flow`, `.g-along`, `.g-table`.

### Solved-example contract — 18 September 2026

**Superseded 25 September 2026:** Beyond the Book now has **10 solved
examples, two of each of the five formats** (single correct, more than one
correct, numerical answer, matching, paragraph-based), and **15 practice
questions** (4 · 4 · 3 · 2 · 2). The rest of this contract — how each format
is written — still holds. Class 6 Chapter 1 is the first chapter on the new
counts.

The user had requested exactly **15 solved examples per chapter**, covering
JEE-style question formats through concepts appropriate to each school class:
6 single-correct MCQs, 4 multiple-correct MCQs, 3 numerical-answer questions,
and 2 matching-list questions. This replaces the earlier open-response solved
examples. The conversion is being completed class by class; do not infer that
an unreviewed chapter already meets this contract.

Every example names its format. Multiple-correct questions explicitly ask for
all correct options; numerical questions specify units and rounding where
needed; matching questions give all information before the solution and have
one unambiguous correct combination. Each example retains a worked solution
and an answer showing the correct option letter(s), matching combination, or
number. Check every distractor, including equivalent expressions, and every
statement in a multiple-correct set. Do not introduce class 11–12 prerequisites
into a lower-class book merely to imitate an entrance examination.

The chapter body, Using What You Know, and Practice questions retain their
existing formats. The practice answer key must remain paired with its original
questions. Do not restore the removed wrong-option commentary section. Refit
only the bridge, keep panels whole, then check option widths and page fit.

### The shape since 15 September 2026

Class 7 is built to this, and it overrides the older description below where
the two differ. Class 7 Chapter 1 is the built example.

    1 Using What You Know   the existing stage, word for word: questions tried
                            first and explained in running text, so a student
                            sees how simple ideas become tricky questions.
                            Never recast as worked examples
    2 Solved Examples       the 15 examples of the contract above, in the order
                            6 single, 4 multiple, 3 numerical, 2 matching,
                            numbered from Example 1 whatever the body reached,
                            the tab naming the format ("Example 7 · Multiple
                            correct"). Each is Solution, Step 1, Step 2 … Answer
                            in .work__row. No "Type N" heads and no .work__why
                            since the conversion. Stepped maths, not prose
    3 Practice              one numbered run in the forms school papers use —
                            multiple choice, assertion–reason, very short,
                            short, long, case-based — grouped by .c-practice__sub
    4 Answers               the letter key and every other answer to the
                            practice questions, on a fresh page. Solved examples
                            carry their own answers; no wrong-option commentary

- **Nothing in the division repeats the chapter body, or answers it.** A
  question or example the chapter already sets is left out, whatever its
  source; so is one whose working prints the answer to a body question.
- **Stage 1 is kept word for word, except where it answers a body question.**
  Decided 16 September 2026: that rule wins. The repair is the smallest one
  that works — delete the sentence that points back at the body question
  when that is enough, and replace the item with one of the same kind when
  the reasoning itself is the answer. Class 6 Chapters 2, 4 and 9 each had
  such items.
- **A stage head is its numeral and its name.** No line under the name:
  `.c-stage__for` is not used, and a head without one centres on its mark.
- **The practice stage is named once.** It has no `.c-stage` head; its band
  carries the numeral: `<div class="c-practice__head"><span
  class="c-practice__num">3</span>Practice</div>`.
- **The Answers stage always starts on a fresh page.** Decided 16 September
  2026. Set part-way down a page, straight under the last practice question,
  it put the key to half the stage in view of a reader still working that
  question. `build/repack.mjs` enforces it — a `.c-stage` whose title reads
  *Answers* is always placed at the top of a page — so a refit keeps it. The
  short page this leaves behind the last question is logged, not padded.
  It is the one exception to *a stage starts where the previous one ends*
  below.
- **A case-based question carries no *Case study* label** — the group's sub
  head says so once. The `.c-case` opens the question on its number's line,
  its table flush left.
- These replace, for this shape, "everything after stage 1 is multiple
  choice", "one line saying what the stage is for" and "what the steps are
  never carry is a name" below.

Every chapter closes with ten or so pages of harder work on the same
material: the **Beyond the Book**, announced once by a band across the
measure and then carried by the components already in the library. It is
**four stages, not ten** — the first design had a stage a page, and seven
of the ten were question pages with no worked problem anywhere; a reader
was tested on a kind of question the book had never shown being solved.

**This is the older shape, which Classes 9 and 10 still carry.** Class 7
was rebuilt to the shape at the top of this section on 15 September 2026;
where the two disagree, that one is current. The stages here are

    1 Using What You Know five questions, each tried first and then
                          explained, through which the reader finds that
                          the identities work in less direct ways —
                          about two and a half pages
    2 Behind Each Answer  five multiple-choice problems, each put first and
                          solved after, with the reasoning as well as the
                          working — about three pages
    3 Problem Sets        three multiple-choice sets: A one identity each,
                          B two ideas together, C the whole chapter — about
                          three and a half pages
    4 Answers & Takeaways the key, why the other options are wrong, three
                          things to keep — the last page

**Everything after stage 1 is multiple choice**, because the papers this age
group sits are. The worked problems carry four options each and their
solutions say why the other options are there; the sets are options
throughout, with the assertion–reason and the two-student questions cast as
options too. A section that also set short answers and full proofs was doing
three jobs, and the reader has one examination.

**It is a lesson, not a method.** The section reads as the chapter carrying
on: a question is put, the reader tries it, and the explanation follows in
running text and ends with a plain observation — *notice that we did not
need to find $x$, $y$ and $z$*. The ideas the reader meets this way are:
use a condition directly with an identity; find an expression without
finding the variables; make a familiar form when none is visible; use a
value to disprove a claim; use *a square is never negative* to prove an
inequality or an impossibility. **None of them is named, numbered or listed
on the page.** An earlier draft opened with "Five Moves", Move 1 to Move 5,
and read as a coaching module; the reader was being handed a method to
memorise instead of a habit to form. The habit the section is for is the
question *what can I use from what I already know?*, and a reader forms it
by being asked it, not by being told it.

The same restraint applies to the prose. Words like *trap*, *hurried
solver*, *competitor's rough work*, *the question collapses* are the sound
of a coaching book, and the section uses none of them. A wrong option is
explained the way NCERT would explain it: what was done, and what was
missed.

A stage starts where the previous one ends, part-way down a page if that is
where it falls: the stages are the structure, the pages are only the paper.
**Ten pages is the budget, not the boundary.** Four of the six chapters run
to eleven or twelve, because the four stages came to that much, and the
division sorts last whatever it grows to. What is not allowed is to hold it
at ten by letting the last page clip, which is what five of the six were
doing before anyone rendered a proof that showed the foot of a page.
No stage name repeats a word of the division's own name. *Beyond* belongs to
the band at the top of stage 1 and to nothing else in the section.

**Every stage opens with `.c-stage`** — its number, its name, and one line
saying what the stage is for — so a reader can name the stage from the page,
not from the contents. Nothing here is a new hierarchy: the moves are `h3`
concept heads, the worked problems are `.c-problem` blocks tagged *Problem
1* to *Problem 5*, the sets are `.c-practice` bands, and the division is read
exactly the way the chapter before it is read, which is the whole reason it
does not feel like a coaching module bolted on.

**The reader thinks before reading.** Every question in stages 1 and 2 is put
first and answered after. In stage 1 it sits in a `.c-try` — a gold rule, the
question, and room beneath it for the attempt — and the explanation follows as
running text, as in the chapter. In stage 2 the question is a `.c-problem` and
its answer a `.c-solution`, and the two are one field: one rule opens the
problem, one hairline closes the answer, both in the action colour, and the
turn between them is the word *Solution* rather than a panel of its own. They
read as one item because they are one item. Neither carries an instruction to
try it first — the stage head says that once, and saying it again on every
question is the coaching register this section does without.

**A solution shows its working.** The reasoning is prose, but the algebra is
set as stepped working in `.work`, a step to a line — independent statements
flush (`--list`), a continued expression keeping its aligned indent — and not
buried in the paragraph. A solution written as paragraphs with one displayed
line at the end is a solution the reader cannot follow at the point they are
stuck. What the steps are never carry is a name: an earlier draft set every
solution in fixed rows — *notice, try, why, check, trap* — and the rows read
as a template to be filled rather than a solution to be followed.

**Both halves stay whole, so length is the thing to cut.** A page ends on a
finished item; a reader never turns the page in the middle of an answer. That
fixes the size of an item, and two of them have to fit a page — a little under
half the text block each — or every page in the stage prints half empty. When
a solution runs long, the option analysis is merged into one paragraph and the
linking prose trimmed. The number of problems is the last thing to cut, not
the first.

Stage 1 opens as the chapter continuing: one sentence on what the chapter
left the reader with, one on what changes in the question, and then the
first question. No examination is named anywhere in the section: a board's
name dates the book and tells the reader nothing about the mathematics.

What the library did not already have lives in `css/bridge.css`:

| | colour | |
|---|---|---|
| `.c-bridge` | teal | the division opener — the one solid full-measure block in the book, so the start of the division is unmistakable at arm's length |
| `.c-stage` | teal | one stage's head: a numeral in a solid mark, the stage name, and what the stage is for. `.c-stage__ask` follows it with the one line an examination paper would print — *Choose the correct option* |
| `.c-shift` | none | a relationship read both ways — *as $d$ rises, $c$ falls* over *as $d$ falls, $c$ rises*. Rules and two arrows; a reader who has seen the law only once tends to hear a proportion |
| `.c-results` | teal | four of the chapter's results as thumbnail marks in a row, so a reader sees what is available before starting. An index, not a figure: no text inside the drawings. The four-stage design does not use it — the moves are that index — but the ten-stage chapters still do |
| `.c-try` | gold | a question to try before reading on, used in stage 1, where the explanation follows as running text: a gold rule above, the question (with its options, if it has them), and room beneath for the attempt, closed by a hairline. It carries no tag — the stage head has already said to try it, and a tag on every question says it four more times. Not a panel — the key idea's rule-and-hairline in the attention colour — because the book has two panels and this is neither a worked instance nor a reflection |
| `.c-problem` | rust | one worked problem's question, in stage 2: a rule above in the action colour, a *Problem N* tag, the question and its options. The rule is what separates one problem from the next, so nothing closes it at the foot |
| `.c-solution` | rust | the answer to the `.c-problem` above it, and the other half of the same item: the word *Solution*, the reasoning in prose, and the algebra stepped in `.work`, closed by a hairline. Not a panel and not the action colour's tint — the question and the answer share one open field, or they read as two components for the two halves of one problem. Both blocks are whole: a page ends on a finished item |
| `.work--trace` | none | a modifier on `.work`: rows whose label sits on the first line rather than centred beside a block that runs to three. Used on the answer page, where each row is one question's *why the other options are wrong* |
| `.c-terms` | gold | what the test is made of — how many questions of each kind. **Never marks and never a time:** a book used in six classrooms cannot know either, and printing them would make the test look like an examination it is not. Three short spans, or it wraps; the four-stage design says the same thing in the stage head's own line instead |
| `.c-answers` | gold | the answer key — a set label in a fixed 29mm column, then its answers on one line where they fit |

The opener, the stage head and the results strip are **structure**: they say
where the reader is, which is the section tab's job. The terms and the answer
key are **attention**: both are the book speaking to the reader about a
question.

**No question carries a difficulty tag.** Set C's questions were once
labelled *Think*, *Apply* or *Challenge*; the labels were removed from every
chapter on 15 September 2026, and `.tier` went from `bridge.css` with them.
The sets still rise in difficulty from A to C — the set head says so, and
the order of the questions does the rest. `.c-shift` is the relationship itself, so it takes
no colour — rules and space carry it.

**One numeral colour, not four.** Every stage mark is the same teal, in every
chapter. A hue per stage would read as four unrelated modules, and would come
out differently in each chapter's palette; one mark with four numerals is what
makes the division read as one thing.

**Fitting the section.** The worked problems are panels and do not split, so
the stage-2 pages pack in whole problems, and the length of a trace row is
the lever when two of them run a few millimetres over. The sets are split
one question per block (`split-practice.mjs`) so they flow, and a figure a
set question refers to is placed as a block straight after that question,
between two `.c-practice--cont` runs, so the packer keeps them together. Chapter 4 is the built example of the
four-stage design; chapters 1–3, 5 and 6 still carry the ten-stage one until
they are rebuilt to this shape.

A Bridge page carries **`data-bridge`** on its `<section class="page">`. The
builder puts *· Beyond the Book* after the chapter title in the running
head, so a reader who opens the book anywhere in those ten pages knows what
kind of work they are looking at. Like `data-close` it is metadata, not a
style.

Everything else the division needs it already had. MCQ options are
`.c-parts--alpha`; statement lists are the plain roman `.c-parts`; the
assertion–reason key is a `.c-tip` carrying the chapter's own mark; data
questions are ordinary book tables; worked answers are `.work__row` with the
label reading *hint*, *solution*, *key idea*.

### A chapter now ends twice

The fill check exempts the last page of a build, because a chapter is allowed
to end part-way down. With this division after it, the chapter's own closing page
is no longer last and was being reported as short. A page that closes a
division carries **`data-close`** on its `<section class="page">`, and the
fill check forgives it for the same reason it forgives the last page. It is
metadata, not a style: there is nothing to see on the sheet.

## 10. Language — the maths editorial standard

**The difficulty belongs in the maths, not in the sentence.** Any word that is
hard for a reason other than the topic is a defect. The term being taught
stays; everything around it is plain spoken English. The readers are Indian
school students, many of them reading English as a second or third language.

Name the class from `chapter.json` before editing a chapter. A fix may not
bring in a word, symbol or idea above that class, or a term the chapter does
not already teach. A clean simplification that is correct for the class is not
a defect: flag an unqualified statement only where the chapter itself later
contradicts it. **A fix that makes a sentence longer or harder is not a fix.**

### Fix without asking

| code | the defect |
|---|---|
| L1 | a heavy word where a plain one works |
| L2 | more than one hard word in a sentence, where only one is the term being taught |
| L3 | a sentence a teacher would not say out loud at the board |
| L4 | two ideas in one sentence — split it |
| L5 | passive voice, or an instruction addressed to no one — address the student |
| L6 | stacked clauses, or a sentence long for any reason other than the mathematics it carries — length alone is not the defect (see *Plain wording, required terms*) |
| C1 | *certain*, *special*, *some*, *various* standing in for information the student needs |
| C8 | the narrator ordering a reaction — *surprisingly*, *notice that*, *the result is always* |

The replacements made across all 22 chapters, so the next chapter is edited
the same way:

| instead of | write |
|---|---|
| determine, determine whether | find, find out whether |
| consider | look at, take |
| hence, thus | so |
| compute, computing | work out, find |
| obtain | get |
| in order to · prior to · utilise | to · before · use |
| it can be observed that | you can see |
| express in the form | write as |
| tabulate | make a table of |
| commonest, commoner | most common, more common |
| treble | triple |
| arbitrary | random, a free choice |
| earns its keep | is useful, does its work |

### Words that stay

- ***determine*** where it means *fix, and fix uniquely* — "three points that
  are not collinear determine a triangle". *Find* says something else.
- ***satisfies*** an equation. It is the topic's own word and the one every
  examination paper uses.
- **The topic's own terms** — *subtend*, *locus*, *equidistant*, *congruent*,
  *transversal*. Introduce a term at its first use with `.term` and a gloss;
  do not replace it.
- ***Class***, not *Grade*: the usage of Indian schools and of both Class 8
  volumes.

### Plain wording, required terms

Easy words and exact terms pull against each other only when they are
asked of the same sentence. They are not: **the explanation is plain, and
the term and the rule are exact.** A student should be able to read every
sentence of an explanation aloud without stopping, and still meet every word
a test will use.

**Every chapter carries the terms of its topic.** The words a school paper,
NCERT or a guide uses for the topic — *predecessor*, *expanded form*,
*transversal*, *discriminant* — each appear in the body at least once. Each
is glossed with `.term` where it first appears, and stated in a key idea
where it names a rule. A check of all 56 maths chapters on 15 September 2026
found 74 of 440 such terms missing, most of them in Classes 7 and 8. Class 7
Chapter 1 used three of its ten: no *predecessor*, *successor*, *expanded
form*, *ascending*, *descending*, *face value* or *round off*. A student who
understands an idea but has never met its word cannot answer the question.

**Where NCERT uses a word of its own, give the usual word beside it once.**
*Ganita Prakash* says *letter-number*, not *variable*; school papers say
*variable*. Keep NCERT's word, because the class is taught in it, and add the
other where it first appears — *a letter-number, usually called a
**variable*** — then carry on with NCERT's. The same goes for *order of
operations*, which many schools still call BODMAS.

A term the syllabus has dropped is not missing. Class 10 prints neither
*terminating decimal expansion* nor the *division algorithm* for
polynomials; both were removed from the Class 10 syllabus in 2023.

**Two registers, on purpose.** The explanation is spoken English, by the
rules above. The key idea is the rule in the words a paper will use — *if
the next digit is 5 or more, round up; otherwise, round down.* A student
understands from the first and revises from the second. A key idea in the
explanation's loose words leaves nothing exact to learn. An explanation in
the key idea's words is the textbook register this standard exists to
remove.

**Simpler words, not simpler mathematics.** Keep what the class needs: the
conditions on a rule, every case a definition must include (C2), and the
reason a step works (M3). A shorter sentence that drops a condition is a
wrong sentence.

**Sentence length, measured.** The running prose of every chapter body,
measured on 15 September 2026:

| class | words a sentence | sentences over 20 words | reading grade |
|---|---|---|---|
| 6 | 11.0 | 5% | 4.0 |
| 7 | 12.3 | 11% | 4.7 |
| 8 | 17.0 | 33% | 6.8 |
| 9 | 15.9 | 28% | 6.6 |
| 10 | 14.9 | 22% | 5.9 |

The reading grade is Flesch–Kincaid, a formula built for native readers. Use
it to compare chapters, not to set an age.

Figures and headings are left out of the count; an early version of the
measure read diagram labels as prose.

Hard words are not the problem: words of three or more syllables are 5–8% of
the text in every class. Long sentences are far more common in Class 8 than
in Class 7 — a third of its sentences against one in ten — but **length shows
where to look. It does not show what is wrong.**

Fifty-six of Class 8's long sentences, spread across its fourteen chapters,
were read one by one:

| | of 56 | for example |
|---|---|---|
| long because the mathematics is | about 39 | *If a thing is built by making $a$ choices in turn, and each choice has $n$ options whatever the earlier ones were, then there are $n^a$ possibilities.* |
| long because of commentary | about 17 | *the step is where the marks are lost*; *writing it in powers is the first time it says so out loud* |

The second kind is hard for a reason a word count cannot see. It is the
narrator's opinion (C8), an idiom a second-language reader cannot decode —
*wearing different clothes*, *says so out loud* — or the coaching register
that §6a keeps out of Beyond the Book, which a chapter should not use either.
Split such a sentence in two and you have two sentences of commentary. The
fix is to cut it, or to say the plain thing it stands for.

**So there is no word limit.** A sentence is as long as what it carries. Ask
three things of it:

1. Does every part carry something the reader needs — a condition, a
   reason, a step, a quantity?
2. Does it say one thing, or several things that only make sense together,
   joined by *if … then* or *because*? Several unconnected things are L4.
3. Is every word literal? A figure of speech is a second hard word (L2), even
   in a short sentence.

A 35-word sentence that passes all three stays as it is. An 11-word sentence
that fails the third is a defect.

### Flag, do not fix

| code | the defect |
|---|---|
| C2 | a definition that excludes a case used later |
| C3 | a contradiction between two places — quote both |
| C4 | an instruction that cannot be followed as written, or allows a wrong result |
| C5 | a step or rule with no reason given |
| C6 | a claim asserted and never shown |
| C7 | an answer given away before the student works it, captions and figure labels included |
| M1 | notation used before it is introduced, or changed mid-chapter |
| M2 | a worked example that skips a step this class needs |
| M3 | a rule stated with no reason why it works |
| M4 | practice that only repeats the worked example's pattern |
| M5 | a word-problem context unfamiliar or irrelevant to an Indian school student |

**Never** change a number, an answer, a worked solution or a piece of notation
— flag it. Never delete a worked example, activity or question; never add new
content; never make the mathematics harder or more general. If a fix is not
obviously correct, flag it instead.

These limits are for a language edit. Adding what §5 asks for — an example,
a check, a missing term — is a separate authoring pass, done chapter by
chapter, and every number it adds is re-derived like any other.

### What no build check catches yet

Each of these reached a finished chapter and was found only by reading:

- `data-start` restarting at a question number already used in the set;
- the same question printed twice, or printed below a worked example that
  answers it;
- a figure whose `aria-label` is only its figure number;
- a summary point the chapter never states, or a stated result the summary
  leaves out;
- an ordinal reference — *the third question* — to `.c-try` bands, which carry
  no number;
- **a wrong number.** Re-derive every printed value, answer key included:
  three arithmetic errors shipped in sentences no reader had reason to doubt.

### After editing

Build the chapter, then run `orphans`, `check-labels` and `fit-options`.
A replacement can add a rendered line as easily as remove one. To tell whether
a fill or overflow change is yours, copy the chapter to a scratch directory,
revert the edit there, build, and compare the fill maps — never infer it from a
remembered build.

Record each chapter in `EDIT-LOG.md` beside its pages: class and chapter; a
FIXED table of *before · after · code*; a FLAGGED table of *location · code ·
what is wrong · what it needs*, worst first. Notes that span chapters go in
`CROSS-CHAPTER.md` at the repository root.

## 11. Class 6 trial — the `maths-clear` profile

### Maths reference revision — 21 September 2026

Figures and tables in all maths classes share a single chapter sequence in reading order:
Figure 4.1, Table 4.2, Figure 4.3, for example. Keep the type in every label
and update prose references together with captions. Repeated artwork gets
a new identifier at its new location. This includes Beyond the Book;
its figure and table numbers continue the chapter sequence.

Use `.c-figure-context` to keep a dependent question, explanation or worked
example with its visual as one fitting unit. It adds no border or new visual
style and lives in the shared `css/maths-tables.css`. General introductions may lead into a following-page figure; a facing
spread also keeps text and visual visible together. Recheck bound-book
folios after any pagination change.

The revised chapters opt out of keeping an entire exercise set together:
sets may continue in their numbered continuation blocks, while the question
and visual that depend on each other stay together. This avoids nearly empty
pages before long exercise sets. Panels themselves still never split.

Class 6 Mathematics is the first maths book set with three ideas taken from the
science volumes. A chapter opts in with `"design": "maths-clear"` in
`chapter.json`, which loads `css/maths-clear.css` after the house sheets.
Nothing in any other book changes.

1. **The chapter's own colour inks its furniture** — its entry in
   `CHAPTER_ACCENTS` in `build/build.mjs`: the numeral block, the rule under
   the opener, the running head and the folio bar.

   **This began as the opposite rule, and it was dropped on 16 September
   2026.** A Class 6 chapter declared no palette, so structure, action and
   attention were the book's three colours in every chapter, and a student
   learnt once what a worked example or a question looked like — which
   settled, for this book, the question §1 leaves open about whether a
   palette moves one working colour or all three, by moving none. Phase 1 of
   `PLAN-MATHS-CONSISTENCY.md` reversed it: every other class moves its
   working colours per chapter, and one class doing otherwise is the
   inconsistency the plan exists to remove.

   **Each Class 6 chapter now declares the palette matching its own accent
   slot** — 1 ember, 2 lagoon, 3 bronze, 4 cobalt, 5 olive, 6 indigo,
   7 moss, 8 violet, 9 fern, 10 amethyst. That mapping is not a taste: each
   palette's `--teal` is byte-identical to the accent that chapter already
   had, so the furniture and the structure colour come out one colour rather
   than two, no stylesheet changes, and the accent list's interleaving keeps
   consecutive chapters about 140 degrees apart without any further thought.
   Colour does not change how text breaks, so this needs no refit — but it
   needs a proof, because a palette never seen on these pages can put a pale
   accent behind small type.
2. **Running text is ragged-right, with no hyphenation.** A justified line full
   of maths cannot hyphenate, so its word spaces open into holes, and a
   second-language reader loses the line there.
3. **The tip disc is an outline**, not a filled badge — one stroke, no fill,
   as the science icons are drawn.

It is a trial. Judge it on proofs of Class 6 before moving any other book to
it. The bound-book shell does not load design sheets yet, so a volume bound
with `--book` prints the standard look until it does.

Class 6 maths chapters live in `pages/class-6/math-chNN-…`, because Class 6
Science already holds `ch01` to `ch04`; nothing parses the directory name. The
source textbooks — NCERT *Ganita Prakash*, marked "not to be republished" —
are kept for reference in `assets/sources/class-6/maths/`, which is
git-ignored. The pages are original LearnLab text that follows NCERT's order
of topics and questions; no sentence is copied from the source.

### The Class 6 page, and exercise sets kept whole

**Every Class 6 maths chapter is set on one master page:** finished size
196 × 276 mm, margins 22.5 mm top and bottom and 18 mm left and right. It is
`css/edition-196x276.css`, and a chapter declares it with
`"edition": "196x276"`. It was `class6` until Class 7 moved onto the same
page; it is named for its size, like `a4` and `b5`, so that neither class
reads the other's name in its `chapter.json`. The side margins are equal, so there is no gutter
allowance: the text block is 160 × 231 mm, and the figure steps are scaled
against that taller block as §6 requires. Class 6 Science keeps its own
trim for now.

**An exercise set never starts at the foot of a page and runs overleaf.** It
starts on a page where it fits whole. A chapter asks for this with
`"keepExerciseSets": true` in `chapter.json`, which `build/repack.mjs` reads:
the set is its band, every continuation block after it, and any figure between
two of its questions, and if that will not fit in the room left, the set
starts the next page. A set taller than a whole page still starts at the top
of one.

The white a moved set leaves behind is closed by writing, never by splitting
the set again: more context in the page it left, or one or two further
questions in the set before it. Writing into one page can move the gap to its
neighbour, so run `gaps` after every refit and follow it until no page but a
closing one is short. Every question added this way needs its answer checked,
and a question added to a Beyond the Book set needs its line in the answer key.

**Sums are set as mathematics** — `$1 + 1$` — everywhere, in questions as well
as in displays. Plain-text pluses beside KaTeX pluses print at two sizes on the
same page.

## 12. The maths-v2 trial — Class 6 Chapter 1 (25 September 2026)

A redesign tried on one chapter before anything else moves. A chapter opts
in with `"design": "maths-v2"`; it loads `maths-clear.css` and then
`css/maths-v2.css`, so it keeps everything maths-clear does. Only Class 6
Chapter 1 declares it. What it changes:

- **No brown.** Palette `pine` (deep green, bright orange, violet), made
  because every existing palette carries a brown or tan somewhere; the chapter
  sets `"accent"` to the same green so the furniture follows. The diagram
  tokens the palettes do not reach — the cube faces and `--dg-c` — are
  re-inked in maths-v2.css.
- **A drawn strip on the opener** (`.c-strip`): four small drawings in the
  book's own inks, not photographs. Generated by script; the sunflower's seeds
  sit on the golden angle.
- **Key idea as a printed definition box:** a double rule all round, the title set
  into the top rule, the idea one step up the type scale with balanced lines.
  Chosen from three framed options. A tinted panel with a side bar and rounded
  corners was tried first and removed as web UI; nothing in maths-v2 is rounded.
- **Exercise sets as one square-cornered tinted field under an orange band**, chapter sets
  only; By the Book and Beyond the Book keep the plain run.
- **Tables** with a solid structure-colour head row.
- **A split running head**: the verso names the chapter, the recto the
  section in force (or By the Book / Beyond the Book). Built in `stampPages`,
  only for maths-v2.

If approved, it rolls out chapter by chapter with the three-part conversion,
because each chapter has to be refit to it anyway.
