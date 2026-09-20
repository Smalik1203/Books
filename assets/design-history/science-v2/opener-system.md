# Reusable editorial chapter opener

This is an opt-in design, currently applied only to Class 6 Science V2 Chapter 2. It replaces the wavy header and edge-to-edge illustration, whose different edges made their white separation look accidental.

## Composition

- A full-width rectangular band finishes with a thin chapter-colour edge. A subtle gradient uses the chapter's own deep and accent colours.
- The number uses Source Serif 4 in regular weight, paired with the Source Sans 3 title in semibold 600. The number occupies a fixed left column, with a centred Chapter label above it and a quiet vertical divider separating it from the title.
- Title text remains live, at a fixed size. One or two title lines use the same 300-unit header height; three lines extend it by one 86-unit leading interval. Do not squeeze a long title or invent a subtitle.
- The illustration and introduction share the 89–963 reading grid. Leave 36 units (about 6.5 mm at this trim) between the band and illustration, and another 36 units before the introduction's text frame.
- The image keeps its natural aspect ratio and complete content. White margins make it part of the reading column. Illustration height follows its aspect ratio, never leftover page space.
- A small subject motif is optional. The botanical version uses slender alternating leaves attached to a continuous curved stem, with quiet central veins. Its soft contrast and clear title spacing keep it secondary to the lettering. A chapter without a suitable motif uses `none`; the structure does not depend on decoration.
- The V2 running-header ribbon reuses this same botanical geometry through `botanicalMotif`, with strokes and contrast adjusted for its smaller print size. Running chapter labels use semibold 600; footer page numbers use regular Source Serif 4 at 400.

## Integration

Import `chapterOpener` from `build/chapter-opener.mjs`, and load `css/chapter-opener.css` in the edition stylesheet. The helper uses the existing 1052-unit editorial SVG page grid. Adapt the grid deliberately before using it with a different page system.

Inputs are a unique chapter `id`, one- or two-digit `number`, one to three editorially chosen `titleLines`, `bleed` in SVG units, optional `motif` (`leaf` or `none`), and `image` with `href`, natural `aspect` (width/height), and `alt`. Derive bleed from `sheetMetrics`; do not hard-code a physical trim.

The result contains `html`, `bodyTop`, and `layout` measurements. Render the HTML once and start the introductory copy at `bodyTop`. The helper escapes supplied text and generates a chapter-specific gradient ID. Different chapters must use different IDs when bound together.

The edition supplies `--opener-deep`, `--opener-accent`, `--opener-detail`, `--opener-sans`, `--opener-serif`, and its existing `--size-body` token. The current geometry is fitted to a 24-unit base; preserve those proportions or refit as a complete edition. Never apply the V2 palette to other chapters globally.

Two-digit numerals use a smaller display step and optical vertical adjustment within the same number column. All title lines keep the same size. The right limit is 844 with the leaf motif, or 963 without it; select sensible line breaks and verify rendered width. If three lines cannot hold the title, revise the opener design rather than silently truncating it.

## Before adopting in another chapter

Run `node build/check-chapter-opener.mjs` for the five reusable-layout cases. Then render the target chapter with its own fonts, title, artwork and trim; verify title fit, image detail at print size, the introduction's lower bound, footer clearance, and bleed. A three-line title moves the body down and requires a fresh page fit.

The initial V2 opener integration retained 28 pages. The later teaching-enrichment pass expands the chapter to 29 pages without changing the opener. Other chapters, including original Science and duplicate 6, have not adopted this component.
