import assert from 'node:assert/strict';
import {gcd,hcf,lcm,divides,isSquare,pick,matchMap,close,mean,median,solve,alg,same,run} from './jee-check.mjs';
// Keys are compared with the printed Answer rows, and each chapter's verify()
// recomputes every option so a distractor that is secretly right fails.
const isCube=n=>Math.round(Math.cbrt(n))**3===n;
const factorCount=n=>{let c=0;for(let d=1;d<=n;d++)if(n%d===0)c++;return c;};
const lastDigit=(b,e)=>{let r=1;for(let i=0;i<e;i++)r=(r*b)%10;return r;};
const roman=s=>{const v={I:1,V:5,X:10,L:50,C:100,D:500,M:1000};let t=0;for(let i=0;i<s.length;i++){const a=v[s[i]],b=v[s[i+1]]||0;t+=a<b?-a:a;}return t;};
// Standard subtractive form: only I before V/X, X before L/C, C before D/M.
const toRoman=n=>[[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']].reduce((s,[v,r])=>{while(n>=v){s+=r;n-=v;}return s;},'');
const base=(s,b)=>parseInt(s,b);
const diag=n=>n*(n-3)/2, angleSum=n=>(n-2)*180;
const PI=22/7;
const hyp=(a,b)=>Math.sqrt(a*a+b*b), triple=(a,b,c)=>a*a+b*b===c*c;
const records={
'p2ch04-shapes':{singles:'abcdab',multis:['abc','abd','ac','acd'],numbers:[Math.min(Math.hypot(12,5+4),Math.hypot(12+5,4),Math.hypot(12+4,5)),3**4,81*81*(8/9)**2],
 verify(){
  assert.equal(pick([6,18,2,27],x=>x===54/9),'a');
  assert.equal(pick([6,7,8,729],n=>3**n===2187),'b');
  assert.equal(pick([10,20,18,9],e=>e===2*(10-1)),'c');
  assert.equal(pick([10,50,8,12],v=>20+v-30===2),'d');
  assert.equal(pick([125,25,150,216],v=>v===Math.sqrt(150/6)**3),'a');
  assert.equal(pick([6,8,5,10],n=>5*n===40),'b');
  const pp={F:6,V:6,E:10};assert.equal(pick([true,pp.F===6,pp.E===10,pp.V===5],x=>x),'abc');assert.equal(pp.F+pp.V-pp.E,2);
  const hp={F:8,V:12,E:18};assert.equal(pick([hp.V===12,hp.E===18,hp.F===6,hp.F+hp.V-hp.E===2],x=>x),'abd');
  assert.equal(pick([true,false,1+4===5,false],x=>x),'ac');
  const open=10*6+2*10*4+2*6*4;assert.equal(pick([open===188,open+60===228,10*6*4===240,true],x=>x),'acd');
  assert.equal(Math.hypot(12,9),15);
  assert.deepEqual(matchMap([9,8,12,6],[12,6,9,8]),[3,4,1,2]);
  assert.deepEqual(matchMap(['cube','triangular prism','square pyramid','triangular pyramid'],['triangular prism','cube','triangular pyramid','square pyramid']),[2,1,4,3]);
 }},
'p2ch05-data':{singles:'abcdab',multis:['abc','ab','abc','ac'],numbers:[median([14,9,21,9,17,30,12,25,40]),4*7-4-6-8,(25*40+15*48)/40],
 verify(){
  assert.equal(pick([42,50,41,44],x=>x===(9*40+60)/10),'a');
  assert.equal(pick([25,24.5,26,23],x=>x===(250-19-35)/8),'b');
  assert.equal(pick([13.5,33.5,67.5,70],x=>x===13.5*5),'c');
  assert.equal(pick([14,17,16,15.5],x=>x===median([14,9,21,9,17,30,12,25])),'d');
  assert.equal(pick([14,18,16,12],x=>x===6*18-(12+15+20+22+25)),'a');
  assert.equal(pick([44.1,45.9,46.8,45],x=>close(x,(900+64-46)/20)),'b');
  const v=[9,12,13,15,21];assert.equal(pick([v.reduce((a,b)=>a+b-14,0)===0,mean(v)===14,median(v)===13,mean(v)===15],x=>x),'abc');
  const d=[3,8,1,12],s=d.map(x=>x+5),rg=a=>Math.max(...a)-Math.min(...a);
  assert.equal(pick([mean(s)===mean(d)+5,median(s)===median(d)+5,rg(s)===rg(d)+5,mean(s)===2*mean(d)],x=>x),'ab');
  const f=10,data=[...Array(4).fill(1),...Array(f).fill(2),...Array(6).fill(3)];
  assert(close(mean(data),2.1));assert.equal(pick([f===10,data.length===20,median(data)===2,false],x=>x),'abc');
  assert.equal(pick([240-210===30,close(30/210,0.3),(240-200)/(210-200)===4,240/210===4],x=>x),'ac');
  assert.deepEqual(matchMap([mean([2,3,3,5,7,10]),median([2,3,3,5,7,10]),10-2,30],[8,30,5,4]),[3,4,1,2]);
  assert.deepEqual(matchMap([25,60,44,12],[12,44,25,60]),[3,4,2,1]);
 }},
'p2ch06-algebra-play':{singles:'abcdab',multis:['abc','abd','abc','abcd'],numbers:[(38/2+5)/3,((30+10)/2+10)/2,Math.max(...[[72,8],[82,7],[78,2],[87,2],[27,8],[28,7]].map(([a,b])=>a*b))],
 verify(){
  for(const n of [1,5,13])assert.equal((3*n+12)/3-n,4);
  assert.equal(pick([7,14,28,3.5],k=>[1,6,9].every(n=>(4*n+k)/2-2*n===7)),'b');
  assert.equal(pick([25,3,75,100],x=>(4*7+3)*25+19-x===719),'c');
  assert.equal(pick([17,13,1,9],x=>x===153/9-8),'d');
  let ok=[];for(let a=1;a<10;a++)for(let b=0;b<10;b++)if(a+b===12&&(10*a+b)-(10*b+a)===18)ok.push(10*a+b);assert.deepEqual(ok,[75]);
  assert.equal(pick([20,40,80,36],t=>t===(()=>{let r=[2,4,6,8];while(r.length>1)r=r.slice(1).map((x,i)=>x+r[i]);return r[0];})()),'b');
  assert.equal(pick([7,11,13,17],d=>385385%d===0),'abc');
  assert.equal(pick([2220%111===0,2220/111===20,2220/111===22,992+929+299===2220],x=>x),'abd');
  const a=(104-16)/4;assert.equal(pick([a===22,a+8===30,true,Number.isInteger((105-16)/4)],x=>x),'abc');
  const t=48-40;assert.equal(pick([20-t===12,t===8,20*2===40,20*3===60],x=>x),'abcd');
  assert.equal((8*3-5)*2,38);let c=15;c=2*c-10;c=2*c-10;assert.equal(c,30);
  assert.deepEqual(matchMap([5,15,25,40],[25,40,5,15]),[3,4,1,2]);
  assert.deepEqual(matchMap([10/2,12/3,30/5,0],[0,6,5,4]),[3,4,2,1]);
 }},
'p2ch07-area':{singles:'abcdab',multis:['abc','ab','abd','abc'],numbers:[6*2*2,330*264/43560,14*9+14*6/2],
 verify(){
  assert(close(10.5**2-15*6,20.25));
  assert.equal(pick([162,180,18,1620],x=>x===(450/30)*(360/30)),'b');
  assert.equal(pick([54,6,7.2,7.5],h=>close(15*h/2,54)),'c');
  assert.equal(pick([12,7,14,6],h=>14*h===84),'d');
  const other=2*Math.sqrt(25**2-24**2);assert.equal(pick([336,600,1200,672],x=>x===48*other/2),'a');
  assert.equal(pick([3.5,7,14,5.7],h=>close(13*h,91)),'b');
  assert.equal(pick([50/2===25,true,50-25===25,false],x=>x),'abc');
  assert.equal(pick([14*10/2===70,20*3.5===70,14*10===70,14*10/2===140],x=>x),'ab');
  assert.equal(pick([100*100===10000,7.5*10000===75000,1000*1000===1000,2*2===4],x=>x),'abd');
  const A=(14+10)/2*6;assert.equal(pick([A===72,24*6/2===A,12*6===A,A===144],x=>x),'abc');
  assert.deepEqual(matchMap([25*14,14*48/2,(16+10)/2*7,6*5/2],[91,15,350,336]),[3,4,1,2]);
  assert.deepEqual(matchMap([1e4,144,1e6,100],[100,1e6,1e4,144]),[3,4,2,1]);
 }},

'p2ch01-percentages':{singles:'abcdab',multis:['abd','abc','ab','abc'],numbers:[(0.2*400-48)/0.8,80000*0.8*0.8,Math.round((1.17/0.9-1)*100)],
 verify(){
  assert.equal(pick([820,810,900,166],x=>close(x*0.45,369)),'a');
  assert.equal(pick([684.25,700,680,610],x=>close(x*0.85,595)),'b');
  assert.equal(pick([25,24,26,30],x=>close(1+x/100,1.2*1.05)),'c');
  assert.equal(pick([13800,13230,12600,13891.5],x=>close(x,12000*1.05**3)),'d');
  assert.equal(pick([35,65,53.8,7],x=>close(x,7/20*100)),'a');
  assert.equal(pick([150,60,40,200/3],x=>close(x,150/250*100)),'b');
  assert.equal(pick([7/8,0.875,875/100,35/40],x=>close(x,0.875)),'abd');
  assert.equal(pick([640-544===96,close(96/640,0.15),close(544/640,0.85),close(544*1.15,640)],x=>x),'abc');
  const sp=2400*1.25*0.9;assert.equal(pick([2400*1.25===3000,close(sp,2700),close((sp-2400)/2400,0.15),close((sp-2400)/2400,0.25)],x=>x),'ab');
  assert.equal(pick([close(312/480,0.65),406/580>312/480,406>312,close((406/580-312/480)*100,10)],x=>x),'abc');
  assert(close((48+40)/(400+40),0.2));assert(close(1.3*0.9,1.17));
  assert.deepEqual(matchMap([0.64,0.004,2.25,0.045].map(x=>+x.toFixed(6)),[0.045,16/25,2.25,1/250].map(x=>+x.toFixed(6))),[2,4,3,1]);
  assert.deepEqual(matchMap([1.2,0.8,1.2*0.8,1.25*0.8].map(x=>+x.toFixed(6)),[1,0.96,1.2,0.8]),[3,4,2,1]);
 }},
'p2ch02-baudhayana':{singles:'abcdab',multis:['abd','acd','ab','abd'],numbers:[(49-1)/2,hyp(1.2,0.5),3*12],
 verify(){
  assert.equal(pick([52,68,56,44],x=>close(x,hyp(20,48))),'a');
  assert.equal(pick([49,63,61,81],x=>x*x+16*16===65*65),'b');
  assert.equal(pick([5,7.5,8,9.8],x=>close(x*x+3.9**2,8.9**2)),'c');
  assert.equal(pick([49,45,40,41],x=>close(x,hyp(9,40))),'d');
  assert.equal(pick([[33,56,65],[6,7,9],[5,11,13],[8,14,17]],t=>triple(...t)),'a');
  assert.equal(pick([3*Math.SQRT2,6,9,36],x=>close(x*x,36)),'b');
  assert.equal(pick([[27,36,45],[12,35,37],[6,7,9],[13,84,85]],t=>triple(...t)),'abd');
  const m=8,n=3;assert.equal(pick([m*m-n*n===55,2*m*n===24,m*m+n*n===73,triple(55,48,73)],x=>x),'acd');
  assert.equal(pick([2*2+6*6===40,Math.sqrt(4+9+36)===7,Math.sqrt(4+9+36)===11,Math.sqrt(4+9)===5],x=>x),'ab');
  assert.equal(pick([hyp(60,80)===100,hyp(60,80)!==99,false,hyp(60,80)-99===1],x=>x),'abd');
  assert(close(hyp(24,7),25));assert(close(hyp(1.2,0.5),1.3));assert(triple(36,105,111));
  assert.deepEqual(matchMap([hyp(5,12),hyp(8,15),hyp(7,24),hyp(20,21)],[25,29,13,17]),[3,4,1,2]);
  const box=r=>[Math.floor(Math.sqrt(r)*100)/100,(Math.floor(Math.sqrt(r)*100)+1)/100].join(' and ');
  assert.deepEqual(matchMap([2,3,5,8].map(box),['1.73 and 1.74','2.82 and 2.83','2.23 and 2.24','1.41 and 1.42']),[4,1,3,2]);
 }},
'p2ch03-proportion':{singles:'abcdab',multis:['abd','ab','abc','abcd'],numbers:[1/(1/4-1/6),1350/25*40,1.2/3*8],
 verify(){
  assert.equal(pick([12,108,15,9],x=>7*36===21*x),'a');
  assert.equal(pick([450,490,520,441],x=>x===315/9*14),'b');
  assert.equal(pick([1000,1200,1400,1500],x=>x===3000/15*7),'c');
  assert.equal(pick([22.5,2250,30,225],km=>close(km,7.5*3000000/100000)),'d');
  assert.equal(pick([5,7.2,4.8,6],t=>close(t,40*6/48)),'a');
  assert.equal(pick([12.5,6,25,5],t=>close(t,1/(1/10+1/15))),'b');
  assert.equal(pick([[14,35],[2,5],[12,25],[18,45]],([a,b])=>a*15===b*6),'abd');
  assert.equal(pick([true,true,false,false],x=>x),'ab'); // speed×time and workers×days are constant; cost/notebooks and scale are ratios
  assert.equal(pick([1250*72/360===250,72/360===0.2,500/1250*360===144,90/360*1250===300],x=>x),'abc');
  const l=42/7*4,b=42/7*3;assert.equal(pick([l===24,b===18,l*b===432,hyp(l,b)===30],x=>x),'abcd');
  assert.deepEqual(matchMap([2000/250,250/100,4*250/100,12*250/100].map(String),['30','8','2.5','10']),[2,3,4,1]);
  assert.deepEqual(matchMap([480,300,240,180].map(x=>x*360/1200),[72,54,144,90]),[3,4,1,2]);
 }},

'ch04-quadrilaterals':{singles:'cabdab',multis:['ac','abd','abc','acd'],numbers:[diag(9)-diag(7),(540-100)/5+40,30/5*3],
 verify(){
  assert.equal(pick([9,10,11,12],n=>diag(n)===44),'c');
  assert.equal(pick([160,148,120,112],x=>x===angleSum(6)-5*112),'a');
  assert.equal(pick([24,30,28,36],n=>close(angleSum(n)/n,168)),'b');
  const x=[...Array(100).keys()].find(x=>3*x+10===5*x-30);assert.equal(pick([70,140,20,110],v=>v===180-(3*x+10)),'d');
  assert.equal(pick([24,22,12,11],n=>close(angleSum(n)/n,11*360/n)),'a');
  assert.equal(pick([55,35,70,110],v=>v===(180-110)/2),'b');
  // Parallelogram with 60/120 angles, sides 2 and 3: diagonals differ.
  const d1=Math.sqrt(4+9-12*Math.cos(Math.PI/3)),d2=Math.sqrt(4+9+12*Math.cos(Math.PI/3));assert(!close(d1,d2));
  assert.equal(pick([90,35,(180-70)/2,70],(v,i)=>[90,35,55].includes(v)&&!(i===3)),'abc');assert.equal(180-70,110);
  assert.equal(pick([true,close(360/7,50),360/9===40,angleSum(8)===1080],x=>x),"acd");
  assert.deepEqual(matchMap([angleSum(6)/6,360/8,angleSum(5),diag(6)],[9,540,120,45]),[3,4,2,1]);
 }},
'ch03-story-of-numbers':{singles:'abcdab',multis:['ac','abd','acd','abc'],numbers:[(1000-2*360)/20,Math.floor((4000-3600)/60),7e5+300+9],
 verify(){
  assert.equal(pick(['MDCXLIX','MDCIL','MDCXLVIIII','MCDXLIX'],r=>r===toRoman(1649)),'a');
  assert.equal(pick([2596,2496,2694,2406],x=>x===roman('MMCDXCVI')),'b');
  assert.equal(pick([810,1458,6561,5832],x=>x===729*9),'c');
  assert.equal(pick([392,407,3042,397],x=>x===base('3042',5)),'d');
  assert.equal(pick([53,43,101,27],x=>x===base('110101',2)),'a');
  assert.equal(pick(['10102','10201','1021','11001'],s=>s===(100).toString(3)),'b');
  assert.equal(pick(['XL','IC','XC','VX'],r=>toRoman(roman(r))===r),'ac');
  assert.equal(pick([2*3600+46*60+40===1e4,166*60+40===1e4,1e4>3*3600,2*3600+46*60+40===1e4],x=>x),'abd');
  assert.equal(pick([true,Number.isInteger(Math.log(128)/Math.log(4)),256+2*16+3*4===300,(300).toString(4)==='10230'],x=>x),'acd');
  const d=String(40506).split('').map(Number);// 4,0,5,0,6
  assert.equal(pick([d[0]===4,d[2]===5,d.reduce((a,b)=>a+b)===15,d[3]===1],x=>x),'abc');
  assert.equal(1000-2*360-14*20,0);assert.equal(1*3600+6*60+40,4000);
  assert.deepEqual(matchMap(['XLIX','XCIV','CDXL','MCM'].map(roman),[1900,49,440,94]),[2,4,3,1]);
  assert.deepEqual(matchMap([base('1011',2),base('32',4),base('44',5),base('120',3)],[15,24,11,14]),[3,4,2,1]);
 }},
'ch01-square-and-cube':{singles:'bdcabc',multis:['bd','abc','bc','acd'],numbers:[Math.sqrt(1764),61**2,4375/125],
 verify(){
  assert.equal(pick([6724,3528,1296,7056],x=>!isSquare(x)),'b');
  assert.equal(pick([1560,1640,3200,1600],x=>x===Array.from({length:40},(_,i)=>2*i+1).reduce((a,b)=>a+b)),'d');
  assert.equal(pick([49,51,50,52],x=>x===26**2-25**2-1),'c');
  const q=[5,2,13,10].filter(d=>isSquare(3380/d));assert.equal(Math.min(...q),5);assert.equal(pick([5,2,13,10],d=>d===5),'a');
  assert.equal(pick([58,62,68,72],r=>r**3===238328),'b');
  const k=[5,10,25,50].find(x=>isCube(2560*x));assert.equal(pick([5,10,25,50],x=>x===k),'c');
  const ends=new Set(Array.from({length:10},(_,d)=>d*d%10));assert.equal(pick([2,4,7,9],d=>ends.has(d)),'bd');
  assert.equal(pick([factorCount(196)%2===1,Math.sqrt(196)===14,4*49===196,isCube(196)],x=>x),'abc');
  let block=0;for(let o=111;o<=131;o+=2)block+=o;
  assert.equal(pick([11**3===1221,block===1331,Math.cbrt(-1331)===-11,close((-0.2)**3,-0.08)],x=>x),'bc');
  const open=n=>factorCount(n)%2===1;const opens=Array.from({length:100},(_,i)=>i+1).filter(open);
  assert.equal(pick([open(81),open(72),opens.length===10,open(100)],x=>x),'acd');
  assert(isCube(4375/35));for(const d of [1,5,7])assert(!isCube(4375/d));
  assert.deepEqual(matchMap([Math.sqrt(2809),Math.round(Math.cbrt(3375)),225,16**2-15**2-1],[30,225,53,15]),[3,4,2,1]);
  assert.deepEqual(matchMap([lastDigit(23,2),lastDigit(23,3),lastDigit(18,2),lastDigit(18,3)],[2,7,4,9]),[4,2,3,1]);
 }},
'ch02-power-play':{singles:'abcdab',multis:['acd','abc','ac','ab'],numbers:[(2**5*3**4*7)/(6**3*14),5-3,5**3*10**2],
 verify(){
  assert.equal(pick([0,32,-32,16],x=>x===(-2)**4-2**4),'a');
  assert.equal(pick([3,4,5,6],n=>(2**3)**n*2**2===2**14),'b');
  assert.equal(pick([36,24,18,12],e=>3**e===27**4*9**3),'c');
  assert.equal(pick([7/12,7,1/7,12/7],x=>close(x,1/(1/3+1/4))),'d');
  assert.equal(pick([0,4,6,8],d=>d===(lastDigit(3,25)+lastDigit(7,25))%10),'a');
  assert.equal(pick([18,729,216,36],x=>x===3**6),'b');
  assert.equal(pick([(2**3)**4,2**3*2**4,4**6,8**4],x=>x===2**12),'acd');
  for(const x of [2,-3,0.5]){assert.equal(x**0,1);assert(close(x**-2,1/x**2));assert(close((x**-2)**3*x**4/x**-5,x**3));assert(!close(x**2*x**3,x**6));}
  const std=m=>m>=1&&m<10;assert.equal(pick([3.25,32.5,5.2,0.52],std),'ac');
  const v=[3.2e-3,4.1e-4,2.9e-3,1.5e-2];
  assert.equal(pick([Math.min(...v)===4.1e-4,Math.max(...v)===1.5e-2,3.2e-3<2.9e-3,3.2e-3>1.5e-2],x=>x),'ab');
  assert.deepEqual(matchMap([8**4*125**4===1e12?'1e12':'x',15**4/(5**4*3**2),5**8*25**2/125**3,2**10],[125,1024,'1e12',9]),[3,4,1,2]);
  assert.equal(7*24*60*60,604800);assert(close(4.5e5*300,1.35e8));
  assert.deepEqual(matchMap([5.2e-8,3.25e9,604800,1.35e8].map(String),[1.35e8,6.048e5,5.2e-8,3.25e9].map(String)),[3,4,2,1]);
 }},
};
run('class-8',records);
