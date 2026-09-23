# Science design contract — September 2026

This is the current contract for all science chapters. It supersedes earlier palette, Think Spark and painted cue-icon pilots. Read SCIENCE-EDITORIAL-CHECKLIST.md before writing or editing.

## Class 6 and Class 7 shared edition — 23 September 2026

The user's current direction supersedes the older Class 6 typography and justification instructions below. All existing Class 6 Science chapters (1, 2, 3, 4 and 10) now follow Class 7: 189 × 272 mm trim, Source Serif 4 body text, Source Sans 3 headings, natural right edges, regular serif chapter numerals and semibold full-width chapter titles. The physical reading scale is 24/32 units on the 1052-unit page grid; section headings are 38/46, subheadings 30/36. Neither prose nor figure labels may be shrunk to recover a page.

Investigate uses the approved soft teal title bar and lighter translucent body tint, with a matching live vector icon. Think It Through is a compact amber reasoning panel. Explanations remain open. Compare alternatives in framed tables, with aligned criteria and scientific qualifications retained nearby. Body illustrations retain their existing artwork and proportional size; small pictures may sit beside the paragraph they explain.

Class 6 regeneration is `node build/compose-science-g6-modern.mjs [chapter-number]`. Its semantic source is `assets/design-history/science-g6-modern/content.json`, transcribed from the immutable `source-pages.json`; deliberate restructuring is recorded in `build/science-g6-modern-editorial.mjs`. Do not regenerate these chapters with historic manuscript compositors or run justified-prose tools on them. The modern compositor writes fixed page files into the existing chapter directories; it does not recreate a Science V2 edition or duplicate chapter.

Run the builder, `build/check-science-g6-retention.py`, `node build/audit-science-g6-modern.mjs`, and `node build/check-science-regressions.mjs`. `build/proof-science-g6-modern.py` renders final reading PDFs through Poppler and verifies both reading and bleed media boxes. Per-chapter page maps and rendered bounds record protected components at short-page joins. Reference summaries remain complete, and Chapter 10 retains its separately numbered Beyond the Book source files. No spacing inflation or decorative enlargement is permitted to conceal a short page.

The instructions below describe the previous edition where they conflict with this section; they remain relevant to unmigrated Science editions.

Latest user revision: the coordinated palette and rounded-panel treatment now applies across all existing science chapters. Chapter 1 uses blue; Chapter 2 keeps a brighter leaf green; Chapter 3 uses warm terracotta; Chapter 4 uses ocean blue. Class 9 Exploration uses a restrained blue identity. Running furniture follows the chapter colour, with pale companion rules and table washes. Teal means first-hand work, amber means thought, and terracotta means explanation across chapters. Chapter colour is separate from learning role.

Activity boxes have rounded corners, soft blue interiors and teal headers. Setup icons sit inside the header before its label, in white for contrast. Thought panels use rounded corners and a warm cream tint; explanatory features remain open. This supersedes the earlier three-colours-total restriction, outside-icon placement and Chapter 4-only pilot limit.

| Feature | Learning task | Colour | Treatment |
|---|---|---|---|
| Investigate | First-hand work | Teal | Closed box, solid header bar |
| What Did You Notice? | Open questions | Amber | Tinted panel, thin top rule |
| Imagine This | Posed and answered thought | Amber | Same panel, different icon |
| Follow the Evidence | Evidence and inference | Brown | Open text, no container |
| How It Works | Causal explanation | Brown | Open text, no container |

Three recurring feature colours mean three learning tiers. Chapter identity supplies controlled additional colour. White, neutral text and tints are supporting values. Subject illustrations may retain natural colours; they must not create extra feature categories.

Icons use a 24-unit grid, one 1.6-unit stroke, no gradient, shadow, filled badge or emoji treatment. Stroke follows tier colour on white; setup icons reverse to white inside teal headers. Labels are live type and never numbered. Number actual procedure steps and assessment questions only. Use a passage-specific section opener, without a feature icon; do not use the recurring label Everyday connection. The story begins is not used.

Body text is neutral. Bold identifies defined terms, not instructions or whole takeaway sentences. Narratives, captions, summaries and ordinary section headings do not invent extra named features. Prompts are for discussion or notebook work: no writing lines in the textbook.

Keep Spectral and Poppins in Class 6, the declared edition's trim and type scale, foreground-focused PNG content illustrations, and existing header/footer geometry. Only their semantic colours change. Do not insert a picture merely to fill space. Setup artwork must show apparatus and actions without showing the result before the investigation.

Shared roles: build/science-learning-cues.mjs and css/science-locked.css. Class 6 compositors emit fixed printing pages; build/science-botanical.mjs owns furniture. Each page is one printed page. Refit after content changes and inspect every complete final PDF page. Academic meaning takes priority over an old page count.

After composing Class 6 chapters 1–3, build the chapter for measurement, run `node build/justify-science-prose.mjs <chapter>`, then build the final PDF. Re-composition overwrites measured justification. Chapter 4 performs its own measured justification. Run `check-reference-fit.mjs <chapter> --block=89,963`: the ordinary builder sees an SVG as a full page and cannot establish its internal text fit.

Read activity contents after transformation, not just their labels. Move every interpretation out of the setup; taking the last array item is not a reliable way to identify a conclusion. Check references after removing activity numbers. Check both the source and fallback illustration in a reference card when changing its scientific claim. Features may be absent when the chapter has no matching reasoning task; never add filler merely to use every icon.

Chapter 2 table pilot: visible chapter-colour outer rules, lighter internal row and column rules, pale header wash and white body cells. Tables remain visually quieter than teal investigation panels. Preserve measured cell spacing and reading copy.

Chapter 2 continuous-lesson revision: use Think It Through only for substantial reasoning pauses. Brief questions stay with the relevant prose; immediate observation and comparison questions belong within Investigate. Do not assign a panel to every question. Do not insert stock notebook directions before each table or add notes according to spare page space. Place guidance by teaching sequence, then fit pages. Other chapters retain their current labels until separately revised.

## Glossary and summary pages
Keywords have short meanings in a dedicated softly tinted reference box, at most one page. Start the glossary and summary on new pages; keep the summary together. Combine them only when both are genuinely short enough for a comfortable single page. A shorter glossary page is acceptable. This chapter-end reference box is distinct from the do/think/explain features. Chapter 2 implements separate pages.

Glossary definitions use the main body-text size and leading. Fit the reference page through column widths and entry spacing, not table-sized text.

Do not distribute unused page height into paragraph gaps. Preserve the reading rhythm; refit related sections or leave a natural lower margin. Chapter 2 caps additional inter-block spacing at 8 units (summary at 22), never the former 44-unit habitat expansion.

Chapter 2 Think It Through uses the user-requested generated transparent PNG head-and-question-mark icon, replacing the rejected cloud outline. This is an approved exception to the code-native feature-icon rule. Keep it inside the header and verify recognition at print size.

## Editorial hierarchy and illustration sizing
Class 7 Science: use tables for explicit distinctions between
concepts, materials, processes or roles. Put alternatives under clear headers
and align comparable criteria in rows; retain scientific limits and exceptions.
Keep each framed table and its guidance whole. Ordinary procedure steps, topic
overviews and stages of a continuous process need not become comparison tables.
The scoped implementation is `build/science-g7-comparison-tables.mjs`.

Never grow an illustration to consume a page gap. Choose and record its size by instructional role: contextual scene, structural comparison, anatomical detail, or small identification reference. A spread should have a deliberate dominant element. Keep captions close, preserve body type, and use the shared alignment grid for varied compositions. Review the visible subject, not merely its image frame. Detailed anatomy can need more space than a simple exercise specimen. Chapter 2 uses an explicit per-illustration size map; page fill cannot modify it.
