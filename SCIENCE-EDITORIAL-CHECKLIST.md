# Science editorial memory

The purpose is scientific reasoning. This contract supersedes older colour/icon pilots and applies to every science chapter, including existing chapters and Class 9. Read SCIENCE-TEMPLATE.md and this file before authoring. Preserve original manuscripts and keep a before/after editorial ledger.

## Checks before fitting

1. Use the correct mechanism: force, torque/alignment, induction, energy transfer, condensation, inherited adaptation. Do not substitute a vivid verb for a mechanism.
2. Replace vague material/category placeholders where identification matters. A negative observation is bounded by the apparatus and conditions, not proof of zero effect.
3. Test definitions against every later example. Distinguish magnetic material from permanent magnet; hypothesis from prediction; adaptation from individual growth response.
4. Put setup before observations, and observations before naming/explanation. An illustration or caption can give away a result just as prose can. Do not draw outcome arrows in setup illustrations.
5. Address the learner. Put captions with figures, production notes outside the book, and recording instructions in the notebook. No textbook answer lines.
6. Remove prescribed emotions and predetermined observations. A failed result must be discussable.
7. State the likely wrong mental picture, then close it in the explanation itself. A magnetic field is not a flowing substance; a compass rotates, not travels north; clouds are not visible water vapour.
8. Give claims evidence, a suitable model or a traceable authoritative source. Never retain unsupported history merely to fill a page.
9. Specify controls and what a test can rule out. Attraction alone cannot identify a permanent magnet. Replacing a cell also changes electrical contact. Negative results need functioning controls.
10. Questions must contain enough information, or explicitly ask which information is missing. A direction reference does not supply location or a route.

## Locked visual language

Use exactly the five labels in SCIENCE-TEMPLATE.md. Three consistent learning-role colours plus coordinated chapter identity colours, as revised in SCIENCE-TEMPLATE.md. Flat 24-grid icons of one stroke weight; no painted PNG feature icons. Main content illustrations remain foreground-focused PNGs where appropriate. Only first-hand work gets a closed rounded box and solid teal header, with the icon inside. Thought panels have a tint and thin rule. Explanation stays open. Neutral body text; bold defined terms only. No numbered feature labels. Use passage-specific section openers; do not use Everyday connection as a recurring label. Never restore The story begins.

## Release checks

Read every complete printed page at the declared trim. Run the builder after edits and inspect PDF page proofs, not just SVG source or the studio viewport. Check text clipping, overlap, page joins, headers and footers, figure labels, contrast, complete panels, orphan headings and underfilled pages. Do not change font size to conceal overfull copy. A scripted replacement or style pass is not evidence that the academic audit is complete.

Review sources: OpenStax College Physics 2e §22.2; OpenStax University Physics Vol. 2 §12.7; NOAA NCEI Magnetic Declination. Recheck niche or medical claims against current primary sources.

Before release, read the complete lesson across page turns. Count repeated instructions and labels; test that each occurrence has a distinct purpose. Check tables for pre-filled answers before naming, and diagrams for identifiable structures named in prose. Keep association separate from mechanism. Compare every summary and exercise against the revised definitions. Never use page-fill logic to decide where explanatory prose belongs.

Headings belong to the teaching outline, not to page breaks. Do not manufacture a heading for continued prose, results or exercise questions. Use a smaller level for genuine subtopics, including those beginning within a page. Put the heading at the start of the learning sequence; do not defer it to an explanation page after the investigation. Remove automatic continuation-title fallbacks from compositors.

Chapter 2 release guard: run `node build/check-science-diversity.mjs` after composition and justification. It checks the final source pages, not only the manuscript.
