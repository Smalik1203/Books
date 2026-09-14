# LearnLab Textbook Design System

Every page is assembled from the components below. Nothing on a page decides
its own colour, type, stroke or spacing — those decisions live here, once.

The builder enforces it. A page file containing an inline `style`, a `<style>`
block, a hex colour, a `stroke-width` attribute, a font attribute or a private
`<marker>` is reported as a **design violation** on every build.

**The design system is three files.** Read this one, then the one for the
subject you are working in:

| file | holds |
|---|---|
| **DESIGN.md** — this file | what every page in every subject obeys: page grammar, the two sheets, the cover, what the builder rejects, and why a panel is never divided |
| [DESIGN-MATHS.md](DESIGN-MATHS.md) | the mathematics volumes: colour, type, hierarchy, the component library, diagrams, Beyond the Book, and the language standard |
| [DESIGN-SCIENCE.md](DESIGN-SCIENCE.md) | the science volumes: the science components, the Class 6 editorial profile, activity illustrations, and the two science contracts it points to |

**Section numbers are kept across the three files.** They were one file, and
§6a still means Beyond the Book, §7b still means the cover; only the file a
section lives in has changed. That is why this one starts at §7.

The tokens — trim, margins, type scale, spacing — belong to both subjects and
live in `css/tokens.css` and the edition sheets. A literal size or colour on a
page is a defect in either subject.

---

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

| | | Crown Quarto | A4 | B5 |
|---|---|---|---|---|
| `.page` | the sheet the press prints | 209 × 266 mm | 230 × 317 mm | 196 × 270 mm |
| `.page__trim` | the book as the reader sees it | 189 × 246 mm | 210 × 297 mm | 176 × 250 mm |

Everything is still positioned against the trim box, so no component knows
which sheet it is on. The chapter numeral and both footer bars deliberately run
off the edge; the bleed box is what stops them at exactly 3 mm.

**No crop marks, and no slug to hold them.** A press PDF carries the trim plus
its bleed and nothing else. The printer imposes the job and lays its own marks
over the sheet, so a second set from us is at best ignored and at worst mistaken
for the real ones. The page box is read from the tokens, not repeated in the
builder, and the build measures what Chrome actually wrote.

## 7b. The cover — one sheet, its own system

A cover is not a page. It has no text block, no folio, no running head and no
measure, and its sheet is back + spine + front rather than one trim. So it gets
`css/cover.css` and `build/cover.mjs` instead of bending `page.css` around it.

```
node build/cover.mjs class-9/maths-part1 --png
node build/cover.mjs class-9 --pdf --bleed        (every cover under the class)
```

What it keeps from the book: the tokens, the two faces, and the type scale.
Every size on the wrap is `var(--size-*)` or a scale token times a factor — the
same lint the interior gets. What it does not keep is the chapter palette. A
cover belongs to the series, not to a chapter, so the palette sheets do not
reach it; the jacket ink is its own short list, and `.jacket--night` is a second
finish of the same layout rather than a second layout.

| | | Crown Quarto | A4 | B5 |
|---|---|---|---|---|
| `.jacket__back` | blurb, claims, LearnLab panel, trade furniture | 189 mm | 210 mm | 176 mm |
| `.jacket__spine` | bulk, not taste — see below | `--spine-w` | `--spine-w` | `--spine-w` |
| `.jacket__front` | title and artwork | 189 mm | 210 mm | 176 mm |
| **wrap, trim** | back + spine + front | **393 × 246** | **435 × 297** | **367 × 250** |
| **wrap, plus bleed** | 15mm on all four cut edges | **423 × 276** | **465 × 327** | **397 × 280** |
| **wrap, press sheet** | plus a 7mm slug holding the marks | **437 × 290** | **479 × 341** | **411 × 294** |

The wrap widths above are at a 15mm spine; the spine is bulk, so they move
with the page count. A Crown Quarto wrap is a little wider than SRA3 and
shorter than it — no standard sheet fits it, which is normal for a cover and
is what the press sheet with its marks is for.

**The wrap's bleed is not the page's.** An interior sheet is cut and that is
the end of it, so `--bleed` is 3mm. A wrap is cut and then folded round the
board, and what turns in at the edges has to be ink and not bare paper, so
`--jk-bleed` is **15mm**. `body.cover` points `--bleed` at it, which is why
every bleed rule in `cover.css` follows without being touched, and
`cover.mjs` sizes the press sheet from the same token so the layout and the
media box cannot drift apart.

**The marks on the wrap were measured and left as they are.** They look
detached beside a chapter's — hard against the sheet edge, a long way from
the line they denote — and they are not. `cropMarks` in `build.mjs` and
`coverMarks` in `cover.mjs` are the same function: a mark starts at the bleed
edge and runs 5mm outward into the slug, so it can never print over artwork.
On a 437 × 290 sheet that puts the trim at 22 / 22 / 415 / 268 with twelve
marks, each on a trim or a fold line and none of them touching the jacket.
What differs is the bleed. A page bleeds 3mm, so its marks stand 3mm out and
visibly bracket the trim; a wrap bleeds 15mm, so a 5mm tick sits that far from
its own cut line and reads as furniture at the sheet edge. Offset equals bleed
is the standard rule and the reason for it is exactly that a shorter offset
would put the mark on the bleed. Reopen it with the check
(`npm run check:studio`, *Cover — the press sheet, and the marks on it*)
rather than from the proof.

**One thing to settle before the cover goes to press.** The 15mm above is
justified as a turn-in, which is a case binding; `cover.json` declares
`caseAllowance: 0.5`, which is a limp card cover. They describe different
books. If it is perfect-bound the wrap is cut flush and wants 3–5mm like any
other cut edge — the press sheet becomes 413 × 266 and the marks land 3mm out,
like a chapter's. If it is case-bound the 15mm is real, but then the cut is at
423 × 276 and the 393 × 246 lines are board-edge folds, which nothing on the
sheet marks as folds, and the allowance is too thin for two boards. Neither
reading makes the sheet as printed today wrong — the marks sit outside the
artwork either way — so this is a question for the printer, not a fault to fix.

**The spine is bulk**: pages ÷ 2 × caliper, plus the case. `spineWidth` in
`cover.json` overrides that when a printer quotes its own stock — this cover
declares **15mm** against a computed bulk of 12.4mm — and the builder then
prints both, because a spine declared once and left while the book grew is
exactly the spine that goes to press wrong.

Nothing on the wrap is typed in millimetres that depends on the trim. The
margin and the back panel's column are fractions of `--trim-w`, the title's
drop is a fraction of `--trim-h`, and the artwork keeps its own coordinate
space and is scaled to whatever panel it lands on — the builder stamps
`--jk-art-w` so its labels still convert to printed millimetres.

**Directions and finishes.** A *finish* repaints the cover: it is the twelve
front tokens, the ground tokens and the four working colours, and nothing
else. If a finish needs a rule as well as a value, the contract is short a
token and the fix is to add one. A *direction* rebuilds it — its own display
face, its own artwork, its own arrangement of the front — and shares the back
and spine markup, which follow on tokens alone.

**In practice a direction swallows the finish, and that is worth knowing before
you set one.** Each direction block declares the ground and front tokens itself
and sits later in this stylesheet than the finishes, so at equal specificity it
wins: `night`, `solar`, `cobalt` and `vivid` all produce a byte-identical proof
of an `arc` cover. Class 9 declares `night` and is painted by `arc` regardless.
It could be otherwise — the back palette could move to `.jacket` and leave
directions owning the front alone — but a shared block would have to sit either
before the finishes, where a finish would then repaint the back, or after them,
where it would stop a finish repainting anything. Each direction is
self-contained for that reason.

**The back panel's content is the series'; its colour is the direction's.**
The blurb, the four claims and the foot are the same in every book — they live
in `covers/<class>/_shared/` and are quoted, not copied. What changes with the
direction is the palette they are set in, and it changes without a line of
markup, because every rule on that panel reads a token. The only colours
written down there are three `#ffffff`: the icon glyphs, and the two white
tiles the QR and the barcode need on any ground.

`comb`, Class 8's, is the worked example. It floods the front with a deep green
where `arc` has cream, and takes the same green for the back's deep half and
for the spine, so the colour runs from the front round the shelf edge and into
the foot of the back, leaving the back's upper half as the one light area —
which is where the words are. Arc's spine rule reasons that the spine should
read as part of the front rather than as a strip of the back; comb applies the
same reasoning to a dark front and arrives at the opposite panel.

`node build/cover-swatch.mjs <direction>` lays every candidate colourway on one
sheet at the same size in the real stylesheet. Comparing covers one build at a
time compares a colour in front of you against one you saw ten minutes ago.

**Three numbers the build works out rather than trusting the source:**

- **the spine**, from `pages`, `paperCaliper` and `caseAllowance`. A spine typed
  by hand is a spine that is wrong the next time the extent changes. A printer
  who has measured the stock overrides it with `spineWidth`.
- **the ISBN check digit**, recomputed from the first twelve and used in both
  the printed ISBN and the bars. The build says when it differed.
- **the EAN-13 bars themselves**, including the 11- and 7-module quiet zones,
  which are part of the symbol and not padding around it.

The QR is the one thing it cannot generate. Until `cover.json` points at a real
one, a placeholder is drawn, every build says so, and `--bleed` **refuses to
write a press sheet** — `--allow-placeholder` is the deliberate way past. A
placeholder that looks like a QR is exactly the kind of thing that ships.

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

## 9. A panel is never divided over a page break

A page must not ship a third empty because the next block will not fit
whole. But of the two ways to answer that, only one is open.

**Nothing in a box may be cut.** A figure, a worked example, a key idea, a
tip, a Think and Reflect, a solution, a summary — each goes whole on one
page or moves whole to the next.

There were once `--head` and `--tail` modifiers on example, key idea and
reflect, and a `close-gaps.mjs` that spent them to buy back a short page.
The join was squared off so the two halves would read as one field
interrupted by the page edge. Seen side by side they do not: the reader
gets an open-bottomed tray at the foot of one page and a lidless one at the
head of the next, with the folio, the fold and the running head set between
two halves of a single thought. Four shipped that way — an example, a key
idea and two Think and Reflects.

So the modifiers are gone from `components.css`, `close-gaps.mjs` and
`split-panel.mjs` are deleted, `splitExample` in `fragment.mjs` throws, and
**the builder reports `--head` or `--tail` in a page as a design
violation**.

Two things still divide, and both are lists rather than boxes:

- **Running text.** Paragraphs here have no first-line indent, so a
  continued one is indistinguishable from a new one.
- **An exercise band.** `.c-practice` is a coloured head over an open list,
  not a panel, so a numbered list continues overleaf under a
  `.c-practice--cont` block that repeats no head.

```bash
node build/flow.mjs          class-9/ch04-algebraic-identities   # divide prose
node build/split-practice.mjs pages/class-9/ch04-algebraic-identities
```

`flow` measures every trial with the real builder and keeps the largest
move that does not overfill. It refuses a move that fills one page by
emptying the next — that relocates the hole rather than closing it.

Run these **after** `repack`, never before: repack re-packs whole blocks
globally and will undo them.

Everything else closes one way only: **edit the prose at the join.** Write a
few more lines into the short page, or take a few out of what precedes the
panel so the panel comes up. It is slower than a tool and it is the only
repair that costs the reader nothing.
