# Exploring Magnets

Latest learning cues use seven generated transparent PNGs from
`figures/class-6/science/cues/`, without circular badges. Evidence labels are
plum and comparison labels ochre so they remain distinct from chapter teal.
The prompt/provenance manifest is `assets/design-history/science-cue-png-prompts.json`.
This supersedes the previous line-icon/disc descriptions below.

Class 6 Science, Chapter 4. The corrected illustrated edition has 22 pages
at 189 × 272 mm. It preserves the chapter badge, running header, angled footer,
typefaces established before the fieldbook attempt. The current colour pilot
uses stronger teal, richer activity rust and warm amber instead of muted violet.
All explanatory artwork is foreground-focused transparent PNG. Body paragraphs
are justified with measured word spacing; final lines stay natural.
Activities 4.2–4.6 place their illustrations beside the relevant steps in a
dedicated right-hand column. Comparison scenes stack vertically; materials
and observation prompts retain the full panel width.
All ten reflection prompts use standalone Think Spark panels without answer
lines. Activity reflections appear immediately after their activity panels.
Eleven learning cues on eight pages pilot the shared science visual language:
narrative, evidence, explanation, comparison, everyday connection and setup.
The reusable symbols live in `build/science-learning-cues.mjs`; this chapter's
contextual placements live in its compositor.
Learning cues use 40-unit white symbols on solid 52-unit purpose-coloured discs and
body-sized bold labels, replacing the initially undersized pale marks.
Teal identifies evidence/comparison, blue explanation/connections, amber
thought experiments and rust practical setup. Symbols were redrawn as a
consistent editorial set with concrete visual meanings.

Authoring: `node build/compose-science-ch04.mjs`. This rewrites this chapter's
page fragments; preserve manual corrections in the compositor before rerunning.
Page composition lives in `build/magnets-illustrated.mjs`. Each lesson has a
deliberate page assignment. The entry command builds a measurement copy and
runs `justify-science-lines.mjs` to finalize source word spacing from rendered
glyph bounds. Always rebuild after this pass.
The archived manuscript is unchanged. The compositor logs factual and editorial
corrections and explanatory additions under `assets/design-history/ch04-*`.

Build: `node build/build.mjs class-6/ch04-exploring-magnets --png --pdf --bleed`.
Check: `node build/check-reference-fit.mjs class-6/ch04-exploring-magnets --block=89,963`.
The compositor reports internal content fill; the builder measures the outer SVG.

PNG artwork is under `figures/class-6/science/ch04/png/`. The SVG page canvas
continues to carry live type, rules and the original page furniture; it no
longer draws the explanatory pictures. Transparent margins are fitted using
image viewports, without modifying the selected PNGs. There are no pupil cameos.
Exact selected prompts and asset paths are in
`assets/design-history/ch04-illustrated-artwork.json`.
The previous page sources and compositor are retained in
`assets/design-history/ch04-before-fieldbook/`.

Additional checks:
`node build/audit-magnets-content.mjs` verifies the prior reading is retained.
`node build/check-magnets-fieldbook.mjs` measures nested diagram labels and
text overlaps, and confirms every image loads. Render the exported PDF with
Poppler and inspect every full sheet as well as the builder's PNGs.
`node build/check-magnets-justification.mjs` checks the right edges and presence
of the original furniture. The detail check excludes overlapping font boxes in
the unchanged original chapter badge and title; their visible ink is inspected.
`node build/inspect-magnets-pngs.mjs` verifies actual alpha transparency.
Historical compass discussion is retained as an account, not independently dated.
