// Chapter-specific editorial compositions. Body type and furniture stay shared.
export function layoutDiversity(pages,{wrap,linesSVG,label}){
 const reports=[];
 function page(n,build){const p=pages[n-1],old=p.atoms;const start=p.start;let y=start,parts=[],added=[];
 const text=(s,x=89,w=874,gap=18)=>{if(!old.some(a=>a.text===s))added.push(s);const ls=wrap(s,w);parts.push(linesSVG(ls,x,y,'se-copy',31,23,w));y+=ls.length*31+gap;};
 const keep=i=>{parts.push(old[i].render(y));y+=old[i].h;};
 const head=s=>{parts.push(label(s,89,y+28,'se-heading'));y+=55;};
 const rule=()=>{parts.push('<line class="se-editorial-divider" x1="89" x2="963" y1="'+y+'" y2="'+y+'"/>');y+=24;};
 const figure=(key,height,captions)=>{parts.push('<image class="science-illustration" href="../../figures/class-6/science/ch02/'+key+'.png" x="89" y="'+y+'" width="874" height="'+height+'" preserveAspectRatio="xMidYMid meet"/>');y+=height;for(const [s,x]of captions)parts.push(label(s,526+(x-526)*Math.min(1,height*2/874),y+25,'se-caption','middle'));y+=49;};
 const columns=(items)=>{const gap=32,w=(874-gap*(items.length-1))/items.length;let tallest=0;for(let i=0;i<items.length;i++){let yy=y;const paragraphs=Array.isArray(items[i])?items[i]:[items[i]];for(const s of paragraphs){const ls=wrap(s,w-4);parts.push(linesSVG(ls,89+i*(w+gap),yy,'se-copy',31,23));yy+=ls.length*31+18;}tallest=Math.max(tallest,yy-y);}y+=tallest+8;};
 const beside=(key,caption,s)=>{const top=y,w=421;parts.push('<image class="science-illustration" href="../../figures/class-6/science/ch02/'+key+'.png" x="89" y="'+top+'" width="421" height="280" preserveAspectRatio="xMidYMid meet"/>');parts.push(label(caption,299.5,top+305,'se-caption','middle'));const ls=wrap(s,w-4);parts.push(linesSVG(ls,542,top,'se-copy',31,23));y+=Math.max(330,ls.length*31)+24;};
 build({old,text,keep,head,rule,figure,columns,beside});
 if(y-start>1319)throw Error('Editorial page '+n+' too tall: '+y);
 p.atoms=[{h:y-start,type:'editorial-layout',sourcePage:old[0].sourcePage,text:old.map(a=>a.text).join('\n'),readingText:[...old.flatMap(a=>a.readingText||[a.text]),...added],render:base=>{if(base!==start)throw Error('Editorial page moved');return parts.join('');}}];
 reports.push({page:n,contentHeight:y-start,addedText:added});
 }
 page(7,({old,text,keep,figure,columns,rule})=>{keep(0);keep(1);text(old[2].text);figure('forms',275,[['Mango · tree',307],['Rose · shrub',640],['Tomato · herb',876]]);columns([old[5].text,old[4].text,old[3].text]);rule();text(old[6].text);});
 page(8,({old,text,keep,figure,columns,rule})=>{text(old[0].text);rule();keep(1);text(old[2].text);figure('climbers',325,[['Climber · grape vine',308],['Creeper · pumpkin',744]]);columns([old[3].text,old[4].text]);rule();text(old[5].text);text(old[7].text);text(old[8].text);});
 page(10,({old,text,keep,figure,columns,rule})=>{keep(0);text(old[1].text);figure('veins',325,[['Hibiscus · reticulate',235],['Banana · parallel',526],['Grass · parallel',817]]);columns([old[2].text,old[3].text]);rule();for(const i of [5,6,7])text(old[i].text);});
 page(12,({old,text,keep,figure,columns,rule})=>{keep(0);text(old[1].text);figure('roots',350,[['Chana · taproot',308],['Wheat · fibrous roots',744]]);columns([old[2].text,old[3].text]);rule();text(old[5].text);columns([old[6].text,old[7].text]);});
 page(18,({old,text,keep,figure,columns,rule})=>{keep(0);text(old[1].text);text(old[2].text);keep(3);figure('desert',240,[['Cactus · hot desert',308],['Deodar · cold mountain',744]]);columns([[old[4].text,old[5].text],[old[6].text,old[7].text]]);rule();text(old[9].text);});
 page(19,({old,text,keep,figure,columns,rule})=>{text(old[0].text);keep(1);text(old[2].text);text(old[3].text);figure('camels',280,[['Dromedary · one hump',308],['Bactrian · two humps',744]]);columns([old[4].text,old[5].text]);rule();text(old[7].text);});
 page(21,({old,text,keep,columns,rule})=>{keep(0);for(const i of [1,2,3,4])text(old[i].text);columns([old[5].text,old[6].text]);text(old[7].text);rule();keep(8);for(const i of [9,10,11])text(old[i].text);});
 // Preserve the biography as a distinct editorial inset, then return to conservation.
 page(22,({old,text,head,beside,rule})=>{head('Know a scientist');text(old[1].text);rule();head('Protecting habitats');text(old[2].text);rule();beside('grove','A sacred grove',old[3].text);head('Checking Whether Protection Helps');text('Suppose a class records more kinds of birds in a protected grove than in a nearby clearing. Does that record alone show that protection caused the difference?');text('Check how the records were made. Were both places watched for the same length of time, at similar times of day? Could differences in area, water or vegetation also matter?');text('Plan repeated visits using the same method. Decide what to record so another class could check your comparison. A useful conclusion must account for both the evidence and its limits.');});
 return reports;
}
