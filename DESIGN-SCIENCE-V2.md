# LearnLab Science V2 — Art Direction and Design Contract

Status: design specification for a separate V2 edition. Created 15 September 2026.
Pilot: Class 6, Chapter 2, Diversity in the Living World.

## 1. Scope and authority

This file is the design foundation for the new science book, beginning with a separate Chapter 2 V2. The user explicitly requested a genuinely new design and preservation of the current chapter. This is not a recolouring or a spacing pass on V1.

Do not alter V1 pages, its compositor, assets or global styles to implement this specification. Give V2 its own chapter directory, configuration, scoped stylesheet, artwork directory and composition entry point. Show it in the library as a distinct V2 edition. Do not bind both editions into the same volume.

Within the V2 scope, this specification replaces earlier restrictions on single-column layouts, existing header/footer geometry, the existing typeface pairing and the total number of decorative colours. The scientific editorial checks, reproducible page sources, whole-panel rule, print verification and preservation of source manuscripts remain mandatory. Update or extend enforcement for the V2 profile; do not disable validation to bypass conflicts.

This document specifies intended design. It does not claim that fonts, colour conversions, illustrations or print proofs have already been validated. Those are implementation and release gates below.

## 2. The book we are making

**A lively illustrated science textbook for an inquisitive 11–12-year-old.** It should feel engaging on a quick browse and reward careful reading. Its distinctive educational promise is that students learn to observe, compare, test and explain. Do not invent a second publication identity such as “Science Field Journal.”

The visual character is bright, tactile and precise: generous pictures, strong headings, clear comparisons, warm accents and calm reading areas. Use the compositional care of an illustrated magazine while keeping the continuity of a textbook lesson.

Premium means deliberate relationships: a caption precisely placed, an illustration with the right details, a comparison easy to follow, a page turn that advances a question. It does not mean pale colours, sparse content, oversized artwork or decorative complexity.

The first V2 proof must look clearly different from V1 in its opener, page furniture, typography, activity treatment and spread compositions. Changing only colours and rounded corners fails the brief.

## 3. Principles that govern decisions

| Principle | What it requires here | What fails |
|---|---|---|
| Hierarchy | A clear reading path through the lesson; headings identify actual topic changes | A compulsory title on each page, or equally loud headings at different levels |
| Proximity | Place labels and explanations close to the relevant subject | Looking across a page to discover which explanation belongs to which plant |
| Alignment | Use a common modular grid, including for apparently informal elements | Almost-aligned pictures, captions and panel edges |
| Contrast | Use differences in scale, value, weight and space to establish importance | Making every element brighter to gain attention |
| Repetition with variation | Repeat the visual grammar; vary the composition according to the lesson | The same paragraph–picture–box stack throughout |
| Coherence | Every visual element supports meaning, orientation or a useful pause | Random leaves, laboratory objects or characters added to fill gaps |
| Evidence before interpretation | Plan the visual sequence as carefully as the prose sequence | A setup picture or caption revealing the intended result |
| Accessible redundancy | Pair colour with names, shape, position or explicit labels | Colour alone identifying a category or correct answer |

These are design applications of the sources in section 15. The dimensions and palette below are house decisions, not universal scientific laws.

## 4. Colour architecture

### The three layers

1. **Chapter identity:** recognisable on the opener, main section headings and running furniture. Chapter 2 is fresh botanical green.
2. **Learning roles:** stable across the science series. Teal for practical investigation, amber for a substantial thinking pause, clay for an occasional evidence or mechanism cue.
3. **Subject artwork:** natural full colour. A hibiscus flower may be red and a bird blue without creating another feature category.

Do not assign a new hue to every label. Do not let chapter green recolour every activity and explanation. A reader should recognise the learning role across chapters.

### Chapter 2 working palette

These are sRGB master references for initial proofs. Final print output depends on paper, ink and the printer's profile; these are not verified CMYK recipes.

| Token | Colour | Role and limits |
|---|---|---|
| `ink` | `#202D29` | All running prose, definitions and captions; strong neutral contrast |
| `paper` | `#FFFFFF` | Main reading ground; let the actual stock supply warmth |
| `forest` | `#175C3B` | Dark green chapter titles and section headings |
| `leaf` | `#329B50` | Brighter identity accent, opener shapes and chapter markers; not small body text |
| `leaf-wash` | `#EFF6E9` | Quiet reference surfaces and occasional comparison ground |
| `teal` | `#006B73` | Investigation title and practical-work cue |
| `teal-wash` | `#EAF5F3` | Investigation background |
| `amber` | `#F0AD32` | Small thinking accent; use dark ink over it |
| `amber-ink` | `#855000` | Thinking label on a light ground |
| `amber-wash` | `#FFF4DD` | Thinking panel ground |
| `clay` | `#A24B32` | Small evidence/mechanism cue on white; open explanation |
| `rule` | `#9EB8AA` | Table outlines, dividers and structural detail |

Green and teal create a related cool family; amber and clay introduce warm contrast. The palette is selected by role and value as well as hue. It is not presented as an exact complementary scheme or an automatic recipe for quality.

### Distribution and contrast

- Most reading surfaces remain white or a very light tint. Saturated colour is concentrated in the opener, artwork, titles and selected accents.
- On an ordinary spread, use chapter green plus whichever learning-role colour the content requires. If several roles occur, vary their weight instead of creating a rainbow of equal boxes.
- Keep large coloured areas and high-detail artwork from competing on the same page. A scene-led opener can carry more colour than an explanation page.
- Use dark ink on pale fills. Do not use white text on amber or bright leaf green. White may reverse from the dark forest or teal only after contrast verification.
- Use a screen contrast check of at least 4.5:1 for reading text as a preflight aid, then inspect an actual-size print proof. That screen threshold alone does not establish print readability.
- Check greyscale and colour-vision simulations: headers, group labels and essential distinctions must remain understandable.
- Do not fade all strokes and headings to make the book look gentle. Soft backgrounds need decisive text and visible boundaries.
- Future chapters may change the identity family; the functional learning colours stay fixed. Choose each identity as a complete dark/accent/wash set, not a random hue rotation.

## 5. Typography and reading maturity

V2's proposed pairing is **Source Serif 4** for sustained reading and **Source Sans 3** for titles, instructions labels, captions and navigation. Verify font availability, licences, embedding and printed glyph quality before implementation. Vendor the approved files. Do not silently substitute a system font.

Two families only. Distinctiveness comes from size, weight, placement and composition. No handwriting font for prompts, novelty display alphabet or condensed reading text.

Initial print-scale tokens, to be proved at the actual trim:

| Role | Size / leading | Setting |
|---|---|---|
| Chapter title | 32 / 34 pt | Sans bold; adapt line breaks deliberately |
| Main section | 19 / 23 pt | Sans bold, forest |
| Subsection | 15 / 19 pt | Sans semibold, forest or ink |
| Feature title | 12 / 16 pt | Sans semibold, sentence case |
| Body and glossary | 12 / 16 pt | Serif regular, neutral ink |
| Captions and figure labels | 10.5 / 13.5 pt | Sans regular, neutral ink |
| Table body | 11 / 14 pt | Prove at print size; simplify or restructure before reducing |
| Running furniture | 9 / 12 pt | Sans, quiet but legible |

All sizes become V2 tokens. No per-page type shrinking. Finalise the type scale on representative prose, activity, table and glossary pages before composing the complete chapter.

Full-width paragraphs may be justified only with measured spacing and a controlled hyphenation policy. If gaps become conspicuous, change the measure or use a natural right edge. Narrow columns use a natural right edge from the start. Never stretch letters to produce an even right margin.

Aim initially for roughly 50–70 characters per line in sustained prose. Short comparison columns can be narrower when the text is genuinely brief. Do not squeeze long explanations into three columns. Bold defined terms, not entire conclusions. Avoid all-capital paragraphs and overuse of italics.

## 6. Page geometry and rhythm

Use the existing Chapter 2 trim as the V2 pilot's starting format: 189 × 272 mm. Read the actual configuration and sheet metrics before implementation; do not assume another edition's size. Keep geometry in the V2 profile and sheet machinery, not in repeated page literals.

Initial grid: 18 mm inner margin, 15 mm outer margin, 17 mm top and 18 mm bottom. Use a six-column modular grid with 4 mm gutters. These are construction guides, not an instruction to print six text columns. Typical text spans all six columns or two groups of three. Binding clearance takes priority over symmetry.

Use a 4 pt spacing unit: 8 pt for close relationships, 12–16 pt between paragraphs or related blocks, 20–28 pt for stronger section separation. Do not add unused page height to every gap. Refit when the teaching sequence or artwork demands it.

Design facing pages together, but make each page's reading order intelligible on its own. Never place essential text, a specimen's defining structure or a comparison label across the gutter. A panoramic environmental background may cross it if losing a narrow strip changes no meaning.

One strong focal element per page is the starting point, not a quota. Dense tables can be the focal element. Alternate visually rich spreads with quieter explanation or review pages. Investigate the reason for underfill; do not treat an arbitrary percentage as permission to pad.

## 7. Composition library

| Composition | Appropriate content | Arrangement |
|---|---|---|
| Scene opener | An inviting setting and a real observation question | Integrated title and large landscape scene, followed by a short reading entry; clear space reserved for live title type |
| Observe closely | A few identifying details | One dominant specimen with selective detail views and adjacent labels |
| Compare | Two or three meaningful alternatives | Aligned specimens, matched captions and text beneath or beside each; share a baseline or explicitly explain scale differences |
| Investigate | A procedure the learner will carry out | Distinct rounded practical-work panel, numbered steps, compact material list and relevant side illustration |
| Explain | A mechanism or relationship | Open prose plus a purposeful diagram or evidence sequence; no compulsory box |
| Field record | Tables, observations and uncertainty | A quiet framed table with generous cells, followed by interpretation close to the relevant data |
| People and place | Scientist or conservation context | A contextual picture beside readable prose, linked to the chapter's question |
| Review | Keywords, summary and assessment | Dedicated reference layouts; clear grouping and steady body size |

Do not cycle through templates mechanically. Choose from the learning task. Three successive spreads using the same arrangement require editorial review.

### Chapter 2 applications

- **Opener:** a rich Indian school-ground or garden scene with a tree, low plants, wall, soil and small animals. Human figures, if present, establish observation rather than becoming portraits. Reserve a calm title area. Make details discoverable without a crowded hidden-object puzzle.
- **Plant forms:** align herb, shrub and tree examples with the corresponding descriptions. Do not centre one composite picture above columns it does not align with.
- **Leaves and roots:** create genuinely legible comparisons. Give venation and root branching enough space to inspect. Match the explanation to the specimen, not to a distant paragraph.
- **Seeds:** treat anatomy as an accuracy-critical plate, with live labels and unambiguous leader endpoints. Do not accept attractive but incorrect structures.
- **Habitats and adaptation:** use paired environments or specimens to support specific comparisons. Avoid scenery that implies a simple causal conclusion before the evidence is discussed.
- **Conservation:** connect place, observation and inference. Give the student something to reason about, rather than ending with a decorative forest and a slogan.

## 8. Illustration and art direction

Use newly art-directed raster artwork where the new composition needs it. Preserve a V1 image only if it meets the new brief; do not build the entire new edition around inherited aspect ratios.

Content illustrations should have natural proportions, clear silhouettes, restrained painterly texture and credible material detail. Use foreground-focused transparent PNG specimens and apparatus. Use complete scenic artwork for environmental openers. A scene is an intentional exception to the cutout treatment.

No glossy plastic surfaces, indiscriminate blur, stock clip art, pseudo-3D icon sets or photorealistic detail that cannot survive print size. A background should explain setting, not camouflage weak composition.

Every asset brief must specify: learning purpose, page role, final aspect ratio, visible subject size, viewpoint, required structures, exclusions, palette relationship and caption/label locations. Generate at the intended composition ratio. Do not crop a square generation into a wide slot as a routine repair.

Generate images without embedded text. Add accurate names, figure numbers and leader lines as live type. Check plant morphology, animal limbs and feet, apparatus, scale relationships, cultural context and character continuity. Naturalistic artwork is not evidence that the science is correct.

Size the visible subject, not the empty PNG canvas. Target at least 300 effective ppi for continuous-tone illustration at final print size; do not count upsampling as new detail. Judge edges and small structures on the proof.

## 9. Components and icons

**Investigate:** soft teal interior, visible but quiet border, approximately 3 mm corner radius. Place the icon and title together inside the panel. Use a compact coloured title area rather than automatically placing a thick bar across every activity. Materials, steps, safety and observations have a clear internal order. Side artwork gets its own allocated space and must not narrow instructions into a cramped strip. A result is not illustrated before the student investigates.

**Think It Through:** warm amber wash, thin boundary, approximately 3 mm corners. Use only for a substantial reasoning pause. No answer lines, pencil symbol or blank writing area. Short questions stay in the prose.

**Evidence and explanation:** open setting. Use a small clay cue only when it helps orientation. Keep meaningful passage headings; do not stamp a feature label above every paragraph. No return to “The story begins” or generic “Everyday connection.”

**Tables:** visible outer frame, lighter internal rules, pale header fill, white body. Align numerical values appropriately and text at the top of cells. Table captions stay attached. Quiet tables must still look like complete objects. Never let a sample record masquerade as the learner's own result.

**Icons:** a small custom family with a consistent optical size, stroke weight and corner character. Initial drawing grid: 32 units; final size around 6–7 mm, proved in print. Investigate should convey an observable practical task; thinking should convey a question or connection. Reject ambiguous cloud outlines and decorative pseudo-brains. Test recognition without relying on the label, then retain the label for clarity.

Raster generation is allowed for icon exploration or final artwork when it produces a clean, legible result; vector execution is allowed for simple functional marks. The medium is subordinate to consistency and recognition. This does not replace the PNG requirement for illustrative content. No tiny detailed paintings, gradients, cast shadows or emoji glyphs in the feature system.

## 10. Furniture and small details

Latest user revision: blend V1's botanical furniture into V2. Use the V1 leaf ribbon with “CHAPTER 2” at the upper left, the chapter title and a fine rule at the upper right, and mirrored outer folio tabs at the foot. The footer also carries the actual book name. Retain V2's Source Sans/Source Serif pairing and forest-green palette; keep all furniture styles scoped to V2. The chapter opener has the footer but no running ribbon. This supersedes the earlier alternate book/chapter running-head treatment. Do not apply V1's furniture script wholesale: it also changes table captions and relies on V1's typography.

The opener's chapter numeral belongs beside the two-line chapter title in one aligned composition. The numeral and the last title line share a baseline; their visible top edges should also balance. Use “2”, not a detached “02” in the opposite corner. A small “Chapter” label may identify the numeral. Do not add an invented series tagline.

Set section headings directly on the white paper using type weight, size and spacing. No full-width coloured heading bars, decorative amber dashes, button-like badges or tinted hero panels. These rejected treatments are not restored as “magazine style.” Colour belongs in relevant artwork, chapter type and the learning-role components.

A page turn does not start a section. Continuing prose, results, comparison tables and exercise questions begin directly, without a replacement page title. Never insert “Continue the investigation” automatically. Keep the larger heading size for the three main numbered sections and chapter-end reference sections; genuine subtopics use the smaller heading size and may start within a page. Place a topic heading where the learning task begins, not on the next page simply because its explanation appears there. Do not reserve an empty heading slot on continuation pages.

Ordinary comparison summaries use open aligned type and fine rules, not rounded promotional cards. Investigation and substantial thinking panels retain their previously requested rounded treatment because they identify a learning task.

Use content-linked details sparingly: a leaf-vein divider in the plant sequence, a small field-observation marker beside a record, or a specimen silhouette in a section transition. Details must remain subordinate to scientific content. Do not place a cameo on every page or adopt a mascot without a sustained teaching role.

Keep all icons inside their component boundaries. Preserve adequate binding and trim clearance. Furniture should remain visually stable while page compositions vary.

## 11. Editorial structure and reference matter

Preserve the full teaching scope while re-editing the sequence where necessary. Record cuts, moves and additions. No loss of safety instructions, important qualifications, figure references or assessment coverage during redesign.

For each investigation, identify the question, what changes, what is observed, what is held comparable and what the result can support. Separate the observation from the inference. Let unexpected results remain discussable. Use the existing science editorial checklist as a release requirement.

Glossary: terms with concise meanings, in a dedicated reference box, no smaller than body type, maximum one page. Summary: a dedicated new page. Combine only when both genuinely fit comfortably on one page. Neither becomes a dumping ground for copy displaced by illustrations.

Do not add text solely to fill a page. Additional context must resolve a misconception, give necessary evidence, connect ideas or make a task actionable. Repack before padding.

The manuscript's page numbers are provenance, not compulsory V2 page breaks. Refit the lesson as a continuous sequence of measured reading blocks. Preserve figure/caption groups, specimen comparisons, whole panels, heading support and investigation/recording-table relationships. Keep the opener and dedicated glossary/summary pages outside this flow. Report actual occupied body height and the next block that caused each break; the builder's 100% outer-SVG fill is not evidence of a full reading page. Never enlarge artwork or distribute empty height into paragraph gaps to conceal a short page.

## 12. Production isolation

Proposed paths:

```text
pages/class-6/ch02-diversity-in-the-living-world-v2/
figures/class-6/science/ch02-v2/
css/science-v2.css
build/compose-science-ch02-v2.mjs
assets/design-history/science-v2/
```

These are planned paths, not files already created. Use explicit V2 profile scoping so styles cannot recolour or reflow V1. Keep semantic manuscript content separate from placement decisions. Each generated page source still represents exactly one printed page.

Use declared trim and bleed metrics throughout. Confirm the printer's profile, marks and delivery requirements before calling a PDF press-approved. A browser-generated RGB PDF with bleed is not automatically a colour-managed press master.

## 13. Proof sequence and acceptance gates

1. Make one design sheet containing palette pairs, the actual type scale, icons, table, investigation and thinking treatments. Check contrast and actual-size legibility.
2. Compose the opener plus representative comparison, activity and explanation pages. Judge the new direction as complete facing-page spreads, not cropped components.
3. Confirm the difference from V1 is visible in silhouette, hierarchy, artwork and furniture. If it still looks like V1 with new colours, redesign before expanding.
4. Compose the complete chapter with a spread map recording each page's learning purpose, focal element, composition and asset brief.
5. Run the builder, V2-aware internal bounds checks, label checks, panel/orphan checks and science regressions. Ensure the tools inspect the actual V2 chapter and profile.
6. Inspect every complete final PDF page, including the footer and bleed. Read at actual size; inspect critical anatomy at magnification. Check crops, malformed details, caption alignment, spacing, word gaps, tables and continuity.
7. Inspect colour, greyscale and a physical proof. Confirm fonts are embedded, assets have adequate effective resolution, and trim/bleed boxes match the declared sheet.

Unresolved clipping, incorrect anatomy, result giveaways, unreadable labels or missing content block release. Automated fit success establishes geometry only; it does not establish good design or accurate teaching.

## 14. Decisions to avoid repeating

- Do not describe local refinements as a complete redesign.
- Do not reuse every old illustration and then claim new art direction.
- Do not inflate images or paragraph gaps to make pages appear full.
- Do not reduce glossary or body text to satisfy a page budget.
- Do not justify narrow columns into conspicuous word gaps.
- Do not use the same centred-image composition for every concept.
- Do not let a style transformation invent labels, repeat instructions or reveal results.
- Do not claim “print-ready” solely because a PDF exports successfully.
- Do not modify V1 while implementing or testing V2.
- Do not mistake website section banners, decorative accent dashes or invented mastheads for book page furniture.
- Do not turn each printed page into a titled slide. Decide the lesson outline before pagination; a running header already supplies navigation.

## 15. Sources and limits

The sources below inform principles, not endorsement of this specific design. The palette, fonts, geometry and treatments are editorial choices that must be evaluated on proofs.

- [Adobe: Set up a beautiful magazine layout](https://www.adobe.com/learn/indesign/web/design-magazine-layout) — margins, columns and guides provide a repeatable structure for varied editorial compositions.
- [Adobe: Colour wheel combinations](https://www.adobe.com/uk/creativecloud/design/discover/color-wheel.html) — hue relationships help organise a palette. Harmony does not remove the need to check value, saturation, contrast and printing conditions.
- [Cambridge Handbook of Multimedia Learning: reducing extraneous processing](https://www.cambridge.org/core/books/abs/cambridge-handbook-of-multimedia-learning/principles-for-reducing-extraneous-processing-in-multimedia-learning-coherence-signaling-redundancy-spatial-contiguity-and-temporal-contiguity-principles/CD5B7AE1279A9AB81F8EEBB53DBEC86E) — coherence, signaling and spatial contiguity inform removal of irrelevant decoration and placement of related words and pictures. Application to these printed pages is an editorial interpretation, not a claim of a measured learning gain for V2.

Before choosing final assets and print settings, verify the font licences, font embedding, measured contrast and the printer's output specification. No unverified claims that a particular hue improves memory or that a fixed whitespace ratio makes a book premium.

### Explanatory illustrations instead of feature strips
Do not turn short noun lists into evenly spaced website-style feature strips. Show spatial relationships with labelled artwork; teach alternative grouping rules using the same visible specimens and an actual comparison table. Keep captions beside their targets, live and readable. Treat each figure and its explanation as one reading unit.

