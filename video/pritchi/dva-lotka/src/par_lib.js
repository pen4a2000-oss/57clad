// ---------- paper-cutout character (thick outline head, stick limbs)
function toon(X,Y,s,o={}){x.save();x.translate(X,Y);x.scale(s*(o.flip?-1:1),s);x.lineJoin='round';x.lineCap='round';
  ell('rgba(0,0,0,.35)',0,2,34,8);
  // legs (thin lines) + shoes
  x.strokeStyle=INK;x.lineWidth=4;x.beginPath();x.moveTo(-9,-70);x.lineTo(-11,-6);x.moveTo(9,-70);x.lineTo(11,-6);x.stroke();
  ell(INK,-15,-4,10,5);ell(INK,15,-4,10,5);
  // torso
  const tc=o.torso||'#3d5a80';x.fillStyle=tc;x.beginPath();x.moveTo(-24,-128);x.lineTo(24,-128);x.lineTo(30,-66);x.lineTo(-30,-66);x.closePath();x.fill();x.lineWidth=3.5;x.strokeStyle=INK;x.stroke();
  if(o.apron){x.fillStyle=o.apron;x.beginPath();x.moveTo(-16,-112);x.lineTo(16,-112);x.lineTo(22,-68);x.lineTo(-22,-68);x.closePath();x.fill();x.stroke()}
  if(o.bow){x.fillStyle='#c0392b';poly('#c0392b',[-10,-126,0,-121,-10,-116]);poly('#c0392b',[10,-126,0,-121,10,-116])}
  // arms (lines)
  x.lineWidth=4;x.beginPath();const aL=o.armL||[-38,-82],aR=o.armR||[38,-82];x.moveTo(-22,-122);x.lineTo(aL[0],aL[1]);x.moveTo(22,-122);x.lineTo(aR[0],aR[1]);x.stroke();
  ell('#f6ead8',aL[0],aL[1],5,5);ell('#f6ead8',aR[0],aR[1],5,5);
  // neck
  x.beginPath();x.moveTo(0,-128);x.lineTo(0,-140);x.stroke();
  // head
  const hr=o.hr||46;x.fillStyle=lg(-hr,-190,hr,-150,[[0,'#fbf3e6'],[1,'#ead8be']]);x.beginPath();x.arc(0,-182,hr,0,Math.PI*2);x.fill();x.lineWidth=4.5;x.strokeStyle=INK;x.stroke();
  // hair
  const hc=o.hairC||'#8a4b2a';
  if(o.hair==='side'){x.fillStyle=hc;x.beginPath();x.moveTo(-hr-2,-186);x.quadraticCurveTo(-hr+4,-hr-205,8,-hr-186);x.quadraticCurveTo(hr+8,-hr-180,hr+2,-196);x.quadraticCurveTo(10,-206,-16,-198);x.quadraticCurveTo(-30,-190,-hr-2,-186);x.fill();x.lineWidth=3.5;x.stroke()}
  else if(o.hair==='spiky'){x.fillStyle=hc;x.beginPath();x.moveTo(-hr,-196);for(let i=0;i<7;i++){const a=Math.PI*(1.05+i*0.15);x.lineTo(Math.cos(a)*(hr+14),-182+Math.sin(a)*(hr+14));x.lineTo(Math.cos(a+0.07)*(hr-2),-182+Math.sin(a+0.07)*(hr-2))}x.lineTo(hr,-196);x.quadraticCurveTo(0,-210,-hr,-196);x.fill();x.lineWidth=3;x.stroke()}
  else if(o.hair==='bun'){x.fillStyle=hc;x.beginPath();x.arc(0,-188,hr+1,Math.PI*1.08,Math.PI*1.92);x.quadraticCurveTo(0,-206,-hr+3,-205);x.fill();x.stroke();ell(hc,0,-240,16,14);x.beginPath();x.ellipse(0,-240,16,14,0,0,Math.PI*2);x.stroke()}
  else if(o.hair==='cap'){x.fillStyle=o.capC||'#2d6a4f';x.beginPath();x.arc(0,-190,hr+1,Math.PI*1.02,Math.PI*1.98);x.closePath();x.fill();x.stroke();rr(4,-196,hr+10,10,5);x.fill();x.stroke()}
  // face
  const m=o.mood||'calm';x.strokeStyle=INK;x.fillStyle=INK;x.lineWidth=3.5;
  if(m==='smug'){x.beginPath();x.moveTo(-24,-198);x.lineTo(-8,-194);x.moveTo(8,-194);x.lineTo(24,-198);x.stroke();x.beginPath();x.moveTo(-20,-182);x.quadraticCurveTo(-14,-186,-8,-182);x.moveTo(8,-182);x.quadraticCurveTo(14,-186,20,-182);x.stroke();x.beginPath();x.moveTo(-12,-162);x.quadraticCurveTo(4,-154,18,-166);x.stroke()}
  else if(m==='bored'){x.beginPath();x.moveTo(-24,-184);x.lineTo(-8,-184);x.moveTo(8,-184);x.lineTo(24,-184);x.stroke();ell(INK,-16,-180,3,3);ell(INK,16,-180,3,3);x.beginPath();x.moveTo(-8,-160);x.lineTo(8,-162);x.stroke();x.beginPath();x.moveTo(-26,-196);x.lineTo(-8,-200);x.moveTo(8,-200);x.lineTo(26,-196);x.stroke()}
  else if(m==='happy'){x.beginPath();x.arc(-14,-182,7,Math.PI*1.1,Math.PI*1.9);x.moveTo(7,-182);x.arc(14,-182,7,Math.PI*1.1,Math.PI*1.9);x.stroke();x.beginPath();x.arc(0,-166,12,0.15*Math.PI,0.85*Math.PI);x.stroke();ell('rgba(240,120,110,.35)',-26,-168,7,4);ell('rgba(240,120,110,.35)',26,-168,7,4)}
  else if(m==='wow'){ell(INK,-14,-184,4,5.5);ell(INK,14,-184,4,5.5);ell(INK,0,-160,6,8);x.beginPath();x.moveTo(-22,-200);x.lineTo(-8,-204);x.moveTo(8,-204);x.lineTo(22,-200);x.stroke()}
  else {ell(INK,-14+(o.look||0)*4,-184,3.8,5);ell(INK,14+(o.look||0)*4,-184,3.8,5);x.beginPath();x.moveTo(-6,-162);x.lineTo(6,-162);x.stroke()}
  if(o.glasses){x.lineWidth=2.5;x.beginPath();x.arc(-14,-184,10,0,Math.PI*2);x.moveTo(24,-184);x.arc(14,-184,10,0,Math.PI*2);x.moveTo(-4,-184);x.lineTo(4,-184);x.stroke()}
  x.restore()}
// ---------- props
function melon(X,Y,r,cut){x.save();x.translate(X,Y);
  if(cut){x.fillStyle='#e8433f';x.beginPath();x.arc(0,0,r,Math.PI,0);x.fill();x.fillStyle='#f4ecd2';x.beginPath();x.arc(0,0,r,Math.PI,0);x.arc(0,0,r*0.86,0,Math.PI,true);x.fill();x.fillStyle='#2e6b2f';x.fillRect(-r,-3,r*2,6);for(let i=0;i<5;i++)ell('#1e130c',-r*0.45+i*r*0.22,-r*0.4-(i%2)*r*0.12,2,3);x.restore();return}
  x.fillStyle=rg(-r*0.35,-r*0.35,r*0.1,r*1.05,'#5cae4f','#1d4f22');x.beginPath();x.arc(0,0,r,0,Math.PI*2);x.fill();
  x.strokeStyle='rgba(15,45,15,.6)';x.lineWidth=r*0.13;for(let i=-2;i<=2;i++){x.beginPath();x.ellipse(i*r*0.33,0,r*0.11,r*0.94,0,0,Math.PI*2);x.stroke()}
  ell('rgba(255,255,255,.22)',-r*0.35,-r*0.42,r*0.22,r*0.12,-0.6);x.restore()}
function stall3d(X,Y,s,awnA,price,tag,glow,part){x.save();x.translate(X,Y);x.scale(s,s);
  if(part==='back'){
    ell('rgba(0,0,0,.35)',0,10,190,26);
    x.fillStyle='#4a301c';x.fillRect(-160,-300,320,170);
    x.fillStyle=lg(-168,0,-150,0,[[0,'#8a5d36'],[1,'#5e3d22']]);x.fillRect(-168,-330,18,330);x.fillStyle=lg(150,0,168,0,[[0,'#8a5d36'],[1,'#5e3d22']]);x.fillRect(150,-330,18,330);
    x.fillStyle=rg(0,-252,2,150,'rgba(255,214,140,.5)','rgba(255,214,140,0)');x.fillRect(-160,-400,320,300);
  } else {
    x.fillStyle='#b98450';x.beginPath();x.moveTo(-180,-140);x.lineTo(180,-140);x.lineTo(160,-170);x.lineTo(-160,-170);x.closePath();x.fill();
    x.fillStyle=lg(0,-140,0,0,[[0,'#9a6a3c'],[1,'#6e4826']]);x.fillRect(-180,-140,360,140);
    x.strokeStyle='rgba(40,20,8,.45)';x.lineWidth=3;for(let i=1;i<4;i++){x.beginPath();x.moveTo(-180,-140+i*35);x.lineTo(180,-140+i*35);x.stroke()}
    [[30,-180,30],[88,-180,32],[142,-180,26],[58,-220,30],[116,-220,26],[86,-256,24]].forEach(([a,b2,r])=>melon(a,b2,r));
    if(glow)melon(-130,-168,24,true);
    for(let i=0;i<8;i++){const a=-185+i*46.25,b2=a+46.25;x.fillStyle=i%2?awnA:'#f3eadb';x.beginPath();x.moveTo(a*0.88,-360);x.lineTo(b2*0.88,-360);x.lineTo(b2,-300);x.lineTo(a,-300);x.closePath();x.fill()}
    for(let i=0;i<8;i++){x.fillStyle=i%2?awnA:'#f3eadb';x.beginPath();x.arc(-185+i*46.25+23,-300,23,0,Math.PI);x.fill()}
    x.strokeStyle='#222';x.lineWidth=2;x.beginPath();x.moveTo(60,-280);x.lineTo(60,-262);x.stroke();ell('#fff3c8',60,-254,8,10);
    x.save();x.translate(0,-418);x.rotate(glow?0.035:-0.045);x.fillStyle='#1f2422';rr(-112,-58,224,116,8);x.fill();x.strokeStyle='#8a5d36';x.lineWidth=9;rr(-112,-58,224,116,8);x.stroke();
    x.fillStyle='#f4f1e8';x.font='900 54px M';x.textAlign='center';x.textBaseline='middle';x.fillText(price,0,-8);x.font='700 20px M';x.fillStyle=glow?'#ffd36b':'#bbb';x.fillText(tag,0,34);x.restore();
    x.strokeStyle='#3a2a1a';x.lineWidth=3;x.beginPath();x.moveTo(-70,-360);x.lineTo(-50,-382);x.moveTo(70,-360);x.lineTo(50,-382);x.stroke();
  }
  x.restore()}
