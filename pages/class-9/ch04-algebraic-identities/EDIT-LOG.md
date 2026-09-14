# Class 9 · Mathematics I · Chapter 4 — Exploring Algebraic Identities

Language edit, 43 pages (p001–p031 chapter proper, p101–p112 Beyond the Book).
Build after editing: 43 pages, all pages fit, 0 stranded openers, no label
collisions, every option row fits. Every worked result re-derived, including
Example 15 (three numbers with sum 10, product 25, squares summing to 38 → cubes
sum to 145 — correct, via $xy+yz+zx = 31$), Example 16's cancellation, and
Śhrīdharāchārya's $55^2 = 60 \times 50 + 25$.

3 fixes in 43 pages. The mathematics is strong and the chapter's method is
consistent: no identity is ever announced. The first is read off an area
picture, the second comes from replacing $b$ with $-b$, the third from grouping
two terms into one, the fourth from multiplying the second by $(a+b)$ — and p010
says so explicitly: "Neither needed a fresh argument — and the identities still
to come are built the same way, from the ones you already have."

Three things worth recording:

- **It states the limits of its own picture.** p003, immediately after deriving
  $(a+b)^2$ from a square: "look at what that argument used: a picture of
  *lengths*. Every quantity in it had to be positive — you cannot draw a square
  whose side is $-2$ units. So the drawing proves the identity for positive $a$
  and $b$, and nothing more." Then it tests negatives and rationals, says "two
  successes prove nothing", and multiplies the bracket out.
- **p013 separates an illustration from a proof** in as many words: a
  drawn-to-scale figure "shows one case … a reader who measures the squares has
  checked exactly that case. What makes it a proof is the argument that the
  drawing is forced."
- **It says when a search legitimately fails.** p017: "It does not mean you have
  made a mistake; it means the quadratic does not factorise over the whole
  numbers, and plenty do not. $x^2 + x + 1$ is one. Knowing that a search can
  honestly come up empty is part of knowing how to conduct it."

## FIXED

| before | after | check |
|---|---|---|
| **p007** "The second identity earns its keep the same way the first did." | "The second identity does its work the same way the first did." | L1 — idiom; removed from four chapters now |
| **p013** "cannot be drawn to arbitrary sizes" | "cannot be drawn to any size you like" | L1 |
| **p023** "That identity looks forbidding, but it earns its keep." | "That identity looks worse than it is, but it is worth having." | L1, L2 — two hard words in one short sentence |

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| **p015** | C4 | **A summary box is printed twice, and the duplicate cuts a sentence in half.** The box "What Fig. 4.7 shows" appears at lines 5–18 and again, word for word, at lines 23–34. Between them the prose reads "Multiplying out is the easy direction: you always can. **Factorising is the**" — and the sentence resumes *after* the second box with "**hard one, because you are being asked to find** the two numbers that fit". So a reader meets a broken sentence, a repeated box, and then the other half of the sentence. This is the worst production fault I have found in the book. I have **not** fixed it, for one reason worth knowing before you do: page 15 currently builds at 94% fill, so deleting the duplicate box will leave it around 70% and the chapter body will need a refit. That is a layout decision, not a language one. | Delete the **second** box (lines 23–34) — that rejoins the sentence and leaves the first box where it reads correctly — then `node build/refit.mjs class-9/ch04-algebraic-identities body`. I checked the rest of the chapter for the same fault: p015 is the only page with a duplicated block. |
| p008 → p009 | C3 | **A generalisation arrives before the thing it generalises.** p008 derives $(a+b+c)^2$ purely algebraically, by grouping $d = b+c$ — no picture, no construction. p009 then opens: "**The same construction** works for any number of letters. Cut a square of side $a+b+c+d$ at three places along each edge and sixteen pieces come out…" There has been no construction. The three-letter picture (Fig. 4.4, nine pieces) is introduced two paragraphs *later*, as "The picture behind it is the one from Section 4.2, grown by a term." | Move the nine-piece paragraph and Fig. 4.4 above the sixteen-piece one. Then "the same construction" has something to refer to, and the order runs two letters → three → any number. |
| p002, p011 | C3 | "You already know several identities from **earlier grades**" (p002) and "In **Grade 8** you met one more identity" (p011). The Class 8 volumes say *Class*. This is the second Class 9 chapter with the same slip — Chapter 1 has Grade 8, 9 and 10 in four places. | One word, book-wide. *Class* is the Indian usage and what the earlier volumes already use. See CROSS-CHAPTER.md. |
| p011 vs Class 8 Part I Ch 4 | C3 | p011 says the difference of squares is the identity "you met in Grade 8", which is right — Class 8 Part I Chapter 4 § 4.6.3 derives it by cutting a corner from a square and rearranging the L-shape. But Class 8 taught **three** identities in that chapter ($(a+b)^2$, $(a-b)^2$, $a^2-b^2$), and this chapter re-derives the first two from scratch while crediting only the third to Class 8. | Say which of the four are revision and which are new. The chapter's own method — build each identity from the one before — makes that easy to state in a sentence. |
| p012 | M5 | Śhrīdharāchārya's squaring method is dated "750 CE" in the key-idea title and the method is given correctly, but no source is named for it, unlike every other attribution in the chapter (Baudhāyana's Śulbasūtra, Āryabhaṭa's *āsanna*, Mādhava's series are all placed in a text elsewhere in this book). | A text or a treatise, as the other attributions have. As it stands a reader cannot follow it up, and the date is doing the work a citation should. |
