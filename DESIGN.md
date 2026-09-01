# LearnLab Textbook Design System

Every page is assembled from the components below. Nothing on a page decides
its own colour, type, stroke or spacing — those decisions live here, once.

The builder enforces it. A page file containing an inline `style`, a `<style>`
block, a hex colour, a `stroke-width` attribute, a font attribute or a private
`<marker>` is reported as a **design violation** on every build.

---

## 1. Colour — three working colours, used semantically

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
| **Spectral** `--font-body` | body | running text, equations, diagram labels |
| **Vollkorn** `--font-display` | display | headings, component labels, captions |

No third face may be introduced. Body sets at **500** — Spectral regular is too
light at 10.5 pt on warm paper — so emphasis and headings sit at **700**; at 600
they no longer outrank the text.

Numerals are **lining** throughout. Vollkorn defaults to oldstyle, which turns
`Fig. 4.1` into `Fig. 4.ı`.

### The scale

Seven sizes, named by role and never by number. **Nothing may sit off the
scale** — a literal `12pt` in a rule is a defect, not a nuance.

| token | size | used for |
|---|---|---|
| `--size-caption` | 8.5 pt | captions, hints, the aside in brackets |
| `--size-note` | 9.5 pt | panel text, exercises, legends, component tags, folio |
| `--size-body` | 10.5 pt | running text |
| `--size-concept` | 11.5 pt | concept headings, rubrics, the section numeral |
| `--size-section` | 15 pt | section headings |
| `--size-chapter` | 24 pt | chapter title |
| `--size-numeral` | 40 pt | chapter numeral |

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

| component | colour | panel? |
|---|---|---|
| `.c-keyidea` | teal | no — a heavy rule above, a hairline below |
| `.c-example` | rust | **yes** — a worked instance |
| `.c-reflect` | gold | **yes** — a question for the reader, disc on the corner |
| `.c-practice` | teal | no — a band header over questions |
| `.c-tip` | teal | no — a disc between two rules, one breath |
| `.c-figure` | — | no — a diagram and its caption |
| `.c-summary` | teal | no — a rule and a numbered list |

Three more — the Bridge opener, the difficulty tag and the answer key — are
added by §6a for the Foundation Bridge, and by nothing else.

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
`.c-figure--sm` · `--md` · `--lg` · `--xl` · `--full`. The printed widths
live in the tokens (51/62/72/87 mm on A4, one step smaller on B5), and
`--full` is the measure itself.

`--full` is for the one drawing that genuinely needs the whole measure: a
**ruled coordinate grid**, where the tick numerals collide long before the
figure starts to look large. A diagram that is not a grid does not get it.

A figure carries about **4.5 viewBox units per printed millimetre** — a
`--full` drawing has a viewBox 690 units wide, an `--xl` one 390. That is
what keeps a structural line the same weight on every page: strokes are
declared in viewBox units, so a figure drawn at a different density prints
a heavier or fainter line than its neighbour.

## 6a. The Foundation Bridge — a division, not a second book

Every chapter closes with ten pages of harder work on the same material: the
**Foundation Bridge**, announced once by a band across the measure and then
carried by the components already in the library. Its ten stages are

    B1 Beyond the Chapter    B6 Competitive-Style Thinking
    B2 Think and Reason      B7 The Challenge Zone
    B3 Connect the Concepts  B8 The Trap Room
    B4 Foundation MCQs, 1    B9 Foundation Test
    B5 Foundation MCQs, 2    B10 Answers, Solutions & Takeaways

and the point of the numbering is that a reader can name the stage from the
page, not from the contents. **B1 is prose, so it takes level-3 concept
headings; the question stages take a level-5 practice band whose head names
the stage; B10 takes level-3 headings and a summary.** Nothing here is a new
hierarchy — the Bridge is read exactly the way the chapter before it is read,
which is the whole reason it does not feel like a coaching module bolted on.

Three things the library did not already have, and they live in
`css/bridge.css`:

| | colour | |
|---|---|---|
| `.c-bridge` | teal | the division opener — the one solid full-measure block in the book, so the start of the Bridge is unmistakable at arm's length |
| `.tier` | gold | one question's difficulty (`Think` · `Apply` · `Challenge`), set as a tag so it cannot be misread as the first words of the question |
| `.c-answers` | gold | the answer key — a stage label in a fixed 29mm column, then its answers on one line where they fit |

The opener is **structure**: it divides the chapter, which is the section
tab's job. The tier tag and the answer key are **attention**: both are the
book speaking to the reader about a question. Each takes one colour, as
every other component does.

Everything else the Bridge needs it already had. MCQ options are
`.c-parts--alpha`; statement lists are the plain roman `.c-parts`; the
assertion–reason key is a `.c-tip` carrying the chapter's own mark; data
questions are ordinary book tables; worked answers are `.work__row` with the
label reading *hint*, *solution*, *key idea*.

### A chapter now ends twice

The fill check exempts the last page of a build, because a chapter is allowed
to end part-way down. With a Bridge after it, the chapter's own closing page
is no longer last and was being reported as short. A page that closes a
division carries **`data-close`** on its `<section class="page">`, and the
fill check forgives it for the same reason it forgives the last page. It is
metadata, not a style: there is nothing to see on the sheet.

## 7. Page grammar

How a page is assembled.

- **Rhythm.** Alternate dense explanation with a visual pause. Never stack two
  panels back to back; put running text between them.
- **Air.** A figure or an anchored equation gets `--space-rest` above and below.
  Diagrams are the thing a reader looks at; do not crowd them.
- **Fill 92–100%.** Under 88% is reported. The **last** page of a chapter is
  exempt — the content supplied so far is allowed to end part-way down.
- **When several pages run short, add the fills up before moving anything.**
  Three pages at 60% hold two pages of content: that is a repack, not padding.
- **Do not split a component across a page.** Move the whole thing.
- **Do not strand a section heading** at the foot of a page. A heading must
  seat **at least a sixth of the text block** — about five lines — beneath it,
  or it moves to the next page. Clearing the page edge by three lines still
  reads as stranded. `repack.mjs` enforces this; the white it leaves behind is
  the cheaper fault.
- **An exercise set is a natural page unit.** Prefer keeping one whole.

**Exercise sets that run over a page break** carry `data-start="n"` on the
second `<ol class="c-questions">` so the numbering continues instead of
restarting. A question the book marks as harder takes `class="hard"`: the star
goes in the marker, in rust, never in the question text.

## 7a. Two sheets: trim and bleed

`--bleed` emits a second PDF beside the reading one. Every page carries two
wrappers that are the page itself at trim size and change nothing there:

| | | A4 | B5 |
|---|---|---|---|
| `.page` / `.page__bleed` | what the press gets | 216 × 303 mm | 182 × 256 mm |
| `.page__trim` | the book as the reader sees it | 210 × 297 mm | 176 × 250 mm |

Everything is still positioned against the trim box, so no component knows
which sheet it is on. The chapter numeral and both footer bars deliberately run
off the edge; the bleed box is what stops them at exactly 3 mm.

**No crop marks, and no slug to hold them.** A press PDF carries the trim plus
its bleed and nothing else. The printer imposes the job and lays its own marks
over the sheet, so a second set from us is at best ignored and at worst mistaken
for the real ones. The page box is read from the tokens, not repeated in the
builder, and the build measures what Chrome actually wrote.

## 8. What the builder rejects

```
✗ p081.html: inline style attribute — use a component or a modifier class
✗ p069.html: hex colour literal — use a token (--teal, --rust, --gold, --dg-*)
✗ p078.html: <style> block in a page — diagram styling belongs in css/diagram.css
✗ p076.html: private marker — reference the shared url(#dg-arrow)
! collapsed escape in maths: a backslash arrived as a tab or a form feed
! missing backslash before "dfrac": the command name is there, the escape is not
! unpaired $: an opening delimiter with no partner swallows the text after it
```

If a page needs something the system does not have, **add it to the system** —
a component, or a modifier on one — rather than reaching for an inline style.
That is the whole point: the book stays one designed object instead of twenty
pages that each looked reasonable on their own.

## 8. Running a panel over a page break

A page must not ship a third empty because the next block will not fit
whole. **Text divides; pictures do not.**

- A **figure** is never split — half a diagram is unreadable, so a gap held
  open by one is accepted and left alone.
- A **worked example**, a **key idea** and a **reflect prompt** may run over
  the break: `--head` is the part that stays, `--tail` the part that
  continues. The join is squared off and its padding removed on both sides,
  so the two halves read as one field interrupted by the page edge. The tail
  carries no tab or title: it is the same panel resumed, not a new one.
- **Running text** may be broken mid-paragraph. Paragraphs here have no
  first-line indent, so a continued one is indistinguishable from a new one.

Split at a step boundary, never inside a line of working.

```bash
node build/close-gaps.mjs class-9/ch04-algebraic-identities   # divide panels
node build/flow.mjs       class-9/ch04-algebraic-identities   # divide prose
```

Both measure every trial with the real builder and keep the largest move
that does not overfill. `flow` refuses a move that fills one page by
emptying the next — that relocates the hole rather than closing it.

Run these **after** `repack`, never before: repack re-packs whole blocks
globally and will undo them.
