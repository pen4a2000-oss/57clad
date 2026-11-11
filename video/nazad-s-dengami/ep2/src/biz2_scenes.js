// ===== NAZAD S DENGAMI — EP2 (cars) =====
function fmtR(v){return Math.round(v).toLocaleString('ru-RU').replace(/[, ]/g,' ').replace(/\s/g,' ')+' ₽'}
function hudState(t){const K=TM.hud;let cur=K[0],prev=K[0];for(const k of K){if(t>=k[0]){prev=cur;cur=k}}
  const age=t-cur[0];const q=eo(clamp(age/0.6));const cap=lerp(prev[2],cur[2],q);return {day:cur[1],cap,prog:lerp(prev[3],cur[3],q),flash:age<0.6&&cur[2]!==prev[2],down:cur[2]<prev[2]}}
function hud(t){if(t>=TM.endCard)return;const st=hudState(t);const tw=t>=TM.twistAt;
  const capCol=tw?(Math.floor(t*4)%2?'#ff4d4f':'#fff'):st.cap<=0?'#ff4d4f':st.flash?'#5ef08f':'#7ff0a8';
  const boxes=[['ГОД','2009',C.yellow],['ДЕНЬ',st.day+' / 365','#fff'],['КАПИТАЛ',fmtR(st.cap)+(tw?' ?':''),capCol]];
  let X=16;for(const [lab,val,col] of boxes){x.font='900 22px M';const w=Math.max(x.measureText(val).width,60)+28;x.fillStyle='rgba(18,24,38,.82)';rr(X,18,w,58,12);x.fill();txt(lab,X+w/2,34,12,'rgba(255,255,255,.65)');txt(val,X+w/2,57,22,col);X+=w+8}
  x.fillStyle='rgba(18,24,38,.82)';rr(16,84,W-32,30,10);x.fill();txt('ЦЕЛЬ: 1 000 000 ₽',30,99,14,'#fff','left');
  const p=st.prog/100;rect('rgba(255,255,255,.18)',220,93,W-252,12);rect(C.green,220,93,(W-252)*Math.max(0.01,p),12);txt(Math.round(Math.max(1,st.prog))+'%',W-28,99,13,'#7ff0a8','right');
}
function car(X,Y,s,col='#3b6fd8',o={}){x.save();x.translate(X,Y);x.scale(s*(o.flip?-1:1),s);
  ell('rgba(20,30,50,.18)',0,4,150,14);x.fillStyle=col;rr(-150,-70,300,64,24);x.fill();x.beginPath();x.moveTo(-90,-70);x.quadraticCurveTo(-60,-128,10,-128);x.quadraticCurveTo(70,-128,100,-70);x.closePath();x.fill();
  x.fillStyle='#cfe8ff';x.beginPath();x.moveTo(-74,-74);x.quadraticCurveTo(-52,-116,-8,-116);x.lineTo(-8,-74);x.closePath();x.fill();x.beginPath();x.moveTo(6,-74);x.lineTo(6,-116);x.quadraticCurveTo(58,-116,82,-74);x.closePath();x.fill();
  rect('rgba(0,0,0,.12)',-150,-36,300,8);rect('#ffe08a',130,-58,18,12);rect('#ff6b6b',-148,-58,14,12);
  for(const wx of [-90,90]){circle('#1d2433',wx,-6,30);circle('#9aa4b2',wx,-6,13)}
  if(o.sold){x.restore();return}
  x.restore();}
function priceTag(X,Y,s,txt1,col='#fff',bg=C.ink,rot=-0.05){x.save();x.translate(X,Y);x.rotate(rot);x.font=`900 ${s}px M`;const w=x.measureText(txt1).width+40;x.fillStyle='rgba(20,30,50,.2)';rr(-w/2+5,-s*0.8+8,w,s*1.6,14);x.fill();x.fillStyle=bg;rr(-w/2,-s*0.8,w,s*1.6,14);x.fill();txt(txt1,0,2,s,col);x.restore()}
const P2=(X,Y,s,o)=>chibi(X,Y,s,Object.assign({shirt:'#8a8f99',hood:'#6d727c',pants:'#3a3a44',hair:'#2b211b'},o||{}));
const SC2={};
SC2.hook=(t,L)=>{const lt=t-L.s,d=L.e-L.s;sky();city();car(380,880,1.45,'#3b6fd8');
  priceTag(360,300,64,'+60 000 ₽','#5ef08f',C.ink,-0.04);
  const p=pop(t,L.s+d*0.45);if(p>0){x.save();x.translate(360,430);x.scale(p,p);card(-250,-40,500,80,'#fff',40);txt('НЕ ПОКУПАЯ МАШИНУ',0,2,32,C.red);x.restore()}
  outlined('ЗА 7 ДНЕЙ',360,190,56,C.yellow);
  hero(150,935,1.2,{armF:-0.9,face:{look:[1,-0.5],mouth:'smile'}});};
SC2.chose=(t,L)=>{const d=L.e-L.s;x.fillStyle=grad(0,H,'#eef6ff','#dce9fb');x.fillRect(0,0,W,H);outlined('ВЫ ВЫБРАЛИ',360,170,58,'#fff');
  optionCards(t,L,[1,1,1],(i)=>{if(i!==2){x.fillStyle='rgba(238,246,255,.7)';rr(-300,-80,600,160,24);x.fill()}});
  stamp('ВЫБОР БОЛЬШИНСТВА',360,745,t,L.s+0.5,C.green,34,-0.05);
  if(t>L.s+d*0.55){const p=pop(t,L.s+d*0.55);x.save();x.translate(360,860);x.scale(p,p);card(-240,-40,480,80,'#fff',40);txt('НО ЕСТЬ ВСЕГО 10 000 ₽',0,2,30,C.ink);x.restore()}};
SC2.crisis=(t,L)=>{const lt=t-L.s,d=L.e-L.s;x.fillStyle=grad(0,H,'#fff1ee','#ffe2dc');x.fillRect(0,0,W,H);outlined('КРИЗИС 2009',360,170,60,'#fff');
  card(70,250,580,330,'#fff',24);txt('$ В РУБЛЯХ',110,285,20,'rgba(29,36,51,.55)','left');
  const q=eo(prog(lt,0.2,d*0.35));x.strokeStyle=C.red;x.lineWidth=8;x.lineJoin='round';x.beginPath();const pts=[[120,520],[220,510],[320,470],[420,400],[520,340],[600,320]];
  pts.forEach(([px,py],i)=>{const k=i/(pts.length-1);if(k<=q){i?x.lineTo(px,py):x.moveTo(px,py)}});x.stroke();
  txt('23,5 ₽',150,550,24,C.ink);if(q>0.95){txt('36 ₽',590,290,30,C.red);txt('×1,5',470,450,40,C.red)}
  txt('АВГ 2008',150,600-40+40,16,'rgba(29,36,51,.5)');txt('ФЕВ 2009',590,600,16,'rgba(29,36,51,.5)');
  if(lt>d*0.4){P2(230,935,1.15,{face:{fear:1,mouth:'flat',look:[0,1]},armF:-0.9});const p=pop(t,L.s+d*0.62);if(p>0){x.save();x.translate(450,700);x.rotate(0.06);x.scale(p,p);card(-150,-50,300,100,'#fffbe6',8);txt('СРОЧНО ПРОДАМ',0,-12,26,C.red);txt('АВТО · ДЁШЕВО',0,22,20,C.ink);x.restore()}}};
SC2.time=(t,L)=>{const lt=t-L.s,d=L.e-L.s;x.fillStyle=rg(360,560,50,700,'#fff6d8','#ffd36b');x.fillRect(0,0,W,H);
  x.save();x.translate(360,520);x.rotate(Math.sin(t*2)*0.05);poly('#c9a23a',[-120,-180,120,-180,120,-160,-120,-160]);poly('#c9a23a',[-120,180,120,180,120,160,-120,160]);
  x.fillStyle='rgba(200,230,255,.7)';x.beginPath();x.moveTo(-100,-160);x.lineTo(100,-160);x.lineTo(10,0);x.lineTo(100,160);x.lineTo(-100,160);x.lineTo(-10,0);x.closePath();x.fill();
  const q=prog(lt,0,d);poly('#e8b04a',[-80+q*70,-140+q*130,80-q*70,-140+q*130,0,-10]);poly('#e8b04a',[-90,150,90,150,90-q*40,150-q*90,-90+q*40,150-q*90]);x.restore();
  if(lt>d*0.5){const p=pop(t,L.s+d*0.5);x.save();x.translate(360,800);x.scale(p,p);card(-260,-44,520,88,C.ink,44);txt('ПОКУПАЕШЬ ВРЕМЯ',0,2,38,C.yellow);x.restore()}};
SC2.ad=(t,L)=>{const lt=t-L.s,d=L.e-L.s;x.fillStyle=grad(0,H,'#f3ede2','#e2d8c5');x.fillRect(0,0,W,H);
  card(70,180,580,520,'#fffdf6',10);txt('ИЗ РУК В РУКИ',360,215,22,'rgba(29,36,51,.5)');rect('rgba(29,36,51,.15)',90,240,540,3);
  car(360,480,1.0,'#c43c3c');txt('ИНОМАРКА 2006',360,540,34,C.ink);
  if(lt>d*0.22){txt('СРОЧНО!',360,590,30,C.red);}
  if(lt>d*0.25)priceTag(250,650,40,'250 000 ₽',C.ink,C.yellow,-0.04);
  if(lt>d*0.72){const p=pop(t,L.s+d*0.72);x.save();x.translate(360,800);x.scale(p,p);card(-260,-50,520,100,'#fff',24);txt('НА РЫНКЕ: 320 000 ₽',0,-14,30,C.ink);txt('РАЗНИЦА: +70 000 ₽',0,24,26,C.green);x.restore()}};
SC2.deposit=(t,L)=>{const lt=t-L.s,d=L.e-L.s;sky();city();car(560,880,1.0,'#c43c3c',{flip:true});
  P2(420,935,1.1,{flip:true,armF:-0.9,face:{look:[-1,0],mouth:'smile'}});
  const q=prog(lt,0.2,d*0.35);hero(170,935,1.1,{armF:-0.9,hold:q<1?'notes':undefined,face:{look:[1,0],mouth:'flat'}});
  if(q>0&&q<1){banknote(lerp(240,380,eo(q)),lerp(790,780,q),0.55,-0.1)}
  if(lt>d*0.45){const p=pop(t,L.s+d*0.45);x.save();x.translate(360,330);x.rotate(-0.03);x.scale(p,p);card(-230,-120,460,240,'#fffdf6',6);txt('РАСПИСКА',0,-80,30,C.ink);txt('Задаток 10 000 ₽',0,-30,24,C.ink,'center',700);txt('7 дней — продаю',0,10,24,C.ink,'center',700);txt('только ему',0,44,24,C.ink,'center',700);
    x.strokeStyle=C.blue;x.lineWidth=3;x.beginPath();x.moveTo(60,80);x.quadraticCurveTo(100,60,140,85);x.quadraticCurveTo(160,95,180,75);x.stroke();x.restore()}};
SC2.rule=(t,L)=>{x.fillStyle=grad(0,H,'#22304d','#141c2e');x.fillRect(0,0,W,H);const p=pop(t,L.s+0.1,0.4);x.save();x.translate(360,520);x.scale(p,p);
  card(-300,-200,600,400,'#fff',26);x.fillStyle=C.yellow;rr(-300,-200,600,80,26);x.fill();rect(C.yellow,-300,-150,600,30);txt('ПРАВИЛО №2',0,-158,34,C.ink);
  txt('ЗАРАБАТЫВАЮТ',0,-50,44,C.ink);txt('НЕ НА ПРОДАЖЕ,',0,4,44,C.ink);txt('А НА ПОКУПКЕ',0,90,48,C.green);x.restore()};
SC2.calls=(t,L)=>{const lt=t-L.s,d=L.e-L.s;x.fillStyle=grad(0,H,'#eef6ff','#dce9fb');x.fillRect(0,0,W,H);
  const ads=['КУПЛЮ АВТО · 280 000','КУПЛЮ АВТО · 290 000','КУПЛЮ ИНОМАРКУ · 300 000','КУПЛЮ АВТО · 310 000'];
  ads.forEach((a,i)=>{const p=pop(t,L.s+0.2+i*d*0.15);if(p<=0)return;x.save();x.translate(360,240+i*120);x.scale(p,p);const best=i===3&&lt>d*0.7;card(-270,-46,540,92,best?'#e9fbef':'#fff',18);txt(a,-240,2,26,best?C.green:C.ink,'left');
    if(i<3&&lt>0.4+(i+1)*d*0.15){txt('✕',230,2,30,C.red)}if(best)txt('✓',230,2,34,C.green);x.restore()});
  hero(360,935,1.15,{armF:-2.4,hold:'phone',face:{look:[1,-1],mouth:'flat'}});
  outlined('ДЕНЬ 4',600,170,30,'#fff');};
SC2.deal=(t,L)=>{const lt=t-L.s,d=L.e-L.s;x.fillStyle=grad(0,H,'#eafff1','#d3f5e0');x.fillRect(0,0,W,H);
  const node=(X,Y,lab,val,col)=>{card(X-130,Y-60,260,120,'#fff',24);txt(lab,X,Y-24,20,'rgba(29,36,51,.55)');txt(val,X,Y+18,34,col)};
  node(360,240,'ПОКУПАТЕЛЬ','310 000 ₽',C.ink);
  const q1=prog(lt,0.2,d*0.4),q2=prog(lt,d*0.45,d*0.7);
  x.strokeStyle=C.ink;x.lineWidth=6;x.setLineDash([12,10]);x.beginPath();x.moveTo(300,310);x.lineTo(lerp(300,190,q1),lerp(310,440,q1));x.stroke();x.beginPath();x.moveTo(420,310);x.lineTo(lerp(420,530,q2),lerp(310,440,q2));x.stroke();x.setLineDash([]);
  if(q1>0.9)node(190,510,'ПРОДАВЕЦ','250 000 ₽',C.ink);if(q2>0.9)node(530,510,'ТЕБЕ','70 000 ₽',C.green);
  if(lt>d*0.75){const p=pop(t,L.s+d*0.75);x.save();x.translate(360,740);x.scale(p,p);card(-250,-46,500,92,C.ink,46);txt('+60 000 ₽ ЗА НЕДЕЛЮ',0,2,34,'#5ef08f');x.restore()}};
SC2.repeat=(t,L)=>{const lt=t-L.s,d=L.e-L.s;sky();city();
  [['#c43c3c',150],['#2bb5a8',360],['#ffb02e',570]].forEach(([col,X],i)=>{const p=pop(t,L.s+i*d*0.25);if(p<=0)return;x.save();x.translate(X,620);x.scale(p,p);car(0,0,0.62,col);x.restore();stamp('ПРОДАНО',X,560,t,L.s+i*d*0.25+0.25,C.green,26,-0.12)});
  hero(360,935,1.25,{armF:-2.0,hold:'notes',face:{mouth:'smile',look:[0,-1]}});
  if(lt>d*0.7)outlined('200 000 ₽',360,250,80,'#5ef08f');};
SC2.twist=(t,L)=>{const lt=t-L.s,d=L.e-L.s;x.fillStyle=grad(0,H,'#3a1d24','#1a0f14');x.fillRect(0,0,W,H);
  const ring=lt<d*0.3;hero(360,935,1.25,{armF:-2.4,hold:'phone',face:{look:[0,-1],fear:ring?0.3:1,mouth:ring?'flat':'o'}});
  if(ring){const v=Math.sin(t*60)*4;x.save();x.translate(v,0);outlined('ЗВОНОК',360,300,60,'#fff');x.restore()}
  else{const p=pop(t,L.s+d*0.3);x.save();x.translate(360,320);x.scale(p,p);card(-280,-90,560,180,'#fff',26);txt('«ОНА В ЗАЛОГЕ',0,-30,40,C.red);txt('У БАНКА!»',0,26,40,C.red);x.restore();stamp('ЗАЛОГ',360,520,t,L.s+d*0.62,C.red,64,-0.1)}};
SC2.cta=(t,L)=>{x.fillStyle=grad(0,H,'#eef6ff','#dce9fb');x.fillRect(0,0,W,H);outlined('ТВОЙ ХОД',360,170,70,'#fff');
  const opts=[['1','ВЕРНУТЬ ДЕНЬГИ',C.hood],['2','ИДТИ В БАНК',C.blue],['3','ИСКАТЬ ПРОДАВЦА',C.red]];
  opts.forEach(([n,lab,col],i)=>{const p=pop(t,L.s+0.15+i*0.25);if(p<=0)return;x.save();x.translate(360,320+i*150);x.scale(p,p);card(-280,-56,560,112,'#fff',24);circle(col,-220,0,40);txt(n,-220,4,48,'#fff');txt(lab,-150,2,34,C.ink,'left');x.restore()});
  label2('ПИШИ В КОММЕНТАРИЯХ',360,800,C.ink,'#fff',30)};
SC2.end=(t)=>{x.fillStyle=grad(0,H,'#22304d','#141c2e');x.fillRect(0,0,W,H);const p=pop(t,TM.endCard+0.1);x.save();x.translate(360,560);x.scale(p,p);
  outlined('СЕРИЯ 3',0,-60,96,'#fff');outlined('ПО ВЫБОРУ БОЛЬШИНСТВА',0,40,40,C.yellow);txt('ПОДПИШИСЬ, ЧТОБЫ НЕ ПРОПУСТИТЬ',0,130,24,'rgba(255,255,255,.75)');x.restore()};
Object.assign(SC,SC2);
