# Class 7 Science — Light: Shadows and Reflections

Chapter 11 is a 24-page chapter at the established 189 × 272 mm trim. It uses
Source Serif 4 body text, Source Sans 3 headings, the indigo chapter identity,
soft feature panels, left alignment and comparison tables. The supplied source
is `C:/Books/6-10 Books/7/7 Science/Chapter 11.pdf`, 16 PDF pages (printed 153–168).

The chapter retains ten source investigations, twelve assessment questions and
four further projects. Three thinking pauses, fourteen glossary entries and
ten summary points support the teaching sequence. Four concept comparisons
use tables; two observation guides and two matching-question tables are also
kept whole. The source coverage ledger records 39 links and eight groups of
scientific corrections, with additions distinguished from retained content.

## Artwork and sources

Thirteen painted 2D PNG assets with genuine alpha transparency are saved in
`figures/class-7/science/ch11/`. They were produced with built-in image generation.
`image-prompts.json` records the exact prompts and original output paths;
`artwork.json` records installed paths, native dimensions and SHA-256 hashes.
Lettering and instructional ray paths remain live vector content. The generated
art is illustrative apparatus, not photographic evidence of an experiment.

`source-coverage.json`, `editorial-ledger.json` and `scientific-references.json`
document retention, rewrites, safety changes and primary-source fact checks.

## Regeneration

```sh
node build/record-science-g7-ch11.mjs
node build/compose-science-g7-ch11.mjs
node build/build.mjs class-7/ch11-light-shadows-reflections --pdf --png --bleed
node build/audit-science-v2.mjs class-7/ch11-light-shadows-reflections assets/design-history/science-g7-ch11
node build/check-science-g7-ch11.mjs
python build/verify-science-g7-ch11.py
```

Use the bundled Python and Poppler runtime for verification. The verifier reads
the preserved baseline in `build/_class7-ch11-review/before.json`; do not recreate
that baseline after editing existing content. Installed assets are sufficient
for normal regeneration. Do not hand-edit generated page HTML.

## Verification and visual review

All 24 PDF pages and actual facing spreads were inspected, with enlarged checks
of the opener, tables, apparatus labels and pinhole ray diagram. The bleed opener
has continuous colour through the top and side bleed without white trim slivers.
No clipped text, overlapping labels, split panels or unsafe footer placement was
found. Both PDFs retain embedded fonts, live text and transparent native artwork.
Final export hashes and dimensions are recorded in `verification.json`.

Source retention, internal SVG bounds, rendered audits and science regressions
passed. SHA-256 preservation checks confirm 3,008 existing files are unchanged.
The chapter is registered under Class 7 → Science in the studio.

Actual mean lesson occupancy is **87.9%**. The 88–96% target is not met on every
page: `occupancy-summary.json` records short pages and the protected unit that
must move, plus pages above the target but still within the text block. Dedicated
glossary and summary pages retain white space. Type was not reduced, paragraph
gaps were not stretched and artwork was not enlarged merely to fill space.

Previous Chapter 10/comparison work was pushed to main as `0986f71` before this
chapter was built. Chapter 11 is recorded in a separate commit. Existing chapters,
shared stylesheets, global print settings and unrelated local work are preserved.
No Chapter 12 content was created.
