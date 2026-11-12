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
