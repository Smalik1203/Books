// Adapted teaching sequence from the supplied Class 6 Science Chapter 7.
export const title='Temperature and its Measurement';
export const shortTitle=title;
export const opener=[
 'A forehead feels warm. A thermometer gives a number. What can each observation tell us?',
 'After school in Shillong, Lambok feels tired and thinks he may have a fever. His sister Phiban touches his forehead. Their family checks with a clinical thermometer: the reading is near the usual reference for body temperature.',
 'Touch begins their question, but it cannot settle it. A useful measurement needs the right instrument, a careful method and a unit.',
 'In this chapter, compare sensations, read liquid columns and digital displays, and investigate how temperature measurements help us describe bodies, water and the air around us.'
];
const h=(id,text,source,level=1)=>({id,type:'heading',text,source,level});
const b=(id,text,source)=>({id,type:'body',text,source});
const task=(id,sourceActivity,paragraphs,source)=>({id,type:'panel',kind:'setup',sourceActivity,paragraphs,source});
const fig=(id,figure,caption,source)=>({id,type:'figure',figure,caption,source});
const diagram=(id,key,caption,source)=>({id,type:'diagram',diagram:key,caption,source});
const table=(id,caption,rows,widths,source,note='')=>({id,type:'table',comparisonTable:true,caption,rows,widths,source,note});
export const lesson=[
 h('touch-heading','7.1 Can We Trust Our Sense of Touch?',[1,2]),
 b('touch-start','Water from a refrigerator, an earthen pot and a tap can feel different. We often use words such as hot, warm and cold without measuring anything. But will two hands always agree about the same water?',[1,2]),
 fig('bowls-art','bowls','Fig. 7.1 · Three bowls for comparing sensations. Use comfortably warm and cool water; remove ice before the hand test.',[2]),
 task('touch-task','7.1',[
 '1. Ask an adult to prepare three bowls: A with comfortably warm water, B with room-temperature water and C with cool water. Avoid very hot or painfully cold water. Remove any ice from C.',
 '2. Predict what each hand will feel when both are placed in B. Record your prediction before trying.',
 '3. Briefly place one hand in A and the other in C. Then place both hands together in B. Stop immediately if either hand feels uncomfortable.',
 '4. Describe each hand’s sensation in your notebook. Did your hands agree? Compare your account with another learner’s without changing your own observation.'
 ],[2]),
 b('touch-evidence','Both hands meet the same water in B, yet they may report different sensations after their different starting conditions. If this happens, it is evidence that touch depends on what the skin experienced just before. The water has not acquired two different temperatures merely because the hands disagree.',[2]),
 b('touch-limit','Touch is useful for noticing a possible change, but it is not a reliable numerical measurement. Never test an unknown hot object by touching it. A thermometer gives a temperature reading without asking us to judge hotness by sensation alone.',[2,3]),
 h('temperature-heading','7.2 Temperature and Its Units',[3]),
 b('temperature-definition','**Temperature** describes how hot or cold a body is. A **thermometer** measures temperature. A useful record includes both a number and a unit: “28” alone does not tell us which temperature scale was used.',[3]),
 b('celsius','The Celsius scale is common in school and everyday life. Its unit is the **degree Celsius**, written °C. Read 28 °C as “twenty-eight degrees Celsius”. A larger Celsius reading means a higher temperature when comparing measurements on this same scale.',[3,7]),
 table('units-table','Table 7.1 · Three temperature scales',[
 ['Scale','Unit and symbol','One equivalent temperature'],
 ['Celsius','degree Celsius (°C)','37 °C'],
 ['Fahrenheit','degree Fahrenheit (°F)','98.6 °F'],
 ['Kelvin','kelvin (K)','310.15 K']
 ],[.25,.4,.35],[6,7],'These are three ways to express the same temperature, not three different body temperatures.'),
 b('kelvin','The kelvin is the SI unit of temperature. Write K, without a degree sign. A change of 1 °C is the same temperature interval as a change of 1 K, but the scales have different zero points. To convert a Celsius value to a kelvin value, add 273.15.',[7]),
 {id:'kelvin-equation',type:'equation',text:'25 °C corresponds to (25 + 273.15) K = 298.15 K',caption:'Add 273.15 to the numerical Celsius value; write the result with K.',source:[7]},
 {id:'unit-think',type:'panel',kind:'think',paragraphs:['One report says 37 °C and another says 98.6 °F. Has the temperature necessarily risen? Explain why comparing the numbers without their scales would mislead us.'],source:[6,7]},
 h('clinical-heading','7.3 Measuring Body Temperature',[3,4]),
 b('clinical-intro','A **clinical thermometer** is designed for measuring body temperature. A digital model has a sensing tip, an electronic circuit and a display. The sensor responds to temperature, and the instrument shows a reading. A battery supplies the electrical energy it needs.',[3,4]),
 fig('clinical-art','clinical','Fig. 7.2 · A contact digital clinical thermometer and a non-contact infrared thermometer. Displays are left blank here.',[3,4,6]),
 b('clinical-types','The sensing tip of a contact model must be used at a body site approved in its instructions. A non-contact infrared clinical thermometer detects infrared radiation from the intended site, commonly the forehead. Its distance and positioning instructions matter; it is not used like a contact probe.',[4,6]),
 task('clinical-task','7.2',[
 '1. With a teacher or responsible adult, examine a digital clinical thermometer and its instructions. Identify the sensing tip, display, power button, unit and permitted measuring site.',
 '2. Watch the adult demonstrate correct use and cleaning. A personal measurement is optional and requires permission and adult supervision. Never share an oral thermometer between pupils.',
 '3. For comparison, use ten anonymous, teacher-provided readings taken with the same method, or voluntarily supplied records with permission. Record reading, unit, time and measuring site; do not write names.',
 '4. Compare the values with 37 °C. Are they all identical? Note any missing information that prevents a fair comparison. Do not diagnose anyone from this classroom record.'
 ],[5,6]),
 b('clinical-method','Follow the device’s instructions for the person’s age and the measuring site. Hold a contact model by its body rather than its sensing tip, and wait for its completion signal as instructed. Clean it using the recommended method. Do not immerse its electronic parts unless the manufacturer permits this.',[5,6]),
 b('clinical-reference','The often-quoted 37 °C, or 98.6 °F, is a conventional reference for body temperature, not an exact value every healthy person must show. Readings vary with the person, time of day, activity, measuring site and method. A single number is not enough to decide whether someone is well.',[6]),
 b('site-qualification','A reading from the armpit may differ from one taken at another site. Record the actual site and value; do not add a fixed correction to make it “normal”. If someone feels unwell, tell a responsible adult and follow appropriate health advice. Measuring in class is not a substitute for care.',[6]),
 b('mercury','Older clinical thermometers used mercury. Mercury is toxic, and broken glass can injure. Use a suitable digital device instead. If an old thermometer breaks, keep away and tell an adult; never touch the liquid or try to clean it up yourself.',[4]),
 {id:'pulse-think',type:'panel',kind:'think',paragraphs:['A person’s pulse becomes faster after running. Could a faster pulse by itself prove that the person has a fever? Explain which measurement is missing and why the activity just before the observation matters.'],source:[6]},
 h('lab-heading','7.4 Using a Laboratory Thermometer',[8,9]),
 b('lab-intro','A **laboratory thermometer** is used to measure temperatures in investigations. One familiar model has a glass stem, a bulb holding liquid, a narrow tube and a marked scale. A coloured alcohol liquid makes the column easy to see. Use a teacher-approved mercury-free instrument.',[8]),
 diagram('lab-structure','structure','Fig. 7.3 · Parts of a liquid-in-glass laboratory thermometer. An enlarged portion of the Celsius scale is shown.',[8]),
 b('lab-mechanism','When the bulb warms, its liquid expands and rises in the narrow tube. When it cools, the liquid contracts and the column falls. The instrument therefore responds to its own temperature as it exchanges energy with what it is measuring. Allow time for its reading to settle.',[8,10]),
 task('range-task','7.3',[
 '1. Examine a laboratory thermometer under your teacher’s supervision. Keep it away from the edge of the table and handle it gently.',
 '2. Find the unit and the lowest and highest marked values. Record both endpoints; together they describe the instrument’s marked range.',
 '3. Compare the marked range with another thermometer if one is available. Would either be suitable for the temperature you intend to measure? Explain your choice.'
 ],[8,9]),
 b('range-evidence','A common school laboratory model is marked from −10 °C to 110 °C. This is an example, not a rule for every instrument. Read the scale and the instructions of the model actually being used. Negative Celsius temperatures lie below 0 °C; they are not “less than no temperature”.',[8,9]),
 table('instrument-table','Table 7.2 · Choose the instrument for the job',[
 ['Criterion','Clinical thermometer','Laboratory thermometer'],
 ['Intended use','Body temperature at an approved site','Temperatures of materials in investigations'],
 ['Range','Check the device’s stated body-temperature range','Check the actual marked or stated range'],
 ['Reading','Follow its method and completion signal','For liquid-in-glass models, read while the bulb remains in the material'],
 ['Important limit','Do not use it for boiling water or ice experiments','Never put a glass laboratory thermometer in the mouth']
 ],[.2,.4,.4],[6,8,10],'An instrument suitable for one task is not automatically suitable for another.'),
 h('division-heading','Reading Between Numbered Marks',[9],2),
 task('division-task','7.4',[
 '1. Choose two neighbouring numbered marks on the thermometer. Subtract the lower value from the higher value.',
 '2. Count the equal intervals between the marks. Count the spaces, not both endpoint lines as extra intervals.',
 '3. Divide the temperature difference by the number of intervals. Record the value of one smallest division with its unit.',
 '4. Compare your calculation with a partner’s. If the answers differ, check the endpoints and interval count before reading a liquid level.'
 ],[9]),
 diagram('division-figure','division','Fig. 7.4 · Ten equal intervals run from 20 °C to 30 °C on this scale.',[9]),
 {id:'division-equation',type:'equation',text:'Value of one division = (30 − 20) °C ÷ 10 = 1 °C',caption:'There are eleven tick marks from 20 to 30 inclusive, but only ten intervals.',source:[9]},
 b('resolution','Another thermometer may have divisions of 0.5 °C or 2 °C. Do not assume that every small line means 1 °C. Small divisions let us distinguish closer readings; they do not, by themselves, prove that an instrument is accurate.',[9]),
 h('water-heading','Measuring Water Carefully',[10,11],2),
 task('water-task','7.5',[
 '1. Ask the teacher for a beaker of comfortably warm water and a suitable mercury-free laboratory thermometer. No pupil heating is needed.',
 '2. Support the thermometer upright. Immerse its bulb fully in the water, clear of the beaker’s sides and bottom.',
 '3. Wait for the liquid column to stop changing. Bring your eyes to the level of the top of the column, keeping your face safely away from the apparatus.',
 '4. Read and record the temperature with its unit while the bulb remains in the water. Repeat carefully. Compare readings and explain any differences in the method.'
 ],[10,11]),
 diagram('water-apparatus','water','Fig. 7.5 · Keep the bulb immersed and clear of the glass. View the liquid level straight across.',[10]),
 b('water-evidence','Looking from above or below can make a liquid level appear to line up with the wrong mark. This viewing error is called **parallax**. Eye-level reading reduces it. Touching the container can also make the thermometer respond to the container rather than only to the water.',[10]),
 b('removal','A liquid-in-glass laboratory thermometer does not usually retain its highest reading. Lift it out of warm water into cooler air and the column begins to fall. A reading taken afterwards no longer describes the water at the moment of measurement. Keep the bulb immersed while reading.',[10,11]),
 h('fixed-points','Melting Ice and Boiling Water',[11],2),
 b('teacher-demo','In a teacher-led demonstration, observe a suitable thermometer in a well-mixed mixture of melting ice and water, and then an appropriate instrument measuring boiling water. Watch from a safe distance. Do not handle the hot vessel, steam, heater or thermometer.',[11]),
 b('phase-change','For pure water near standard atmospheric pressure, melting ice and water together are near 0 °C, while boiling water is near 100 °C. During each change, the temperature can remain nearly steady while both forms are present. Heating does not always mean that the temperature keeps rising.',[11]),
 b('pressure','The boiling temperature also depends on pressure. At a higher place, the air pressure is usually lower, and water boils at a lower temperature. Dissolved substances and measurement conditions can matter too. A boiling reading below 100 °C does not automatically mean that the thermometer is broken.',[11,12]),
 task('boiling-data-task','7.6',[
 '1. Study the supplied readings from a boiling-water demonstration in Shillong in Table 7.3. This is a data investigation; do not boil water yourself.',
 '2. Find the highest and lowest readings and calculate their difference. Which value occurs more than once?',
 '3. Suggest measurement details that could account for the small spread. Explain why you need the place and conditions before comparing every result with 100 °C.'
 ],[11,12]),
 table('boiling-table','Table 7.3 · Supplied boiling-water readings in Shillong',[
 ['Observer','Temperature'],['Phiban','97.8 °C'],['Shemphang','98.0 °C'],['Onestar','97.9 °C'],['Kloi','98.0 °C'],['Bandarisha','98.1 °C']
 ],[.55,.45],[11,12],'These readings are provided for analysis; they are not a result you are required to reproduce.'),
 b('boiling-evidence','The readings span 0.3 °C. Differences in eye position, timing, instruments or conditions could contribute. Check those details before choosing a cause. Shillong’s elevation also helps explain why readings cluster below the sea-level reference of 100 °C.',[11,12]),
 h('air-heading','7.5 Temperature of the Air',[12,13]),
 b('air-start','A room thermometer responds to the air and surroundings where it is placed. A sunny windowsill and a shaded part of the same room may give different readings. Keep the position and time consistent when investigating change, and record those details.',[12]),
 fig('weather-art','weather','Fig. 7.6 · A ventilated weather-instrument shelter protects temperature instruments from direct sunshine. The instruments beside it measure wind.',[12,13]),
 b('weather-reading','Weather observations need comparable measuring conditions. Outdoor air-temperature instruments are protected from direct sunshine while air can move around them. A thermometer warmed directly by the Sun can give a misleading value for the surrounding shaded air.',[12]),
 b('max-min','Weather reports commonly give the day’s **maximum** and **minimum** air temperatures: its highest and lowest recorded values for the reporting period. A single reading at noon cannot establish both. Special instruments or repeated automatic records are used to capture the extremes.',[12,13]),
 task('weather-task','7.7',[
 '1. Choose one place and a reliable weather report. Collect its reported maximum and minimum temperatures for ten successive days.',
 '2. In your notebook, record date, place, source, unit, maximum and minimum. Use the same reporting period and source throughout.',
 '3. Calculate each day’s temperature range by subtracting its minimum from its maximum. Identify the greatest maximum and the smallest minimum in your record.',
 '4. Describe the changes you actually find. Compare with classmates using the same place and dates, and investigate any disagreements.'
 ],[12,13]),
 b('weather-evidence','Daily temperatures need not change steadily in one direction. Clouds, wind and other weather conditions matter. Ten days can show a short-term pattern, but this small record is not enough to describe a place’s climate. Keep the conclusion within what the observations support.',[12,13]),
 b('anna-mani','Anna Mani (1918–2001) was an Indian meteorologist who helped develop and standardise weather instruments in India. Her work also supported measurements of sunshine and wind. Reliable instruments turn observations into records that others can check and compare.',[13]),
 {id:'air-think',type:'panel',kind:'think',paragraphs:['Two pupils report different afternoon air temperatures. One measured beside a sunny wall; the other used a shaded, ventilated position. What would you change before deciding that either thermometer was faulty?'],source:[12,13]},
 b('temperature-close','A temperature measurement is more than a number. State the unit, choose an instrument suited to the task, use a consistent method and describe the conditions. These details let another person understand what was measured and whether a comparison is fair.',[14]),
];
export const glossary=[
 ['Temperature','A measure of how hot or cold a body is.'],['Thermometer','An instrument for measuring temperature.'],['Clinical thermometer','An instrument designed to measure body temperature.'],['Laboratory thermometer','An instrument for temperature measurements in investigations.'],['Degree Celsius','A temperature unit written °C.'],['Degree Fahrenheit','A temperature unit written °F.'],['Kelvin','The SI unit of temperature, written K.'],['Sensing tip','The temperature-sensitive end of a contact digital thermometer.'],
 ['Bulb','The reservoir of liquid in a liquid-in-glass thermometer.'],['Liquid column','The visible liquid in the narrow tube above the bulb.'],['Scale','Marks and numbers used to read a measurement.'],['Marked range','The interval between an instrument’s lowest and highest marked values.'],['Smallest division','The value of one smallest interval on a scale.'],['Parallax','Apparent shift caused by viewing a scale from an angle.'],['Maximum temperature','The highest temperature recorded in a stated period.'],['Minimum temperature','The lowest temperature recorded in a stated period.']
];
export const summary=[
 'Touch depends on previous sensations. Use a suitable thermometer for a numerical temperature measurement.',
 'Record the number and unit together. Celsius uses °C, Fahrenheit uses °F and kelvin uses K.',
 '37 °C and 98.6 °F are equivalent reference values. Body temperature varies with the person, time, site and method.',
 'Use clinical thermometers only as directed, with permission, hygiene and adult guidance. Never use a glass laboratory thermometer in the mouth.',
 'In a liquid-in-glass thermometer, warming expands the liquid and cooling contracts it. Read its range and smallest division before use.',
 'For water measurements, keep the bulb immersed and clear of the vessel. Wait for a steady column and read at eye level.',
 'Pure melting ice and water are near 0 °C; pure water boils near 100 °C at standard atmospheric pressure. Boiling temperature changes with pressure.',
 'Air-temperature records need a stated place, time and suitable measuring conditions. Daily maximum and minimum values are the extremes for a reporting period.'
];
export const games=[];
export const exercises=[
 {id:'q1',text:'Which is the commonly quoted reference value for normal human body temperature on the Celsius scale? Choose one: (a) 98.6 °C; (b) 37.0 °C; (c) 32 °C; (d) 27 °C.',source:[15]},
 {id:'q2',text:'Which Fahrenheit value is equivalent to 37 °C? Choose one: (a) 97.4 °F; (b) 97.6 °F; (c) 98.4 °F; (d) 98.6 °F.',source:[15]},
 {id:'q3',text:'Complete these statements in your notebook. (a) A measure of hotness or coldness is called … . (b) A … thermometer intended for body temperature must not be used for ice-water experiments. (c) The unit on the Celsius scale is the … .',source:[15]},
 {id:'q4',text:'Which marked range is common for a school liquid-in-glass laboratory thermometer? (a) 10 °C to 100 °C; (b) −10 °C to 110 °C; (c) 32 °C to 45 °C; (d) 35 °C to 42 °C. Why must you still check the instrument in front of you?',source:[15]},
 {id:'q5',text:'Four students position laboratory thermometers as shown. Which position is suitable for reading the water temperature? Explain the problem in each of the other three positions.',diagram:'positions',caption:'Each beaker contains water; the thermometer bulb is the rounded lower end.',source:[16]},
 {id:'q6',text:'Copy these Celsius scales into your notebook. Draw the liquid level at (a) 14 °C, (b) 17 °C and (c) 7.5 °C. Count the intervals before drawing.',diagram:'blank-scales',caption:'Scales (a) and (b) have 1 °C divisions; scale (c) has 0.5 °C divisions.',source:[16]},
 {id:'q7',text:'This is part of a liquid-in-glass thermometer scale used in a laboratory. What temperature does the column show? What is the value of its smallest division?',diagram:'read28',caption:'Scale values are in degrees Celsius.',source:[16]},
 {id:'q8',text:'Why should a glass laboratory thermometer not be used to measure a person’s body temperature? Explain how the intended use and safe handling of a clinical thermometer differ.',source:[16]},
 {id:'q9',text:'Use this supplied classroom record of Vaishnavi’s temperature. (a) Find the highest reading. (b) State its day and time. (c) On which day and at what time does the record first reach 37.0 °C? Explain why the table alone cannot establish that she has recovered.',table:{caption:'Supplied temperature readings (°C)',rows:[['Day','7 am','10 am','1 pm','4 pm','7 pm','10 pm'],['1','38.0','37.8','38.0','38.0','40.0','39.0'],['2','38.6','38.8','39.0','39.0','39.0','38.0'],['3','37.6','37.4','37.2','37.0','36.8','36.6']],widths:[.1,.15,.15,.15,.15,.15,.15],note:'This supplied exercise record is not guidance for treating an illness.'},source:[17]},
 {id:'q10',text:'Which scale has a marked division exactly at 22.5 °C? Explain your choice by stating the smallest division of each scale.',diagram:'scale-choice',caption:'All three scales show part of the Celsius scale.',source:[17]},
 {id:'q11',text:'Read the liquid level on this enlarged scale. Choose (a) 28.0 °C, (b) 27.5 °C, (c) 26.5 °C or (d) 25.3 °C. Explain how you counted from a numbered mark.',diagram:'read275',caption:'The small marks divide each degree into two equal intervals.',source:[18]},
 {id:'q12',text:'A thermometer has 50 equal intervals between 0 °C and 100 °C. What temperature interval does one division represent? Show your calculation.',source:[18]},
 {id:'q13',text:'Draw a scale from 10 °C to 20 °C with a division every 0.5 °C. How many intervals and how many tick marks, including both endpoints, will you draw?',source:[18]},
 {id:'q14',text:'Komal tells her friend, “My temperature is 101 degrees.” Which scale is she likely using? What details should you ask for before interpreting the reading? Explain why anyone who feels unwell should tell a responsible adult.',source:[18]}
];
export const projects=[
 {id:'project-animals',title:'1. Temperature in other animals',text:'With an adult, ask a veterinarian or consult a reliable veterinary reference about typical body temperatures of two animals. Record species, unit, measuring method and source. Compare the information without measuring or handling animals yourself. Explain why a human reference value should not simply be applied to another species.',source:[18]},
 {id:'project-india',title:'2. Hot and cold places in India',text:'Find reported temperatures for two Indian places using an official weather source. Record the date, unit and whether each value is a daily observation, a forecast or a historical record. Compare like with like. What additional information would you need to claim that one place is generally hotter than the other?',figure:'weather',caption:'Consistent instruments and records make comparisons more useful.',source:[18]},
 {id:'project-planets',title:'3. Temperature beyond Earth',text:'Use a reliable space-agency source to compare reported temperatures of planets and their distances from the Sun. Check whether each temperature describes a surface, atmosphere or average. Does distance alone explain the order? Investigate one exception. The kelvin scale begins at absolute zero, 0 K, equal to −273.15 °C; this is very different from the freezing point of water.',source:[18,19]},
 {id:'project-room-water',title:'4. A room and a beaker of water',text:'With teacher approval, compare room air and a beaker of water at the same three times each day for two weeks. Use suitable thermometers in a fixed shaded position. Keep the water thermometer’s bulb immersed and clear of the vessel. Record date, time, both values and units. Keep the water out of direct sunlight and do not heat it. Do the temperatures always agree? Discuss why the water and the air may respond to changes at different rates.',diagram:'room-water',caption:'Measure the air and the water separately; retain the same positions and method.',source:[19]}
];
