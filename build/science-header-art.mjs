// Decorative still lifes for selected Science openers. Live, palette-driven vectors;
// no labels, raster scaling, or changes to the chapter's teaching illustration.
const p=(d,c='')=>`<path${c?` class="${c}"`:''} d="${d}"/>`;
const circle=(x,y,r,c='')=>`<circle${c?` class="${c}"`:''} cx="${x}" cy="${y}" r="${r}"/>`;
const soft='science-header-art__soft',solid='science-header-art__surface';
const shapes={
 plate:()=>circle(50,50,35,soft)+circle(50,50,26)+p('M5 16V40Q5 47 12 47V88M12 16V47M19 16V40Q19 47 12 47M91 16Q80 32 83 56H91V88M91 16V56'),
 grain:()=>p('M30 94Q46 56 61 8M44 58L15 52M49 42L25 33M54 28L38 15')+p('M42 65Q17 69 15 52Q33 46 42 65ZM48 47Q28 47 25 33Q42 29 48 47ZM54 30Q36 29 38 15Q52 15 54 30ZM44 60Q70 59 75 41Q54 39 44 60ZM51 43Q76 39 76 24Q56 23 51 43ZM57 25Q73 18 65 4Q55 11 57 25Z',solid),
 produce:()=>p('M49 30C30 12 8 32 12 56C15 81 34 91 49 80C65 93 88 75 88 50C88 25 68 16 49 30Z',soft)+p('M49 31Q48 17 56 10M53 19Q71 22 79 8Q59 2 53 19Z',solid)+p('M23 43Q17 55 26 67M47 75Q51 77 55 75'),
 sprig:()=>p('M47 94Q37 52 58 7')+p('M44 73Q12 72 10 46Q37 42 44 73ZM44 53Q70 49 86 27Q55 24 44 53ZM49 32Q22 34 21 9Q45 7 49 32Z',solid)+p('M20 55L41 72M52 47L75 34M30 17L46 30'),
 butterfly:()=>p('M47 46C10 4 0 36 17 56C-1 78 21 96 47 61M53 46C90 4 100 36 83 56C101 78 79 96 53 61',soft)+p('M50 39V74M49 39Q40 25 34 29M51 39Q60 25 66 29M27 42Q38 46 43 53M73 42Q62 46 57 53M29 71L41 61M71 71L59 61'),
 mushroom:()=>p('M40 49L35 86Q49 95 65 85L59 49Z',soft)+p('M9 49Q15 12 49 10Q83 12 91 49Q51 65 9 49Z',solid)+p('M21 53Q49 65 79 53M46 64L43 83')+circle(34,31,4)+circle(62,28,5)+circle(51,44,3),
 magnifier:()=>circle(43,40,30,soft)+circle(43,40,24)+p('M63 63L72 56L94 80Q99 88 89 94Z',solid)+p('M27 46Q35 26 56 27Q56 50 34 52M31 53L50 33'),
 flask:()=>p('M36 8H64M40 8V36L15 79Q9 92 25 92H75Q91 92 85 79L60 36V8')+p('M26 63H74L85 82Q89 91 76 91H24Q11 91 15 82Z',soft)+p('M30 71Q41 65 53 73T76 73')+circle(43,49,4)+circle(57,80,3),
 moon:()=>p('M67 12A39 39 0 1 0 87 70A37 37 0 0 1 67 12Z',soft)+circle(33,56,5)+circle(43,77,3)+p('M79 22V36M72 29H86M91 47V55M87 51H95'),
 magnet:()=>p('M17 12H35V56A15 15 0 0 0 65 56V12H83V56A33 33 0 0 1 17 56Z',soft)+p('M17 33H35M65 33H83')+p('M17 12H35V32H17ZM65 12H83V32H65Z',solid),
 compass:()=>circle(50,50,41,soft)+circle(50,50,33)+p('M50 17V24M50 76V83M17 50H24M76 50H83M27 27L32 32M68 68L73 73')+p('M62 27L54 56L38 73L46 44Z',solid)+p('M46 44L54 56')+circle(50,50,3),
 clips:()=>p('M32 49L59 17C74 1 95 23 81 38L48 78C28 102 0 72 17 53L50 14M35 61L64 27M54 84L72 63Q86 49 95 62Q99 68 91 77L76 95'),
 plane:()=>p('M5 36L95 7L64 89L46 57L25 70L29 47Z',soft)+p('M5 36L46 57L95 7M29 47L95 7M25 70L46 57M46 57L64 89'),
 notebook:()=>p('M23 12H86V91H23Q13 91 13 81V23Q13 12 23 12Z',soft)+p('M27 12V91M9 28H20M9 43H20M9 58H20M9 73H20M39 30H74M39 43H68M39 56H75M39 69H59'),
 lemon:()=>p('M8 48Q7 38 18 36C25 4 72 7 83 39Q98 44 88 56C70 89 28 85 16 58Q5 59 8 48Z',soft)+p('M28 54Q21 31 45 23M46 11Q54 1 76 5Q71 23 55 19',solid)+p('M47 22L49 68M24 45L74 47M32 28L65 64M32 66L65 29'),
 tubes:()=>p('M16 9H43M20 9V78Q20 96 39 78V9M57 22H84M61 22V78Q61 96 80 78V22')+p('M20 52H39V78Q29 95 20 78ZM61 63H80V78Q70 95 61 78Z',soft)+p('M22 57Q30 61 38 57M63 67H78')+circle(28,37,3)+circle(69,48,3),
 dropper:()=>p('M56 11Q70 0 81 12Q92 24 81 36L72 45L47 20Z',solid)+p('M50 25L15 63L12 80L29 76L67 41M22 62L33 71M15 89Q5 100 20 99Q25 98 15 89Z',soft),
 bulb:()=>p('M30 65C30 54 14 50 14 30A35 35 0 0 1 84 30C84 50 68 54 68 65Z',soft)+p('M32 68H66V85H32ZM36 88Q49 101 62 88M34 74H64M34 80H64M43 65L37 40L48 49L60 39L55 65M4 34H0M95 34H100'),
 cell:()=>p('M19 18H80V87H19Z',soft)+p('M35 9H64V18H35ZM19 18H80V33H19Z',solid)+p('M40 48H60M50 38V58M41 75H59'),
 switch:()=>p('M7 60L62 45L93 62L38 80ZM7 60V76L38 95L93 77V62M38 80V95',soft)+circle(26,59,4)+circle(68,57,4)+p('M28 54L58 16L65 23L36 60Z',solid),
 anvil:()=>p('M6 28H92L82 47H63V59L73 78H88V89H20V78H34L40 59V47H24Z',soft)+p('M25 29V46M40 59H63M34 78H73M63 7L92 19L87 31L58 19Z',solid)+p('M72 27L54 61'),
 coil:()=>p('M12 29C12 9 86 9 86 29S12 49 12 29ZM12 29V43C12 63 86 63 86 43V29M12 43V58C12 78 86 78 86 58V43M12 58V72C12 92 86 92 86 72V58M12 72Q7 92 1 92M86 29Q98 22 98 8'),
 crystal:()=>p('M20 33L52 7L84 34L69 87H35Z',soft)+p('M20 33H84M52 7L40 33L50 87L64 33L52 7M35 87L40 33M69 87L64 33'),
 meltingIce:()=>p('M11 80C1 92 30 97 52 92C72 98 98 88 88 80',soft)+p('M19 26L52 12L81 30L73 66L44 80L17 61Z',soft)+p('M19 26L47 43L81 30M47 43L44 80M28 30L40 37M57 24L68 30M26 43L25 54M60 52L57 64')+p('M87 49Q76 64 87 68Q98 64 87 49Z',solid),
 dialogue:()=>p('M8 17H65Q74 17 74 26V51Q74 60 65 60H32L16 72V60H8Q2 60 2 51V26Q2 17 8 17Z',soft)+p('M80 37H89Q98 37 98 46V72Q98 81 89 81H84V93L68 81H47Q38 81 38 72V67')+p('M17 32H58M17 44H46M51 71H82'),
 thermometer:()=>p('M40 64V17Q40 4 53 4Q66 4 66 17V64A21 21 0 1 1 40 64Z',soft)+p('M53 29V74M72 20H85M72 35H80M72 50H85')+circle(53,80,9,solid),
 sun:()=>circle(50,50,24,soft)+p('M50 6V16M50 84V94M6 50H16M84 50H94M19 19L27 27M73 73L81 81M19 81L27 73M73 27L81 19'),
 breeze:()=>p('M6 31H70C93 31 91 5 76 9Q65 12 70 20M6 48H85M18 65H60C82 65 80 93 64 88Q54 84 61 77M31 82H43'),
 pendulum:()=>p('M18 9H85M52 9L24 67M52 9V76M14 90Q53 105 88 75')+circle(20,75,10,solid)+circle(52,86,10,soft),
 clock:()=>circle(50,53,38,soft)+p('M39 5H61M50 5V15M50 23V29M50 78V84M19 53H25M75 53H81M50 53V35L51 53L68 62')+circle(50,53,3,solid),
 ruler:()=>p('M13 15H86V79H13Z',soft)+p('M22 15V32M34 15V26M46 15V32M58 15V26M70 15V32M13 65H86M23 65V79M37 70V79M51 65V79M65 70V79M79 65V79'),
 lungs:()=>p('M45 7V36L30 48M55 7V36L70 48M45 19H55M45 27H55')+p('M36 33C24 22 7 49 8 73Q9 91 28 89L40 81V48ZM64 33C76 22 93 49 92 73Q91 91 72 89L60 81V48Z',soft)+p('M30 48L24 68M24 60L15 65M70 48L76 68M76 60L85 65'),
 heart:()=>p('M50 89C37 76 10 60 9 37C7 10 37 5 50 28C64 5 94 10 92 37C91 60 65 78 50 89Z',soft)+p('M19 48H35L42 35L52 64L61 45H80'),
 drop:()=>p('M50 5C43 24 15 45 15 65A35 30 0 0 0 85 65C85 45 57 24 50 5Z',soft)+p('M29 61Q23 77 41 82'),
 mirror:()=>p('M25 10H77V71H25Z',soft)+p('M31 16H71V65H31M51 71V85M31 91Q51 79 71 91M38 32L53 22M40 46L62 31'),
 prism:()=>p('M20 70L51 14L79 72L52 90Z',soft)+p('M51 14L52 90M20 70L79 72M4 39L37 39M64 38L95 25M65 46L96 46M71 57L96 69'),
 globe:()=>circle(50,46,33,soft)+p('M24 21Q56 7 72 38T58 77M18 43Q48 63 80 40M28 19L70 73M17 4L86 85M6 55A46 46 0 0 0 65 90M44 92V97M23 97H69'),
};
const item=(name,x,y,size,angle=0)=>`<g data-art-element="${name}" transform="translate(${x} ${y}) scale(${size/100}) rotate(${angle} 50 50)">${shapes[name]()}</g>`;
const themes={
 '6-1':['magnifier','flask','moon'], '6-2':['sprig','butterfly','mushroom'],
 '6-3':['plate','grain','produce'], '6-4':['magnet','compass','clips'],
 '7-1':['plane','notebook','magnifier'], '7-2':['lemon','dropper','tubes','sprig'],
 '7-3':['bulb','cell','switch'], '7-4':['anvil','coil','crystal'],
 '7-5':['meltingIce','flask','produce'], '7-6':['sprig','notebook','dialogue'],
 '7-7':['thermometer','sun','breeze'], '7-8':['pendulum','clock','ruler'],
 '7-9':['lungs','heart','plate'], '7-10':['sprig','sun','drop'],
 '7-11':['mirror','bulb','prism'], '7-12':['globe','sun','moon'],
};
export function scienceHeaderArt(grade,chapter){
 const key=`${grade}-${chapter}`,names=themes[key];if(!names)throw Error('No header art for '+key);
 // A fixed right-hand column keeps every element beyond even the longest title.
 // One larger subject and two smaller companions form a vertical composition;
 // avoid trails or horizontal strings of icons extending over the lettering.
 const spots=names.length===4
  ? [[0,7,67,-8],[72,0,61,6],[12,83,112,4],[66,187,61,-6]]
  : [[7,82,112,-6],[72,0,62,8],[64,184,65,7]];
 const art=names.map((n,i)=>item(n,...spots[i])).join('');
 return `<g class="science-header-art" data-header-art="${key}" aria-hidden="true" transform="translate(886 26)">${art}</g>`;
}
