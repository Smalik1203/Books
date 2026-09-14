# Class 9 · Mathematics I · Chapter 2 — Introduction to Linear Polynomials

Language edit, 41 pages (p001–p029 chapter proper, p101–p112 Beyond the Book) —
the longest chapter in the book so far. Build after editing: 41 pages, all pages
fit, 0 stranded openers, no label collisions, every option row fits. Every
worked value re-derived, including Example 11's telecom rule ($a = 20$,
$b = 150$), the Kelvin–Fahrenheit conversion in Q8, and the bridge's
$p(2) = 7$, $p(5) = 16 \Rightarrow p(0) = 1$.

8 fixes in 41 pages. The writing is excellent and the chapter's argument is the
best-organised in the book: it does not present $ax + b$ as a thing to
manipulate, it asks **why degree 1 deserves a chapter** and answers on p005 —
"degree $1$ is where several separate things coincide, and they stop coinciding
immediately afterwards." A linear polynomial steps by a constant, its graph is
straight, and two points determine it; none of the three is true of $x^2$. Then
every section pays that off, and p021 closes the loop by showing the constant
difference of a *list* and the steepness of a *picture* are the same number.

Two other things worth recording:

- **It names what it leaves loose.** p028 lists four threads — the equation in
  two unknowns, the measurement of slope, the $n$th term, and the even-handed
  form $ax + by + c$ that reaches vertical lines — and says which later chapter
  takes each. Then the closing paragraph gives the general claim: a polynomial
  of degree $n$ is fixed by $n+1$ observations, "and degree $1$ is simply the
  cheapest case there is."
- **p016 insists on the right word.** Two measurements determine $a$ and $b$
  only if they are *independent*: "Two readings taken at the same value of $x$
  say the same thing twice and settle nothing, however carefully they were
  measured."

## FIXED

| before | after | check |
|---|---|---|
| **p006** "so tabulate it" | "so make a table of it" | L1 |
| **p013** "Tabulate the cost as $d$ runs from $0$ to $5$" | "Make a table of the cost as…" | L1 |
| **p014** "Tabulate it." | "Make a table of it." | L1 |
| **p014** "Tabulate the height for $t$ from $0$ to $10$ months" | "Make a table of the height…" | L1 |
| **p015** "Tabulate its value…", "Tabulate the population…", "Tabulate the balance…" | "Make a table of…" ×3 | L1 |
| **p027** "Tabulate the number of matchsticks" | "Make a table of the number of matchsticks" | L1 |

All eight are the same word. *Tabulate* was removed from Class 8 Part I
Chapter 2's Beyond the Book for the same reason; this chapter uses it six times
as an instruction inside exercise questions, which is where it does most harm.

**Considered and left: "satisfy".** p016 has "a pair of values that must satisfy
the relation" and p018 has "coordinates satisfying $y = 2x + 1$". I changed the
first to *fit* and reverted it, for two reasons that reinforce each other: the
plain version dropped a rendered line and took p016 from 89% to 86% full, and
*satisfies an equation* is the standard term this reader will meet in every
exam paper from here on. It is the topic's own vocabulary, used consistently in
all three places, and it stays. (In Class 8 I did replace *satisfy* — but there
it appeared in bare instructions like "Check both answers satisfy
$a^2+b^2=c^2$", not in prose defining what a point on a line is.)

## FLAGGED

Worst first.

| location | code | what's wrong | what it needs |
|---|---|---|---|
| p018, p019, p020, p021, p022, p023, p024 | C4 | **Seven graphs are invisible to a blind reader.** Every figure in § 2.6 carries `aria-label="2.5"`, `"2.6"`, … `"2.11"` — the figure number and nothing else. A screen reader announces "two point five". Every other figure in the chapter has a real description ("A rectangular garden, $w$ metres wide and $l$ metres long", "Three stages of a growing pattern of hexagons made from matchsticks"), so the fault is confined to the seven graphs — which are exactly the figures where the description carries the teaching. **Chapter 1 of this same book is built around Reiaan, who cannot see**, and asks the reader whether their school's doors admit a wheelchair. | Seven alt texts. The captions already say most of what is needed: "The graphs of $y = \frac12 x$, $y = x$ and $y = 2x$. Every one passes through the origin, and the larger $a$ is, the steeper the line." |
| p013 onwards, and p026–p027 | M1 | **Function notation is never introduced.** § 2.2 defines *function* in words — "feed it a number, and it hands one back" — and never shows how one is written. Then $C(d) = 100 + 60d$ appears on p013, $h(t)$ on p014, $b(x)$ on p015, and the last five end-of-chapter questions are built on $p(x)$, $q(x)$ and $f(x)$, including Q11's three conditions on $p(0)$, $p(x) - q(x)$ and $p(x) + q(x)$. A reader who has not met the bracket notation will read $p(x)$ as $p$ times $x$ — and in a chapter about coefficients that is a very easy mistake to make. | One short paragraph where *function* is defined, saying that $f(x)$ names the output for input $x$ and is not a multiplication. Everything else is already in place. |
| p021, p028 | C5 | "Slope is taken up properly in **the chapter on linear equations**", and again on p028, "The chapter on linear equations does." **There is no such chapter in this book.** Class 9 runs: coordinates, linear polynomials, world of numbers, algebraic identities, circles, lines and angles, probability, sequences. | Either name the real destination (Class 10, if that is what is meant) or drop the forward reference. Two readers in three will go looking. |
| p012, p028 | C5 | "Sequences of this kind are taken further in **the chapter on Sequences and Progressions**", and p028 "**Sequences and Progressions** takes that constant difference as the defining property". The chapter exists — it is Class 9 Chapter 8 — but it is called **What Comes Next**. A reader scanning the contents page for "Sequences and Progressions" will not find it. | Use the chapter's own title, or its number. |
| p002–p004 vs Class 8 Part I Ch 4 | C3 | *Terms*, *variables*, *coefficients*, *constant*, *polynomial* and *degree* are all defined here from scratch, and all six were defined in Class 8 Part I Chapter 4. The chapter opens "You have met algebraic expressions before" without saying where. Worse, *degree* now means two things: Class 8 defined it as the **sum** of the powers in a term (so $5x^2y$ has degree 3), while this chapter defines it as the **highest power** of the single variable. For univariate polynomials the two agree, and this chapter restricts itself to one variable — but nothing says so, and a reader who remembers the Class 8 rule will apply it. | Name Class 8 Chapter 4, and say that the definition is being narrowed because the chapter is about one variable. Two sentences. |
