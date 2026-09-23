# Class 6 Science Chapter 9 - Methods of Separation in Everyday Life

The supplied Chapter 9 PDF is adapted into 18 pages in the shared Science
edition: 189 × 272 mm, Source Serif 4 body, Source Sans 3 headings,
24/32-unit reading copy, soft teal Investigate panels and amber thought
panels. The chapter uses a muted ochre identity with grain, magnet and flask
artwork confined to the opener's right column.

All six numbered source activities, ten review questions, ten sorting cases,
eleven matching-game methods and six closing projects are retained. The
source's blank Notes page is omitted. A sixteen-entry glossary and complete
summary each occupy their own page. The matching game uses a table of
independent card sets, not pre-matched answers. All six projects fit together
without reducing the reading size. Source mapping, editorial corrections and
scientific reference URLs are recorded in this directory.

Seven original illustrations were made with builtin ImageGen. All are true
RGBA PNG cutouts with alpha transparency, no image border or frame. Human
figures follow the painted 2D style. The untouched outputs were copied into
figures/class-6/science/ch09/. Prompts, original paths, dimensions and hashes
are recorded. Heater and filtration setups stay inside their activity panels
and show the apparatus before the result. Comparisons use tables.

Editorial changes distinguish churning butter from separating cream, visible
clarity from drinking-water safety, accidental milk spoilage from intentional
curdling, and magnetic response from simply being a metal. Air separation is
not reduced to mass alone. Household and industrial examples state the limits
of each method. Evidence is discussed after the learner's observation task.

Rebuild and verify:

```
node build/record-science-g6-ch09.mjs
node build/compose-science-g6-ch09.mjs
node build/build.mjs class-6/ch09-methods-of-separation --pdf --bleed
node build/audit-science-g6-ch09.mjs
node build/check-science-g6-ch09.mjs
node build/check-reference-fit.mjs class-6/ch09-methods-of-separation --block=89,963
node build/check-science-regressions.mjs
python build/proof-science-g6-ch09.py
```

Final review covered all 18 rendered reading pages including footers, with
larger inspection of the filtering apparatus and assessment tables. The
builder, full-content retention checks, rendered audit, 666-line text-fit
check and shared science regressions pass. Reading and bleed PDFs have the
same page count, live text and verified media boxes. Embedded raster images
retain transparency. The proof script selects the current page count, so
stale scratch renders cannot enter a contact sheet after repagination.

The two shorter early lesson pages precede complete investigation panels;
these panels cannot move into the remaining space. Other shorter pages end
reference or game units. No paragraph-spacing inflation or enlarged artwork
was used to fill gaps. Source page-map and rendered bounds document the joins.

Generated PDFs remain local under output/pdf/ and the existing ignore rules.
