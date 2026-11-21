const { chromium, webkit } = require('playwright');
(async()=>{ let bad=0;
 for (const bt of [chromium, webkit]) { const b=await bt.launch();
  for (const w of [320,360,390,768,1280]) for (const scale of [1,1.3]) {
   const p=await b.newPage({viewport:{width:w,height:800}}); await p.goto(process.env.URL || 'http://127.0.0.1:4173/'); await p.waitForSelector('#shipped li');
   if (scale>1) await p.addStyleTag({content:`html{font-size:${scale*100}%} .shipped time,.shipped .prod,.news time,.news .prod{font-size:${12*scale}px!important}`});
   const r=await p.evaluate(()=>{const o=[];const hit=(a,c)=>{const x=a.getBoundingClientRect(),y=c.getBoundingClientRect();return x.right>y.left+0.5&&y.right>x.left+0.5&&x.bottom>y.top+0.5&&y.bottom>x.top+0.5};
     for(const li of document.querySelectorAll('.shipped li,.news li')){const k=[...li.children];for(let i=0;i<k.length;i++)for(let j=i+1;j<k.length;j++)if(hit(k[i],k[j]))o.push(li.textContent.slice(0,30));}
     return {o:o.length,sw:document.documentElement.scrollWidth,vw:innerWidth};});
   if (r.o||r.sw>r.vw) {bad++; console.log(bt.name(),w,scale,r);} await p.close(); }
  await b.close(); }
 console.log(bad?'FAIL':'PASS no overlaps, no h-scroll'); process.exit(bad?1:0);})();
