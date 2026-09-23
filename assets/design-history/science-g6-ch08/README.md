# Class 6 Science Chapter 8 — A Journey through States of Water

Built from the supplied Chapter 8 PDF in the shared science edition:
189 × 272 mm, Source Serif 4 body, Source Sans 3 headings, 24/32-unit
reading copy, soft teal Investigate panels and amber reasoning panels.

The chapter has 19 pages, all eleven source activities, ten review questions,
four extensions, a sixteen-entry glossary and a complete summary. Source
coverage and scientific qualifications are recorded alongside this note.
Particular attention was given to the mass of the whole condensation setup,
invisible water vapour, cloud formation, safe demonstrations and the limits
of drying as a treatment for contaminated sludge.

Six original painted PNG assets retain genuine alpha transparency. Prompts,
dimensions and file hashes are recorded. Apparatus is illustrated; people
use the established painted 2D style. State-change and learner mapping
diagrams retain live labels. Chapter-header artwork stays in its right column.

Panels, tables and individual questions remain whole. Smaller apparatus
illustrations sit beside their explanations. Shorter lesson pages reflect
protected units at page breaks; text size and paragraph spacing are unchanged.
Glossary, summary and projects retain their separate roles.

Rebuild and verify:

```
node build/record-science-g6-ch08.mjs
node build/compose-science-g6-ch08.mjs
node build/build.mjs class-6/ch08-states-of-water --pdf --bleed
node build/audit-science-g6-ch08.mjs
node build/check-science-g6-ch08.mjs
node build/check-reference-fit.mjs class-6/ch08-states-of-water --block=89,963
node build/check-science-regressions.mjs
python build/proof-science-g6-ch08.py
```

Final proof review covered all 19 reading pages and their footers. Rendered
checks found no text collisions, panel escape or clipped text. Reading and
bleed PDFs have matching page counts; live text, image transparency and media
boxes passed. Proof contact sheets select only the current PDF's page range,
so older scratch renders cannot appear after repagination.

Local deliverables are under `output/pdf/`; generated PDFs remain ignored.
