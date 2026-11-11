<!doctype html>
<html><head><meta charset="utf-8">
<style>
@font-face{font-family:M;font-weight:900;src:url(m900.woff2) format('woff2');unicode-range:U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116;}
@font-face{font-family:M;font-weight:900;src:url(m900l.woff2) format('woff2');}
@font-face{font-family:M;font-weight:700;src:url(m700.woff2) format('woff2');unicode-range:U+0400-045F;}
html,body{margin:0;background:#000}canvas{display:block}
</style></head><body>
<canvas id="c" width="1080" height="1920"></canvas>
<script>
const W=720,H=1280,c=document.getElementById('c'),x=c.getContext('2d',{willReadFrequently:true});
const TM=__TIMING__;const CAPMAP=__CAPS__;
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
const eo=t=>1-Math.pow(1-clamp(t),3),ei=t=>Math.pow(clamp(t),3),eio=t=>{t=clamp(t);return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2};
const prog=(t,a,b)=>clamp((t-a)/(b-a));
const back=t=>{t=clamp(t);const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(t-1,3)+c1*Math.pow(t-1,2)};
function rng(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const C={red:'#e5383b',yellow:'#ffc83d',green:'#22b35e',teal:'#2bb5a8',skin:'#e9b48e',skinS:'#c98f6a',hood:'#ff7a3d',ink:'#1d2433',paper:'#fffaf0',blue:'#3b6fd8'};
function rect(c_,X,Y,w,h){x.fillStyle=c_;x.fillRect(X,Y,w,h)}
function circle(c_,X,Y,r){x.fillStyle=c_;x.beginPath();x.arc(X,Y,r,0,Math.PI*2);x.fill()}
function ell(c_,X,Y,rx,ry,rot=0){x.fillStyle=c_;x.beginPath();x.ellipse(X,Y,rx,ry,rot,0,Math.PI*2);x.fill()}
function poly(c_,p){x.fillStyle=c_;x.beginPath();x.moveTo(p[0],p[1]);for(let i=2;i<p.length;i+=2)x.lineTo(p[i],p[i+1]);x.closePath();x.fill()}
function rr(X,Y,w,h,r){x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath()}
function grad(y0,y1,a,b){const g=x.createLinearGradient(0,y0,0,y1);g.addColorStop(0,a);g.addColorStop(1,b);return g}
function rg(X,Y,r0,r1,a,b){const g=x.createRadialGradient(X,Y,r0,X,Y,r1);g.addColorStop(0,a);g.addColorStop(1,b);return g}
function card(X,Y,w,h,fill='#fff',r=22,sh=true){if(sh){x.fillStyle='rgba(20,30,50,.18)';rr(X+6,Y+10,w,h,r);x.fill()}x.fillStyle=fill;rr(X,Y,w,h,r);x.fill()}
function txt(s,X,Y,size,col,align='center',weight=900){x.font=`${weight} ${size}px M`;x.fillStyle=col;x.textAlign=align;x.textBaseline='middle';x.fillText(s,X,Y);x.textAlign='left'}
function fitTxt(s,X,Y,size,col,maxW,align='center'){x.font=`900 ${size}px M`;while(x.measureText(s).width>maxW&&size>12){size-=1;x.font=`900 ${size}px M`}txt(s,X,Y,size,col,align)}
function outlined(s,X,Y,size,col,stroke='rgba(15,20,35,.9)',lw=12){x.font=`900 ${size}px M`;x.textAlign='center';x.textBaseline='middle';x.lineJoin='round';x.lineWidth=lw;x.strokeStyle=stroke;x.strokeText(s,X,Y);x.fillStyle=col;x.fillText(s,X,Y);x.textAlign='left'}
let T=0,shake=0;
__HELPERS__
// ---------- scene helpers
function sky(){x.fillStyle=grad(0,H,'#9fd3ff','#e8f5ff');x.fillRect(0,0,W,H);circle('rgba(255,255,255,.9)',120,200,46);circle('rgba(255,255,255,.9)',170,190,60);circle('rgba(255,255,255,.9)',230,205,42);circle('rgba(255,255,255,.8)',560,300,36);circle('rgba(255,255,255,.8)',610,290,48)}
function city(){const r=rng(5);for(let i=0;i<9;i++){const w=60+r()*60,h=180+r()*260,X=i*85-20;rect(['#c9d6e8','#b8c8de','#d6e0ee'][i%3],X,760-h,w,h);for(let a=0;a<Math.floor(h/40);a++)for(let b=0;b<2;b++)rect('rgba(255,255,255,.55)',X+12+b*(w/2-6),760-h+16+a*40,w/4,16)}
  rect('#8d97a8',0,760,W,90);rect('#e8e0cf',0,850,W,H-850);for(let i=0;i<8;i++)rect('#fff',i*100+20,800,50,8)}
function banknote(X,Y,s,rot=0,val='5000'){x.save();x.translate(X,Y);x.rotate(rot);x.scale(s,s);rect('#e86a3c',-70,-34,140,68);rect('#f39a6b',-62,-26,124,52);circle('#e86a3c',-35,0,16);txt(val,24,0,26,'#7a2a10');x.restore()}
function coin(X,Y,r){circle('#e0a21b',X,Y,r);circle('#ffc83d',X,Y,r*0.82);txt('₿',X,Y+1,r*1.0,'#a86d00')}
function monitor(X,Y,w,h,fn){x.save();x.translate(X,Y);card(-w/2-24,-h/2-24,w+48,h+60,'#d9d4c7',18);rect('#20242c',-w/2,-h/2,w,h);rect('#bfb8a8',-40,h/2+36,80,40);rect('#a9a292',-90,h/2+70,180,16);x.beginPath();x.rect(-w/2,-h/2,w,h);x.clip();fn(w,h);x.restore()}
function pop(t,t0,d=0.35){return back(prog(t,t0,t0+d))}
function stamp(s,X,Y,t,t0,col=C.red,size=64,rot=-0.12){if(t<t0)return;const q=prog(t,t0,t0+0.18);const sc=lerp(2.2,1,eo(q));x.save();x.translate(X,Y);x.rotate(rot);x.scale(sc,sc);x.globalAlpha=clamp(q*3);x.font=`900 ${size}px M`;const w=x.measureText(s).width+40;x.strokeStyle=col;x.lineWidth=8;rr(-w/2,-size*0.75,w,size*1.5,12);x.stroke();txt(s,0,4,size,col);x.restore();if(q<1)shake=Math.max(shake,10*(1-q))}

