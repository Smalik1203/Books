# Class 9 · Mathematics I · Chapter 3 — The World of Numbers

Language edit, 45 pages (p001–p033 chapter proper, p101–p112 Beyond the Book) —
the longest chapter in the book. Build after editing: 45 pages, all pages fit,
0 stranded openers, no label collisions, every option row fits. Every numerical
claim checked: Baudhāyana's $\tfrac{577}{408} = 1.4142156\ldots$, Āryabhaṭa's
$\tfrac{3927}{1250} = 3.1416$, all five partial sums of Mādhava's series, the
500-term value $3.1396$, $142857 \times 7 = 999999$, and the bridge's
$0.4\overline{27} = \tfrac{47}{110}$. All correct.

**3 fixes in 45 pages** — *computes* twice and *arbitrary* once. Nothing else in
the language needed touching, which given the length makes this the cleanest
chapter in the book by a wide margin.

It is also the best-argued. The organising claim is stated on p028 and earned on
every page before it: "Each stage was forced by a question the previous stage
could not answer. That is worth noticing, because it is how the subject grows:
not by decree, but because someone wrote down something the existing numbers
could not name." Then:

- **The √2 proof is laid out in seven numbered steps and then interrogated.**
  "Every step from 2 to 7 is forced; none of them can be the mistake. So the
  mistake is the only thing not forced — the assumption itself." Followed by the
  observation that the proof "never computes a single decimal place of $\sqrt2$.
  No amount of computing could have settled the question anyway."
- **The repeating-decimal method is shown failing.** p022 tries a one-place
  shift on $0.\overline{45}$, gets $9x = 4.0909\ldots$, and says: "Nothing is
  wrong with that line — it is perfectly true — but it has not got us
  anywhere." Very few textbooks spend a paragraph on a correct step that
  achieves nothing.
- **It warns against its own test.** p018: reading digits off a calculator
  "settles nothing: a hundred of them with no cycle are perfectly consistent
  with a cycle beginning at the hundred and first." And p026's tip: "A pattern
  you can describe is not the same as a cycle" — with $1.01001000100001\ldots$
  as the example.
- **The cycle-length ceiling is derived and then held to be a ceiling.** Dividing
  by $q$ there are only $q-1$ usable remainders, so the cycle cannot exceed
  $q-1$ — "That is a ceiling, not a forecast."

## FIXED

| before | after | check |
|---|---|---|
| **p015** "it never computes a single decimal place" | "it never works out a single decimal place" | L1 |
| **p018** "not a good way to compute it" | "not a good way to work it out" | L1 |
| **p105** "the options are rarely arbitrary" | "the options are rarely random" | L1 |

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p019 | C5 | "Sevenths reach it exactly — six digits, **as we have just seen**." Sevenths have not been seen. Example 7, immediately above, expands $\tfrac{3}{8}$ and $\tfrac{5}{11}$; $\tfrac17$ first appears on **p023**, four pages later, and its six-digit cycle is worked on p026. I checked every page from p001 to p019 for $\tfrac17$ and $0.142857$ — neither occurs. | Either move the sentence to p023, where the claim is actually established, or change it to a forward reference. As it stands the reader is told they have seen something they have not, in the middle of the one paragraph that distinguishes a ceiling from a forecast. |
| p026 | C3 | **A paragraph is stranded two sections downstream of what it explains.** § "A rational number with a secret" sets out the cyclic number $142857$ and says "Nothing was arranged here; it falls out of the long division by 7". The next heading, "What an irrational decimal looks like", then covers irrational expansions, the two-way test, and a second angle on the $\sqrt2$ proof. *Then* comes: "There is a reason the six digits behave so obligingly, and it is the $999999$ from earlier. Multiply the block by $7$ and you get $142857 \times 7 = 999999$ exactly…" — which belongs with the cyclic number, before the section changed subject. | Move it up, above the "What an irrational decimal looks like" heading. It is the explanation the earlier section promised and does not give. |
| p001 vs Class 8 Part I Ch 3 p002 | C3 | **The Lebombo bone has two different ages in one book.** Here: "about 35,000 years old". Class 8 Part I Chapter 3: "carries twenty-nine notches and is perhaps forty thousand years old". The provenance differs too — "found in the Lebombo mountains between South Africa and Eswatini" here, "found in South Africa" there. Both chapters give 29 notches and read them as a lunar tally, so this is the same artefact described twice with a 5,000-year discrepancy. | One figure, in both places. (Published estimates cluster around 41,000–43,000 years, so both numbers may want revisiting.) |
| p001–p005, p014–p015 vs Class 8 | C3 | **This chapter re-treads two Class 8 chapters without naming either.** Class 8 Part I Chapter 3 (Ten Symbols, Every Number) covers the pebble-matching herder, the Lebombo and Ishango bones, place value, śūnya, the Bakhshālī dot and Brahmagupta's rules — all of which appear again here. And Class 8 Part I Chapter 1's Beyond the Book already proves $\sqrt2$ irrational by the same contradiction, in a section the student has done. Neither is referenced. | The overlap may be deliberate revision, but it should say so. A reader who did Class 8 carefully is entitled to know which parts are a second pass and which are new — and the Class 8 √2 proof is the natural thing to build on rather than repeat. |
| book-wide | M1 | **Fractional powers are still undefined.** Class 8 Part I Chapter 4 p003 explains why $\sqrt{x}$ is not a polynomial by asserting "$\sqrt{x}$ is $x^{1/2}$", and I flagged there that nothing in Class 8 defines a power with a fraction in it. I have now searched every Class 9 chapter: **no fractional exponent appears anywhere in the book.** This chapter handles roots entirely in $\sqrt{\ }$ notation, which is correct and self-consistent — so the gap is not here, but the one line in Class 8 Ch 4 that depends on it is now confirmed to have nothing behind it. | Fix it in Class 8 Chapter 4 by dropping the $x^{1/2}$ half of that sentence. Nothing in either class needs the notation. |
| p029–p032 | — | **Markup inconsistency in the exercise sets.** Most question lists are wrapped in `<div class="c-practice c-practice--cont">`; p029's Q8–Q10, all four starred questions on p030, p031's Q9–Q13 and p032's Q14–Q15 are bare `<ol class="c-questions">` with no wrapper. The build passes and the pages fit, so this may render acceptably — but it is not what the rest of the book does, and the wrapper is what carries the exercise band. | Worth a look at a proof of pages 29–32 before print. I have not changed it: it is layout, not language. |
| p033 | — | The closing page of the chapter proper is **8% full** — one three-line tip box ("Next year the line is left behind altogether…"). It carries `data-close`, so the fill check exempts it, and the tip is a good closing note. | Either lift the tip onto p032, which is at 100%, or accept a near-empty leaf. Recording it because the fill map makes it look like an error and it is a choice. |
