# Working in this repo

A print book, not a web app. Every decision below exists because getting it
wrong wasted real time.

**Read [DESIGN.md](DESIGN.md) before touching a page.** The design system is
enforced by the builder, not by discipline — a page that invents its own
colour, type, stroke or spacing fails the build.

## The one idea

**Each source file is exactly one printed page.** There is no reflow engine.
`pages/class-9/<chapter>/p007.html` *is* page 7, and what the proof shows is
what the PDF gets.

The cost of that: when you add or cut content you must re-fit the pages
yourself. The builder tells you when you have not.

## Always run the builder after editing

```bash
node build/build.mjs class-9/ch04-algebraic-identities
```

It is the only thing that will tell you the truth. It checks:

| check | what it catches |
|---|---|
| overflow | content past the text block — `!` past 12mm is real clipping, `~` below that just runs into the margin |
| fill | a page under 88% reads as unfinished; the last page is exempt |
| tag balance | an unclosed `<p>`. Browsers repair these silently — three shipped before this check existed |
| class names | a class no stylesheet defines. Silently does nothing; `.derivation` rendered as a run-on line for weeks |
| font sizes | a literal `12pt` anywhere in `css/` — everything must come from the scale |
| maths | a collapsed escape (`\times` arriving as a tab) or a missing backslash (`\dfrac` as `dfrac`, which KaTeX cheerfully sets as a product of variables) |

Flags: `--pdf`, `--png` (2x page proofs), `--bleed` (press sheet: trim plus
3mm bleed, no marks). A bare class name builds every chapter under it.

## Escaping — read this before writing any LaTeX

Backslashes are eaten when content passes through a shell heredoc or a JS
string literal. `\times` becomes a tab; `\frac` becomes a form feed;
`\dfrac` becomes `dfrac`. This happened five times in one session.

- Prefer the **Write tool** for any file containing LaTeX.
- In a node script, build the backslash: `const B = String.fromCharCode(92)`.
- The builder catches both failure modes, but only after you have wasted a
  build cycle.

## Fitting pages

**A trim only counts when it removes a whole rendered line.** Shaving twenty
characters off a paragraph that still wraps to three lines changes nothing —
the overflow will sit at exactly the same millimetre and you will think the
edit did not apply.

Tools, in the order you usually want them:

```bash
node build/repack.mjs  <chapter> [--dry]   # measure every block, refill the pages
node build/settle.mjs  <dir> 4 7 12        # push a page's last block forward
node build/split-practice.mjs <dir>        # one block per question, so exercises can flow
```

`repack` is optimal for whole blocks in fixed order — if it says *29 in, 29
out*, nothing can move up and the remaining white is locked behind a
component too large for the space left. Closing those gaps means either
editing prose at the join or letting a component break across a page, which
is a design decision.

## Beyond the Book

Every chapter ends with ten more pages — `p101.html` to `p110.html` — that take
the chapter further without adding syllabus. They sort last whatever the
chapter does, so a chapter may grow to a hundred pages without renumbering
them. The stages, their contents and the components they added to the library
are in [DESIGN.md §6a](DESIGN.md); **the rest of the section is built from the
components the chapter already uses**, which is the point.

Every stage opens with a `.c-stage` head — number, name, and what the stage
is for — and every Bridge page carries **`data-bridge`**, which puts
*· Beyond the Book* in the running head. **`repack.mjs` drops that
attribute** when it rewrites a page; put it back before you build.

The section is four stages (questions tried and explained, worked problems,
problem sets, answers) and a stage may start part-way down a page. It is
written as a lesson, not a method: no named strategies, no coaching
vocabulary — see DESIGN.md §6a before writing one. To refit it without disturbing
the chapter proper, copy `p101`–`p110` into a scratch chapter directory,
`split-practice` and `repack` there, then copy them back — `repack` has no
page range and would re-pack the whole chapter.

The page before `p101` carries `data-close`. That tells the fill check the
chapter proper ends there and may end part-way down the page — without it,
every chapter's closing page is reported as short.

## Binding a book

`--book` concatenates a class into one volume with continuous folios. Two
things it does that a chapter build does not: it inserts a blank verso so
each chapter opens on a recto, and it re-scopes every palette from `:root`
to `[data-ch="N"]`. Leave the palettes at `:root` and the last chapter
recolours the whole book.

## Two editions

`css/tokens.css` holds **A4, the standard trim**. `css/edition-b5.css`
overrides **only** the
size-dependent tokens — trim, margins, measure, type scale, figure widths,
spacing rhythm. Colour, components and hierarchy are shared.

A chapter with no `edition` field is A4. Never fix a B5 problem by editing
`tokens.css` — that is the A4 book.

`chapter.json` declares `"edition": "b5"`. The builder, the bleed sheet, the
proofs and the studio all follow it.

## Covers

A cover is not a page and does not go through `build.mjs` — but the studio
does show it; see below.

```bash
node build/cover.mjs class-9/maths-part1 --png
```

Source is `covers/<class>/<name>/cover.json`. Its `content` is a list of panel
files, in back-spine-front order, and they live in `covers/<class>/_shared/`
so several covers share one blurb — a blurb edited in three places is a blurb
that will differ. `direction` and `finish` become classes on the wrap:
a **direction** brings its own display face, artwork and front arrangement
(`arc` is the current one); a **finish** only repaints, through the token
contract at the top of `css/cover.css`.

The spine width, the EAN-13 and the ISBN check digit are computed, not typed —
see §7b of DESIGN.md. `--bleed` refuses to write a press sheet while the QR is
a placeholder; `--allow-placeholder` overrides.

Two tools beside it:

```bash
node build/fetch-cover-fonts.mjs                       # vendor the cover faces
node build/qr-vectorise.mjs in.png assets/qr-x.svg     # bitmap QR -> vector
node build/cover-swatch.mjs arc                        # colourways, one sheet
```

`fetch-cover-fonts.mjs` is deliberately separate from `fetch-fonts.mjs`, which
owns the book's two locked faces and rewrites `css/fonts.css` wholesale. A
jacket carrying a display face the text block does not have is ordinary book
practice; nothing under `pages/` can reach it.

## Studio

```bash
node build/serve.mjs
```

<http://localhost:5180> — library, page/spread/signature views, true-size
calibration, and a Build button. Watches `pages/`, `css/` and `covers/` and
rebuilds whichever changed. The book renders in an iframe so the studio's
stylesheet and the book's can never reach each other.

Covers appear in the library under their class, in a group of their own, and
open at `/cover/<class>/<name>`. That viewer has no pager, no spreads and no
signature — a wrap is one sheet, not a run of pages — but the sheet toggle
shows trim against the press sheet, and Build runs `cover.mjs` with the proof
and the press sheet. A panel edited in `covers/<class>/_shared/` rebuilds every
cover of that class, since that is who shares it.

## Don't

- Edit anything under `build/class-9/` — it is regenerated every build.
- Add a third typeface, a fourth colour, or a font size off the scale.
- Reach for an inline style. If the system lacks something, **add it to the
  system** — a component or a modifier — so the next page can use it too.
- Trust a proof rendered at the wrong page size. `toPngs` takes the sheet
  from the edition; an A4 page in a B5 window comes back cropped and reads
  as though it were clipped.
