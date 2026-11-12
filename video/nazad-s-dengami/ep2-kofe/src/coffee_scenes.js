// ===== NAZAD S DENGAMI — EP2 (coffee) =====
function winterBG(){x.fillStyle=grad(0,H,'#cfe3f5','#eef5fb');x.fillRect(0,0,W,H);
  const r=rng(5);for(let i=0;i<8;i++){const w=70+r()*60,h=200+r()*240,X=i*92-20;rect(['#b9c7d8','#aebdd0','#c5d1df'][i%3],X,760-h,w,h);rect('#f4f8fb',X,760-h,w,10);for(let a=0;a<Math.floor(h/40);a++)for(let b2=0;b2<2;b2++)rect('rgba(255,236,170,.75)',X+12+b2*(w/2-6),760-h+20+a*40,w/4,14)}
  rect('#8d97a8',0,760,W,80);rect('#f2f5f8',0,840,W,H-840);for(let i=0;i<7;i++)rect('#fff',i*110+20,795,55,8);
  const rs=rng(Math.floor(T*6));for(let i=0;i<40;i++){const sx=(i*53+T*30*(1+i%3))%W,sy=(i*97+T*60*(1+i%2))%H;circle('rgba(255,255,255,.9)',sx,sy,1.5+(i%3))}}
function busStop(X,Y){rect('#5b6b80',X-10,Y-260,12,260);rect('#5b6b80',X+230,Y-260,12,260);x.fillStyle='#2f6fd6';rr(X-30,Y-290,300,40,8);x.fill();txt('ОСТАНОВКА',X+120,Y-270,18,'#fff');x.fillStyle='rgba(200,230,255,.45)';x.fillRect(X,Y-240,230,170)}
function thermos(X,Y,s,sign){x.save();x.translate(X,Y);x.scale(s,s);x.fillStyle='#c0392b';rr(-34,-150,68,150,16);x.fill();rect('#7f8c8d',-38,-170,76,24);rect('#2c3e50',-10,-186,20,18);rect('#95a5a6',30,-120,16,40);
  if(sign){x.fillStyle='#fffbe6';rr(-120,-120,240,90,10);x.fill();x.strokeStyle=C.ink;x.lineWidth=3;rr(-120,-120,240,90,10);x.stroke();txt('ГОРЯЧИЙ КОФЕ',0,-96,22,C.red);txt('С СОБОЙ · 50 ₽',0,-58,26,C.ink)}x.restore()}
function cup(X,Y,s,steam=true){x.save();x.translate(X,Y);x.scale(s,s);poly('#fff',[-22,-50,22,-50,16,0,-16,0]);rect('#7b4a2a',-24,-58,48,10);rect('#d9a441',-18,-34,36,12);
  if(steam){x.strokeStyle='rgba(255,255,255,.85)';x.lineWidth=4;for(let k=-1;k<=1;k++){x.beginPath();x.moveTo(k*10,-62);x.quadraticCurveTo(k*10+8*Math.sin(T*4+k),-80,k*10,-98);x.stroke()}}x.restore()}
const cold=(X,Y,s,o)=>chibi(X,Y,s,Object.assign({shirt:['#5b6b80','#8a5a44','#3b6fd8','#6d4c8a'][Math.floor(X)%4],hood:'#3a4556',pants:'#2b2b33',hair:'#2b211b',skin:'#e8c4a8'},o||{}));
function breath(X,Y){const q=(T*1.3+X*0.01)%1;circle(`rgba(255,255,255,${0.7*(1-q)})`,X+q*30,Y-q*20,8+q*14)}
const SC3={};
SC3.hook=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();
  x.font='900 30px M';x.fillStyle=C.ink;rr(80,140,560,60,30);x.fill();txt('ЗАСТРЯЛ В 2009 ГОДУ',360,171,30,'#fff');
  card(110,220,500,110,'#fff',22);txt('ДОМОЙ — ТОЛЬКО С',360,250,22,'rgba(29,36,51,.6)');txt('1 000 000 ₽',360,296,48,C.green);
  hero(300,935,1.35,{armF:-0.9,hold:'notes',face:{look:[1,-0.4],mouth:lt>d*0.75?'smile':'flat'}});breath(320,610);
  const p=pop(t,L.s+d*0.78);if(lt>d*0.78){x.save();x.translate(480,780);x.scale(p,p);thermos(0,0,1.2,false);x.restore();label2('ТЕРМОС',480,500,C.red,'#fff',26)}
  else{x.save();x.translate(480,700);txt('10 000 ₽',0,0,40,C.ink);x.restore()}};
SC3.vote=(t,L)=>{const lt=t-L.s,d=L.e-L.s;x.fillStyle=grad(0,H,'#eef6ff','#dce9fb');x.fillRect(0,0,W,H);
  if(lt<d*0.45){outlined('ВЫ ВЫБРАЛИ',360,170,58,'#fff');optionCards(t,L,[1,1,1],(i)=>{if(i!==0){x.fillStyle='rgba(238,246,255,.7)';rr(-300,-80,600,160,24);x.fill()}});stamp('ВЫБОР БОЛЬШИНСТВА',470,385,t,L.s+0.4,C.green,26,-0.06);return}
  // cafe price
  card(110,230,500,420,'#fff',26);rect('#7b4a2a',110,230,500,70);txt('КОФЕЙНЯ',360,265,32,'#fff');
  const rows=[['Аренда, ремонт','≈ 700 000 ₽'],['Кофемашина','≈ 300 000 ₽'],['Мебель, посуда','≈ 200 000 ₽']];rows.forEach(([a,b2],i)=>{txt(a,140,340+i*60,24,C.ink,'left',700);txt(b2,580,340+i*60,24,C.ink,'right')});
  txt('ИТОГО: > 1 000 000 ₽',360,560,34,C.red);
  if(lt>d*0.75){x.strokeStyle=C.red;x.lineWidth=10;x.beginPath();x.moveTo(130,250);x.lineTo(590,630);x.moveTo(590,250);x.lineTo(130,630);x.stroke();label2('БЕЗ КОФЕЙНИ',360,740,C.ink,C.yellow,34)}};
SC3.insight=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();busStop(80,900);
  [[140,935],[230,945],[330,935]].forEach(([X,Y],i)=>{cold(X,Y,1.0,{flip:i%2==1,face:{fear:0.6,mouth:'flat',look:[0,1]}});breath(X+20,Y-220)});
  x.save();x.translate(560,260);card(-110,-60,220,120,'#fff',20);txt('−15°C',0,-12,48,C.blue);txt('7:00 УТРА',0,32,20,C.ink);x.restore();
  if(lt>d*0.25){const p=pop(t,L.s+d*0.25);x.save();x.translate(520,520);x.scale(p,p);card(-150,-50,300,100,'#fff',20);txt('КОФЕ С СОБОЙ',0,-14,24,C.ink);txt('НИГДЕ НЕТ',0,22,28,C.red);x.restore()}};
SC3.buy=(t,L)=>{const lt=t-L.s,d=L.e-L.s;x.fillStyle=grad(0,H,'#fff6e6','#ffe7c2');x.fillRect(0,0,W,H);outlined('ЗАКУПКА',360,170,64,'#fff');
  card(90,240,540,470,'#fffdf6',12);const items=[['2 термоса','1 600 ₽',0.12],['3 кг кофе','1 400 ₽',0.3],['300 стаканов + крышки','1 500 ₽',0.48],['Сахар, палочки','500 ₽',0.62]];
  items.forEach(([a,b2,at],i)=>{if(lt<d*at)return;const p=pop(t,L.s+d*at);x.save();x.globalAlpha=Math.min(1,p);txt('✓ '+a,120,300+i*80,26,C.ink,'left',700);txt(b2,600,300+i*80,26,C.ink,'right');x.restore()});
  if(lt>d*0.8){rect(C.ink,120,620,480,3);txt('ИТОГО ≈ 5 000 ₽',360,665,36,C.red)}};
SC3.place=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();busStop(60,900);
  rect('#c9a27e',430,360,280,400);rect('#b38a66',430,360,280,30);txt('ИНСТИТУТ',570,420,22,'#fff');for(let i=0;i<3;i++)for(let j=0;j<3;j++)rect('rgba(255,236,170,.8)',455+i*85,460+j*90,50,55);
  const n=Math.floor(lerp(0,9,eo(prog(lt,0.3,d*0.7))));for(let i=0;i<n;i++){const X=60+(i*67)%380,Y=920+(i%3)*14;cold(X,Y,0.7,{face:{fear:0.6,mouth:'flat'}});breath(X+14,Y-150)}
  if(lt>d*0.45){const p=pop(t,L.s+d*0.45);x.save();x.translate(360,230);x.scale(p,p);card(-220,-50,440,100,'#fff',24);txt('7:00 · 300 ЧЕЛОВЕК',0,2,34,C.ink);x.restore()}};
SC3.price=(t,L)=>{const lt=t-L.s,d=L.e-L.s;x.fillStyle=grad(0,H,'#eafff1','#d3f5e0');x.fillRect(0,0,W,H);cup(360,520,2.2);
  const p1=pop(t,L.s+0.1);x.save();x.translate(160,720);x.scale(p1,p1);card(-120,-60,240,120,'#fff',22);txt('СЕБЕСТОИМОСТЬ',0,-26,16,'rgba(29,36,51,.55)');txt('10 ₽',0,16,44,C.ink);x.restore();
  if(lt>d*0.5){const p2=pop(t,L.s+d*0.5);x.save();x.translate(560,720);x.scale(p2,p2);card(-120,-60,240,120,'#fff',22);txt('ЦЕНА',0,-26,16,'rgba(29,36,51,.55)');txt('50 ₽',0,16,44,C.green);x.restore();label2('+40 ₽ С КАЖДОГО',360,860,C.ink,'#5ef08f',30)}};
SC3.day1=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();busStop(40,900);
  hero(470,935,1.2,{armF:-0.8,face:{look:[-1,0],mouth:'flat',fear:0.3}});thermos(560,935,0.9,false);
  [[120,0],[220,1],[300,0]].forEach(([X,f],i)=>{const off=((lt*90+i*120)%500);cold(X-200+off,935,0.95,{flip:false,face:{mouth:'flat',look:[1,0]}})});
  for(let i=0;i<3;i++)txt('?',150+i*90,560-10*Math.sin(t*3+i),56,C.red);
  x.save();x.translate(360,240);card(-180,-50,360,100,'#fff',24);txt('СТАКАНОВ: 12',0,2,38,C.ink);x.restore()};
SC3.fix=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();busStop(40,900);
  const signP=pop(t,L.s+d*0.15);hero(470,935,1.2,{armF:lt>d*0.6?-1.4:-0.8,face:{look:[-1,0],mouth:'smile'}});x.save();x.translate(580,935);x.scale(1,1);thermos(0,0,1.0,signP>0.5);x.restore();
  if(lt>d*0.6){cup(340,700,0.9);cold(230,935,1.0,{face:{mouth:'smile',look:[1,-0.5]},armF:-1.0})}
  if(lt>d*0.75){for(let i=0;i<4;i++)cold(120-i*70,935,0.85,{face:{mouth:'flat',look:[1,0]}})}
  if(lt>d*0.6)label2('ПЕРВЫЙ — БЕСПЛАТНО',360,230,C.green,'#fff',30)};
SC3.rule=(t,L)=>{x.fillStyle=grad(0,H,'#22304d','#141c2e');x.fillRect(0,0,W,H);const p=pop(t,L.s+0.1,0.4);x.save();x.translate(360,520);x.scale(p,p);
  card(-300,-200,600,400,'#fff',26);x.fillStyle=C.yellow;rr(-300,-200,600,80,26);x.fill();rect(C.yellow,-300,-150,600,30);txt('ПРАВИЛО №2',0,-158,34,C.ink);
  txt('ТОВАР ДОЛЖНЫ',0,-50,44,C.ink);txt('ПОНЯТЬ',0,4,44,C.ink);txt('ЗА 1 СЕКУНДУ',0,90,52,C.green);x.restore()};
SC3.growth=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();busStop(30,900);
  hero(520,935,1.2,{armF:-1.4,face:{mouth:'smile',look:[-1,0]}});thermos(620,935,1.0,true);
  for(let i=0;i<6;i++)cold(420-i*75,935+(i%2)*6,0.9,{face:{mouth:'smile',look:[1,0]}});
  const n=Math.floor(lerp(12,120,eo(prog(lt,0.1,d*0.6))));x.save();x.translate(360,240);card(-200,-50,400,100,'#fff',24);txt('СТАКАНОВ: '+n,0,2,38,C.green);x.restore();outlined('ДЕНЬ 15',600,340,30,'#fff')};
const owner=(X,Y,s,o)=>chibi(X,Y,s,Object.assign({shirt:'#2b2b33',hood:'#1d1d24',pants:'#1d1d24',hair:'#111',skin:'#d9a383'},o||{}));
SC3.twist=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();
  rect('#e9e2d0',470,520,240,320);rect('#2f6fd6',470,520,240,50);txt('КИОСК',590,546,22,'#fff');rect('#cfe8ff',490,590,200,110);
  hero(170,935,1.2,{armF:-0.8,face:{look:[1,0],fear:1,mouth:'o'}});thermos(80,935,0.9,true);
  owner(420,935,1.45,{flip:true,armF:-1.2,face:{look:[-1,0],mouth:'flat',fear:0}});
  const p=pop(t,L.s+d*0.25);if(p>0){x.save();x.translate(360,270);x.scale(p,p);card(-300,-110,600,220,'#fff',26);txt('«ВСТАВАЙ КО МНЕ —',0,-55,32,C.ink);txt('ПОЛОВИНА ВЫРУЧКИ МОЯ',0,-10,30,C.red);txt('ИЛИ ЗАВТРА — ПОЛИЦИЯ»',0,40,30,C.ink);x.restore()}
  stamp('−50%?',600,460,t,L.s+d*0.6,C.red,50,0.1)};
SC3.cta=(t,L)=>{x.fillStyle=grad(0,H,'#eef6ff','#dce9fb');x.fillRect(0,0,W,H);outlined('ТВОЙ ХОД',360,170,70,'#fff');
  const opts=[['1','ОТДАТЬ ПОЛОВИНУ',C.hood],['2','НОВОЕ МЕСТО',C.blue],['3','ОФОРМИТЬ РАЗРЕШЕНИЕ',C.green]];
  opts.forEach(([n,lab,col],i)=>{const p=pop(t,L.s+0.15+i*0.25);if(p<=0)return;x.save();x.translate(360,320+i*150);x.scale(p,p);card(-280,-56,560,112,'#fff',24);circle(col,-220,0,40);txt(n,-220,4,48,'#fff');fitTxt(lab,40,2,32,C.ink,380);x.restore()});
  label2('ПИШИ В КОММЕНТАРИЯХ',360,800,C.ink,'#fff',30)};
SC3.end=(t)=>{x.fillStyle=grad(0,H,'#22304d','#141c2e');x.fillRect(0,0,W,H);const p=pop(t,TM.endCard+0.1);x.save();x.translate(360,560);x.scale(p,p);
  outlined('СЕРИЯ 3',0,-60,96,'#fff');outlined('ПО ВЫБОРУ БОЛЬШИНСТВА',0,40,40,C.yellow);txt('ПОДПИШИСЬ, ЧТОБЫ НЕ ПРОПУСТИТЬ',0,130,24,'rgba(255,255,255,.75)');x.restore()};
Object.assign(SC,SC3);
