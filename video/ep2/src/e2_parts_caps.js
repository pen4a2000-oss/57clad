// ---------- captions
function tokenize(s){const out=[];let mode='w';for(const w0 of s.split(' ')){let w=w0,m=mode;if(w.startsWith('*')){m='y';w=w.slice(1);mode='y'}if(w.startsWith('#')){m='r';w=w.slice(1);mode='r'}if(w.startsWith('+')){m='g';w=w.slice(1);mode='g'}let end=false;const mm=w.match(/[*#+]/);if(mm){w=w.replace(/[*#+]/,'');end=true}out.push([w,m]);if(end)mode='w'}return out}
let CHUNKS=[];
(function(){TM.lines.forEach(L=>{const s=CAPMAP[L.id];if(!s)return;const tk=tokenize(s);const chunks=[];let cur=[],len=0;
  tk.forEach(([w,m],j)=>{cur.push([w,m]);len+=w.length+1;const endS=/[.?!…:»]$/.test(w);const nxt=tk[j+1];if((len>20&&!(w.length<=2&&nxt))||endS||j===tk.length-1){chunks.push(cur);cur=[];len=0}});
  const tot=chunks.reduce((a,c)=>a+c.reduce((b,[w])=>b+w.length+1,0),0);let acc=L.s;
  chunks.forEach(ch=>{const cl=ch.reduce((b,[w])=>b+w.length+1,0);const d=(L.e-L.s)*cl/tot;CHUNKS.push([acc,acc+d,ch]);acc+=d})});
  for(let i=0;i<CHUNKS.length-1;i++){const g=CHUNKS[i+1][0]-CHUNKS[i][1];if(g>0&&g<1.0)CHUNKS[i][1]=CHUNKS[i+1][0]}})();
function captions(t){const c_=CHUNKS.find(c=>t>=c[0]&&t<c[1]);if(!c_)return;const lt=t-c_[0];const sc=lerp(0.8,1,eo(lt/0.12));
  x.font='900 54px M';const sp=x.measureText(' ').width;const words=c_[2].map(([w,m])=>[w,m,x.measureText(w).width]);
  const lines=[];let ln=[],lw=0;for(const wd of words){if(lw+wd[2]>630&&ln.length){lines.push([ln,lw-sp]);ln=[];lw=0}ln.push(wd);lw+=wd[2]+sp}if(ln.length)lines.push([ln,lw-sp]);
  x.save();x.translate(W/2,1000-(lines.length-1)*32);x.scale(sc,sc);x.textBaseline='middle';
  lines.forEach(([l,w],i)=>{let cx=-w/2;for(const [wd,m,ww] of l){x.lineWidth=12;x.lineJoin='round';x.strokeStyle='rgba(15,20,35,.95)';x.strokeText(wd,cx,i*64);x.fillStyle=m==='y'?C.yellow:m==='r'?'#ff4d4f':m==='g'?'#5ef08f':'#fff';x.fillText(wd,cx,i*64);cx+=ww+sp}});x.restore();}

