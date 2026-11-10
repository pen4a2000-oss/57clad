// node render.js out.mp4 [fps] [workers] — рендер видеоряда (без звука)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path'), fs = require('fs');
const out = process.argv[2] || 'video.mp4', FPS = +(process.argv[3] || 30), NW = +(process.argv[4] || 4);
async function worker(b, i, f0, f1, file) {
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => console.error('pageerror', e.message));
  await p.goto('file://' + path.resolve(__dirname, 'index.html')); await p.evaluate(() => document.fonts.ready);
  const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'medium', '-crf', '17', '-pix_fmt', 'yuv420p', file], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = f0; f < f1; f++) {
    const d = await p.evaluate(([f, fps]) => { render(f / fps, f); return document.getElementById('c').toDataURL('image/jpeg', .95); }, [f, FPS]);
    const buf = Buffer.from(d.split(',')[1], 'base64');
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if ((f - f0) % 150 === 0) console.log(`w${i}: ${f - f0}/${f1 - f0}`);
  }
  ff.stdin.end(); await new Promise(r => ff.on('close', r)); await p.close();
}
(async () => {
  const b = await chromium.launch();
  const pg = await b.newPage(); await pg.goto('file://' + path.resolve(__dirname, 'index.html'));
  const N = Math.round(await pg.evaluate(() => DURATION) * FPS); await pg.close();
  const tmp = path.resolve(path.dirname(out), '.parts'); fs.mkdirSync(tmp, { recursive: true });
  const per = Math.ceil(N / NW), files = [];
  await Promise.all(Array.from({ length: NW }, (_, i) => { const f = path.join(tmp, `p${i}.mp4`); files.push(f); return worker(b, i, i * per, Math.min(N, (i + 1) * per), f); }));
  await b.close();
  fs.writeFileSync(path.join(tmp, 'list.txt'), files.map(f => `file '${f}'`).join('\n'));
  await new Promise(r => spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt'), '-c', 'copy', out], { stdio: 'inherit' }).on('close', r));
  fs.rmSync(tmp, { recursive: true });
  console.log('done', out, N, 'frames');
})();
