# Class 6 · Mathematics I · Chapter 3 — Number Play

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by section and set, *Exercise Set 3.4, Q1*, so it can be used beside
the book without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book
and not here is how this goes wrong.

Many of this chapter's questions ask the reader to invent, estimate or
explore. Each of those says what a correct answer must show, and gives one
worked instance under *answers will vary*.

---

## Opening

### Think and Reflect (before 3.1)

1. *Answers will vary.* Five uses: the price of vegetables, the time on a
   clock, a phone number, a bus route number, and a date on a calendar.
2. *Answers will vary.* The class list usually adds uses such as ages,
   house numbers, page numbers and cricket scores.

---

## 3.1 Numbers Can Tell Us Things

**Checking the rule on both lines.** Every number in Fig. 3.1 and Fig. 3.2
matches the rule: each child says how many of their neighbours are taller.
In Fig. 3.1, the third and fourth children both say 1, and the sixth child,
the shortest, says 2.

### Think and Reflect (after the rule)

1. **No.** Nobody is taller than the tallest child, so the tallest child
   always says 0.
2. **No.** Every neighbour of the shortest child is taller. In the middle
   of the line it says **2**; at an end it says **1**.
3. In Fig. 3.2 the **3rd and 6th** children say 2. **No:** a child who says
   2 is shorter than its two neighbours, but it need not be one of the
   shortest children in the whole line.

### Exercise Set 3.1

1. **No.** A child at the end of the line has only one neighbour, so the
   most it can say is 1.
2. **No.** In any two children standing side by side, the shorter one has a
   taller neighbour, so at least one child says 1 or more.
3. **Yes.** In Fig. 3.1 the third and fourth children stand next to each
   other and both say 1. (Two neighbours can never both say 0, or both
   say 2.)
4. **Yes.** Let the children stand in order of height, shortest first:
   heights 110, 120, 130, 140 and 150 cm give **1, 1, 1, 1, 0**. Each of
   the first four has a taller child on the right, and the tallest has
   none.
5. **No.** The tallest child has no taller neighbour, so someone always
   says 0.
6. **Yes.** Heights 150, 140, 110, 120 and 130 cm give **0, 1, 2, 1, 0**.
7. **Two** of them, at most. The children at the ends cannot say 2, and two
   children who stand side by side cannot both say 2, so only the 2nd and
   4th places work. Heights 150, 110, 140, 120 and 130 cm give
   **0, 2, 0, 2, 0**.

---

## 3.2 Supercells

**Fig. 3.3.** The coloured cells are the ones whose number is bigger than
the numbers in the cells next to them.

### Think and Reflect (after Example 1)

1. **80.** The new number must be bigger than both neighbours, 79 and 63.
   (79 then stops being a supercell.)
2. With 70 in place of 10 the row is 43, 79, 75, 63, 70, 29, 28, 34, and
   the supercells are **79, 70 and 34**.

### Exercise Set 3.2

1. The supercells in Fig. 3.4 are **6828, 9435 and 8000**.
2. *Answers will vary.* The second cell must be more than 5346, the third
   and fifth cells must be less than 1258, the ninth cell must be more than
   9635, and the other empty cells must each have a bigger neighbour. One
   table that works:
   **5346, 7000, 1000, 1258, 1100, 1200, 1300, 9635, 9800**.
3. *Answers will vary.* Put big numbers in cells 1, 3, 5, 7 and 9 and small
   numbers between them: **910, 110, 810, 210, 710, 310, 610, 410, 510**.
4. **5** of them: 910, 810, 710, 610 and 510.
5. The largest numbers of supercells are:

   | cells | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
   |---|---|---|---|---|---|---|---|---|
   | most supercells | 1 | 2 | 2 | 3 | 3 | 4 | 4 | 5 |

   **The pattern:** for an even number of cells, half the number of cells;
   for an odd number, half of one more than it, so 9 cells give 5.
   **The method:** put big numbers in the 1st, 3rd, 5th, … cells and small
   numbers between them. Two supercells can never stand side by side.
6. **No.** The cell with the largest number is bigger than every other
   number, so it is always a supercell.
7. **Yes**, the largest number is always in a supercell. **No**, the
   smallest number is never in one: it has at least one neighbour, and that
   neighbour is bigger.
8. *Answers will vary.* Put the second largest number next to the largest:
   **30, 90, 80, 10, 20**. Here 80 is not a supercell, because 90 is next
   to it.
9. **Yes, it is possible.** The second smallest number can be a supercell
   only if its one neighbour is the smallest number, so it must stand at an
   end. One table: **20, 10, 80, 90, 50**. Here 80 is not a supercell, and
   20 is.
10. *Answers will vary.*

### The grid in Fig. 3.7

The top-left cell is forced: it must be bigger than 96,301, and the only
number made from 1, 0, 6, 3 and 9 that is bigger is **96,310**. The empty
cells next to 10,963 must be smaller than it. *Answers will vary* for the
rest. One grid that works, row by row:

| | | | |
|---|---|---|---|
| 96,310 | 96,301 | 36,109 | 39,610 |
| 30,169 | 13,609 | 60,319 | 19,306 |
| 10,369 | 10,396 | 60,193 | 19,036 |
| 10,639 | 10,963 | 10,693 | 30,916 |

Its supercells are exactly the coloured cells: 96,310, 39,610, 60,319,
10,963 and 30,916.

### Think and Reflect (after Fig. 3.7)

For the grid above:

1. The biggest number is **96,310**. This is the same in every correct
   grid, because 96,310 is the largest number the five digits make.
2. The smallest even number is **10,396**.
3. The smallest number bigger than 50,000 is **60,193**.

---

## 3.3 Patterns of Numbers on the Number Line

**Fig. 3.8.** On a line marked every 1000, 1050 sits just after 1000 and
1500 halfway to 2000. 3050 is just after 3000, and 3600 a little past the
middle of 3000 and 4000. 5030 is just after 5000, and 5300 a little further
on. 8400 is a little before the middle of 8000 and 9000. 9590 is past the
middle of 9000 and 10,000, and 9950 almost at 10,000. 9950 and 9590 use the
same digits, but 9950 is 360 more.

### Think and Reflect (after the key idea)

1. Closest together: **5030 and 5300**, which are 270 apart. Furthest
   apart: **1050 and 9950**, which are 8900 apart.
2. 3050 lies between **3000 and 4000**. It is nearer to **3000**: it is
   50 from 3000 and 950 from 4000.

### Exercise Set 3.3

1. The ten marks, from left to right:
   - (a) the marks go up in 5s: **1990, 1995, 2000, 2005, 2010, 2015,
     2020, 2025, 2030, 2035**
   - (b) the marks go up in 1s: **9993, 9994, 9995, 9996, 9997, 9998,
     9999, 10,000, 10,001, 10,002**
   - (c) the marks go up in 1s: **15,077, 15,078, 15,079, 15,080, 15,081,
     15,082, 15,083, 15,084, 15,085, 15,086**
   - (d) the marks go up in 1000s: **83,705, 84,705, 85,705, 86,705,
     87,705, 88,705, 89,705, 90,705, 91,705, 92,705**
2. The smallest number is at the left end and the largest at the right end
   of each line:
   - (a) circle 1990, box 2035
   - (b) circle 9993, box 10,002
   - (c) circle 15,077, box 15,086
   - (d) circle 83,705, box 92,705

---

## 3.4 Playing with Digits

**Table 3.10.** There are **9** 1-digit numbers, **90** 2-digit numbers,
**900** 3-digit numbers, **9000** 4-digit numbers and **90,000** 5-digit
numbers. Each count is ten times the one before.

### Exercise Set 3.4

1. Numbers whose digit sum is 14:
   - (a) *Answers will vary:* 59, 95, 77, 149, 293, 1238, 5009.
   - (b) The smallest is **59**. A 1-digit number cannot reach 14, and a
     2-digit number is smallest when its tens digit is smallest, so the
     units digit is 9 and the tens digit is 5.
   - (c) The largest 5-digit number is **95,000**. Put as much as possible
     into the first digit, 9, and the rest, 5, into the next.
   - (d) **There is no largest.** Adding zeros at the end keeps the digit
     sum at 14: 95, 950, 9500, 95,000, and so on for ever.
2. The digit sums from 40 to 49 are 4 to 13; from 50 to 59 they are 5 to
   14; from 60 to 69 they are 6 to 15; and 70 has 7. **What you notice:**
   going up by 1 adds 1 to the digit sum, except when the tens digit
   changes. Then the digit sum drops by 8, as from 49 (13) to 50 (5).
3. The numbers are 123, 234, 345, 456, 567, 678 and 789, with digit sums
   **6, 9, 12, 15, 18, 21 and 24**. Each digit sum is 3 more than the one
   before. **The pattern stops at 789**, because there is no digit after 9.

### Think and Reflect (digit detectives)

1. From 1 to 100 the digit 7 appears **20** times: 10 times as a units
   digit (7, 17, …, 97) and 10 times as a tens digit (70 to 79). 77 counts
   twice.
2. From 1 to 1000 it appears **300** times: 100 times in each of the units,
   tens and hundreds places.

---

## 3.5 Pretty Palindromic Patterns

**Palindromes from 1, 2 and 3.** There are **9** of them: 111, 121, 131,
212, 222, 232, 313, 323 and 333. **How to be sure:** the first and last
digits must match, so a palindrome is fixed by its first two digits. There
are 3 choices for each, and $3 \times 3 = 9$.

### Think and Reflect (reverse and add)

1. Nobody knows whether such numbers exist. 196 is the smallest number that
   nobody has ever turned into a palindrome, but nobody has shown that it
   never will be.
2. **Yes.** Every 2-digit number reaches a palindrome. Most take one or two
   steps. 89 and 98 take the longest: **24 steps**.

### Puzzle time

The number is **12,421**, twelve thousand four hundred and twenty-one.
**Working:** it is odd, so its units digit is odd. The tens digit is double
the units digit, and the hundreds digit is double the tens digit, so the
hundreds digit is four times the units digit. That is a single digit only
when the units digit is 1 or 2, and 2 is not odd. So the units digit is 1,
the tens digit 2 and the hundreds digit 4. It is a palindrome, so it reads
1, 2, 4, 2, 1.

---

## 3.6 The Magic Number of Kaprekar

**Your own numbers.** *Answers will vary.* Every one reaches 6174. For
4321: $4321 - 1234 = 3087$, then $8730 - 0378 = 8352$, then
$8532 - 2358 = 6174$, which is 3 rounds.

**3-digit numbers.** They all end at **495**, which then repeats. For 321:
$321 - 123 = 198$, then $981 - 189 = 792$, $972 - 279 = 693$,
$963 - 369 = 594$ and $954 - 459 = 495$. After that, $954 - 459 = 495$
again.

### Think and Reflect (after the 3-digit numbers)

1. **5 rounds.** $1000 - 1 = 999$, read as 0999; then $9990 - 999 = 8991$,
   $9981 - 1899 = 8082$, $8820 - 288 = 8532$ and $8532 - 2358 = 6174$.
2. **Yes.** 2836 uses the same four digits as 6382, so every round has the
   same A and the same B. Both take **3 rounds**.

---

## 3.7 Clock and Calendar Numbers

### Think and Reflect

1. The times on a 12-hour clock:
   - **like 4:44** (every digit the same): 1:11, 2:22, 3:33, 4:44, 5:55 and
     11:11, which is **6** times;
   - **like 10:10** (hours and minutes the same): 10:10, 11:11 and 12:12.
     A clock that shows the hour with two digits also shows 01:01, 02:02,
     and so on up to 09:09;
   - **like 12:21** (the same from both ends): 1:01, 1:11, 1:21, …, 9:51,
     which is 6 times in each hour from 1 to 9, and then 10:01, 11:11 and
     12:21. That makes **57** times.
2. *Answers will vary.* The date's day and month, read together, must be
   the same four digits as the year. From 2001 to 2012 there is one each
   year: 20/01/2001, 20/02/2002, and so on up to 20/12/2012. There are
   **132** such dates from the year 1000 to 2026.
3. In the dates written as DD/MM/YYYY, the ones since 2000 are
   **10/02/2001, 20/02/2002, 01/02/2010, 11/02/2011, 21/02/2012,
   02/02/2020, 12/02/2021 and 22/02/2022**. There are **69** such dates
   from the year 1000 to 2026.
4. **Yes.** A year has 365 days, which is 52 weeks and 1 day, so each new
   year starts one day later in the week, or two days after a leap year.
   The days and dates line up again after 6, 11 or 28 years, depending on
   where the leap years fall. The calendar of 2026 comes back in **2037**.

### Exercise Set 3.5

1. The four digits can be chosen in many ways. *Answers will vary.* One
   choice for each:
   - (a) 9, 8, 1, 0: $9810 - 1089 = 8721$, more than 5085
   - (b) 4, 5, 6, 7: $7654 - 4567 = 3087$, less than 5085
   - (c) 9, 8, 7, 6: $9876 + 6789 = 16665$, more than 9779
   - (d) 1, 2, 3, 4: $4321 + 1234 = 5555$, less than 9779
2. The smallest 5-digit palindrome is 10,001 and the largest is 99,999.
   Their sum is $10001 + 99999 = 110000$, and their difference is
   $99999 - 10001 = 89998$.
3. The next palindromic time after 10:01 is 11:11, which is **70 minutes**
   away. The one after that is 12:21, which is **140 minutes** from 10:01.
4. **7 rounds:** $8653 - 3568 = 5085$, $8550 - 0558 = 7992$,
   $9972 - 2799 = 7173$, $7731 - 1377 = 6354$, $6543 - 3456 = 3087$,
   $8730 - 0378 = 8352$ and $8532 - 2358 = 6174$.

---

## 3.8 Mental Maths

**Fig. 3.14, the other side numbers.** *Answers will vary.* One way for
each:

- $28000 = 25000 + 1500 + 1500$
- $61600 = 60000 + 400 + 400 + 400 + 400$
- $31000 = 25000 + 1500 + 1500 + 1500 + 1500$
- $63000 = 60000 + 1500 + 1500$
- $19500 = 13000 + 1500 + 1500 + 1500 + 400 + 400 + 400 + 400 + 400$
- $20900 = 13000 + 1500 + 1500 + 1500 + 1500 + 1500 + 400$

### Think and Reflect (after Fig. 3.14)

1. **No.** Only 400 and 1,500 are smaller than 1,000. 400 twice is 800,
   400 three times is 1,200, and 1,500 alone is already too big, so 1,000
   is always missed.
2. *Answers will vary.* $14000 = 1500 + 1500 + 1500 + 1500 + 1500 + 1500 + 1500 + 1500 + 400 + 400 + 400 + 400 + 400$,
   $15000 = 13000 + 400 + 400 + 400 + 400 + 400$ and
   $16000 = 13000 + 1500 + 1500$.
3. **Only 1,000.** With 400s and 1,500s alone you can make 2,000, 3,000 and
   every larger thousand, so 1,000 is the only thousand that cannot be
   made.

### Adding and subtracting (Table 3.15)

*Answers will vary.* One way for each:

- $45000 = 40000 + 7000 - 1500 - 800 + 300$
- $5900 = 7000 - 800 - 300$
- $17500 = 12000 + 7000 - 1500$
- $21400 = 12000 + 7000 + 1500 + 300 + 300 + 300$

### Exercise Set 3.6

1. *Answers will vary* where an example exists.
   - (a) $50000 + 40300 = 90300$
   - (b) $99500 + 600 = 100100$, which is 1,00,100
   - (c) **Not possible.** The largest sum of two 4-digit numbers is
     $9999 + 9999 = 19998$, which has 5 digits.
   - (d) $60000 + 50000 = 110000$, which is 1,10,000
   - (e) **Not possible.** The smallest sum of two 5-digit numbers is
     $10000 + 10000 = 20000$, which is already more than 18,500.
   - (f) $60000 - 10000 = 50000$
   - (g) $10000 - 100 = 9900$
   - (h) $12000 - 5000 = 7000$
   - (i) $10500 - 10000 = 500$
   - (j) **Not possible.** The largest difference is
     $99999 - 10000 = 89999$, which is less than 91,500.
2. **No:** (c), (e) and (j) have no example, for the reasons given. In each
   case, the smallest or the largest possible answer already rules it out.
3. Always, sometimes or never:
   - (a) **Sometimes.** $10000 + 10000 = 20000$ has 5 digits, but
     $99999 + 99999 = 199998$ has 6.
   - (b) **Sometimes.** $1000 + 10 = 1010$ has 4 digits, but
     $9999 + 99 = 10098$ has 5.
   - (c) **Never.** The largest such sum, 10,098, has only 5 digits.
   - (d) **Sometimes.** $99999 - 10000 = 89999$ has 5 digits, but
     $10500 - 10000 = 500$ has 3.
   - (e) **Never.** The smallest such difference is
     $10000 - 99 = 9901$, which has 4 digits, and the largest is
     $99999 - 10 = 99989$, which has 5.

---

## 3.9 Playing with Number Patterns

The totals, and one quick way to find each:

| pattern | total | a quick way |
|---|---|---|
| (a) | **980** | three rows of four 40s and two rows of five 50s: $480 + 500 = 980$ |
| (b) | **144** | 64 faces, 20 of them showing 5 and 44 showing 1: $100 + 44 = 144$ |
| (c) | **2048** | 32 boxes of 32 and 16 boxes of 64: $1024 + 1024 = 2048$ |
| (d) | **123** | 35 faces, 17 showing 3 and 18 showing 4: $51 + 72 = 123$ |
| (e) | **1650** | 22 each of 15, 25 and 35: $22 \times 75 = 1650$ |
| (f) | **7250** | 1000, four 500s, eight 250s and eighteen 125s: $1000 + 2000 + 2000 + 2250 = 7250$ |

Pattern (f) has the largest total.

### Think and Reflect (after the key idea)

1. **Pattern (f)**, with 7250. Whether the guess was right will vary.
2. *Answers will vary.* Pattern (a) row by row is
   $3 \times 160 + 2 \times 250 = 480 + 500 = 980$; counted as twelve 40s
   and ten 50s it is again $480 + 500 = 980$. Both ways give the same total.

---

## 3.10 An Unsolved Mystery: the Collatz Conjecture

**The rule** is the one in the key idea: halve an even number; for an odd
number, multiply by 3 and add 1.

### Think and Reflect

1. *Answers will vary.* Every sequence reaches 1. For 7:
   7, 22, 11, 34, 17, 52, 26, 13, 40, 20, 10, 5, 16, 8, 4, 2, 1.
2. *Answers will vary.* A good answer says that every number anyone has
   tried reaches 1, and also that trying numbers does not show it for every
   number.

---

## 3.11 Simple Estimation

### Think and Reflect (after the key idea)

1. *Answers will vary.* The estimate is far out if the other classes are
   not like Class 6: for example, if Class 10 has only one section, or if
   each section of Classes 7 to 10 has 50 children.
2. *Answers will vary.* An exact number is needed for the change a shop
   gives back or for a phone number. An estimate is enough for the number
   of people at a fair.

### Exercise Set 3.7

*Answers will vary* throughout. A good answer shows how the estimate was
made.

1. For example, 12 steps to the door, 150 steps across the ground, 200
   steps to the gate, and $2000$ steps to a home 1 km away.
2. A person blinks about 15 times a minute, so about $15 \times 60 = 900$
   times an hour and about $900 \times 16 = 14400$ times in 16 waking
   hours. A person breathes about 15 times a minute, which is also about
   900 times an hour, and about $900 \times 24 = 21600$ times a day.
3. (a) *A few thousand:* the pages in a school library, the students in a
   large school. (b) *More than ten thousand:* the leaves on a big tree,
   the grains in a bag of rice.

### Exercise Set 3.8

*Answers will vary.* One reasonable answer each:

1. **More than 5000.** A book of 150 pages with about 250 words a page has
   about $150 \times 250 = 37500$ words.
2. It depends on the school. A good answer counts the buses and multiplies
   by the children a bus carries.
3. **No, it will cost more.** A litre of milk costs about ₹60 and enough
   fruit for 5 people about ₹150, which comes to about $60 + 150 = 210$
   rupees.
4. About **2200 km** in a straight line, and more by road.
5. **No.** A Class 6 student has had about 5 years of school, of about 220
   days, with about 6 hours a day. That is about
   $5 \times 220 \times 6 = 6600$ hours, about half of 13,000.
6. At about 4 km an hour:
   - (a) and (b) depend on where you live. A place 2 km away takes about
     half an hour.
   - (c) India is about 3200 km from north to south, so the walk takes
     about $3200 \div 4 = 800$ hours. Walking 8 hours a day, that is
     $800 \div 8 = 100$ days.
7. *Answers will vary.*

---

## 3.12 Games and Winning Strategies

### Think and Reflect (Game 1)

1. **The first player.**
2. The numbers **1, 5, 9, 13, 17 and 21**. Each is 4 more than the last,
   because whatever the other player adds, 1, 2 or 3, you can make the turn
   add up to 4. The first player says 1 at once.

**Game 2.** The winning numbers are **11, 22, 33, 44, 55, 66, 77, 88 and
99**. The first player must say a number from 1 to 10, so cannot say 11.
**The second player** can always win, by saying 11 and then the next
multiple of 11 each turn.

**Your own version.** *Answers will vary.* If a player may add 1 to 4 and
50 wins, make each pair of turns add up to 5. 50 is a multiple of 5, so the
second player wins by saying 5, 10, 15, and so on.

### Exercise Set 3.9

1. Swap the **6 and the 1 in 62,871**, to make **12,876**. Then 12,876 is
   smaller than all four of its neighbours, and the grid has 4 supercells:
   **39,344, 23,609, 45,306 and 50,319**. No other swap of two digits in
   one number gives 4 supercells.
2. *Answers will vary.* A student born in 2014 takes **7 rounds**:
   $4210 - 0124 = 4086$, $8640 - 0468 = 8172$, $8721 - 1278 = 7443$,
   $7443 - 3447 = 3996$, $9963 - 3699 = 6264$, $6642 - 2466 = 4176$ and
   $7641 - 1467 = 6174$. For 2013 it takes 3 rounds.
3. The largest is **73,999**, the smallest is **35,111**, and the one
   closest to 50,000 is **51,111**. It is 1,111 away, and the nearest one
   below 50,000, 39,999, is much further.
4. *Answers will vary.* About 52 Sundays, 20 festival days and 60 days of
   vacation make about $52 + 20 + 60 = 132$ days.
5. *Answers will vary.* A mug holds about half a litre, a bucket about 15
   to 20 litres, and an overhead tank about 500 to 1000 litres.
6. *Answers will vary.* $18000 + 335 + 335 = 18670$.
7. *Answers will vary.* For 300: three rows of four boxes, each box holding
   25, since $12 \times 25 = 300$.
8. Every power of 2 is even, and half of it is the power of 2 before it.
   So the sequence halves at every step, down to 1.
9. **Yes.** 100, 50, 25, 76, 38, 19, 58, 29, 88, 44, 22, 11, 34, 17, 52,
   26, 13, 40, 20, 10, 5, 16, 8, 4, 2, 1, which is **25 steps**.
10. **The first player wins** by saying **2**, and then 6, 10, 14, 18 and
    22. Each pair of turns adds up to 4, and 22 is 2 more than a multiple
    of 4.
11. The smallest is **10,008** and the largest is **90,000**.

---

## By the Book

Fifty questions in the order of NCERT's practice: very short answer (2
marks), short answer (3), long answer (5), assertion and reason (1),
case-based (4), objective (1). Written to BY-THE-BOOK.md, 26 September 2026.
The book's own key is in Beyond the Book's Answers stage; this is the same
key, set out in full.

### Very short answer

1. **57**, which is bigger than 42 and 31, and **90**, which is bigger than
   68 and 74. 42 and 74 are at the ends, and each has a bigger neighbour.
2. Just before: **5885**. Just after: **6006**.
3. $A = 9542$, $B = 2459$ and $C = 9542 - 2459 = 7083$.
4. 11, 34, 17, 52, 26, 13, 40, 20, 10, 5, 16, 8, 4, 2, 1: **14** steps.
5. The digits add up to 11 and differ by 3, so the units digit is
   $(11 - 3) \div 2 = 4$ and the tens digit is 7: **74**.
6. 9 one-digit numbers and 21 two-digit numbers (10 to 30):
   $9 + 21 \times 2 = 51$ digits.
7. $400 + 300 + 600 = 1300$. The exact sum is $412 + 289 + 596 = 1297$,
   which is **less**.
8. **9876**, and its digit sum is $9 + 8 + 7 + 6 = 30$.
9. Largest **97,310**; smallest **10,379**, because 0 cannot come first.
10. The gap is $4275 - 4250 = 25$, so the next marks are **4300** and
    **4325**.

### Short answer

11. $68 + 86 = 154$, $154 + 451 = 605$ and $605 + 506 = 1111$: **3** steps,
    reaching **1111**.
12. **22 and 30**. *Answers will vary* for the change: with 26 in place of
    12 the row is 15, 22, 18, 30, 25, 26, and 22, 30 and 26 are supercells.
13. Each of the two would have to be bigger than the other, which cannot
    happen. So supercells need at least one cell between them, and in 11
    cells the most is cells 1, 3, 5, 7, 9 and 11: **6**.
14. **1199**: every number from 1000 to 1198 has a digit sum of 19 or less,
    and $1 + 1 + 9 + 9 = 20$. The largest is **9920**.
15. Smallest $1000 - 999 = 1$; largest $9999 - 100 = 9899$. So the
    difference can have **1, 2, 3 or 4 digits**.
16. About $50 \times 20 = 1000$ rupees. Exact cost $48 \times 21 = 1008$
    rupees, which is **₹8** more than the estimate.
17. Before 10: **20**, because half of 20 is 10, and **3**, because
    $3 \times 3 + 1 = 10$. Before 3: **only 6**. An odd number always gives
    an even number next, so 3 can only come from halving 6.
18. $8730 - 378 = 8352$ and $8532 - 2358 = 6174$: **2 rounds**.
19. **Go second**, and say **4, 8, 12, 16 and 20**. Whatever the other
    player adds, 1, 2 or 3, add enough to make 4 in that turn. 20 is a
    multiple of 4, and the first player can never say 4.
20. 247, 274, 427, 472, 724 and 742. $742 + 247 = 989$.

### Long answer

21. Each cell is compared with the cells above, below, left and right. The
    supercells are **45, 51, 62 and 70**. The centre must be bigger than
    45, 51, 62 and 70, so the smallest whole number is **71**. Then 45, 51,
    62 and 70 each have the bigger centre beside them, and no corner is a
    supercell, so the grid has **1** supercell.
22. $9210 - 129 = 9081$, $9810 - 189 = 9621$, $9621 - 1269 = 8352$ and
    $8532 - 2358 = 6174$: **4 rounds**. The next round is
    $7641 - 1467 = 6174$ again.
23. The code reads 9 _ _ _ 9. The two 9s make 18, so the middle three digits
    add up to $25 - 18 = 7$; the 2nd and 4th digits are equal and the middle
    digit is odd. The codes are **90709, 91519, 92329 and 93139**. Largest
    **93,139**; smallest **90,709**.
24. *Answers will vary.* $5000 + 2000 + 300 + 50 + 50 + 50 = 7450$ and
    $5000 - 2000 + 300 + 300 + 50 = 3650$. 5000, 2000, 300 and 50 are all
    multiples of 50, so every answer is a multiple of 50 and ends in 00 or
    50. 125 is not a multiple of 50, so it cannot be made.
25. Estimate $200 + 200 + 200 + 300 = 900$. Exact total
    $187 + 212 + 196 + 318 = 913$. The library needs $1200 - 913 = 287$
    more books.
26. 15, 46, 23, 70, 35, 106, 53, 160, 80, 40, 20, 10, 5, 16, 8, 4, 2, 1:
    **17 steps**, and the largest number is **160**. 30 halves to 15, so it
    takes **18** steps, and 60 halves to 30, so it takes **19**.
27. Each pair of turns can be made to add up to 5, so the winning numbers
    are **5, 10, 15, 20 and 25**. 25 is a multiple of 5, so **go second**.
    For 27 the winning numbers are 2, 7, 12, 17, 22 and 27, so the first
    player says **2** first.
28. Pages 1 to 9 use 9 digits, 10 to 99 use $90 \times 2 = 180$, and 100 to
    150 use $51 \times 3 = 153$: $9 + 180 + 153 = 342$ digits. For the
    second book, $492 - 189 = 303 = 101 \times 3$, so it has
    $99 + 101 = 200$ pages.
29. 11 marks make 10 gaps, and $37500 - 36500 = 1000$, so each gap is
    **100**. The 4th mark is **36,800** and the 8th is **37,200**. 37,150
    lies between the **7th** mark (37,100) and the **8th** (37,200),
    halfway between them.
30. Five 40s in each of 3 rows and four 25s in each of 3 rows:
    $15 \times 40 + 12 \times 25 = 600 + 300 = 900$. Changing every 25 to
    50 adds $12 \times 25 = 300$, so the new total is **1200**.

### Assertion and reason

31 (a) · 32 (d) · 33 (b) · 34 (c) · 35 (a)

- 31. Both true, and the rule in R is why 9 is a supercell.
- 32. A is false: 5555 gives $5555 - 5555 = 0$ and never reaches 6174. R is
  true.
- 33. Both true, but a digit sum says nothing about reading the same from
  both ends.
- 34. A is true: 16, 8, 4, 2, 1. R is false: an odd number gives an even
  number next.
- 35. Both true, and R is the reason 500 is the largest.

### Case-based questions

36. (i) Hills **2, 4 and 6** (ii) $2010 - 980 = 1030$ m (iii) Hills **4
    and 6**. Hill 3, now 1600 m, is higher than hill 2 (1510 m) but lower
    than hill 4 (1730 m), so neither hill 2 nor hill 3 is a peak.
37. (i) **Yes**: $3 + 4 + 2 + 1 = 10$ (ii) **1009** (iii) **10**. From 1000
    to 1099 the number is 10 _ _, so the last two digits add up to 9: 09,
    18, 27, …, 90, which is 10 numbers. 1100 has digit sum 2.
38. (i) $120 + 100 + 100 + 90 = 410$ (ii) $118 + 96 + 104 + 89 = 407$
    (iii) $16 \times 24 = 384$ is too few and $17 \times 24 = 408$ is
    enough, so **17 packs**.
39. (i) $87 + 78 = 165$ (ii) **No**: 165 read from right to left is 561
    (iii) $165 + 561 = 726$, $726 + 627 = 1353$ and $1353 + 3531 = 4884$:
    **4 steps**, reaching **4884**.
40. (i) A = **5220** and B = **0225** (ii) $5220 - 225 = 4995$ (iii) 4995,
    5355, 1998, 8082, 8532, 6174: **6 rounds**.

### Objective questions

41 (c) · 42 (a) · 43 (d) · 44 (a) · 45 (c) · 46 (b) · 47 (d) · 48 (a) · 49 (b) · 50 (d)

- 41. $7 + 0 + 8 + 0 + 9 = 24$.
- 42. The end digits add up to $7 - 3 = 4$, so each is 2: 232.
- 43. The first two digits add up to 5; the largest first digit is 5: 5005.
  5500 and 9001 are not palindromes.
- 44. $5322 - 2235 = 3087$.
- 45. 28 is even: $28 \div 2 = 14$.
- 46. The marks are 50 apart: $600 - 50 = 550$.
- 47. To the nearest ten, $40 + 40 + 30 = 110$; the exact total is 109.
- 48. (i) is true, since both digits are the same. (ii) is false:
  $5000 - 4999 = 1$. (iii) is false: 212 is even.
- 49. $999 + 999 = 1998$ has 4 digits, so Farhan is wrong; but $234 + 512$
  is 746, and $100 + 100 = 200$ has 3 digits.
- 50. The winning numbers are 5 apart, so each turn adds from 1 up to 4.

---

## Beyond the Book

Organised by format since the maths-v2 conversion, 26 September 2026: the
tried-and-explained questions first, then five parts, each with two solved
examples and its practice questions. Beyond's example numbers are its own:
*Beyond Example 1* is not the chapter's Example 1 in §3.2.

### Tried and explained (no head in the book)

1. **4** supercells in 7 cells, for example 9, 1, 8, 2, 7, 3, 6.
2. **2** supercells in a 2 by 2 grid.
3. **5** two-digit numbers: 14, 23, 32, 41 and 50.
4. **90** three-digit palindromes: $9 \times 10 = 90$.
5. With 5555, $C = 5555 - 5555 = 0$, and every round after gives 0.
6. **9**, with 19 steps: 9, 28, 14, 7, and then 7's 16 steps.
7. **32 and 5**.
8. Say **4**: the winning numbers are 1, 4, 7 and 10.

### Solved examples

| Part | Example | Key |
|---|---|---|
| Single correct | 1 | (b) 6462 |
| | 2 | (a) 575 |
| More than one correct | 3 | (a), (c), (d) |
| | 4 | (a), (b), (d) |
| Numerical answer | 5 | 5 |
| | 6 | 245 |
| Matching | 7 | (c) P–3, Q–4, R–2, S–1 |
| | 8 | (b) P–4, Q–3, R–2, S–1 |
| Paragraph-based | 9 | (i) (b) 3; (ii) 6; (iii) 3 |
| | 10 | (i) (a) 132; (ii) 2; (iii) 2 |

### Practice

| Part | Questions | Key |
|---|---|---|
| Single correct | 1–4 | 1 (b) 91019 · 2 (c) 6 · 3 (d) 3 · 4 (a) 1300 |
| More than one correct | 5–8 | 5 (a), (c), (d) · 6 (a), (b), (c) · 7 (a), (b), (d) · 8 (b), (c) |
| Numerical answer | 9–11 | 9 **1027** · 10 **1850** · 11 **2** |
| Matching | 12–13 | 12 (a) · 13 (c) |
| Paragraph-based | 14–15 | 14 (i) (c) 3; (ii) 10; (iii) 16 · 15 (i) (b) 140 kg; (ii) 137; (iii) 1644 |

- Q1. The palindrome is 9 _ _ _ 9 with the 2nd and 4th digits equal:
  twice the 2nd digit plus the middle digit is $20 - 18 = 2$. So 91019 or
  90209, and 91019 is larger.
- Q2. 102, 111, 120, 201, 210 and 300: 6 numbers.
- Q3. 3, 10, 5, 16, 8, 4, 2, 1 is 7 steps. 6 takes 8, 12 takes 9 and 7
  takes 16.
- Q4. $700 + 300 + 300 = 1300$. 800, 1100 and 500 cannot be made.
- Q5. 58 is bigger than 31 and 44, 72 is bigger than 44 and 16, and 29 is
  bigger than its one neighbour, 16.
- Q6. 7641 and 1467 have the digits of 6174, and $7641 - 1467 = 6174$.
  8352 gives $8532 - 2358 = 6174$. 3087 gives $8730 - 378 = 8352$.
- Q7. 333, 1111 and 02122120 read the same both ways; 1212 does not.
- Q8. The smallest sum is $100 + 10 = 110$ and the largest is
  $999 + 99 = 1098$, so 3 or 4 digits.
- Q9. Start with 1 and 0. The other two digits are different and add up to
  9, and 2 and 7 give the smallest number: **1027**.
- Q10. 4 gaps make $1650 - 1450 = 200$, so each gap is 50. The 10th mark
  is $1650 + 4 \times 50 = 1850$.
- Q11. Each pair of turns can be made to add up to 6. The winning numbers
  are 50, 44, 38, 32, 26, 20, 14, 8 and 2, so Rohit says **2**.
- Q12. P: $9 \times 5 = 45$ (3). Q: 11, 22, …, 99, 9 of them (2). R:
  $7110 - 117 = 6993$ (4). S: $3 \times 15 + 1 = 46$ (1).
- Q13. P: 10001 (4). Q: 987 (3). R: 999 (1). S: 1001 (2).
- Q14. 24, 12, 6, 3, 10, 5, 16, 8, 4, 2, 1: the first odd number is 3, it
  takes 10 steps, and the largest number after 24 is 16.
- Q15. (i) $40 + 40 + 60 = 140$ kg (ii) $38 + 42 + 57 = 137$ kg (iii)
  $137 \times 12 = 1644$ rupees.
