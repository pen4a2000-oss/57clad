const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1920}});
pg.on('pageerror',e=>console.log('ERR',e.message));
await pg.goto('file://'+__dirname+'/cover47.html');await pg.evaluate(()=>window.ready);
const d=await pg.evaluate(()=>{drawCover();return document.getElementById('c').toDataURL('image/png')});
fs.writeFileSync('cover_k47_ep1.png',Buffer.from(d.split(',')[1],'base64'));await b.close()})();
