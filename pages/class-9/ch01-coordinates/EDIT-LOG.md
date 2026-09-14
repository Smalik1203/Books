# Class 9 · Mathematics I · Chapter 1 — Orienting Yourself: The Use of Coordinates

Language edit, 29 pages (p001–p017 chapter proper, p101–p112 Beyond the Book).
Build after editing: 29 pages, all pages fit, 0 stranded openers, no label
collisions, every option row fits. Every numerical answer in the chapter and the
bridge re-derived, including Q12's circle of radius $\sqrt{65}$, Q13's
vertices-from-midpoints, Q15's overlapping icons (centres 170 pixels apart,
radii summing to 180) and Q16's square of area 10.

7 fixes in 29 pages. The register is close to the Class 8 Mathematics II
standard, and two things about this chapter are better than anything in Class 8:

- **The history is sourced and honest.** The Sindhu–Sarasvatī street grid,
  Baudhāyana's two directions, Ujjayinī as the prime meridian (entering Arabic
  geography as 'Arin'), Āryabhaṭa's sines, Brahmagupta's zero and negatives,
  al-Bīrūnī, Ömar Khayyām, then Descartes — and then, unusually, p002 says
  plainly what Descartes did **not** do: "he did not insist that the second be
  perpendicular, and he had no use for negative coordinates at all. The tidy
  cross of two axes … were assembled by others over the century that followed."
  A textbook that names the limits of its own hero story is rare.
- **Reiaan is blind, and the chapter is built round that without fuss.** His
  sister builds the room in pins and thread so he can feel the directions; the
  exercises then ask whether a doorway is wide enough for a wheelchair and
  whether the school's own doors are. The accessibility questions are
  mathematics, not decoration.

## FIXED

| before | after | check |
|---|---|---|
| **p001** "a framework of reference" | "a framework you measure from" | L1 |
| **p002** "far easier to compute" | "far easier to work out" | L1 |
| **p002** "formalised zero and the negative numbers as algebraic objects in their own right" | "set out zero and the negative numbers as numbers in their own right" | L1, L2 — two hard words in the sentence that carries the chapter's debt to Brahmagupta |
| **p004** "arbitrary once, then permanent" | "a free choice once, then fixed for ever" | L1 |
| **p008** "the system does something rather complete" | "the system does something complete" | L3 |

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p014 Q7 | C4 | **The question cannot be answered by the method it tells you to use.** Q6 asks whether $M(-3,-4)$, $A(0,0)$, $G(6,8)$ are collinear and suggests finding a way without plotting — the intended method is the chapter's own: $MA + AG = 5 + 10 = 15 = MG$ exactly. Q7 then says "Use your method from Question 6" on $R(-5,-1)$, $B(-2,-5)$, $C(4,-12)$. There $RB = 5$, $BC = \sqrt{85} = 9.2195\ldots$, $RC = \sqrt{202} = 14.2127\ldots$, so $RB + BC = 14.2195\ldots$ — the points are **not** collinear, but the gap is $0.007$. A student working to two decimal places gets $14.22$ against $14.21$ and cannot tell a real difference from a rounding error. Contrast the bridge (p103), which does the same question with $\sqrt{13}$, $2\sqrt{13}$, $3\sqrt{13}$ — exact, and the sum is unmistakable. | Choose numbers whose surds are exact multiples, as the bridge does, or say in the question that the answer turns on a very small difference and the arithmetic must be kept exact. As written the question punishes a correct method. |
| p009 Q3 / p010 Q3 | C4 | **Two questions numbered 3 in Exercise Set 1.2.** p009 ends with `data-start="3"` ("The shower stands in the corner of the bathroom") and p010 opens again at `data-start="3"` ("Look at the bathroom"), then continues at 4. The set reads 1, 2, 3, 3, 4 — and the two 3s are about the same bathroom, so a student cannot tell them apart by content either. | Renumber p010's blocks. This is the third chapter in the book with this exact `data-start` fault (Class 8 Part I Ch 2 and Ch 3), and it still is not caught by any build check. |
| throughout, and p103 | C3 | **"Grade" here, "Class" everywhere else.** This chapter says "Grade 9" (p003), "Grade 8" (p010, p103) and "Grade 10" (p016). Class 8 Part I says "Class 9's work on factorisation" (Ch 4 p017) and "assumed here and proved in Class 9" (Ch 5 p004). Two volumes, two words for the same thing, and Indian schools say *Class*. | One word, book-wide. *Class* is the Indian usage and the one the earlier volumes already use. |
| p004 | C5 | "In the chapters on integers, rational numbers and decimals you worked with the **number line**." There are no such chapters in this book. Integers and decimals are Class 7 material, and this book's own number chapter — Class 9 Chapter 3, The World of Numbers — comes *after* this one. | Say "in earlier classes", or point forward to Chapter 3. As written it sends a reader looking for chapters that are not there. |
| p014 Q9–Q13 | M2 | Five end-of-chapter questions rest on the **midpoint formula**, which the chapter never teaches. Q9 is fair — it gives a table and a hint asking the student to find the connection themselves, which is discovery. But Q11 needs trisection points found from two midpoint statements, and Q13's hint hands over a result ("Add two of the midpoints and subtract the third") that no reader could have derived from Q9. | Either a short section on the midpoint, or trim to Q9 and Q10. Q13's hint is doing the teaching that the chapter skipped, in eleven words, inside a hint. |
| p010 vs p012, p013 | C3 | p010 makes a point of the modulus bars — "The bars matter. Subtract the other way round and the arithmetic hands you a negative number, and no length has ever been negative." Then p012 writes the general legs as $x_2 - x_1$ and $y_2 - y_1$ with no bars, and p013 explains that the squaring throws the sign away. Both are right, but the reader is told the bars are essential and then shown them dropped two pages later. | One sentence at the point of dropping them: the bars are unnecessary here *because* the value is about to be squared. p013 says it, but after the formula has already appeared without them. |
| p002 | C5 | "it is *Cartesius* that survives in **Cartesian** — so every time the plane is named, it is named after him twice over." *Twice over* does not follow from what precedes it: the plane is named once, in disguise. | Either drop the clause or say what was meant. |
