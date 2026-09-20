# The Wonderful World of Science · V2

Class 6 / Science V2 / Chapter 1. Ten pages at 189 × 272 mm:
one illustrated opener, seven lesson pages, one combined glossary/summary
page and one assessment page. Original Science and Chapter 2 V2 are unchanged.

## Source and editorial trace

The user's `C:\Books\6-10 Books\6\6 Science\Chapter 1.pdf` supplies the
teaching coverage. `source.json` records its SHA-256, edition and artwork
provenance; `source-extraction.txt` preserves its extracted reading layer.
The visible eight-page source was reviewed in full. PDF page 7 includes a
hidden repetition of page 6 in its text layer; this was not duplicated in
the new lesson.

`source-coverage.json` independently maps 20 source teaching requirements to
authoring IDs. All three original reflective activities remain, as unnumbered
Think It Through panels. New teaching material has its rationale beside its
anchor in `build/science-ch01-v2-content.mjs`, and is emitted to the editorial
ledger. This includes observation versus interpretation, hypothesis versus
prediction, bounded conclusions, repeat tests, fair comparisons and safe
handling. The pen example remains the source's pen example, rather than the
clock example used in the original LearnLab Science adaptation.

## Design

The V2 Source Serif 4/Source Sans 3 faces, live type, left alignment, type
sizes, component colours and footer geometry are shared with Chapter 2.
The new palette is scoped to `.page--science-v2.page--v2-ch01`; it cannot
recolour another chapter. Blue is Chapter 1's identity. The reusable opener
has a matching magnifier motif in the large band and small running ribbon.
The numeral is Source Serif 4 regular; the title is Source Sans 3 semibold.
The shared grid and white separation between band, artwork and reading entry
follow the approved V2 design.

Pen, topic and method diagrams are vectors with live labels. Source landscape
images are printed about 36 mm wide (at least 323 ppi). The team illustration
is about 87 mm wide (226 ppi) and the independently copied opener is about
157 mm wide (320 ppi); no raster was enlarged or resampled to manufacture
resolution. Text and icons do not depend on bitmap resolution.

## Pagination and review

`refit-science-v2-blocks.mjs` packs authored blocks in order. Paragraphs can
continue across pages with two-line minimum fragments; comparisons, tables,
illustrations/captions and bordered panels stay whole. Headings keep at least
five lines of material or their complete explanatory unit. Page breaks never
invent headings. No extra paragraph spacing is used to consume spare height.

Final mean actual lesson occupancy is 91.4%. Lesson pages 4 and 7 are the
documented short exceptions (86.5% and 87.6%): the following complete
comparison or illustration cannot fit in the remaining height. Their actual
content bounds and protected groups are in `render-audit.json`. The opener
has its own composition; the short final assessment is an intentional closing
page. Glossary and summary share a dedicated page because both fit comfortably
at body size.

Every reading page, facing spread and bleed page was visually reviewed. The
final pen callouts identify the actual tip, refill and visible ink. Both PDFs
have ten pages, embedded live fonts and the declared trim/sheet dimensions.
`verification.json` records hashes, checks and final inspection results.

## Regenerate and verify

The prepared artwork is already stored as independent chapter assets;
`prepare-science-ch01-v2.py` is only needed to repeat extraction from the
original supplied PDF.

```sh
node build/compose-science-ch01-v2.mjs
node build/build.mjs class-6/ch01-wonderful-world-of-science-v2 --pdf --bleed --png
node build/audit-science-v2.mjs class-6/ch01-wonderful-world-of-science-v2 assets/design-history/science-v2-ch01
node build/check-science-ch01-v2.mjs
node build/check-reference-fit.mjs class-6/ch01-wonderful-world-of-science-v2 --block=89,963
node build/check-science-v2-pagination.mjs
node build/check-science-regressions.mjs
```

The shared rendered audit accepts optional chapter/history paths; omitting
them preserves its existing Chapter 2 behaviour. Generated HTML page fragments
remain the printing sources. Change the Chapter 1 authoring content or
compositor and regenerate to make durable edits.
