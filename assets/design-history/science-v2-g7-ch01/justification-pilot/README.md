# Class 7 Science Chapter 1 — justification pilot

User-approved scope: Chapter 1 only; other chapters await review.

Full prose lines meet their column edges through spacing between complete
words. Paragraph endings, headings, captions and table cells retain natural
setting. Font size, letter shapes, line counts, page breaks and illustrations
are preserved. `wording.json` records twelve equivalent wording refinements
made to avoid excessive gaps in narrow columns. No word is hyphenated or split
to fit a line.

The compositor records true paragraph endings before splitting body fragments,
then measures final glyph bounds in Chrome to account for letter overhangs.
`--justify-existing` applies the pilot to `before.json` and refuses to run if
the current chapter has acquired unrelated content or artwork changes.
Normal composition also includes the measured word-spacing pass.

Validation:

```powershell
node build/compose-science-g7-ch01-v2.mjs --justify-existing
node build/build.mjs class-7/ch01-ever-evolving-world-of-science-v2 --pdf --bleed
node build/check-science-g7-ch01-justification.mjs
node build/audit-science-g6-ch12.mjs class-7/ch01-ever-evolving-world-of-science-v2 assets/design-history/science-v2-g7-ch01
node build/check-reference-fit.mjs class-7/ch01-ever-evolving-world-of-science-v2 --block=89,963
node build/check-science-g7-ch01-v2.mjs
node build/check-science-regressions.mjs
```

`render-audit.json` verifies 114 complete justified lines across eleven pages,
the reviewed wording changes and preservation of all other page sources.
The current PDFs remain under the repository's generated-file ignore rules.
