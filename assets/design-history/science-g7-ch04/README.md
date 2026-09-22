# Class 7 Science Chapter 4

The World of Metals and Non-metals was independently composed from the supplied 16-page source PDF (printed pages 41–56). The public subject is Science. The chapter has 23 pages at 189 × 272 mm trim: opener, 17 lesson pages, dedicated keywords and summary pages, two assessment pages and one project page.

## Rebuild

Run these commands from the repository root:

```powershell
node build/compose-science-g7-ch04.mjs
node build/build.mjs class-7/ch04-metals-non-metals --pdf --bleed --png
node build/audit-science-v2.mjs class-7/ch04-metals-non-metals assets/design-history/science-g7-ch04
node build/check-reference-fit.mjs class-7/ch04-metals-non-metals --block=89,963
node build/check-science-g7-ch04.mjs
```

The compositor reads the independent content and diagram modules and artwork manifest. Shared typography, opener and pagination utilities keep their prior defaults. All Chapter 4 palette and motif rules are scoped to `.page--g7-ch04`. Investigate panels retain the approved teal body at 7%, title bar at 20% and border at 35%, with opaque dark-teal lettering and icons.

## Editorial coverage

`source-coverage.json` independently maps the source’s substantive points, eight activities, twelve assessment questions and four projects to content IDs. `editorial-ledger.json` records the final content, source page references, additions and scientific corrections. The source extraction and SHA-256 record are retained beside them.

Focused additions explain fair comparisons, reading measurements, contact checks, experimental controls and material choices. Corrections qualify broad property claims, distinguish elements from materials and alloys, distinguish sulfur from sulfur dioxide, qualify oxide chemistry, and improve teacher-demonstration safety. Students observe magnesium and sulfur demonstrations; sulfur requires a working fume cupboard or a recording. No student sodium or phosphorus experiment is introduced.

## Artwork and pagination

Seven generated photographic illustrations are native 1536 × 1024 RGBA PNG files with real transparent backgrounds. They are illustrative assets, not documentary experiment results. Their original generated files, prompts, dimensions and hashes are recorded in `artwork.json` and `image-prompts.json`. Three scientific schematics have live vector lettering. No rasterised instructional labels or rectangular photograph backgrounds are used.

The compositor preserves each bordered panel, comparison, table with guidance, and diagram with caption as a whole. Heading checks require five lines of following content. Equipment photographs can sit before their complete activity panels. Content is not stretched to fill pages.

`render-audit.json` contains actual rendered content bounds. The lesson average is 89.1% occupied height. `occupancy-summary.json` documents shorter pages 2, 3, 4, 6 and 10 and the protected units holding their joins open. Page 18 ends the lesson before the dedicated reference sequence. Keywords and summary pages deliberately remain independent; assessment page 21 leaves room because the complete flow-chart question moves to page 22. Project page 23 is the chapter’s closing page.

## Verification completed

- All 23 PDF pages and all eleven actual facing spreads inspected. Opener, comparison, table and investigation proofs also reviewed at larger size.
- Reading and bleed PDFs verified at the declared trim and press-sheet dimensions; opener bleed proof has continuous top/side colour coverage.
- All source activities, assessment questions, projects, glossary entries and summary points retained in the rendered text.
- No text collisions, panel escapes, footer clipping, out-of-bounds SVG text, artwork overlaps or uneven leading.
- Both PDFs retain embedded Source Serif 4 and Source Sans 3 fonts, live text and seven native PNG transparency masks.
- Ten science contract regression cases and the food investigation-order/retired-reference checks pass.
- 1,448 pre-existing source, asset, CSS and builder files match the snapshot taken before this chapter was added. Earlier local Investigate palette changes are preserved.
- The studio registers the chapter under Class 7 → Science at `/read/class-7/ch04-metals-non-metals`.
- No commit or push was performed.

`verification.json` records the export hashes, font names, transparency checks and preservation result. Local PDF page and spread review images are in `build/_class7-ch04-review/`.
