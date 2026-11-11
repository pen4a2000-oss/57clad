function render(t){T=t;shake=0;x.setTransform(1.5,0,0,1.5,0,0);x.globalAlpha=1;x.textAlign='left';x.setLineDash([]);
  let L=TM.lines.find(l=>t<l.e+(l.gapAfter||0))||null;
  if(t>=TM.endCard){SC.end(t)}else{L=TM.lines.find((l,i)=>t<(TM.lines[i+1]?TM.lines[i+1].s:TM.endCard))||TM.lines[TM.lines.length-1];x.save();SC[L.id](t,L);x.restore()}
  if(shake>0){const img=x.getImageData(0,0,c.width,c.height);const r=rng(Math.floor(t*60));x.fillStyle='#000';x.fillRect(0,0,W,H);x.putImageData(img,Math.round((r()-0.5)*shake*3),Math.round((r()-0.5)*shake*3))}
  hud(t);captions(t);}
window.render=render;
window.ready=document.fonts.load('900 40px M','ПРАВИЛО').then(()=>document.fonts.load('700 20px M','Я'));
</script></body></html>
