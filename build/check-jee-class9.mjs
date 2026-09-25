import assert from 'node:assert/strict';
import {gcd,pick,matchMap,close,run} from './jee-check.mjs';
// Keys are compared with the printed Answer rows, and each chapter's verify()
// recomputes every option so a distractor that is secretly right fails.
const dist=([a,b],[c,d])=>Math.hypot(c-a,d-b);
const terminates=(p,q)=>{q/=gcd(p,q);while(q%2===0)q/=2;while(q%5===0)q/=5;return q===1;};
const E=(f,g)=>[[1,2],[-3,5],[2.5,-1],[4,7]].every(([a,b])=>close(f(a,b),g(a,b)));
const isPrime=n=>n>1&&[...Array(n).keys()].slice(2).every(d=>n%d);
const records={
'ch08-sequences':{singles:'abcdab',multis:['acd','ac','abc','acd'],numbers:[[...Array(100).keys()].filter(x=>x>0&&x%6===0).reduce((a,b)=>a+b),(1/4)*2**7,(()=>{const d=(58-23)/7,a=23-4*d;return a+19*d;})()],
 verify(){
  const ap=(a,d,n)=>a+(n-1)*d, gp=(a,r,n)=>a*r**(n-1), S=n=>n*(n+1)/2;
  assert.equal(pick([63,60,67,59],x=>x===ap(7,4,15)),'a');
  assert.equal(pick([36,37,38,252],n=>ap(4,7,n)===256),'b');
  assert.equal(pick([486,1458,-486,-1458],x=>x===gp(2,-3,6)),'c');
  assert.equal(pick([1250,2550,1225,1275],x=>x===S(50)),'d');
  let t=2;for(let i=2;i<=4;i++)t=3*t-1;assert.equal(pick([41,40,122,14],x=>x===t),'a');
  assert.equal(pick([47,48,49,235],n=>ap(12,5,n)===247),'b');
  const isAP=s=>s.slice(2).every((x,i)=>close(x-s[i+1],s[1]-s[0]));const isGP=s=>s.slice(2).every((x,i)=>close(x/s[i+1],s[1]/s[0]));
  const r2=Math.SQRT2;
  assert.equal(pick([[3,3,3,3],[1,1/2,1/3,1/4],[-2,1,4,7],[r2,2*r2,3*r2,4*r2]],isAP),'acd');
  assert.equal(pick([[1,-2,4,-8],[3,6,12,20],[0.1,0.01,0.001],[2,4,6,8]],isGP),'ac');
  const T=n=>7-3*n;assert.equal(pick([T(1)===4,T(2)-T(1)===-3,T(10)===-23,Number.isInteger(7/3)],x=>x),'abc');
  const g=n=>3*2**(n-1);assert.equal(pick([g(5)===48,3*2**1===g(1),[...Array(20).keys()].some(n=>g(n+1)===96),[...Array(20).keys()].some(n=>g(n+1)===384)],x=>x),'acd');
  let r=1;const rec=[1];for(let i=2;i<=5;i++){r=2*r+1;rec.push(r);}
  assert.deepEqual(matchMap([2*5+3,25-1,rec[4],3**4],[31,81,13,24]),[3,4,1,2]);
  const sum=(a,d,n)=>n/2*(2*a+(n-1)*d);
  assert.deepEqual(matchMap([S(30),sum(2,2,20),sum(1,2,15),sum(5,5,10)],[420,225,275,465]),[4,1,2,3]);
 }},

'ch04-algebraic-identities':{singles:'abcdab',multis:['ab','abc','abd','ab'],numbers:[998**3,Math.sqrt(144)+1,7**3-3*12*7],
 verify(){
  assert.equal(pick([23,46,58,13],x=>x===(81-35)/2),'a');
  const t=x=>x*x-2*x-35;assert.equal(pick([x=>(x+7)*(x-5),x=>(x-7)*(x+5),x=>(x-7)*(x-5),x=>(x+7)*(x+5)],f=>[0,1,-2,9].every(x=>f(x)===t(x))),'b');
  assert.equal(pick([9,81,27,243],x=>x===9*(81-78)),'c');
  assert.equal(pick([1638,5460,3276,16380],x=>x===28**3+(-15)**3+(-13)**3),'d');
  assert.equal(pick([992016,992004,994016,990016],x=>x===996**2),'a');
  assert.equal(pick([30,60,120,169],x=>x===(17**2-169)/2),'b');
  const q=x=>6*x*x+5*x-6;assert.equal(pick([-3/2,2/3,3/2,-2/3],r=>close(q(r),0)),'ab');
  const a=-3,b=-7;assert.equal(pick([a*a+b*b===58,(a+b)**2===100,a-b===4&&a*b===21&&a+b===-10,7**3-3**3===64],x=>x),'abc');assert.equal(7**3-3**3,316);
  const s=(a,b)=>a**6-b**6;
  assert.equal(pick([(a,b)=>(a**3-b**3)*(a**3+b**3),(a,b)=>(a-b)*(a+b)*(a*a+a*b+b*b)*(a*a-a*b+b*b),(a,b)=>(a*a-b*b)**3,(a,b)=>(a*a-b*b)*(a**4+a*a*b*b+b**4)],f=>E(f,s)),'abd');
  const c=(x,y)=>27*x**3-54*x*x*y+36*x*y*y-8*y**3;
  assert.equal(pick([E((x,y)=>(3*x-2*y)**3,c),true,E((x,y)=>(3*x+2*y)**3,c),c(1,1)===-1],x=>x),'ab');
  assert.equal(11*13,143);
  const L=[(a,b)=>(a+b)**2-(a-b)**2,(a,b)=>(a+b)**2+(a-b)**2,(a,b)=>(a+b)*(a-b),(a,b)=>(a+b)**3-(a-b)**3],R=[(a,b)=>a*a-b*b,(a,b)=>6*a*a*b+2*b**3,(a,b)=>4*a*b,(a,b)=>2*a*a+2*b*b];
  assert.deepEqual(L.map(f=>R.findIndex(g=>E(f,g))+1),[3,4,1,2]);
  const L2=[x=>x*x+5*x+6,x=>x*x-x-6,x=>x*x+x-6,x=>x*x-5*x+6],R2=[x=>(x-3)*(x+2),x=>(x+3)*(x-2),x=>(x-2)*(x-3),x=>(x+2)*(x+3)];
  assert.deepEqual(L2.map(f=>R2.findIndex(g=>[0,1,5,-4].every(x=>f(x)===g(x)))+1),[4,1,2,3]);
 }},
'ch05-circles':{singles:'abcdab',multis:['abd','abc','ab','abc'],numbers:[(1600+400)/40,Math.sqrt(20*20+21*21-21*21),30],
 verify(){
  assert(17>8);assert.equal(Math.sqrt(17**2-8**2),15);
  const ang=[30,45,105];assert.equal(ang.reduce((a,b)=>a+b),180);assert(ang.some(x=>x>90));
  assert.equal(pick([35,2,24,12],d=>d===Math.sqrt(37**2-35**2)),'d');
  assert.equal(pick([50,100,130,80],x=>x===100/2),'a');
  const B=180-130;assert.equal(pick([50,40,130,90],x=>x===180-90-B),'b');
  assert.equal(pick([[90,90],[90,90],[60,60],[70,110]],([x,y])=>x+y===180),'abd');
  const d1=Math.sqrt(225-144),d2=Math.sqrt(225-81);assert.equal(pick([d1===9,d2===12,d2-d1===3,d2+d1===15],x=>x),'abc');
  assert.equal(pick([true,true,false,false],x=>x),'ab');
  const x=(100-289+441)/42;assert.equal(x,6);assert.equal(pick([2*Math.sqrt(100-x*x)===16,true,x===6,21-x===6],v=>v),'abc');
  assert.equal(Math.sqrt(29**2-20**2),21);assert.equal(Math.sqrt(29**2-21**2),20);
  assert.deepEqual(matchMap([60,120,90,110],[110,90,60,120]),[3,4,2,1]);
  assert.deepEqual(matchMap([7,15,20,24].map(d=>2*Math.sqrt(625-d*d)),[30,14,48,40]),[3,4,1,2]);
 }},
'ch07-probability':{singles:'abcdab',multis:['abc','ac','acd','abc'],numbers:[14/400*12000,36-6,0.15*60],
 verify(){
  assert.equal(pick([9/20,45/10,4/5,9/2],x=>close(x,0.45)),'a');
  const v=[2/5,0.55,0.48,3/7];assert.equal(pick(v,x=>x===Math.max(...v)),'b');
  assert.equal(pick([0.52,0.8,0.65,0.35],x=>close(x,52/80)),'c');
  const w='ASSESSMENT';assert.equal(pick([0.1,0.3,0.5,0.4],x=>close(x,[...w].filter(c=>c==='S').length/w.length)),'d');
  const primes=[...Array(26).keys()].filter(isPrime).length;assert.equal(pick([9/25,2/5,8/25,1/5],x=>close(x,primes/25)),'a');
  assert.equal(pick([9,15,16,8],x=>x===24-24*3/8),'b');
  const A=[3,6,9],B=[2,4,6,8,10],U=new Set([...A,...B]);
  assert.equal(pick([close(A.length/10,0.3),B.length/10===0.5,A.filter(x=>B.includes(x)).length/10===0.1,U.size/10===0.8],x=>x),'abc');
  assert.equal(pick([0,1.2,0.45,-0.1],x=>x>=0&&x<=1),'ac');
  assert.equal(pick([2*3===6,close(1/6,1/3),3/6===0.5,close(4/6,2/3)],x=>x),'acd');
  assert.equal(pick([9/30===0.3,102/600===0.17,true,false],x=>x),'abc');
  const out=[];for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)out.push(a+b);const P=f=>out.filter(f).length/36;
  assert.deepEqual(matchMap([P(s=>s===12),P(s=>s===7),P(s=>s<4),P(s=>s%2===0)].map(x=>+x.toFixed(9)),[1/2,1/12,1/36,1/6].map(x=>+x.toFixed(9))),[3,4,2,1]);
  const n=[...Array(20)].map((_,i)=>i+1),Q=f=>n.filter(f).length/20;
  assert.deepEqual(matchMap([Q(x=>x%5===0),Q(isPrime),Q(x=>x%2===0),Q(x=>x>15)],[1/4,2/5,1/2,1/5]),[4,2,3,1]);
 }},

'ch01-coordinates':{singles:'abcdab',multis:['ab','abc','abcd','abc'],numbers:[2*3-(-2),dist([0,0],[4,3]),Math.abs(4-(-3))+Math.abs(5-1)],
 verify(){
  const q2=k=>k-3<0;assert.equal(pick([2,4,3,4.5],k=>q2(k)),'a');assert(q2(2.99)&&!q2(3)&&!q2(4));
  assert.equal(pick([13,17,23,15],x=>close(x,dist([-3,7],[5,-8]))),'b');
  const d=[[7,1],[5,5],[-6,4],[0,-7]].map(p=>dist([0,0],p));assert.equal(pick(d,x=>x===Math.max(...d)),'c');
  assert.equal(pick([[0,1],[0,-4],[1,0],[0,-1]],p=>p[0]===0&&close(dist(p,[-5,2]),dist(p,[3,4]))),'d');
  assert.equal(pick([[-1,-5],[-3,-4],[1,-5],[-1,-2]],([a,b])=>(a+5)/2===2&&(3+b)/2===-1),'a');
  assert.equal(pick([6,8,10,0],x=>x===dist([-4,3],[4,3])),'b');
  assert.equal(pick([4,10,7,-4],a=>close(dist([a,2],[7,6]),5)),'ab');
  const A=[-3,-2],B=[5,-2],C=[5,4],D=[-3,4];
  assert.equal(pick([true,dist(A,B)===8,dist(A,C)===10,8*6===40],x=>x),'abc');
  const P=[1,0],Q=[5,3],R=[-1,11];
  assert.equal(pick([dist(P,Q)===5,dist(Q,R)===10,close(dist(P,Q)**2+dist(Q,R)**2,dist(P,R)**2),5*10/2===25],x=>x),'abcd');
  let pts=0;for(let x=-5;x<=5;x++)for(let y=-5;y<=5;y++)if(x*x+y*y===25)pts++;
  assert.equal(pick([9+16===25,25===25,pts===12,1+16===25],x=>x),'abc');
  assert.deepEqual([2*3-(-2),2*1-5],[8,-3]);assert.equal(dist([4,3],[8,0]),5);assert.equal(dist([4,3],[0,6]),5);
  const where=([x,y])=>x===0?'y':y===0?'x':x<0&&y>0?'II':x>0&&y<0?'IV':'other';
  assert.deepEqual(matchMap([[-3,5],[4,-2],[0,-6],[-7,0]].map(where),['x','IV','II','y']),[3,2,4,1]);
  assert.deepEqual(matchMap([dist([0,0],[6,8]),dist([1,2],[4,6]),dist([-2,-3],[3,9]),dist([2,-1],[2,7])],[13,8,10,5]),[3,4,1,2]);
 }},
'ch02-linear-polynomials':{singles:'abcdab',multis:['ac','abc','abcd','abd'],numbers:[9,9,40+15*5],
 verify(){
  const pp=x=>3*x*x-5*x+2;
  assert.equal(pick([[3,-3],[2,-3],[3,2],[4,-1]],([d,c])=>d===3&&c===-3),'a');
  assert.equal(pick([0,10,4,6],x=>x===pp(-1)),'b');
  const m=(16-7)/3,b=7-2*m;assert.equal(pick([3,4,1,10],x=>x===b),'c');
  assert.equal(pick([14,18,15,17],k=>(k-11)/(6-4)===(11-2)/(4-1)),'d');
  const s=(0-6)/(5-2);assert.equal(pick([10,8,12,6],y=>y===6-2*s),'a');
  assert.equal(pick([3,-4,-8,4],x=>x===-8/2),'b');
  const row=n=>18+3*(n-1);assert.equal(pick([row(5)===30,[1,2,7].every(n=>row(n)===3*n+15),row(10)===45,row(1)+row(2)===36],x=>x),'abc');
  const h=t=>30-3*t;assert.equal(pick([h(2)-h(5)===9&&(h(2)-h(5))/3===3,h(0)===30,h(2)===24&&h(5)===15,h(10)===0],x=>x),'abcd');
  assert.equal(pick([true,[0,1,-3,7].every(x=>(2*x+1)-(2*x-3)===4),2*1+1===3&&2*1-3===3,true],x=>x),'abd');
  assert.equal(9+24+3,3*(9+3));assert.equal(5*9+2*16,77);
  assert.deepEqual(matchMap([pp(0),pp(1),pp(2),pp(-1)],[4,10,0,2]),[4,3,1,2]);
  const lines=[x=>2*x+1,x=>-x+4,x=>3*x-7,x=>-2*x+10],pts=[[5,0],[3,7],[1,-4],[-2,6]];
  for(const [x,y] of pts)assert.equal(lines.filter(f=>f(x)===y).length,1);
  assert.deepEqual(lines.map(f=>pts.findIndex(([x,y])=>f(x)===y)+1),[2,4,3,1]);
 }},
'ch03-world-of-numbers':{singles:'abcdab',multis:['ad','acd','abd','ab'],numbers:[-(-120+45-70),[...Array(24).keys()].filter(k=>k/24>1/3&&k/24<3/4).length,408*408],
 verify(){
  assert.equal(pick([44,4,37,-4],x=>x===(-8)*(-3)-5*(-4)+0*(-7)),'a');
  assert.equal(pick([13/12,13/8,7/8,3/2],x=>close(2/3*x-1/4,5/6)),'b');
  assert(terminates(11,80));assert.equal(11/80,0.1375);
  assert.equal(pick([61/495,122/990,123/1000,41/333],x=>close(x,123/999)),'d');
  assert.equal(pick([106/45,47/20,212/99,235/99],x=>close(x,2+0.3+5/90)),'a');
  assert(close((Math.sqrt(3)-Math.sqrt(2))*(Math.sqrt(3)+Math.sqrt(2)),1));
  assert.equal(pick([Math.sqrt(6),4,1/3,2+Math.sqrt(3)],x=>!Number.isInteger(x*9)&&!Number.isInteger(x*3)&&Math.abs(x*1e6-Math.round(x*1e6))>1e-6),'ad');
  assert.equal(pick([[17,64],[5,24],[7,40],[3,15]],([p,q])=>terminates(p,q)),'acd');
  const a=1/2+3/4,b=1/2-3/4;assert.equal(pick([a===5/4,b===-1/4,a===1/4||b===1/4,a+b===1],x=>x),'abd');
  assert.equal(pick([0.23,0.24,0.22,0.25],x=>x>2/9&&x<0.25),'ab');
  assert.equal(577**2-2*408**2,1);
  assert.deepEqual(matchMap([1/3,1/6,0.375,1/7].map(x=>+x.toFixed(9)),[3/8,1/7,1/3,1/6].map(x=>+x.toFixed(9))),[3,4,1,2]);
  assert.deepEqual(matchMap([Math.sqrt(2)*Math.sqrt(8),Math.sqrt(5)**2,(2+Math.sqrt(3))*(2-Math.sqrt(3)),Math.sqrt(18)/Math.sqrt(2)].map(x=>Math.round(x*1e9)/1e9),[3,1,4,5]),[3,4,2,1]);
 }},
};
run('class-9',records);
