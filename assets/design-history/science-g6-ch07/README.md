# Class 6 Science Chapter 7 — Temperature and its Measurement

Built from the supplied Chapter 7 PDF in the current shared science edition:
189 × 272 mm, Source Serif 4 body, Source Sans 3 headings, 24/32-unit
reading copy, soft teal Investigate panels and amber reasoning panels.

The chapter has 18 pages, seven source activities, fourteen review questions,
four extensions, a dedicated glossary and a complete summary. All source
teaching pages are mapped in `source-coverage.json`; safety and scientific
qualifications are recorded there rather than silently changing a claim.

Four original painted PNG assets were generated with builtin ImageGen.
The images retain genuine alpha transparency. Prompts and file hashes are
recorded alongside this note. Original generated files remain untouched.
Exact thermometer scales and the apparatus-position comparisons are native
SVG with live labels; scale endpoints, intervals and liquid levels are
constructed from a common numerical mapping. The renderer tests guard the
28 °C and 27.5 °C readings and the 0.5 °C division exercise.

The lesson uses whole panels and tables. Shorter early lesson pages reflect
balanced breaks between protected units without stretching paragraph spacing.
Glossary, summary and extension pages retain their separate reference and
project roles. Exercise scale details are horizontal where that permits a
clear sequence of complete questions, with no reduction in tick legibility.

Rebuild and verify:

```
node build/record-science-g6-ch07.mjs
node build/compose-science-g6-ch07.mjs
node build/build.mjs class-6/ch07-temperature-measurement --pdf --bleed
node build/audit-science-g6-ch07.mjs
node build/check-science-g6-ch07.mjs
node build/check-reference-fit.mjs class-6/ch07-temperature-measurement --block=89,963
node build/check-science-regressions.mjs
python build/proof-science-g6-ch07.py
```

Final proof review covered all 18 complete reading pages, including footers.
The three comparison/data tables are numbered in order. No text collisions,
panel escape, artwork overlap or clipped text were found. Reading and bleed
PDFs have matching page counts; image transparency and media boxes passed.
Local deliverables are under `output/pdf/`; generated PDFs remain ignored.
