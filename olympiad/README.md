# Olympiad papers — Galaxy Olympiads Academy

Multiple-choice Olympiad papers, one file per level: Level 1, Level 2,
Level 3. Separate from the books: nothing here goes through
`build/build.mjs`, and a paper flows rather than being fitted page by page.

```bash
node olympiad/build-paper.mjs class-9/level-1   # one level
node olympiad/build-paper.mjs class-9           # every level-N.md in the class
```

Each level writes two PDFs to `olympiad/out/<class>/`:

| file | what it is |
|---|---|
| `level-1.pdf` | the question paper: one header box with the academy and the level, then all the questions in one two-column flow |
| `level-1-key.pdf` | the answer key, printed separately for the teacher |

## Writing a level

Copy `class-9/level-1.md` to `level-2.md` and replace the questions.

```
---
academy: Galaxy Olympiads Academy
level: 2
class: 9
subjects: Mathematics & Science
correct: 4
wrong: -1
questions: 75
---

## Mathematics

1. The value of $(a + b)^{2} - (a - b)^{2}$ is
   (a) $2ab$
   (b) $4ab$
   (c) $a^{2} + b^{2}$
   (d) $0$
   answer: b
```

- **`## Subject`** starts a section. Sections are lettered A, B, C… in order and
  follow straight on from one another.
- **Questions are numbered straight through**, 1 to 75, across sections. The
  builder stops if a number is out of place.
- **Every question needs four options, `(a)` to `(d)`, and an `answer:` line.**
  Extra lines before the options are set as separate lines in the question,
  which is how Assertion and Reason are written.
- `$…$` is maths (KaTeX). Use `\tfrac` in the question and `\dfrac` in the
  options. `**bold**` and `*italic*` also work.
- `figure: figures/name.svg` puts an SVG between the question and its options.
  The classes `fg-grid`, `fg-axis`, `fg-pt`, `fg-lab` and `fg-tick` are
  defined in `paper.css`.
- `{apple}` puts a picture in a question or an option, and `{apple*5}` puts
  five. The pictures are the symbols in `icons.svg`; add one there and every
  paper can use it. Seven more are drawn to order: `{clock 3:30}`,
  `{coin 5}`, `{note 10}`, `{tens 3}`, `{ones 4}`, `{dice 6}` and `{blank}`.
- A question line holding only pictures and `+ − = ?` is set large, as in
  `{apple*4} + {apple*3} = {blank}`; `|` in it leaves a gap between groups.
- `style: junior` in the front matter sets larger type for small classes.
- `<!-- comment -->` lines are ignored.

The builder decides for itself whether to set the options four across, two
across or one below another, by measuring them. It writes nothing if the file
has a problem, and it warns when the answers fall into a run or a repeating
pattern.
