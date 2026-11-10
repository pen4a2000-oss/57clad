// node preview.js out.png t1 t2 ... -> контактный лист кадров
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const [out, ...ts] = process.argv.slice(2);
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await p.goto('file://' + path.resolve(__dirname, 'index.html')); await p.evaluate(() => document.fonts.ready);
  const imgs = [];
  for (const t of ts) { await p.evaluate(t => render(+t), t); imgs.push(await p.evaluate(() => document.getElementById('c').toDataURL('image/jpeg', .8))); }
  const cols = Math.min(imgs.length, 6), rows = Math.ceil(imgs.length / cols);
  await p.setContent(`<body style="margin:0;background:#222;display:grid;grid-template-columns:repeat(${cols},270px);gap:4px">${imgs.map((d, i) => `<div style="position:relative"><img src="${d}" width=270><span style="position:absolute;left:4px;top:4px;color:#ff0;font:14px sans-serif;background:#000a">${ts[i]}</span></div>`).join('')}</body>`);
  await p.setViewportSize({ width: cols * 274, height: rows * 484 });
  await p.screenshot({ path: out, fullPage: true });
  if (errs.length) console.log('ERRORS:', errs.slice(0, 5));
  await b.close();
})();
