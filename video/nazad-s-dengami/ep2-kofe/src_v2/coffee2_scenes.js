// ===== COFFEE v2 overrides =====
function seryi(X,Y,s,o={}){chibi(X,Y,s,Object.assign({shirt:'#2a3d8f',hood:'#22336f',pants:'#2a3d8f',hair:'#3a2a1a',skin:'#e9b896'},o));
  x.save();x.translate(X,Y);x.scale(s*(o.flip?-1:1),s);
  // tracksuit stripes on arms/legs
  x.strokeStyle='#fff';x.lineWidth=3;x.beginPath();x.moveTo(-40,-140);x.lineTo(-44,-80);x.moveTo(40,-140);x.lineTo(44,-80);x.moveTo(-24,-60);x.lineTo(-24,-8);x.moveTo(24,-60);x.lineTo(24,-8);x.stroke();
  // cap
  x.fillStyle='#1d1d24';x.beginPath();x.ellipse(0,-226,36,22,0,Math.PI,0);x.fill();rr(0,-232,52,10,5);x.fill();
  x.restore()}
function speaker(X,Y,name,col='#22336f'){label2(name,X,Y,col,'#fff',22)}
SC.hook=(t,L)=>{const lt=t-L.s;winterBG();busStop(30,900);
  ['#3b6fd8','#8a5a44','#6d4c8a'].forEach((col,i)=>cold(260-i*78,935,0.9,{shirt:col,face:{mouth:'smile',look:[1,0]}}));
  hero(420,935,1.3,{armF:-1.3,face:{mouth:'smile',look:[-1,0]}});thermos(545,935,1.1,true);
  x.save();x.translate(360,215);x.rotate(-0.03);card(-270,-80,540,160,'#151b2b',26);txt('ТЕРМОС КОФЕ =',0,-34,30,'#fff');txt('+45 000 ₽',0,22,62,'#5ef08f');x.restore();
  x.font='900 22px M';const tg='ЗА 2 НЕДЕЛИ · 2009';const w=x.measureText(tg).width+30;x.fillStyle=C.red;rr(360-w/2,316,w,40,20);x.fill();txt(tg,360,337,22,'#fff');};
SC.loop=(t,L)=>{const lt=t-L.s,d=L.e-L.s;
  if(lt<d*0.5){winterBG();x.font='900 30px M';x.fillStyle=C.ink;rr(80,140,560,60,30);x.fill();txt('ЗАСТРЯЛ В 2009 ГОДУ',360,171,30,'#fff');
    card(110,220,500,110,'#fff',22);txt('ДОМОЙ — ТОЛЬКО С',360,250,22,'rgba(29,36,51,.6)');txt('1 000 000 ₽',360,296,48,C.green);
    hero(360,935,1.35,{armF:-0.9,hold:'notes',face:{look:[0,-0.4],mouth:'flat'}});breath(380,610);return}
  // tease of the twist: silhouette
  x.fillStyle=grad(0,H,'#2a1a22','#120a10');x.fillRect(0,0,W,H);
  x.save();x.globalAlpha=0.95;owner(360,960,1.9,{shirt:'#0b0b0e',hood:'#0b0b0e',pants:'#0b0b0e',hair:'#0b0b0e',skin:'#0b0b0e',face:{mouth:'flat'}});x.restore();
  outlined('ОН ЧУТЬ НЕ ЗАБРАЛ ВСЁ',360,250,44,'#ff4d4f');outlined('СМОТРИ ДО КОНЦА',360,320,30,'#fff')};
SC.seryi1=(t,L)=>{const lt=t-L.s;winterBG();hero(220,935,1.3,{face:{look:[1,0],mouth:'flat'}});seryi(500,935,1.35,{flip:true,armF:-1.2,face:{look:[-1,0],mouth:'smile'}});speaker(500,560,'СЕРЫЙ · 2009');
  const p=pop(t,L.s+0.15);x.save();x.translate(400,260);x.scale(p,p);card(-260,-80,520,160,'#fff',26);poly('#fff',[60,78,100,78,110,120]);txt('«МАКС, ТЫ ГОНИШЬ?',0,-26,32,C.ink);txt('ЗИМОЙ — КОФЕ НА УЛИЦЕ?»',0,22,28,C.ink);x.restore();
  label2('МАКС',220,560,C.teal,'#fff',22)};
SC.buy=(t,L)=>{const lt=t-L.s,d=L.e-L.s;x.fillStyle=grad(0,H,'#fff6e6','#ffe7c2');x.fillRect(0,0,W,H);outlined('ЗАКУПКА',360,170,64,'#fff');
  const items=[['2 термоса',0.05],['кофе',0.2],['300 стаканов',0.35]];items.forEach(([a,at],i)=>{const p=pop(t,L.s+d*at);if(p<=0)return;x.save();x.translate(360,300+i*110);x.scale(p,p);card(-220,-42,440,84,'#fff',20);txt('✓ '+a,0,2,34,C.ink);x.restore()});
  if(lt>d*0.5){const p=pop(t,L.s+d*0.5);x.save();x.translate(360,680);x.scale(p,p);card(-250,-60,500,120,C.ink,30);txt('−5 000 ₽',0,-12,52,'#ff4d4f');txt('ПОЛОВИНА КАПИТАЛА',0,38,22,'#fff');x.restore()}};
SC.day1=(t,L)=>{SC3.day1(t,L);const lt=t-L.s,d=L.e-L.s;stamp('ПРОВАЛ',360,380,t,L.s+d*0.7,C.red,64,-0.08)};
SC.seryi2=(t,L)=>{winterBG();busStop(40,900);hero(470,935,1.2,{face:{look:[-1,0],fear:0.8,mouth:'flat'}});thermos(570,935,0.9,false);seryi(230,935,1.35,{armF:-1.6,face:{look:[1,0],mouth:'smile'}});speaker(230,560,'СЕРЫЙ');
  const p=pop(t,L.s+0.1);x.save();x.translate(330,250);x.scale(p,p);card(-260,-70,520,140,'#fff',26);txt('«Я ЖЕ ГОВОРИЛ!',0,-22,34,C.ink);txt('НИКТО НЕ ПОНИМАЕТ»',0,24,30,C.red);x.restore()};
SC.rule=(t,L)=>{const lt=t-L.s,d=L.e-L.s;SC3.rule(t,L);if(lt>d*0.55){const p=pop(t,L.s+d*0.55);x.save();x.translate(360,820);x.scale(p,p);card(-200,-40,400,80,C.yellow,40);txt('СОХРАНИ — ПРИГОДИТСЯ',0,2,26,C.ink);x.restore()}};
SC.seryi3=(t,L)=>{winterBG();busStop(30,900);for(let i=0;i<5;i++)cold(380-i*72,935,0.85,{face:{mouth:'smile',look:[1,0]}});thermos(620,935,1.0,true);
  hero(520,935,1.2,{face:{mouth:'smile',look:[-1,0]}});seryi(400,935,1.25,{armF:-0.6,face:{look:[1,0],mouth:'o'}});speaker(400,580,'СЕРЫЙ');
  const p=pop(t,L.s+0.1);x.save();x.translate(360,250);x.scale(p,p);card(-260,-70,520,140,'#fff',26);txt('«Я, КОРОЧЕ, УВОЛЬНЯЮСЬ.',0,-22,28,C.ink);txt('ВОЗЬМЁШЬ К СЕБЕ?»',0,24,30,C.green);x.restore()};
SC.cta=(t,L)=>{const lt=t-L.s,d=L.e-L.s;winterBG();busStop(30,900);
  ['#3b6fd8','#8a5a44','#6d4c8a'].forEach((col,i)=>cold(260-i*78,935,0.9,{shirt:col,face:{mouth:'flat',look:[1,0]}}));
  hero(420,935,1.3,{armF:-1.3,face:{mouth:'flat',look:[0,-0.5]}});thermos(545,935,1.1,true);
  const opts=[['1','ОТДАТЬ ПОЛОВИНУ',C.hood],['2','НОВОЕ МЕСТО',C.blue],['3','РАЗРЕШЕНИЕ',C.green]];
  opts.forEach(([n,lab,col],i)=>{const p=pop(t,L.s+0.15+i*0.25);if(p<=0)return;x.save();x.translate(360,170+i*105);x.scale(p,p);card(-250,-42,500,84,'#fff',22);circle(col,-200,0,32);txt(n,-200,3,40,'#fff');fitTxt(lab,40,2,30,C.ink,360);x.restore()});
  if(lt>d*0.7)label2('СЕРИЯ 3 — ПО ВЫБОРУ БОЛЬШИНСТВА',360,500,C.ink,C.yellow,22)};
