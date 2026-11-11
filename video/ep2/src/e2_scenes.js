// ================= EGYPT EP2 =================
const E={sand:'#e6c88f',sand2:'#d4ad6c',stone:'#cfae7a',stone2:'#b8935c',gold:'#f2b632',lapis:'#2d5fb3',night1:'#1d2347',night2:'#3a2a52',fire:'#ff8a2b',teal:'#36e0cf'};
// ---------- extended chibi
function chibiE(X,Y,s,o={}){
  if(Y>=900&&!o.noLift)Y-=50;
  const P=Object.assign({skin:'#c98b5e',shirt:'#f4efe6',pants:'#2f3b57',shoe:'#3a2a1a'},o);const F=o.face||{};const lk=F.look||[0,0];
  x.save();x.translate(X,Y);x.scale(s*(o.flip?-1:1),s);
  if(o.kneel)x.translate(0,28);
  ell('rgba(20,20,30,.18)',0,2,46,8);
  // legs / robe
  if(o.robe){x.fillStyle=o.robe;x.beginPath();x.moveTo(-36,-110);x.lineTo(36,-110);x.lineTo(o.kneel?46:42,-6);x.lineTo(o.kneel?-46:-42,-6);x.closePath();x.fill();ell(P.shoe,-14,-4,13,6);ell(P.shoe,14,-4,13,6)}
  else if(!o.kneel){x.fillStyle=P.pants;rr(-25,-64,22,60,9);x.fill();rr(3,-64,22,60,9);x.fill();ell(P.shoe,-15,-5,16,8);ell(P.shoe,15,-5,16,8)}
  else{x.fillStyle=P.pants;rr(-30,-40,60,36,12);x.fill()}
  if(o.kilt){x.fillStyle=o.kilt;x.beginPath();x.moveTo(-38,-78);x.lineTo(38,-78);x.lineTo(44,-46);x.lineTo(-44,-46);x.closePath();x.fill();rect(E.gold,-38,-80,76,6)}
  // back arm
  const armC=o.bare?P.skin:P.shirt;
  x.save();x.translate(-38,-138);x.rotate(o.armB||0.08);x.fillStyle=armC;rr(-9,0,18,60,9);x.fill();circle(P.skin,0,62,9);
  if(o.spear){rect('#7a5232',-3,-150,6,250);poly('#cfd3d8',[-9,-150,0,-180,9,-150])}x.restore();
  // torso
  x.fillStyle=o.bare?P.skin:P.shirt;rr(-40,-152,80,98,24);x.fill();
  if(o.hoodie){x.fillStyle='rgba(0,0,0,.1)';rr(-24,-104,48,24,10);x.fill();x.strokeStyle='#fff';x.lineWidth=2.5;x.beginPath();x.moveTo(-7,-148);x.lineTo(-9,-122);x.moveTo(7,-148);x.lineTo(9,-122);x.stroke()}
  if(o.sash){x.fillStyle=o.sash;x.beginPath();x.moveTo(-40,-150);x.lineTo(-22,-150);x.lineTo(40,-70);x.lineTo(40,-56);x.closePath();x.fill();for(let i=0;i<5;i++)circle('#6b3d12',-20+i*12,-130+i*14,2.5)}
  if(o.collar){x.fillStyle=E.gold;x.beginPath();x.ellipse(0,-150,40,24,0,0,Math.PI);x.fill();x.strokeStyle=E.lapis;x.lineWidth=3;x.beginPath();x.ellipse(0,-150,30,16,0,0.15,Math.PI-0.15);x.stroke();x.beginPath();x.ellipse(0,-150,20,9,0,0.2,Math.PI-0.2);x.stroke()}
  // head
  const hs=o.head||'hero';
  if(hs==='nemes'||hs==='nemesAy'){const c1=hs==='nemesAy'?E.lapis:E.lapis,c2=E.gold;x.fillStyle=c2;x.beginPath();x.moveTo(-40,-150);x.lineTo(-36,-236);x.quadraticCurveTo(0,-256,36,-236);x.lineTo(40,-150);x.lineTo(28,-150);x.lineTo(26,-190);x.lineTo(-26,-190);x.lineTo(-28,-150);x.closePath();x.fill();
    x.save();x.clip();x.strokeStyle=c1;x.lineWidth=6;for(let yy=-250;yy<-140;yy+=14){x.beginPath();x.moveTo(-50,yy);x.lineTo(50,yy);x.stroke()}x.restore()}
  if(hs==='bob'){x.fillStyle='#16131a';rr(-40,-244,80,92,26);x.fill()}
  x.fillStyle=P.skin;rr(-33,-234,66,72,30);x.fill();
  if(hs!=='nemes'&&hs!=='nemesAy'&&hs!=='bob'&&hs!=='bald'){circle(P.skin,-33,-196,7);circle(P.skin,33,-196,7)}
  if(hs==='hero'){x.fillStyle=o.hair||'#4a2c1a';x.beginPath();x.moveTo(-34,-200);x.quadraticCurveTo(-38,-246,0,-244);x.quadraticCurveTo(38,-246,34,-202);x.quadraticCurveTo(26,-222,10,-218);x.quadraticCurveTo(-4,-230,-14,-216);x.quadraticCurveTo(-26,-214,-34,-200);x.fill()}
  if(hs==='nemes'||hs==='nemesAy'){x.fillStyle=E.gold;rr(-36,-238,72,20,8);x.fill();x.save();x.beginPath();x.rect(-36,-238,72,20);x.clip();x.fillStyle=E.lapis;for(let xx=-36;xx<40;xx+=12)x.fillRect(xx,-238,6,20);x.restore()}
  if(hs==='bob'){x.fillStyle='#16131a';x.beginPath();x.moveTo(-34,-236);x.quadraticCurveTo(0,-250,34,-236);x.lineTo(34,-212);x.quadraticCurveTo(0,-220,-34,-212);x.closePath();x.fill();rect(E.gold,-34,-214,68,4)}
  if(hs==='bald'){x.fillStyle='rgba(255,255,255,.12)';ell(x.fillStyle,-10,-222,12,6)}
  // face
  const ey=-196+lk[1]*2,ex=lk[0]*3;
  if(o.kohl){x.strokeStyle='#111';x.lineWidth=2;for(const sx of [-1,1]){x.beginPath();x.moveTo(sx*12+ex-6,ey);x.lineTo(sx*12+ex+sx*9,ey+1);x.stroke()}}
  circle('#1d1d24',-12+ex,ey,3.8);circle('#1d1d24',12+ex,ey,3.8);
  if(o.glow){circle(o.glow,-12+ex,ey,1.5);circle(o.glow,12+ex,ey,1.5)}
  x.strokeStyle=o.brow||'#3a2416';x.lineWidth=2.4;const fr=F.fear||0,ag=F.angry||0;x.beginPath();x.moveTo(-18+ex,-207-fr*2+ag*0);x.lineTo(-7+ex,-208-fr*4+ag*5);x.moveTo(7+ex,-208-fr*4+ag*5);x.lineTo(18+ex,-207-fr*2);x.stroke();
  if(o.old){x.strokeStyle='rgba(90,50,30,.5)';x.lineWidth=1.6;x.beginPath();x.moveTo(-26,-188);x.lineTo(-22,-184);x.moveTo(26,-188);x.lineTo(22,-184);x.moveTo(-8,-222);x.lineTo(8,-222);x.stroke();x.fillStyle='#5a4a3a';rr(-6,-170,12,16,4);x.fill()}
  if(!o.old)circle('rgba(240,120,120,.3)',-20,-182,5),circle('rgba(240,120,120,.3)',20,-182,5);
  const m=F.mouth||'flat';x.strokeStyle='#5a2a24';x.lineWidth=2.6;
  if(m==='o')ell('#5a2a24',ex,-178,4,5);else if(m==='smile'){x.beginPath();x.arc(ex,-183,7,0.2*Math.PI,0.8*Math.PI);x.stroke()}else if(m==='sly'){x.beginPath();x.moveTo(-7+ex,-179);x.quadraticCurveTo(2+ex,-176,9+ex,-182);x.stroke()}else{x.beginPath();x.moveTo(-5+ex,-178);x.lineTo(5+ex,-178);x.stroke()}
  // front arm
  x.save();x.translate(38,-138);const af=o.armF===undefined?-0.08:o.armF;x.rotate(af);x.fillStyle=armC;rr(-9,0,18,60,9);x.fill();circle(P.skin,0,62,9);
  if(o.hold==='phone'){x.translate(0,66);x.rotate(-af);if(o.flip)x.scale(-1,1);x.fillStyle='#111';rr(-10,-26,22,38,4);x.fill();rect(o.phoneLit?'#dff6ff':'#2a3a55',-8,-23,18,30);if(o.phoneLit){x.fillStyle='rgba(255,255,240,.5)';x.beginPath();x.moveTo(0,-26);x.lineTo(-90,-260);x.lineTo(90,-260);x.closePath();x.fill()}}
  if(o.torch){x.translate(0,66);x.rotate(-af);rect('#6b4a2b',-3,-40,6,60);poly('#ff6b1a',[-10,-40,0,-70-6*Math.sin(T*20),10,-40]);poly('#ffd23f',[-5,-40,0,-58,5,-40])}
  x.restore();
  x.restore();}
const heroE=(X,Y,s,o={})=>chibiE(X,Y,s,Object.assign({skin:'#f1c09a',shirt:'#ff7a3d',pants:'#3a5ba8',shoe:'#26262e',head:'hero',hoodie:true},o));
const guard=(X,Y,s,o={})=>chibiE(X,Y,s,Object.assign({bare:true,kilt:'#f4efe6',pants:'#c98b5e',head:'nemes',spear:true,face:{angry:1}},o));
const priest=(X,Y,s,o={})=>chibiE(X,Y,s,Object.assign({robe:'#f4efe6',shirt:'#f4efe6',head:'bald',sash:'#d9a441'},o));
const ay=(X,Y,s,o={})=>chibiE(X,Y,s,Object.assign({robe:'#f4efe6',shirt:'#f4efe6',head:'nemesAy',collar:true,old:true,kohl:true,brow:'#888',face:{mouth:'sly'}},o));
const merit=(X,Y,s,o={})=>chibiE(X,Y,s,Object.assign({robe:'#efe3c8',shirt:'#efe3c8',skin:'#b97a4e',head:'bob',kohl:true,face:{mouth:'flat'}},o));
// ---------- backgrounds
function nightCourt(){x.fillStyle=grad(0,H,'#2b2f6b','#e0784a');x.fillRect(0,0,W,H);const r=rng(4);for(let i=0;i<60;i++)circle(`rgba(255,255,255,${r()*0.8})`,r()*W,r()*420,r()*1.6);
  circle('#fff4d6',580,200,34);poly('#3b2a3f',[0,640,120,520,260,600,420,500,560,580,720,520,720,700,0,700]);
  rect(E.sand2,0,690,W,H-690);rect('#c39555',0,690,W,12);}
function torch(X,Y){rect('#5a3b22',X-6,Y,12,140);rect('#7a5232',X-14,Y-6,28,14);const f=1+0.12*Math.sin(T*18+X);x.fillStyle=rg(X,Y-30,5,160,'rgba(255,170,60,.45)','rgba(255,120,30,0)');x.fillRect(X-160,Y-190,320,320);poly('#ff6b1a',[X-18,Y-6,X,Y-60*f,X+18,Y-6]);poly('#ffd23f',[X-9,Y-6,X,Y-34*f,X+9,Y-6])}
function stake(X,Y,s=1){x.save();x.translate(X,Y);x.scale(s,s);x.fillStyle=rg(0,-250,10,200,'rgba(255,170,80,.35)','rgba(0,0,0,0)');x.fillRect(-200,-460,400,460);rect('#b07a44',-18,-360,36,360);rect('#d39a5c',-18,-360,10,360);poly('#b07a44',[-18,-360,0,-430,18,-360]);poly('#d39a5c',[-18,-360,0,-430,-8,-360]);x.strokeStyle='#7a5232';x.lineWidth=3;for(let i=0;i<6;i++){x.beginPath();x.moveTo(-10,-320+i*55);x.lineTo(6,-300+i*55);x.stroke()}x.restore()}
function hallBGE(){x.fillStyle=grad(0,H,'#7a4a2a','#3b2416');x.fillRect(0,0,W,H);
  for(let i=0;i<4;i++){const X=60+i*200;rect(E.stone,X-34,180,68,560);rect(E.stone2,X-34,180,14,560);rect(E.lapis,X-48,160,96,26);rect(E.gold,X-48,186,96,10);for(let k=0;k<5;k++)rect('rgba(45,95,179,.35)',X-34,260+k*90,68,8)}
  rect('#8a5a34',0,740,W,H-740);x.fillStyle='rgba(0,0,0,.12)';for(let i=0;i<10;i++)x.fillRect(0,760+i*50,W,3);
  x.fillStyle=rg(360,500,50,600,'rgba(255,190,90,.25)','rgba(0,0,0,0)');x.fillRect(0,0,W,H)}
function tombExt(glow){x.fillStyle=grad(0,H,'#131735','#3d2a4a');x.fillRect(0,0,W,H);const r=rng(9);for(let i=0;i<80;i++)circle(`rgba(255,255,255,${r()*0.9})`,r()*W,r()*520,r()*1.7);
  poly('#5b3e3a',[0,760,80,420,240,360,420,300,600,380,720,340,720,760]);poly('#4a3232',[0,760,0,560,180,520,360,600,540,520,720,580,720,760]);
  rect('#2a1c1c',230,500,260,280);rect(E.stone2,250,520,220,260);x.strokeStyle='#7a5a3a';x.lineWidth=4;x.strokeRect(250,520,220,260);
  if(glow>0){x.fillStyle=`rgba(54,224,207,${0.6*glow})`;x.fillRect(250,770,220,10);x.fillRect(356,520,8,260);x.fillStyle=rg(360,650,10,320,`rgba(54,224,207,${0.35*glow})`,'rgba(54,224,207,0)');x.fillRect(0,300,W,700)}
  rect(E.sand2,0,760,W,H-760);
  // seal
  circle('#8a2f24',360,640,46);x.strokeStyle=E.gold;x.lineWidth=4;rr(342,602,36,76,16);x.stroke()}
function phoneBig(X,Y,s,fn){x.save();x.translate(X,Y);x.scale(s,s);x.fillStyle='#0b0b0d';rr(-170,-330,340,660,40);x.fill();x.fillStyle='#10131b';rr(-158,-316,316,632,32);x.fill();rect('#0b0b0d',-40,-310,80,18);x.save();x.beginPath();rr(-158,-316,316,632,32);x.clip();fn();x.restore();x.restore()}
function goldMask(X,Y,s){x.save();x.translate(X,Y);x.scale(s,s);
  x.fillStyle=E.gold;x.beginPath();x.moveTo(-90,-110);x.quadraticCurveTo(0,-150,90,-110);x.lineTo(110,90);x.lineTo(-110,90);x.closePath();x.fill();
  x.save();x.clip();x.fillStyle=E.lapis;for(let yy=-150;yy<100;yy+=22)x.fillRect(-120,yy,240,10);x.restore();
  x.fillStyle='#f6c64a';rr(-58,-100,116,150,50);x.fill();
  for(const sx of [-1,1]){ell('#fff',sx*24,-40,14,8);circle('#111',sx*24,-40,6);x.strokeStyle=E.lapis;x.lineWidth=5;x.beginPath();x.moveTo(sx*10,-40);x.lineTo(sx*44,-38);x.stroke()}
  rect('#d99a2a',-6,-30,12,40);x.strokeStyle='#a8711a';x.lineWidth=4;x.beginPath();x.moveTo(-14,22);x.lineTo(14,22);x.stroke();
  x.fillStyle=E.lapis;rr(-12,52,24,56,8);x.fill();x.fillStyle=E.gold;circle(E.gold,0,-112,10);
  x.fillStyle=E.gold;x.beginPath();x.ellipse(0,98,120,40,0,0,Math.PI);x.fill();x.strokeStyle=E.lapis;x.lineWidth=6;x.beginPath();x.ellipse(0,98,96,26,0,0.1,Math.PI-0.1);x.stroke();x.restore()}
function bubbleE(Xc,Y,lines,o={}){const size=o.size||30;x.font=`900 ${size}px M`;const w=Math.max(...lines.map(l=>x.measureText(l).width))+50,h=lines.length*size*1.3+34;x.save();x.translate(Xc,Y);
  x.fillStyle='rgba(20,20,30,.2)';rr(-w/2+5,-h/2+8,w,h,22);x.fill();x.fillStyle=o.bg||'#fffaf0';rr(-w/2,-h/2,w,h,22);x.fill();poly(o.bg||'#fffaf0',[(o.tx||0)-14,h/2-2,(o.tx||0)+14,h/2-2,(o.tx||0)+(o.tdx||0),h/2+28]);
  lines.forEach((l,i)=>txt(l,0,(i-(lines.length-1)/2)*size*1.3,size,o.fg||C.ink));x.restore()}
function ruleCardE(n,l1,l2,t,t0){const p=pop(t,t0,0.4);x.save();x.translate(360,470);x.scale(p,p);card(-300,-190,600,380,'#fffaf0',26);x.fillStyle=E.gold;rr(-300,-190,600,80,26);x.fill();rect(E.gold,-300,-140,600,30);txt('ПРАВИЛО №'+n,0,-148,34,C.ink);fitTxt(l1,0,-30,46,C.ink,540);fitTxt(l2,0,40,46,C.red,540);x.restore()}

// ---------- HUD
function hudE(t){if(t>=TM.endCard)return;const Lx=id=>TM.lines.find(l=>l.id===id);
  x.fillStyle='rgba(18,20,34,.82)';rr(16,18,214,44,22);x.fill();circle(Math.floor(t*2)%2?C.red:'#7a1c1f',38,40,6);txt('1323 ДО Н.Э.',52,41,20,'#fff','left');
  x.fillStyle=C.red;rr(238,18,110,44,22);x.fill();txt('СЕРИЯ 2',293,41,18,'#fff');
  // battery
  let b=4;if(t>=Lx('flash').s+0.2)b=3;if(t>=Lx('mask').e)b=2;if(t>=Lx('notif').s)b=1;
  x.fillStyle='rgba(18,20,34,.82)';rr(W-160,18,144,44,22);x.fill();x.strokeStyle=b<=1?C.red:'#fff';x.lineWidth=3;x.strokeRect(W-146,30,40,20);rect(b<=1?C.red:'#fff',W-106,36,4,8);rect(b<=2?C.red:'#ffc83d',W-143,33,Math.max(3,b*4),14);txt(b+'%',W-50,41,22,b<=1?'#ff6b6b':'#fff');
  // execution timer
  const sv=Lx('saved');let s_;
  if(t<sv.s+0.6){const rem=Math.max(0,6*3600-(t/sv.s)*(3*3600+1260));const hh=Math.floor(rem/3600),mm=Math.floor(rem%3600/60),ss=Math.floor(rem%60);
    s_='ДО КАЗНИ  '+String(hh).padStart(2,'0')+':'+String(mm).padStart(2,'0')+':'+String(ss).padStart(2,'0');x.fillStyle='rgba(229,56,59,.92)'}
  else{s_='КАЗНЬ ОТМЕНЕНА';x.fillStyle='rgba(34,179,94,.92)'}
  x.font='900 22px M';const w=x.measureText(s_).width+36;rr(W/2-w/2,72,w,44,22);x.fill();txt(s_,W/2,95,22,'#fff');}
// ---------- scenes
const SC={};
SC.hook=(t,L)=>{const lt=t-L.s;nightCourt();torch(80,520);torch(640,520);stake(360,820,1.25);
  guard(170,960,1.4,{armF:-0.6});guard(550,960,1.4,{flip:true,armF:-0.6});heroE(360,975,1.45,{face:{fear:1,mouth:'o',look:[0,-1]},armB:0.5,armF:-0.5});
  const pulse=1+0.04*Math.sin(t*8);x.save();x.translate(360,250);x.rotate(-0.06);x.scale(pulse,pulse);x.font='900 50px M';const w=x.measureText('КАЗНЬ НА РАССВЕТЕ').width+50;
  x.fillStyle='rgba(255,250,240,.95)';rr(-w/2,-46,w,92,14);x.fill();x.strokeStyle=C.red;x.lineWidth=8;rr(-w/2,-46,w,92,14);x.stroke();txt('КАЗНЬ НА РАССВЕТЕ',0,4,50,C.red);x.restore();
  if(lt<0.25)shake=12;};
SC.recap=(t,L)=>{const lt=t-L.s,d=L.e-L.s;
  if(lt<d*0.5){tombExt(0.8+0.2*Math.sin(t*5));const p=pop(t,L.s+0.6);x.save();x.translate(360,420);x.scale(p,p);card(-250,-40,500,80,'#fffaf0',40);txt('МАШИНА ВРЕМЕНИ — ВНУТРИ',0,2,28,C.ink);x.restore();
    if(lt<0.5){x.fillStyle=`rgba(255,255,255,${0.6*(1-lt/0.5)})`;x.fillRect(0,0,W,H)}return}
  x.fillStyle=grad(0,H,'#2b2f6b','#141633');x.fillRect(0,0,W,H);
  phoneBig(360,560,1.0,()=>{x.fillStyle=grad(-316,316,'#20263a','#0c0f18');x.fillRect(-158,-316,316,632);x.strokeStyle=C.red;x.lineWidth=10;x.strokeRect(-70,-60,120,70);rect(C.red,50,-40,12,30);rect(C.red,-62,-52,14,54);
    txt('4%',0,90,96,'#ff4d4f');txt('Подключите зарядное',0,170,18,'rgba(255,255,255,.6)','center',700);});};
SC.rule1=(t,L)=>{x.fillStyle=grad(0,H,'#2b2f6b','#141633');x.fillRect(0,0,W,H);stake(600,1000,0.9);ruleCardE(1,'ГРАБИТЕЛЕЙ ГРОБНИЦ','САЖАЮТ НА КОЛ',t,L.s);};
SC.hall=(t,L)=>{const lt=t-L.s,d=L.e-L.s;hallBGE();
  rect(E.gold,470,640,170,30);rect('#c08a2a',480,670,20,90);rect('#c08a2a',610,670,20,90);rect(E.gold,600,480,30,170);
  ay(545,760,1.25,{flip:true,face:{mouth:'sly',look:[-1,0]}});
  const q=eo(prog(lt,0,d*0.6));const hx=lerp(60,300,q);guard(hx-80,960,1.1,{armF:-1.2});heroE(hx+20,960,1.15,{face:{fear:1,mouth:'o',look:[1,0]},armB:-0.6});guard(hx+120,960,1.1,{armF:-1.2});
  if(lt>d*0.3){const p=pop(t,L.s+d*0.3);x.save();x.translate(545,360);x.scale(p,p);card(-120,-34,240,68,'#fffaf0',34);txt('ВИЗИРЬ ЭЙЕ',0,1,26,C.ink);x.restore()}
  if(lt>d*0.62){const p=pop(t,L.s+d*0.62);x.save();x.translate(545,440);x.scale(p,p);x.fillStyle=E.gold;rr(-140,-26,280,52,26);x.fill();txt('СКОРО ФАРАОН',0,1,24,C.ink);x.restore()}};
SC.flash=(t,L)=>{const lt=t-L.s,d=L.e-L.s;hallBGE();
  const kneel=lt>d*0.35;priest(110,960,1.0,{kneel,face:{fear:1,mouth:'o'}});guard(230,960,1.0,{kneel,spear:!kneel,face:{fear:kneel?1:0,mouth:kneel?'o':'flat'}});priest(640,960,1.0,{kneel,flip:true,face:{fear:1,mouth:'o'}});
  ay(520,880,1.0,{flip:true,face:{mouth:'flat',look:[-1,0]}});
  heroE(380,980,1.2,{armF:-2.6,hold:'phone',phoneLit:true,face:{mouth:'smile',look:[0,-1]}});
  if(lt<0.45){x.fillStyle=`rgba(255,255,255,${1-lt/0.45})`;x.fillRect(0,0,W,H);shake=10}
  if(kneel){const p=pop(t,L.s+d*0.4);x.save();x.translate(360,320);x.scale(p,p);card(-220,-36,440,72,'#fffaf0',36);txt('ВСЕ НА КОЛЕНЯХ',0,2,30,C.ink);x.restore()}};
SC.mask=(t,L)=>{const lt=t-L.s,d=L.e-L.s;
  if(lt<d*0.35){hallBGE();priest(110,960,1.0,{kneel:true});priest(640,960,1.0,{kneel:true,flip:true});ay(470,960,1.25,{flip:true,armF:-1.0,hold:'phone',phoneLit:true,face:{mouth:'flat',look:[-1,-1]}});heroE(240,960,1.15,{face:{fear:0.7,look:[1,0]}});
    const p=pop(t,L.s+0.1);x.save();x.translate(470,330);x.scale(p,p);card(-120,-34,240,68,'#fffaf0',34);txt('НО НЕ ЭЙЕ',0,1,26,C.red);x.restore();return}
  x.fillStyle=grad(0,H,'#3b2416','#1a0f0a');x.fillRect(0,0,W,H);
  phoneBig(360,580,1.05,()=>{x.fillStyle='#1b1b22';x.fillRect(-158,-316,316,632);rect('#2a2a36',-158,-316,316,56);txt('Фото',0,-288,20,'#fff');goldMask(0,20,1.05);txt('Маска Тутанхамона',0,250,18,'rgba(255,255,255,.75)','center',700)});};
SC.ten=(t,L)=>{const lt=t-L.s,d=L.e-L.s;x.fillStyle=grad(0,H,'#3b1d16','#140806');x.fillRect(0,0,W,H);goldMask(360,470,1.6);
  x.fillStyle=rg(360,500,80,700,'rgba(0,0,0,0)','rgba(120,0,0,.55)');x.fillRect(0,0,W,H);
  const p=pop(t,L.s+d*0.25);x.save();x.translate(360,240);x.scale(p,p);card(-220,-36,440,72,'#fffaf0',36);txt('ВЧЕРА — В ГРОБНИЦУ',0,2,28,C.ink);x.restore();
  if(lt>d*0.55){const p2=pop(t,L.s+d*0.55);x.save();x.translate(360,780);x.scale(p2,p2);x.fillStyle=C.red;rr(-230,-34,460,68,34);x.fill();txt('ВИДЕЛИ ЕДИНИЦЫ',0,2,28,'#fff');x.restore()}};
SC.ay=(t,L)=>{const lt=t-L.s,d=L.e-L.s;hallBGE();x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,0,W,H);
  const z=lerp(2.6,2.9,prog(lt,0,d));ay(360,1240+(z-2.6)*100,z,{face:{mouth:'sly',look:[0,0.6]},glow:'#fff'});
  if(lt>0.4){const p=pop(t,L.s+0.4);x.save();x.translate(360,250);x.scale(p,p);bubbleE(0,0,['КТО СТАНЕТ','СЛЕДУЮЩИМ ФАРАОНОМ?'],{size:32,tx:0,tdx:0});x.restore()}};
SC.rule2=(t,L)=>{const lt=t-L.s,d=L.e-L.s;
  if(lt<d*0.42){x.fillStyle=grad(0,H,'#2b2f6b','#141633');x.fillRect(0,0,W,H);heroE(360,960,1.4,{face:{look:[1,-1],mouth:'flat'}});
    const p=pop(t,L.s+0.3);x.save();x.translate(360,330);x.scale(p,p);card(-260,-90,520,180,'#fffaf0',30);txt('ТЫ ЗНАЕШЬ ОТВЕТ:',0,-40,26,'rgba(29,36,51,.6)');txt('ФАРАОН — ОН САМ',0,25,44,C.red);x.restore();return}
  x.fillStyle=grad(0,H,'#2b2f6b','#141633');x.fillRect(0,0,W,H);ruleCardE(2,'НИКОГДА НЕ ГОВОРИ','ВСЮ ПРАВДУ',t,L.s+d*0.42);};
SC.answer=(t,L)=>{const lt=t-L.s;hallBGE();ay(530,960,1.3,{flip:true,face:{mouth:lt>1.6?'smile':'flat',look:[-1,0]}});heroE(220,960,1.3,{face:{mouth:'flat',look:[1,0]},armF:-0.6});
  const p=pop(t,L.s+0.3);x.save();x.translate(300,300);x.scale(p,p);bubbleE(0,0,['ТЫ СТАНЕШЬ ФАРАОНОМ.','ЕСЛИ Я БУДУ РЯДОМ'],{size:30,tx:-80,tdx:-30});x.restore()};
SC.saved=(t,L)=>{const lt=t-L.s,d=L.e-L.s;hallBGE();
  if(lt<d*0.45){ay(530,960,1.3,{flip:true,face:{mouth:'smile'}});heroE(220,960,1.3,{face:{mouth:'smile'}});stamp('КАЗНЬ ОТМЕНЕНА',360,330,t,L.s+0.25,C.green,48,-0.08);return}
  // doorway with Merit
  x.fillStyle='rgba(0,0,0,.3)';x.fillRect(0,0,W,H);rect('#1a0f0a',380,380,240,400);x.fillStyle=rg(500,600,20,260,'rgba(255,190,90,.35)','rgba(0,0,0,0)');x.fillRect(380,380,240,400);
  merit(500,770,1.1,{face:{look:[-1,0]}});heroE(200,960,1.3,{face:{look:[1,-0.5],mouth:'o'}});
  const p=pop(t,L.s+d*0.6);x.save();x.translate(500,300);x.scale(p,p);card(-110,-34,220,68,'#fffaf0',34);txt('МЕРИТ',0,1,30,C.ink);x.restore()};
SC.merit=(t,L)=>{const lt=t-L.s,d=L.e-L.s;x.fillStyle=grad(0,H,'#3b2416','#1a0f0a');x.fillRect(0,0,W,H);
  // papyrus map
  const p=pop(t,L.s+0.1);x.save();x.translate(360,420);x.scale(p,p);x.rotate(-0.03);card(-270,-200,540,400,'#ead7a8',12);
  x.strokeStyle='#5a3b22';x.lineWidth=6;x.strokeRect(-200,-120,160,110);x.strokeRect(40,-120,160,110);x.beginPath();x.moveTo(-40,-65);x.lineTo(40,-65);x.moveTo(-120,-10);x.lineTo(-120,120);x.stroke();
  txt('ГРОБНИЦА',120,-140,18,'#5a3b22');
  if(lt>d*0.45){x.strokeStyle=C.red;x.setLineDash([12,10]);x.lineWidth=6;x.beginPath();x.moveTo(-240,150);x.quadraticCurveTo(0,180,120,-10);x.stroke();x.setLineDash([]);txt('ВТОРОЙ ХОД',-60,175,22,C.red)}
  x.restore();merit(360,1000,1.5,{face:{look:[0,-0.5]}});};
SC.notif=(t,L)=>{const lt=t-L.s,d=L.e-L.s;x.fillStyle=grad(0,H,'#141633','#0a0b18');x.fillRect(0,0,W,H);
  phoneBig(360,600,1.05,()=>{x.fillStyle=grad(-316,316,'#20263a','#0c0f18');x.fillRect(-158,-316,316,632);txt('1%',0,40,110,'#ff4d4f');
    if(lt>d*0.42){const q=eo(prog(lt,d*0.42,d*0.42+0.3));x.save();x.translate(0,lerp(-420,-200,q));card(-145,-60,290,120,'rgba(245,247,250,.97)',22,false);x.fillStyle=E.teal;rr(-130,-44,56,56,14);x.fill();txt('⏱',-102,-16,26,'#fff');
      txt('МАШИНА ВРЕМЕНИ',-62,-28,16,C.ink,'left');txt('Заряд: 9%',-62,4,22,'#0a8a7c','left');txt('сейчас',120,-28,12,'#889','right',700);x.restore();if(lt<d*0.42+0.25)shake=8}});};
SC.twist=(t,L)=>{const lt=t-L.s;const g=0.6+0.4*Math.abs(Math.sin(t*4));tombExt(g*(0.5+lt*0.3));shake=3+2*Math.sin(t*20);
  const p=pop(t,L.s+0.6);x.save();x.translate(360,300);x.scale(p,p);outlined('КТО ВНУТРИ?',0,0,76,'#fff');x.restore()};
SC.cta=(t,L)=>{tombExt(0.7);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,0,W,H);const p=pop(t,L.s+0.1);x.save();x.translate(360,330);x.scale(p,p);card(-260,-80,520,160,'#fffaf0',28);txt('КТО ТАМ?',0,-30,44,C.ink);txt('ПИШИ В КОММЕНТАРИЯХ',0,30,26,C.red);x.restore()};
SC.end=(t)=>{x.fillStyle=grad(0,H,'#2b2f6b','#141633');x.fillRect(0,0,W,H);const p=pop(t,TM.endCard+0.1);x.save();x.translate(360,560);x.scale(p,p);outlined('СЕРИЯ 3',0,-50,100,'#fff');outlined('СКОРО',0,50,80,C.red);txt('ПОДПИШИСЬ, ЧТОБЫ НЕ ПРОПУСТИТЬ',0,140,24,'rgba(255,255,255,.75)');x.restore()};
const hud=hudE;
