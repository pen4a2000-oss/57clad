// ---------- LOBBY world (lift parable)
function bgLobby(){const [cv,g]=layer();const sv=x;x=g;
  x.fillStyle=lg(0,0,0,760,[[0,'#3a2c26'],[1,'#7a5a46']]);x.fillRect(0,0,W,1280);
  // marble wall panels
  for(let i=0;i<8;i++){x.fillStyle=i%2?'#e9dcc6':'#dccbb0';x.fillRect(i*95-20,120,90,520);x.strokeStyle='rgba(120,90,60,.25)';x.lineWidth=2;for(let k=0;k<4;k++){x.beginPath();x.moveTo(i*95-10+k*20,140);x.quadraticCurveTo(i*95+30,300+k*40,i*95+10+k*15,620);x.stroke()}}
  // ceiling lamps
  for(let i=0;i<5;i++){const lx=80+i*140;x.fillStyle=rg(lx,110,4,140,'rgba(255,220,150,.7)','rgba(255,220,150,0)');x.fillRect(lx-140,0,280,280);ell('#fff2c4',lx,100,14,8)}
  // plants & sofa
  x.fillStyle='#2f6b3a';for(let k=0;k<6;k++)ell('#2f6b3a',40+k*6,520-k*30,30,18,k*0.4);x.fillStyle='#6e4a2e';x.fillRect(20,560,60,80);
  x.fillStyle='#7a3b3b';rr(560,560,150,70,18);x.fill();
  x.fillStyle=lg(0,620,0,800,[[0,'#5a4232'],[1,'#7a5a46']]);x.fillRect(0,640,W,700);
  x=sv;const [out,o]=layer();o.setTransform(1,0,0,1,0,0);o.filter='blur(6px)';o.drawImage(cv,0,0);return out}
function floorLayer(){const [cv,g]=layer();const sv=x;x=g;const VX=360,VY=640;
  x.fillStyle='#d8c7aa';x.fillRect(-200,VY,W+400,H-VY+200);
  for(let row=0;row<18;row++){const t0=Math.pow(row/18,1.6),t1=Math.pow((row+1)/18,1.6);const y0=lerp(VY,H+60,t0),y1=lerp(VY,H+60,t1);const n=8;
    for(let i=-6;i<n+6;i++){const xa0=VX+(i/n-0.5)*lerp(500,2200,t0),xb0=VX+((i+1)/n-0.5)*lerp(500,2200,t0),xa1=VX+(i/n-0.5)*lerp(500,2200,t1),xb1=VX+((i+1)/n-0.5)*lerp(500,2200,t1);
      x.fillStyle=(i+row)%2?'#efe3cc':'#cdb895';x.beginPath();x.moveTo(xa0,y0);x.lineTo(xb0,y0);x.lineTo(xb1,y1);x.lineTo(xa1,y1);x.closePath();x.fill()}}
  x.fillStyle=lg(0,VY,0,VY+200,[[0,'rgba(255,240,210,.35)'],[1,'rgba(255,240,210,0)']]);x.fillRect(0,VY,W,200);
  x=sv;return cv}
function bgCity(){const [cv,g]=layer();const sv=x;x=g;x.fillStyle=lg(0,0,0,1280,[[0,'#7ec3ff'],[0.6,'#ffd9a8'],[1,'#e8a36e']]);x.fillRect(0,0,W,1280);
  const r=rng(8);for(let i=0;i<12;i++){const bw=60+r()*60,bh=200+r()*400,bx=i*62-40;x.fillStyle=['#9fb3cc','#b8c6d8','#8ea3bd'][i%3];x.fillRect(bx,900-bh,bw,bh);for(let a=0;a<Math.floor(bh/36);a++)for(let b2=0;b2<2;b2++){x.fillStyle=r()<0.4?'#ffe3a3':'rgba(255,255,255,.4)';x.fillRect(bx+10+b2*bw/2,900-bh+14+a*36,bw/4,16)}}
  x.fillStyle='#7d8a96';x.fillRect(0,900,W,400);x=sv;const [out,o]=layer();o.setTransform(1,0,0,1,0,0);o.filter='blur(5px)';o.drawImage(cv,0,0);return out}
let BG={};function initBG(){BG.day=bgLobby();BG.gday=floorLayer();BG.night=BG.day;BG.gnight=BG.gday;BG.city=bgCity();
  const [tb,t]=layer();const sv=x;x=t;x.fillStyle=lg(0,0,0,H,[[0,'#3a2618'],[1,'#20140c']]);x.fillRect(0,0,W,H);for(let i=0;i<14;i++){x.fillStyle=`rgba(255,200,130,${0.03+(i%3)*0.015})`;x.fillRect(0,i*92,W,46)}x=sv;BG.wood=tb}
// ---------- props
function liftDoor(X,Y,s,floor,open){x.save();x.translate(X,Y);x.scale(s,s);
  x.fillStyle='#6e5a46';rr(-118,-420,236,420,6);x.fill();
  x.fillStyle='#1b1b20';rr(-96,-332,192,74,8);x.fill();txt(String(floor),0,-295,48,'#ff8a3d');poly('#ff8a3d',[60,-305,74,-285,46,-285]);
  const o=open||0;x.fillStyle=lg(-100,0,100,0,[[0,'#c9ccd2'],[0.5,'#eef0f3'],[1,'#b7bbc2']]);x.fillRect(-100,-250,100-o*90,250);x.fillRect(o*90,-250,100-o*90,250);
  x.strokeStyle='#8a8e96';x.lineWidth=3;x.strokeRect(-100,-250,200,250);x.beginPath();x.moveTo(0,-250);x.lineTo(0,0);x.stroke();
  x.fillStyle='#2b2b30';rr(112,-160,24,50,6);x.fill();ell('#ffd36b',124,-142,6,6);x.restore()}
function mirrorPanel(X,Y,s,reflectFn,hang){x.save();x.translate(X,Y-(hang||0));x.scale(s,s);x.fillStyle='#b38a4a';rr(-70,-300,140,300,10);x.fill();
  x.save();x.beginPath();rr(-60,-290,120,280,6);x.clip();x.fillStyle=lg(-60,-290,60,0,[[0,'#cfe6f2'],[0.5,'#eef8fc'],[1,'#b9d6e6']]);x.fillRect(-60,-290,120,280);if(reflectFn)reflectFn();
  x.fillStyle='rgba(255,255,255,.35)';poly('rgba(255,255,255,.35)',[-60,-290,-20,-290,-60,-200]);x.restore();x.restore()}
const RES=[{torso:'#8a5a8a',hair:'bun',hairC:'#3a2a1a'},{torso:'#4f7a8a',hair:'spiky',hairC:'#c46a2c'},{torso:'#a2683f',hair:'side',hairC:'#2b2018'},{torso:'#5a6e3f',hair:'cap',capC:'#2d4a6e'},{torso:'#7a3b3b',hair:'side',hairC:'#7a3f1f',bow:true},{torso:'#3d5a80',hair:'bun',hairC:'#c46a2c'}];
function lobby(o={}){const fl=o.floor||[17,23];
  liftDoor(220,880,0.95,fl[0],o.open?o.open[0]:0);liftDoor(500,880,0.95,fl[1],o.open?o.open[1]:0);
  if(o.mirrors){[[360,880],[95,880],[640,880]].forEach(([mx,my],i)=>mirrorPanel(mx,my-30,0.62,()=>{if(o.refl)o.refl(i)},o.hang?o.hang[i]:0))}
  const crowd=[[150,1000,0.95],[300,1010,1.0],[430,1000,0.95],[580,1015,1.0],[220,1100,1.08],[380,1110,1.1],[530,1105,1.08]];
  (o.people||crowd).forEach(([X,Y,s_],i)=>{const r=RES[i%RES.length];toon(X+(o.fidget?Math.sin(T*4+i)*3:0),Y+bob(i),s_,Object.assign({},r,{mood:typeof o.mood==='function'?o.mood(i):(o.mood||blinkMood('calm',i)),look:o.look!==undefined?o.look:-1,shake:o.shake&&i%2===0,armR:o.arms?o.arms(i):undefined,armL:undefined}))})}
function paper(X,Y,rot,s,label){x.save();x.translate(X,Y);x.rotate(rot);x.scale(s,s);x.fillStyle='#fffaf0';rr(-50,-64,100,128,4);x.fill();x.strokeStyle=INK;x.lineWidth=2;x.stroke();txt(label,0,-40,14,'#8b1a1a');for(let i=0;i<5;i++){x.fillStyle='rgba(35,26,20,.35)';x.fillRect(-36,-20+i*16,72,5)}x.restore()}
function clock(X,Y,r,txt1,col){x.save();x.translate(X,Y);x.fillStyle='#fffaf0';x.beginPath();x.arc(0,0,r,0,Math.PI*2);x.fill();x.strokeStyle=INK;x.lineWidth=6;x.stroke();txt(txt1,0,4,r*0.62,col||INK);x.restore()}
function dust(){screenSpace();const rr2=rng(11);for(let i=0;i<34;i++){const px=(rr2()*W+T*6*(0.5+rr2()))%W,py=(rr2()*H*0.85+Math.sin(T*0.6+i)*10),rad=1+rr2()*2.5;x.fillStyle=`rgba(255,226,170,${0.15+rr2()*0.35})`;x.beginPath();x.arc(px,py,rad,0,Math.PI*2);x.fill()}}
function grade(){screenSpace();x.fillStyle='rgba(255,170,90,.06)';x.fillRect(0,0,W,H);x.fillStyle=rg(W/2,H*0.55,H*0.3,H*0.8,'rgba(0,0,0,0)','rgba(10,5,0,.55)');x.fillRect(0,0,W,H)}
function banner(l1,l2,col2){screenSpace();x.textAlign='center';x.textBaseline='middle';x.shadowColor='rgba(0,0,0,.92)';x.shadowBlur=16;x.shadowOffsetY=4;x.font='900 44px M';x.fillStyle='#fff';x.fillText(l1,360,150);x.font='900 60px M';x.fillStyle=col2||'#ffd36b';x.fillText(l2,360,215);x.shadowBlur=0;x.shadowOffsetY=0;x.textAlign='left'}
// ---------- scenes
const L={};TM.lines.forEach(l=>L[l.id]=l);const S=k=>L[k].s,E=k=>L[k].e;
const SC=[];function sc(id,f){SC.push({id,f})}
function tower(t,zoom){screenSpace();x.drawImage(BG.city,0,0,720,1280);const z=zoom||1;x.save();x.translate(360,1000);x.scale(z,z);
  x.fillStyle=lg(-150,0,150,0,[[0,'#5b6f8a'],[1,'#34445a']]);x.fillRect(-150,-900,300,900);x.fillStyle='#2a3648';x.fillRect(-160,-920,320,30);
  for(let f=0;f<30;f++)for(let k=0;k<5;k++){x.fillStyle=(f*5+k)%7===0?'#ffe3a3':'#9fc3e6';x.fillRect(-130+k*54,-880+f*28,40,18)}
  x.fillStyle='#e9dcc6';x.fillRect(-90,-90,180,90);x.fillStyle='#ffe3a3';x.fillRect(-70,-80,140,70);
  for(let i=0;i<6;i++)toon(-60+i*24,-8,0.22,RES[i]);x.restore()}
sc('hook',(t)=>{cam(360,lerp(700,740,eio(prog(t,0,E('hook')))),lerp(1.0,1.1,eio(prog(t,0,E('hook')))));lobby({fidget:true,mood:(i)=>i%3?'bored':blinkMood('calm',i)});dust();grade();banner('10 000 000 ₽','ИЛИ 5 000 ₽?')});
sc('tower',(t)=>{const lt=t-S('tower'),d=E('tower')-S('tower');if(lt<d*0.45){tower(t,lerp(1.0,1.15,eio(lt/(d*0.45))));screenSpace();x.font='900 40px M';x.textAlign='center';x.fillStyle='#fff';x.shadowColor='rgba(0,0,0,.9)';x.shadowBlur=12;x.fillText('30 ЭТАЖЕЙ · 2 ЛИФТА',360,180);x.shadowBlur=0;x.textAlign='left';return}
  cam(360,760,lerp(1.25,1.1,eio(prog(lt,d*0.45,d))));lobby({fidget:true,floor:[30-Math.floor(lt*3)%30,12+Math.floor(lt*2)%18],mood:(i)=>i%2?'bored':'calm'});dust();grade()});
sc('angry',(t)=>{const lt=t-S('angry'),d=E('angry')-S('angry');cam(360,800,1.35);lobby({shake:true,mood:()=>'bored',arms:(i)=>i%2?[44,-150+Math.sin(T*12+i)*10]:undefined});
  screenSpace();clock(600,230,62,'3:00','#c0392b');[[120,330,-0.2],[230,300,0.1],[150,420,0.15]].forEach(([px,py,r],i)=>{if(lt>d*(0.35+i*0.1))paper(px,py,r,1,'ЖАЛОБА')});
  if(lt>d*0.75){x.save();x.translate(560,520);x.fillStyle='#8a5d36';rr(-40,-30,80,60,8);x.fill();x.strokeStyle=INK;x.lineWidth=3;x.stroke();rr(-14,-44,28,16,6);x.stroke();txt('СЪЕЗЖАЮ',0,60,22,'#ff6b6b');x.restore()}dust();grade()});
sc('eng',(t)=>{const lt=t-S('eng'),d=E('eng')-S('eng');cam(360,780,1.3);lobby({people:[[150,1000,0.95],[580,1015,1.0]],mood:()=>'calm'});
  toon(290,1060+bob(1),1.15,{torso:'#2f4a6e',hair:'side',hairC:'#3a2a1a',mood:lt>d*0.5?'wow':'calm',bow:true});
  toon(440,1060+bob(2),1.15,{torso:'#d9a441',hair:'cap',capC:'#f1c40f',mood:'calm',armR:[50,-160],armL:[-50,-150]});
  if(lt>d*0.25){x.save();x.translate(440,830);x.rotate(0.05);x.fillStyle='#3a6fb5';rr(-90,-60,180,120,6);x.fill();x.strokeStyle='#cfe3ff';x.lineWidth=2;for(let i=0;i<5;i++){x.beginPath();x.moveTo(-70,-40+i*20);x.lineTo(70,-40+i*20);x.stroke()}x.restore()}
  screenSpace();if(lt>d*0.5){x.save();x.translate(360,250);const p=back(prog(lt,d*0.5,d*0.5+0.35));x.scale(p,p);x.fillStyle='#1f2422';rr(-230,-70,460,140,12);x.fill();txt('10 000 000 ₽',0,-14,56,'#ff6b6b');txt('+ ПОЛГОДА РЕМОНТА',0,40,22,'#fff');x.restore()}dust();grade()});
sc('bait',(t)=>{const lt=t-S('bait');cam(360,760,1.15);lobby({mood:()=>'bored'});grade();screenSpace();x.fillStyle='rgba(10,6,2,.45)';x.fillRect(0,0,W,H);
  const p=back(prog(lt,0,0.4));x.save();x.translate(360,520);x.scale(p,p);x.font='900 220px M';x.textAlign='center';x.textBaseline='middle';x.fillStyle='#ffd36b';x.shadowColor='rgba(0,0,0,.9)';x.shadowBlur=20;x.fillText('?',0,0);x.restore();
  x.textAlign='center';x.shadowColor='rgba(0,0,0,.9)';x.shadowBlur=14;x.font='900 40px M';x.fillStyle='#fff';x.fillText('ЧТО ОН СДЕЛАЛ?',360,200);x.font='900 32px M';x.fillStyle='#ffd36b';x.fillText('ПИШИ В КОММЕНТАРИЯХ 👇',360,255);x.shadowBlur=0;x.textAlign='left'});
sc('mirror',(t)=>{const lt=t-S('mirror'),d=E('mirror')-S('mirror');cam(360,760,1.15);const h=[0,0,0].map((_,i)=>Math.max(0,1-eio(prog(lt,i*0.25,i*0.25+0.6)))*400);lobby({mirrors:true,hang:h,people:[[150,1080,1.05],[580,1090,1.05]],mood:()=>'wow'});dust();grade()});
sc('wait',(t)=>{const lt=t-S('wait');screenSpace();x.drawImage(BG.wood,0,0,720,1280);const z=lerp(2.0,2.5,eo(lt/0.6));x.save();x.translate(360,700);x.scale(z,z);toon(0,180,1,{torso:'#4f7a8a',hair:'spiky',hairC:'#c46a2c',mood:'wow'});x.restore();x.fillStyle=rg(360,500,60,700,'rgba(0,0,0,0)','rgba(0,0,0,.6)');x.fillRect(0,0,W,H)});
sc('calm',(t)=>{const lt=t-S('calm'),d=E('calm')-S('calm');cam(360,780,1.2);lobby({mirrors:true,refl:(i)=>toon(0,-30,0.42,Object.assign({},RES[i],{mood:'happy'})),mood:()=>blinkMood('happy'),look:0});
  screenSpace();clock(600,230,62,'3:00',INK);if(lt>d*0.45){[[140,300,-0.2],[250,280,0.1]].forEach(([px,py,r])=>paper(px,py,r,1,'ЖАЛОБА'));x.strokeStyle='#2f7a52';x.lineWidth=10;x.beginPath();x.moveTo(80,230);x.lineTo(320,380);x.moveTo(320,230);x.lineTo(80,380);x.stroke()}dust();grade()});
sc('see',(t)=>{const lt=t-S('see'),d=E('see')-S('see');const shot=lt<d*0.45?0:lt<d*0.62?1:lt<d*0.8?2:3;
  if(shot===0){cam(360,780,1.25);lobby({mood:()=>'bored'});screenSpace();clock(360,300,80,'3:00','#c0392b');dust();grade();return}
  screenSpace();x.drawImage(BG.day,0,0,720,1280);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(0,0,W,H);
  mirrorPanel(360,1000,1.8,()=>{if(shot===1)toon(0,-20,0.85,{torso:'#8a5a8a',hair:'bun',hairC:'#3a2a1a',mood:'happy',armR:[30,-200+Math.sin(T*10)*8]});
    if(shot===2)toon(0,-20,0.85,{torso:'#7a3b3b',hair:'side',hairC:'#7a3f1f',bow:true,mood:'smug',armR:[10,-128],armL:[-10,-128]});
    if(shot===3){toon(-20,-20,0.85,{torso:'#4f7a8a',hair:'spiky',hairC:'#c46a2c',mood:'calm',look:1});toon(48,-20,0.7,{torso:'#a2683f',hair:'side',hairC:'#2b2018',mood:'calm'})}});
  if(shot===3){txt('👀',360,330,70,'#fff')}dust()});
sc('head',(t)=>{const lt=t-S('head'),d=E('head')-S('head');screenSpace();x.drawImage(BG.day,0,0,720,1280);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,0,W,H);
  clock(220,520,110,'3:00',INK);txt('НА ЧАСАХ',220,670,26,'#fff');const p=back(prog(lt,d*0.3,d*0.3+0.4));x.save();x.translate(500,520);x.scale(p,p);clock(0,0,110,'1:00','#2f7a52');x.restore();if(p>0.5)txt('В ГОЛОВЕ',500,670,26,'#ffd36b');
  toon(360,1180+bob(),1.2,{torso:'#4f7a8a',hair:'spiky',hairC:'#c46a2c',mood:'happy'});dust()});
sc('lesson',(t)=>{const lt=t-S('lesson'),d=E('lesson')-S('lesson');const shot=lt<d*0.42?0:lt<d*0.68?1:2;
  if(shot===0){cam(360,760,1.1);lobby({mirrors:true,refl:(i)=>toon(0,-30,0.42,Object.assign({},RES[i],{mood:'happy'})),mood:()=>blinkMood('happy'),look:0});dust();grade();return}
  screenSpace();x.drawImage(BG.wood,0,0,720,1280);
  if(shot===1){liftDoor(360,1000,1.4,7,1);for(let i=0;i<4;i++){const q=((T*0.8+i*0.25)%1);txt('♪',300+i*40+Math.sin(T*3+i)*10,600-q*200,40,`rgba(255,211,107,${1-q})`)}txt('МУЗЫКА В ЛИФТЕ',360,250,40,'#ffd36b');toon(360,1000,1.0,{torso:'#8a5a8a',hair:'bun',hairC:'#3a2a1a',mood:'happy'})}
  if(shot===2){txt('ПУТЬ К БАГАЖУ',360,230,40,'#ffd36b');x.strokeStyle='#ffd36b';x.lineWidth=8;x.setLineDash([18,14]);x.beginPath();x.moveTo(110,1050);x.bezierCurveTo(110,500,620,900,610,420);x.stroke();x.setLineDash([]);
    x.fillStyle='#3d5a80';rr(540,340,140,80,10);x.fill();txt('БАГАЖ',610,380,22,'#fff');const q=prog(lt,d*0.68,d);toon(lerp(110,600,q),lerp(1060,470,q),0.6,{torso:'#7a3b3b',hair:'side',hairC:'#7a3f1f',step:T*9,mood:'happy'})}
  x.fillStyle=rg(360,640,100,800,'rgba(0,0,0,0)','rgba(0,0,0,.45)');x.fillRect(0,0,W,H)});
sc('end',(t)=>{cam(360,lerp(740,700,eio(prog(t,S('end'),TM.total))),lerp(1.1,1.0,eio(prog(t,S('end'),TM.total))));lobby({mirrors:true,refl:(i)=>toon(0,-30,0.42,Object.assign({},RES[i],{mood:'happy'})),mood:()=>blinkMood('happy'),look:0});dust();grade();banner('СОХРАНИ','🔖','#fff')});
sc('tail',(t)=>{SC.find(z=>z.id==='end').f(t)});
