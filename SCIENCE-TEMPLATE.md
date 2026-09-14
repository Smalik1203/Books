# Science design contract — September 2026

This is the current contract for all science chapters. It supersedes earlier palette, Think Spark and painted cue-icon pilots. Read SCIENCE-EDITORIAL-CHECKLIST.md before writing or editing.

Latest user revision: the coordinated palette and rounded-panel treatment now applies across all existing science chapters. Chapter 1 uses blue; Chapter 2 keeps a brighter leaf green; Chapter 3 uses warm terracotta; Chapter 4 uses ocean blue. Class 9 Exploration uses a restrained blue identity. Running furniture follows the chapter colour, with pale companion rules and table washes. Teal means first-hand work, amber means thought, and terracotta means explanation across chapters. Chapter colour is separate from learning role.

Activity boxes have rounded corners, soft blue interiors and teal headers. Setup icons sit inside the header before its label, in white for contrast. Thought panels use rounded corners and a warm cream tint; explanatory features remain open. This supersedes the earlier three-colours-total restriction, outside-icon placement and Chapter 4-only pilot limit.

| Feature | Learning task | Colour | Treatment |
|---|---|---|---|
| The setup | First-hand work | Teal | Closed box, solid header bar |
| What you saw | Open questions | Amber | Tinted panel, thin top rule |
| Work it out in your head | Posed and answered thought | Amber | Same panel, different icon |
| What this rules out | Evidence and inference | Brown | Open text, no container |
| The mechanism | Causal explanation | Brown | Open text, no container |

Three recurring feature colours mean three learning tiers. Chapter identity supplies controlled additional colour. White, neutral text and tints are supporting values. Subject illustrations may retain natural colours; they must not create extra feature categories.

Icons use a 24-unit grid, one 1.6-unit stroke, no gradient, shadow, filled badge or emoji treatment. Stroke follows tier colour on white; setup icons reverse to white inside teal headers. Labels are live type and never numbered. Number actual procedure steps and assessment questions only. Everyday connection is an ordinary styled section opener, without a feature icon. The story begins is not used.

Body text is neutral. Bold identifies defined terms, not instructions or whole takeaway sentences. Narratives, captions, summaries and ordinary section headings do not invent extra named features. Prompts are for discussion or notebook work: no writing lines in the textbook.

Keep Spectral and Poppins in Class 6, the declared edition's trim and type scale, foreground-focused PNG content illustrations, and existing header/footer geometry. Only their semantic colours change. Do not insert a picture merely to fill space. Setup artwork must show apparatus and actions without showing the result before the investigation.

Shared roles: build/science-learning-cues.mjs and css/science-locked.css. Class 6 compositors emit fixed printing pages; build/science-botanical.mjs owns furniture. Each page is one printed page. Refit after content changes and inspect every complete final PDF page. Academic meaning takes priority over an old page count.

After composing Class 6 chapters 1–3, build the chapter for measurement, run `node build/justify-science-prose.mjs <chapter>`, then build the final PDF. Re-composition overwrites measured justification. Chapter 4 performs its own measured justification. Run `check-reference-fit.mjs <chapter> --block=89,963`: the ordinary builder sees an SVG as a full page and cannot establish its internal text fit.

Read activity contents after transformation, not just their labels. Move every interpretation out of the setup; taking the last array item is not a reliable way to identify a conclusion. Check references after removing activity numbers. Check both the source and fallback illustration in a reference card when changing its scientific claim. Features may be absent when the chapter has no matching reasoning task; never add filler merely to use every icon.
