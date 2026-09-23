# Class 6 Science Chapter 11: Nature’s Treasures

Twenty pages in the shared Science edition (189 × 272 mm). The 24-page supplied source is mapped in `source-coverage.json`; all six numbered investigations, sixteen questions and four closing projects are retained, with scientific and safety changes documented. The prose and artwork are newly authored.

## Rebuild

```powershell
node build/record-science-g6-ch11.mjs
node build/compose-science-g6-ch11.mjs
node build/build.mjs class-6/ch11-natures-treasures --pdf --bleed
node build/audit-science-g6-ch11.mjs
node build/check-science-g6-ch11.mjs
node build/check-reference-fit.mjs class-6/ch11-natures-treasures --block=89,963
node build/check-science-regressions.mjs
```

Use the bundled Python runtime to run `build/proof-science-g6-ch11.py`. This checks PDF dimensions, selectable text and embedded PNG alpha masks, then renders every page through Poppler.

## Artwork

Eight commissioned PNGs use actual alpha transparency. Original paths, dimensions, hashes and alpha percentages are in `artwork.json`. Built-in image-generation prompts and the rainwater correction are recorded separately. The edited tank deliberately does not overflow while its water is below the outlet. Human figures use illustrated 2D styling.

Illustration allocations follow their role: contextual opener; compact pinwheel assembly (225 units) and soil apparatus (195) inside their activities; rainwater route (340); solar-device comparison (275); forest interactions beside prose (385); rock-identification row (205); solar-cooker question (280). The summary repeats the forest image at 220 units. Sizes are not adjusted by page fill.

The dry-air chart is exactly 100 live vector squares (78 nitrogen, 21 oxygen, 1 other). The resource tree uses selectable vector labels and explicitly shows only selected examples. The chapter header combines a sprig, sun and water drop in the existing fixed right-hand column.

## Release review

All twenty final page proofs were reviewed together, with larger inspections of the opener, air chart, rainwater route, soil activity and resource tree. No clipped copy, collisions, image/text overlaps or split protected panels were found. Explanatory paragraphs remain whole across page turns. The glossary and summary each have a dedicated page.

Natural lower margins remain where complete activities, tables, figures, paragraphs or questions prevent further packing. The compositor minimises page count and then balances those margins without enlarging artwork, increasing paragraph gaps or reducing type. `page-map.json` and `render-audit.json` expose actual content occupancy; the builder’s full-sheet SVG fill report is not used as evidence of content fill.

Final checks passed: source retention, numerical air-chart counts, activity-before-explanation order, all figure hashes/alpha, rendered glyph bounds, 694 lines inside the reading measure, shared science regressions, sequential folios, reading/bleed media boxes and image soft masks. Reading and bleed PDFs remain ignored build artifacts; distributable copies live under `output/pdf/`.
