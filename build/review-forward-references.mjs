import fs from 'node:fs';
const audit=JSON.parse(fs.readFileSync('build/forward-reference-audit.json','utf8'));
const rows=[...new Map(audit.forward.map(x=>[x.source+'|'+x.reference,x])).values()];
// Editorial assessments of the current source context, not inferred from keywords.
const notes=`Introduces the collection; the figures are together on the following page. No task is interrupted.
Same introductory sentence and collection as Figures 1.7–1.9.
Same introductory sentence and collection as Figures 1.7 and 1.9–1.10.
Same introductory sentence and collection as Figures 1.7–1.8 and 1.10.
Explains the actual protractor marks while the protractor is hidden. Move this description alongside the drawing.
Measurement instruction and six angles are visible together across the spread. Same-page placement is optional.
Summary of angle types faces the completed explanation; exercises follow the table. Keep.
The story introduces collected data; the table and questions follow together on the facing page. Keep.
The finished bar graph faces the worked steps. Both can be studied together. Keep the spread.
The worked steps end on the right page and the finished graph is overleaf. Keep the example and graph visible together.
Introduces the next number-box activity on the facing page. No page-turn obstacle.
Explains three rows of four unit squares without showing them on the open spread. Move the short explanation with the grid.
The flower-bed example and its plan face each other; all numerical data are also stated. Keep.
Asks what the reader notices in the house plan, then discusses its measurements while it is hidden. Move that discussion with the plan.
Introduces two equivalent cuts of the chikki on the facing page. Keep.
The folding explanation and the comparison strips are separated by a turn. Keep the final folding paragraph with the strips.
Names ABCD, its sides and angles while the labelled rectangle is overleaf. Keep the definitions with the rectangle.
Construction questions and their targets face each other. Acceptable in print; same-page grouping would also help single-page viewing.
The paper-folding task needs the two pictured holes. Move the complete question with its figure.
The copying task requires the grids that are overleaf. Move the question with the grids.
Asks which shops are below ground before the building can be seen. Move the questions and lift description with the building.
The population tables follow together, but the instruction to read their values aloud comes before the turn. Move that instruction to the tables; the census introduction can stay.
Same population-table introduction and read-aloud instruction as Table 1.5.
The grid-summing exercise is stranded before its data. Move the whole question with the two grids.
Introduces a conversion from words to expressions; the table does the work on the next page. Acceptable lead-in.
The money-table completion question faces the table. Keep this spread.
Fill-in instructions are separated from the empty boxes. Move the question to the table page.
Several row/column questions depend on a grid overleaf. Keep the problem and grid together.
The folding activity describes the displayed sheet and asks about its lines. Move that step alongside its diagram.
The student must choose between lines b and c, which are hidden. Move Question 5 with the figure.
Tracing and comparing named angles requires the figure. Keep the activity with the diagram.
Example 2 uses angles a, b and f before its diagram can be seen. Keep the complete example and figure on one page or spread.
The angle question faces its diagram. Keep.
The calling-number task cannot be attempted without the row of children overleaf. Move the prompt with the picture.
The pairing explanation and visual evidence face each other. Keep.
The rhythm derivation and resulting table face each other. Keep.
The parallel-line argument and labelled drawing face each other. Keep.
The tracing/superposition instruction precedes its shapes overleaf. Move the instruction with the shapes.
The construction narrative refers to two intersections E and F while their diagram is hidden. Put that explanatory paragraph with the construction.
Introduces a rough sketch; the actual construction steps and diagrams are together on the next page. Acceptable transition.
All four construction steps precede the sketch and finished construction overleaf. Group the steps with the figure.
The angle-finding exercise faces its labelled triangles. Keep.
Summarises signs in multiplication; the table follows, without interrupting a task. Acceptable transition.
The introduction to height plots faces the plots. Keep.
The rocket-launch observation questions face their chart. Keep.
The daylight calculation and its chart face each other. Keep.
The animal-speed graph questions face their chart. Keep.
Introduces a large reference table; the instructions for studying it are on the table page. Acceptable transition.
The skyscraper estimates and their chart face each other. Keep.
The hexagon discussion faces the diagram used in it. Keep.
The tangram cutting instructions face the seven-piece pattern. Keep.
The grid and tile dimensions are fully stated and the next page shows one possible answer. Acceptable reveal, though explicitly saying next page would help.
The tiling question and coloured argument face their diagrams. Keep.
The balancing-toy questions face the second set of toys. Keep.
The window-grill question faces the figure and also gives its measurements in words. Keep.
The equation-maze instructions face the maze. Keep.
The quadrant/sign explanation faces its coordinate plane. Keep.
Introduces a visual identity; its mathematical investigation follows with the figure. Acceptable transition; move the short lead-in if tightening the opening.
The algebra-tile description faces the rectangle. Keep.
The chord theorem setup faces the proof figure. Keep.
Introduces factorisation of 32760; the factor tree and explanation of its leaves are together on the next page. Acceptable transition.
The no-zero case faces its graph. Keep.
Announces two cubic graphs; their interpretation follows on the graph page. Acceptable transition.
The square-number sequence faces its illustration; the sequence is also explicit in text. Keep.
The potato-race question and hint are separated from the route diagram. Data are complete in words, but move the diagram with the question for easier checking.
Asks whether the displayed quadrilaterals are similar before the shapes can be seen. Move this question with the pictures.
Asks the reader to inspect photographs overleaf. Keep the visual-comparison paragraph with those photographs.
The shadow-construction activity faces its illustration. Keep.
Compares specific sides of a square and rectangle that are hidden. Move this comparison with its diagram.
The theorem and proof setup introduce D, E, M and N before the diagram. Move the proof setup with the figure; the theorem statement can remain earlier if necessary.
The equilateral-triangle derivation faces the bisected triangle. Keep.
Explains the movement of labelled points and shrinking angle before the visual sequence can be seen. Keep the description with the sequence.
The tower/canal problem precedes its geometry diagram across a turn. Keep the problem and diagram together.
The tangent theorem and construction face their proof diagram. Keep.
The circumscribed-triangle problem needs the labelled configuration overleaf. Keep problem and diagram together.
Defines the labelled sector at the end of a page; the figure and full derivation follow together. Move the short setup to the next page, rather than compressing the derivation.
The segment-area setup faces its diagram and derivation. Keep.
The table-cover problem faces the six-segment design. Keep.
The test tube is a familiar supplementary illustration, fully described in text. Its following-page placement is acceptable.
The joining-solids explanation faces its construction sequence. Keep.`.split('\n');
if(notes.length!==rows.length)throw Error(`Expected ${rows.length} notes, got ${notes.length}`);
const fix=new Set([4,9,11,13,15,16,18,19,20,23,26,27,28,29,30,31,33,37,38,40,64,65,66,68,69,71,72,74]);
const improve=new Set([21,22,75]);
const counts={};
const reviewed=rows.map((r,i)=>{const decision=fix.has(i)?'Regroup':improve.has(i)?'Move short prompt/setup':r.from%2===0?'Keep facing spread':'Keep transition';counts[decision]=(counts[decision]||0)+1;return {...r,decision,note:notes[i],facing:r.from%2===0};});
const lines=['# Case-by-case review of forward references','','Reviewed all 80 distinct source-page/reference pairs from the numbered-reference audit (83 mentions, including repeats). Read the surrounding source text and target-page content where the role was ambiguous. This is an editorial reading-order review, not a new rendered fit test. No book pages were changed.','','All nine current maths volumes have four front-matter pages. Printed even pages are left-hand pages, so even → odd consecutive pages face each other. Odd → even requires a page turn. This distinction matters for print; the single-page viewer displays the pages separately either way.','','No matched numbered reference is two or more pages ahead. This review does not certify every unnumbered “below/above” reference, backward reference or figure placement throughout the books. Repeated references to one collection count as separate table entries, not separate layout repairs.','','## Editorial decisions','',...Object.entries(counts).map(([k,v])=>`- ${k}: ${v} reference/page pairs.`),'','“Regroup” means the dependent question, explanation or proof setup should share a page or facing spread with its visual. “Move short prompt/setup” preserves a sensible section transition while keeping the instruction with its object. A fitting cause cannot be established from page order alone; any actual correction needs rendered measurements and a rebuild.','','| Class / volume | Chapter | Reference | Printed pages | Relationship | Decision | Case-specific reason |','|---|---|---|---|---|---|---|'];
for(const r of reviewed)lines.push(`| ${r.class.replace('class-','')} / ${r.subject} | ${r.chapter} — ${r.title} | [${r.reference}](C:/Code/learnlab-b5-maths/${r.source}) | ${r.from} → ${r.to} | ${r.facing?'Facing pages':'Page turn'} | ${r.decision} | ${r.note} |`);
fs.writeFileSync('build/forward-reference-case-review.md',lines.join('\n')+'\n');
console.log(JSON.stringify(counts,null,2));
