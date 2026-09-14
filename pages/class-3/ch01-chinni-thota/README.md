# చిన్ని తోట - original Class 3 Telugu sample

Four-page design and editorial sample; not a complete textbook or a claim of board approval.
The user-supplied six-page Tel.pdf was reviewed visually. It informed the age level,
picture conversation and vocabulary practice, not the prose or artwork. No source artwork reused.

Original story and verse: generated for this project. Illustrations: AI-generated,
reviewed and kept as separate assets; no claim of hand-drawn provenance.
Text stays selectable Telugu, not painted into artwork. Nirmala UI is a system
font replacement for the Latin-only house faces. Print PDF embeds the font;
HTML rendering requires Nirmala UI installed. A fluent Telugu editorial review
and the complete reference/syllabus are needed before extending to a final textbook.

Answer notes: page 3 pictures: ఆకు, పువ్వు, పిచ్చుక, కుండీ.
Plurals: మొక్కలు, కుండీలు. Original sentences may vary.
Page 2: children put water in a small bowl for the sparrow.
Open conversation, drawing and writing responses may vary.

Build: `node build/build.mjs class-3/ch01-chinni-thota --pdf --png`.
Edition preserves Crown Quarto trim, with a scoped primary Telugu reading scale.

## Revised visual direction

User requested more small icons and design details. Version 2 adds a reusable
SVG icon vocabulary, leaf-shaped lesson markers, illustrated activity cues,
dialogue bubbles, botanical footer details, and a new sparrow vignette.
These are scoped to the Telugu primary edition. Other books retain their furniture.
The story, vocabulary, and poem use distinct compositions. The source remains
one HTML file per printed page; regenerate it with `node build/compose-telugu-sample.mjs`.
Icons are vector artwork; the story and bird illustrations are AI-generated.
