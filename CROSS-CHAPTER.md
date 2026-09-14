# Cross-chapter notes — language edit

Running file, appended one chapter at a time. Anything here conflicts *between*
chapters: a term defined two ways, notation that changes, a difficulty step that
does not belong where it lands. Per-chapter logs live beside the sources as
`EDIT-LOG.md`.

Order of work: Class 8 Mathematics I ch01–ch07, Class 8 Mathematics II
p2ch01–p2ch07, Class 9 Mathematics I ch01–ch08. Science and Telugu chapters are
out of scope.

## Class 8 · Mathematics I · Chapter 1 — The Shape of a Number

1. **"Exponent" is Chapter 2's word, and Chapter 1 was spending it.** Chapter 1
   introduces only "the small raised 2 says how many copies of the number are
   multiplied together" and never names it — then used *exponent* eleven times
   (p011, p020, p025 Q6, p101, p104 twice, p106, p110 twice, p111). All eleven
   are now plain phrasings ("how many times each prime appears", "the count of
   each prime"). **Chapter 2 must define *exponent* before its first use**, and
   should know that a reader arriving from Chapter 1 has the idea but not the
   word. Chapter 1 p026 Q17 deliberately hands over: "Guess what $n^4$ and $n^5$
   ought to mean … The next chapter takes the idea up properly."

2. **"A number multiplied by itself three times" for $n^3$.** Used in Chapter 1
   at p016, p024 and in the summary at p027. Strictly it is three copies and two
   multiplications. Standard schoolbook phrasing and harmless inside Chapter 1,
   but Chapter 2 is where powers are defined properly and cannot use both
   readings. Needs one decision covering both chapters — not a local fix in
   whichever chapter is edited second.

3. **$\sqrt{\ }$ is fixed as the positive root.** Chapter 1 p010–p011: every
   perfect square has two square roots; the symbol means the positive one;
   "from here on *the* square root means the positive square root"; and
   $\sqrt{x^2}$ is not $x$. Class 9 Chapter 3 (The World of Numbers) and Class 8
   Mathematics II Chapter 2 (Two Squares Make One, Baudhāyana) both handle roots
   and must not quietly relax this.

4. **"Root" used loosely before it is defined.** Chapter 1 p008 — "The count of
   steps is the root" — sits in § 1.2.2, before § 1.3 defines square root.
   Flagged in the chapter log, not fixed. If the fix is to introduce the word
   earlier, that lands in Chapter 1 only; if it is to delete the usage, check
   Exercise 1.2 Q5 too.

5. **Triangular numbers are assumed known.** Chapter 1 p009: "You have met the
   *triangular numbers* before: $1, 3, 6, 10, 15, \ldots$". Nothing in this
   repository's Class 8 volumes introduces them, so the claim rests on Class 6/7
   material that is not here. Verify before print, or the sentence is telling a
   student they have forgotten something they were never shown.

6. **Terms deliberately kept out of Class 8 Chapter 1**, and worth keeping out
   of the chapters around it unless a chapter teaches them: *parity*,
   *exponent*, *differencing* (coined verb), *inequality*, *fence-post error*,
   and the symbol $\infty$. All were present and all are now gone; a later
   chapter reintroducing one without teaching it puts the book back where it
   started.

## Class 8 · Mathematics I · Chapter 2 — When Multiplying Takes Over

1. **The handover from Chapter 1 works.** Chapter 2 p002-p003 picks up exactly
   where Chapter 1 left the notation ("You have met $n^2$ and $n^3$ ... The
   raised number was never limited to 2 and 3"), and names *base*, *exponent*,
   *power* and *index* before using any of them. Chapter 1's forward reference
   (p026 Q17) lands correctly. Nothing to do here.

2. **Item 2 of the Chapter 1 notes is confirmed, not resolved.** Chapter 2
   p003 defines $n^a$ as "$n$ multiplied by itself $a$ times" -- the same loose
   phrasing as Chapter 1 p016/p024/p027. The two chapters agree, so no reader
   meets a contradiction; but this is the chapter that owns the definition, so
   this is where a book-wide decision has to be applied. Same for p003's tip,
   which calls $3 \times 4$ "$4$ added to itself three times".

3. **"Exponent" is now safely introduced** (Chapter 2 p003), so chapters after
   this one may use it freely. Chapters *before* it may not -- which is why the
   eleven uses in Chapter 1 were removed rather than left.

4. **Terms Chapter 2 introduces and later chapters may rely on**: base,
   exponent / power / index, exponential form, additive growth, multiplicative
   growth, exponential growth, standard form (scientific notation),
   coefficient, estimate. Class 8 Mathematics II Chapter 1 (percentages) and
   Chapter 5 (data) should use *standard form* and *coefficient* the way this
   chapter defines them, not re-define them.

5. **Terms kept out of Chapter 2** as above class or untaught: *modulo*,
   *conjecture*, *overflow*. The last-digit-cycle argument on p106 is now
   phrased as dividing and keeping the remainder.

6. **$2^{10} \approx 10^3$ is named as the chapter's key approximation**
   (p104). Any later chapter estimating large numbers should reach for it
   rather than inventing another shortcut.

7. **Unresolved and blocking**: the paper thickness in Chapter 2 p001 disagrees
   with every calculation in that chapter by a factor of ten, and the "$671$ m
   is taller than any building on earth" row is false. Both are numbers, so
   both are flagged and neither is fixed. See that chapter's EDIT-LOG.md. The
   folded sheet is the book's running example for exponential growth and is
   referred to again at p017, p018, p021 and p112 -- so whatever is decided has
   to be applied in all of them.

## Class 8 · Mathematics I · Chapter 3 — Ten Symbols, Every Number

1. **Chapter 2 is used, by name, and correctly.** Chapter 3 p010 leans on
   Chapter 2's first law ("multiply two powers of ten and the exponents add")
   to explain why the product of two landmarks is another landmark, and p103
   reuses 2^10 = 10^3 to estimate binary digit counts. Both references are
   sound and both need Chapter 2 to stay where it is in the order.

2. **"Base" is now a defined term in two places, and they agree.** Chapter 2
   p003 calls the 5 in 5^4 the base of the power; Chapter 3 p009 calls n the
   base of a number system. Same word, two different objects, and no chapter
   says so. Worth one sentence in Chapter 3 acknowledging it, since a reader
   meets the second three pages after revising the first.

3. **Duplicated exercise numbers are a pattern, not an accident.** Chapter 2
   Exercise 2.2 has two question 5s; Chapter 3 Exercise 3.5 has two 3s and two
   4s. Both come from a c-practice--cont block re-opening at a data-start that
   does not follow the previous page. Worth a sweep of every chapter's
   data-start sequence before print, and worth a builder check — nothing in
   the build catches it today.

4. **Terms Chapter 3 introduces that later chapters may rely on**:
   one-to-one mapping, number system, numerals, landmark numbers, base,
   base-n, decimal, positional / place value, placeholder. Class 9 Chapter 3
   (The World of Numbers) is the one most likely to re-tread this ground.

5. **Kept out of Chapter 3** as above class or untaught: *ambiguous*,
   *arbitrary*, *chronological*, *perception*, *millennia*, *condescension*.
   And *odd* is now reserved for its arithmetic meaning — p013's "Their bases
   are odd" became "Their landmarks are strange", because in a maths book the
   first reading of *odd* is not-even.

6. **The distributive law is named in Chapter 3 p010 but taught in Chapter 4.**
   Flagged in the chapter log. If Chapter 4's treatment gets a section number,
   Chapter 3 should point at it.

## Class 8 · Mathematics I · Chapter 4 — A Rectangle, Cut in Two

1. **Chapter 3's forward reference is discharged, but not by name.** Chapter 3
   p010 uses "the distributive law" as though taught; Chapter 4 § 4.1 is where
   it is actually proved, from one rectangle cut in two. Chapter 3 should point
   here explicitly.

2. **Chapter 2's exponent laws are used and credited.** Chapter 4 § 4.4.1 calls
   x^m times x^n = x^(m+n) "the index law from Chapter 2, doing its work here
   for the first time", and p003 uses x^0 = 1 to justify a constant having
   degree 0. Both are sound and both need Chapter 2 ahead of Chapter 4.

3. **Chapter 4 breaks the integer-exponent ceiling Chapter 2 set.** Chapter 2
   § 2.4 says the laws hold "for every integer exponent"; Chapter 4 p003 writes
   the square root as x^(1/2) to explain why it is not a polynomial. Nothing in
   Class 8 defines a fractional power. Flagged in Chapter 4's log; the fix
   belongs to whichever chapter is edited with the other in view, and Class 9
   Chapter 3 (The World of Numbers) is where fractional powers would naturally
   land.

4. **Terms Chapter 4 introduces that later chapters will rely on**: algebraic
   expression, variable, term, factor, coefficient, constant term, monomial,
   binomial, trinomial, polynomial, degree, like terms, simplest form,
   expanding, identity, equation. Class 8 Chapter 6 (The Same to Both Sides,
   equations) and Class 8 Mathematics II Chapter 6 (Why the Trick Always Works)
   both depend on the identity/equation distinction made in § 4.7.3 — the
   clearest statement of it in the book, and worth cross-referencing rather
   than restating.

5. **"Cut" is used as vocabulary without being declared** (p010 Q6, p011 Q7).
   Flagged. If a later chapter reuses the rectangle-cutting picture, it should
   use whatever word Chapter 4 settles on.

6. **The three identities are stated once, here, in this order**: (a+b)^2,
   (a-b)^2, (a+b)(a-b). Class 9 Chapter 4 (Exploring Algebraic Identities) is
   the chapter most likely to restate them — it should extend rather than
   re-derive, and must not rename them.

7. **This chapter is the register benchmark.** 18 fixes in 34 pages. Where a
   later chapter needs 60, the difference is the chapter's, not the topic's.

## Class 8 · Mathematics I · Chapter 5 — Four Sides, One Sum

1. **Mathematics I Chapter 5 needs Mathematics II Chapter 2.** Chapter 5 p017
   Example 7 and Exercise 5.6 Q2-Q5, plus two multiple-choice questions, all
   use the Pythagoras theorem and the word hypotenuse. Pythagoras is taught in
   Class 8 Mathematics II Chapter 2 (Two Squares Make One) - the next volume.
   This is the first cross-VOLUME dependency found, and it runs backwards. Two
   ways out: signpost it here the way p004 signposts the triangle angle sum
   ("assumed here and proved in Class 9"), or move the questions. Either way
   the decision belongs to whoever owns the running order of the two volumes.

2. **Chapter 5 assumes the parallel-line angle facts without signposting
   them.** Alternate angles (p013) and interior angles on the same side (p014)
   carry the entire parallelogram section. Class 9 Chapter 6 (Lines and the
   Angles They Make) is where they are properly done. Chapter 5 signposts the
   triangle angle sum and not these, which is inconsistent within one chapter.

3. **Chapter 4's algebra is used here, correctly and by name.** Chapter 5 p015
   Example 6 sets 3x + 4 = 5x - 6 from two opposite sides of a parallelogram
   and says "the algebra of the last chapter does the rest". Good handover;
   it needs Chapter 4 to stay immediately before this one.

4. **Chapter 2's divisor counting is reused in Beyond the Book** (p105, the
   count of divisors of 360 from 2^3 x 3^2 x 5). That reference is sound.
   Chapter 5 p003's reference to "Chapter 2's arithmetic" for counting
   diagonals is not - flagged in the chapter log.

5. **Terms Chapter 5 introduces that later chapters may rely on**: polygon,
   vertices, convex, concave, diagonal, regular, exterior angle, trapezium,
   kite, parallelogram, rhombus, rectangle, square. Class 8 Mathematics II
   Chapter 4 (Taking a Shape Apart) and Chapter 7 (The Same Area, a Different
   Shape) both work with these figures and should use Chapter 5's definitions -
   in particular the inclusive trapezium (a parallelogram IS a trapezium),
   which Chapter 5 p012 Q8 explicitly raises as a choice the book has made.

6. **Kept out of Chapter 5** as above class or untaught: *co-interior*,
   *equidistant*, *triangle inequality*, *crane jib*. And "curves" was removed
   from p103, where the two angle sums were called curves.

## Class 8 · Mathematics I · Chapter 6 — The Same to Both Sides

1. **"Root" now means two different things in one volume.** Chapter 1 spends
   eleven pages on root = the number a square or a cube came from, and fixes
   the radical sign for it. Chapter 6 p001 says a solution of an equation "is
   also called a root", in one clause, as an aside. Same book, same year, no
   acknowledgement. The word is never used again in Chapter 6, so dropping it
   there costs nothing; keeping it needs a sentence saying it is a different
   use. This is the third such collision found (see "base" in Chapters 2 and 3)
   and the pattern is worth a pass of its own: one word, two meanings, no note.

2. **Chapter 4's identity/equation distinction is the backbone of § 6.7,**
   and it is cited by name at p001, p015 and in the summary. This is the best
   handover in the volume - Chapter 4 § 4.7.3 makes the distinction and
   Chapter 6 § 6.7 spends it, turning "every number is a solution" into
   "this was an identity wearing an equals sign". Neither chapter can move
   without the other.

3. **Chapter 5 is used by name in an exercise** (p014 Q8: the angles of a
   quadrilateral, "using a result from Chapter 5"). Correct and well placed.

4. **"Rational" appears in Beyond the Book (p105) and is taught in Class 9.**
   Flagged in the chapter log; the fix is the word "fraction".

5. **Transposition is explicitly refused.** Chapter 6 p005 and the summary
   both say that "move it across and change the sign" describes nothing that
   happens, and derive it instead. Any later chapter that reaches for
   transposition as a rule - Class 8 Mathematics II Chapter 6 (Why the Trick
   Always Works) and Class 9 Chapter 2 (Introduction to Linear Polynomials)
   are the candidates - would undo this chapter's best page.

6. **Terms Chapter 6 introduces that later chapters may rely on**: equation,
   left side, right side, solution, linear in one variable. Also the three-case
   result: letter survives = one solution, letter goes and the statement is
   false = no solution, letter goes and the statement is true = every number.
   Class 9 Chapter 2 should extend this, not restate it.

7. **Two pre-existing short pages** in this chapter's Beyond the Book (p108 at
   83%, p110 at 86%), neither touched by the edit. Recorded so a later refit
   does not attribute them to the language pass.

## Class 8 · Mathematics I · Chapter 7 — Covering and Filling

1. **Second cross-volume Pythagoras dependency.** Chapter 7 p006 Q9 gives a
   square's diagonal as s times root two; Chapter 5 p017 Example 7 and five of
   its questions use the theorem outright. Pythagoras is Mathematics II
   Chapter 2. Two chapters of Mathematics I now need the next volume, and
   both were written as though it came first. Whoever fixes one should fix
   both, the same way.

2. **Circle facts are assumed and never signposted.** pi, 2 pi r and pi r
   squared carry half of Chapter 7, and the only note about them is which
   approximation to use for pi. Class 9 Chapter 5 (Exploring Circles) is where
   this book teaches circles. Chapter 5 of this volume signposts the triangle
   angle sum honestly ("assumed here and proved in Class 9") - the same
   sentence would fix this.

3. **The chapter closes the volume's loop on squared and cubed.** Chapter 7
   p010 and p014 say that a number is called squared because a square's area
   is two lengths multiplied, and cubed because a cube's volume is three -
   which is exactly the varga / ghana material of Chapter 1 section 1.6. The
   volume opens and closes on the same idea. Worth preserving if the running
   order is ever changed.

4. **It also inherits the volume's loose phrasing** ("a number multiplied by
   itself three times is cubed", p010). Same book-wide decision as Chapters 1
   and 2, now due in a third place.

5. **Chapters 4, 5 and 6 are all used by name and all correctly**: Chapter 4's
   distributive law for taking out the common factor (p005, p008), Chapter 5's
   diagonal and rhombus diagonals (p004, p005, p006 Q7), Chapter 6's equations
   for running a formula backwards (p003, p011). This chapter is where the
   volume's earlier work gets spent, and it cannot be moved earlier.

6. **Terms Chapter 7 introduces**: area, volume, perpendicular height,
   trapezium area, cuboid, cube, cylinder, net, lateral surface area, total
   surface area, capacity. Class 8 Mathematics II Chapter 7 (The Same Area, a
   Different Shape) works the same ground and should use these definitions.

7. **Two pre-existing build problems** in this chapter's Beyond the Book
   (p102 runs 1.1mm into the bottom margin, p107 is 79% full), neither touched
   by the edit. With Chapter 6's two short pages, that is four Beyond the Book
   pages in this volume wanting a refit for reasons that have nothing to do
   with language.

# Class 8 · Mathematics II

## Chapter 1 — Out of Every Hundred

1. **"Base" now has four meanings in this book.** The base of a power
   (Part I Ch 2), the base of a number system (Part I Ch 3), the base of a
   triangle or cuboid (Part I Ch 7), and the amount a percentage is taken of
   (this chapter, p008 key idea and p110). No chapter acknowledges any of the
   others. Of the four, this one is the most avoidable: the chapter's own prose
   usually says "the original amount", which is clearer. Together with the two
   meanings of "root" (Part I Ch 1 and Ch 6), this is now the book's most
   repeated structural fault, and it wants one pass of its own rather than
   chapter-by-chapter patching.

2. **Mathematics II Chapter 1 cites Part I by name, and correctly** - Chapter 6
   of Part I for solving an equation whichever way round the unknown sits
   (p005). It also uses Part I Chapter 2's exponent notation for compound
   growth, p(1+r)^t, without crediting it (flagged). So the two volumes are
   already cross-referenced in this direction; it is only the Pythagoras
   dependency that runs the wrong way (Part I Ch 5 and Ch 7 needing
   Mathematics II Ch 2).

3. **Simple and compound interest are taught without their names.** The chapter
   says "interest paid out" and "interest left in", which is better teaching,
   and then Beyond the Book (p105) uses "simple interest" once, undefined.
   Flagged. Whatever is decided, Mathematics II Chapter 3 (What Stays the Same)
   is the next chapter likely to need the vocabulary.

4. **Terms this chapter introduces that later chapters may rely on**: per cent,
   principal, rate, interest, compounding, depreciation, cost price, marked
   price, selling price, profit, loss, discount. Mathematics II Chapter 3
   (proportion) and Chapter 5 (data) will both need the percentage machinery;
   neither should re-derive the multiplier.

5. **One arithmetic error found**: p013 Example 7 gives 21,000 x 0.95 cubed as
   Rs 18,015; it is Rs 18,005. Flagged in the chapter log, not fixed, because
   it is a number in a worked solution.

## Chapter 2 — Two Squares Make One

1. **This is the chapter Part I Chapters 5 and 7 were waiting for.** It teaches
   the Baudhayana-Pythagoras theorem and the word hypotenuse from scratch, and
   it is the fourth chapter of the year's second volume. Part I Ch 5 (Example 7
   and five questions) and Part I Ch 7 (Exercise 7.2 Q9) both use the theorem
   and the word as though already taught. The dependency is now confirmed from
   both ends: nothing in Mathematics I introduces it, and this chapter assumes
   nothing from those two. Cleanest fix is a one-line signpost in the two
   Part I chapters, of the kind Part I Ch 5 p004 already uses for the triangle
   angle sum.

2. **It spends Part I properly and says so.** Chapter 4's (a+b)^2 for the
   four-triangle proof (p007), Chapter 6's linear equations for the lotus
   problem (p009, "a linear equation of the kind Part I's Chapter 6 was
   about"), Chapter 5's rhombus diagonals for Example 4 (p009, credited). Three
   named back-references, all correct. This is the model for how the two volumes
   should talk to each other.

3. **Square roots are handled consistently with Part I Chapter 1.** Root 2 is
   trapped between decimals exactly as Ch 1 section 1.3.1 trapped roots, the
   radical means the positive root, and the chapter says the decimal "never
   ends" and that no fraction gives it exactly - "a claim worth being
   suspicious of, and one you will meet a proof of later". Part I Ch 1's
   Beyond the Book (p105) already gives that proof. Worth cross-referencing:
   one book proves it in a bridge section and the other promises it as future
   work.

4. **Terms this chapter introduces**: hypotenuse, Baudhayana-Pythagoras
   theorem, Baudhayana triple (also Pythagorean triple), primitive triple.
   Class 9 Chapter 1 (coordinates, distances) and Class 9 Chapter 5 (circles)
   will both need the theorem; neither should re-derive it.

5. **One forward reference inside the chapter**: "Baudhayana triples" is used
   on p010 and defined on p011. Flagged.

## Chapter 3 — What Stays the Same

1. **"Base" reaches five meanings.** Chapter 3 p011 borrows the word from
   Mathematics II Chapter 1 ("Chapter 1's warning about bases turning up in new
   clothes"), adding to power base, number-system base, base of a solid, and
   percentage base. The running count is now the strongest argument for a
   single vocabulary pass across the whole book: five senses of "base", two of
   "root", and in every case the chapter using the word is unaware of the
   others.

2. **Named back-references are accurate again**: Part I Chapter 5 for the
   triangle angle sum (p006 Example 6, credited), Mathematics II Chapter 1 for
   percentage bases (p011), and Chapter 1's pie-chart arithmetic tied to
   percentages at p009 ("Chapter 1's arithmetic and this chapter's are the same
   arithmetic with a different whole underneath: a hundred there, three hundred
   and sixty here"). That last sentence is the best cross-reference in the book.

3. **Pie charts are taught here, not in the data chapter.** Mathematics II
   Chapter 5 (Dots, and the Lines Between Them) is the data chapter; pie charts
   land in Chapter 3 because they are a ratio drawn with a protractor. Worth
   checking that Chapter 5 does not teach them again from scratch - if it does,
   one of the two should defer.

4. **pi is used and cancelled in Beyond the Book** (p104, two wheels): "every
   circumference is 2 pi times its radius". Circles are still not taught in
   Class 8 - flagged in Part I Chapter 7's log as well. Two chapters in two
   volumes now assume the circle formulas.

5. **Terms this chapter introduces**: ratio, proportional, direct proportion,
   constant, rule of three, representative fraction, pie chart, inverse
   proportion. Class 9 Chapter 2 (linear polynomials) will need direct
   proportion as the straight line through the origin; it should point back
   here rather than redefine it.

6. **One character, two spellings**: Puneet (p001, p003) and Puneeth (p010).
   Flagged. Worth a sweep for the same fault in other chapters, since the
   recurring-name cast (Estu, Roxie, Surya, Viswanath) is used across chapters.

## Chapter 4 — Taking a Shape Apart

1. **Three named back-references, all correct.** Mathematics II Chapter 2 for
   the ant's shortest path ("Chapter 2 finishes it", p008), Mathematics II
   Chapter 1 for compounding downwards (p002), and Part I Chapter 7's
   2(lb + bh + hl) reached from the net in Beyond the Book. The net material
   here and in Part I Chapter 7 section 7.5 overlap: Part I teaches the net as
   surface area, this chapter teaches it as a folding problem and a shortest
   path. They do not contradict, but neither mentions the other - worth one
   cross-reference each way.

2. **F + V - E = 2 is stated for "every solid of this kind" without saying
   which solids.** Flagged. If Class 9 ever names Euler's formula, it should
   pick up the scope this chapter leaves open.

3. **Powers of fractions with a letter exponent** appear here for the first
   time in the book ((8/9)^n, (3/4)^n, (4/3)^n). Part I Chapter 2 established
   integer exponents and squared/cubed fractions; Mathematics II Chapter 1 used
   decimal multipliers to a power. Nothing has raised a fraction to the power n.
   Minor, and flagged.

4. **Terms this chapter introduces**: fractal, self-similarity, Sierpinski
   carpet, Sierpinski triangle, Koch snowflake, faces, edges, vertices, prism,
   pyramid, tetrahedron, net, projection, front/top/side view, isometric.
   Mathematics II Chapter 7 (The Same Area, a Different Shape) is the next
   chapter working with solids and areas.

5. **This is the plainest-written chapter in the book** - 3 fixes in 22 pages,
   against Part I Chapter 1's 101 in 33. Whatever process produced it is the
   one to repeat.

## Chapter 5 — Dots, and the Lines Between Them

1. **Pie charts are NOT taught again here.** Chapter 3 section 3.6 teaches them
   as a ratio drawn with a protractor; this chapter teaches line graphs, bar
   graphs, frequency tables and the strip picture, and never re-treads the pie.
   The division of labour works, but neither chapter points at the other -
   worth one cross-reference, since a reader looking for "the graphs chapter"
   will come here.

2. **"Average" and "mean" are used interchangeably** (Example 3 "reports an
   average of 150.2 cm", Example 5 "works out an average of 25.6 per tree",
   while the section headings and key ideas say mean). NCERT uses both too, so
   this is defensible - but the chapter never says they are the same word,
   and a reader who has been taught to distinguish them will look for a
   distinction. One sentence at section 5.1 would settle it.

3. **Mode is never taught, and appears as an MCQ distractor** (p106, "the most
   common value"). If mode belongs in Class 8 it belongs in this chapter; if it
   does not, the distractor is testing a term the book has not given. Worth a
   decision.

4. **Part I Chapter 4's algebra carries section 5.2 and 5.5.** The uniqueness
   argument for the balance point and the add-c-to-every-value proof are both
   expression manipulation of the kind Part I Chapter 4 taught, and neither
   credits it. Every other chapter in this volume names its back-references
   (Chapter 2 names three, Chapter 4 names three). This one names none.

5. **Terms this chapter introduces**: mean, median, frequency, frequency table,
   line graph, and the two-step reading discipline. Class 9 Chapter 7 (The
   Measure of Chance) is the next chapter to handle data and should build on
   section 5.9 rather than restating it.

6. **One forward reference with unexplained numbers**: p004 uses the 5.07
   household mean and the total 152 from section 5.7, six pages before section
   5.7 exists. Flagged - the only paragraph in the chapter a reader cannot
   follow.

## Chapter 6 — Why the Trick Always Works

1. **This chapter does what Part I Chapter 6 promised.** Part I Chapter 6 p005
   refused to hand over "move it across and change the sign" and made the
   student derive it; this chapter is thirty pages of the same principle applied
   to tricks. Neither chapter mentions the other, and they are the two halves of
   one argument about what algebra is for. One cross-reference each way.

2. **Place value as 10a + b is taught here, and Part I Chapter 3 taught place
   value.** Chapter 3 of Part I spent nineteen pages on the fact that a
   numeral's columns are powers of the base; this chapter's key idea "A
   two-digit number is 10a + b" is that fact in algebra, and says "The digits a
   and b written side by side do not mean a times b." Part I Chapter 3 is the
   natural back-reference and is not given.

3. **The recurring cast is used well**: Mukta and Shubham run the tricks in
   sections 6.2 and 6.9, Karim and the genie in 6.10, Gauri and Naina in the
   exercises. No spelling inconsistencies found in this chapter, unlike
   Chapter 3's Puneet/Puneeth.

4. **Terms this chapter introduces**: letter-number, number pyramid, and the
   10a + b representation. Note "letter-number" is this chapter's own coinage
   for a variable - Part I Chapter 4 calls it a variable and defines it
   properly. Two names for one thing across two volumes, and this chapter never
   says they are the same. Worth one sentence; it is a smaller version of the
   base/root problem.

5. **Exercise wording needs one clause** (p017 Q1, the three shrines): "leaves
   some at the first shrine ... the same number at the second" leaves the
   puzzle underdetermined as written. Flagged.

6. **Virahanka is named before Fibonacci** (p008), which is the same good
   practice as Baudhayana before Pythagoras in Chapter 2. Worth keeping
   consistent wherever a result has an earlier Indian source.

## Chapter 7 — The Same Area, a Different Shape

1. **This chapter closes a debt from Part I Chapter 7.** There the trapezium
   formula was got by doubling into a parallelogram, and the parallelogram's
   own rule was assumed. Here it is proved by dissection with a proper RHS
   congruence. So Mathematics II Chapter 7 completes Mathematics I Chapter 7,
   and neither says so by name - Part I should forward-reference it, and this
   chapter should name Part I Chapter 7 rather than "the first book".

2. **"The first book" is used three times** (p001, p010, p014) where every
   other chapter of this volume names the chapter. Flagged. Worth settling one
   form of words for cross-volume references across the whole book:
   "Part I Chapter 7" reads better than "the first book" and better than
   "Chapter 6 of Part I".

3. **The Sulbasutras appear in two chapters of this volume** - Chapter 2 for
   the theorem of the diagonal, Chapter 7 for shape-for-shape exchange - and
   Chapter 7 explicitly links back ("the same texts Chapter 2 took the theorem
   of the diagonal from"). That is the right way round and the only place in
   the book where a source is followed across two chapters.

4. **Area formula coverage across the book is now**: Part I Ch 7 (rectangle,
   square, triangle, trapezium, quadrilateral by diagonal, rhombus, surface
   areas, volumes), Mathematics II Ch 3 (pie chart angles), Mathematics II Ch 7
   (rectangle, triangle with the obtuse case, parallelogram, rhombus, kite,
   trapezium by one cut, any polygon by triangulation, unit conversion). The
   two chapters overlap on five formulas. They agree everywhere - I checked -
   but a reader meeting the trapezium twice is entitled to be told why.

5. **Unit conversion for areas is taught here and nowhere else**, including the
   squared-factor rule and the Indian land units. Class 9 should not re-teach
   it.

6. **Terms this chapter introduces**: dissection, and the Sulbasutra
   shape-exchange problems. Everything else it uses was defined in Part I.

# Class 9 · Mathematics I

## Chapter 1 — Orienting Yourself: The Use of Coordinates

1. **"Grade" versus "Class" is now a book-wide inconsistency.** This chapter
   says Grade 8, Grade 9, Grade 10 (p003, p010, p016, p103). Class 8 Part I
   says "Class 9's work on factorisation" (Ch 4) and "proved in Class 9"
   (Ch 5). Indian schools say Class. One word, book-wide, and this is the
   cheapest of all the outstanding fixes.

2. **The Pythagoras dependency is now confirmed as fixable.** This chapter
   says "the Baudhayana-Pythagoras Theorem from Grade 8" - so the book's own
   intended running order does put Pythagoras in Class 8, which is where
   Mathematics II Chapter 2 teaches it. That makes the Class 8 Part I Ch 5 and
   Ch 7 uses of the theorem a within-year forward reference rather than a
   contradiction, and a one-line signpost in those two chapters settles it.
   Class 9 Chapter 1 is downstream of all of them and is correct as it stands.

3. **The midpoint formula is needed by Class 9 Ch 1 and taught nowhere.**
   Five end-of-chapter questions use it. Class 9 Chapter 1 is the natural
   place; if it is meant for Class 10, the questions should go.

4. **The chapter refers to "the chapters on integers, rational numbers and
   decimals"** (p004), which do not exist in this book. Class 9 Chapter 3
   (The World of Numbers) is the nearest thing and comes after. Flagged.

5. **Terms this chapter introduces**: system of coordinates, celestial
   coordinates, number line (recalled), x-axis, y-axis, origin, coordinate
   axes, 2-D space, Cartesian plane / coordinate plane / xy-plane, quadrant,
   x-coordinate / abscissa, y-coordinate / ordinate, ordered pair, and the
   distance formula. Class 9 Chapter 2 (linear polynomials) will need the
   plane and the ordered pair; it should not redefine them.

6. **The distance formula is derived from Baudhayana-Pythagoras and credited**
   - this is the fourth chapter in the book to spend that theorem (Class 8
   Part I Ch 5 and Ch 7, Mathematics II Ch 2 and Ch 7) and the first to name
   where it came from when using it.

7. **Set 1.2 has two question 3s** - the same data-start fault as Class 8
   Part I Chapters 2 and 3. Three chapters, three volumes, one cause, and no
   build check catches it. Worth adding one.

## Chapter 2 — Introduction to Linear Polynomials

1. **Two chapters now point at chapters that do not exist.** Class 9 Ch 2 says
   twice that slope is "taken up properly in the chapter on linear equations"
   (p021, p028). Class 9 has no such chapter. And it calls Class 9 Chapter 8
   by the wrong name twice - "Sequences and Progressions" where the chapter is
   titled "What Comes Next" (p012, p028). Class 9 Ch 1 p004 refers to
   "the chapters on integers, rational numbers and decimals", which also do
   not exist here. Three bad forward references in two chapters: worth one
   sweep of every cross-reference in the book against the real contents list.

2. **"Degree" now has two definitions.** Class 8 Part I Ch 4 section 4.2.2:
   the degree of a term is the sum of the powers of all its variables, so
   5x^2y has degree 3. Class 9 Ch 2 p004: the degree is the highest power of
   the variable appearing in the polynomial. Both are standard and they agree
   on one-variable polynomials, which is all Class 9 Ch 2 handles - but the
   narrowing is silent, and a reader carrying the Class 8 rule forward will
   apply the wrong one to something like 3xy + 2. This is the same pattern as
   base and root: one word, two scopes, no acknowledgement.

3. **Class 9 Ch 2 re-teaches Class 8 Ch 4's vocabulary from scratch** - terms,
   variables, coefficients, constant, polynomial - opening only with "You have
   met algebraic expressions before". Class 8 Ch 4 is the best-written chapter
   in the first volume and defines all five carefully. Name it.

4. **Function notation f(x) is used across two chapters and taught in
   neither.** Class 9 Ch 2 defines "function" in words and then uses C(d),
   h(t), b(x), p(x), q(x), f(x) - including five end-of-chapter questions
   built on p(x). Class 8 never introduced it. Whichever chapter is meant to
   own it, this is where it is first needed.

5. **Accessibility regression between Chapter 1 and Chapter 2.** Ch 1 is built
   around a blind student and makes accessibility a mathematical question.
   Ch 2's seven graphs carry aria-label="2.5" and so on - the figure number as
   the entire description. The book's own Chapter 1 is the argument for fixing
   them.

6. **Terms this chapter introduces**: univariate polynomial, degree, cubic,
   quadratic, linear and constant polynomial, linear pattern, linear equation,
   function, linear growth, linear decay, linear relationship, slope,
   y-intercept. Class 9 Ch 8 (What Comes Next) needs "linear pattern" and the
   constant difference; Class 9 Ch 4 (Exploring Algebraic Identities) needs
   the polynomial vocabulary.

## Chapter 3 — The World of Numbers

1. **The fractional-power flag from Class 8 Chapter 4 is now settled, and the
   answer is that the notation appears nowhere.** I searched every Class 9
   chapter: no fractional exponent exists in the book. Class 9 Ch 3 handles
   roots entirely with the radical sign, correctly and consistently. So the
   single line in Class 8 Part I Ch 4 p003 - "root x is x to the power one
   half" - is the only place in two years of material that uses a fractional
   power, and it has nothing behind it. The fix is to delete that half-sentence,
   not to teach the notation.

2. **The Lebombo bone is dated twice, differently.** Class 8 Part I Ch 3 p002:
   "perhaps forty thousand years old", found "in South Africa". Class 9 Ch 3
   p001: "about 35,000 years old", found "in the Lebombo mountains between
   South Africa and Eswatini". Same 29 notches, same lunar reading. One figure
   is wanted, in both places.

3. **Class 9 Chapter 3 and Class 8 Part I Chapter 3 cover much the same
   ground**: pebble-matching, the Lebombo and Ishango bones, place value,
   shunya, the Bakhshali dot, Brahmagupta's rules. And Class 8 Part I Ch 1's
   Beyond the Book already proves root 2 irrational by contradiction, which
   Class 9 Ch 3 proves again from scratch. If the repetition is deliberate
   revision it should be signposted; if not, one of the two should give way.

4. **The Ishango bone's prime column is handled better here than in Class 8.**
   Class 8 Ch 3 mentions grouping; Class 9 Ch 3 p002 names the primes, says the
   argument "has run for seventy years and will probably run for another
   seventy", and lists the innocent explanations. That is the right treatment
   and the Class 8 version could point at it.

5. **Terms this chapter introduces**: one-to-one correspondence, natural
   numbers, Lebombo and Ishango bones, shunya, dhana and rna, integers,
   fractions, rational numbers, co-prime, absolute value, dense, irrational
   number, proof by contradiction, real numbers, terminating and repeating
   decimals, cyclic number, imaginary numbers (named, deferred). Class 9 Ch 4
   (Algebraic Identities) will need the rationals; Class 9 Ch 5 (Circles) will
   need pi and the fact that it is irrational, which is established here.

6. **Two internal ordering faults**: p019 says "as we have just seen" of
   sevenths that appear four pages later, and p026 strands the paragraph
   explaining the cyclic number two sections after the section it belongs to.
   Both are in the chapter log; both are cheap to fix and neither is a language
   defect.

## Chapter 4 — Exploring Algebraic Identities

1. **Class 9 Ch 4 re-derives two of Class 8 Part I Ch 4's three identities
   from scratch, and credits only the third.** Class 8 Part I Ch 4 section 4.6
   proves (a+b)^2, (a-b)^2 and a^2-b^2 by area arguments. Class 9 Ch 4 proves
   the first two again (area picture, then b -> -b) and says of the difference
   of squares only that you "met it in Grade 8". A sentence saying which of
   the four identities here are revision and which are new would cost nothing
   and would tell a reader what to expect.

2. **Both chapters make the same honest point about area proofs, independently.**
   Class 8 Part I Ch 4's Beyond the Book (p111): "an area cannot be negative,
   so strictly the drawings only cover the case where all the letters are
   positive lengths." Class 9 Ch 4 p003 says the same thing in its own words
   and then tests negatives and rationals. Good agreement; neither cites the
   other, and Class 9's version is the fuller one.

3. **"Grade" versus "Class" is now in two Class 9 chapters** - Ch 1 (Grade 8,
   9 and 10) and Ch 4 (earlier grades, Grade 8). Class 8's own volumes say
   Class. One sweep.

4. **Production fault, worth a pass of its own**: Class 9 Ch 4 p015 prints the
   same summary box twice and the duplicate cuts a sentence in half. I checked
   every page of that chapter for repeated blocks and found only this one, but
   the same check is worth running over the whole book - it is the kind of
   fault that a build check could catch and nothing currently does. Note that
   fixing it needs a refit, since p015 builds at 94%.

5. **Terms this chapter introduces**: algebraic identity, rational expression,
   algebra tiles, factorising by sum and product, and the cube identities.
   Class 9 Ch 8 (What Comes Next) may want the 1, 3, 3, 1 coefficients noted
   on p020 - the chapter says they are "a pattern you will meet again", which
   is presumably Pascal's triangle and is not in this book's Class 9 contents.
   Worth checking whether that promise is kept anywhere.

## Chapter 5 — Exploring Circles

5 fixes in 47 pages. Build clean; all answers correct.

1. **A chapter depends on the chapter after it.** Class 9 Ch 5 (Circles) is
   proved with results that Class 9 Ch 6 (Lines and the Angles They Make)
   teaches: the exterior-angle theorem, the angle sum of a triangle, linear
   pairs, and the word *reflex*. Theorem 9 - the central result of Ch 5, from
   which five later theorems and the corollary all descend - is proved entirely
   from the exterior-angle theorem on p024. Ch 6 assumes nothing from Ch 5, so
   the two chapters could simply be swapped. This is the same shape of fault as
   the Class 8 one (Ch 5 Quadrilaterals uses Pythagoras five pages' worth before
   Part II Ch 2 teaches it), and it is now the second instance: **the book's
   chapter order is not a dependency order, and nothing checks that it is.**
   Worth one pass over all four volumes asking, for each chapter, which results
   it assumes and where they are taught.

2. **The exterior-angle inequality is used two chapters before it is stated.**
   Ch 5 p029 and p031 both rest on "an exterior angle is larger than either
   interior angle opposite it", and both proofs (Theorems 10 and 12) fail
   without it. Ch 6 p016 states it and gives its reason - "an exterior angle is
   greater than either interior opposite angle, since it is their sum and
   neither is zero" - one page after proving the equality it comes from. So the
   result exists and is properly argued; it is simply in the next chapter. This
   is item 1 again, not a separate gap.

3. **Questions printed twice - now a book-wide pattern, and worse here.** Ch 5
   has four duplications, two of them with the answer on the same page as the
   question: Ex 5.5 Q7 is the second half of Example 9 at the top of the same
   page; Ex 5.7 Q1 and End-of-Chapter Q6 are word-for-word identical and both
   sit on page 32. This joins the `data-start` duplicate-*numbering* fault
   already recorded in Class 8 Part I Ch 2 and Ch 3 and Class 9 Ch 1. Different
   fault, same absence: **no build check compares question text, and no build
   check compares question numbers.** Both are mechanical and both keep landing
   in print.

4. **Congruence has no home chapter.** SSS and SAS first occur in the book in
   Class 9 Ch 5 p013 and p015, as bare abbreviations. *Congruent* is used in
   Class 8 Part I Ch 5 and Part II Ch 7 and is term-tagged in neither. RHS is
   explained beautifully in Ch 5 p016 - the only one of the three that is. A
   named result used by four chapters and taught by none.

5. **"Grade" versus "Class" is now in four Class 9 chapters** - Ch 1, Ch 2, Ch 4
   and Ch 5. Class 8's volumes say Class throughout. One sweep, still not done.

6. **Terms this chapter introduces**: locus, chord, subtend, diameter, arc,
   minor and major arc, collinear, circumcircle, circumcentre, circumscribe,
   inscribed, corollary, concyclic, cyclic quadrilateral. Fifteen tagged terms,
   and *equidistant* left untagged in twelve places while carrying Section 5.4.

7. **Ch 5 p007 states the locus fact that Class 8 Part I Ch 5 p016 needs.**
   Both halves, and a sentence on why both are needed. The Class 8 flag (M3,
   "the whole load-bearing step appears once, mid-sentence, as though the reader
   had it") can be closed by borrowing this wording rather than writing new.

8. **Surds where the chapter has trained the reader on triples.** Ch 5 Ex 5.5 Q2
   and End-of-Chapter Q9 resolve to 2root13 and 3root2 in a chapter otherwise
   built entirely on 3-4-5, 5-12-13, 8-15-17, 7-24-25 and 20-21-29. Identical to
   the Class 8 Part II Ch 7 Q9 flag. Two instances now: worth a house rule that
   an exercise whose answer is a surd says so.

## Chapter 6 — Lines and the Angles They Make

5 fixes in 30 pages. Build clean; all answers correct. The plainest register in
Class 9, and the first Class 9 chapter with no "Grade" in it at all.

1. **This is the chapter Chapter 5 needed first.** Everything Ch 5 borrows is
   here and is properly argued: the linear pair, vertically opposite angles, the
   four transversal names, the parallel axiom, reflex angles (p002), the angle
   sum (p015), the exterior angle theorem (p016) and - one page later, with its
   reason - the exterior angle inequality that carries Ch 5's Theorems 10 and
   12. Swapping Ch 5 and Ch 6 costs nothing in the other direction: Ch 6 uses no
   result from Ch 5, and its only reference outward is the broken one in item 3.

2. **A withheld method is then set as homework.** Ch 6 p012 says of which side
   two non-parallel lines meet on: "the algebra even tells you on which side,
   though we will not chase that here." End-of-chapter Q10 and starred Q12 both
   require exactly that. The argument is supplied in Beyond the Book on p103,
   after the exercises. Same shape as the Ch 5 flag where Ex 5.5 Q7's answer is
   printed above it: **the chapter proper and its Beyond the Book are not being
   read against each other.** Worth one pass per chapter asking, for every
   exercise, whether its method is in the chapter *before* it.

3. **Dangling forward references, now four in Class 9.** Ch 1 cites chapters on
   integers, rational numbers and decimals (none exist). Ch 2 cites "the chapter
   on linear equations" (none exists) and calls Ch 8 "Sequences and
   Progressions" (it is What Comes Next). Ch 6 p010 cites "the chapters on
   quadrilaterals to come" - quadrilaterals is Class 8 Part I Ch 5, already
   done. Every one of the four points a reader at the contents page and wastes
   their time. One sweep over every forward reference in the book, checked
   against the contents.

4. **Stage 1 re-uses chapter questions and says it does not.** Ch 6's Stage 1
   opens "What is new is that the question no longer says which item to reach
   for", and four of its five questions are Example 10, Ex 6.2 Q6, EOC Q12 and
   EOC Q11. Ch 5 does the same thing with Problem 1 but gets it right with
   Problem 3, which names the exercise it is answering. **The clause exists in
   the book; it just is not used consistently.** Cheapest possible fix, and it
   turns an apparent oversight into a visible design.

5. **Two markup conventions for a hard question, the book split down the
   middle.** `<li class="hard">` in Class 8 throughout, Class 9 Ch 1 and Ch 5;
   `<ol class="c-questions c-questions--starred">` in Class 9 Ch 2, Ch 3, Ch 4
   and Ch 6. Both defined, both build clean. They are not interchangeable - one
   marks an item, the other a whole list - so a set mixing hard and ordinary
   questions can only use the first.

6. **Answers that do not come out whole, third instance.** Ch 6 EOC Q7 gives
   78 1/3, 63 1/3 and 38 1/3 degrees. With Ch 5's Ex 5.5 Q2 (2root13) and EOC Q9
   (3root2), and Class 8 Part II Ch 7 Q9, that is four questions in three
   chapters whose answers are the only untidy ones in their set and which say
   nothing about it. A house rule would settle it: an exercise whose answer is
   not whole says so, or the numbers change.

7. **Terms this chapter introduces**: line, ray, line segment, angle, vertex,
   arms, complementary, supplementary, adjacent, linear pair, vertically
   opposite, transversal, interior, exterior, parallel, axiom, corresponding /
   alternate interior / alternate exterior / co-interior, exterior angle,
   interior opposite angles, construction. Twenty-two, all tagged, all glossed
   at first use - the most careful vocabulary handling in either class, and the
   right model for the *equidistant*, *altitude*, SSS and SAS gaps in Ch 5.

## Chapter 7 — The Measure of Chance

2 fixes in 28 pages. Build clean; all 25 multiple-choice answers correct. With
Ch 6 this is the plainest writing in either class, and the second Class 9
chapter with no "Grade" in it.

1. **The second arithmetic error in the book.** Ch 7 p104: the union of
   {2,4,6,8} and {6,7,8} is given as six; it is five, and the sentence's own
   reasoning (four plus three, less the two counted twice) gives five. The first
   was Class 8 Part II Ch 1 Example 7, where 21,000 x 0.95^3 is printed as
   Rs 18,015 instead of Rs 18,005. Two errors in 22 chapters is a good rate, but
   **neither is the kind any build check can catch**, and both are in worked
   solutions, which is where a reader trusts the book most. A pass that
   re-derives every printed number is the only thing that finds them, and it is
   worth budgeting for once before print.

2. **A term borrowed for a second meaning inside one chapter.** Ch 7 p010 makes
   *sample* the statistical sample - 50 students standing for 1500 - and p014
   then calls n(S) the "sample size". For two coins the sample size is 4. This
   is the same fault as *base* (five meanings across Class 8), *root* (two),
   *degree* (two definitions) and *variable* / "letter-number" - but it is the
   first one that happens **within a single chapter, four pages apart**, and in
   the one chapter where telling trials apart from outcomes is the whole
   lesson. The book's own better phrasing is in the same chapter's question set:
   "the sample space ... has size".

3. **A summary that establishes more than the chapter did.** Ch 7 p018 lists
   P(not E) = 1 - P(E) under "What this chapter established". The chapter proper
   never states it - p008 asks the student to notice it and p106, in Beyond the
   Book, proves it. Worth a check across all 22 chapters: **does every summary
   point correspond to something on a page of that chapter?** It is a
   mechanical check and this is the first instance found.

4. **Back-references to unnumbered items.** Ch 7 p102 refers to "the third",
   "the seventh" and "the ninth" of nine `.c-try` questions that carry no
   numbers and straddle a page turn. All three references are correct and none
   is usable. `.c-try` is a rule-bounded band with no counter (css/bridge.css),
   so any stage that wants to refer back to its own questions has to name them
   instead - which Stage 2 does, with titles. Either the component gains a
   number or the prose stops using ordinals.

5. **Beyond the Book done right, for contrast.** Unlike Ch 5 and Ch 6, all nine
   of Ch 7's Stage 1 questions are new - none is lifted from the chapter's
   exercises - and Stage 2 answers exactly those nine, in order, under titles
   that say what each is about. This is the model the other two chapters should
   follow, and it is worth pointing at when fixing them.

6. **Terms this chapter introduces**: subjective probability, random,
   experiment, trial, outcome, relative frequency, experimental probability,
   theoretical probability, unbiased, fair, sample, population, law of large
   numbers, gambler's fallacy, sample space, event, tree diagram. All tagged and
   glossed - except *union*, used once on p104 and defined nowhere in either
   class.

## Chapter 8 — What Comes Next

6 fixes in 32 pages, five of them one word. Build clean; all 27 multiple-choice
answers correct. Third Class 9 chapter in a row with no "Grade" in it.

1. **The third arithmetic error in the book, and the first found in ordinary
   prose rather than a worked solution.** Ch 8 p018 says the doubling pattern
   "reaches eighty-one before its sixth stage and a thousand before its ninth".
   The pattern is 3, 6, 12, 24, 48, 96, ... so it reaches 81 at stage six and a
   thousand at stage ten. The three errors now found are Class 8 Part II Ch 1
   Example 7 (Rs 18,015 for Rs 18,005), Class 9 Ch 7 p104 (a union of six where
   it is five) and this one. **None is catchable by a build check and all three
   are in sentences a reader has no reason to doubt.** One pass that re-derives
   every printed number is the only defence, and it now has three hits to
   justify it.

2. **Stage 1 lifts chapter questions and says it does not - three chapters out
   of four.** Ch 5 (Problem 1), Ch 6 (four of five Stage 1 questions), Ch 8
   (three of eight). Ch 7 is the exception and shows it is avoidable: all nine
   of its Stage 1 questions are new. The stage's own strap - "questions that do
   not say which one to use" - is not the problem; the problem is the sentence
   underneath claiming the questions are new. **Ch 5 p106 contains the correct
   form of words** ("Exercise Set 5.3 asked why that fails, and here is the
   answer in numbers"), so the fix is a clause, not a rewrite.

3. **`.c-try` has no number, and two chapters' prose needs one.** Ch 7 p102
   refers to "the third", "the seventh" and "the ninth" of nine unnumbered
   bands; Ch 8 p102 to "the third and the sixth", "The seventh" and "The
   eighth" of eight. Every reference is correct and none is usable, and in both
   chapters the bands straddle a page turn. `.c-try` in css/bridge.css is a rule
   above and below with no counter. **Either the component gains a number or
   Stage 1 stops using ordinals** - Stage 2 already names its solutions with
   titles, which is the workable pattern.

4. **The exercise-band structure is not uniform across Class 9.** Ch 1-6 carry
   an "End-of-Chapter Exercises" band. Ch 7 has none and needs none. Ch 8 has
   eight end-of-chapter questions with no band: they are numbered 7 to 14 inside
   Exercise Set 8.6, the geometric-progression set, so a set about GPs contains
   questions about salaries, bacteria and multiples of 7. Add to that the bare
   `<ol>` blocks already recorded in Ch 3 (p029-p032), Ch 8 (p021 items 7-14,
   p109 items 9-10): **the exercise machinery is the least consistent part of
   the book**, and none of it is checked by anything.

5. **A summary that establishes less than the chapter did - the mirror of Ch 7.**
   Ch 8 p014 states the general AP sum in Aryabhata's form and says "you will
   meet it again in that form"; the summary lists only the naturals sum. Ch 7's
   summary claimed P(not E) = 1 - P(E), which the chapter proper never states.
   Both are the same check, run in two directions: **does every summary point
   correspond to something on a page of that chapter, and does every result the
   chapter states appear in its summary?** Two hits in two chapters.

6. **Ch 2 and Ch 8 prove the same thing from opposite ends and neither says so.**
   Ch 2 p005: "A linear polynomial steps by a constant, its graph is straight."
   Ch 8 p012: "a constant step sideways always buys the same step upwards, and
   that is exactly what a straight line is." Ch 2 points forward twice (under a
   title Ch 8 does not have); Ch 8 makes no reference to any other chapter in
   the book - it is the only one of the eight that does not. A reader who has
   done both is owed the connection.

7. **Terms this chapter introduces**: sequence, term, finite, infinite, explicit
   rule, recursive rule, Virahanka-Fibonacci sequence, arithmetic progression,
   AP, common difference, geometric progression, GP, common ratio, fractal. All
   tagged and glossed at first use.

## After all 22 chapters — corrections and a standing list

**Two claims in the earlier logs were wrong and have been corrected in place.**
Both said a language fix had closed a pre-existing overflow:

- Class 8 Part II Ch 1, p010 ("and it is not arbitrary" -> "an accident")
- Class 8 Part II Ch 2, p005 ("It can be cornered" -> "It can be trapped")

Re-tested the documented way - chapter copied to a scratch directory, the one
word reverted, built, fill maps compared - and the overflow is identical either
way in both cases. Both are pre-existing and neither fix touched them. ("An
accident" is a character longer than "arbitrary", so it could not have helped.)
The lesson is procedural: the scratch-revert test must actually be run, not
inferred from a remembered earlier build. Where it was run properly - Class 8
Ch 1's three overfull pages (mine), Ch 5 p008, Ch 6 p108/p110, Ch 7 p102/p107,
Part II ch02 p110, ch04 p001/p003, ch05 p105, ch07 p001/p002 (all pre-existing)
- those findings still hold on a rebuild.

**Pre-existing fitting faults across the book, none caused by this pass.** All
are `~` (under the 12mm clipping threshold), so nothing is cut:
Class 8 Ch 5 p8; Ch 6 p2, p19, and short pages p25, p27; Ch 7 p1, p7, p17, and
short page p22; Part II ch01 p1, p4, p10, p25; ch02 p5, p24; ch04 p1 and short
page p3; ch05 short page p22; ch06 short page p28; ch07 short pages p1, p2.
Class 9 builds clean throughout - 8 chapters, 0 overflows, 0 short pages.

**The four things a build check could catch and none does.** Every one of these
landed in print and was found only by reading:

1. **Duplicate question numbers.** `data-start` restarting at a number already
   used - Class 8 Part I Ch 2, Ch 3, Class 9 Ch 1.
2. **Duplicate question text.** Class 9 Ch 5 has four (two with the answer on
   the same page), Ch 6 has one, Ch 8 has three counting the bridge.
3. **Duplicate blocks.** Class 9 Ch 4 p015 prints a summary box twice and the
   duplicate cuts a sentence in half - the worst production fault in the book.
4. **Figure alt text that is only a figure number.** Class 9 Ch 2, seven graphs
   reading `aria-label="2.5"` and so on, in a book whose Ch 1 is built around a
   blind student.

All four are mechanical. A morning's work on the checks would stop them
recurring, and would have found all thirteen instances.

**The three arithmetic errors, which no check can catch.** Class 8 Part II Ch 1
Example 7 (Rs 18,015 where 21,000 x 0.95^3 = 18,004.875); Class 9 Ch 7 p104 (a
union given as six where it is five); Class 9 Ch 8 p018 (a doubling pattern said
to reach 81 before its sixth stage and 1000 before its ninth - it is the sixth
and the tenth). Three in 22 chapters, all in prose or a worked solution, all in
sentences a reader has no reason to doubt. One pass re-deriving every printed
number is the only defence.

**Nothing in these 22 logs has been acted on.** Roughly 100 flags stand, about
fifteen of them things a reader will actually trip over. The cheapest high-value
group is the vocabulary sweep: "Grade" -> "Class" (four Class 9 chapters), the
three dangling forward references, *base*'s five meanings, *root*'s two,
*degree*'s two definitions, and the four undefined terms in Class 9 Ch 5
(*equidistant*, *altitude*, SSS, SAS). None needs a refit; all are words.

## Class 7 · Mathematics I · Chapter 1 — Living with Large Numbers

The first Class 7 chapter, written new rather than edited, so these are
settings the rest of the volume inherits rather than conflicts found.

1. **The volume is Crown Quarto in the house design**, one palette per chapter
   (`garnet` here), no `edition`, no `design`. Class 6's `maths-clear` and
   `class6` were offered and declined. `keepExerciseSets` is not used.
2. **Terms this chapter defines, which later chapters must use the same way:**
   *lakh*, *crore*, *arab* (singular after a number: "ten lakh", never "ten
   lakhs"); *Indian system* and *American system* (the chapter says the latter
   "is also called the International system" once and then uses *American*);
   *nearest neighbours* of a number; *round up*, *round down*; *assumption*.
3. **Numbers in maths carry braced commas** in the Indian grouping,
   `$4{,}63{,}128$`; in running text they are plain, 4,63,128. Four-digit
   numbers take no comma in either (5072, 8300), five digits and up do.
4. **Roxie and Estu** are NCERT's recurring pair and are kept, so a teacher
   moving between the two books meets the same children. Chapter 1 also uses
   Eshwarappa (their father), Ramanna, Lakshmamma, Somu, Riya, Anu, Kabir and
   Preetham.
5. **Chapter 3 (decimals) and Chapter 8 (fractions)** should know that Chapter 1
   avoided fraction notation entirely: halving is written $116 \div 2$ and the
   hint is $125 = 1000 \div 8$.

## Class 7 · Mathematics I · Chapter 2 — Terms and Brackets

1. **Terms, not an order-of-operations rule.** The chapter works out an
   expression by splitting it into terms (the parts joined by + once every
   subtraction is written as adding the inverse), working out each term, then
   adding. It never teaches BODMAS or "left to right". Later chapters must
   not assume either, and should not print a term mixing × and ÷ such as
   $12 \div 3 \times 2$ — nothing in the volume says how to read it.
2. **Terms defined here:** *arithmetic expression*, *value*, *terms*, *inverse*
   (of a number), *commutative property of addition*, *associative property of
   addition*, *distributive property*. Chapter 4 (letter-numbers) revisits all
   of them and should refer back rather than redefine.
3. **Terms are shaded with `.chip`** in this chapter, and the text says it is a
   learning aid. Chapter 4 may use the same shading; nothing later should.
4. **Two markup traps, both hit here:** inside `$…$` write `\lt` and `\gt`,
   never `&lt;`/`&gt;` (KaTeX sees the entity and fails); and after a
   `<span class="blank">` never open maths with a space — `</span>$+ 4)`,
   not `</span>$ + 4)`. The builder reports both, but only after a wasted
   build.

## Class 7 · Mathematics I · Chapter 3 — The Decimal Point

1. **Ones, not units, for the place.** From 3.4 on, the place is *ones* in
   every table and sentence, and *unit* means a unit of measure. Sections
   3.1–3.3 come before decimal notation and measure in *units* and *tenths of
   a unit*, which is that second meaning. Chapter 8 (fractions) and any later
   place value table should say *ones*.
2. **Terms defined here:** *hundredth*, *thousandth*, *decimal system*,
   *decimal point*. *Tenth* is used as an ordinary word from 3.1. Later
   chapters should use these without defining them again.
3. **The stacked notation lives only in 3.2–3.3.** The source writes 4 units,
   4 tenths and 5 hundredths as $4\frac{4}{10}\frac{5}{100}$, a bridge to
   decimal notation that this chapter drops from 3.4 on. Chapter 8 must not
   meet it as a way of writing a fraction.
4. **Not yet taught: multiplying or dividing a decimal.** Beyond the Book
   stays inside that — 0.7 hour is read as 7 parts of 6 minutes, and
   $7 \times 6$ is whole-number work. A later chapter must teach it before it
   is used.
5. **Money** is written with ₹ and two decimal places (₹0.50, ₹2.45). *p* for
   paise appears only in fill-in blanks.
6. **A fitting trap worth knowing.** The opener rule counts five body lines at
   the measured line height, 5.01 mm, so a heading with exactly five 5.0 mm
   lines of room under it is stranded by 0.05 mm. That held a page of this
   chapter at 81% until one line was cut from the page before.
7. **Names:** Sonu, Zara, Priya, Shylaja, Sarayu, Mahi, Pinto and Tinku are the
   source's; Beyond the Book adds Ravi and Shreya.

## Class 7 · Mathematics I · Chapter 4 — Letter-Numbers

1. **Terms defined here:** *letter-number*, *algebraic expression*, *formula*,
   *simplified form*, *simplest form*, *like terms*, *unlike terms*. The
   chapter follows Chapter 2's *terms*, *brackets* and *distributive
   property* and does not define them again; later chapters should do the
   same.
2. **Notation.** The multiplication sign is written ($2 \times n$) until 4.3,
   where $4n$, $pq$ and $3(m + 1)$ are introduced together. Subtraction is
   still read as adding the inverse, written with brackets:
   $23 + (-10 \times 2)$. Terms are shaded with `.chip` once, in 4.1 and 4.2,
   as Chapter 2 allowed; nothing later should shade them.
3. **Not taught:** dividing an expression, and solving an equation. Beyond the
   Book avoids both — "halve it" is kept out of the number trick, and the
   matchstick question with 100 sticks is answered by checking $3 \times 33 + 1$.
   A later chapter that needs either must teach it first.
4. **Two expressions are equal** only if they agree for every value; one value
   where they differ shows they are not. Chapter 4 relies on this in
   Examples 10 and Stage 1; a later chapter should use the same wording.
5. **Names:** Shabnam, Aftab, Parthiv, Ketaki, Munirathna, Krithika,
   Venkatalakshmi, Charu, Krishita, Somjit, Pushpita and Radha are the
   source's; Beyond the Book adds Rani, Asha and Priya.

## Class 7 · Mathematics I · Chapter 5 — Parallel and Crossing Lines

1. **Terms defined here:** *plane*, *intersect*, *linear pair*, *vertically
   opposite angles*, *proof*, *perpendicular*, *parallel lines*,
   *transversal*, *corresponding angles*, *alternate angles*, *interior
   angles* (on the same side of a transversal). Later chapters should use
   them without defining them again.
2. **What is proved and what is not.** Vertically opposite angles are equal,
   and alternate angles between parallel lines are equal: both are proved by
   reasoning. That corresponding angles are equal exactly when the lines are
   parallel is taken from drawing and tracing, and stated as a key idea, not
   proved. Interior angles adding to $180^\circ$ is left as a question with a
   reason asked for. A straight angle is $180^\circ$ and a full turn
   $360^\circ$ are taken as known.
3. **Not taught:** the angle sum of a triangle (Chapter 7) and the symbol
   $\parallel$. Nothing in this chapter or its Beyond the Book uses either —
   a four-sided figure's angles are found only through pairs of parallel
   sides. Chapter 7 may introduce $\parallel$ if it wants it.
4. **Notation in figures:** parallel lines carry arrowheads, one per line for
   the first set and two for the second; a right angle is a small square.
   Angles are named $\angle a$, $\angle 1$ or $\angle ABC$.
5. **Names:** none. The source's figure values for its exercises could not be
   read and were chosen here; see the chapter's EDIT-LOG.

## Class 7 · Mathematics I · Chapter 6 — Number Play

1. **Terms defined here:** *parity*, *magic square*, *magic sum*,
   *Virahanka numbers* (also Virahanka–Fibonacci numbers), *cryptarithm*.
   *Proof* is used as Chapter 5 defined it.
2. **Parity rules stated:** a sum is odd exactly when it has an odd number of
   odd numbers in it; a product is odd only when every number multiplied is
   odd; the $n$th even number is $2n$ and the $n$th odd number is $2n - 1$.
   Later chapters can cite them.
3. **Letter-numbers** are used as Chapter 4 left them: $3n + 4$, $2n - 1$,
   and the general magic square with centre $m$. Nothing is solved as an
   equation; M4 $+$ 4M $= 121$ in Beyond the Book is settled by place value
   and $11 \times$ M $= 77$, a multiplication fact, not by algebra.
4. **Spelling:** *Virahanka*, *Pingala*, *Gopala*, *Hemachandra*, *Chautisa
   Yantra*, *Parshvanath*, *Lo Shu*, *Kubera Yantra* — plain Latin letters,
   no diacritics, as in the rest of the book.
5. **Names:** Kishor, Vidya, Martin, Maria, Lakpa, Dorjee, Liswini and Angaan
   are the source's; Beyond the Book adds none.

## Class 7 · Mathematics I · Chapter 7 — A Tale of Three Intersecting Lines

1. **Terms defined here:** *vertex* (*vertices*), *side*, *equilateral*,
   *isosceles* and *scalene triangle*, *triangle inequality*, *included
   angle*, *included side*, *angle sum property*, *exterior angle*,
   *altitude*, *right-angled*, *obtuse-angled* and *acute-angled triangle*.
   Later chapters should use them without defining them again.
2. **Notation:** △ABC for a triangle; $\angle A$ as short for the angle of the
   triangle at A; equal sides marked with matching ticks. Chapter 5's
   arrowheads for parallel lines and square for a right angle are kept.
3. **What is proved:** the angle sum property, by a line through a vertex
   parallel to the opposite side and Chapter 5's alternate angles; and that
   three lengths make a triangle exactly when they satisfy the triangle
   inequality, by the three cases of two circles. The exterior angle equal to
   the sum of the two opposite interior angles is only asked for in 7.3 and
   noticed in Beyond the Book; it is not stated as a named property, so a
   later chapter that needs it should state it.
4. **Deferred:** sorting triangles by equal angles, and whether that matches
   sorting by equal sides, is promised to "a later chapter". Congruence is
   not mentioned.
5. **Names:** none; the source has no named people in this chapter.

## Class 7 · Mathematics I · Chapter 8 — Working with Fractions

1. **Terms defined here:** *multiplier*, *multiplicand*, *dividend*,
   *divisor*, *quotient*, *reciprocal*, *cancelling* (a common factor).
   Mathematics II and later chapters should use them without defining them
   again.
2. **Rules stated:** $\frac{a}{b} \times \frac{c}{d} = \frac{a \times c}{b
   \times d}$ and $\frac{a}{b} \div \frac{c}{d} = \frac{a \times d}{b \times
   c}$, both credited to Brahmagupta (628 CE); the order of multiplication
   does not matter; multiplying or dividing by a number between 0 and 1, or
   greater than 1, makes the answer smaller or larger as the summary states.
   A whole number is written over 1, and a mixed number is turned into a
   single fraction before multiplying, dividing or taking a reciprocal.
3. **Notation:** inline fractions are `\frac`, displayed working uses
   `\dfrac`; mixed numbers are written $2\frac{1}{4}$. Figures label
   fractions with a slash (1/4), never with the precomposed glyphs ¼ and ½,
   which the diagram face may not carry.
4. **Not taught:** decimals times fractions, and fractions of negative
   numbers. Percentages are not mentioned.
5. **Names:** Aaron, Tenzin, Manju, Safia, Somu, Krishna, Bora, Tsewang,
   Leena, Maria, Mira, Amritpal and Mariam are the source's; Beyond the Book
   adds none.

## Class 7 · Mathematics II · Chapter 1 — Geometric Twins

1. **Mathematics II lives beside Mathematics I** in `pages/class-7/`, as
   `p2chNN-…` with `subject: "Mathematics II"`, the Class 8 convention; each
   volume restarts at Chapter 1 and binds on its own.
2. **Terms defined here:** *congruent*, *superimpose*, *corresponding*
   (vertices, sides, angles), *SSS*, *SAS*, *SSA*, *ASA*, *AAS*, *RHS*,
   *hypotenuse*. *Included angle* and the triangle words are used as Mathematics
   I Chapter 7 left them.
3. **Notation:** triangle names are set as maths, $\triangle ABC$, because the
   congruence sign has to be; Mathematics I Chapter 7 wrote △ABC as text.
   Side names in prose stay plain (AB = 4 cm); equalities with several parts are
   maths ($AB = XY = 6$ cm). Equal sides carry matching ticks and equal angles
   matching arcs.
4. **Results stated:** angles opposite equal sides are equal (proved by RHS);
   every angle of an equilateral triangle is $60^\circ$. This settles the
   question Mathematics I Chapter 7 left for "a later chapter" in one
   direction only: the converse (equal angles give equal sides) is not stated.
5. **Used without proof:** the converse of alternate angles (equal alternate
   angles make lines parallel), in Set 1.4 Q3; Mathematics I Chapter 5 states it
   only for corresponding angles.
6. **Names:** Meera and Rabia are the source's; Beyond the Book adds Riya and
   Sameer.

## Class 7 · Mathematics II · Chapter 2 — Operations with Integers

1. **Terms defined here:** *magnitude*, *zero pair*, *additive inverse*
   (written $-a$). *Multiplier*, *multiplicand*, *dividend*, *divisor* and
   *quotient* are used as Mathematics I Chapter 8 defined them.
2. **Notation:** negative numbers are always maths, $-5$, and a negative factor
   is bracketed, $4 \times (-2)$; the source's $5 \times -3$ is not used.
   Tokens are marked + and −, not coloured.
3. **Results stated:** sign rules for products and quotients; $1 \times a = a$,
   $(-1) \times a = -a$; multiplication of integers is commutative,
   associative and distributive over addition. Division is shown not to be
   commutative only in Beyond the Book.
4. **Not taught:** division that does not come out exact, and powers of
   negative numbers.
5. **Names:** Rakesh, Mala, Anita and Anil are the source's; Beyond the Book
   adds Priya, Arun, Meena and Kiran.
