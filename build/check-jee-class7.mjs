import assert from 'node:assert/strict';
import {gcd,hcf,lcm,divides,isSquare,ev,num,round,pick,matchMap,alg,same,close,virahanka,tri,fr,corr,img,same2,mean,median,leap,terminates,solve,domino,run} from './jee-check.mjs';
// Keys are compared with the printed Answer rows, and each chapter's verify()
// recomputes every option so a distractor that is secretly right fails.
const records={
'p2ch06-constructions':{singles:'abcdbd',multis:['abd','ab','ad','abc'],numbers:[4,6*8/2,180-157.5],
 verify(){
  assert.equal(pick([65,75,85,105],x=>x===360-80-95-110),'b');
  assert.equal(pick([7,14,3.5,NaN],x=>x===7),'a');
  assert.equal(pick([108,135,120,144],a=>Number.isInteger(360/a)),'c');
  assert.equal(pick([[1,2],[2,3],[4,5],[1,1]],([r,c])=>domino(7,9,[[r,c]])),'d');
  assert.equal(90+90/2+90/4,157.5);
  assert.equal(pick([2,2.5,1.5,3],r=>r>5/2),'d');
  assert.equal(pick([60,90,108,120],a=>Number.isInteger(360/a)),'abd');
  const left=360-90-90-60;assert.equal(pick([120,60+60,90,135],a=>a===left),'ab');
  // Colour-balance is necessary; the two balanced grids have even sides, so rows of tiles fill them.
  assert.equal(pick([domino(5,6),(5*6-1)%2===0,domino(4,5,[[1,1],[2,2]]),domino(3,4)],x=>x),'ad');
  assert.equal((360-135-135),90);
  assert.deepEqual(matchMap([60,120,135,90],[135,90,60,120]),[3,4,1,2]);
  assert.deepEqual(matchMap([45,22.5,135,90],[90,135,45,22.5]),[3,4,2,1]);
 }},
'p2ch07-equations':{singles:'acbbda',multis:['acd','ac','abc','abd'],numbers:[solve('$\\frac{w}{5} + 3 = 7$','w')[0],solve('$5x + 7 = 2x + 25$')[0],solve('$3s + 12 = 2(s + 12)$','s')[0]],
 verify(){
  assert.equal(pick([7,4,-1,14],x=>solve('$4(x - 2) = 2x + 6$').includes(x)),'a');
  assert.equal(pick([18,9,6,10.5],p=>3*(p+12)+5*p===84),'c');
  assert.equal(pick([100,112,125,150],s=>Number.isInteger((s-2)/5)),'b');
  assert.deepEqual(solve('$\\frac{x}{3} - 2 = 5$'),[21]);
  assert.equal(pick([14,-2,7,2],x=>solve('$3 - 2x = 5x - 11$').includes(x)),'d');
  assert.deepEqual(solve('$3n + 4 = 19$','n'),[5]);
  assert.equal(pick(['$3n + 4 = 19$','$3(n + 4) = 19$','$4n + 3 = 19$','$3n = 19 + 4$'],e=>{const [l,r]=e.replaceAll('$','').split('=');return [1,2,7].every(n=>close(alg(l,{n})-alg(r,{n}),3*n+4-19));}),'a');
  assert.equal(pick(['$2m + 5 = -3$','$m - 4 = 0$','$3m = -12$','$10 - m = 14$'],e=>solve(e,'m').includes(-4)),'acd');
  assert.equal(pick(['$2x = 8$','$x + 3 = 11$','$4x + 6 = 22$','$2x = 14$'],e=>solve(e).includes(4)),'ac');
  assert.deepEqual(solve('$3p + 12 = 42$','p'),[10]);assert.equal(3*2+12,18);assert.notEqual(42-12,54);
  assert.equal((10-(-2))/(7-3),3);assert.notEqual((10+2)/(7+3),3);assert.equal(7*3-2,19);assert.equal(3*3+10,19);
  const L=['$2x + 5 = 17$','$3x - 4 = 2x + 1$','$4(x - 2) = 2x + 6$','$\\frac{x}{2} + 1 = 5$'].map(e=>solve(e)[0]);
  assert.deepEqual(matchMap(L,[7,8,6,5]),[3,4,1,2]);
  const R=['$2n - 3 = 15$','$2n + 3 = 15$','$\\frac{n}{2} + 3 = 15$','$2(n + 3) = 15$'].map(e=>solve(e,'n')[0]);
  assert.deepEqual(matchMap([(15-3)/2,15/2-3,(15+3)/2,(15-3)*2],R),[2,4,1,3]);
 }},

'p2ch04-decimals':{singles:'abcdab',multis:['abd','ac','acd','abc'],numbers:[6.3/4,[2008,2009,2010,2011,2012,2013,2014,2015].reduce((a,y)=>a+(leap(y)?366:365),0),48.6*2.5],
 verify(){
  assert.equal(pick([0.006,0.06,0.6,0.0006],x=>close(x,0.3*0.02)),'a');
  assert.equal(pick([25.08,250.80,2508,248.80],x=>close(x,104.5*2.4)),'b');
  const pr=4.5*0.8;assert(pr>0.8&&pr<4.5);
  assert.equal(pick([0.9,9,900,90],x=>close(x,7.2/0.08)),'d');
  assert.equal(pick([[5,12],[3,8],[7,20],[9,25]],([p,q])=>!terminates(p,q)),'a');
  assert.equal(pick([2024,2100,2000,2400],y=>!leap(y)),'b');
  assert.equal(pick([2345/100,234.5/10,2.345*100,0.2345*100],x=>close(x,23.45)),'abd');
  assert.equal(pick([0.5*1.8,1.2*0.9,0.25*3.9,2.5*0.4],x=>x<1-1e-12),'ac');
  assert.equal(pick([2032,2200,2800,2400],leap),'acd');
  assert.equal(pick([5*3===15,close(4.9*3.1,15.19),String(49*31)==='1519',4.9*3.1<4.9],x=>x),'abc');
  assert.deepEqual(matchMap([7/1000,0.058*1000,3.6*100,1250/1000].map(x=>+x.toFixed(6)),[58,1.25,0.007,360]),[3,1,4,2]);
  assert.deepEqual(matchMap([0.6*0.4,0.6/0.4,0.06*40,6/0.04].map(x=>+x.toFixed(6)),[2.4,150,0.24,1.5]),[3,4,1,2]);
 }},
'p2ch05-data':{singles:'acbdbc',multis:['acd','abc','bc','ac'],numbers:[5*18-4*16,median([12,8,15,10,12,21,9,12,10,11]),42/6<40/5?40/5-42/6:NaN],
 verify(){
  assert.equal(pick([25,20,27.5,33],x=>x===mean([45,0,30,25])),'a');
  assert.equal(pick([65,64,66,130],x=>x===(20*60+30*70)/50),'c');
  assert.equal(pick([3,4,5,8],x=>x===median([2,3,3,5,7,10])),'b');
  const s=[12,15,14,13,16,60],r=[12,15,14,13,16];
  assert.equal(pick([mean(s)<median(s),mean(s)===median(s),Math.abs(median(s)-median(r))>Math.abs(mean(s)-mean(r)),mean(s)>median(s)],x=>x),'d');
  const w=[12,14,13,15,96];assert.equal(mean(w),30);assert.equal(median(w),14);
  const v=[38,45,29,52,41,36,47];
  assert.equal(pick([median(v)===41,mean(v)===41,Math.max(...v)-Math.min(...v)===23,v.filter(x=>x>40).length>v.length/2],x=>x),'acd');
  const m=[34,41,28,45,37,30,49,36];
  assert.equal(pick([median(m)===36.5,Math.max(...m)-Math.min(...m)===21,mean(m)===37.5,m.includes(median(m))],x=>x),'abc');
  const c6=[45,60,35,50],c7=[50,55,40,70],tot=c6.map((x,i)=>x+c7[i]);
  assert.equal(pick([c7.reduce((a,b)=>a+b)>c6.reduce((a,b)=>a+b),c6[2]>c7[2],tot.indexOf(Math.max(...tot))===3&&tot.filter(t=>t===Math.max(...tot)).length===1,c7.every((x,i)=>x>c6[i])],x=>x),'ac');
  const d=[4,7,7,9,13];assert.deepEqual(matchMap([mean(d),median(d),13-4,40],[9,40,8,7]),[3,4,1,2]);
  assert.deepEqual(matchMap([mean([10,20,30]),mean([5,5,5,25]),mean([1,2,3,4,5,6]),mean([12,18])],[15,3.5,20,10]),[3,4,2,1]);
 }},

'p2ch01-geometric-twins':{singles:'bcabdb',multis:['abd','ab','abc','acd'],numbers:[180-2*50,24-7-9,180-2*65],
 verify(){
  assert.equal(pick([[80,80],[40,40],[45,35],[50,30]],([a,b])=>a===b&&a+b+100===180),'b');
  const m=corr('PQR','STU');assert.equal(pick([['PQ','TU'],['Q','U'],['QR','TU'],['PR','ST']],([a,b])=>same2(img(m,a),b)),'c');
  assert.equal(pick([70,60,50,110],x=>x===180-50-60),'a');
  // RHS: right angles B,E; AB=EF gives A→F, so C→D.
  const r=corr('ABC','FED');assert.equal(img(r,'B'),'E');assert(same2(img(r,'AB'),'EF'));assert(same2(img(r,'AC'),'DF'));
  assert.equal(pick(['DEF','EFD','DFE','FED'],t=>t==='FED'),'d');
  assert.equal(pick([100,130,110,120],x=>x===60+(180-40)/2),'b');
  const t=corr('ABC','RQP');assert(same2(img(t,'BA'),'QR'));assert(same2(img(t,'BC'),'QP'));
  assert.equal(pick([true,img(t,'A')==='P',same2(img(t,'AC'),'PR'),img(t,'BAC')==='QRP'],x=>x),'acd');
  assert.deepEqual(matchMap([(180-100)/2,180-2*50,(180-90)/2,180-2*30],[45,120,40,80]),[3,4,1,2]);
 }},
'p2ch02-integers':{singles:'bcdabc',multis:['acd','ac','bd','abc'],numbers:[-(-4+6*-3),(-3+11)/2,(3*30-40)/5===10?20:NaN],
 verify(){
  assert.equal(pick(['−26','−14','14','−20'].map(ev),x=>x===6-5*4),'b');
  const right=[...Array(21).keys()].filter(r=>3*r-(20-r)===40);assert.deepEqual(right,[15]);assert.equal(pick([14,16,15,13],x=>x===15),'c');
  assert.equal(pick(['60','12','−12','−60'].map(ev),x=>x===(-3)*(-4)*(-5)),'d');
  assert.equal(pick(['(−30) + 18','(−30) − 18','30 + (−18)','(−30) + (−3)'].map(ev),x=>x===-6*(5-3)),'a');
  for(const a of [-3,2])for(const b of [-4,5])for(const c of [-6,7])if(a*b<0&&b*c>0)assert(a*c<0);
  assert.equal(pick(['17','−1','−17','1'].map(ev),x=>x===-72/8+96/-12),'c');
  assert.equal(pick(['(−3) × 4','(−3) × (−4)','48 ÷ (−4)','(−20) − (−8)'].map(ev),x=>x===-12),'acd');
  assert.equal(pick([2+(-5)===-5+2,2-(-5)===-5-2,2*-5===-5*2,8/4===4/8],x=>x),'ac');
  assert.equal(pick(['(−2) × (−3) × (−4)','(−1) × (−1) × (−1) × (−1)','(−5) × 0','(−7) × (−8)'].map(ev),x=>x>0),'bd');
  const T=h=>6+h*(-14-6)/10;assert.equal(pick([-14-6===-20,(-14-6)/10===-2,T(5)===-4,T(6)===-8],x=>x),'abc');
  const q=[...Array(31).keys()].filter(r=>3*r-2*(30-r)===40);assert.deepEqual(q,[20]);
  assert.deepEqual([4+-7,4-(-7)],[-3,11]);
  assert.deepEqual(matchMap(['(−9) − 14','6 − (−15)','(−7) × 8','(−135) ÷ (−15)'].map(ev),['21','9','−56','−23'].map(ev)),[4,1,3,2]);
  assert.deepEqual(matchMap([(-1)**10,(-1)**11,(-2)**3,(-2)**2],[4,-1,1,-8]),[3,2,4,1]);
 }},

'ch07-three-lines':{singles:'cbddca',multis:['abd','ab','bd','acd'],numbers:[180-90-35,Math.max(...Array.from({length:20},(_,a)=>Array.from({length:20},(_,b)=>{const c=20-a-b;return a>0&&b>0&&c>0&&tri(a,b,c)?Math.max(a,b,c):0;})).flat()),3*180/6],
 verify(){
  assert.equal(pick([[3,5,9],[4,4,8],[6,7,12],[2,4,7]],t=>tri(...t)),'c');
  assert.equal(pick([115,65,75,113],x=>x===180-48-67),'b');
  assert.equal(pick([50,130,120,70],x=>x===180-60-(180-130)),'d');
  assert.equal(pick([3,4,14,8],x=>tri(5,9,x)),'d');
  assert.equal(pick([40,60,80,90],x=>x===4*180/9),'c');
  assert.equal(180-25-40,115);
  assert.equal(pick([[60,60,60],[90,45,45],[100,50,40],[120,30,20]],t=>t[0]+t[1]+t[2]===180),'ab');
  assert.equal(pick([9,7,2,4],d=>tri(3,5,d)),'bd');
  // at least two acute: for all integer triangles
  for(let a=1;a<179;a++)for(let b=1;a+b<180;b++){const c=180-a-b;assert([a,b,c].filter(x=>x<90).length>=2);assert.equal(180-c,a+b);}
  const kind=(a,b)=>{const c=180-a-b,t=[a,b,c];return t.includes(90)?'right':t.some(x=>x>90)?'obtuse':t.every(x=>x===60)?'equi':'acute';};
  assert.deepEqual(matchMap([kind(50,40),kind(25,40),kind(60,60),kind(70,50)],['obtuse','acute','right','equi']),[3,1,4,2]);
  const range=(a,b)=>`${Math.abs(a-b)}-${a+b}`;
  assert.deepEqual(matchMap([range(4,7),range(5,5),range(6,9),range(2,10)],['8-12','3-15','0-10','3-11']),[4,3,2,1]);
 }},
'ch08-fractions':{singles:'bdbaca',multis:['bd','abd','bcd','abd'],numbers:[fr('6 / (3/8)'),16*11/4,fr('3/4 * 2/3 * 120')],
 verify(){
  const F=a=>a.map(fr);
  assert.equal(pick(F(['13/14','2/3','27/50','3/2']),x=>close(x,fr('3/5*10/9'))),'b');
  assert.equal(pick(F(['3/32','1/6','3/8','6']),x=>close(x,fr('3/4 / (1/8)'))),'d');
  const g=F(['5*7/8','5/(7/8)','5*1','5/(8/7)']);assert.equal(pick(g,x=>x===Math.max(...g)),'b');
  assert.equal(pick(F(['10','45/8','1/10','30']),x=>close(x,fr('15/2 / (3/4)'))),'a');
  assert.equal(pick(F(['9/10','3/7','1/5','4/5']),x=>close(x,fr('2/5*1/2'))),'c');
  assert(close(fr('1/2*1/3'),fr('1/3*1/2')));
  assert.equal(pick(F(['7/8*5/3','7/8*2/3','7/8*1','7/8*9/10']),x=>x<7/8-1e-12),'bd');
  assert.equal(pick(F(['4/9*3/2','2/3','8/27','12/18']),x=>close(x,fr('4/9/(2/3)'))),'abd');
  assert.equal(pick(F(['2/5/4','2/5/(1/4)','2/5/(9/10)','2/5/(2/3)']),x=>x>0.4+1e-12),'bcd');
  assert.equal(pick([close(9/4*4/3,3),true,close(9/4*4/3,2+1/12),close(2*(9/4+4/3),7+1/6)],x=>x),'abd');
  assert.deepEqual(matchMap(F(['2/3*3/4','2/3/(3/4)','3/4/(2/3)','2/3*3/2']).map(x=>+x.toFixed(9)),F(['8/9','1','1/2','9/8']).map(x=>+x.toFixed(9))),[3,1,4,2]);
  assert.deepEqual(matchMap(F(['8/(2/5)','2/5*8','8/5','5*2/5']).map(x=>+x.toFixed(9)),F(['2','20','8/5','16/5']).map(x=>+x.toFixed(9))),[2,4,3,1]);
 }},

'ch05-parallel-lines':{singles:'acdacb',multis:['abd','ac','abc','abd'],numbers:[(180+30)/2,180*5/9,2*(180-48)],
 verify(){
  assert.equal(pick([36,45,144,72],x=>x===180/5),'a');
  assert.equal(pick(['43,47,43','47,133,47','133,47,133','133,133,47'],x=>x===[180-47,47,180-47].join()),'c');
  const ADC=180-110;assert.equal(pick([70,20,250,110],x=>x===180-ADC),'d');
  assert.equal(105+75,180);
  const at=a=>[a,180-a,a,180-a];assert.equal(pick([2,3,4,6],x=>x===[...at(58),...at(58)].filter(y=>y===122).length),'c');
  assert.equal(pick([35,145,55,325],x=>x===180-35),'b');
  assert.equal(pick([75===75,100+80===180,false,64===64],x=>x),'abd');
  assert.equal(pick([62,180-62,2*62+2*(180-62),90],(x,i)=>[62,118,360].includes(x)),'abc');
  assert.deepEqual(matchMap([65,180-65,180/4,360],[115,360,65,45]),[3,1,4,2]);
  assert.deepEqual(matchMap([50,180-50,80,180-80],[100,50,130,80]),[2,3,4,1]);
 }},
'ch06-number-play':{singles:'bcbadb',multis:['ab','ac','abd','bd'],numbers:[virahanka(8),3*25,72],
 verify(){
  const odd=n=>Math.abs(n)%2===1;
  assert(Array.from({length:200},()=>{const r=()=>Math.floor(Math.random()*100);return odd(Array.from({length:7},()=>2*r()+1).reduce((a,b)=>a+b)+Array.from({length:4},()=>2*r()).reduce((a,b)=>a+b));}).every(Boolean));
  assert.deepEqual([1,2,3,4].map(n=>(5*n+3)%2),[0,1,0,1]);
  assert.equal(pick([15,45,30,135],x=>x===(11+19)*9/2/3),'b');
  assert.equal(pick([21,13,14,34],x=>x===virahanka(7)),'a');
  const sols=[];for(let P=1;P<10;P++)for(let Q=1;Q<10;Q++)if(10*P+Q+10*Q+P===121)sols.push(P+Q);
  assert(sols.length&&sols.every(s=>s===11));assert.equal(pick([12,10,1,11],x=>x===11),'d');
  assert.equal(pick([6,5,4,0],x=>x===6-1),'b');
  const valid=s=>s.split(', ').map(Number).every((c,k)=>c<=k);
  assert.equal(pick(['0, 1, 2, 3, 4','0, 0, 0, 0, 0','1, 0, 0, 0, 0','0, 1, 1, 4, 2'],valid),'ab');
  assert.equal(pick([odd(5*7),odd(6*7),odd(3*7+2*4),odd(3*5+1)],x=>x),'ac');
  const lo=[[2,7,6],[9,5,1],[4,3,8]];for(const r of lo)assert.equal(r.reduce((a,b)=>a+b),15);
  for(let c=0;c<3;c++)assert.equal(lo[0][c]+lo[1][c]+lo[2][c],15);assert.equal(2+5+8,15);assert.equal(6+5+4,15);
  const V=Array.from({length:10},(_,i)=>virahanka(i+1));
  assert.equal(pick([V[9]===88,V.every((v,i)=>(v%2===0)===(i%3===1)),V.some((v,i)=>i&&v%2===0&&V[i-1]%2===0),V.filter(v=>v%2===0).length===3],x=>x),'bd');
  let AB=[];for(let A=0;A<10;A++)for(let B=0;B<10;B++)if(70+A-(10*A+7)===10*B+5&&A>0)AB.push([A,B]);assert.deepEqual(AB,[[2,4]]);
  assert.deepEqual(matchMap([virahanka(8),15,virahanka(5),45],[15,45,34,8]),[3,1,4,2]);
  assert.deepEqual(matchMap([25,30,45-12-14,virahanka(6)],[13,19,25,30]),[3,4,2,1]);
 }},

'ch03-decimals':{singles:'bacdbd',multis:['abd','bd','ac','abc'],numbers:[12*6+3,100-(38.50+12.75),2+7*(2/10)],
 verify(){
  assert.equal(pick([3.5,3.05,3.005,0.35],x=>close(x,3+5/100)),'b');
  assert.equal(pick([3.85,3.31,2.545,1452.4],x=>close(x,2.4+0.850+0.600)),'a');
  const inc=l=>l.split(', ').map(Number).every((x,i,a)=>!i||a[i-1]<x);
  assert.equal(pick(['0.5, 0.45, 0.405, 0.054','0.054, 0.45, 0.405, 0.5','0.054, 0.405, 0.45, 0.5','0.5, 0.405, 0.45, 0.054'],inc),'c');
  assert.equal(pick([4.25,3.85,4.75,3.75],x=>close(x,7.2-3.45)),'d');
  assert.equal(pick(['6:15','5:45','5:42','5:07'],x=>{const [h,m]=x.split(':').map(Number);return (h-3)*60+m===2.75*60;}),'b');
  assert.equal(pick([6.11,5.09,6.0,6.09],x=>close(x,6.1-0.01)),'d');
  assert.equal(pick([6/10,60/100,0.06,0.600],x=>close(x,0.6)),'abd');
  assert.equal(pick([2.49,2.51,2.500,2.6],x=>x>2.5),'bd');
  assert.equal(pick([1000+75,1000+750,1075,1.75*1000],x=>x===1.075*1000),'ac');
  const t=n=>7.8-0.45*(n-1);
  assert.equal(pick([close(7.35-6.9,0.45)&&close(7.8-7.35,0.45),close(t(4),6.45),close(t(5),6),close(t(10),3.8)],x=>x),'abc');
  assert.deepEqual(matchMap([7.4,8.25,1.075,0.54],[0.54,7.4,1.075,8.25]),[2,4,3,1]);
  assert.deepEqual(matchMap([0.7,0.07,0.007,70],[0.07,70,0.7,0.007]),[3,1,4,2]);
 }},
'ch04-letter-numbers':{singles:'bcdadb',multis:['acd','ab','abc','ac'],numbers:[30+15*12,4*38-2,alg('$5p - 2(p - 4)$',{p:7})],
 verify(){
  const P=4*7+3*9;assert.equal(pick(['$100 - 4p + 3n$','$100 - (4p + 3n)$','$100 - 7pn$','$4p + 3n - 100$'],x=>alg(x,{p:7,n:9})===100-P),'b');
  assert.equal(pick(['$3x - 3$','$3x$','$3x + 3$','$7x + 3$'],x=>same(x,'$5x - (2x - 3)$',['x'])),'c');
  assert.equal(pick(['$4a - 7b$','$4a - b$','$8a - 7b$','$4a + b$'],x=>same(x,'$3(2a - b) - 2(a - 2b)$',['a','b'])),'d');
  for(const c of [15,22]){const s=[-8,-7,-6,-1,0,1,6,7,8].reduce((a,d)=>a+c+d,0);assert.equal(s,9*c);assert.notEqual(s,3*c);assert.notEqual(s,c+72);}
  const hex=h=>6+5*(h-1);assert.equal(pick(['$6h$','$6h - 1$','$5h + 6$','$5h + 1$'],x=>[1,2,3,4,9].every(h=>alg(x,{h})===hex(h))),'d');
  assert.equal(pick([-1,11,5,17],x=>x===alg('$4m - 3(m - 2)$',{m:5})),'b');
  assert.equal(pick(['$3a - 3b$','$3a - b$','$-3(b - a)$','$a - b + 2a - 2b$'],x=>same(x,'$3(a - b)$',['a','b'])),'acd');
  const v={a:2,b:-5};assert.equal(pick([alg('3(a - b)',v)===21,alg('a + b',v)===-3,alg('ab',v)===10,alg('2a - b',v)===-1],x=>x),'ab');
  const seats=n=>n===1?4:4+2*(n-1);
  assert.equal(pick([seats(4)===10,seats(15)===32,Array.from({length:50},(_,i)=>seats(i+1)).every(s=>s%2===0),seats(10)===20],x=>x),'abc');
  assert.equal(pick([151,150,99,2],x=>Number.isInteger((x-1)/2)&&x>=3),'ac');
  let rose=0,pos=0;const cyc=['marigold','rose','jasmine','lily'];while(rose<38){pos++;if(cyc[(pos-1)%4]==='rose')rose++;}assert.equal(pos,150);
  const L=['$5x - (2x - 3)$','$5x - (2x + 3)$','$5x + (2x - 3)$','$2(x + 3) + x$'],R=['$7x - 3$','$3x + 6$','$3x + 3$','$3x - 3$'];
  assert.deepEqual(L.map(l=>R.findIndex(r=>same(l,r,['x']))+1),[3,4,1,2]);
  const sq=n=>4+3*(n-1);assert.deepEqual([[n=>4*n+20,'$4n + 20$'],[hex,'$5n + 1$'],[seats,'$2n + 2$'],[sq,'$3n + 1$']].map(([f,e])=>[1,2,5].every(n=>f(n)===alg(e,{n}))),[true,true,true,true]);
 }},

'ch01-large-numbers':{singles:'cbabda',multis:['abd','ab','abc','abd'],numbers:[496*125,4+0+7+3+9+0,120*75*4],
 verify(){
  assert.equal(3e9/1e7,300);
  assert.equal(pick([49e7,5e7,4.95e7,4.953e7],x=>x===round(49532110,1e6)),'b');
  assert.equal(String(1e5*1e3).length,9);assert.equal(String(999999*9999).length,10);
  assert(1e7/86400>110&&1e7/86400<125);
  assert.equal(pick(['8999999','9999999','900000','9000000'],x=>+x===9999999-1e6+1),'d');
  assert.equal(pick(['69993000','69999300','70007000','0'],x=>+x===7e7-7000),'a');
  assert.equal(pick([100*1e5,10*1e6,1000*1000,10000*1000],x=>x===1e7),'abd');
  assert.equal(pick(['5,46,120','5,54,999','5,44,999','5,55,010'],x=>round(num(x),1e4)===550000),'ab');
  const presses=n=>String(n).split('').reduce((a,d)=>a+ +d,0);
  assert.equal(presses(320050),10);assert.deepEqual([...'320050'].map(Number),[3,2,0,0,5,0]);
  assert.equal(pick([72*60===4320,72*60*24===103680,Math.abs(72*60*24-1e7)<1e6,72*60*24*7>7e5],x=>x),'abd');
  assert.equal(presses(407390),23);
  assert.deepEqual(matchMap([1e6,1e9,1e5,1e7],[1e5,1e7,1e6,1e9]),[3,4,1,2]);
  assert.deepEqual(matchMap([100,1000,10000,100000].map(t=>round(648572,t)),[649000,650000,600000,648600]),[4,1,2,3]);
 }},
'ch02-arithmetic-expressions':{singles:'bcdabc',multis:['acd','ac','abc','abd'],numbers:[ev('347 − 189 + 153 − 111'),24*17,(1250-385)-(1245-390)],
 verify(){
  assert.equal(pick([228,28,4,52],x=>x===ev('40 − 4 × 6 + 12')),'b');
  assert.equal(pick(['250 − 80 − 30','250 + 80 − 30','250 − 80 + 30','250 + 80 + 30'],x=>ev(x)===ev('250 − (80 − 30)')),'c');
  assert.equal(pick([2700,2727,2601,2673],x=>x===27*99),'d');
  assert.equal(pick(['6 × (13 + 7)','6 × 13 + 7','(6 + 6) × (13 + 7)','6 + 13 × 6 + 7'],x=>ev(x)===ev('6 × 13 + 6 × 7')),'a');
  assert.equal(pick(['500 − 185 + 45 + 100','500 − (185 + 45) + 100','500 − (185 − 45) + 100','500 − 185 − 45 − 100'],x=>ev(x)===500-185-45+100),'b');
  assert.equal(pick([34,70,82,782],x=>x===ev('100 − 3 × (20 − 4 × 3) + 6')),'c');
  assert.equal(pick(['64 + 18 − 30','64 − 18 + 30','64 − 12','64 + (−30) + 18'],x=>ev(x)===ev('64 − (−18 + 30)')),'acd');
  assert.equal(pick(['100 × 45 + 2 × 45','100 × 45 + 2','103 × 45 − 45','102 × 40 + 5'],x=>ev(x)===102*45),'ac');
  assert.equal(pick(['45 − (20 + 25)','45 − 20 − 25','7 × 8 − 8 × 7','12 − (5 − 7)'],x=>ev(x)===0),'abc');
  assert.deepEqual(matchMap(['4 × (12 − 5)','4 × 12 − 5','4 + 12 × 5','(4 + 12) × 5'].map(ev),[43,80,28,64]),[3,1,4,2]);
  assert.deepEqual(matchMap(['50 − (20 + 5)','50 − (20 − 5)','50 + (20 − 5)','50 − (−20 − 5)'].map(ev),['50 + 20 + 5','50 − 20 − 5','50 + 20 − 5','50 − 20 + 5'].map(ev)),[2,4,3,1]);
 }},

'p2ch03-hcf-lcm':{singles:'cbaadb',multis:['abc','ac','acd','abd'],numbers:[
  lcm(12,16,20)+7,(480/hcf(480,336))*(336/hcf(480,336)),Array.from({length:10000},(_,i)=>i+1).find(n=>isSquare(n)&&divides(lcm(6,8,15),n))],
 verify(){
  const pick=(opts,ok)=>opts.map((o,i)=>ok(o)?'abcd'[i]:'').join('');
  assert.equal(pick([14,21,42,252],x=>x===hcf(84,126)),'c');
  assert.equal(pick([180,360,720,120],x=>x===lcm(18,24,30)),'b');
  assert.equal(pick([60,48,72,90],x=>hcf(36,x)===12&&lcm(36,x)===180),'a');
  const rem=d=>245%d===5&&1029%d===5;
  assert.equal(pick([16,48,8,32],x=>rem(x)&&!Array.from({length:1029},(_,i)=>i+1).some(d=>d>x&&rem(d))),'a');
  assert.equal(lcm(12,18,30),180); // 8:00 + 3 h = 11:00, option (d)
  let pairs=0;for(let a=1;a<=32;a++)if(hcf(a,64-a)===8)pairs++;assert.equal(pairs,2);
  assert.equal(pick([hcf(48,180)===12,lcm(48,180)===720,48*180===12*720,hcf(48,180)===1],x=>x),'abc');
  const N=2*2*2*3*3*5;assert.equal(pick([24,27,45,16],x=>divides(x,N)),'ac');
  assert.equal(pick([[35,36],[51,85],[49,81],[77,120]],([a,b])=>hcf(a,b)===1),'acd');
  // (c) fails on a counterexample; (a), (b), (d) checked across a range.
  for(let a=1;a<60;a++)for(let b=1;b<60;b++){assert(divides(hcf(a,b),lcm(a,b)));assert.equal(hcf(a,b)*lcm(a,b),a*b);}
  for(let a=1;a<500;a++)assert.equal(hcf(a,a+1),1);assert.equal(lcm(4,12),12);
  assert.deepEqual([hcf(36,60),lcm(36,60),hcf(45,75),lcm(8,14)],[12,180,15,56]);
  assert.deepEqual([hcf(24,36),lcm(24,36),lcm(8,12),hcf(18,30)],[12,72,24,6]);
 }},
};
run('class-7',records);
