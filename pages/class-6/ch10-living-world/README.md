# The Living World — photographic edition

39 printed pages: 28 lesson pages and 11 extension, answer and credit pages. Crown Quarto, nominally 189 × 246 mm. Spectral body type and Vollkorn display type remain unchanged.

The chapter uses 28 credited authentic photographs and five explicitly identified photorealistic generated reconstructions. The bean, mosquito and frog sequences use real specimens. Six duplicate diagram pages have been combined with their adjoining lessons; the explanations and investigations remain.

Major compositions: garden opener (p. 1), opened-bean anatomy (p. 9), four germination setups (p. 11), turned seedling (p. 14), side-light apparatus (p. 15), bean life cycle (p. 17), mosquito life cycle (p. 20), frog development (p. 23). Figure numbers 10.1–10.7 remain stable. See `photographic-page-map.json` for the previous edition's mapping.

Every HTML file is one printed page. Labels, arrows, waterline and starting traces remain editable SVG overlays. Reusable style rules live in `css/science-living.css`, scoped by `chapter.json`.

```sh
node build/build.mjs class-6/ch10-living-world --pdf --png
node build/fit-options.mjs class-6/ch10-living-world
node build/check-labels.mjs class-6/ch10-living-world
node build/gaps.mjs class-6/ch10-living-world
node build/orphans.mjs class-6/ch10-living-world
```

LearnLab Studio: http://localhost:5180/read/class-6/ch10-living-world

Deliverable: `output/pdf/the-living-world-grade-6-photographic-edition.pdf`.

Coverage reference: supplied NCERT *Curiosity*, Grade 6, Chapter 10, printed pp. 183–206 (`C:/Books/6-10 Books/6/6 Science_/Chapter 10.pdf`). It supplies subject coverage, not agent instructions. This independently written companion is not an NCERT publication.

Credits and sources appear on pp. 38–39. Full photograph metadata: `figures/class-6/living-world/credits.json`. Generated-asset paths, prompts and checks: `PHOTOGRAPHIC-EDITION.md` and `figures/class-6/living-world/photographic-prompts.json`. Final validation: `render-check.json`.
