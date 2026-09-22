// Independent source ledger; the supplied source PDF is never modified.
import fs from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {title,lesson,exercises,projects} from './science-g7-ch06-content.mjs';
const history='assets/design-history/science-g7-ch06';
const file='C:/Books/6-10 Books/7/7 Science/Chapter 6.pdf';
await fs.writeFile(history+'/source.json',JSON.stringify({file,title,class:7,chapter:6,pdfPages:16,printedPages:[73,88],sha256:createHash('sha256').update(await fs.readFile(file)).digest('hex'),scope:'Only Chapter 6 authored. Chapters 7–12 remain future references.'},null,2));
const points=[
 ['growth-analogy',[1],['opener'],'Seed, seedling, maturity, flowers and seeds; animals developing before reproduction; eggs and live birth.'],
 ['life-stages',[2],['life-stages','cousins'],'Five human life stages; adolescence 10–19; internal and external development; Venkatesh and Devyani.'],
 ['activity-6.1',[2,3],['anonymous-task','growth-table','growth-variation'],'Jar, anonymous slips, mixing, discussion and all Table 6.1 categories. Add privacy and voluntary fictional examples; no body survey.'],
 ['body-changes',[3,4],['body-changes','variation-respect'],'Height, weight, strength, shoulders/chest, breasts, armpit/pubic/facial/chest/back hair, variation in timing and amount.'],
 ['voice',[4],['voice','adams-apple','neck-figure'],'Larynx growth in both sexes, temporary cracking, Adam’s apple not visible in all. Live schematic distinguishes thyroid from larynx.'],
 ['acne',[4],['acne','acne-care'],'Increased oil, blocked follicles, inflammation; skin care and support linked to Q1. Avoid dirty-skin implication.'],
 ['puberty',[5],['puberty','secondary','timing-pause'],'Internal/external reproductive maturation, secondary characteristics, puberty versus adolescence, individual variation.'],
 ['menstrual-cycle',[5],['internal','menstruation','cycle-figure','cycle-variation','period-support'],'Menstrual cycle versus bleeding phase; uterine lining added for mechanism; adolescent 21–45-day guidance replaces adult range and fixed 28–30-day implication.'],
 ['menopause',[5],['menopause'],'Natural end of periods, generally 45–55; distinguish adolescent irregularity.'],
 ['menstrual-myths',[5],['myths','period-pause'],'No impurity or isolation; participation, privacy and supportive facilities.'],
 ['activity-6.2',[6],['feelings','feelings-task','feelings-table','feelings-choice','feelings-help'],'Table 6.2 feelings, possible behaviour and constructive choices; music, dance, sports, creativity, compassion and social work. Fictional situations replace personal disclosures.'],
 ['wellbeing',[7],['wellbeing','nutrition'],'Nutrition, hygiene, activity, thoughtful choices; carbohydrates, fats, proteins, vitamins and minerals.'],
 ['activity-6.3',[7],['food-task','food-table','nutrition-evidence'],'Local foods, nutrients and functions; all named source foods retained. Ragi is specified rather than attributing equal calcium to all millets.'],
 ['anaemia',[8],['anaemia','nutrition-schemes'],'Iron/B12 deficiency, causes and prevention enquiry; WIFS and Anaemia Mukt Bharat; no self-prescribed supplements.'],
 ['hodgkin',[8],['hodgkin','food-table'],'B12 structure, 1964 Nobel Chemistry, third female Chemistry laureate; dietary B12 sources.'],
 ['hygiene',[8],['body-hygiene','hygiene-art','pad-comparison','hygiene-access','pad-environment'],'Body hygiene, external genital region, disposable and reusable pads, availability, stigma, wrapping/bin disposal. Washing/drying reusable products added; biodegradability qualified.'],
 ['public-programmes',[9],['support-programmes','support-access'],'MHS, RKSK, Suvidha, Karnataka Shuchi, Tamil Nadu and Odisha examples. No guaranteed price or eligibility; check locally.'],
 ['physical-activity',[9],['movement','movement-art','rest'],'Exercise/games, fitness, stamina and mood; inclusive illustrated activity, rest and safe participation.'],
 ['social-life',[10],['relationships','online','support-art'],'Respect, collaboration, attraction, peer influence and responsible online communication.'],
 ['cyberbullying',[10],['cyberbullying','online-help','digital-pause'],'Misleading/hurtful messages, rumours, private information without consent, trusted help. Preserve evidence privately; no prescribed emotions or victim blame.'],
 ['activity-6.4',[11],['digital-task','digital-table'],'Group poster/pamphlet, designated school display and Table 6.4 dos/don’ts retained. Teacher permission, fictional examples and reasons added.'],
 ['harmful-substances',[11,12],['substances','refusal-example','addiction','smoke-figure','substance-effects'],'Tobacco, gutka, cigarettes, beedis, alcohol and harmful drugs; say no, pressure, addiction, possible harm. Airway model replaces sensationalised before/after lungs.'],
 ['addiction-support',[12],['substance-help'],'Trusted adults, counselling, medical support, Nasha Mukt Bharat Abhiyaan and verified 14446 helpline.'],
 ['hormones',[12],['hormones','hormone-figure','hormone-limits','closing'],'Chemical messengers, brain/gland regulation, growth and reproductive development; influences on mood distinguished from sole causation.'],
 ['summary',[13],['summary','glossary'],'All ten substantive nutshell points retained with the corrected definitions; ten reference terms added.'],
 ...exercises.map((q,i)=>['question-'+(i+1),q.source,[q.id],'Original assessment task and substantive subparts retained; see corrections for reworded claims.']),
 ...projects.map(q=>[q.id,q.source,[q.id],'Original project retained with practical participation, privacy and safety guidance.'])
].map(([id,sourcePages,targets,treatment])=>({id,sourcePages,targets,treatment}));
const corrections=[
 {targets:['cycle-variation','period-support','summary','q3'],change:'Use adolescent-specific cycle guidance (21–45 days; generally no more than seven days bleeding), not a fixed 28–30-day timetable or adult 21–35-day range.'},
 {targets:['acne','acne-care'],change:'Explain follicle blockage, oil and inflammation without equating acne with dirty skin. Gentle care; no drug prescribing.'},
 {targets:['secondary','body-changes','q9'],change:'Replace absolute sex-exclusive categories with common/typically more pronounced patterns; voice-box growth occurs in both.'},
 {targets:['q8','neck-figure','adams-apple'],change:'Make the doctor’s assessment explicit: thyroid enlargement is different from normal larynx growth. Appearance alone is insufficient for diagnosis.'},
 {targets:['pad-environment','pad-comparison'],change:'Do not equate biodegradable claims with permission to litter, flush or home-compost. Safe local disposal and clean/dry reusable supplies.'},
 {targets:['addiction','substance-help'],change:'Addiction is neither inevitable after one use nor merely a failure of willpower; supportive professional care retained.'},
 {targets:['cyberbullying','online-help'],change:'Remove instruction not to feel frightened; give actionable support and protect evidence without redistributing harm.'},
 {targets:['puberty','project-roleplay'],change:'Explicitly distinguish reproductive capability from readiness for marriage and parenthood.'},
 {targets:['food-table','q2'],change:'Preserve both source food groups as painted artwork; account for variety/portions and avoid labelling a whole person’s diet from one meal.'},
 {targets:['smoke-figure'],change:'Replace source lung colour before/after with a labelled airway cross-section model; no claim that the drawing depicts every affected lung.'}
];
await fs.writeFile(history+'/source-coverage.json',JSON.stringify({source:'Supplied Chapter 6.pdf; PDF pages 1–16, printed 73–88',points,additions:lesson.filter(b=>b.addition).map(b=>({targets:[b.id],reason:b.addition})),corrections,omitted:'Publisher furniture, decorative enquiry lettering, duplicated OCR text and textbook answer spaces. No substantive teaching point, activity, assessment or project intentionally omitted.'},null,2));
const references=[
 ['Adolescent age range and development','https://www.who.int/health-topics/adolescent-health'],
 ['Teen menstrual cycles and bleeding','https://www.acog.org/womens-health/faqs/heavy-and-abnormal-periods'],
 ['First periods and menstrual process','https://www.acog.org/womens-health/faqs/your-first-period'],
 ['Long gaps requiring assessment','https://www.acog.org/womens-health/faqs/amenorrhea-absence-of-periods'],
 ['Menopause timing','https://www.who.int/news-room/fact-sheets/detail/menopause/'],
 ['Acne mechanisms and gentle care','https://www.nhs.uk/conditions/acne/'],
 ['Menstrual products and care','https://www.unicef.org/media/91346/file/UNICEF-Guide-menstrual-hygiene-materials-2019.pdf'],
 ['Period support and disposal','https://www.unicef.org/asia-pacific/stories/how-to-talk-to-daughter-periods'],
 ['MHS','https://nhm.gov.in/nhm_live/index1.php?lang=1&level=3&lid=391&sublinkid=1021'],
 ['RKSK','https://nhm.gov.in/index1.php?lang=1&level=2&lid=221&sublinkid=818'],
 ['WIFS','https://www.nhm.gov.in/index1.php?lang=1&level=3&lid=388&sublinkid=1024'],
 ['Suvidha access','https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=157711&lang=1&reg=3'],
 ['Karnataka Shuchi','https://hfwcom.karnataka.gov.in/storage/pdf-files/AnnualreportJanuaryendEng2024-25.pdf'],
 ['Odisha KHUSI','https://health.odisha.gov.in/sites/default/files/2025-03/Annual%20Activity%20Report%202024-25%20final%20%20%283%29.pdf'],
 ['Vitamin B12','https://ods.od.nih.gov/factsheets/VitaminB12-Consumer/'],
 ['Vitamin C and iron absorption','https://ods.od.nih.gov/factsheets/VitaminC-HealthProfessional/'],
 ['Hodgkin and B12','https://www.nobelprize.org/prizes/chemistry/1964/hodgkin/'],
 ['Hodgkin’s place among women laureates','https://www.nobelprize.org/womenwhochangedscience/stories/dorothy-hodgkin'],
 ['Cyberbullying support','https://www.unicef.org/stories/how-to-stop-cyberbullying'],
 ['National de-addiction helpline 14446','https://www.pib.gov.in/PressNoteDetails.aspx?ModuleId=3&NoteId=154754&lang=2&reg=48'],
 ['International Day of Yoga','https://www.un.org/en/observances/yoga-day']
].map(([topic,url])=>({topic,url}));
await fs.writeFile(history+'/scientific-references.json',JSON.stringify({checked:'2026-09-22',references,qualification:'State schemes are retained as source examples, not promises of current individual eligibility. Ask locally.'},null,2));
console.log(`Recorded ${points.length} source links and ${corrections.length} editorial corrections.`);
