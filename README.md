# LearnLab Books

Print-ready maths textbooks. **Crown Quarto trim, 189 × 246 mm**, with an A4
edition alongside. One folder per class.

**Read [DESIGN.md](DESIGN.md) before writing a page.** Every page is assembled
from a locked component library; the builder reports a design violation for any
page that invents its own colour, type, stroke or spacing.

```
css/        the design system
              tokens.css      every colour, size, weight, stroke — the only source
              typography.css  two faces, five hierarchy levels
              components.css  the seven locked components
              diagram.css     the diagram vocabulary every figure must use
fonts/      self-hosted Spectral + Vollkorn (woff2)
assets/     vendored KaTeX
pages/      source — pages/<class>/<chapter>/pNNN.html
figures/    shared figure assets, per class
build/      builder + output (html, pdf, png proofs)
```

## Studio

The studio is the library, the viewer and the live preview in one:

```bash
node build/serve.mjs
```

Then open <http://localhost:5180/>. It lists every class, groups the chapters by
subject (from `subject` in `chapter.json`), and shows what has been built.
Pass a chapter to open straight into it:

```bash
node build/serve.mjs class-9/ch04-algebraic-identities
```

In a chapter you get:

| control | what it does |
|---|---|
| **Trim / Bleed** | the reading page, or the 230 × 317 mm press sheet — trim, 3 mm bleed and the marks |
| **Pages / Spreads / Signature** | one page at a time; verso-and-recto side by side (the only way to check the mirroring); or the press sheet, 8/16/32 pages up |
| **Fit / 50% / 100% / Actual size** | Actual size is true millimetres once you calibrate |
| **Calibrate** | hold a bank card to the screen and drag; every card is 85.6 × 54 mm |
| **Print…** | the browser dialog. Save as PDF honours the page size; a printer will scale to its paper |
| **Reading PDF / Print PDF** | download either artefact |
| **Build** | run the builder with `--pdf --bleed` and reload, without leaving the page |

The **Signature** view imposes the chapter onto a press sheet and reports the
page count, the signature count, how many blank pages the run leaves, the
imposed area and the standard sheet it fits with its waste percentage. Two
rules hold for any folder — facing pages on one side of a sheet sum to
(signature + 1), and the two sides of a leaf are consecutive — and the builder
asserts both before drawing. Which slot each pair takes depends on the fold
scheme, so it's a tool for checking structure, not a file to send to press.

Editing anything under `pages/` or `css/` rebuilds **that chapter** and reloads
the tab. `Ctrl+C` stops the server.

The book is shown in an iframe, so the studio's stylesheet and the book's can
never reach one another. For a quick look without the server, open
`build/<class>/<chapter>.html` in Chrome, or use the 2× proofs in
`build/<class>/<chapter>-proofs/`.

## Editions

One design system, three trims. `css/tokens.css` holds the standard — **Crown
Quarto, 189 × 246 mm**. An edition sheet overrides only the size-dependent
tokens: trim, margins, measure, type scale, figure widths, spacing rhythm.
Colour, components, hierarchy and the diagram vocabulary are shared.

A chapter is Crown Quarto unless its `chapter.json` names an edition:

```json
{ "class": "9", "number": "4", "title": "…", "edition": "a4" }
```

Every chapter in the book is Crown Quarto today. `css/edition-a4.css` is kept
and still works — name the edition and the builder, the bleed sheet, the
proofs and the studio all follow it.

The page breaks differ between editions — a bigger page holds more, so each
is fitted separately, and the sources here are fitted to Crown Quarto.
`build/repack.mjs` does the measuring; `build/sheet.mjs` is where every tool
gets the trim from, so none of them can be measuring a different page than
the one being printed.

## Palettes

A chapter names a `palette` in `chapter.json`, which loads
`css/palette-<name>.css` over the tokens — the same mechanism as an edition
sheet. Unlike an edition it moves **all three** working colours, because a
chapter palette is a whole harmony, not a recolouring.

```json
{ "class": "9", "number": "1", "title": "…", "palette": "ember" }
```

Each palette is a **triad**: structure at hue *h*, action at *h*+120°,
attention at *h*+240°. Every pair is 120° apart — as far as three hues can be
from one another — so no two roles on a page can be mistaken for each other.
The three also keep a fixed lightness ladder, structure darkest and attention
lightest, so they separate by value as well as hue and the hierarchy still
reads in a mono proof.

| ch | palette | structure | action | attention |
|---|---|---|---|---|
| 1 | `ember` | `#70391c` | `#1b7b5d` | `#8582b9` |
| 2 | `lagoon` | `#03526b` | `#915074` | `#8f8d50` |
| 3 | `bronze` | `#664203` | `#057977` | `#9a7bad` |
| 4 | `cobalt` | `#234c79` | `#994f59` | `#769460` |
| 5 | `olive` | `#564a02` | `#08758c` | `#aa769a` |
| 6 | `indigo` | `#404479` | `#98533d` | `#5c9877` |
| 7 | `moss` | `#405214` | `#306e9d` | `#b37483` |
| 8 | `violet` | `#553d71` | `#905b23` | `#47998f` |
| 9 | `fern` | `#20572f` | `#5365a1` | `#b5766c` |
| 10 | `amethyst` | `#643761` | `#7f6616` | `#4497a4` |
| 11 | `emerald` | `#035748` | `#6e5c9b` | `#b07c58` |
| 12 | `mulberry` | `#6f344c` | `#676f25` | `#5591b4` |
| 13 | `teal` | `#05555a` | `#83558b` | `#a2844d` |
| 14 | `garnet` | `#733435` | `#477740` | `#6d8abb` |

Chapter order interleaves the warm half of the ramp with the cool half, so
consecutive chapters sit roughly opposite one another and the thumb tabs down
the fore edge stay legible as an index.

`css/tokens.css` still holds the book default — teal, rust and gold. It is
not a triad: rust and gold are only 39° apart, which is why action and
attention have always looked like relatives there, and why a chapter that
went warm had three warm colours. A chapter that names a palette does not
inherit that problem.

## Build

```bash
node build/build.mjs class-9/ch04-algebraic-identities --pdf --png
```

| flag | effect |
|---|---|
| *(none)* | assemble HTML + run the overflow check |
| `--pdf` | print to PDF through headless Chrome |
| `--png` | render one PNG proof per page at 2×, for review |
| `--bleed` | also emit the press sheet: 230 × 317 mm — the trim, 3 mm of bleed, and crop marks in a 7 mm slug |
| `--book` | bind the whole class into one volume — continuous folios |

A bare class name (`class-9`) builds every chapter under it.

## One book

```bash
node build/build.mjs class-9 --book --pdf
```

Chapters built separately each start at folio 1. `--book` binds them into
`build/class-9/class-9-book.pdf`: chapters in number order, folios running
straight through, and a blank verso wherever a chapter would otherwise open
on a left-hand page.

Each chapter keeps its own palette. A palette file sets `--teal`, `--rust`
and `--gold` at `:root`, which is right for a chapter printed alone but would
let the last chapter recolour the whole volume — so in a book every page
carries `data-ch` and its palette is re-scoped to that. All chapters must
share one edition; the build refuses to bind two trims together.

## How a page works

Pages are **fixed boxes**, not reflowed text. Each source file is one printed
page, so what the proof shows is exactly what the PDF gets — no surprises at
page breaks. The trade is that you must fit content to the page yourself; the
builder tells you when you have not:

```
! page 2 overflows by 3.4mm — content is being clipped
```

Treat that as a build error. Fix it by tightening prose or moving a block to
the next page, not by shrinking type.

The build also reports how **full** each page is, because a page that trails
off into white is as much a defect as one that overflows:

```
~ page 79 is 62% full — 81mm of white at the foot
fill  63:99%  69:99%  70:100%  71:99%  72:95%  73:87%  74:98%
```

Aim for 95–100%. Anything under 88% is flagged, except the **last** page of a
chapter, which is allowed to end part-way down — and any page carrying
`data-close`, which ends a division and is forgiven for the same reason. When
several pages run short, do not nudge them one at a time — add up the fills.
Three pages at 60% hold two pages of content, and the fix is to repack, not to
pad.

A page fragment supplies only its own content. The builder stamps the
furniture — running head, folio, and the recto/verso flip — from
`chapter.json`, so folios stay correct when pages are inserted.

Interior pages carry the folio in the running head, on the outer edge, as the
reference book does. Openers take a quiet folio at the foot instead.

```html
<section class="page">
  <div class="page__body">
    <div class="page__main">  <!-- running text -->  </div>
  </div>
</section>
```

Variants: `page--opener` (no running head) · `page--haschead` (clears the
chapter head).

A page can declare its own number when pages are written out of order:

```html
<section class="page" data-folio="69">
```

Everything after it continues from that number. And the page that closes a
division — the last page of the chapter proper, before its Beyond the Book pages —
says so, which is what stops the fill check reporting it as unfinished:

```html
<section class="page" data-close>
```

## Grid and binding

| | Crown Quarto — the standard | A4 — an edition |
|---|---|---|
| trim | 189 × 246 mm | 210 × 297 mm |
| margins | top 22, bottom 17, **inside 28**, outside 21 mm | top 26, bottom 20, **inside 30.5**, outside 25.5 mm |
| measure | 140 mm, a single column | 154 mm, a single column |
| body type | Spectral, 10 pt / 1.42, **weight 500**, justified | Spectral, 11.5 pt / 1.43, **weight 500**, justified |
| text block | 140 × 207 mm | 154 × 251 mm |

**The book is bound, so the margins are mirrored, not symmetric.** The inside
margin is the text inset plus a `--gutter-allowance` (5 mm), because a reader
should never have to flatten the spine to reach the first word of a line. The
allowance is its own token: a printer quoting a different binding is answered
by changing one number.

That only works if the outside margin is the inset *alone*. Set it to the same
number as the inside and the allowance cancels out: the block sits dead centre,
and once binding has taken its few millimetres the inner margin is the narrower
of the two — the opposite of what was intended. A4 was symmetric at 28/28 until
this was measured on a rendered page; Crown Quarto was drawn with the
allowance in it from the start — 28 + 140 + 21 = 189.

**The measure is deliberately not wider.** 140 mm at 10 pt holds a median of
about **76 characters** per line, against the usual comfortable range of
45–75. It is already at the long end, so the side margins are what the line
length costs, not slack to be reclaimed.

**The type came down a step with the trim, and had to.** Held at 11.5 pt the
line would have run past 80 characters — but the deciding reason is the page,
not the line. A block's height goes as the square of the type size over the
measure, so type held still on a page 18% shorter makes every paragraph,
panel and worked example a tenth larger as a share of it. Two worked examples
that shared an A4 page will not share this one. 10 pt on 140 mm puts blocks
back in the proportion to the page that they had at A4.
Narrowing them would push the line past readable.

Every mirrored thing keys off `.page--verso`, which the builder sets from the
folio: margins, running head, foot bars, folio, and the whole chapter head.
**Test a verso whenever you change page furniture** — build the chapter one
folio later and read the proofs. A recto-only check proves nothing about how
the bound book behaves.

Anything running off the trim — the chapter numeral block, the foot bars —
overhangs by `--bleed` (3 mm), so a trim landing slightly off centre still
cuts through colour rather than white paper.

## Beyond the Book

Every chapter carries ten further pages after its own last page: the
**Beyond the Book**, a division that takes the chapter's material and asks
harder questions about it, in the way an examination outside school would.
No new syllabus is introduced — the depth comes from what the chapter already
proved.

The ten stages run in a fixed order, and the difficulty rises along it:

| | |
|---|---|
| **B1** The Idea Underneath | one relation the whole chapter turns on, carried by a figure, a two-way reading of the law, and four of the chapter's results as thumbnail marks |
| **B2** Think and Reason | assertion–reason against a fixed four-option key, then statement sets — objective throughout |
| **B3** Connect the Concepts | every question chains two of the chapter's results, or reaches into another chapter |
| **B4** Multiple Choice, Level 1 | 9–10, one step from one result |
| **B5** Multiple Choice, Level 2 | 9–10, two steps, and a figure to settle first |
| **B6** Competitive-Style Thinking | four named moves — *eliminate*, *check sufficiency*, *find the constraint*, *estimate first* — demonstrated in one line each, then drilled |
| **B7** The Challenge Zone | 5–8 problems, tiered `Think` → `Apply` → `Challenge` |
| **B8** The Trap Room | 10 Student A / Student B pairs answered (a)/(b)/(c)/(d), then the shapes of mistake behind them |
| **B9** The Mixed Test | 10–13 mixed questions, not sorted by concept, with what the paper is made of at its foot |
| **B10** Answers, Solutions & Takeaways | the key, two or three worked solutions each ending in a transferable idea, then the takeaways |

The pages are numbered `p101.html`–`p110.html` in the chapter's page directory,
so the division always sorts last and a chapter can grow to a hundred pages
without colliding with it. The page before `p101` carries `data-close`.

The design of the section — what was added to the component library for it, and
what was deliberately not — is in
**[DESIGN.md §6a](DESIGN.md)**.

## Design

The palette, the two typefaces, the five hierarchy levels, the components, the
diagram vocabulary and the page grammar all live in **[DESIGN.md](DESIGN.md)**.

The build enforces them. A page that carries an inline `style`, a `<style>`
block, a hex colour, a `stroke-width` attribute, a font attribute or a private
`<marker>` is reported:

```
✗ p081.html: inline style attribute — use a component or a modifier class
✗ p069.html: hex colour literal — use a token (--teal, --rust, --gold, --dg-*)
```

If a page needs something the system lacks, add it to the system — a component,
or a modifier on one — rather than reaching for an inline style.

## Figures

Generated art is prepared for print before use:

```bash
node build/prep-figure.mjs figures/class-9/_raw-name.png figures/class-9/name.png 62
```

That trims the flat border, resizes to 300 dpi at the width it will print, and
cuts the file size (7 MB → 0.6 MB on the first one). Keep the `_raw-` original
so a figure can be re-cut later. Figures are composited with
`mix-blend-mode: multiply`, which sinks the near-white ground of generated art
into the paper.

**Mathematical diagrams are not generated.** They are hand-authored SVG using
the vocabulary in `css/diagram.css` — exact geometry, labels set in the book’s
own type, and a wrong dimension fixable by editing a number.

## Maths

Write `$...$` inline and `$$...$$` for display. KaTeX renders at **build time**,
so the output HTML and the PDF contain no JavaScript.

## Traps already paid for

1. **`\dfrac` inline collides with the line below** in panels. Use `rac`
   inline; keep `\dfrac` for display maths.
2. **An opening `$` must not be followed by a space.** It is then never treated
   as an opener, and the delimiter swallows text up to the next `$` — possibly
   on another page. The build rejects a surviving `$`.
3. **A collapsed escape** (`	imes` arriving as a literal tab) still parses as
   valid TeX and renders as plausible nonsense. The build rejects control
   characters in maths.
4. **Relative paths in page content resolve from `build/<class>/`.** Anything
   rendering a page from another directory depth must render it from that same
   depth, or every figure and stylesheet silently misses.
5. **Never put `display: grid` on a list item** whose content is loose inline
   text — every fragment becomes its own grid cell and the item shatters into
   one word per line.
