# Class 10 · Mathematics I · Chapter 6 — Triangles

Every question this chapter sets, answered. This file is the source for the
volume's answers booklet (DESIGN-MATHS §5, *The companions*); the student
book prints none of it except Beyond the Book's own key.

Numbered by set — *Exercise Set 6.2, Q2* — so it can be used beside the book
without a contents page. **Every value below is re-derived by
`check-numbers.mjs` beside this file.** A question renumbered in the book and
not here is how this goes wrong.

A proof is set out one statement to a line, with its reason in brackets, as
Class 10 papers expect. Where a question gives a figure, the values used are
the ones printed on it.

---

## 6.2 Similar Figures

### The questions in the running text

- *Can a circle and a square be similar? Can a triangle and a square be
  similar? (Why?)* No. Similar figures have the same shape: a circle has no
  corners and a square has four; a triangle has three angles and a square
  has four, so no correspondence of angles is possible.
- *Are the photographs at ages 10 and 40 similar?* No — answered in the text:
  same size, different shape.
- *Fig. 6.5: check the four angles and the four ratios.* The angles are
  105°, 100°, 70° and 85° in both. The ratios are
  $\frac{1.5}{3.0} = \frac{2.5}{5.0} = \frac{2.4}{4.8} = \frac{2.1}{4.2} = \frac{1}{2}$.
- *Fig. 6.6*: all angles are right angles, but $\frac{3}{3.5}$ is not equal
  to $\frac{3}{3}$, so the square and the rectangle are not similar.
- *Remark (a polygon similar to a second, the second to a third).* The
  angles of the first equal those of the second, which equal those of the
  third; and if the sides are in the ratio $k$ and then $m$, the first and
  third are in the ratio $km$. So the first and third are similar.
- **Activity 1** should show that the angles of ABCD and A′B′C′D′ are equal
  and the four ratios $\frac{AB}{A'B'}$, … are equal (up to measuring error).

### Exercise Set 6.1

1. - (i) similar
   - (ii) similar
   - (iii) equilateral
   - (iv) (a) equal, (b) proportional

2. Answers will vary. One worked instance:
   - (i) two circles of radii 2 cm and 5 cm; two squares of sides 2 cm and
     5 cm.
   - (ii) a square of side 3 cm and a rectangle 3 cm by 5 cm (equal angles,
     sides not in proportion); a triangle and a square (different numbers of
     sides).

3. **Not similar.** The rhombus PQRS has every side 1.5 cm and the square
   ABCD every side 3 cm, so the sides are in one ratio,
   $\frac{1.5}{3} = \frac{1}{2}$. But the square's angles are all 90° and the
   rhombus has no right angle, so the corresponding angles are not equal.

---

## 6.3 Similarity of Triangles

### The questions in the running text

- **Activity 2.** With AP = PQ = QD = DR = RB, $\frac{AD}{DB} = \frac{3}{2}$;
  measuring should give $\frac{AE}{EC} = \frac{3}{2}$ too.
- **Activity 3.** $\frac{AB_1}{B_1B} = \frac{1}{4}$, $\frac{AB_2}{B_2B} = \frac{2}{3}$,
  $\frac{AB_3}{B_3B} = \frac{3}{2}$, $\frac{AB_4}{B_4B} = \frac{4}{1}$, and the
  same on AY; each $B_iC_i$ should be seen to be parallel to BC.
- **Proof of Theorem 6.2, the (Why?) steps.**
  - $\frac{AD}{DB} = \frac{AE'}{E'C}$ — by Theorem 6.1, since $DE' \parallel BC$.
  - $\frac{AE}{EC} = \frac{AE'}{E'C}$ — both are equal to $\frac{AD}{DB}$ (the
    given ratio, and the line above).
  - Adding 1: $\frac{AE + EC}{EC} = \frac{AE' + E'C}{E'C}$, that is,
    $\frac{AC}{EC} = \frac{AC}{E'C}$, so $EC = E'C$. E and E′ are on AC at
    the same distance from C, so they are the same point — and DE is DE′,
    which is parallel to BC.

### Exercise Set 6.2

1. - (i) $\frac{AD}{DB} = \frac{AE}{EC}$ (Theorem 6.1), so
     $\frac{1.5}{3} = \frac{1}{EC}$ and **EC = 2 cm**.
   - (ii) $\frac{AD}{DB} = \frac{AE}{EC}$, so $\frac{AD}{7.2} = \frac{1.8}{5.4}$
     and **AD = 2.4 cm**.

2. - (i) $\frac{PE}{EQ} = \frac{3.9}{3} = 1.3$ and $\frac{PF}{FR} = \frac{3.6}{2.4} = 1.5$.
     The ratios differ, so **EF is not parallel to QR** (if it were,
     Theorem 6.1 would make them equal).
   - (ii) $\frac{PE}{QE} = \frac{4}{4.5} = \frac{8}{9}$ and $\frac{PF}{RF} = \frac{8}{9}$.
     **EF ∥ QR** (Theorem 6.2).
   - (iii) EQ = 1.28 − 0.18 = 1.10 cm and FR = 2.56 − 0.36 = 2.20 cm.
     $\frac{PE}{EQ} = \frac{0.18}{1.10} = \frac{9}{55}$ and $\frac{PF}{FR} = \frac{0.36}{2.20} = \frac{9}{55}$.
     **EF ∥ QR** (Theorem 6.2).

3. - In △ABC, LM ∥ CB, so $\frac{AM}{AB} = \frac{AL}{AC}$. (Example 1)
   - In △ADC, LN ∥ CD, so $\frac{AN}{AD} = \frac{AL}{AC}$. (Example 1)
   - So $\frac{AM}{AB} = \frac{AN}{AD}$. (both equal $\frac{AL}{AC}$)

4. - In △ABC, DE ∥ AC, so $\frac{BD}{DA} = \frac{BE}{EC}$. (Theorem 6.1)
   - In △ABE, DF ∥ AE, so $\frac{BD}{DA} = \frac{BF}{FE}$. (Theorem 6.1)
   - So $\frac{BF}{FE} = \frac{BE}{EC}$. (both equal $\frac{BD}{DA}$)

5. - In △POQ, DE ∥ OQ, so $\frac{PE}{EQ} = \frac{PD}{DO}$. (Theorem 6.1)
   - In △POR, DF ∥ OR, so $\frac{PF}{FR} = \frac{PD}{DO}$. (Theorem 6.1)
   - So $\frac{PE}{EQ} = \frac{PF}{FR}$.
   - In △PQR, E and F divide PQ and PR in the same ratio, so EF ∥ QR.
     (Theorem 6.2)

6. - In △OPQ, AB ∥ PQ, so $\frac{OA}{AP} = \frac{OB}{BQ}$. (Theorem 6.1)
   - In △OPR, AC ∥ PR, so $\frac{OA}{AP} = \frac{OC}{CR}$. (Theorem 6.1)
   - So $\frac{OB}{BQ} = \frac{OC}{CR}$.
   - In △OQR, B and C divide OQ and OR in the same ratio, so BC ∥ QR.
     (Theorem 6.2)

7. Let D be the mid-point of AB in △ABC, and let the line through D
   parallel to BC meet AC at E.
   - $\frac{AD}{DB} = \frac{AE}{EC}$. (Theorem 6.1)
   - AD = DB, so $\frac{AD}{DB} = 1$. (D is the mid-point)
   - So $\frac{AE}{EC} = 1$, AE = EC, and E is the mid-point of AC.

8. Let D and E be the mid-points of AB and AC in △ABC.
   - AD = DB and AE = EC. (mid-points)
   - So $\frac{AD}{DB} = 1 = \frac{AE}{EC}$.
   - DE divides AB and AC in the same ratio, so DE ∥ BC. (Theorem 6.2)

9. Draw OE ∥ AB, with E on AD. Then OE ∥ DC too (both parallel to AB).
   - In △ADC, OE ∥ DC, so $\frac{AE}{ED} = \frac{AO}{OC}$. (Theorem 6.1)
   - In △DAB, OE ∥ AB, so $\frac{AE}{ED} = \frac{BO}{OD}$. (Theorem 6.1)
   - So $\frac{AO}{OC} = \frac{BO}{OD}$, and rearranging,
     $\frac{AO}{BO} = \frac{CO}{DO}$.

10. Draw OE ∥ AB, with E on AD.
    - In △DAB, OE ∥ AB, so $\frac{AE}{ED} = \frac{BO}{OD}$. (Theorem 6.1)
    - Given $\frac{AO}{BO} = \frac{CO}{DO}$, so $\frac{AO}{OC} = \frac{BO}{OD}$.
    - So $\frac{AE}{ED} = \frac{AO}{OC}$.
    - In △ADC, E and O divide AD and AC in the same ratio, so EO ∥ DC.
      (Theorem 6.2)
    - AB ∥ OE and OE ∥ DC, so AB ∥ DC, and ABCD is a trapezium.

---

## 6.4 Criteria for Similarity of Triangles

### The questions in the running text

- **Activity 4.** $\frac{BC}{EF} = \frac{3}{5} = 0.6$; the measured
  $\frac{AB}{DE}$ and $\frac{CA}{FD}$ should also be about 0.6. (With angles
  60° and 40°, AB ≈ 1.96 cm, CA ≈ 2.64 cm, DE ≈ 3.26 cm, FD ≈ 4.40 cm.)
- **Proof of Theorem 6.3, the (Why?) and (How?) steps.**
  - △ABC ≅ △DPQ — SAS congruence: AB = DP, ∠A = ∠D, AC = DQ.
  - ∠B = ∠P (congruent triangles) and ∠B = ∠E (given), so ∠P = ∠E; these
    are corresponding angles for PQ and EF, so PQ ∥ EF.
  - $\frac{DP}{PE} = \frac{DQ}{QF}$ — Theorem 6.1 in △DEF.
  - So $\frac{DP}{DE} = \frac{DQ}{DF}$ (adding 1 and inverting, as in
    Example 1), and with DP = AB and DQ = AC this is
    $\frac{AB}{DE} = \frac{AC}{DF}$.
- **Activity 5.** Each ratio is $\frac{3}{4.5} = \frac{6}{9} = \frac{8}{12} = \frac{2}{3}$;
  the measured angles should show ∠A = ∠D, ∠B = ∠E, ∠C = ∠F.
- **Proof of Theorem 6.4, the (Why?) and (How?) steps.**
  - $\frac{DP}{PE} = \frac{DQ}{QF}$: DP = AB, DQ = AC and
    $\frac{AB}{DE} = \frac{AC}{DF}$ give $\frac{DP}{DE} = \frac{DQ}{DF}$, and
    so $\frac{DP}{PE} = \frac{DQ}{QF}$; then PQ ∥ EF by Theorem 6.2.
  - $\frac{DP}{DE} = \frac{DQ}{DF} = \frac{BC}{EF}$ — DP = AB, DQ = AC, and
    the given ratios.
  - BC = PQ — from $\frac{PQ}{EF} = \frac{BC}{EF}$.
  - △ABC ≅ △DPQ — SSS congruence (AB = DP, AC = DQ, BC = PQ).
  - ∠A = ∠D, ∠B = ∠P = ∠E, ∠C = ∠Q = ∠F — congruent triangles, then
    corresponding angles of the parallels PQ and EF.
- **Activity 6.** $\frac{AB}{DE} = \frac{AC}{DF} = \frac{2}{3}$; measuring
  should give ∠B = ∠E and ∠C = ∠F.
- **Proof of Theorem 6.5, the (How?) and (Why?) steps.**
  - △ABC ≅ △DPQ by SAS (AB = DP, ∠A = ∠D, AC = DQ). Also
    $\frac{DP}{DE} = \frac{DQ}{DF}$, so PQ ∥ EF by Theorem 6.2.
  - So ∠B = ∠P = ∠E and ∠C = ∠Q = ∠F, and △ABC ~ △DEF by AAA.

### Exercise Set 6.3

1. The measures used are the ones marked on Fig. 6.34.
   - (i) **Similar**, AAA: ∠A = ∠P = 60°, ∠B = ∠Q = 80°, ∠C = ∠R = 40°.
     **△ABC ~ △PQR**.
   - (ii) **Similar**, SSS: $\frac{AB}{QR} = \frac{2}{4}$,
     $\frac{BC}{RP} = \frac{2.5}{5}$, $\frac{CA}{PQ} = \frac{3}{6}$, each
     $\frac{1}{2}$. **△ABC ~ △QRP**.
   - (iii) **Not similar**: $\frac{MP}{DE} = \frac{2}{4} = \frac{1}{2}$ and
     $\frac{PL}{FD} = \frac{3}{6} = \frac{1}{2}$, but
     $\frac{LM}{EF} = \frac{2.7}{5} = 0.54$.
   - (iv) **Similar**, SAS: $\frac{MN}{QP} = \frac{2.5}{5}$ and
     $\frac{ML}{QR} = \frac{5}{10}$, each $\frac{1}{2}$, and the included
     angles ∠M = ∠Q = 70°. **△MNL ~ △QPR**.
   - (v) **Not shown similar.** In △ABC the 80° angle is at A, but the
     marked sides are AB and BC, which include ∠B. SAS needs the angle
     between the two sides, so the marked measures do not give similarity.
   - (vi) **Similar**, AA: in △DEF, ∠F = 180° − 70° − 80° = 30°; in △PQR,
     ∠P = 180° − 80° − 30° = 70°. So ∠D = ∠P, ∠E = ∠Q, ∠F = ∠R.
     **△DEF ~ △PQR**.

2. From Fig. 6.35:
   - ∠DOC = 180° − 125° = **55°**. (DOB is a straight line; linear pair)
   - ∠DCO = 180° − 70° − 55° = **55°**. (angle sum in △ODC)
   - △ODC ~ △OBA matches D with B and C with A, so
     ∠OAB = ∠OCD = **55°**. (corresponding angles of similar triangles)

3. - ∠OAB = ∠OCD and ∠OBA = ∠ODC. (alternate angles, AB ∥ DC)
   - △OAB ~ △OCD. (AA)
   - So $\frac{OA}{OC} = \frac{OB}{OD}$. (corresponding sides)

4. From Fig. 6.36 (∠1 at Q, ∠2 = ∠PRQ at R):
   - ∠1 = ∠2, so PQ = PR. (sides opposite equal angles in △PQR)
   - $\frac{QR}{QS} = \frac{QT}{PR}$ (given), so $\frac{QR}{QS} = \frac{QT}{PQ}$,
     that is, $\frac{QS}{QR} = \frac{QP}{QT}$.
   - ∠SQP = ∠RQT = ∠1. (the same angle)
   - △PQS ~ △TQR. (SAS)

5. - ∠RPQ = ∠RTS. (given)
   - ∠PRQ = ∠TRS. (the same angle, ∠R)
   - △RPQ ~ △RTS. (AA)

6. - △ABE ≅ △ACD, so AB = AC and AE = AD. (corresponding parts)
   - So $\frac{AD}{AB} = \frac{AE}{AC}$.
   - ∠DAE = ∠BAC. (the same angle)
   - △ADE ~ △ABC. (SAS)

7. From Fig. 6.38 (right angles at D and E):
   - (i) ∠AEP = ∠CDP = 90° and ∠APE = ∠CPD (vertically opposite), so
     △AEP ~ △CDP (AA).
   - (ii) ∠ADB = ∠CEB = 90° and ∠B is common, so △ABD ~ △CBE (AA).
   - (iii) ∠AEP = ∠ADB = 90° and ∠PAE = ∠BAD (the same angle), so
     △AEP ~ △ADB (AA).
   - (iv) ∠PDC = ∠BEC = 90° and ∠C is common, so △PDC ~ △BEC (AA).

8. The figure must show parallelogram ABCD, AD produced beyond D to E, and
   BE crossing CD at F.
   - ∠BAE = ∠FCB. (opposite angles of a parallelogram: ∠A = ∠C)
   - ∠AEB = ∠CBF. (alternate angles, AE ∥ BC)
   - △ABE ~ △CFB. (AA)

9. From Fig. 6.39:
   - (i) ∠ABC = ∠AMP = 90° and ∠A is common, so △ABC ~ △AMP (AA).
   - (ii) So $\frac{CA}{PA} = \frac{BC}{MP}$. (corresponding sides)

10. - △ABC ~ △FEG, so ∠A = ∠F, ∠B = ∠E and ∠ACB = ∠FGE.
    - ∠ACD = ½∠ACB = ½∠FGE = ∠FGH, and likewise ∠DCB = ∠HGE. (bisectors)
    - (i) and (iii): in △DCA and △HGF, ∠A = ∠F and ∠ACD = ∠FGH, so
      △DCA ~ △HGF (AA), and $\frac{CD}{GH} = \frac{AC}{FG}$.
    - (ii): in △DCB and △HGE, ∠B = ∠E and ∠DCB = ∠HGE, so △DCB ~ △HGE (AA).

11. From Fig. 6.40:
    - AB = AC, so ∠ABC = ∠ACB. (isosceles triangle)
    - ∠ABD = ∠ECF. (the same angles, since D is on BC and E on CB produced)
    - ∠ADB = ∠EFC = 90°. (given perpendiculars)
    - △ABD ~ △ECF. (AA)

12. D and M are the mid-points of BC and QR (Fig. 6.41).
    - $\frac{AB}{PQ} = \frac{BC}{QR} = \frac{AD}{PM}$ (given), and BD = ½BC,
      QM = ½QR, so $\frac{BD}{QM} = \frac{BC}{QR}$.
    - $\frac{AB}{PQ} = \frac{BD}{QM} = \frac{AD}{PM}$, so △ABD ~ △PQM. (SSS)
    - So ∠B = ∠Q. (corresponding angles)
    - $\frac{AB}{PQ} = \frac{BC}{QR}$ and ∠B = ∠Q, so △ABC ~ △PQR. (SAS)

13. The figure must show △ABC with D on BC and ∠ADC marked equal to ∠BAC.
    - ∠ADC = ∠BAC. (given)
    - ∠ACD = ∠BCA. (the same angle)
    - △ADC ~ △BAC. (AA; A ↔ B, D ↔ A, C ↔ C)
    - $\frac{CA}{CB} = \frac{CD}{CA}$. (corresponding sides)
    - So $CA^2 = CB \cdot CD$.

14. The figure must show both triangles with medians AD and PM, and
    $\frac{AB}{PQ} = \frac{AC}{PR} = \frac{AD}{PM}$ marked.
    - Produce AD to E with DE = AD, and PM to L with ML = PM. Join BE, CE,
      QL, RL. ABEC and PQLR are parallelograms (diagonals bisect each
      other), so BE = AC and QL = PR.
    - $\frac{AB}{PQ} = \frac{BE}{QL} = \frac{AE}{PL}$ (AE = 2AD, PL = 2PM), so
      △ABE ~ △PQL (SSS) and ∠BAE = ∠QPL.
    - In the same way △ACE ~ △PRL, so ∠CAE = ∠RPL.
    - Adding, ∠BAC = ∠QPR.
    - $\frac{AB}{PQ} = \frac{AC}{PR}$ and ∠A = ∠P, so △ABC ~ △PQR. (SAS)

15. The figure must show the pole and its shadow, and the tower and its
    shadow, as two right triangles.
    - The sun's rays make the same angle with the ground, and both stand
      upright, so the two triangles are similar. (AA)
    - $\frac{h}{28} = \frac{6}{4}$, so **h = 42 m**.

16. The figure must show both triangles, the mid-points D and M, and the
    medians AD and PM.
    - △ABC ~ △PQR, so $\frac{AB}{PQ} = \frac{BC}{QR}$ and ∠B = ∠Q.
    - $\frac{BD}{QM} = \frac{\frac{1}{2}BC}{\frac{1}{2}QR} = \frac{BC}{QR}$.
    - So $\frac{AB}{PQ} = \frac{BD}{QM}$ with ∠B = ∠Q, and △ABD ~ △PQM. (SAS)
    - So $\frac{AB}{PQ} = \frac{AD}{PM}$. (corresponding sides)

### The worked examples

Each is answered in its own panel: Example 5, ∠P = 40°; Example 7, the
shadow is 1.6 m.

---

## Beyond the Book

### Stage 1 · Using What You Know

Each of the five questions is answered in the running text that follows it
on the page: (1) $x = 4$; (2) $AP^2 = PQ \cdot PR$, since △APD ~ △RPB and
△QPD ~ △APB both give the ratio $\frac{DP}{PB}$; (3) ST ∥ QR and ST = 6 cm;
(4) yes, every such triangle has angles 45°, 45° and 90°; (5) the flagpole is
30 m tall, with a shadow 40 m long.

### Stage 2 · Solved Examples

The 24 September 2026 examples, in examination formats. Each is worked in full on
its page; these are the keys.

1. (a) 6 cm *(single correct)*
2. (b) 12 cm *(single correct)*
3. (c) $3 : 5$ *(single correct)*
4. (d) 30 m *(single correct)*
5. (a) $DE \parallel BC$ *(single correct)*
6. (b) $60^\circ$ *(single correct)*
7. (a), (b), (d) *(multiple correct)*
8. (a), (b), (c) *(multiple correct)*
9. (a), (b), (d) *(multiple correct)*
10. (a), (b), (c) *(multiple correct)*
11. 3.6 *(numerical answer)*
12. 42 *(numerical answer)*
13. 12 *(numerical answer)*
14. (b) P–3, Q–4, R–1, S–2 *(matching)*
15. (c) P–4, Q–1, R–2, S–3 *(matching)*

### Stage 3 · Practice

Multiple choice and assertion–reason, as the key prints it:
1 (b), 2 (c), 3 (a), 4 (d), 5 (b), 6 (c), 7 (a), 8 (d), 9 (b), 10 (c),
11 (d), 12 (b), 13 (c), 14 (a), 15 (c), 16 (d), 17 (b).

The working for each:

1. $\frac{AD}{DB} = \frac{AE}{EC}$, so $\frac{2}{3} = \frac{4}{EC}$ and EC = 6 cm.
2. The order ABC ↔ DEF pairs AB with DE and CA with FD.
3. $\frac{EF}{BC} = \frac{4.5}{3} = 1.5$, so EF = 7.5 cm.
4. The third angles are 80° and 40°, so both have 40°, 60°, 80°: similar (AA).
5. $\frac{h}{10} = \frac{3}{2}$, so h = 15 m.
6. By the mid-point theorem, DE = ½BC = 5 cm.
7. $\frac{2}{3} = \frac{4}{6}$, so ST ∥ QR, and ST = $\frac{2}{5}$ QR.
8. $\frac{DE}{6} = \frac{36}{24}$, so DE = 9 cm.
9. $\frac{7}{15}$ is not $\frac{1}{2}$, so only Lata is right.
10. $\frac{3 + x}{x} = 3$, so x = 1.5 m.
11. △ADE ~ △ABC, so $\frac{DE}{20} = \frac{3}{10}$ and DE = 6 cm.
12. SAS; DF = $\frac{3}{2} \times 8$ = 12 cm.
13. All right triangles are similar is false (45°–45° against 30°–60°).
14. (a) R gives the third angles equal, which is why AA works.
15. (c) A is true by SSS, with ratio 2; R is false.
16. (d) A is false (2 cm by 3 cm against 2 cm by 5 cm); R is true.
17. (b) A is true by Theorem 6.1; R is true but is about angles.
18. ∠B = ∠Q = 75°, so ∠C = 180° − 45° − 75° = 60°.
19. EC = $\frac{2.1 \times 5.4}{1.8}$ = 6.3 cm.
20. Scale factor 3; sides 15, 21 and 27 cm; perimeter 63 cm.
21. 6 × 50000 = 300000 cm = 3 km.
22. EQ = 3.5 cm and FR = 5 cm; both ratios are 0.6, so EF ∥ QR (Theorem 6.2).
23. Both ratios are $\frac{1}{2}$, so PQ ∥ BC; △APQ ~ △ABC, and
    PQ = $\frac{3}{9} \times 12$ = 4 cm.
24. - △ABC ~ △DEF, so $\frac{AB}{DE} = \frac{BC}{EF} = \frac{CA}{FD} = k$.
    - AB = k·DE, BC = k·EF, CA = k·FD.
    - Adding, AB + BC + CA = k(DE + EF + FD).
    - So the ratio of the perimeters is k, the ratio of the sides.
25. $\frac{h}{5.5} = \frac{1.2}{1.5}$, so h = 4.4 m.
26. The figure must show parallelogram ABCD, M the mid-point of CD, the
    diagonal AC, AD produced to E, and BME crossing AC at L.
    - In △BMC and △EMD: CM = DM (M is the mid-point); ∠BMC = ∠EMD
      (vertically opposite); ∠BCM = ∠EDM (alternate angles, BC ∥ AE).
    - △BMC ≅ △EMD (ASA), so BC = DE.
    - AD = BC (parallelogram), so AE = AD + DE = 2BC.
    - In △ALE and △CLB: ∠ALE = ∠CLB (vertically opposite); ∠LAE = ∠LCB
      (alternate angles, AE ∥ BC).
    - △ALE ~ △CLB (AA), so $\frac{EL}{BL} = \frac{AE}{CB} = 2$.
    - So EL = 2BL.
27. (a) ∠ADE = ∠ABC and ∠AED = ∠ACB (corresponding angles), so
    △ADE ~ △ABC (AA) and $\frac{DE}{BC} = \frac{AD}{AB}$.
    (b) AB = 7.5 cm and $\frac{AD}{AB} = \frac{1}{3}$, so BC = 9 cm and AC = 6 cm.
    (c) 1 : 3.
28. - ∠B = ∠Q. (similar triangles)
    - ∠ADB = ∠PMQ = 90°. (altitudes)
    - △ABD ~ △PQM. (AA)
    - So $\frac{AB}{PQ} = \frac{AD}{PM}$.
29. (a) AA: a right angle at the ground in each, and the sun's rays at the
    same angle (b) tree 9 m (c) building 22.5 m (d) shadow 2.4 m.
30. (a) AA: a right angle at the ground in each, and the angle at A is
    common (b) P 0.3 m, Q 0.6 m (c) 4.5 m.
