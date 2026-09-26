# Olympiad Talent Test — Galaxy Olympiad Academy

The paper in the house look of the 2025-26 Talent Test: a cover with the
seal, the title bar, the class box, the candidate box and the instructions;
then every subject in one two-column flow under grey running heads, with
the folio at the outer corner. Separate from `../build-paper.mjs`, which
sets the Level papers in their own design and needs an answer per question.

```bash
node olympiad/talent-test/build.mjs class-3-2026-27
```

Writes `olympiad/out/talent-test/<paper>.pdf` (and the `.html` beside it).

## A paper

A folder beside this file:

| file | what it holds |
|---|---|
| `paper.json` | class, session, the seal's year, subject line, time, marks per question, and the sections in order with their question counts |
| `questions.html` | one `<section>` per subject, each question a `<div class="q">` |
| `figures/` | pictures the questions use |

The cover's instructions — how many questions, which numbers belong to
which subject, the total marks — are worked out from `paper.json`, so they
cannot disagree with the paper.

Questions are **numbered by the builder**, straight through. A question:

```html
<div class="q">
  <p>Which of the following is a prime number?</p>
  <ol class="opts"><li>91</li><li>97</li><li>92</li><li>99</li></ol>
</div>
```

- Every `<p>` is set bold, as the stems were; `class="word"` spaces a
  single word out (synonyms, jumbled letters), `class="ragged"` stops a short
  line being justified.
- Options are lettered A)–D) by the stylesheet. The builder sets them four
  across, two across or one under another by measuring them.
- `class="opts pics"` sets picture options two by two; add `tags` for
  pictures that carry words, one per line.
- `<div class="fig">` holds a figure. Widths and heights are steps
  (`w8`…`w72`, `h10`…`h20`), not per-figure numbers; there are no inline
  styles, and the builder refuses one.
- `<span class="fr"><span>3</span><span>4</span></span>` is a fraction,
  `<span class="blank"></span>` a blank to fill.
- `<div class="passage">` is an unseen passage; it may run across columns.

The build stops, writing nothing, if a section's count disagrees with
`paper.json`, a question has other than four options, or a picture is
missing.

## The seal

`logo.mjs` draws the academy's seal as vector, with the year as a
parameter (`sealYear`). The 2025-26 paper carried it as a 204-pixel bitmap
with *2025 - 2026* baked in.

## Faces

Domine (text) and Montserrat (furniture), from Google Fonts under the SIL
Open Font License, vendored in `fonts/`. Domine stands in for the Bookman
the 2025-26 paper was set in.
