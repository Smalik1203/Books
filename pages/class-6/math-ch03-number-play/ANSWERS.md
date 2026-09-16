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

**Table 3.1.** There are **9** 1-digit numbers, **90** 2-digit numbers,
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

**Fig. 3.12, the other side numbers.** *Answers will vary.* One way for
each:

- $28000 = 25000 + 1500 + 1500$
- $61600 = 60000 + 400 + 400 + 400 + 400$
- $31000 = 25000 + 1500 + 1500 + 1500 + 1500$
- $63000 = 60000 + 1500 + 1500$
- $19500 = 13000 + 1500 + 1500 + 1500 + 400 + 400 + 400 + 400 + 400$
- $20900 = 13000 + 1500 + 1500 + 1500 + 1500 + 1500 + 400$

### Think and Reflect (after Fig. 3.12)

1. **No.** Only 400 and 1,500 are smaller than 1,000. 400 twice is 800,
   400 three times is 1,200, and 1,500 alone is already too big, so 1,000
   is always missed.
2. *Answers will vary.* $14000 = 1500 + 1500 + 1500 + 1500 + 1500 + 1500 + 1500 + 1500 + 400 + 400 + 400 + 400 + 400$,
   $15000 = 13000 + 400 + 400 + 400 + 400 + 400$ and
   $16000 = 13000 + 1500 + 1500$.
3. **Only 1,000.** With 400s and 1,500s alone you can make 2,000, 3,000 and
   every larger thousand, so 1,000 is the only thousand that cannot be
   made.

### Adding and subtracting (Table 3.3)

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

## Beyond the Book

### Stage 1 · Using What You Know

Each question is answered in the running text beneath it. The values are
re-derived by the script: 4 and 1 supercells in 7 cells, 2 in a 2 by 2
grid, 5 numbers with digit sum 5, 90 palindromes, 19 Collatz steps from 9,
and 5 and 32 in exactly 5 steps.

### Stage 2 · Solved Examples

Beyond the Book numbers its examples from 1 again, as every Class 7
chapter does; the chapter body keeps its own Examples 1 to 4. The book
prints the working; these are the answers, as its Answer rows give them.

1. 1, 0, 2, 0, 1, 1
2. 7
3. The 1st, 3rd or 5th child could be the tallest, and the 2nd or 4th the shortest
4. 9, 8, 7 and 6
5. 43, 44, 45, and so on up to 56: fourteen numbers
6. 6789
7. $9 + 180 + 3 = 192$ digits
8. 4 steps, ending at 4884
9. 6336, and $6 + 3 + 3 + 6 = 18$
10. 5 rounds
11. $26{,}900 = 10{,}000 + 10{,}000 + 2{,}500 + 2{,}500 + 2{,}500 - 600$
12. $750 + 50 = 800$
13. 10 steps from 24, and 11 steps from 48
14. About 1400 people
15. The first player, by saying 4, 10, 16, 22, 28, 34 and 40

### Stage 3 · Practice

**Key.** 1 (b), 2 (c), 3 (a), 4 (d), 5 (b), 6 (a), 7 (c), 8 (b), 9 (d),
10 (a), 11 (c), 12 (d), 13 (a), 14 (d), 15 (b), 16 (c).

**Working for the options.**

1. $4 + 0 + 9 + 6 = 19$.
2. 12321 reads the same from both ends; 1231, 4545 and 1223 do not.
3. $57 + 75 = 132$, then $132 + 231 = 363$.
4. 5 is odd, so the next number is $3 \times 5 + 1 = 16$.
5. The end digits add up to $12 - 6 = 6$, so each is 3: 363. 606 and 444
   have the wrong middle digit, and 336 is not a palindrome.
6. 2332 is a palindrome and $2 + 3 + 3 + 2 = 10$. 4224 is a palindrome with
   digit sum 12. 5050 and 1234 are not palindromes.
7. 2037. 2032 also starts on a Thursday, but it is a leap year.
8. 5. No two supercells stand side by side, and the four corners and the
   centre are the most cells with no two side by side. The grid 9, 1, 8 and
   2, 7, 3 and 6, 4, 5 has 5 supercells.
9. There are 4 equal gaps from 3,400 to 3,600, each of
   $200 \div 4 = 50$, so the first mark is 3,450.
10. 6. Each pair of neighbours adds 1, and 7 children make 6 pairs.
11. $300 \times 20 = 6000$.
12. 500. It is smaller than 800 and 5,000, and 300 alone gives 300 and 600.
    The others are $5000 + 800 + 300 = 6100$, $800 + 800 + 300 = 1900$ and
    $5000 + 300 + 300 = 5600$.
13. Both true; the largest number is bigger than its neighbours, so R
    explains A.
14. A is false: 6174 read backwards is 4716. R is true:
    $7641 - 1467 = 6174$.
15. Both true, but a digit sum says nothing about being a palindrome.
16. A is true, because 5 children make 4 pairs. R is false: the tallest
    child says 0.

**The other answers**, as printed in the book:

17. 5005
18. 510
19. 22 and 11
20. $4311 - 1134 = 3177$
21. 9
22. 1
23. 65 to 70, and 72 to 99
24. $2000 + 2000 - 500 - 70 - 70 = 3360$ (answers will vary)
25. about ₹2000; exact $38 \times 49 = 1862$, which is less
26. (a) 15, 46, 23, 70, 35, 106, 53, 160, 80, 40, 20, 10, 5, 16, 8, 4, 2, 1
    (b) 17 (c) 160 (d) 18
27. (a) 5 (b) 2, 7, 12, 17, 22, 27, 32 (c) first (d) second
28. (a) 91 (b) 9 (c) no
29. (a) 115 (b) about 340 (c) 330 (d) 8 buses
30. (a) hills 2, 4 and 6 (b) hill 5 (c) 1030 m (d) hills 4 and 6
