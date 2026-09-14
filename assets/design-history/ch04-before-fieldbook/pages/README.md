# Exploring Magnets

Class 6 Science, Chapter 4. Follows the science-editorial profile used by
Chapters 1–3, at 189 × 272 mm trim. Muted violet chapter palette; common
terracotta activities. Each HTML source is one printed page.

Authoring: `node build/compose-science-ch04.mjs`. This rewrites this chapter's
page fragments; preserve manual corrections in the compositor before rerunning.
The archived manuscript is unchanged. The compositor logs factual and editorial
corrections and explanatory additions under `assets/design-history/ch04-*`.

Build: `node build/build.mjs class-6/ch04-exploring-magnets --png --pdf --bleed`.
Check: `node build/check-reference-fit.mjs class-6/ch04-exploring-magnets --block=89,963`.
The compositor reports internal content fill; the builder measures the outer SVG.

Geometry and apparatus are live SVG from `build/magnets-diagrams.mjs`.
The opening illustration is generated raster artwork. Its prompt and provenance
are recorded in `assets/design-history/ch04-production-notes.md`.
Historical compass discussion is retained as an account, not independently dated.
