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

Ink, rules and paper are neutral and belong to no component.

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

**Only two components are panels** — the example and the reflect prompt, both
of which the mockups called for. Everything else sits on the page, held by
rules and space. A tinted box with a rounded corner and a coloured bar down
one side is interface furniture; it is what made the book read as a
dashboard rather than a textbook.

A panel spans the **full measure**, with equal padding on both sides. The
example's tab sits astride its top-left corner — it is a label on the box, not
a column the text has to make room for. Indenting every line of an example to
clear a one-line tab throws away 33mm of measure and leaves a dead strip of
The reflect box follows the same rule: its disc and title band sit astride the
top edge as one unit — the disc caps the band rather than floating beside the
box — so the text keeps the full measure there too.
tint down the left of the page.

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
sits in running prose, is set inline size (`rac`). Display fractions
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

**One arrowhead in the whole book.** The builder puts a single `#dg-arrow`
marker in the page shell; every figure references it.

**Size comes from a scale**, not from a per-figure pixel width:
`.c-figure--sm` 48 mm · `--md` 58 mm · `--lg` 68 mm · `--xl` 82 mm.

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
- **Do not strand a section heading** at the foot of a page.
- **An exercise set is a natural page unit.** Prefer keeping one whole.

**Exercise sets that run over a page break** carry `data-start="n"` on the
second `<ol class="c-questions">` so the numbering continues instead of
restarting. A question the book marks as harder takes `class="hard"`: the star
goes in the marker, in rust, never in the question text.

## 7a. Two sheets: trim and bleed

`--bleed` emits a second PDF beside the reading one. Every page carries two
wrappers that are the page itself at trim size and change nothing there:

| | | |
|---|---|---|
| `.page` | the sheet the press prints | 196 × 270 mm |
| `.page__bleed` | artwork, clipped 3 mm past the trim | 182 × 256 mm |
| `.page__trim` | the book as the reader sees it | 176 × 250 mm |

Everything is still positioned against the trim box, so no component knows
which sheet it is on. The chapter numeral and both footer bars deliberately run
off the edge; the bleed box is what stops them at 3 mm and keeps the slug clear
for the crop marks. Marks run from the bleed edge outward, so they can never
cross artwork, and the slug is painted white rather than inheriting the preview
backdrop. The page box is read from the tokens, not repeated in the builder, and
the build measures what Chrome actually wrote.

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
