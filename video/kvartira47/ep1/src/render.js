const {chromium}=require('playwright');
const fs=require('fs');const {spawn}=require('child_process');
(async()=>{
 const mode=process.argv[2]; const b=await chromium.launch(); const pg=await b.newPage({viewport:{width:720,height:1280}});
 pg.on('console',m=>console.log('PAGE',m.text())); pg.on('pageerror',e=>console.log('ERR',e.message));
 await pg.goto('file://'+__dirname+'/'+(process.env.PAGE||'ep1.html')+''); await pg.evaluate(()=>window.ready);
 const grab=async t=>{const d=await pg.evaluate(t=>{render(t);return document.getElementById('c').toDataURL('image/jpeg',0.92)},t);return Buffer.from(d.split(',')[1],'base64')};
 if(mode==='stills'){const ts=process.argv.slice(3).map(Number);fs.mkdirSync('stills',{recursive:true});for(const t of ts)fs.writeFileSync(`stills/s_${t.toFixed(1)}.jpg`,await grab(t));}
 else{const fps=30,dur=Number(process.argv[3]||117.5);const ff=spawn('ffmpeg',['-v','error','-y','-f','image2pipe','-framerate',String(fps),'-c:v','mjpeg','-i','-','-vf','scale=1080:1920:flags=lanczos','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',(process.env.OUT||'video_noaudio.mp4')],{stdio:['pipe','inherit','inherit']});
  for(let i=0;i<Math.round(dur*fps);i++){const buf=await grab(i/fps);if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(i%300===0)console.log('frame',i)}
  ff.stdin.end();await new Promise(r=>ff.on('close',r));}
 await b.close();})();
