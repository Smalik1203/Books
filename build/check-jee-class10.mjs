import assert from 'node:assert/strict';
import {gcd,hcf,lcm,pick,matchMap,close,run} from './jee-check.mjs';
// Keys are compared with the printed Answer rows, and each chapter's verify()
// recomputes every option so a distractor that is secretly right fails.
const isPrime=n=>n>1&&[...Array(Math.floor(Math.sqrt(n))+1).keys()].slice(2).every(d=>n%d);
const same=(f,g,xs=[-3,-1,0,0.5,2,7])=>xs.every(x=>close(f(x),g(x)));
const roots=(a,b,c)=>{const D=b*b-4*a*c;if(D<0)return [];return [(-b+Math.sqrt(D))/(2*a),(-b-Math.sqrt(D))/(2*a)].sort((x,y)=>x-y);};
const solve2=(a1,b1,c1,a2,b2,c2)=>{const d=a1*b2-a2*b1;return d===0?null:[(c1*b2-c2*b1)/d,(a1*c2-a2*c1)/d];};
const decimals=(p,q)=>{q/=gcd(p,q);let k=0;while(q%10!==1||q>1){if(q===1)break;const t=[2,5].find(f=>q%f===0);if(!t)return Infinity;let tw=0,fv=0;while(q%2===0){q/=2;tw++;}while(q%5===0){q/=5;fv++;}k=Math.max(tw,fv);}return k;};
const ap=(a,d,n)=>a+(n-1)*d, apS=(a,d,n)=>n/2*(2*a+(n-1)*d);
const dist=([a,b],[c,d])=>Math.hypot(c-a,d-b);
const R=Math.PI/180, s=x=>Math.sin(x*R), c=x=>Math.cos(x*R), t=x=>Math.tan(x*R);
const PI=22/7, r3=Math.sqrt(3);
const gmean=(xs,fs)=>xs.reduce((a,x,i)=>a+x*fs[i],0)/fs.reduce((a,b)=>a+b);
const dice=()=>{const o=[];for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)o.push([a,b]);return o;};
const records={
'ch09-applications-of-trigonometry':{singles:'abcdab',multis:['abc','ab','abd','abc'],numbers:[50*t(45),Math.atan(9/(3*r3))/R,+(10*1.732).toFixed(2)],
 verify(){
  assert.equal(pick([30,30*r3,60,20*r3],h=>close(h,60*s(30))),'a');
  assert.equal(pick([20,20*r3,40,20/r3],h=>close(h,20*t(60))),'b');
  assert.equal(pick([60,45,30,90],a=>close(t(a),12/(12*r3))),'c');
  assert.equal(pick([30,15,60,30*r3],d=>close(30/d,t(30))),'d');
  assert.equal(pick([5*r3,5,10*r3,10],h=>close(h,10*s(60))),'a');
  assert.equal(pick([30,45,60,90],a=>close(t(a),1)),'b');
  const dA=30/t(30),dB=30/t(60);assert.equal(pick([close(dA,30*r3),close(dB,10*r3),close(dA-dB,20*r3),close(dA-dB,30)],x=>x),'abc');
  assert.equal(pick([true,true,close(t(60),1),false],x=>x),'ab');
  const L=60/s(60);assert.equal(pick([close(L,40*r3),close(60/t(60),20*r3),close(L,120),Math.abs(L-69.3)<0.05],x=>x),'abd');
  const x=40/4,hh=x*r3;assert(close(hh,(40-x)/r3));assert.equal(pick([x===10,close(hh,10*r3),40-x===30,close(hh,20)],v=>v),'abc');
  const xx=20/2;assert(close(xx*r3,(xx+20)/r3));
  assert.deepEqual(matchMap([30*t(30),30*t(45),30*t(60),60].map(v=>+v.toFixed(6)),[30*r3,60,10*r3,30].map(v=>+v.toFixed(6))),[3,4,1,2]);
  assert.deepEqual(matchMap([15/t(30),15/t(45),15/t(60),0].map(v=>+v.toFixed(6)),[0,5*r3,15*r3,15].map(v=>+v.toFixed(6))),[3,4,2,1]);
 }},
'ch10-circles':{singles:'abcdab',multis:['abd','abc','ab','abc'],numbers:[Math.sqrt(17**2-8**2),360-90-90-110,2*Math.sqrt(169-25)],
 verify(){
  assert.equal(pick([12,8,18,13],x=>x===Math.sqrt(169-25)),'a');
  assert.equal(pick([80,50,100,90],x=>x===360-180-80),'c');
  assert.equal(pick([7,1,49,24.5],x=>x===Math.sqrt(625-576)),'a');
  assert.equal(pick([4,8,6,10],x=>x===2*Math.sqrt(25-9)),'b');
  const OP=5/s(30);assert.equal(pick([180-60===120,60/2===30,close(OP,10),close(Math.sqrt(OP*OP-25),5)],v=>v),'abc');
  const AD=6+4-7;assert.equal(pick([true,AD===3,6+7+4+AD===18,AD===5],v=>v),'ab');
  assert.equal(pick([4+6===10,6+8===14,2*(4+6+8)===36,8+4===14],v=>v),'abc');
  assert.deepEqual(matchMap([[3,5],[5,13],[8,17],[7,25]].map(([r,d])=>Math.sqrt(d*d-r*r)),[15,24,4,12]),[3,4,1,2]);
  assert.deepEqual(matchMap([40,90,70,120].map(a=>180-a),[90,140,60,110]),[2,1,4,3]);
 }},
'ch11-areas-related-to-circles':{singles:'abcdab',multis:['abd','ab','abc','ab'],numbers:[45/360*PI*28*28,72/360*2*PI*35,90/360*PI*196-98],
 verify(){
  const sec=(r,a)=>a/360*PI*r*r, arc=(r,a)=>a/360*2*PI*r;
  assert.equal(pick([38.5,154,77,11],x=>close(x,sec(7,90))),'a');
  assert.equal(pick([44,22,66,11],x=>close(x,arc(21,60))),'b');
  assert.equal(pick([308,616,154,77],x=>close(x,sec(14,90))),'c');
  assert.equal(pick([78.5,50,128.5,28.5],x=>close(x,0.25*3.14*100-50)),'d');
  assert.equal(pick([25,11,18,32],x=>close(x,arc(7,90)+14)),'a');
  assert.equal(pick([30,60,90,120],a=>close(a/360*Math.PI*36,6*Math.PI)),'b');
  assert.equal(pick([close(arc(14,90),22),close(sec(14,90),154),close(14*14/2,196),close(sec(14,90)-98,56)],x=>x),'abd');
  assert.equal(pick([true,true,close(sec(5,60),arc(5,60)*5),close(sec(10,60),2*sec(5,60))],x=>x),'ab');
  assert.equal(pick([close(2*PI*21,132),close(PI*441,1386),close(sec(21,120),462),close(arc(21,120),66)],x=>x),'abc');
  assert.equal(pick([20/60*360===120,close(sec(21,120),462),close(arc(21,120),22),close(sec(21,120),231)],x=>x),'ab');
  assert.deepEqual(matchMap([sec(7,90),sec(7,180),arc(7,90),arc(7,360)].map(v=>+v.toFixed(6)),[44,11,38.5,77]),[3,4,2,1]);
  assert.deepEqual(matchMap([3.14*100,2*3.14*10,0.25*3.14*100,0.25*3.14*100-50].map(v=>+v.toFixed(6)),[78.5,28.5,314,62.8]),[3,4,1,2]);
 }},
'ch12-surface-areas-and-volumes':{singles:'abcdab',multis:['abc','ab','abc','abc'],numbers:[4*PI*49,PI*4900*100/1000,36/(4/3)],
 verify(){
  assert.equal(pick([1540,440,3080,770],v=>close(v,PI*49*10)),'a');
  assert.equal(pick([198,66,33,132],v=>close(v,PI*9*7/3)),'b');
  assert.equal(pick([38808,9702,19404,1386],v=>close(v,2/3*PI*21**3)),'c');
  assert.equal(pick([192,128,96,160],v=>v===2*(8*4+4*4+8*4)),'d');
  assert.equal(pick([220,440,154,374],v=>close(v,PI*7*10)),'a');
  assert.equal(pick([3,9,6,12],h=>close(4/3*27,4*h)),'b');
  const csa=2*PI*7*10,hem=2*PI*49,base=PI*49;assert.equal(pick([close(csa,440),close(hem,308),close(csa+hem+base,902),close(PI*49*10+2/3*PI*343,1540)],x=>x),'abc');
  assert.equal(pick([216===6**3,216===6*36,false,false],x=>x),'ab');
  const l=Math.hypot(6,8);assert.equal(pick([l===10,close(Math.PI*6*l,60*Math.PI),close(Math.PI*36*8/3,96*Math.PI),close(Math.PI*6*l+Math.PI*36,100*Math.PI)],x=>x),'abc');
  const cy=PI*9*7,co=cy/3;assert.equal(pick([close(cy,198),close(co,66),close(cy-co,132),close(co,cy/2)],x=>x),'abc');
  assert.deepEqual(matchMap([4/3*PI*21**3,2/3*PI*21**3,4*PI*441,3*PI*441].map(v=>Math.round(v)),[5544,4158,38808,19404]),[3,4,1,2]);
  assert.deepEqual(matchMap([2*PI*70,2*PI*70+2*PI*49,PI*490,PI*49].map(v=>Math.round(v)),[154,1540,440,748]),[3,4,2,1]);
 }},
'ch13-statistics':{singles:'abcdab',multis:['abc','ab','abc','abd'],numbers:[gmean([10,20,30,40],[2,3,4,1]),5,+(20+(20-13)/12*10).toFixed(1)],
 verify(){
  assert.equal(pick([15,10,20,5],x=>x===15),'a');
  assert.equal(pick([5,4.6,4,5.2],x=>close(x,gmean([2,4,6,8],[3,2,4,1]))),'b');
  assert.equal(pick(['10-20','30-40','20-30','0-10'],c=>c==='20-30'),'c');
  assert.equal(pick([24,25,22.5,24.4],x=>close(x,+(20+4/9*10).toFixed(1))),'d');
  assert.equal(pick([26,24,18,22],x=>x===3*22-2*20),'a');
  const cf=[5,13,25,40];assert.equal(pick(['10-20','20-30','30-40','0-10'],c=>c==='20-30'&&cf[1]<20&&cf[2]>=20),'b');
  const f=[5,8,12,7,8],C=f.map((_,i)=>f.slice(0,i+1).reduce((a,b)=>a+b));assert.equal(pick([C.at(-1)===40,Math.max(...f)===12&&f.indexOf(12)===2,C[2]===23,C[3]>=20&&C[2]<20],x=>x),'ab');
  const k=[...Array(20).keys()].find(k=>close(gmean([5,10,15],[2,k,3]),10.5));assert.equal(k,5);
  const med=20+(20-13)/12*10;assert.equal(pick([true,C[1]===13,close(med,30),true],x=>x),'abd');
  assert.deepEqual(matchMap([25,10,30,50],[50,30,25,10]),[3,4,2,1]);
  const d=[2,4,4,5,7,8];assert.deepEqual(matchMap([d.reduce((a,b)=>a+b)/6,(4+5)/2,4,8-2],[4,6,5,4.5]),[3,4,1,2]);
 }},
'ch14-probability':{singles:'abcdab',multis:['abd','abc','ab','abcd'],numbers:[dice().filter(([a,b])=>a+b<=4).length,20-15,380/400],
 verify(){
  const D=[1,2,3,4,5,6];
  assert.equal(pick([1/2,1/3,2/3,1/6],x=>close(x,D.filter(n=>[2,3,5].includes(n)).length/6)),'a');
  assert.equal(pick([1/2,3/4,1/4,1],x=>close(x,3/4)),'b');
  assert.equal(pick([1/52,4/13,1/13,1/4],x=>close(x,4/52)),'c');
  assert.equal(pick([0.35,1.35,-0.35,0.65],x=>close(x,1-0.35)),'d');
  assert.equal(pick([5/36,1/6,1/9,7/36],x=>close(x,dice().filter(([a,b])=>a+b===8).length/36)),'a');
  assert.equal(pick([5/8,3/8,3/5,1/3],x=>close(x,3/8)),'b');
  assert.equal(pick([0.7,0.15,-1.5,2/3],x=>x>=0&&x<=1),'abd');
  assert.equal(pick([close(D.filter(n=>n%2===0).length/6,0.5),D.filter(n=>n>6).length===0,D.filter(n=>n<=6).length===6,close(1/6,1/3)],x=>x),'abc');
  assert.equal(pick([close(26/52,0.5),close(12/52,3/13),close(2/52,1/13),close(13/52,0.5)],x=>x),'ab');
  const o=dice();assert.equal(pick([o.length===36,close(o.filter(([a,b])=>a===b).length/36,1/6),o.filter(([a,b])=>a+b===13).length===0,close(o.filter(([a,b])=>a+b===7).length/36,1/6)],x=>x),'abcd');
  assert.deepEqual(matchMap([1/6,3/6,2/6,1].map(v=>+v.toFixed(9)),[1,1/3,1/6,1/2].map(v=>+v.toFixed(9))),[3,4,2,1]);
  assert.deepEqual(matchMap([13/52,4/52,6/52,1/52].map(v=>+v.toFixed(9)),[1/13,1/52,3/26,1/4].map(v=>+v.toFixed(9))),[4,1,3,2]);
 }},

'ch05-arithmetic-progressions':{singles:'abcdab',multis:['bc','abd','abc','ab'],numbers:[apS(6,6,40),apS(5,4,20),(330-50)/20+1],
 verify(){
  assert.equal(pick([47,50,45,52],x=>x===ap(2,5,10)),'a');
  assert.equal(pick([15,16,17,75],n=>ap(3,5,n)===78),'b');
  assert.equal(pick([570,610,590,1180],x=>x===apS(1,3,20)),'c');
  assert.equal(pick([5,2,3,-2],d=>d===(5-2*2)-(5-2*1)),'d');
  assert.equal(pick([203,198,208,53],x=>x===ap(253,-5,11)),'a');
  const Sn=n=>n*n+2*n;assert.equal(pick([35,11,9,13],x=>x===Sn(5)-Sn(4)),'b');
  const isAP=q=>q.slice(2).every((x,i)=>close(x-q[i+1],q[1]-q[0]));
  assert.equal(pick([[2,4,8,16],[-10,-6,-2,2],[3,12,27,48].map(Math.sqrt),[1,9,25,49]],isAP),'bc');
  const on=v=>Number.isInteger((v-5)/3)&&v>=5;assert.equal(pick([ap(5,3,10)===32,apS(5,3,10)===185,on(100),on(104)],x=>x),'abd');
  const trip=[];for(let d=-10;d<=10;d++){const a=8;if((a-d)*a*(a+d)===440)trip.push(d);}assert.deepEqual(trip,[-3,3]);
  const m7=[];for(let k=10;k<100;k++)if(k%7===0)m7.push(k);assert.equal(pick([m7.length===13,m7[0]===14,m7.reduce((a,b)=>a+b)===700,m7.at(-1)===99],x=>x),'ab');
  assert.deepEqual(matchMap([3*10+2,ap(2,3,10),ap(100,-5,10),ap(-5,4,10)],[55,31,32,29]),[3,4,1,2]);
  assert.deepEqual(matchMap([apS(1,1,100),apS(2,2,50),apS(1,2,50),apS(5,5,20)],[2550,1050,5050,2500]),[3,1,4,2]);
 }},
'ch06-triangles':{singles:'abcdab',multis:['abd','abc','abd','abc'],numbers:[2.4*5.4/3.6,28*6/4,45/30*8],
 verify(){
  assert.equal(pick([6,4,3,8],x=>2/3===4/x),'a');
  assert.equal(pick([10,12,16,6],x=>x===9/6*8),'b');
  assert.equal(pick(['9:25','5:3','3:5','27:125'],r=>r==='3:5'),'c');
  assert.equal(pick([20,53.3,25,30],h=>close(h/40,1.5/2)),'d');
  assert.equal(pick([50,60,70,80],x=>x===180-50-70),'b');
  // Rectangles 1x1 and 1x5 have equal angles but sides out of proportion.
  assert.notEqual(1/1,5/1);
  const AD=4,AB=10,BC=15;assert.equal(pick([AD/AB===2/5,close(BC*AD/AB,6),close(4/6,3/2),true],x=>x),'abd');
  assert(close(2.4*5.4/3.6,3.6));
  assert.deepEqual(matchMap(['AA','SSS','SAS','BPT'],['SAS','BPT','AA','SSS']),[3,4,1,2]);
  const k=6/4;assert.deepEqual(matchMap([k*6,k*8,6+k*6+k*8,55],[12,27,55,9]),[4,1,2,3]);
 }},
'ch07-coordinate-geometry':{singles:'abcdab',multis:['abc','abd','abc','abd'],numbers:[dist([-6,7],[-1,-5]),1+12,8+6+10],
 verify(){
  assert.equal(pick([2*Math.SQRT2,2,4,Math.sqrt(10)],x=>close(x,dist([2,3],[4,1]))),'a');
  const sec=(A,B,m,n)=>[(m*B[0]+n*A[0])/(m+n),(m*B[1]+n*A[1])/(m+n)];
  assert.equal(pick([[3,1],[1,3],[2,1],[1,5]],p=>p.join()===sec([-1,7],[4,-3],2,3).join()),'b');
  assert.equal(pick([[4.5,9],[3,2],[1.5,1],[-1.5,1]],p=>p.join()===[1.5,1].join()),'c');
  assert.equal(pick([[7,0],[0,-7],[-7,7],[-7,0]],p=>p[1]===0&&close(dist(p,[2,-5]),dist(p,[-2,9]))),'d');
  assert.equal(pick([[5,1],[1,5],[6,1],[3,2]],([m,n])=>close(sec([5,-6],[-1,-4],m,n)[0],0)),'a');
  assert.equal(pick([-2,4,5,6],x=>x>1&&close(dist([x,7],[1,3]),5)),'b');
  const A=[0,0],B=[4,0],C=[4,3],D=[0,3];assert.equal(pick([dist(A,B)===4,dist(A,C)===5,dist(A,C)===dist(B,D),dist(A,B)===dist(B,C)],x=>x),'abc');
  const P=[1,1],Q=[3,5],W=[5,9];assert.equal(pick([close(dist(P,Q),dist(Q,W)),close(dist(P,Q)+dist(Q,W),dist(P,W)),close(dist(P,W),2*Math.sqrt(5)),true],x=>x),'abd');
  assert.equal(pick([2*2-5===-1,2*-3-1===-7,dist([-1,1],[5,-7])===10,false],x=>x),'abc');
  const T1=sec([-3,6],[6,-3],1,2),T2=sec([-3,6],[6,-3],2,1);assert.deepEqual([T1,T2],[[0,3],[3,0]]);
  assert.equal(dist([3,13],[-2,1]),13);
  const mid=(a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2].join();
  assert.deepEqual(matchMap([mid([2,4],[6,8]),mid([-2,3],[4,-1]),mid([0,0],[-6,10]),mid([5,-3],[1,7])],['3,2','-3,5','4,6','1,1']),[3,4,2,1]);
  assert.deepEqual(matchMap([[5,12],[-8,6],[7,-24],[-9,12]].map(p=>dist([0,0],p)),[25,15,13,10]),[3,4,1,2]);
 }},
'ch08-trigonometry':{singles:'abcdab',multis:['abd','abc','abd','ab'],numbers:[s(60)**2+c(30)**2+t(45)**2,5*0.8+3*(0.8/0.6),60],
 verify(){
  const A=Math.asin(3/5)/R;assert.equal(pick([4/5,3/4,5/4,5/3],x=>close(x,c(A))),'a');
  const B=Math.atan(5/12)/R;assert.equal(pick([12/13,13/12,5/13,13/5],x=>close(x,1/c(B))),'b');
  assert.equal(pick([0.5,Math.sqrt(3),1,0],x=>close(x,s(30)+c(60))),'c');
  assert.equal(pick([2,3,7/4,11/4],x=>close(x,2*t(45)+c(30)*s(60))),'d');
  assert.equal(pick([45,30,60,90],x=>close(s(x),c(x))),'a');
  assert.equal(pick([0,1,NaN,NaN],x=>[20,40,70].every(a=>close((1+t(a)**2)*c(a)**2,x))),'b');
  assert.equal(pick([s(30)**2+c(30)**2,1/c(45)**2-t(45)**2,c(90),t(30)*t(60)],x=>close(x,1)),'abd');
  assert.equal(pick([true,close(s(45),c(45)),close(s(45),1/Math.SQRT2),close(1/c(45),2)],x=>x),'abc');
  const id=f=>[20,35,60,75].every(f);
  assert.equal(pick([id(a=>close(s(a)**2+c(a)**2,1)),id(a=>close(1+1/t(a)**2,1/s(a)**2)),id(a=>close(1/c(a)-t(a),1)),id(a=>close((1/c(a)-t(a))*(1/c(a)+t(a)),1))],x=>x),'abd');
  assert.equal(pick([close(s(30),0.5),close(c(30),Math.sqrt(3)/2),close(t(30),Math.sqrt(3)),close(1/c(30),2)],x=>x),'ab');
  assert(close(s(60)**2+c(30)**2+t(45)**2,2.5));assert(close(2*s(60),Math.sqrt(3)));
  const vals=[s(60),t(30),c(0),1/c(60)].map(x=>+x.toFixed(9)),II=[1,2,Math.sqrt(3)/2,1/Math.sqrt(3)].map(x=>+x.toFixed(9));
  assert.deepEqual(matchMap(vals,II),[3,4,1,2]);
  const a8=Math.asin(8/17)/R;assert.deepEqual(matchMap([c(a8),t(a8),1/c(a8),1/t(a8)].map(x=>+x.toFixed(9)),[15/8,17/15,8/15,15/17].map(x=>+x.toFixed(9))),[4,3,2,1]);
 }},

'ch01-real-numbers':{singles:'abcdab',multis:['ab','acd','abd','ab'],numbers:[hcf(1260,7344),lcm(18,24,32),hcf(391,425,527)],
 verify(){
  assert.equal(pick([4,8,12,2],x=>x===hcf(96,404)),'a');
  assert.equal(pick([120,360,720,1440],x=>x===lcm(6,72,120)),'b');
  assert.equal(pick([51,81,153,459],x=>hcf(27,x)===9&&lcm(27,x)===459),'c');
  assert.equal(pick([7,36/99,22/7,null],x=>x===null),'d');
  assert.equal(pick([72,144,36,216],x=>x===lcm(8,12,18)),'a');
  assert.equal(pick([[3,5,5,51],[3,3,5,5,17],[5,5,153],[3,3,5,85]],f=>f.every(isPrime)&&f.reduce((a,b)=>a*b)===3825),'b');
  for(const f of [[3,5,5,51],[5,5,153],[3,3,5,85]])assert.equal(f.reduce((a,b)=>a*b),3825);
  assert.equal(pick([7*11*13+13,5*4*3*2*1+5,29,2*3*5+1],n=>!isPrime(n)),'ab');
  assert.equal(pick([false,true,false,false],x=>!x),'acd'); // sqrt2+3, 2sqrt7, sqrt6 irrational; (sqrt3)^2 = 3
  let ok=true;for(let a=1;a<40;a++)for(let b=a+1;b<40;b++){ok=ok&&hcf(a,b)*lcm(a,b)===a*b&&lcm(a,b)%hcf(a,b)===0&&hcf(a,b)===hcf(a,b-a);}
  assert(ok);assert.equal(lcm(4,6),12);
  const ld=[...Array(12).keys()].map(n=>(6n**BigInt(n+1))%10n);assert(ld.every(d=>d===6n));assert([...Array(12).keys()].every(n=>(6n**BigInt(n+1))%5n!==0n));
  assert.equal(391-398,-7);assert.equal(hcf(391,425,527),17);
  assert.deepEqual(matchMap([hcf(12,18),lcm(12,18),hcf(17,23),lcm(4,6,10)],[36,1,60,6]),[4,1,2,3]);
  assert.deepEqual(matchMap([13/3125,17/8,7/25,3/16].map(x=>String(x).split('.')[1].length),[4,2,5,3]),[3,4,2,1]);
 }},
'ch02-polynomials':{singles:'abcdab',multis:['abc','abd','ac','abc'],numbers:[49-48,3*5,2*(0-2)*(0-5)],
 verify(){
  assert.deepEqual(roots(1,-2,-8),[-2,4]);
  const t2=x=>(x+1)*(x+2);assert.equal(pick([x=>x*x-3*x+2,x=>x*x+3*x+2,x=>x*x+2*x-3,x=>x*x-2*x+3],f=>same(f,t2)),'b');
  assert.equal(pick([25,19,13,1],v=>v===2*2+3*3),'c');
  assert.equal(pick([-1,5,2,1],k=>2-3+k===0),'d');
  const [a,b]=roots(1,7,10);assert.equal(pick([0.7,-0.7,10/7,-10/7],v=>close(v,1/a+1/b)),'b');
  const c=x=>x**3-6*x*x+11*x-6;assert.equal(pick([1,2,3,-1],x=>c(x)===0),'abc');
  const q=x=>3*x*x-5*x-2;assert.equal(pick([q(2)===0&&close(q(-1/3),0),close(2-1/3,5/3),close(2*(-1/3),2/3),q(1)===-4],x=>x),'abd');
  assert.equal(pick([[1,0,-9],[1,4,0],[4,0,-1],[1,1,-2]],([A,B])=>B===0),'ac');
  const k3=x=>x**3-3*x*x-x+3;assert([3,1,-1].every(x=>k3(x)===0));assert.equal(pick([3+1-1===3,3*1*-1===-3,3*1+1*-1+3*-1===-1,k3(2)===0],x=>x),'abc');
  assert.deepEqual(roots(1,-7,12),[3,4]);assert.deepEqual(roots(1,-8,15),[3,5]);
  const L=[[1,-5,6],[1,1,-6],[1,-1,-6],[1,5,6]].map(r=>roots(...r).join()),R=[[-2,3],[-3,-2],[2,3],[-3,2]].map(r=>r.join());
  assert.deepEqual(matchMap(L,R),[3,4,1,2]);
  const P=[[4,3],[-4,3],[4,-3],[0,-4]].map(([s,p])=>`${-s},${p}`),Q=[[0,-4],[-4,-3],[4,3],[-4,3]].map(([b,c])=>`${b},${c}`);
  assert.deepEqual(matchMap(P,Q),[4,3,2,1]);
 }},
'ch03-linear-equations':{singles:'abcdab',multis:['ad','abc','abd','ab'],numbers:[3*10,(1550-25*50)/15,6*2/4],
 verify(){
  assert.equal(pick([[9,5],[5,9],[10,4],[7,7]],p=>p.join()===solve2(1,1,14,1,-1,4).join()),'a');
  const none=k=>k*k===36&&3/k!==0.5;assert.equal(pick([6,-6,3,NaN],k=>none(k)),'b');
  assert.equal(2/4===3/6&&3/6===7/14,true);
  assert.equal(pick([19,25,38,31],x=>x===(50+12)/2),'d');
  const [pp,nn]=solve2(5,3,120,3,5,136);assert.equal(pick([20,12,32,24],x=>x===nn),'a');assert.equal(pp,12);
  assert.equal(pick([[-2,5],[5,-2],[3,1],[5,2]],p=>p.join()===solve2(3,2,11,2,3,4).join()),'b');
  const one=(a1,b1,a2,b2)=>a1*b2-a2*b1!==0;assert.equal(pick([one(1,1,1,-1),one(2,4,1,2),one(3,-1,6,-2),one(1,0,0,1)],x=>x),'ad');
  assert.equal(pick([2/4===-3/-6,2/4!==8/9,solve2(2,-3,8,4,-6,9)===null,false],x=>x),'abc');
  assert.equal(pick([[1,1,1],[2,-1,5],[1,-2,0],[3,4,2]],([a,b,c])=>a*2+b*-1===c),'abd');
  let num=[];for(let t=1;t<10;t++)for(let u=0;u<10;u++)if(t+u===9&&(10*u+t)-(10*t+u)===27)num.push(10*t+u);assert.deepEqual(num,[36]);
  assert.equal(3*10+10,2*(10+10));
  assert.deepEqual(matchMap([solve2(1,1,7,1,-1,1),solve2(1,1,7,1,-1,3),solve2(2,1,7,1,-1,2),solve2(1,2,7,1,-1,1)].map(String),['3,1','4,3','3,2','5,2']),[2,4,1,3]);
  const kind=(a1,b1,c1,a2,b2,c2)=>{if(a1*b2!==a2*b1)return 'meet '+solve2(a1,b1,c1,a2,b2,c2);return a1*c2===a2*c1?'same':'parallel';};
  assert.deepEqual(matchMap([kind(2,3,5,4,6,10),kind(2,3,5,4,6,9),kind(2,3,5,3,-2,1),kind(1,-1,0,2,1,6)],['meet 2,2','same','parallel','meet 1,1']),[2,3,4,1]);
 }},
'ch04-quadratic-equations':{singles:'abcdab',multis:['acd','bc','abc','ab'],numbers:[roots(1,-3,-10)[1],roots(1,2,-143)[1]+2,roots(1,5,-1800)[1]],
 verify(){
  assert.deepEqual(roots(2,-7,3),[0.5,3]);
  assert.equal(pick([8,-8,40,-40],d=>d===16-24),'b');
  assert.equal(pick([6,36,9,3],k=>36-4*k===0),'c');
  const D=36-24;assert(D>0&&!Number.isInteger(Math.sqrt(D)));
  assert.equal(pick([17,18,16,34],x=>x*(x+1)===306),'a');
  assert.deepEqual(roots(1,1,-12),[-4,3]);
  // (a) x^2+7, (b) linear, (c) x^2-4x+6, (d) 6x^2+12x+12: expand both sides and read the x^2 coefficient.
  const quad=(l,r)=>{const f=x=>l(x)-r(x);const a=(f(1)+f(-1)-2*f(0))/2;return Math.abs(a)>1e-9;};
  assert.equal(pick([[x=>(x+1)**2,x=>2*(x-3)],[x=>x*(x+1)+8,x=>(x+2)*(x-2)],[x=>x*x-2*x,x=>-2*(3-x)],[x=>(x+2)**3,x=>x**3-4]],([l,r])=>quad(l,r)),'acd');
  assert.equal(pick([[1,0,4],[1,-4,4],[2,1,-1],[1,1,1]],([a,b,c])=>b*b-4*a*c>=0),'bc');
  assert.equal(pick([roots(1,-5,6).join()==='2,3',5===5,25-24===1,false],x=>x),'abc');
  const bb=roots(1,5,-84)[1];assert.equal(pick([bb===7,bb+5===12,2*(bb+bb+5)===40,Math.hypot(bb,bb+5)===15],x=>x),'ab');
  assert.equal(roots(1,2,-143)[1],11);assert(close(360/40-360/45,1));
  assert.deepEqual(matchMap([[1,-4,4],[1,-5,6],[1,1,1],[2,-3,-2]].map(([a,b,c])=>b*b-4*a*c),[-3,25,0,1]),[3,4,1,2]);
  const nature=(a,b,c)=>{const d=b*b-4*a*c;return d<0?'none':d===0?'equal':Number.isInteger(Math.sqrt(d))?'rational':'irrational';};
  assert.deepEqual(matchMap([[1,-7,12],[1,-6,9],[1,2,5],[1,-2,-1]].map(r=>nature(...r)),['none','irrational','equal','rational']),[4,3,1,2]);
 }},
};
run('class-10',records);
