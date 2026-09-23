# LearnLab Design System — Science

The science volumes: Class 6 Science, Class 7 Science and Class 9 Science.

Read [DESIGN.md](DESIGN.md) first. Page grammar, the two sheets, the cover,
what the builder rejects and the rule that a panel is never divided apply to
these volumes and are not repeated here. Then read the two contracts that
govern every science chapter now:

- [SCIENCE-TEMPLATE.md](SCIENCE-TEMPLATE.md) — the September 2026 design
  contract: learning-role colours, the five feature labels, panels and icons.
- [SCIENCE-EDITORIAL-CHECKLIST.md](SCIENCE-EDITORIAL-CHECKLIST.md) — the
  editorial checks, before fitting and before release.

Science pages also use house components — `.c-reflect`, `.c-example`,
`.c-tip`, `.c-summary`, `.c-practice`, `.c-figure`. Those are specified in
[DESIGN-MATHS.md §4](DESIGN-MATHS.md); §4a below says which science feature
each one stands in for. Section numbers match the single file this was split
from.

## Science override
Class 6 and Class 7 share the current Source Serif 4 / Source Sans 3 edition described at the top of SCIENCE-TEMPLATE.md. Its left alignment, soft Investigate panels and 189 × 272 mm trim override earlier Class 6 typography and furniture instructions.
For every Science volume, SCIENCE-TEMPLATE.md and SCIENCE-EDITORIAL-CHECKLIST.md override the mathematical colour and feature conventions in [DESIGN-MATHS.md](DESIGN-MATHS.md), and anything below that conflicts with them. The September 2026 lock is teal/do, amber/think, brown/explain. Do not restore older chapter palettes or feature aliases.

---

## 4a. Science — four more, and a placeholder

The science volumes carry furniture the maths volumes have no use for. NCERT's
*Exploration* runs a large named set — Threads of Curiosity, Ready to Go
Beyond, Meet a Scientist, Pause and Ponder, Activity, Think as a Scientist,
What if…, The Quest Continues…, At a Glance, Revise Reflect Refine. Most of
those already have a house component doing the same job, and reuse is the
default:

| the science book calls it | it is |
|---|---|
| Pause and Ponder | `.c-reflect`, retitled — the title is markup |
| Example n.n | `.c-example` |
| Note | `.c-tip` |
| At a Glance | `.c-summary` |
| Revise, Reflect, Refine | `.c-practice` |

Four had no equivalent, and live in `css/science.css`:

| component | colour | panel? |
|---|---|---|
| `.c-scientist` | teal | no — rules, a portrait beside a short life |
| `.c-beyond` | teal | **yes** — a tab over a tinted box, built as the example is |
| `.c-thread` | gold | no — rules, the question as its title |
| `.c-activity` | rust | no — a band header over the steps |

**Only one of the four is a panel**, and that is deliberate. The reflect box
already owns the gold tint; a second gold box on the same spread would read as
decoration rather than as a different kind of matter. So the thread of
curiosity is set between rules instead, and the activity takes a band header
like practice, because an activity is a set of instructions to work through
rather than a box to read.

`.c-activity__safety` is a rule and a line of rust under the steps, for the
*Safety first* precaution the source calls for wherever a heating device,
a corrosive or a blade is involved. It is not decoration and it is not
optional: if an activity needs one, it goes there and nowhere else.

**A photograph that has not arrived yet is `.c-photo`.** It prints a ruled box
carrying the figure number, the width it is holding open, and a written brief
of the wanted picture. Nothing about it is subtle, because a placeholder that
could be mistaken for artwork is a placeholder that ships. It takes its width
from the `.c-figure--*` modifier around it, and `.c-photo--wide` and
`--portrait` set the shape it is reserving.

When the real image arrives it goes in `figures/<class>/`, prepared with
`build/prep-figure.mjs`, with the untouched original kept beside it as
`_raw-<name>.png`. Then either a plain `<img>` if the artwork carries no
callouts, or an `<image href>` inside the figure's `<svg>` if labels have to
stay live type over the picture.

**Science does not get a sidebar.** NCERT sets several of these boxes in a
margin rail. This book has none: every page is one column at the full measure.
`.page__side` exists in the builder's measurement probe and in no stylesheet,
so adding it is possible and would be measured correctly from the first build —
but it changes the page grammar of every book in the repo, and the boxes read
perfectly well full-measure. If a physics or biology chapter genuinely needs a
rail for an apparatus list, that is the moment to decide it, on its own merits.

### Class 6 editorial science profile

Class 6 Science Chapters 1–3 opt into `science-editorial`, a fixed-page SVG profile
specified in [SCIENCE-TEMPLATE.md](SCIENCE-TEMPLATE.md). Only its chapter
title uses display type. Numbered main sections and compact supporting
headings establish continuity. Existing Spectral reading text and reference
Poppins headings accompany foreground raster illustrations. The scoped
scale and roles live in `css/science-editorial.css`; mathematics is unchanged.

Run both the builder and `check-reference-fit.mjs`: outer-SVG fill cannot
measure internal content. The latter checks editorial text's vertical bounds,
line widths and illustration collisions. Inspect full-sheet proofs too.
This chapter profile does not establish mixed-profile volume binding support.

The editorial science profile uses chapter-specific muted palettes: blue for
Chapter 1, botanical green for Chapter 2, and ochre for Chapter 3. A single
muted terracotta activity tab contains both number and title, over one pale
warm panel with open numbered steps. The activity colour is fixed across all
science chapters and reserved for activities; never reuse it as a chapter
theme. Table bands and outside-edge folios share their chapter colour. The ribbon motif is a magnifier, leaf or plate respectively. The
opener retains its navy-and-gold badge. Mathematics keeps its existing system.

The three chapters declare `"edition": "science-tall"`: **189 × 272 mm final
trim**, with `css/edition-science-tall.css` overriding only the page dimensions.
The SVG sheet is 1052 × 1514, content ends at 1415, and footer furniture moves
with the taller trim. Bleed and slug are added by the builder; they are not
part of the final book dimensions. Spine width is a later cover calculation.
The original 189 × 246 mm standard remains unchanged for other editions.

### Activity illustration ownership

An illustration that demonstrates an activity belongs inside the same pale
activity panel as its instructions. Its labels and figure caption are inside
too. Keep the complete panel on one printed page; refit surrounding text when
necessary. General concept figures remain with the explanations they support.
The Chapter 3 compositor represents this explicitly as an activity `figure`,
so an image cannot be repacked independently from its activity.
