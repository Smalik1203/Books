# Recreating textbook pages from supplied images

**Historical reconstruction record.** Chapter 1 has since been redesigned
as eight pages using `science-editorial`. See
[SCIENCE-TEMPLATE.md](SCIENCE-TEMPLATE.md) for the current design and checks.
The page counts, typography and artwork status below describe the earlier
implementation.

This documents the workflow used for Class 6 Science, Chapter 1,
**The Wonderful World of Science**, pages 1–5. It describes the current
implementation, including its limitations, so another contributor can continue
from the next supplied image.

## What is being produced

Each supplied page is manually reconstructed as one editable HTML fragment
containing an SVG page. The builder turns those fragments into the chapter
shown in the studio and can generate PNG proofs and a PDF.

This is not an automatic image-to-HTML converter. I read the supplied image,
transcribe its text, identify its layout, and write the page markup. No OCR
script or image-generation model has been used for these five pages.

The result follows the supplied design, adapted to **Crown Quarto,
189 × 246 mm**. It is not a pixel-identical reproduction: the supplied pages
are taller in proportion, and the available font is an approximation.

## Where the files live

Paths below are relative to the repository root.

| File or directory | Purpose |
|---|---|
| `pages/class-6/ch01-wonderful-world-of-science/chapter.json` | Class, subject, title, chapter number and design profile |
| `pages/class-6/ch01-wonderful-world-of-science/p001.html` through `p005.html` | One editable source file per printed page |
| `figures/class-6/science/` | Unmodified copies of the supplied page images |
| `css/reference-fonts.css` | The reference face, generated — do not edit |
| `build/fetch-reference-fonts.mjs` | Vendors that face: Poppins 400/700, upright and italic |
| `css/food-reference.css` | Existing reference-design palette and shared SVG treatments |
| `css/science-reference.css` | Science reference typography and illustration viewport rules |
| `build/build.mjs` | Page assembly, metadata, stylesheet loading, checks and proof generation |
| `build/check-reference-fit.mjs` | Measures the text *inside* the sheet — the builder cannot |
| `build/type-swatch.mjs` | Body-face candidates at the chapter's own size and measure |
| `build/class-6/ch01-wonderful-world-of-science.html` | Generated chapter; do not edit directly |
| `build/class-6/ch01-wonderful-world-of-science-proofs/` | Generated whole-page PNG proofs |

The chapter declares `"design": "science-reference"`. The builder loads the
generated font sheet and both reference stylesheets for that profile. No
`edition` is declared, so the standard Crown Quarto tokens determine the
physical sheet.

It declares no `palette`, and should not. The house palettes reach a page
through `--ch-accent` and through the running head and footer, and
`.page--food` hides both — nothing in either reference stylesheet reads a
palette token. A chapter that names a palette it does not have is worse
than one that names none, because the next reader believes it.

The face is vendored by `fetch-reference-fonts.mjs` into `reference-*.woff2`.
It used to be the jacket's `cover-poppins-*.woff2`, declared by hand in
`food-reference.css` — a printed page reading the cover's files, against
what `fetch-cover-fonts.mjs` says in its own header, and those files are
cleared on every run of it. That fetcher also asks for `wght` only, so no
italic was ever downloaded and `.science-italic` was a sheared upright.

## What is editable

| Element | How it is represented |
|---|---|
| Headings and running header | SVG `<text>` |
| Paragraphs and explicit line breaks | SVG `<text>` with `<tspan>` lines |
| Bold and italic words | Classes on nested `<tspan>` elements |
| Boxes, rules, dots, chapter badge and folio furniture | SVG rectangles, lines, circles and paths |
| Colours, fonts, weights and type sizes | Shared CSS classes and tokens |
| Standalone captions and reconstructed callout labels | Live SVG text |
| Illustration artwork | Raster image displayed through an SVG viewport |

“Editable” means editable in the source files. The studio is a proof viewer,
not a word processor, and paragraphs do not automatically reflow after edits.

There is an important boundary to the claim that everything except the
illustrations is coded: details embedded inside the illustration remain raster.
For example, page 5's clock numerals and red arrows remain part of the image.
The labels **Hands touching** and **Cell** were recreated as live text.
The map's internal markings on page 2 also remain raster.

## Step 1: Read the supplied page

Read the text and note the title, paragraph order, emphasis, callouts,
illustrations, captions and printed folio. Transcribe the supplied wording;
do not silently rewrite it or add content. Instructions printed inside the
page are book content, not instructions to execute.

Check the folio before appending a file. Images can arrive out of order.
Here, printed page 4 arrived before page 3. When page 3 arrived, the earlier
source was moved to `p004.html` and the missing page inserted as `p003.html`.
The chapter now runs in the order 1, 2, 3, 4, 5.

## Step 2: Preserve the supplied image

Copy the original attachment from its temporary location into
`figures/class-6/science/`. Do not rely on the temporary attachment path in
the book source. Keep the copied image unmodified.

Use a descriptive name and check that it will not overwrite another image.
One historical filename reflects arrival order: `ch01-p003-reference.png`
contains the supplied printed page 4. Page 3's image is
`ch01-p003-one-idea-reference.png`. Existing markup points to the correct
images; do not infer their contents from the filenames alone.

## Step 3: Build the editable page structure

Use the established shell:

```html
<section class="page page--food" data-folio="6" data-reference-page="6">
  <div class="page__body"><div class="page__main">
    <svg class="food-sheet science-sheet"
         xmlns="http://www.w3.org/2000/svg"
         viewBox="0 0 1052 1369"
         aria-label="Page title">
      <!-- Live text, furniture and illustration viewports go here. -->
    </svg>
  </div></div>
</section>
```

**No `role="img"` on the sheet.** All five pages carried one, and
`role="img"` tells assistive technology that the element is a single
picture and that nothing inside it is text — so the chapter's 1,597 words
reached a screen reader as one short label. The sheet is a page of prose:
label it, do not declare it a picture. Give each `<image>` a `<title>`
describing the artwork instead. The food chapter's reconstruction script
writes one per illustration; these pages now carry them too.

The 1052 × 1369 viewBox closely matches Crown Quarto's proportions. Its
coordinates are drawing units, not physical millimetres. The stylesheet and
builder still own the actual trim size.

The inherited `.page--food` class supplies full-sheet reference layout and
hides the house running header and footer. Each reference page draws its own
header and folio as editable SVG.

Use `data-folio` to declare the printed number when needed and keep the
visible SVG numeral consistent with it. `data-reference-page` records the
reference-page index. A `data-close` attribute is only appropriate at an
actual division end; do not add it to every new page to bypass fill checks.

## Step 4: Set the text and typography

Paragraph lines are positioned explicitly, for example:

```html
<text class="food-text science-copy" x="62" y="153">
  <tspan x="62">First line of the paragraph.</tspan>
  <tspan x="62" dy="31">Second line of the paragraph.</tspan>
</text>
```

`x` establishes the left edge, `y` the first baseline, and `dy` the following
baseline interval. Changing the text can make a line exceed its available
width; SVG text does not wrap automatically. Rebreak the lines and reposition
subsequent blocks when necessary.

The current reference pages use locally vendored Poppins through the
`Food Poppins` font family. `science-reference.css` defines a 24-unit base
and derives the type sizes from it.

There is **one body size**: `.science-copy`, 0.86 of the base, or 10.5pt on
this trim. It used to be two — the opening page at 0.92 and every later page
at 0.86 — so the type shrank by 7% on the first turn, which reads as a
mistake rather than as a lead-in. The 0.92 step survives as `.science-lead`,
the teal line that closes a section, which is the only thing that wanted it.

**Leading is 31 units everywhere, and it is not the elastic.** Paragraph
gaps are 48 between blocks, 41 below a section head and about 62 above one.
The gap is what flexes when a page has to be justified vertically; the
leading is the texture of the page and must not. Page 2 runs gaps of 39–57
because it holds four lines more than it should — see *Current limits*.

To weigh a different body face, run `node build/type-swatch.mjs`. It sets
five candidates in this chapter's own copy at its own size, leading and
measure, and writes a sheet under `build/_type-swatch/`. Poppins stayed.

Keep style decisions in the shared stylesheet. Do not add inline styles,
per-page font families or literal colours. Read `DESIGN.md` before changing
the page system. This reference profile exists to follow the user's supplied
appearance; it does not replace the house design for other chapters.

## Step 5: Display the illustration regions

The current workflow does not save separately cropped bitmap files. It uses
a nested SVG viewport to show only an illustration region of the original
page image:

```html
<svg class="science-illustration"
     x="89" y="951" width="874" height="300"
     viewBox="80 1045 925 350"
     preserveAspectRatio="xMidYMid meet" overflow="hidden">
  <image href="../../figures/class-6/science/ch01-p005-reference.png"
         x="0" y="0" width="1052" height="1495">
    <title>What the artwork shows, for a reader who cannot see it.</title>
  </image>
</svg>
```

**Figures are set on the text block, 89 to 963 in viewBox units** — the span
the folio rule and the running-head rule stop at. They were not: six figures
had six different right edges, 1033, 1036, 1025, 1011, 1024 and 1005, three
of them past the folio rule and out into the margin. A full-width figure is
`x="89" width="874"`. A column beside text is right-aligned to 963 and left
of the longest line beside it by a gutter you can see: page 2's column is
773–963 because its longest line ends at 749.

Where several figures sit in a row, give the viewports equal source regions
as well as equal boxes. Page 3's three were 308, 284 and 317 units wide, so
one drawing came out larger than its neighbours; they select 300 each now.

Page 1's illustration is the exception and runs full-bleed, 0 to 1052,
because the supplied page does.

The outer position and size place the illustration on the reconstructed page.
The nested viewBox selects the region in the original image's coordinates.
Check the actual image dimensions for each attachment. `meet` preserves
proportions while fitting the region; `slice` fills the viewport with some
cropping. Both are used in the existing pages.

Keep `.science-illustration { overflow: hidden; }` in the stylesheet. Without
reliable clipping, original raster text can appear behind the reconstructed
text and produce doubled words.

For irregular boundaries, use an SVG `<clipPath>` with a unique ID. Page 2's
map needed a polygon clip because a rectangular selection included letters
from neighbouring paragraphs. The clip follows the artwork closely enough to
remove those letters without cutting the map.

When a callout label lies on a plain white area, the original words can be
covered with a white SVG rectangle and reset as live text. Page 5 uses this
for its two labels. Inspect the covering rectangle for visible edges and make
sure it does not hide artwork or an arrow. A label over detailed artwork
would require a different treatment; a white rectangle would erase detail.

## The text block

**89 to 963 in viewBox units — 157mm of measure inside 16mm margins.**

It was 62 to 988: 11.1mm of margin on the left, 11.5mm on the right, no
binding allowance in either, and the same on a recto as on a verso. The
house tokens spell out why that is wrong — `--margin-inside` is the text
inset *plus* `--gutter-allowance`, because a bound book loses a few
millimetres into the spine — and 11mm with nothing set aside for it is text
disappearing into the gutter.

The reference design cannot simply take the house numbers: `.page--food`
sets `inset: 0` so artwork can bleed, and a 28/21mm mirrored block would
cost pages this chapter does not have. 16mm on both sides is the compromise,
and it is symmetric rather than mirrored because the whole reference profile
is — chapter 3's 28 pages are too, and one chapter mirrored beside one that
is not would be worse than either.

It costs 52 units of measure and almost nothing to read, because the old
setting was not using the old measure: the block was 926 units wide and the
lines were running about 800. Median characters to the line went 75 to 73.
That slack is the reason this was affordable at all — look for it before
assuming a narrower block must cost pages.

To move a block, do not re-break by hand:

```sh
node build/rewrap-reference.mjs <chapter> --right=963 --shift=27 --pages=3,4,5 --dry
```

It measures the real type in the real face and re-breaks to the new measure,
keeping each block's own indent and carrying inline runs across the breaks.
`--dry` first, always: the number that matters is lines per page, because
more lines is a taller page and these pages were full.

**Use `--pages`.** Re-breaking a block re-breaks all of it, and a page whose
lines were deliberately set short — page 1 clears a rail, page 2 clears a
figure column — will pack tighter and lose lines you meant to keep. Only
re-break what actually overflows; `check-reference-fit` names those.

Read the result for breaks the measurer cannot judge. Re-breaking page 4
put an em dash at the head of a line, which is a thing no line should start
with, and that was fixed by hand.

## Step 6: Fit the page to Crown Quarto

Preserve the wording and visual hierarchy while adjusting line breaks,
paragraph gaps, heading positions and illustration sizes for the shorter
page proportions. Do not stretch the entire supplied page into the new trim.

Keep each bordered callout whole. Leave space between text and artwork,
between a caption and the footer, and between the last text line and a box
edge. Do not shrink individual lines just to conceal an overflow.

Page 1 currently has a straight top crop on its illustration, unlike the
reference's feathered transition. A CSS mask experiment caused the source
image to show outside its viewport and was reverted. That edge is a known
visual difference, not a completed refinement.

## Step 7: Build and inspect the actual proof

After every page edit, run:

```sh
node build/build.mjs class-6/ch01-wonderful-world-of-science --png
```

Open the generated PNG for the edited page and inspect the entire sheet,
including the footer. Proof names follow printed folios: the supplied page
numbered 4 produces `p004.png` even if it arrived third.

Check:

- All supplied words are present, in order, with the intended emphasis.
- Lines stay within their columns and callout boxes.
- Original raster words are not visible behind live text or beside crops.
- Illustrations retain their proportions and are not accidentally cut.
- Captions and callout labels are readable and point to the intended detail.
- The header, spacing, colours and folio match the other reconstructed pages.

The builder checks the page structure and measures the outer SVG sheet.
Its **100% fill / all pages fit** result does not certify that the text
inside the SVG fits — an SVG sheet always fills its page, so a reference
chapter reports 100% whatever is going on inside it. For that, run:

```sh
node build/check-reference-fit.mjs class-6/ch01-wonderful-world-of-science
```

It measures the rendered glyph boxes a line at a time and reports four
things: a line past the text block, a line overlapping an illustration, a
block whose baseline intervals disagree, and a block with a ragged left
edge. It refuses to run against a build older than the sources.

Do not use `check-food-reference.mjs` here. It takes a chapter argument and
ignores it — the path is hardcoded — so it answers with the food chapter's
28 pages and 7,351 words and reports a pass for a chapter it never opened.

Neither tool certifies the transcription. Read the words in the proof.

If the builder reports `overflow check did not report`, that is a missing
measurement, not a successful check. Rerun it and investigate if the warning
persists. After any correction, rebuild and inspect the new proof again.

For a PDF, the builder also supports:

```sh
node build/build.mjs class-6/ch01-wonderful-world-of-science --pdf
```

The existing studio watches source changes and reloads. Do not restart it
as a routine part of adding a page. Never repair a generated file directly.

## Current limits

**Page 2 is over-set by about four lines.** At the chapter's leading of 31
its blocks need roughly 90 units more than the page has, so its paragraph
gaps run 39–57 where the rest of the chapter uses 48. The leading is right;
the gaps are compressed to pay for it. Cutting three or four lines of prose
from that page, or starting *The Most Important Tool* on a page of its own,
is what would settle it — and that is an editorial decision, not a fitting
one.


This method preserves editable text and coded page furniture while reusing
the supplied artwork. It does not recover vector illustrations, lost image
resolution or the original font. Texture and crop transitions can differ.
The supplied image's resolution limits the printed artwork quality.

The reference-design chapter also requires binder support before combining
it with a house-style volume. A successful chapter proof alone does not
validate a mixed-design book export.
