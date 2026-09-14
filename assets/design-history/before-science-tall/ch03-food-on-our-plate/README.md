# Food on Our Plate — editable reference reconstruction

28 fixed A4 pages reconstructed from the user-supplied `GPT.pdf`.
This is a first reconstruction, not a claim of pixel identity or a finished print master.

## Edit and build

Each `p001.html`–`p028.html` is one printed page. Text is live SVG text,
grouped under comments containing the recognised line. Change the text in the
`<text>` elements, not the comments. Body lines use natural letterforms,
a shared baseline and regular word spacing. Their measured columns preserve
the reference's line breaks; longer revisions need manual refitting.

```sh
node build/build.mjs class-6/ch03-food-on-our-plate --pdf
```

Styles are scoped in `css/food-reference.css`. The existing book's default
type, palette and trim tokens are untouched. `design: "food-reference"`
in `chapter.json` opts into this separate design. Do not bind this draft into
a house-style volume; mixed design profiles are not supported by the binder.

Illustrations are separate, losslessly extracted PNGs under
`figures/reference/food/`. Text, table rules, panels and most furniture are
editable SVG. Labels embedded in illustrations remain raster artwork.

## Re-importing the reference

The importer is a one-time reconstruction tool. Running it again replaces
all 28 page fragments; keep any manual corrections in version control first.

1. `python build/extract-food-reference.py <path-to-GPT.pdf>`
2. Run `build/ocr-reference.ps1` with Windows PowerShell, passing absolute
   `-InputDirectory` and `-OutputDirectory` paths for the `originals` and `ocr`
   folders under `assets/food-reference/`.
3. `node build/measure-food-fonts.mjs`
4. `python build/reconstruct-food.py`
5. Run the builder above.

The Python tools require Pillow and pypdf. Windows OCR is local; no document
content is uploaded to an OCR service. Crop coordinates are maintained in
`build/food-layout.py`.

## The trim, and why it has not moved yet

This chapter is `"edition": "a4"` because `GPT.pdf` was A4. That was never
a decision about the book, and **it does not currently fit A4 either.**

The pages carry three different viewBoxes — 24 at 1024x1536, three at
1122x1402, one at 1123x1401 — and none of them is A4's shape (0.707). The
sheet is fitted into the page by `preserveAspectRatio`, so what comes out
is blank paper on two sides: **12mm at the sides on 24 pages, and 35mm at
the head and foot on the other four.** The builder's fill probe cannot see
it, because the `<svg>` is 100% x 100% of the page whatever its viewBox
does inside; `check-reference-fit.mjs` now reports it.

Moving it to Crown Quarto, the house standard, is a re-typeset and not a
rescale. Three measurements say so:

* **Rescaling shrinks the type.** Body is 10.0pt median today (8.9 at the
  tenth percentile). Scaled to a 189mm sheet it is 9.0pt, and 8.0 at the
  tenth. That is too small for Class 6, and it keeps the tracing's own 3%
  size wobble on top.
* **The page does not hold the content.** At today's printed type size a
  Crown Quarto page is 977 x 1272 units against the present 1024 x 1536.
  All 24 of the main pages are taller than that and nine are wider.
* **So it grows.** Roughly 28 pages to about 34.

The first step is done and is in the repo:

```sh
python build/extract-reference-content.py class-6/ch03-food-on-our-plate
```

It reads the tracing back into content — 7,375 words, 605 blocks, each with
its role, its inline runs and its box — and checks that every source word
comes out exactly once. That JSON is what a setter would pour onto pages of
any size, and re-setting from it is also the fix for the tracing's own
defect: a re-set block has one left edge and one size, where the trace
wobbles about 0.35mm and 3% inside a single paragraph.

What is **not** done is the setting: pouring those blocks onto ~34 Crown
Quarto pages, rebuilding seven tables at a narrower measure, and re-placing
95 illustrations and about 35 panels. That is per-page design work, not a
transform, and it has not been started.

## Fidelity and review status

- Original A4 sheet geometry and centred image proportions are preserved.
- The source's printed folios are retained, including its jumps and its
  unnumbered vitamin table. `data-reference-page` is the reliable 1–28 index.
- The original has no embedded fonts or text. Poppins is a local approximation;
  word positions come from OCR and are not a substitute for typographic review.
- Body copy, exercise text and table cells need a final transcription review.
  Two distorted speech-bubble lines were reconstructed into readable text.
- Paper textures, some ornamental edges, icons and fine styling still differ.
- The polish pass regularises line typography, strengthens table labels,
  corrects duplicate/missing list numbers, restores answer-writing rules,
  and separates crowded captions. These deliberately improve on the reference.
- Builder fill measures the whole SVG sheet. It does **not** certify that text
  inside the SVG is correct or free of overlaps; the separate reference check
  measures the rendered text bounds, and proofs must also be inspected.

The PDF is an editable-content proof, not an interactive form. Table cells
can be edited in source; readers do not type into the exported PDF.
