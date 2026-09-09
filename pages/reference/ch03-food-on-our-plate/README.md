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
node build/build.mjs reference/ch03-food-on-our-plate --pdf
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
