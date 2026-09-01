# LearnLab Books

Print-ready maths textbooks. **A4 trim, 210 × 297 mm**, with a B5 edition
alongside. One folder per class.

**Read [DESIGN.md](DESIGN.md) before writing a page.** Every page is assembled
from a locked component library; the builder reports a design violation for any
page that invents its own colour, type, stroke or spacing.

```
css/        the design system
              tokens.css      every colour, size, weight, stroke — the only source
              typography.css  two faces, five hierarchy levels
              components.css  the eight locked components
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

Then open <http://localhost:5173/>. It lists every class, groups the chapters by
subject (from `subject` in `chapter.json`), and shows what has been built.
Pass a chapter to open straight into it:

```bash
node build/serve.mjs class-9/ch04-algebraic-identities
```

In a chapter you get:

| control | what it does |
|---|---|
| **Trim / Bleed** | the reading page, or the 196 × 270 mm press sheet with crop marks |
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

One design system, two trims. `css/tokens.css` holds the standard — **A4,
210 × 297 mm**. An edition sheet overrides only the size-dependent tokens:
trim, margins, measure, type scale, figure widths, spacing rhythm. Colour,
components, hierarchy and the diagram vocabulary are shared.

| chapter folder | edition | trim | pages |
|---|---|---|---|
| `ch04-algebraic-identities` | A4 (standard) | 210 × 297 | 29 |
| `ch04-algebraic-identities-b5` | B5 | 176 × 250 | 30 |

A chapter is A4 unless its `chapter.json` names an edition:

```json
{ "class": "9", "number": "4", "title": "…", "edition": "b5" }
```

The page breaks differ between editions — a bigger page holds more, so each
is fitted separately. `build/repack.mjs` does the measuring.

## Build

```bash
node build/build.mjs class-9/ch04-algebraic-identities --pdf --png
```

| flag | effect |
|---|---|
| *(none)* | assemble HTML + run the overflow check |
| `--pdf` | print to PDF through headless Chrome |
| `--png` | render one PNG proof per page at 2×, for review |
| `--bleed` | also emit the press sheet: 196 × 270 mm, 3 mm bleed, crop marks |

A bare class name (`class-9`) builds every chapter under it.

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
chapter, which is allowed to end part-way down. When several pages run short,
do not nudge them one at a time — add up the fills. Three pages at 60% hold
two pages of content, and the fix is to repack, not to pad.

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

Everything after it continues from that number.

## Grid and binding

| | |
|---|---|
| trim | 176 × 250 mm |
| margins | top 23, bottom 17, **inside 23**, outside 19 mm |
| measure | 134 mm, a single column |
| body type | Spectral, 10.5 pt / 1.468, **weight 500**, justified |

**The book is bound, so the margins are mirrored, not symmetric.** The inside
margin is the text inset (18 mm) plus a `--gutter-allowance` (5 mm), because a
reader should never have to flatten the spine to reach the first word of a
line. The allowance is its own token: a printer quoting a different binding is
answered by changing one number.

Every mirrored thing keys off `.page--verso`, which the builder sets from the
folio: margins, running head, foot bars, folio, and the whole chapter head.
**Test a verso whenever you change page furniture** — build the chapter one
folio later and read the proofs. A recto-only check proves nothing about how
the bound book behaves.

Anything running off the trim — the chapter numeral block, the foot bars —
overhangs by `--bleed` (3 mm), so a trim landing slightly off centre still
cuts through colour rather than white paper.

## Design

The palette, the two typefaces, the five hierarchy levels, the eight components,
the diagram vocabulary and the page grammar all live in **[DESIGN.md](DESIGN.md)**.

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
