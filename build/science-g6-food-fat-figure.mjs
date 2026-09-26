// Reassemble the existing full-resolution strips; labels stay live and the
// polar bear belongs to its own explanatory unit, outside the food figure.
export function fatSourceFigure(){
 const label=(s,x,y,group=false)=>`<text class="${group?'g6-figure-group':'se-copy se-table-copy'}" x="${x}" y="${y}"${group?'':' text-anchor="middle"'}>${s}</text>`;
 const strip=(name,y,h)=>`<image class="science-illustration" href="../../figures/reference/food/p009-${name}.png" x="6" y="${y}" width="862" height="${h}" preserveAspectRatio="xMidYMid meet"><title>${name.replaceAll('-',' ')}</title></image>`;
 const rows=[
  {names:['Groundnut','Walnut','Cashew','Almond','Pistachio'],xs:[90.305,275.02,432.264,600.875,772.327],y:68,image:'nuts',h:118.407},
  {names:['Sesame seed','Sunflower seed','Soya bean','Coconut oil','Mustard oil'],xs:[79.162,255.502,429.027,602.553,771.388],y:257,image:'seeds-oils',h:138.82},
  {names:['Sunflower oil','Butter','Ghee','Curd'],xs:[104.335,347.034,552.073,776.988],y:502,image:'dairy-oil',h:144.364},
 ];
 const svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 874 664">'
  +label('Plant sources',6,24,true)
  +rows.map(r=>r.names.map((s,i)=>label(s,r.xs[i],r.y)).join('')+strip(r.image,r.y+8,r.h)).join('')
  +'<path class="v2-table-rule" d="M243 437V653"/></svg>';
 return {type:'figure',keepNext:true,caption:'Fig. 3.3 · Some sources of fats',art:[{kind:'vector',svg,w:874,h:664}]};
}
