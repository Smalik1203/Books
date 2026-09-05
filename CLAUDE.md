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
3mm bleed, with crop marks in a 7mm slug). A bare class name builds every
chapter under it.

**A proof is the whole sheet, and it was not always.** Headless Chrome
lays a page out in a viewport shorter than the window it is given — 23mm
shorter, on the build this was found with — so every proof rendered here
before that was measured came back blank below the last 23mm of the page.
That is where an overrun shows and where the folio sits, which is why five
of the six chapters were shipping clipped pages nobody had seen. The
builder measures the difference now and crops the capture back to the trim;
if a proof ever looks short at the foot again, that measurement is the
first thing to check.

```bash
node build/footer-swatch.mjs [palette]     # the foot of the page, treatments side by side
```

The foot is the one piece of furniture on every leaf, so it is worth
judging as a set rather than one page at a time. This renders the foot of a
verso and a recto for each candidate at trim width in the book's own
stylesheet — a footer judged in other type at another size is judged wrong.
It writes a proof under `build/_footer-swatch/` and nothing else; a
treatment that wins goes into `css/page.css` by hand.

The foot was reviewed this way and **left as it is**: the slab is long for
one numeral and the outline bar carries nothing, but both bleeding off the
edge is deliberate (§ the bleed sheet), and the skew ties the foot to the
chapter openers. Reopen it with the tool rather than from memory.

## Four checks the builder does not do

The builder measures pages. These measure what is on them, and each was
written after the thing it catches had already shipped.

```bash
node build/fit-options.mjs  <chapter> [--fix]   # options set in more columns than they fit
node build/check-labels.mjs <chapter>           # figure labels printing through each other
node build/gaps.mjs         <chapter> [--min N] # what is holding each short page open
node build/orphans.mjs      <class|chapter> [--all]  # openers stranded at the foot
```

`fit-options` measures every option at its natural width. A set of
**options** is read as a set, so every one has to fit and the count has to
divide them evenly — four options in three columns leave the fourth alone
on a second row. A list of exercise **parts** is read one at a time, so one
long part wrapping is ordinary setting and is left alone; parts are
narrowed only when more than a third of them overflow. It only ever
narrows. It also refuses to run against a build older than the sources,
because it measures the build and edits the source, and the two have to be
the same chapter.

`gaps` does not fix anything. It names the block that would not fit, which
is the difference between a fitting problem and a design decision: a gap
held by a figure or a heading stays, and repack cannot help you.

`orphans` reports openers stranded at the foot of a page. An **opener** is
anything that starts new matter — a section head, a subtopic head, a stage
head, the band that opens an exercise set, or a worked example — and under
it, measured from the foot of its own title, there must be at least five
lines of set matter. Less than that and the reader is handed a promise and
a page turn, with the figure the example was drawn to explain overleaf.
`--all` lists every page that ends on an opener with its count.

It only reports; the rule that acts on it is in `repack.mjs`, so **run
`refit` to apply it**.

## A panel is never divided over a page break

An example, a key idea, a tip, a Think and Reflect, a solution — every box
with a border round it goes on one page or moves whole to the next. It may
not be cut.

There used to be `--head` and `--tail` modifiers that let one run over the
break, and `close-gaps.mjs` spent them to buy back a short page. What the
reader got was an open-bottomed tray at the foot of one page and a lidless
one at the head of the next, with the folio and the running head set
between two halves of one thought. Four shipped that way.

Both tools are gone, `splitExample` in `fragment.mjs` throws, and **the
builder reports `--head` or `--tail` in a page as a design violation**. A
panel that will not fit moves to the next page, and the white it leaves
behind is closed by **editing the prose at the join** — which is the one
repair that costs the reader nothing.

An exercise band is not a panel: `.c-practice` is a coloured head over an
open list, so a numbered list may continue overleaf under a
`.c-practice--cont` block. `split-practice` still does that, and should.

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
node build/refit.mjs   <chapter> body|bridge [--dry]  # refit one half of a chapter
node build/repack.mjs  <chapter> [--dry]   # measure every block, refill the pages
node build/settle.mjs  <dir> 4 7 12        # push a page's last block forward
node build/split-practice.mjs <dir>        # one block per question, so exercises can flow
node build/join-panels.mjs <dir>           # put a divided panel back together
```

**`refit` is the one to reach for**, because `repack` has no page range: run
it on a chapter and it packs the chapter proper and Beyond the Book as one
flow, which merges the division into the chapter and moves every break in
the half you were not editing. `refit` does one half in a scratch chapter
beside it, stamps `data-bridge` and `data-close` back on afterwards, and
rebuilds so nothing downstream is left measuring a chapter that no longer
exists.

`join-panels` is now only a repair tool: nothing divides a panel any more,
so it should find nothing to join. If it does, something has reintroduced
`--head`/`--tail` — and the builder will already have said so.

`repack` is optimal for whole blocks in fixed order — if it says *29 in, 29
out*, nothing can move up and the remaining white is locked behind a
component too large for the space left. Closing those gaps means editing
the prose at the join — a panel is never divided, so there is no other
lever.

## Beyond the Book

Every chapter ends with ten or so more pages — `p101.html` up — that take
the chapter further without adding syllabus. They sort last whatever the
chapter does, so a chapter may grow to a hundred pages without renumbering
them. Ten is the budget, not the boundary: four of the six run to eleven or
twelve, because that is what the four stages came to. Holding a chapter at
ten by letting its last page clip is not the alternative, and was what five
of the six were doing. The stages, their contents and the components they added to the library
are in [DESIGN.md §6a](DESIGN.md); **the rest of the section is built from the
components the chapter already uses**, which is the point.

Every stage opens with a `.c-stage` head — number, name, and what the stage
is for — and every Bridge page carries **`data-bridge`**, which puts
*· Beyond the Book* in the running head. `repack.mjs` drops that attribute
when it rewrites a page; `refit.mjs` stamps it back on, which is the reason
to refit through it rather than repacking by hand.

The section is four stages (questions tried and explained, worked problems,
problem sets, answers) and a stage may start part-way down a page. It is
written as a lesson, not a method: no named strategies, no coaching
vocabulary — see DESIGN.md §6a before writing one. Two chapters were still
carrying the ten-stage draft that §6a describes being thrown out, complete
with The Trap Room and named moves to memorise; if a stage head is not one
of the four, that is what you are looking at.

To refit the division without disturbing the chapter proper, use
`node build/refit.mjs <chapter> bridge`, which does the scratch-chapter
dance for you — `repack` has no page range and would re-pack the whole
chapter as one flow.

The page before `p101` carries `data-close`. That tells the fill check the
chapter proper ends there and may end part-way down the page — without it,
every chapter's closing page is reported as short.

## Binding a book

`--book` concatenates a class into one volume with continuous folios. Two
things it does that a chapter build does not: it inserts a blank verso so
each chapter opens on a recto, and it re-scopes every palette from `:root`
to `[data-ch="N"]`. Leave the palettes at `:root` and the last chapter
recolours the whole book.

## Three trims, one standard

`css/tokens.css` holds **Crown Quarto, 189 × 246 mm — the standard**.
`css/edition-a4.css` and `css/edition-b5.css` override **only** the
size-dependent tokens — trim, margins, measure, type scale, figure widths,
spacing rhythm. Colour, components and hierarchy are shared.

A chapter with no `edition` field is Crown Quarto. Never fix an edition's
problem by editing `tokens.css` — that is the standard book.

`chapter.json` declares `"edition": "a4"` or `"b5"`. The builder, the bleed
sheet, the proofs and the studio all follow it.

**Changing a trim re-breaks every page in the book,** because the page break
*is* the source file. The pages under `pages/` are fitted to Crown Quarto;
building them at A4 produces a valid but badly fitted book until every
chapter is refit. Two things learned doing it, both now in the tokens:

* **Figure widths are set against the height of the text block, not the
  measure.** A figure's height belongs to its artwork; width is all a
  stylesheet controls, and what decides whether a figure packs is how much
  of the page it eats vertically. Crown Quarto is squarer than A4, so
  scaling figures with the measure grew every one of them by a tenth as a
  share of the page — enough to turn six short pages in a chapter into
  sixteen.
* **`--fig-full` is a step like the others,** not `var(--measure)`. At the
  full measure a grid came to 55% of the page here, and one chapter had
  seven of them.

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
(`grid`, `lattice`, `curve`, `arc` for Class 9 and `comb` for Class 8); a
**finish** only repaints, through the token contract at the top of
`css/cover.css`.

**A direction currently swallows the finish, so `finish` is inert on one.**
Every direction block sets the same tokens the finish blocks set and comes
later in `cover.css`, so it wins the cascade at equal specificity: `night`,
`solar`, `cobalt` and `vivid` all render a byte-identical proof of an `arc`
cover. That is why Class 9 declares `night` and gets arc's palette anyway,
and why Class 8 declares no finish at all. `cover-swatch.mjs` is unaffected
because it injects `--jk-front-*` of its own. Colour on a cover is a
direction's business until someone decides otherwise.

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

<http://localhost:5180> — library, page and spread views, and a Build
button.

**It restarts itself. Start it once and leave it.** Three different things
used to need a kill and a re-run, and all three are handled now:

| you change | what happens |
|---|---|
| `pages/`, `css/`, `covers/` | that chapter or cover rebuilds, the tab reloads |
| `build/ui/app.js`, `app.css` | the tab reloads — nothing to rebuild, nothing to restart |
| `build/serve.mjs` and what it imports | the studio restarts and the tab comes back on its own |

The last one is why this was tedious. Every toolbar, every id and the whole
viewer live in template literals compiled into `serve.mjs`, and node cannot
swap them out from under itself — so the process has to go. It now re-execs
under `node --watch` and steps aside, picking the port once and handing it
down so a restart cannot race its own closing socket into 5181 while the tab
knocks at 5180. `NO_WATCH=1` opts out; `PORT=` still wins.

The tabs come back because the reload client reloads on a **reconnect** as
well as on a message, and because it now goes into the studio's own pages
and not only into the book inside the iframe.

A running studio handing yesterday's compiled markup to a script read fresh
off disk is how two studio bugs started, so this is not only convenience.

The bar is Chrome's PDF toolbar, in Chrome's order: the page box, a rule,
minus, the level, plus, a rule, the fit toggle — **centred**, on a
`1fr auto 1fr` grid rather than a flex row with spacers, since spacers
centre the middle only when the two sides happen to be the same width.
`ctrl` with `+` and `-` walks the ladder, and **`ctrl+0` resets to 100%** —
what the browser's own does, and what a chapter opens at.
The arrows read the book: **up and down scroll, left and right turn the
page** — sideways instead while there is anywhere sideways to go, and at
the far edge they turn the page rather than dead-ending. Space and
shift-space take a screenful, PageUp/PageDown/Home/End whole pages.

**They work in every mode and from either document, and both halves of
that had to be made true.** They are answered by `app.js` rather than the
browser, because the book is in an iframe and the stage around it never
holds focus — so nothing scrolled at all until they were. And the handlers
go on the book's document as well as the studio's: one click on the page
moves focus into the iframe, and for a while every key after that went to
a document listening for nothing. The book's document is replaced on every
load, so they are wired again there.

The **fit button shows the mode it is in**, not the mode it would give: an
upright sheet with the arrows running down it for fit to page, a wide one
with them running across for fit to width, and a tooltip saying what the
icon says. A control that names its own opposite has to be read twice. From
a fixed percentage it returns to fit to page, so it is a way back as well as
a toggle.

**A chapter opens at 100%**, the page at the size the stylesheet says.
**Fit to page is 71% on the trim and 66% on the press sheet**, and measures
nothing: it used to measure the stage, which put it anywhere from 46% to
116%, so the same book came up a different size on every screen and no two
people describing a page were describing the same one. Two numbers because
there are two sheets — 209 × 266 against 189 × 246 — and one number would
make the page jump larger the moment Bleed went on, which is the one moment
it should sit still. Fit to width still measures, because the width of the
stage is the whole question there.

**The level is typed, not chosen.** Any percentage from 10 to 500 — a
proof gets read at whatever makes one figure legible, and 137 was never
going to be on a menu. The − and + buttons walk a ladder through that
range; nonsense in the field puts the level back to what it was.

The menu of six presets went with it, and **Actual size and the bank-card
calibration went with the menu**. Uncalibrated, Actual size was 100% under
another name, and the calibration behind it was the one control here that
had to be set up before it told the truth. If true-size proofing is wanted
back, it wants to be its own thing rather than a menu entry that lies
until configured.

The bar carries two switches — **Bleed** and **Spreads** — and neither
names the state it is already in: a chapter opens on the trim, in pages.
They sit apart, and on purpose. **Spreads** is in the middle cluster past
the fit toggle, with everything else that changes how the book is laid out
on the screen. **Bleed** is on the right beside Print PDF, because it
changes which sheet you are looking at — the reading page or the one that
goes to press — and that is the question the download beside it answers.
A measurement is not a thing you can press either, and the sheet sizes live
in the tooltips. Five things came off and are not to be pasted back:

* **Trim, and Pages.** Each was one of a pressed pair where one was always
  the answer. Both are switches now, off in the state a chapter opens in,
  and the `.seg` group went with them.
* **Every measurement.** `Bleed 209×266` was a control wearing a fact; the
  trim went into the subtitle for a while and then off it too, along with
  the page count, which the page box already carries. The subtitle says
  which class and which chapter and nothing else — it is the line a reader
  glances at to know where they are. Both sizes are in the Bleed tooltip.
* **Print… and Reading PDF.** The browser dialog duplicated the artefact
  the builder already writes.
* **The strip under the bar.** It described the buttons beside it and then
  printed the whole fill map of the last build — twenty-eight percentages
  over two lines, which is a table and wants reading, not glancing at. What
  a build came to now appears beside Build as a phrase (*28 pages · all
  clear*), and the numbers stay on the terminal. The cover viewer kept a
  line for a while, on the argument that the spine is the one thing there
  the proof cannot show to be wrong — but a paragraph of standing advice
  is read once and looked past on every visit after, and it sat between
  the bar and the sheet each time. `cover.mjs` computes the spine and says
  so on the terminal, and the press sheet still refuses a placeholder QR
  outright. `.note` is gone from `app.css` with it.
* **The signature view.** A schematic of a press sheet is not a way of
  looking at the book, and it brought a second control — pages per
  signature — that meant nothing beside Pages and Spreads. It is still
  built and still served at `/impose/<class>/<chapter>?sig=32`, and
  nothing links to it: it is reached by typing the address.

Two buttons at the left, because there are two journeys. **Home** goes to
a bare `/`, and **a bare `/` chooses nothing** — the front door opens on the
chooser however much was looked at before it.

Beside it, the **back arrow** means back to the chapters, not back to the
beginning: it carries the chapter's own class and subject in the query, so
the library opens on the list you just left — right even for a chapter
opened by its address.

**The address is the only source.** A cover is the one exception, and only
half of one: its arrow can carry the class but not a subject, since a cover
belongs to none, so the subject is filled in from the last one chosen — kept
in `localStorage` under `ll.pick`. That is a link with half its answer
missing, not a bare arrival. A class or subject with no section behind it is
ignored rather than selected.

**Changing the class puts the subject back to *Choose a subject*.** The list
is rebuilt from the new class either way; leaving the old choice standing in
it means the reader is shown a book they did not ask for, under a heading
that happens to read the same. Only arrival sets a subject on a class the
reader did not just pick, and it sets it itself, after the rebuild.

```bash
npm run check:studio     # 120 assertions: the chooser, the cards, the bar, the wrap, the build, the restart
```

Two halves, and both are needed. **Structure** asserts, against a freshly
started server, that the compiled markup carries every id the scripts reach
for — and that each of the five removals above is still removed.
**Behaviour** drives the real `library.js` and `app.js` in headless Chrome
— the chooser against a two-class fixture, the toolbar against a stub book
at the real trim. The toolbar fixture lifts `zoomBar()` out of `serve.mjs`
rather than retyping it, so it tests what the studio serves. A last check
posts to `/api/build` and asserts the reply is a phrase and not a fill map.

The book renders in an iframe so the studio's stylesheet and the book's can
never reach each other.

Covers appear in the library under their class, in a group of their own, and
open at `/cover/<class>/<name>`. That viewer has no pager, no spreads and no
signature — a wrap is one sheet, not a run of pages — but the sheet toggle
shows trim against the press sheet, and Build runs `cover.mjs` with both
files, offered as **Print PDF** and **Print PNG**. A panel edited in
`covers/<class>/_shared/` rebuilds every cover of that class, since that is
who shares it.

**A cover fits to page at 70% on the wrap and 62% on the press sheet**, and
the subtitle says *Class 9 · cover* and nothing more. Both are departures
from the book's own numbers and both are deliberate: a wrap is two trims
and a spine, so the page's 71% puts a third of it past the edge of the
stage, and the drop to 62% is steeper than the book's because a jacket
bleeds 15mm where a page bleeds 3 — the press sheet grows by 44mm in each
direction rather than 20. `cfg.kind` is the only thing that tells `app.js`
which of the two it is showing. The direction and finish used to be in that
subtitle — they are set in `cover.json`, which is where to read them.

**A wrap is a sheet, and nothing may carry a sheet size of its own.**
`coverMetrics` in `build/sheet.mjs` is where the press sheet is worked out —
two trims and a spine, plus `--jk-bleed` and the slug on every side. That
arithmetic was written out twice, in `cover.mjs` for the media box and again
in `serve.mjs` for the iframe, and the studio's copy used the page's 3mm
bleed and forgot the slug: it sized a 437mm sheet to 399, the jacket was
squeezed to fit, and every crop mark stood out of register with the artwork
it marked. A cover's own token reader is gone with it.

The marks come out right only while the stage **is** the sheet, which is
what `width: max-content` on `body.bleed .cover-stage` makes true. They are
laid over it by `inset: 0` with a viewBox in millimetres, so a stage as wide
as the window stretches every one of them. In print it always looked right,
because the `@page` box is the sheet and nothing else. Five assertions
measure the rendered marks against the trim they mark — deliberately in a
window that is not the sheet's width.

## Don't

- Edit anything under `build/class-9/` — it is regenerated every build.
- Add a third typeface, a fourth colour, or a font size off the scale.
- Reach for an inline style. If the system lacks something, **add it to the
  system** — a component or a modifier — so the next page can use it too.
- Trust a proof rendered at the wrong page size. `toPngs` takes the sheet
  from the edition; a Crown Quarto page in an A4 window comes back with a
  strip of blank paper at the foot, and an A4 page in a Crown Quarto window
  comes back cropped and reads as though it were clipped. Everything that
  measures a page takes the trim from `build/sheet.mjs`, which reads the
  tokens; nothing may carry a page size of its own.
