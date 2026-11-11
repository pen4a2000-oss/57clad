// ================= KVARTIRA 47 — EP2 =================
function txt(s,X,Y,size,col,align='center',weight=900){x.font=`${weight} ${size}px M`;x.fillStyle=col;x.textAlign=align;x.textBaseline='middle';x.fillText(s,X,Y);x.textAlign='left'}
const S=[];function sc(s,e,f){S.push({s,e,f})}
const ID=TM.ids; const L=k=>LN[ID.indexOf(k)][0], E=k=>LN[ID.indexOf(k)][1];
function countAt(t){const K=TM.countKeys;if(t<K[0][0])return null;if(t>=TM.sixty)return 60;let v=K[K.length-1][1];for(let i=1;i<K.length;i++){if(t<K[i][0]){const [a,va]=K[i-1],[b,vb]=K[i];v=Math.floor(lerp(va,vb,(t-a)/(b-a)));break}}return v}
function itCount(t){if(t<L('voice2')+0.3)return null;if(t>=TM.sixty)return 60;const me=countAt(t);const lag=t<L('lag')?0:t<L('door')?0.5:1;return Math.max(40,Math.floor(me-lag))}
// HUD
function hud(t){if(t>=TM.endCard)return;
  const blink=(Math.floor(t*2)%2)?C.red:'#7a1c1f';
  pill(22,26,'КВАРТИРА 47','rgba(0,0,0,.65)','#fff',blink);
  pill(22,70,'ПРАВИЛО 2/7','rgba(229,56,59,.92)','#fff',null,16);
  if(t<L('recap'))return;
  const c_=countAt(t);const txt=c_===null?'СЧЁТ  0 / 60':'СЧЁТ  '+String(c_).padStart(2,' ')+' / 60';
  x.font='900 24px M';const w=x.measureText(txt).width+30;x.fillStyle=c_===null?'rgba(0,0,0,.65)':'rgba(229,56,59,.94)';rr(W-22-w,26,w,46,23);x.fill();x.fillStyle='#fff';x.textBaseline='middle';x.textAlign='left';x.fillText(txt,W-22-w+15,50);
  const it=itCount(t);if(it!==null&&t<E('sixty')+0.6){const t2='ОНО:  '+it;x.font='900 22px M';const w2=x.measureText(t2).width+30;x.fillStyle='rgba(60,20,90,.92)';rr(W-22-w2,80,w2,42,21);x.fill();x.fillStyle='#e9d6ff';x.fillText(t2,W-22-w2+15,102)}
}
// lighting helpers
function dark(px,py,r=230,a=0.95){x.fillStyle=rg(px,py,r*0.35,r,'rgba(0,0,0,0)',`rgba(2,3,8,${a})`);x.fillRect(0,0,W,H)}
function bathBG(){x.fillStyle=grad(0,H,'#cfe0e4','#a9c1c7');x.fillRect(0,0,W,H);
  x.strokeStyle='rgba(255,255,255,.55)';x.lineWidth=3;for(let i=0;i<W;i+=72){x.beginPath();x.moveTo(i,0);x.lineTo(i,900);x.stroke()}for(let j=0;j<900;j+=72){x.beginPath();x.moveTo(0,j);x.lineTo(W,j);x.stroke()}
  rect('#8aa3a8',0,900,W,H-900);}
function mirror(X,Y,w,h,fn){x.save();rect('#d8d2c4',X-14,Y-14,w+28,h+28);rect('#9fb7c9',X,Y,w,h);x.beginPath();x.rect(X,Y,w,h);x.clip();x.fillStyle=grad(Y,Y+h,'#b9d0de','#8fa9bb');x.fillRect(X,Y,w,h);fn&&fn();
  x.fillStyle='rgba(255,255,255,.18)';poly(x.fillStyle,[X+20,Y,X+70,Y,X+20,Y+90]);x.restore()}
function sink(X,Y){x.fillStyle='#f4f6f6';rr(X-150,Y,300,70,30);x.fill();rect('#c9d3d6',X-14,Y-40,28,44);rect('#c9d3d6',X-40,Y-50,80,14);rect('#e7ecee',X-60,Y+70,120,240)}
function note2(X,Y,s,rot=-0.04){x.save();x.translate(X,Y);x.rotate(rot);x.scale(s,s);x.fillStyle='rgba(0,0,0,.4)';x.fillRect(-256,-196,520,400);x.fillStyle=C.paper;x.fillRect(-262,-204,520,400);
  rect('rgba(200,200,190,.6)',-40,-222,90,34);x.fillStyle=C.ink;x.textAlign='center';x.textBaseline='middle';
  x.font='900 44px M';x.fillText('ПРАВИЛО 2',0,-140);x.font='900 34px M';x.fillText('ЕСЛИ ПОГАС СВЕТ —',0,-70);x.fillText('СЧИТАЙ ДО 60',0,-20);x.fillStyle='#8b1a1a';x.fillText('ВСЛУХ.',0,30);x.fillText('НЕ СБИВАЙСЯ.',0,80);x.textAlign='left';x.restore()}
// 0 HOOK — the rule note lit by flashlight + live counter
sc(0,L('recap'),(t)=>{x.fillStyle='#05060a';x.fillRect(0,0,W,H);
  note2(360,470,1.0);
  dark(360,470,520,0.9);
  const n=Math.min(60,Math.floor(t*14)+1);const pulse=1+0.05*Math.sin(t*12);
  x.save();x.translate(360,800);x.scale(pulse,pulse);bigText(String(n).padStart(2,'0')+' / 60',0,150,'#ff4d4f',1,0);x.restore();
  if(t>2.3){const r=rng(Math.floor(t*20));if(r()<0.4){x.fillStyle='rgba(255,255,255,.06)';x.fillRect(0,0,W,H)}}
  if(t<0.2)shake=8;});
// 1 recap — chat with Dima, no reply
sc(L('recap'),L('off'),(t)=>{const lt=t-L('recap');x.fillStyle='#0b0d12';x.fillRect(0,0,W,H);
  phoneUI(360,580,1.2,()=>{rect('#1d2230',-158,-290,316,60);circle('#5a7',-128,-260,16);x.fillStyle='#fff';x.font='900 20px M';x.textBaseline='middle';x.fillText('Дима',-100,-262);x.fillStyle='#8a93a6';x.font='700 14px M';x.fillText('был(а) вчера в 03:02',-100,-240);
    x.fillStyle='#2b2f3a';rr(-150,-170,250,80,14);x.fill();x.fillStyle='#fff';x.font='700 17px M';x.fillText('а кто это стоит',-136,-144);x.fillText('у тебя за спиной? 😳',-136,-118);
    const msgs=['Дима??','ты где','ответь'];msgs.forEach((m,i)=>{if(lt>0.8+i*0.9){x.fillStyle='#2f6fd6';rr(10,-60+i*62,140,46,14);x.fill();x.fillStyle='#fff';x.font='700 18px M';x.fillText(m,24,-37+i*62);x.fillStyle='#8a93a6';x.font='700 12px M';x.fillText('✓',130,-24+i*62)}});
    if(lt>3.6){x.fillStyle='#ff6b6b';x.font='900 18px M';x.textAlign='center';x.fillText('Нет ответа 14 ч',0,190);x.textAlign='left'}});
  label(360,190,'ПРАВИЛО 1 — ПРОЙДЕНО',C.teal,'#032',22);});
// 2 off — bathroom, brushing, lights out
sc(L('off'),L('count1'),(t)=>{const lt=t-L('off'),d=E('off')-L('off');bathBG();mirror(190,200,340,360,()=>{face(360,420,95,{body:true,look:[0,0],mouth:'flat'})});sink(360,640);
  face(360,1190,150,{look:[0,-1],mouth:'flat',body:true});rect('#3fd0c0',395,1250,90,12);rect('#fff',475,1242,22,26);
  if(lt>d*0.62){const q=prog(lt,d*0.62,d*0.62+0.25);const fl=Math.random()<0.5?0.4:1;x.fillStyle=`rgba(2,3,8,${Math.min(0.97,q*fl+ (q>=1?0.97:0))})`;x.fillRect(0,0,W,H);if(q<1)shake=4}
  if(lt>d*0.62)label(360,420,'СВЕТ ГАСНЕТ ВО ВСЁМ ДОМЕ',C.red,'#fff',24);});
// 3 count 1..3 — black, big numbers
sc(L('count1'),L('mirror'),(t)=>{x.fillStyle='#030406';x.fillRect(0,0,W,H);const c_=countAt(t)||0;
  if(c_>0){const kt=TM.countKeys.find(k=>k[1]===c_);const age=kt?t-kt[0]:1;const s=lerp(1.6,1,eo(age/0.25));x.save();x.translate(360,560);x.scale(s,s);bigText(String(c_),0,200,'#fff',1-clamp((age-0.8)/0.6)*0.6,0);x.restore()}
  // breathing face barely visible
  x.globalAlpha=0.25;face(360,1210,120,{look:[0,0],wide:1.3,fear:0.6,mouth:'o',mo:0.5});x.globalAlpha=1;});
// 4 mirror with flashlight — only you
sc(L('mirror'),L('tap'),(t)=>{const lt=t-L('mirror');bathBG();mirror(190,200,340,360,()=>{face(360,420,95,{body:true,look:[0,0],wide:1.3,fear:0.7,mouth:'flat'});x.fillStyle='rgba(255,255,230,.35)';circle(x.fillStyle,450,520,40)});sink(360,640);
  dark(360,430,lt<0.5?lerp(80,330,eo(lt/0.5)):330,0.97);
  face(360,1200,140,{look:[0,-1],wide:1.3,fear:0.8,mouth:'flat',phone:true});
  if(lt>3.4)label(360,170,'ТОЛЬКО ТЫ',C.yellow,'#111',26);});
// 5 tap — kitchen in darkness, water
sc(L('tap'),L('glass'),(t)=>{const lt=t-L('tap');kitchenBG();rect('#cfd6dc',380,560,240,30);rect('#9aa4ad',470,470,20,90);rect('#9aa4ad',470,470,60,16);
  if(lt>1.4){x.fillStyle='rgba(170,210,255,.85)';rect(x.fillStyle,519,486,6,74+Math.sin(t*40)*2)}
  dark(500,520,lt>1.4?240:120,0.97);
  x.globalAlpha=0.8;face(170,1210,120,{look:[1,-0.5],wide:1.4,fear:1,mouth:'o',mo:0.6});x.globalAlpha=1;
  if(lt>1.6)label(500,380,'КРАН ОТКРЫЛСЯ САМ',C.red,'#fff',22);});
// 6 glass — table, glass appears
sc(L('glass'),L('rule'),(t)=>{const lt=t-L('glass'),d=E('glass')-L('glass');kitchenBG();rect('#5b4632',140,700,440,24);rect('#4a3826',170,724,20,200);rect('#4a3826',530,724,20,200);
  if(lt>d*0.62){const q=eo(prog(lt,d*0.62,d*0.62+0.2));x.globalAlpha=q;x.fillStyle='rgba(200,230,255,.55)';rr(335,600,50,100,6);x.fill();x.fillStyle='rgba(120,180,255,.5)';x.fillRect(338,640,44,58);x.globalAlpha=1;if(lt<d*0.62+0.15)shake=5}
  dark(360,650,280,0.96);
  if(lt>d*0.65)label(360,480,'КТО-ТО ЗДЕСЬ',C.red,'#fff',26);});
// 7 rule reminder
sc(L('rule'),L('voice2'),(t)=>{const lt=t-L('rule');x.fillStyle='#05060a';x.fillRect(0,0,W,H);note2(360,500,lerp(0.9,1.0,eo(lt)),0.03);dark(360,500,520,0.85);
  x.save();x.translate(150,240);x.rotate(-0.08);x.fillStyle=C.red;rr(0,0,280,56,8);x.fill();x.fillStyle='#fff';x.font='900 30px M';x.textBaseline='middle';x.fillText('ПРАВИЛО №2',24,29);x.restore();});
// 8 second voice
sc(L('voice2'),L('lag'),(t)=>{const lt=t-L('voice2');x.fillStyle='#04050a';x.fillRect(0,0,W,H);
  face(360,820,210,{wide:1.5,fear:1,mouth:'o',mo:0.9,look:[Math.sin(t*1.5)*0.8,0],sweat:true,bags:true});dark(360,780,420,0.9);
  if(t>=L('echo')){const r=rng(Math.floor(t*10));for(let i=0;i<5;i++){x.globalAlpha=0.25;bubble(120+r()*480,220+r()*300,String(itCount(t)||41),{size:40,bg:'#2a1640',fg:'#e9d6ff'});}x.globalAlpha=1;
    bubble(360,220,'«'+(itCount(t)||41)+'...»',{size:48,bg:'#2a1640',fg:'#e9d6ff'})}
  else if(lt>1.0)label(360,220,'ВТОРОЙ ГОЛОС',C.red,'#fff',30);});
// 10 lag — split counters
sc(L('lag'),L('door'),(t)=>{const lt=t-L('lag');x.fillStyle='#04050a';x.fillRect(0,0,W,H);
  const me=countAt(t),it=itCount(t);
  x.fillStyle='rgba(255,255,255,.06)';rr(60,300,280,320,24);x.fill();x.fillStyle='rgba(80,30,120,.25)';rr(380,300,280,320,24);x.fill();
  txt('ТЫ',200,360,30,'#fff');txt('ОНО',520,360,30,'#e9d6ff');bigText(String(me),480,160,'#fff',1,200);bigText(String(it),480,160,'#c9a2ff',1,520);
  const lagTxt=t<L('lag')+(E('lag')-L('lag'))*0.4?'−0,5 СЕК':'−1 СЕК';label(520,600,lagTxt,'#5a2a8a','#fff',22);
  if(lt>(E('lag')-L('lag'))*0.6)label(360,720,'ЖДЁТ, КОГДА ТЫ СОБЬЁШЬСЯ',C.red,'#fff',24);});
// 11 door handle
sc(L('door'),L('msg'),(t)=>{const lt=t-L('door'),d=E('door')-L('door');x.fillStyle='#0b0d12';x.fillRect(0,0,W,H);
  rect('#d9d4c7',160,160,400,900);rect('#e9e4d8',180,180,360,860);x.strokeStyle='rgba(0,0,0,.08)';x.lineWidth=4;x.strokeRect(220,230,280,330);x.strokeRect(220,620,280,380);
  const q=eio(prog(lt,d*0.55,d));x.save();x.translate(490,640);x.rotate(q*0.6);rect('#b8b0a0',-8,-8,16,16);rect('#a39a88',-70,-6,70,12);x.restore();
  x.fillStyle='rgba(0,0,0,.85)';x.fillRect(180,1040,360,10);x.fillStyle='rgba(0,0,0,.95)';x.fillRect(250,1040,50,10);x.fillRect(380,1040,50,10);
  dark(460,640,lerp(260,200,q),0.96);if(q>0)shake=1.5;
  if(lt>1.6)label(360,260,'ГОЛОС — ЗА ДВЕРЬЮ',C.red,'#fff',26);});
// 12 message from Dima
sc(L('msg'),L('fiftynine'),(t)=>{const lt=t-L('msg');x.fillStyle='#05060a';x.fillRect(0,0,W,H);const vib=lt<1.6&&lt>1.0?Math.sin(t*90)*5:0;
  phoneUI(360+vib,600,1.2,()=>{rect('#1d2230',-158,-290,316,60);circle('#5a7',-128,-260,16);x.fillStyle='#fff';x.font='900 20px M';x.textBaseline='middle';x.fillText('Дима',-100,-262);x.fillStyle=C.teal;x.font='700 14px M';x.fillText('в сети',-100,-240);
    if(lt>1.2){x.fillStyle='#2b2f3a';rr(-150,-140,290,150,14);x.fill();x.fillStyle='#fff';x.font='900 20px M';x.fillText('НЕ СЧИТАЙ ВСЛУХ.',-134,-104);x.fillStyle='#ff8a8a';x.fillText('ОНО УЧИТСЯ',-134,-66);x.fillText('ТВОЕМУ ГОЛОСУ',-134,-36)}});
  if(lt>2.4)label(360,170,'НО ПРАВИЛО ГОВОРИТ: ВСЛУХ',C.yellow,'#111',22);});
// 13 58..59 — extreme close mouth / heartbeat
sc(L('fiftynine'),L('sixty'),(t)=>{x.fillStyle='#030406';x.fillRect(0,0,W,H);const c_=countAt(t);
  face(360,760,260,{wide:1.6,fear:1,mouth:'o',mo:0.5+0.3*Math.abs(Math.sin(t*3)),look:[0,0],sweat:true});dark(360,760,420,0.93);
  const kt=TM.countKeys.find(k=>k[1]===c_);const age=kt?t-kt[0]:1;bigText(String(c_),300,lerp(240,170,eo(age/0.25)),'#fff',1);
  if(t>E('fiftynine')){x.fillStyle=`rgba(0,0,0,${prog(t,E('fiftynine'),E('fiftynine')+0.6)*0.85})`;x.fillRect(0,0,W,H)}});
// 14 sixty — said by it, behind the door
sc(L('sixty'),L('light'),(t)=>{const lt=t-L('sixty');x.fillStyle='#030406';x.fillRect(0,0,W,H);
  rect('#2a2a30',160,160,400,900);dark(360,600,300,0.9);
  bubble(360,560,'«ШЕСТЬДЕСЯТ»',{size:58,bg:'#2a1640',fg:'#e9d6ff',jag:true});
  if(lt>1.0)label(360,780,'ЭТО СКАЗАЛ НЕ ТЫ',C.red,'#fff',30);if(lt<0.3)shake=8;});
// 15 light on
sc(L('light'),L('smile'),(t)=>{const lt=t-L('light');bathBG();mirror(190,200,340,360,()=>{face(360,420,95,{body:true,look:[0,0],wide:1.4,fear:1,mouth:'o',mo:0.6})});sink(360,640);
  if(lt<0.35){x.fillStyle=`rgba(255,255,255,${1-lt/0.35})`;x.fillRect(0,0,W,H)}
  face(360,1200,150,{look:[0,-1],wide:1.4,fear:1,mouth:'o',mo:0.7,sweat:true});});
// 16 smile — reflection smiles
sc(L('smile'),TM.endCard,(t)=>{const lt=t-L('smile'),d=E('smile')-L('smile');bathBG();
  const z=eio(prog(lt,0,d));x.save();x.translate(360,420);x.scale(lerp(1,1.7,z),lerp(1,1.7,z));x.translate(-360,-420);
  mirror(190,200,340,360,()=>{const sm=lt>d*0.55;face(360,420,95,sm?{body:true,look:[0,0],wide:1.2,small:true,mouth:'grin',angry:true,hollow:true}:{body:true,look:[0,0],wide:1.4,fear:1,mouth:'o'});if(sm){x.fillStyle='rgba(255,0,0,.12)';x.fillRect(190,200,340,360)}});x.restore();
  if(lt>d*0.55&&lt<d*0.55+0.2)shake=10;
  if(t>=L('cta')){x.fillStyle='rgba(0,0,0,.55)';x.fillRect(0,0,W,H);bubble(360,250,'КТО СКАЗАЛ\n«ШЕСТЬДЕСЯТ»?',{size:40});label(360,420,'ПИШИ В КОММЕНТАРИЯХ',C.yellow,'#111',26)}});
// end
sc(TM.endCard,999,(t)=>{const lt=t-TM.endCard;x.fillStyle='#07080c';x.fillRect(0,0,W,H);const a=eo(prog(lt,0.1,0.5));
  bigText('ПРАВИЛО №3',480,76,'#fff',a);bigText('НЕ СМОТРИ В ГЛАЗОК',570,40,C.red,a);
  x.globalAlpha=a;x.font='700 24px M';x.textAlign='center';x.fillStyle='rgba(255,255,255,.75)';x.fillText('ПОДПИШИСЬ, ЧТОБЫ НЕ ПРОПУСТИТЬ',W/2,660);x.fillStyle=C.red;x.font='900 22px M';x.fillText('ОСТАЛОСЬ ПРАВИЛ: 5',W/2,720);x.textAlign='left';x.globalAlpha=1;});
