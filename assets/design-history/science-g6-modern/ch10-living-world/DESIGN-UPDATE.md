# Chapter 10 design alignment, 23 September 2026

The existing chapter retains Source Serif 4 body copy, Source Sans 3 headings,
the 24/32-unit reading scale, regular serif chapter numerals and 189 × 272 mm trim.
The current update finishes the alignment with the completed Class 6 chapters:

- Shared right-column header artwork and Think It Through / Investigate icons.
- Painted transparent garden opener and Bose portrait; original assets preserved.
- Correct source classes on scientific diagrams, legible labels and upright captions.
- Related specimen photographs paired with their separate captions.
- Original exercise questions recovered from the immutable source: three sets
  of six, each with separate A–D choices, and five complete worked questions.
- Small closing leaf restored from its previous solid black rendering.
- Notebook recording headings replace empty textbook writing lines.
- All existing teaching text and Beyond the Book stages retained. Editorial
  changes and exact source IDs are recorded in editorial-ledger.json.

The chapter has 37 body pages and 13 Beyond the Book pages. Source files p101
onwards still identify the latter; printed folios run continuously from 1 to 50.
Whole figures, panels and questions account for the recorded shorter page joins.
The brief closing assessment is exempt from normal fill requirements. Type and
spacing have not been stretched to disguise these joins.

Regenerate with `node build/compose-science-g6-modern.mjs 10`, then build using
`node build/build.mjs class-6/ch10-living-world --pdf --bleed`.
Run the modern render audit, retention checker, science regressions and
`build/check-science-g6-ch10-design.py`. The SVG-only reference-fit checker
does not measure this chapter's HTML body; the modern render audit does.

Both final PDFs were rendered through Poppler and all 50 sheets inspected.
Artwork prompts and built-in ImageGen provenance are in artwork-prompts.json.
Scientific observation photos remain unchanged; the painted portrait replaces
the human photograph while retaining its reference credit.
