// ===== NAZAD S DENGAMI — EP3 (new place) =====
const cop=(X,Y,s,o)=>{chibi(X,Y,s,Object.assign({shirt:'#2c3e66',hood:'#22305a',pants:'#1f2a44',hair:'#2b211b',skin:'#e9b896'},o||{}));
  x.save();x.translate(X,Y);x.scale(s*((o&&o.flip)?-1:1),s);x.fillStyle='#1f2a44';x.beginPath();x.ellipse(0,-230,38,16,0,Math.PI,0);x.fill();rr(-40,-234,80,12,5);x.fill();circle('#f1c40f',0,-238,6);rect('#f1c40f',-6,-130,12,12);x.restore()};
const guardM=(X,Y,s,o)=>{chibi(X,Y,s,Object.assign({shirt:'#1d1d24',hood:'#14141a',pants:'#1d1d24',hair:'#5a3a22',skin:'#e0a888'},o||{}));
  x.save();x.translate(X,Y);x.scale(s*((o&&o.flip)?-1:1),s);x.fillStyle='#f1c40f';rr(-22,-140,44,14,4);x.fill();x.fillStyle='#1d1d24';x.font='900 9px M';x.textAlign='center';x.textBaseline='middle';x.fillText('ОХРАНА',0,-133);x.restore()};
const granny=(X,Y,s,o)=>{chibi(X,Y,s,Object.assign({shirt:'#7a4a6a',hood:'#5a3550',pants:'#4a3a3a',hair:'#bbb',skin:'#efc8a8'},o||{}));
  x.save();x.translate(X,Y);x.scale(s*((o&&o.flip)?-1:1),s);x.fillStyle='#c0392b';x.beginPath();x.arc(0,-205,40,Math.PI*1.02,Math.PI*1.98);x.fill();poly('#c0392b',[-30,-200,-46,-170,-22,-188]);x.restore()};
function kiosk(X,Y,s){x.save();x.translate(X,Y);x.scale(s,s);rect('#e9e2d0',-130,-320,260,320);rect('#2f6fd6',-130,-320,260,52);txt('КИОСК',0,-294,24,'#fff');rect('#cfe8ff',-110,-250,220,120);x.restore()}
function office(X,Y,s,doorOpen){x.save();x.translate(X,Y);x.scale(s,s);
  rect('#c9b79a',-260,-560,520,560);rect('#b8a586',-260,-560,520,26);for(let i=0;i<4;i++)for(let j=0;j<2;j++)rect('rgba(255,236,170,.85)',-220+i*120,-500+j*130,70,90);
  x.fillStyle='#1f3a6e';rr(-200,-250,400,60,8);x.fill();txt('ПАСПОРТНЫЙ СТОЛ',0,-220,30,'#fff');
  rect('#5a3b22',-70,-180,140,180);if(doorOpen){rect('#ffe7b0',-70,-180,140*doorOpen,180)}rect('#3a2618',-74,-184,8,184);x.restore()}
function tvSet(X,Y,s,fn){x.save();x.translate(X,Y);x.scale(s,s);x.fillStyle='#2b2b30';rr(-240,-180,480,360,30);x.fill();x.fillStyle='#0f1a2e';rr(-210,-150,420,280,16);x.fill();x.save();x.beginPath();rr(-210,-150,420,280,16);x.clip();fn();x.restore();rect('#2b2b30',-30,180,60,40);rect('#3a3a40',-100,215,200,16);x.restore()}
function flake(){const r=rng(Math.floor(T*0));}
const SC4={};
SC4.hook=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();kiosk(540,935,1.0);
  owner(470,935,1.35,{flip:true,armF:-1.5,face:{look:[-1,0],mouth:'flat'}});
  const q=prog(lt,0.2,d*0.45);hero(lerp(300,150,eo(q)),935,1.3,{armF:-0.8,face:{look:[1,0],mouth:lt>d*0.5?'smile':'flat',fear:lt<d*0.4?0.6:0}});thermos(lerp(380,230,eo(q)),935,0.9,true);
  x.font='900 30px M';x.fillStyle=C.ink;rr(80,140,560,60,30);x.fill();txt('ВЫГНАЛИ С ЛУЧШЕГО МЕСТА',360,171,28,'#fff');
  if(lt>d*0.35){const p=pop(t,L.s+d*0.35);x.save();x.translate(360,270);x.scale(p,p);card(-170,-46,340,92,'#fff',24);txt('×2 ЗА НЕДЕЛЮ',0,2,40,C.green);x.restore()}
  if(lt>d*0.72)stamp('А ПОТОМ — ВСЁ?',360,400,t,L.s+d*0.72,C.red,40,-0.06)};
SC4.ctx=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();hero(360,935,1.4,{armF:-1.2,face:{look:[0,-0.5],mouth:'flat'}});thermos(480,935,1.0,true);breath(380,600);
  [['2009 ГОД',C.ink,'#fff',0.05],['НУЖЕН 1 000 000 ₽',C.green,'#fff',0.3],['ЕСТЬ 45 000 ₽ + ТЕРМОС',C.yellow,C.ink,0.6]].forEach(([s_,bg,fg,at],i)=>{const p=pop(t,L.s+d*at);if(p<=0)return;x.save();x.translate(360,180+i*90);x.scale(p,p);label2(s_,0,0,bg,fg,30);x.restore()})};
SC4.police=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();busStop(30,900);
  const arrive=eo(prog(lt,d*0.25,d*0.5));owner(560,935,1.2,{flip:true,armF:-1.4,face:{look:[-1,0],mouth:'smile'}});
  cop(lerp(820,440,arrive),935,1.3,{flip:true,armF:lt>d*0.6?-1.0:-0.2,face:{look:[-1,0],mouth:'flat',angry:1}});
  const grab=prog(lt,d*0.62,d*0.8);hero(200,935,1.25,{face:{fear:1,mouth:'o',look:[1,0]}});thermos(lerp(300,410,eo(grab)),935-Math.sin(grab*Math.PI)*60,0.9,true);
  if(lt>d*0.72)stamp('КОНФИСКОВАНО',360,300,t,L.s+d*0.72,C.red,46,-0.06);if(lt>d*0.82){const p=pop(t,L.s+d*0.82);x.save();x.translate(360,420);x.scale(p,p);label2('−5 000 ₽',0,0,C.red,'#fff',36);x.restore()}
  if(lt<d*0.3){label2('УТРО',360,230,C.ink,'#fff',28)}};
SC4.seryi1=(t,L)=>{const lt=t-L.s;winterBG();busStop(40,900);busStop(480,900);hero(200,935,1.25,{face:{look:[1,0],mouth:'flat'}});seryi(470,935,1.35,{flip:true,armF:-1.6,face:{look:[-1,0],mouth:'o'}});speaker(470,560,'СЕРЫЙ');
  const p=pop(t,L.s+0.1);x.save();x.translate(360,250);x.scale(p,p);card(-260,-70,520,140,'#fff',26);txt('«ОСТАНОВОК — СОТНЯ!',0,-22,32,C.ink);txt('ВСТАНЕМ У ДРУГОЙ!»',0,24,30,C.blue);x.restore()};
SC4.idea=(t,L)=>{const lt=t-L.s,d=L.e-L.s;x.fillStyle=grad(0,H,'#eef6ff','#dce9fb');x.fillRect(0,0,W,H);
  const p1=pop(t,L.s+0.1);x.save();x.translate(190,520);x.scale(p1,p1);card(-150,-190,300,380,'#fff',24);busStop(-110,60);txt('ОСТАНОВКА',0,-150,26,C.ink);txt('2 МИН',0,120,56,C.red);x.restore();
  if(lt>d*0.45){const p2=pop(t,L.s+d*0.45);x.save();x.translate(530,520);x.scale(p2,p2);card(-150,-190,300,380,'#fff',24);txt('???',0,-150,30,C.ink);txt('2 ЧАСА',0,120,56,C.green);txt('?',0,-20,120,C.yellow);x.restore()}
  if(lt<d*0.3)stamp('НЕТ',190,300,t,L.s+0.05,C.red,50,-0.1)};
SC4.queue=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();office(360,935,1.0,0);
  const n=Math.floor(lerp(3,12,eo(prog(lt,0.2,d*0.6))));for(let i=0;i<n;i++){const X=430-i*58,Y=960+(i%2)*10;cold(X,Y,0.78,{shirt:['#3b6fd8','#8a5a44','#6d4c8a','#5b6b80'][i%4],face:{mouth:'flat',fear:0.5,look:[1,0]}});breath(X+12,Y-140)}
  x.save();x.translate(600,230);card(-90,-50,180,100,'#fff',20);txt('6:00',0,-10,40,C.ink);txt('УТРА',0,26,18,C.ink);x.restore();
  if(lt>d*0.45){const p=pop(t,L.s+d*0.45);x.save();x.translate(220,250);x.scale(p,p);label2('СТОЯТ ПО 3 ЧАСА',0,0,C.red,'#fff',28);x.restore()}};
SC4.guard=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();office(360,935,1.0,0);
  guardM(360,935,1.35,{armF:lt<d*0.35?-1.5:-0.9,face:{look:[-1,0],mouth:lt>d*0.6?'smile':'flat',angry:lt<d*0.35?1:0}});hero(170,935,1.25,{armF:lt>d*0.35?-1.1:-0.1,face:{look:[1,0],mouth:'smile'}});
  if(lt<d*0.35){const p=pop(t,L.s+0.1);x.save();x.translate(400,250);x.scale(p,p);card(-220,-50,440,100,'#fff',24);txt('«ТОРГОВАТЬ НЕЛЬЗЯ!»',0,2,32,C.red);x.restore()}
  else if(lt<d*0.7){cup(260,700,0.8);const p=pop(t,L.s+d*0.35);x.save();x.translate(360,250);x.scale(p,p);card(-240,-50,480,100,'#fff',24);txt('КОФЕ БЕСПЛАТНО — КАЖДОЕ УТРО',0,2,24,C.ink);x.restore()}
  else{const q=eo(prog(lt,d*0.7,d*0.9));x.save();x.translate(lerp(360,240,q),860);x.fillStyle='#7a5232';rr(-34,-10,68,14,4);x.fill();rect('#7a5232',-30,4,8,60);rect('#7a5232',22,4,8,60);rr(-34,-80,10,80,4);x.fill();x.restore();label2('СТУЛ ДЛЯ ТЕБЯ',360,250,C.green,'#fff',28)}};
function corridor(){x.fillStyle=grad(0,H,'#e8dcc4','#cdb995');x.fillRect(0,0,W,H);rect('#7a9a8a',0,0,W,560);rect('#5f7d70',0,540,W,20);for(let i=0;i<6;i++){rect('#5a3b22',i*130-20,260,90,280);txt(String(12+i),i*130+25,240,22,C.ink)}
  x.fillStyle='#c9b79a';x.fillRect(0,880,W,400)}
SC4.growth=(t,L)=>{const lt=t-L.s,d=L.e-L.s;corridor();
  for(let i=0;i<6;i++)cold(120+i*95,935+(i%2)*10,0.85,{shirt:['#3b6fd8','#8a5a44','#6d4c8a','#5b6b80'][i%4],face:{mouth:'smile',look:[0,0]},armF:i%2?-1.1:-0.1});for(let i=0;i<3;i++)cup(170+i*190,700,0.5);
  hero(620,960,1.2,{armF:-1.3,face:{look:[-1,0],mouth:'smile'}});
  const n=Math.floor(lerp(20,200,eo(prog(lt,0.1,d*0.5))));x.save();x.translate(360,180);card(-210,-46,420,92,'#fff',24);txt('СТАКАНОВ: '+n,0,2,36,C.green);x.restore();
  if(lt>d*0.4){const p=pop(t,L.s+d*0.4);x.save();x.translate(180,300);x.scale(p,p);label2('70 ₽',0,0,C.ink,'#5ef08f',36);x.restore()}};
SC4.rival=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();office(360,935,1.0,0);
  owner(520,935,1.35,{flip:true,armF:-1.2,face:{look:[-1,0],mouth:'smile'}});thermos(620,935,1.0,false);
  x.save();x.translate(600,640);x.rotate(0.06);card(-90,-50,180,100,'#fffbe6',8);txt('КОФЕ',0,-16,26,C.ink);txt('40 ₽',0,22,36,C.red);x.restore();
  hero(200,935,1.25,{face:{look:[1,0],fear:1,mouth:'o'}});if(lt>d*0.55)stamp('КОНКУРЕНТ',360,280,t,L.s+d*0.55,C.red,48,-0.06)};
SC4.payoff=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();const open=prog(lt,0.1,d*0.3)*(1-prog(lt,d*0.65,d*0.8));office(360,935,1.0,open);
  guardM(330,935,1.2,{face:{look:[-1,0],mouth:'smile'},armF:-1.4});
  const inq=eo(prog(lt,d*0.3,d*0.6));hero(lerp(150,360,inq),935,1.15,{face:{look:[1,0],mouth:'smile'}});
  owner(560,935,1.3,{flip:true,face:{look:[-1,0],fear:1,mouth:'o'}});thermos(650,935,0.9,false);
  if(lt>d*0.75){for(let i=0;i<20;i++){const r=rng(i);circle('rgba(255,255,255,.9)',480+r()*220,500+((T*80+r()*400)%420),2+r()*3)}label2('НА МОРОЗЕ',560,560,C.blue,'#fff',26)}};
SC4.rule=(t,L)=>{x.fillStyle=grad(0,H,'#22304d','#141c2e');x.fillRect(0,0,W,H);const p=pop(t,L.s+0.1,0.4);x.save();x.translate(360,520);x.scale(p,p);
  card(-300,-200,600,400,'#fff',26);x.fillStyle=C.yellow;rr(-300,-200,600,80,26);x.fill();rect(C.yellow,-300,-150,600,30);txt('ПРАВИЛО №3',0,-158,34,C.ink);
  txt('ДРУЖИ С ТЕМ,',0,-40,46,C.ink);txt('У КОГО',0,20,46,C.ink);txt('КЛЮЧ ОТ ДВЕРИ',0,90,46,C.green);x.restore()};
SC4.seryi2=(t,L)=>{corridor();granny(220,935,1.2,{face:{look:[1,0],mouth:'smile'}});seryi(470,935,1.35,{flip:true,armF:-1.2,face:{look:[-1,0],mouth:'o'}});speaker(470,560,'СЕРЫЙ');
  const p=pop(t,L.s+0.1);x.save();x.translate(360,250);x.scale(p,p);card(-260,-70,520,140,'#fff',26);txt('«МАКС, ТУТ БАБУШКА',0,-22,30,C.ink);txt('ПРО ПИРОЖКИ СПРАШИВАЕТ»',0,24,26,C.ink);x.restore()};
SC4.pie=(t,L)=>{const lt=t-L.s;corridor();hero(360,960,1.5,{face:{look:[0,0],mouth:'smile'},armF:-0.8});const p=pop(t,L.s+0.6);x.save();x.translate(360,260);x.scale(p,p);outlined('ПОКА.',0,0,90,C.yellow);x.restore()};
SC4.tv=(t,L)=>{const lt=t-L.s,d=L.e-L.s;x.fillStyle=grad(0,H,'#2a2230','#151018');x.fillRect(0,0,W,H);x.fillStyle=rg(360,520,40,500,'rgba(120,170,255,.25)','rgba(0,0,0,0)');x.fillRect(0,0,W,H);
  tvSet(360,520,1.0,()=>{x.fillStyle=grad(-150,130,'#24406e','#0f1a2e');x.fillRect(-210,-150,420,280);txt('НОВОСТИ',-120,-120,20,'#fff');rect(C.red,-210,70,420,40);
    const msg='С ДЕКАБРЯ — ПОРТАЛ «ГОСУСЛУГИ» · ';const off=(T*120)%600;x.save();x.beginPath();x.rect(-210,70,420,40);x.clip();txt(msg+msg,200-off,90,22,'#fff','left');x.restore();
    x.fillStyle='#fff';rr(-80,-80,160,120,10);x.fill();txt('gosuslugi',0,-20,22,'#2f6fd6');txt('.ru',0,10,20,'#2f6fd6')});
  hero(170,1180,1.3,{face:{look:[1,-1],mouth:'o',fear:0.8}});seryi(560,1180,1.3,{flip:true,face:{look:[-1,-1],mouth:'flat'}})};
SC4.twist=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();office(360,935,1.0,0);
  for(let i=0;i<10;i++){const X=430-i*58;const fade=1-prog(lt,d*0.3+i*0.05,d*0.6+i*0.05);if(fade<=0)continue;x.save();x.globalAlpha=fade;cold(X,960+(i%2)*10,0.78,{shirt:['#3b6fd8','#8a5a44','#6d4c8a','#5b6b80'][i%4],face:{mouth:'flat'}});x.restore()}
  if(lt>d*0.25){const p=pop(t,L.s+d*0.25);x.save();x.translate(360,240);x.scale(p,p);label2('ЧЕРЕЗ НЕСКОЛЬКО ЛЕТ',0,0,C.ink,'#fff',28);x.restore()}
  if(lt>d*0.65){stamp('ОЧЕРЕДЕЙ НЕТ',360,360,t,L.s+d*0.65,C.red,46,-0.06)}};
SC4.end=(t)=>{x.fillStyle=grad(0,H,'#22304d','#141c2e');x.fillRect(0,0,W,H);const p=pop(t,TM.endCard+0.1);x.save();x.translate(360,520);x.scale(p,p);
  outlined('СЕРИЯ 4',0,-60,96,'#fff');txt('ПИРОЖКИ · ВТОРАЯ ОЧЕРЕДЬ · ИЛИ ВСЁ НА БУДУЩЕЕ?',0,40,22,C.yellow);txt('ПОДПИШИСЬ, ЧТОБЫ НЕ ПРОПУСТИТЬ',0,110,22,'rgba(255,255,255,.75)');x.restore()};
Object.assign(SC,SC4);
SC.choice=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();office(360,935,1.0,0);hero(200,935,1.3,{armF:-1.0,face:{look:[1,-0.5],mouth:'flat'}});thermos(310,935,1.0,true);seryi(520,935,1.3,{flip:true,face:{look:[-1,0],mouth:'flat'}});
  outlined('ЧТО ДЕЛАЕШЬ?',360,175,54,'#fff');
  const opts=[['1','ПИРОЖКИ К КОФЕ',C.hood],['2','ВТОРАЯ ОЧЕРЕДЬ',C.blue],['3','СТАВКА НА БУДУЩЕЕ',C.green]];
  opts.forEach(([n,lab,col],i)=>{const p=pop(t,L.s+0.15+i*d*0.22);if(p<=0)return;x.save();x.translate(360,270+i*96);x.scale(p,p);card(-250,-40,500,80,'#fff',22);circle(col,-200,0,30);txt(n,-200,3,36,'#fff');fitTxt(lab,40,2,28,C.ink,360);x.restore()});
  if(lt>d*0.8)label2('ПИШИ ЦИФРУ 👇',360,580,C.ink,C.yellow,28)};
SC.end=(t)=>{x.fillStyle=grad(0,H,'#22304d','#141c2e');x.fillRect(0,0,W,H);const p=pop(t,TM.endCard+0.1);x.save();x.translate(360,540);x.scale(p,p);
  outlined('СЕРИЯ 4',0,-50,96,'#fff');outlined('ПО ВЫБОРУ БОЛЬШИНСТВА',0,40,36,C.yellow);txt('ПОДПИШИСЬ, ЧТОБЫ НЕ ПРОПУСТИТЬ',0,120,22,'rgba(255,255,255,.75)');x.restore()};
