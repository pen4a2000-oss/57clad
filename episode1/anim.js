// «Ты уверен, что она спит?» — серия 1
// Процедурная 2D-анимация (Canvas). render(t) рисует кадр для времени t (сек).
'use strict';
const W = 1080, H = 1920, TAU = Math.PI * 2, PI = Math.PI;
const cv = document.getElementById('c');
const ctx = cv.getContext('2d');
const L = document.createElement('canvas'); L.width = W / 2; L.height = H / 2;
const lx = L.getContext('2d');
const TMP = document.createElement('canvas'); TMP.width = W; TMP.height = H;
const tx = TMP.getContext('2d');
const FONT = 'Inter, "DejaVu Sans", sans-serif';

// ---------- утилиты ----------
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ss = (a, b, t) => { t = clamp((t - a) / (b - a)); return t * t * (3 - 2 * t); };
const eio = t => (t = clamp(t), t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const eo = t => 1 - Math.pow(1 - clamp(t), 3);
function key(t, pts, ease = u => u * u * (3 - 2 * u)) {
  if (t <= pts[0][0]) return pts[0][1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [t0, v0] = pts[i], [t1, v1] = pts[i + 1];
    if (t <= t1) return v0 + (v1 - v0) * ease((t - t0) / (t1 - t0));
  }
  return pts[pts.length - 1][1];
}
function hh(t, a = 1, s = 0) { // «ручная камера»
  return [a * (Math.sin(t * 1.1 + s) * 6 + Math.sin(t * 2.7 + 1 + s) * 3),
          a * (Math.sin(t * 0.9 + 2 + s) * 6 + Math.sin(t * 2.3 + s) * 3),
          a * Math.sin(t * 0.7 + s) * 0.004];
}
function hex(h, a = 1) {
  const n = parseInt(h.slice(1), 16);
  return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`;
}
function rr(c, x, y, w, h, r) {
  r = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r);
  c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
function circ(c, x, y, r) { c.beginPath(); c.arc(x, y, r, 0, TAU); }
function ell(c, x, y, rx, ry, rot = 0) { c.beginPath(); c.ellipse(x, y, Math.abs(rx), Math.abs(ry), rot, 0, TAU); }
function fill(c, col) { c.fillStyle = col; c.fill(); }

// ---------- палитра ----------
const P = {
  youSkin: '#dba07e', youSkinSh: '#b97c5f', youHair: '#241a16', youShirt: '#43567f', youShirtSh: '#33425f', youPants: '#2b303d',
  herSkin: '#f3c6a6', herSkinSh: '#d89f83', herHair: '#7d2f22', herHairSh: '#5b1f17', herHairHi: '#9c4434',
  herShirt: '#cbb7e8', herShirtSh: '#a690c9', herShorts: '#3b3449',
  eyeW: '#f4f1ee', youIris: '#4b2f22', herIris: '#2f4a3e',
  sheet: '#cdd6ec', sheetSh: '#a3aed0', blanket: '#5d6ca0', blanketSh: '#47547f', blanketIn: '#8e9ac4',
  pillow: '#e6eaf5', pillowSh: '#bcc4dc',
  wallN: '#3d4876', wood: '#70513f', woodSh: '#523b2e', floor: '#5c4a50', floorSh: '#4a3b41',
  phone: '#14151b', red: '#ff3346', warm: '#ffb45e', moon: '#8ea6ff', glow: '#9cc8ff'
};

// ---------- камера / свет ----------
let M = new DOMMatrix();
function cam(x, y, z = 1, r = 0, sh = [0, 0, 0]) {
  M = new DOMMatrix().translate(W / 2 + sh[0], H / 2 + sh[1]).scale(z).rotate((r + sh[2]) * 180 / PI).translate(-x, -y);
  ctx.setTransform(M);
}
function camId() { M = new DOMMatrix(); ctx.setTransform(M); }
function light(amb, fn) {
  lx.setTransform(1, 0, 0, 1, 0, 0); lx.globalCompositeOperation = 'source-over'; lx.filter = 'none';
  lx.fillStyle = amb; lx.fillRect(0, 0, W / 2, H / 2);
  lx.setTransform(new DOMMatrix().scale(.5).multiply(M));
  lx.globalCompositeOperation = 'lighter';
  if (fn) fn(lx);
  lx.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'multiply';
  ctx.drawImage(L, 0, 0, W, H); ctx.restore(); ctx.setTransform(M);
}
function glow(c, x, y, r, col, a = 1) {
  if (a <= 0.001 || r <= 0) return;
  const g = c.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, hex(col, a)); g.addColorStop(.45, hex(col, a * .45)); g.addColorStop(1, hex(col, 0));
  c.fillStyle = g; c.fillRect(x - r, y - r, r * 2, r * 2);
}
function stripes(c, x, y, ang, n, w, gap, len, col, a) { // свет сквозь жалюзи
  c.save(); c.translate(x, y); c.rotate(ang); c.filter = 'blur(6px)';
  for (let i = 0; i < n; i++) {
    const g = c.createLinearGradient(0, 0, len, 0);
    g.addColorStop(0, hex(col, 0)); g.addColorStop(.25, hex(col, a)); g.addColorStop(.75, hex(col, a)); g.addColorStop(1, hex(col, 0));
    c.fillStyle = g; c.fillRect(0, i * (w + gap), len, w);
  }
  c.filter = 'none'; c.restore();
}
function bloom(c, fn, blur, col) { c.save(); c.shadowColor = col; c.shadowBlur = blur; fn(); c.restore(); }

// ---------- глобальные эффекты ----------
let FX;
const GR = [];
(function () {
  for (let k = 0; k < 4; k++) {
    const g = document.createElement('canvas'); g.width = 540; g.height = 960;
    const gc = g.getContext('2d'); const id = gc.createImageData(540, 960);
    let s = 1234 + k * 999;
    const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < id.data.length; i += 4) {
      const v = rnd() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255;
    }
    gc.putImageData(id, 0, 0); GR.push(g);
  }
})();
function lids(o, curve = 1) { // веки (POV): o=1 открыто, 0 закрыто
  if (o >= 0.999) return;
  const ext = H / 2 + 260;
  const yU = H / 2 - o * ext, yD = H / 2 + o * ext;
  const bulge = 260 * curve * (0.35 + o);
  ctx.save(); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.fillStyle = '#000';
  ctx.shadowColor = '#000'; ctx.shadowBlur = 90;
  ctx.beginPath(); ctx.moveTo(-200, -400); ctx.lineTo(W + 200, -400); ctx.lineTo(W + 200, yU);
  ctx.quadraticCurveTo(W / 2, yU + bulge, -200, yU); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-200, H + 400); ctx.lineTo(W + 200, H + 400); ctx.lineTo(W + 200, yD);
  ctx.quadraticCurveTo(W / 2, yD - bulge * .6, -200, yD); ctx.closePath(); ctx.fill();
  if (o < 0.02) ctx.fillRect(0, 0, W, H);
  ctx.restore();
}
function post(frame) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.filter = 'none';
  if (FX.blur > 0.3) {
    tx.setTransform(1, 0, 0, 1, 0, 0); tx.filter = 'none'; tx.clearRect(0, 0, W, H); tx.drawImage(cv, 0, 0);
    ctx.filter = `blur(${FX.blur}px)`; ctx.drawImage(TMP, 0, 0); ctx.filter = 'none';
  }
  if (FX.desat > 0) {
    ctx.globalCompositeOperation = 'saturation'; ctx.fillStyle = `rgba(128,128,128,${FX.desat})`; ctx.fillRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'source-over';
  }
  if (FX.tint) { ctx.globalCompositeOperation = 'soft-light'; ctx.fillStyle = FX.tint; ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; }
  lids(FX.lids, FX.lidCurve);
  // виньетка
  const g = ctx.createRadialGradient(W / 2, H / 2, H * .22, W / 2, H / 2, H * .62);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${FX.vig})`);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  // зерно
  ctx.globalAlpha = 0.07; ctx.globalCompositeOperation = 'overlay';
  ctx.drawImage(GR[frame % 4], 0, 0, W, H);
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  if (FX.flash > 0) { ctx.fillStyle = `rgba(200,220,255,${FX.flash})`; ctx.fillRect(0, 0, W, H); }
  if (FX.black > 0) { ctx.fillStyle = `rgba(0,0,0,${FX.black})`; ctx.fillRect(0, 0, W, H); }
}

// ---------- персонажи ----------
function facePath(c, nx = 1) {
  c.beginPath(); c.moveTo(0, -190);
  c.bezierCurveTo(100 * nx, -190, 152 * nx, -115, 152 * nx, -15);
  c.bezierCurveTo(152 * nx, 95, 88 * nx, 185, 0, 194);
  c.bezierCurveTo(-88 * nx, 185, -152 * nx, 95, -152 * nx, -15);
  c.bezierCurveTo(-152 * nx, -115, -100 * nx, -190, 0, -190); c.closePath();
}
function eye(c, x, y, open, lkx, lky, iris, skin, her, mirror) {
  const rx = 40, ry = 25;
  c.save(); c.translate(x, y); if (mirror) c.scale(-1, 1);
  const cU = lerp(10, -2 * ry - 6, open), cL = lerp(10, 2 * ry + 6, Math.min(1, open * 1.5));
  ell(c, 0, 0, rx, ry); c.save(); c.clip();
  c.fillStyle = P.eyeW; c.fillRect(-rx, -ry, rx * 2, ry * 2);
  const ix = (mirror ? -lkx : lkx) * 15, iy = lky * 8;
  circ(c, ix, iy, 19); fill(c, iris); circ(c, ix, iy, 9.5); fill(c, '#0c0c10');
  circ(c, ix - 6, iy - 7, 5); fill(c, 'rgba(255,255,255,.95)');
  c.fillStyle = 'rgba(40,30,60,.18)'; c.fillRect(-rx, -ry, rx * 2, 12);
  c.fillStyle = skin;
  c.beginPath(); c.moveTo(-rx - 6, -ry - 40); c.lineTo(rx + 6, -ry - 40); c.lineTo(rx + 6, 2);
  c.quadraticCurveTo(0, cU, -rx - 6, 2); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(-rx - 6, ry + 40); c.lineTo(rx + 6, ry + 40); c.lineTo(rx + 6, 2);
  c.quadraticCurveTo(0, cL, -rx - 6, 2); c.closePath(); c.fill();
  c.restore();
  c.strokeStyle = '#1c1216'; c.lineWidth = her ? 8 : 6.5; c.lineCap = 'round';
  c.beginPath(); c.moveTo(-rx - 3, 2); c.quadraticCurveTo(0, cU, rx + 3, 2); c.stroke();
  c.restore();
}
function head(c, who, o = {}) {
  const her = who === 'her';
  const sk = her ? P.herSkin : P.youSkin, skS = her ? P.herSkinSh : P.youSkinSh;
  const e = o.eyes ?? 1, lk = o.lx ?? 0, lky = o.ly ?? 0, sm = o.smile ?? 0, mo = o.mouth ?? 0, br = o.brow ?? 0;
  c.save();
  if (her) { // волосы сзади
    const hl = o.hairLen ?? 360;
    c.beginPath(); c.moveTo(-178, -40);
    c.bezierCurveTo(-205, -205, -80, -258, 10, -253); c.bezierCurveTo(132, -250, 208, -172, 192, -30);
    c.bezierCurveTo(204, 120, 220, hl - 80, 196, hl); c.quadraticCurveTo(0, hl + 40, -196, hl);
    c.bezierCurveTo(-222, hl - 80, -204, 120, -178, -40); fill(c, P.herHairSh);
  }
  // шея
  if (o.neck !== false) { rr(c, -50, 120, 100, 150, 30); fill(c, skS); }
  // уши
  ell(c, -150, 12, 22, 38); fill(c, skS); ell(c, 150, 12, 22, 38); fill(c, skS);
  facePath(c, her ? .96 : 1); fill(c, sk);
  // мягкая тень по форме
  c.save(); facePath(c, her ? .96 : 1); c.clip();
  const sa = o.shade ?? 0.6;
  c.fillStyle = hex(skS, .55);
  c.beginPath(); c.rect(-300, -300, 600, 600); c.ellipse(Math.cos(sa) * -60, Math.sin(sa) * -40 - 10, 165, 200, 0, 0, TAU, true); c.fill('evenodd');
  if (!her) { ell(c, 0, 165, 120, 70); fill(c, 'rgba(60,40,40,.16)'); }
  if (her && o.blush !== 0) { ell(c, -88, 72, 32, 16); fill(c, 'rgba(230,110,110,.22)'); ell(c, 88, 72, 32, 16); fill(c, 'rgba(230,110,110,.22)'); }
  c.restore();
  // глаза
  const iris = her ? P.herIris : P.youIris;
  eye(c, -62, 14, e, lk, lky, iris, sk, her, false);
  eye(c, 62, 14, e, lk, lky, iris, sk, her, true);
  // брови
  c.strokeStyle = her ? '#4a1c16' : '#1d1411'; c.lineWidth = her ? 11 : 15; c.lineCap = 'round';
  for (const s of [-1, 1]) {
    c.beginPath(); c.moveTo(s * 25, -40 - br * 14); c.quadraticCurveTo(s * 62, -58 - br * 4, s * 98, -40 + br * 4); c.stroke();
  }
  // нос
  c.strokeStyle = skS; c.lineWidth = 6;
  c.beginPath(); c.moveTo(-4, 45); c.quadraticCurveTo(-16, 82, 4, 84); c.stroke();
  // рот
  const my = 122, w = her ? 40 : 44, cy = my - sm * 12, mid = my + sm * 11;
  if (mo > 0.04) {
    c.beginPath(); c.moveTo(-w * .8, cy); c.quadraticCurveTo(0, mid - 6 - mo * 4, w * .8, cy);
    c.quadraticCurveTo(0, mid + mo * 36, -w * .8, cy); fill(c, '#5a2230');
  }
  c.strokeStyle = her ? '#b5545c' : '#7c4239'; c.lineWidth = her ? 7 : 7;
  c.beginPath(); c.moveTo(-w, cy); c.quadraticCurveTo(0, mid, w, cy); c.stroke();
  // волосы спереди
  if (her) {
    c.beginPath(); c.moveTo(-168, 70);
    c.bezierCurveTo(-190, -150, -80, -250, 15, -246); c.bezierCurveTo(128, -242, 190, -162, 174, 20);
    c.bezierCurveTo(180, 130, 172, 220, 156, 280); c.bezierCurveTo(138, 160, 128, 40, 116, -42);
    c.bezierCurveTo(88, -98, 20, -118, -62, -106); c.bezierCurveTo(-112, -60, -134, 0, -142, 90);
    c.closePath(); fill(c, P.herHair);
    c.strokeStyle = P.herHairHi; c.lineWidth = 10;
    c.beginPath(); c.moveTo(-90, -200); c.quadraticCurveTo(10, -235, 100, -190); c.stroke();
  } else {
    c.beginPath(); c.moveTo(-160, 10);
    c.bezierCurveTo(-178, -142, -92, -240, 10, -238); c.bezierCurveTo(122, -235, 180, -152, 160, 5);
    c.bezierCurveTo(152, -60, 138, -96, 112, -112); c.bezierCurveTo(62, -96, 12, -142, -30, -120);
    c.bezierCurveTo(-72, -102, -126, -112, -142, -72); c.closePath(); fill(c, P.youHair);
    c.beginPath(); c.moveTo(-40, -232); c.lineTo(-10, -262); c.lineTo(20, -236); c.lineTo(55, -258); c.lineTo(70, -230); fill(c, P.youHair);
  }
  c.restore();
}
function bust(c, who, o = {}) { // плечи/торс под головой (локальные коорд. головы)
  const her = who === 'her';
  const sh = her ? P.herShirt : P.youShirt, shS = her ? P.herShirtSh : P.youShirtSh;
  const wd = o.w ?? 1;
  c.beginPath(); c.moveTo(-70, 230);
  c.bezierCurveTo(-200 * wd, 240, -270 * wd, 290, -285 * wd, 420); c.lineTo(-300 * wd, 900); c.lineTo(300 * wd, 900);
  c.lineTo(285 * wd, 420); c.bezierCurveTo(270 * wd, 290, 200 * wd, 240, 70, 230); c.closePath(); fill(c, sh);
  c.beginPath(); c.moveTo(-200 * wd, 330); c.quadraticCurveTo(-230 * wd, 600, -215 * wd, 900); c.lineTo(-300 * wd, 900); c.lineTo(-285 * wd, 420); c.closePath(); fill(c, shS);
  // ворот
  if (her) { c.beginPath(); c.moveTo(-95, 236); c.quadraticCurveTo(0, 330, 95, 236); fill(c, P.herSkinSh); }
  else { c.strokeStyle = shS; c.lineWidth = 16; c.beginPath(); c.moveTo(-70, 238); c.quadraticCurveTo(0, 290, 70, 238); c.stroke(); }
}
function hand(c, x, y, rot, s, skin, open = 0) {
  c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
  rr(c, -38, -30, 76, 66, 30); fill(c, skin);
  for (let i = 0; i < 4; i++) { rr(c, -36 + i * 19, 20, 17, 40 + (i === 1 || i === 2 ? 8 : 0) - open * 10, 9); fill(c, skin); }
  c.save(); c.translate(-36, -6); c.rotate(-0.9 - open * .4); rr(c, -10, -6, 22, 50, 11); fill(c, skin); c.restore();
  c.strokeStyle = 'rgba(0,0,0,.12)'; c.lineWidth = 3;
  for (let i = 1; i < 4; i++) { c.beginPath(); c.moveTo(-36 + i * 19 - 1, 24); c.lineTo(-36 + i * 19 - 1, 50); c.stroke(); }
  c.restore();
}
function limb(c, pts, w, col) {
  c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.lineJoin = 'round';
  c.beginPath(); c.moveTo(pts[0][0], pts[0][1]);
  if (pts.length === 3) c.quadraticCurveTo(pts[1][0], pts[1][1], pts[2][0], pts[2][1]);
  else for (let i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
  c.stroke();
}
// фигура со спины (стопы в 0,0, рост ~1000)
function personBack(c, who, x, y, s, ph, o = {}) {
  const her = who === 'her';
  c.save(); c.translate(x, y); c.scale(s, s);
  const sil = o.sil; const col = k => sil ? sil : k;
  const skin = col(her ? P.herSkin : P.youSkin), skS = col(her ? P.herSkinSh : P.youSkinSh);
  const shirt = col(her ? P.herShirt : P.youShirt), shS = col(her ? P.herShirtSh : P.youShirtSh);
  const pants = col(her ? P.herShorts : P.youPants);
  const legC = her ? skin : pants;
  for (const i of [0, 1]) {
    const lift = Math.max(0, Math.sin(ph + i * PI)) * 45;
    const lx0 = i ? 34 : -34;
    limb(c, [[lx0, -470], [lx0 * 1.05, -lift - 20]], 56, i ? legC : (her ? skS : pants));
    ell(c, lx0 * 1.05, -lift - 10, 34, 18); fill(c, col(her ? P.herSkinSh : '#1e1f26'));
  }
  rr(c, -86, -560, 172, 150, 40); fill(c, pants);
  if (her) { rr(c, -112, -840, 224, 400, 70); fill(c, shirt); } // длинная футболка
  else { rr(c, -120, -840, 240, 330, 60); fill(c, shirt); }
  const sw = Math.sin(ph) * (o.walk ? 18 : 0);
  limb(c, [[-112, -790], [-132 + sw, -640], [-122 + sw, -500]], 52, shS);
  limb(c, [[112, -790], [132 - sw, -640], [o.phone ? 70 : 122 - sw, o.phone ? -560 : -500]], 52, shS);
  circ(c, -122 + sw, -490, 26); fill(c, skin);
  circ(c, o.phone ? 70 : 122 - sw, o.phone ? -555 : -490, 26); fill(c, skin);
  rr(c, -34, -900, 68, 80, 20); fill(c, skS);
  if (her) {
    ell(c, 0, -960, 98, 112); fill(c, col(P.herHair));
    c.beginPath(); c.moveTo(-98, -960); c.bezierCurveTo(-120, -820, -110, -720, -80, -650); c.lineTo(80, -650);
    c.bezierCurveTo(110, -720, 120, -820, 98, -960); fill(c, col(P.herHair));
    if (!sil) { c.strokeStyle = P.herHairHi; c.lineWidth = 9; c.beginPath(); c.moveTo(-40, -1040); c.quadraticCurveTo(10, -1065, 50, -1035); c.stroke(); }
  } else {
    ell(c, 0, -960, 92, 104); fill(c, col(P.youHair));
  }
  c.restore();
}
// сидящий (вид спереди), бёдра в 0,0
function sitting(c, who, x, y, s, o = {}) {
  const her = who === 'her';
  c.save(); c.translate(x, y); c.scale(s, s);
  const skin = her ? P.herSkin : P.youSkin;
  const shirt = her ? P.herShirt : P.youShirt, shS = her ? P.herShirtSh : P.youShirtSh;
  const legC = her ? P.herSkin : P.youPants, legS = her ? P.herSkinSh : '#232733';
  for (const sx of [-1, 1]) {
    rr(c, sx * 55 - 45, -10, 90, 110, 40); fill(c, her ? P.herShorts : P.youPants);
    rr(c, sx * 58 - 34, 70, 68, 250, 30); fill(c, sx < 0 ? legS : legC);
    ell(c, sx * 62, 330, 52, 24); fill(c, her ? P.herSkinSh : '#1e1f26');
  }
  c.beginPath(); c.moveTo(-115, 30); c.bezierCurveTo(-130, -120, -150, -250, -135, -330);
  c.quadraticCurveTo(0, -375, 135, -330); c.bezierCurveTo(150, -250, 130, -120, 115, 30); c.closePath(); fill(c, shirt);
  const la = o.lean ?? 0;
  limb(c, [[-128, -300], [-158, -150], [-70, 10]], 54, shS);
  limb(c, [[128, -300], [158, -150], [70, 10]], 54, shS);
  circ(c, -66, 14, 26); fill(c, skin); circ(c, 66, 14, 26); fill(c, skin);
  c.save(); c.translate(la * 40, -400); c.rotate(o.headRot ?? 0); c.scale(.46, .46);
  head(c, who, Object.assign({ hairLen: 300 }, o.face || {}));
  c.restore();
  c.restore();
}

// ---------- телефон ----------
const NOW = 'вторник, 11 ноября';
function phone(c, x, y, w, rot, ui, pass) {
  const h = w * 2.06, u = w / 100;
  c.save(); c.translate(x, y); c.rotate(rot);
  if (ui.flip !== undefined) c.scale(Math.max(0.02, Math.abs(Math.cos(ui.flip))), 1);
  const back = ui.flip !== undefined && Math.cos(ui.flip) < 0;
  if (pass === 'base') {
    rr(c, -w / 2, -h / 2, w, h, 15 * u); fill(c, P.phone);
    if (back || ui.faceDown) { rr(c, -w / 2 + 10 * u, -h / 2 + 10 * u, 34 * u, 38 * u, 9 * u); fill(c, '#262833');
      circ(c, -w / 2 + 20 * u, -h / 2 + 20 * u, 6 * u); fill(c, '#0b0b10'); circ(c, -w / 2 + 34 * u, -h / 2 + 36 * u, 6 * u); fill(c, '#0b0b10'); }
    c.restore(); return;
  }
  const on = ui.on ?? 0;
  if (back || ui.faceDown || on <= 0.003) { c.restore(); return; }
  c.save(); rr(c, -w / 2 + 3.5 * u, -h / 2 + 3.5 * u, w - 7 * u, h - 7 * u, 12 * u); c.clip();
  c.globalAlpha = on;
  const g = c.createLinearGradient(0, -h / 2, 0, h / 2);
  g.addColorStop(0, '#26305f'); g.addColorStop(.55, '#3a2a62'); g.addColorStop(1, '#151a33');
  c.fillStyle = g; c.fillRect(-w / 2, -h / 2, w, h);
  c.fillStyle = 'rgba(130,90,200,.35)'; ell(c, w * .25, h * .3, w * .5, w * .4); c.fill();
  c.fillStyle = '#000'; rr(c, -14 * u, -h / 2 + 7 * u, 28 * u, 8 * u, 4 * u); c.fill();
  c.fillStyle = 'rgba(255,255,255,.85)'; c.textAlign = 'center';
  c.font = `500 ${5.6 * u}px ${FONT}`; c.fillText(NOW, 0, -h / 2 + 34 * u);
  c.font = `600 ${30 * u}px ${FONT}`; c.fillText(ui.time || '2:17', 0, -h / 2 + 64 * u);
  if (ui.notif) {
    const n = ui.notif, a = clamp(n.a ?? 1), dy = (1 - eo(n.slide ?? 1)) * -30 * u;
    c.save(); c.globalAlpha = on * a; c.translate(0, -h / 2 + 82 * u + dy);
    const ch = (n.h ?? 30) * u;
    rr(c, -45 * u, 0, 90 * u, ch, 7 * u); fill(c, 'rgba(235,238,255,.2)');
    rr(c, -41 * u, 4 * u, 10 * u, 10 * u, 2.6 * u); fill(c, n.icon || '#3ccf6e');
    c.fillStyle = '#fff'; ell(c, -36 * u, 8.6 * u, 3.2 * u, 2.6 * u); c.fill();
    c.textAlign = 'left'; c.fillStyle = '#fff'; c.font = `700 ${5 * u}px ${FONT}`;
    c.fillText(n.title, -28 * u, 11 * u);
    c.textAlign = 'right'; c.fillStyle = 'rgba(255,255,255,.6)'; c.font = `500 ${4.2 * u}px ${FONT}`; c.fillText('сейчас', 41 * u, 11 * u);
    c.textAlign = 'left'; c.fillStyle = 'rgba(255,255,255,.95)'; c.font = `500 ${(n.fs ?? 5) * u}px ${FONT}`;
    (n.lines || []).forEach((ln, i) => {
      if (n.reveal !== undefined) { // «дочитывание» глазами
        const full = c.measureText(ln).width; const rx = -41 * u + full * n.reveal;
        c.save(); c.filter = `blur(${2.2 * u}px)`; c.globalAlpha = on * a * .8; c.fillText(ln, -41 * u, (21 + i * 7) * u); c.restore();
        c.save(); c.beginPath(); c.rect(-50 * u, 0, rx + 50 * u, ch); c.clip(); c.fillText(ln, -41 * u, (21 + i * 7) * u); c.restore();
      } else c.fillText(ln, -41 * u, (21 + i * 7) * u);
    });
    c.restore();
  }
  c.restore();
  c.restore();
}

// ---------- спальня (вид сверху) ----------
function bedTop(c, s, pass) {
  const herIn = s.herIn ?? 1, back = s.back ?? 0;
  if (pass === 'base') {
    c.fillStyle = P.floor; c.fillRect(-600, -300, 2300, 2700);
    c.strokeStyle = P.floorSh; c.lineWidth = 4;
    for (let x = -600; x < 1700; x += 110) { c.beginPath(); c.moveTo(x, 380); c.lineTo(x, 2400); c.stroke(); }
    c.fillStyle = '#262c4c'; c.fillRect(-600, -300, 2300, 690);
    rr(c, 120, 1460, 840, 400, 30); fill(c, '#4b4566');
    // тумбочки
    for (const nx of [10, 915]) { rr(c, nx, 420, 155, 190, 12); fill(c, P.wood); rr(c, nx + 8, 428, 139, 174, 9); fill(c, '#7a5a47'); }
    circ(c, 88, 495, 48); fill(c, '#d8cdb8'); circ(c, 88, 495, 14); fill(c, '#a89c86');
    circ(c, 60, 570, 17); fill(c, 'rgba(180,200,230,.7)');
    rr(c, 945, 440, 95, 44, 8); fill(c, '#111219');
    // кровать
    rr(c, 165, 400, 750, 1150, 22); fill(c, P.woodSh);
    rr(c, 165, 400, 750, 62, 14); fill(c, P.wood);
    rr(c, 182, 462, 716, 1072, 14); fill(c, P.sheet);
    // подушки
    for (const px of [365, 715]) { rr(c, px - 140, 478, 280, 150, 55); fill(c, P.pillow);
      c.strokeStyle = P.pillowSh; c.lineWidth = 6; c.beginPath(); c.moveTo(px - 110, 600); c.quadraticCurveTo(px, 615, px + 110, 600); c.stroke(); }
    if (herIn < .5) { ell(c, 715, 555, 80, 40); fill(c, 'rgba(150,160,200,.35)'); }
    // плечи
    const yx = s.youX ?? 365;
    ell(c, yx, 650, 125, 55); fill(c, P.youShirt);
    if (herIn > .5) { ell(c, 715, 650, 118, 52); fill(c, P.herShirt); }
    // одеяло
    const bt = 650, bh = bt + back * 420;
    c.beginPath(); c.moveTo(168, bt + 10);
    c.bezierCurveTo(300, bt - 18, 420, bt + 20, 540, bt);
    c.bezierCurveTo(620, bh - 10, 760, bh + 20, 912, bh + (back ? -back * 60 : 0));
    c.lineTo(918, 1545); c.lineTo(162, 1545); c.closePath(); fill(c, P.blanket);
    if (back > 0) { // откинутый край
      c.beginPath(); c.moveTo(560, bt + 5); c.bezierCurveTo(640, bh - 30 * back, 780, bh - 80 * back, 912, bh - back * 60);
      c.lineTo(912, bh + 70 * back); c.bezierCurveTo(780, bh + 60 * back, 640, bh + 40 * back, 560, bt + 30); fill(c, P.blanketIn);
    }
    ell(c, yx, 1000, 150, 380); fill(c, hex('#6b7bb0', .7));
    if (herIn > .5) { ell(c, 715, 1000, 140, 370); fill(c, hex('#6b7bb0', .7)); }
    c.strokeStyle = P.blanketSh; c.lineWidth = 8;
    for (const [a, b] of [[300, 1250], [520, 1350], [800, 1220]]) { c.beginPath(); c.moveTo(a, b); c.quadraticCurveTo(a + 60, b + 40, a + 30, b + 140); c.stroke(); }
    // головы
    c.save(); c.translate(yx, 548); c.rotate(s.youRot ?? 0); c.scale(.3, .3);
    head(c, 'you', { eyes: s.youEyes ?? 0, lx: s.youLx ?? 0, ly: s.youLy ?? 0, neck: false });
    c.restore();
    if (herIn > .5) {
      c.save(); c.translate(715, 548); c.rotate(s.herRot ?? 0); c.scale(.3, .3);
      head(c, 'her', { eyes: s.herEyes ?? 0, lx: s.herLx ?? 0, ly: s.herLy ?? 0, neck: false, hairLen: 300 });
      c.restore();
    }
    if (s.arm) { // твоя рука к телефону
      const a = s.arm; const ex = lerp(760, 958, a), ey = lerp(900, 590, a);
      limb(c, [[yx + 80, 1200], [lerp(700, 900, a), lerp(1000, 800, a)], [ex, ey]], 40, P.youShirt);
      hand(c, ex, ey - 22, PI - 0.2, .5, P.youSkin, s.armOpen ?? .3);
    }
    phone(c, 985, 545, 52, -0.2, s.ui || {}, 'base');
  } else {
    phone(c, 985, 545, 52, -0.2, s.ui || {}, 'emis');
    c.save(); c.textAlign = 'center'; c.font = `700 30px "JetBrains Mono", monospace`;
    bloom(c, () => { c.fillStyle = P.red; c.fillText(s.clock || '02:17', 992, 473); }, 18, P.red);
    c.restore();
  }
}
function bedLights(l, s, t) {
  stripes(l, -80, 640, -0.32, 6, 46, 40, 1500, P.moon, .26);
  const on = s.ui?.on ?? 0;
  glow(l, 985, 545, 520, P.glow, .75 * on);
  glow(l, 985, 545, 200, '#cfe4ff', .5 * on);
  glow(l, 992, 462, 160, P.red, .35);
}

// ---------- кровать на уровне подушки ----------
function pillowView(c, o, pass) {
  if (pass === 'base') {
    c.fillStyle = P.wallN; c.fillRect(-500, -500, 2100, 1100);
    c.fillStyle = P.woodSh; c.fillRect(-500, 330, 2100, 190);
    c.fillStyle = P.sheet; c.fillRect(-500, 1300, 2100, 1300);
    rr(c, -40, 470, 1160, 920, 200); fill(c, P.pillow);
    c.fillStyle = P.pillowSh;
    c.beginPath(); c.moveTo(-40, 1250); c.quadraticCurveTo(540, 1420, 1120, 1250); c.lineTo(1120, 1400); c.lineTo(-40, 1400); c.fill();
    if (o.dent) { ell(c, 520, 900, 300, 150, -0.1); fill(c, hex('#aab3d0', .5)); ell(c, 540, 890, 200, 90, -0.1); fill(c, hex('#9aa4c6', .4)); }
    if (o.emptyBack) { // откинутое одеяло
      c.beginPath(); c.moveTo(600, 1400); c.bezierCurveTo(800, 1330, 1000, 1360, 1400, 1300); c.lineTo(1400, 2100); c.lineTo(400, 2100); c.closePath(); fill(c, P.blanket);
      c.beginPath(); c.moveTo(600, 1400); c.bezierCurveTo(780, 1350, 1000, 1380, 1400, 1330); c.lineTo(1400, 1420); c.bezierCurveTo(1000, 1470, 800, 1450, 640, 1480); fill(c, P.blanketIn);
      c.strokeStyle = P.sheetSh; c.lineWidth = 7; for (const [a, b] of [[-100, 1550], [80, 1700], [200, 1500]]) { c.beginPath(); c.moveTo(a, b); c.quadraticCurveTo(a + 140, b + 30, a + 260, b - 20); c.stroke(); }
    }
    if (o.behind) { // она позади (не в фокусе)
      c.save(); c.filter = 'blur(14px)'; c.translate(o.behind.x, o.behind.y); c.rotate(-PI / 2 + .15); c.scale(.62, .62);
      head(c, 'her', { eyes: o.behind.eyes ?? 1, lx: 0.3, neck: false, hairLen: 340 }); c.restore(); c.filter = 'none';
    }
    if (o.who) {
      const you = o.who === 'you';
      c.save(); c.translate(o.x ?? 540, o.y ?? 900); c.rotate((you ? PI / 2 : -PI / 2) + (o.tilt ?? 0)); c.scale(o.s ?? 1.5, o.s ?? 1.5);
      bust(c, o.who); head(c, o.who, o.face || {});
      // одеяло на плече
      c.beginPath(); c.moveTo(-700, 470); c.bezierCurveTo(-300, 430, -100, 520, 100, 480); c.bezierCurveTo(300, 440, 500, 500, 700, 470);
      c.lineTo(700, 1400); c.lineTo(-700, 1400); c.closePath(); fill(c, P.blanket);
      c.strokeStyle = P.blanketSh; c.lineWidth = 12; c.beginPath(); c.moveTo(-500, 600); c.quadraticCurveTo(-300, 650, -100, 610); c.stroke();
      c.restore();
    }
    if (o.arm) { // её рука обнимает
      const a = o.arm;
      const hx = lerp(560, 200, a), hy = lerp(120, 770, a);
      c.save(); c.filter = `blur(${o.armBlur ?? 0}px)`;
      const pts = [[lerp(640, 470, a), -200], [lerp(560, 150, a), lerp(60, 330, a)], [hx, hy - 70]];
      limb(c, pts, 135, P.herShirt);
      limb(c, pts.map(p => [p[0] - 30, p[1]]), 40, hex(P.herShirtSh, .6));
      hand(c, hx, hy, 0.2 + (1 - a) * .6, 1.5, P.herSkin, .25);
      c.restore();
    }
  } else {
    if (o.behind && o.behind.glint) { // блики её открытых глаз
      const g = o.behind.glint;
      c.save(); bloom(c, () => { circ(c, o.behind.x - 20, o.behind.y - 40, 5); fill(c, hex('#dfe9ff', g)); circ(c, o.behind.x - 25, o.behind.y + 42, 5); fill(c, hex('#dfe9ff', g)); }, 14, '#bcd2ff'); c.restore();
    }
    if (o.bokeh) { c.save(); c.filter = 'blur(30px)'; rr(c, o.bokeh.x - 70, o.bokeh.y - 130, 140, 260, 30); fill(c, hex('#bcdcff', o.bokeh.a)); c.restore(); c.filter = 'none'; }
  }
}

// ---------- коридор / дверь ванной ----------
function hallway(c, o, pass) {
  const d = o.door ?? 0, gap = o.gap ?? 0;
  if (pass === 'base') {
    const wallC = o.warm ? '#8a7aa0' : '#4a5584', sideC = o.warm ? '#6e5f86' : '#384270', floorC = o.warm ? '#7a5e58' : '#4f4450';
    c.fillStyle = sideC; c.fillRect(-300, -300, 1700, 2600);
    c.fillStyle = '#2a3058'; c.beginPath(); c.moveTo(-300, -300); c.lineTo(1400, -300); c.lineTo(780, 380); c.lineTo(300, 380); c.fill();
    c.fillStyle = floorC; c.beginPath(); c.moveTo(300, 1260); c.lineTo(780, 1260); c.lineTo(1500, 2400); c.lineTo(-400, 2400); c.fill();
    c.strokeStyle = 'rgba(0,0,0,.18)'; c.lineWidth = 4;
    for (let i = -5; i <= 5; i++) { c.beginPath(); c.moveTo(540 + i * 48, 1260); c.lineTo(540 + i * 330, 2400); c.stroke(); }
    c.fillStyle = wallC; c.fillRect(300, 380, 480, 880);
    c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(300, 1236, 480, 24);
    // картина на стене
    rr(c, 90, 700, 120, 170, 6); fill(c, o.warm ? '#4c3d5c' : '#2c3256');
    // дверь
    rr(c, 388, 588, 304, 676, 6); fill(c, '#2b2a33');
    c.fillStyle = hex(P.warm, 1); c.fillRect(400, 600, 280, 660);
    const dw = 280 * (1 - 0.82 * d);
    c.beginPath(); c.moveTo(400, 600); c.lineTo(400 + dw, 600 + 30 * d); c.lineTo(400 + dw, 1260 - 26 * d); c.lineTo(400, 1260); c.closePath();
    fill(c, o.warm ? '#e2d7c8' : '#cfc6bb');
    if (d < 0.5) {
      c.strokeStyle = 'rgba(0,0,0,.1)'; c.lineWidth = 5; rr(c, 430, 640, dw - 60, 240, 6); c.stroke(); rr(c, 430, 920, dw - 60, 300, 6); c.stroke();
      c.save(); c.translate(400 + dw - 38, 940); c.rotate(o.handle ?? 0); rr(c, -36, -9, 46, 18, 8); fill(c, '#9a9488'); c.restore();
      circ(c, 400 + dw - 38, 940, 14); fill(c, '#b5ae9f');
    }
    if (o.fig) { const f = o.fig; personBack(c, f.who || 'her', f.x, f.y, f.s, f.ph, f); }
    if (o.frame) { // дверной проём спальни
      c.fillStyle = '#0d0f1c'; c.fillRect(-300, -300, 260, 2600); c.fillRect(1120, -300, 400, 2600); c.fillRect(-300, -300, 1800, 130);
      c.fillStyle = '#1a1d33'; c.fillRect(-40, -170, 70, 2400); c.fillRect(1050, -170, 70, 2400);
    }
    if (o.blanketFG) { c.save(); c.filter = 'blur(10px)'; c.beginPath(); c.moveTo(-200, 1750); c.bezierCurveTo(200, 1600, 700, 1720, 1300, 1620); c.lineTo(1300, 2300); c.lineTo(-200, 2300); fill(c, P.blanket); c.restore(); c.filter = 'none'; }
    if (o.fg) { c.save(); c.filter = 'blur(16px)'; ell(c, 170, 1640, 230, 260); fill(c, '#16121c'); ell(c, 120, 2000, 420, 260); fill(c, '#16121c'); c.restore(); c.filter = 'none'; }
  } else {
    if (gap > 0) {
      c.save(); c.shadowColor = P.warm; c.shadowBlur = 30;
      c.fillStyle = hex('#ffd9a0', gap); c.fillRect(400, 1252, 280, 9);
      if (o.feet) { c.shadowBlur = 0; c.fillStyle = 'rgba(20,10,10,.85)'; for (const fx of o.feet) c.fillRect(fx, 1251, 44, 11); }
      c.restore();
    }
    if (d > 0 && gap > 0) { c.fillStyle = hex('#ffe2b5', gap * .5); c.fillRect(400 + 280 * (1 - .82 * d), 600, 280 * .82 * d, 660); }
    if (o.fig && o.fig.glow) { const f = o.fig; c.save(); c.filter = 'blur(12px)'; circ(c, f.x + 50 * f.s, f.y - 600 * f.s, 30 * f.s); fill(c, hex('#a9d0ff', f.glow)); c.restore(); c.filter = 'none'; }
  }
}
function hallLights(l, o) {
  const gap = o.gap ?? 0, d = o.door ?? 0;
  if (gap > 0) {
    l.save(); l.filter = 'blur(10px)';
    l.fillStyle = hex(P.warm, .55 * gap);
    l.beginPath(); l.moveTo(400, 1258); l.lineTo(680, 1258); l.lineTo(760 + d * 300, 1400 + d * 400); l.lineTo(330 - d * 200, 1400 + d * 400); l.fill();
    l.restore();
    glow(l, 540, 1260, 260 + d * 600, P.warm, .5 * gap + d * .6 * gap);
  }
  if (o.warm) { glow(l, 540, 300, 900, '#ffcf9a', .5); glow(l, 200, 1100, 700, '#e9a6ff', .25); }
  else stripes(l, -200, 900, -0.12, 4, 30, 60, 900, P.moon, .16);
  if (o.fig && o.fig.glow) glow(l, o.fig.x + 50 * o.fig.s, o.fig.y - 600 * o.fig.s, 300 * o.fig.s, P.glow, o.fig.glow * .8);
}

// ---------- гостиная (вечер, флешбэк) ----------
function livingRoom(c, o, pass) {
  if (pass !== 'base') {
    if (o.buzz > 0) { c.save(); c.filter = 'blur(10px)'; rr(c, 610, 1369, 96, 52, 12); c.strokeStyle = hex('#a9d0ff', o.buzz); c.lineWidth = 10; c.stroke(); c.restore(); c.filter = 'none'; }
    return;
  }
  c.fillStyle = '#6c5d8c'; c.fillRect(-400, -400, 1900, 1600);
  const g = c.createLinearGradient(0, 250, 0, 900);
  g.addColorStop(0, '#2c2752'); g.addColorStop(.55, '#b45c6c'); g.addColorStop(1, '#f2a462');
  c.fillStyle = g; c.fillRect(150, 250, 780, 650);
  let sd = 7; const r = () => (sd = (sd * 9301 + 49297) % 233280) / 233280;
  for (let x = 150; x < 930;) {
    const bw = 50 + r() * 90, bh = 120 + r() * 360; c.fillStyle = r() < .5 ? '#2b2142' : '#352a50'; c.fillRect(x, 900 - bh, bw, bh);
    c.fillStyle = 'rgba(255,200,120,.75)'; for (let k = 0; k < 6; k++) if (r() < .55) c.fillRect(x + 8 + r() * (bw - 20), 900 - bh + 15 + r() * (bh - 30), 8, 10);
    x += bw + 4;
  }
  c.strokeStyle = '#3e3456'; c.lineWidth = 22; c.strokeRect(150, 250, 780, 650);
  c.lineWidth = 12; c.beginPath(); c.moveTo(540, 250); c.lineTo(540, 900); c.stroke();
  c.fillStyle = '#4a3f58'; c.fillRect(-400, 1180, 1900, 1200);
  rr(c, 60, 860, 960, 330, 60); fill(c, '#5b4f7d');
  rr(c, 20, 1050, 150, 330, 50); fill(c, '#4f446f'); rr(c, 910, 1050, 150, 330, 50); fill(c, '#4f446f');
  rr(c, 60, 1120, 960, 210, 40); fill(c, '#615582');
  c.fillStyle = '#4f446f'; c.fillRect(80, 1300, 920, 40);
  sitting(c, 'you', 390, 1150, .95, { face: o.youFace, headRot: o.youHeadRot ?? 0 });
  sitting(c, 'her', 680, 1160, .9, { face: o.herFace, headRot: o.herHeadRot ?? -0.32, lean: -1.6 });
  // журнальный столик
  c.fillStyle = '#3c2c2a'; c.fillRect(200, 1470, 30, 300); c.fillRect(850, 1470, 30, 300);
  c.beginPath(); c.moveTo(190, 1340); c.lineTo(890, 1340); c.lineTo(950, 1440); c.lineTo(130, 1440); c.closePath(); fill(c, '#7b5a48');
  c.fillStyle = '#5e4436'; c.fillRect(130, 1440, 820, 40);
  for (const [mx, mc] of [[300, '#e8dccb'], [400, '#d77d6a']]) { rr(c, mx - 30, 1320, 60, 70, 12); fill(c, mc); ell(c, mx, 1322, 30, 9); fill(c, '#3a2520'); }
  c.save(); c.translate(658 + (o.jit || 0), 1395); c.rotate(.12);
  rr(c, -46, -24, 92, 48, 10); fill(c, P.phone); rr(c, -40, -18, 22, 22, 6); fill(c, '#262833'); c.restore();
}
function livingLights(l, o, t) {
  glow(l, 540, 600, 1100, '#ff9e7a', .55);
  glow(l, 540, 1700, 1000, '#8fb2ff', .35 + .08 * Math.sin(t * 7) + .05 * Math.sin(t * 13));
  glow(l, 540, 1200, 800, '#ffd0a0', .2);
  if (o.buzz > 0) glow(l, 658, 1395, 200, P.glow, o.buzz * .7);
}

// ---------- крупный план глаза ----------
function bigEye(c, o) {
  const sk = P.youSkin, open = o.open ?? 1, lk = o.lx ?? 0, lky = o.ly ?? 0;
  c.fillStyle = sk; c.fillRect(-300, -300, W + 600, H + 600);
  c.fillStyle = P.youSkinSh; ell(c, 540, 1300, 900, 300); c.fill();
  c.strokeStyle = P.youHair; c.lineWidth = 60; c.lineCap = 'round';
  c.beginPath(); c.moveTo(120, 640 - (o.brow ?? 0) * 40); c.quadraticCurveTo(560, 470, 980, 600); c.stroke();
  c.save(); c.translate(540, 980);
  const rx = 400, ry = 230;
  const shape = () => { c.beginPath(); c.moveTo(-rx, 0); c.bezierCurveTo(-rx * .5, -ry * 1.25, rx * .5, -ry * 1.25, rx, 0); c.bezierCurveTo(rx * .5, ry * 1.05, -rx * .5, ry * 1.05, -rx, 0); c.closePath(); };
  shape(); c.save(); c.clip();
  c.fillStyle = P.eyeW; c.fillRect(-rx, -ry * 1.3, rx * 2, ry * 2.6);
  const g = c.createLinearGradient(0, -ry, 0, ry); g.addColorStop(0, 'rgba(60,40,80,.35)'); g.addColorStop(.4, 'rgba(0,0,0,0)'); c.fillStyle = g; c.fillRect(-rx, -ry * 1.3, rx * 2, ry * 2.6);
  const ix = lk * 150, iy = lky * 60;
  circ(c, ix, iy, 175); fill(c, '#5a3726');
  c.strokeStyle = 'rgba(30,15,10,.5)'; c.lineWidth = 6;
  for (let i = 0; i < 40; i++) { const a = i / 40 * TAU; c.beginPath(); c.moveTo(ix + Math.cos(a) * 85, iy + Math.sin(a) * 85); c.lineTo(ix + Math.cos(a) * 168, iy + Math.sin(a) * 168); c.stroke(); }
  circ(c, ix, iy, 175); c.lineWidth = 14; c.strokeStyle = '#2a170f'; c.stroke();
  circ(c, ix, iy, 82 + (o.dilate ?? 0) * 30); fill(c, '#07070a');
  circ(c, ix - 60, iy - 70, 32); fill(c, 'rgba(255,255,255,.9)');
  if (o.refl) { c.save(); c.translate(ix + 40, iy + 10); c.rotate(.15); rr(c, -26, -46, 52, 92, 10); fill(c, hex('#cfe6ff', o.refl)); c.restore(); }
  const cU = lerp(30, -ry * 1.4, open), cL = lerp(30, ry * 1.2, Math.min(1, open * 1.4));
  c.fillStyle = sk;
  c.beginPath(); c.moveTo(-rx - 20, -ry * 2); c.lineTo(rx + 20, -ry * 2); c.lineTo(rx + 20, 0); c.bezierCurveTo(rx * .5, cU, -rx * .5, cU, -rx - 20, 0); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(-rx - 20, ry * 2); c.lineTo(rx + 20, ry * 2); c.lineTo(rx + 20, 0); c.bezierCurveTo(rx * .5, cL, -rx * .5, cL, -rx - 20, 0); c.closePath(); c.fill();
  c.restore();
  c.strokeStyle = '#1a0f0c'; c.lineWidth = 24; c.beginPath(); c.moveTo(-rx - 10, 0); c.bezierCurveTo(-rx * .5, cU, rx * .5, cU, rx + 10, 0); c.stroke();
  c.lineWidth = 10;
  for (let i = 0; i < 9; i++) { const u = .15 + i * .085; const px = lerp(-rx, rx, u), py = (cU * .75) * Math.sin(u * PI);
    c.beginPath(); c.moveTo(px, py); c.lineTo(px + (u - .5) * 60, py - 45 * (0.4 + open * .6)); c.stroke(); }
  c.strokeStyle = 'rgba(120,70,55,.6)'; c.lineWidth = 10; c.beginPath(); c.moveTo(-rx * .8, cU * .5 - 70 * open - 20); c.bezierCurveTo(-rx * .3, cU - 80 * open, rx * .3, cU - 80 * open, rx * .85, cU * .45 - 60 * open - 20); c.stroke();
  c.restore();
}

// =================== СЦЕНЫ ===================
const S = [];
function scene(s, e, f) { S.push({ s, e, f }); }
const UI_HOOK = (a, sl) => ({ on: a, time: '2:17', notif: { title: 'Сообщения', lines: ['1 новое сообщение'], a: sl > 0 ? 1 : 0, slide: sl, h: 24 } });

// 1. Хук: уведомление, 02:17
scene(0, 2.6, (t) => {
  const on = t < 0.12 ? 0 : clamp((t - .12) / .08), jit = (t > .12 && t < .7) ? Math.sin(t * 160) * 2.2 : 0;
  const st = { ui: UI_HOOK(on, (t - .3) / .4), clock: '02:17' };
  const z = key(t, [[0, 6.2], [2.6, 5.2]]), h = hh(t, .4);
  cam(985 + jit, 515, z, .2, h); bedTop(ctx, st, 'base');
  light('rgb(28,32,62)', l => bedLights(l, st, t));
  cam(985 + jit, 515, z, .2, h); bedTop(ctx, st, 'emis');
  FX.flash = t > .12 && t < .3 ? .35 * (1 - (t - .12) / .18) : 0;
  FX.black = 1 - clamp(t / .12);
});
// 2. Твой глаз открывается
scene(2.6, 4.3, (t) => {
  camId(); const h = hh(t, .6); ctx.setTransform(new DOMMatrix().translate(h[0], h[1]).scale(key(t, [[0, 1.05], [1.7, 1.12]])).translate(-30, -60));
  bigEye(ctx, { open: key(t, [[0, 0], [.35, .25], [.55, .2], [1.0, .95]]), lx: key(t, [[0, 0], [1.1, 0], [1.4, .55]]), ly: -.1, dilate: .4 });
  M = ctx.getTransform();
  light('rgb(40,46,88)', l => { glow(l, 1200, 700, 1200, P.glow, .55); stripes(l, -300, 300, .25, 5, 70, 90, 1700, P.moon, .12); });
});
// 3. Сверху: она лежит и смотрит на тебя
scene(4.3, 6.6, (t) => {
  const on = key(t, [[0, .85], [2.3, .7]]);
  const st = { ui: UI_HOOK(on, 1), youEyes: 1, youLx: .8, youRot: .25, herEyes: 1, herLx: -.9, herRot: -.45, clock: '02:17' };
  const z = key(t, [[0, 1.0], [2.3, 1.18]]);
  cam(key(t, [[0, 540], [2.3, 600]]), key(t, [[0, 900], [2.3, 760]]), z, 0, hh(t, .6));
  bedTop(ctx, st, 'base'); light('rgb(30,34,66)', l => bedLights(l, st, t));
  cam(key(t, [[0, 540], [2.3, 600]]), key(t, [[0, 900], [2.3, 760]]), z, 0, hh(t, .6)); bedTop(ctx, st, 'emis');
});
// 4. Крупно: её открытые глаза
scene(6.6, 10.6, (t) => {
  const z = key(t, [[0, 1.0], [4, 1.38]]), y = key(t, [[0, 900], [4, 860]]);
  const o = { who: 'her', x: 560, y: 900, s: 1.55, tilt: .08, face: { eyes: 1, lx: 0, ly: 0, smile: 0, brow: -0.2, shade: 2.6, lx2: 0 } };
  o.face.lx = key(t, [[0, 0], [3.2, 0], [3.35, -.15], [4, -.15]]);
  cam(540, y, z, 0, hh(t, .35)); pillowView(ctx, o, 'base');
  light('rgb(26,30,60)', l => { glow(l, 1250, 950, 1100, P.glow, .7); glow(l, 900, 900, 500, '#cfe4ff', .35); stripes(l, -300, 200, .3, 5, 60, 80, 1600, P.moon, .14); });
  cam(540, y, z, 0, hh(t, .35)); pillowView(ctx, o, 'emis');
});
// 5. Флешбэк: гостиная, телефон экраном вниз
scene(10.6, 17.0, (t) => {
  const buzz = t > 5.0 && t < 6.0 ? Math.sin((t - 5.0) / 1.0 * PI) : 0;
  const o = { buzz, jit: buzz > .05 ? Math.sin(t * 150) * 3 : 0,
    youFace: { eyes: key(t, [[0, 1], [2.0, 1], [2.08, .05], [2.18, 1]]), lx: 0, ly: .2, smile: .35 },
    herFace: { eyes: key(t, [[0, .3], [5.2, .3], [5.5, 1]]), lx: key(t, [[0, 0], [5.2, 0], [5.6, .6]]), ly: key(t, [[5.2, 0], [5.6, .8]]), smile: .5 } };
  const x = key(t, [[0, 540], [3.4, 540], [5.6, 650]]), y = key(t, [[0, 1040], [3.4, 1080], [5.6, 1360]]), z = key(t, [[0, 1.0], [3.4, 1.06], [5.6, 2.4]], eio);
  cam(x, y, z, 0, hh(t, .5)); livingRoom(ctx, o, 'base');
  light('rgb(92,74,100)', l => livingLights(l, o, t));
  cam(x, y, z, 0, hh(t, .5)); livingRoom(ctx, o, 'emis');
  FX.tint = 'rgba(255,170,120,.18)'; FX.desat = .15;
});
// 6. Флешбэк: она уходит в ванную с телефоном
scene(17.0, 24.0, (t) => {
  const wp = clamp((t - .4) / 4.2), fy = lerp(1720, 1268, wp), fs = lerp(1.0, .58, wp);
  const door = key(t, [[4.4, 0], [4.8, .75], [5.2, .75], [5.7, 0]]);
  const inside = t > 5.0;
  const o = { warm: 1, door, gap: t > 5.6 ? 1 : 0, handle: t > 6.1 && t < 6.5 ? -.5 : 0, fg: 1,
    fig: inside ? null : { who: 'her', x: lerp(640, 545, wp), y: fy, s: fs, ph: t * 7.5, walk: 1, phone: 1, glow: .8 } };
  if (t > 3.0 && t < 3.9 && o.fig) o.fig.ph = 3.0 * 7.5; // оглядывается — пауза
  cam(540, 1000, key(t, [[0, 1.0], [7, 1.12]]), 0, hh(t, .5)); hallway(ctx, o, 'base');
  light('rgb(100,82,112)', l => hallLights(l, o));
  cam(540, 1000, key(t, [[0, 1.0], [7, 1.12]]), 0, hh(t, .5)); hallway(ctx, o, 'emis');
  FX.tint = 'rgba(255,170,120,.18)'; FX.desat = .15;
});
// 7. Флешбэк: она прячет экран
scene(24.0, 29.0, (t) => {
  const flip = key(t, [[0, .9], [1.1, .9], [1.9, 2.5]]); // поворот к себе
  const on = t > 1.0 ? 1 : .0;
  const look = key(t, [[0, .9], [1.0, .9], [1.4, -.2], [3.5, -.2], [3.9, .9]]);
  camId();
  const z = key(t, [[0, 1.0], [5, 1.08]]);
  cam(540, 1000, z, 0, hh(t, .5));
  // фон — размытая гостиная
  ctx.save(); ctx.filter = 'blur(18px)'; livingRoom(ctx, { herFace: {}, youFace: {} }, 'base'); ctx.restore(); ctx.filter = 'none';
  ctx.fillStyle = 'rgba(30,20,40,.35)'; ctx.fillRect(-200, -200, 1500, 2400);
  ctx.save(); ctx.translate(620, 860); ctx.rotate(key(t, [[1, -.04], [1.9, .06]])); ctx.scale(1.15, 1.15);
  bust(ctx, 'her', { w: 1 }); head(ctx, 'her', { eyes: 1, lx: look, ly: key(t, [[1, 0], [1.4, .7], [3.5, .7], [3.9, 0]]), smile: .1, brow: 0 });
  ctx.restore();
  const px = key(t, [[0, 560], [1.9, 700]]), py = key(t, [[0, 1600], [1.9, 1500]]);
  const ui = { on, flip, time: '18:42', notif: { title: '', lines: ['', ''], a: 1, slide: 1 } };
  hand(ctx, px - 70, py + 120, -0.6, 1.4, P.herSkin, .2);
  phone(ctx, px, py, 210, key(t, [[0, -.25], [1.9, .1]]), ui, 'base');
  hand(ctx, px + 60, py + 150, 0.5, 1.4, P.herSkin, .2);
  light('rgb(96,80,104)', l => { glow(l, 540, 400, 1100, '#ff9e7a', .5); glow(l, px, py - 300, 700, P.glow, on * .55); glow(l, 540, 1800, 900, '#8fb2ff', .3); });
  cam(540, 1000, z, 0, hh(t, .5));
  ctx.save(); ctx.filter = 'blur(3px)'; phone(ctx, px, py, 210, key(t, [[0, -.25], [1.9, .1]]), ui, 'emis'); ctx.restore(); ctx.filter = 'none';
  FX.tint = 'rgba(255,170,120,.18)'; FX.desat = .15;
});
// 8. Флешбэк: улыбка… и взгляд на тебя
scene(29.0, 35.6, (t) => {
  const z = key(t, [[0, 1.0], [6.6, 1.22]]);
  const look = t > 3.0;
  const sm = key(t, [[0, .1], [.6, .85], [3.0, .85], [3.35, .1], [4.0, -.05]]);
  const pDown = key(t, [[0, 0], [4.3, 0], [5.0, 1]]);
  const on = 1 - pDown;
  cam(540, 900, z, 0, hh(t, .35));
  ctx.save(); ctx.filter = 'blur(22px)'; livingRoom(ctx, { herFace: {}, youFace: {} }, 'base'); ctx.restore(); ctx.filter = 'none';
  ctx.fillStyle = 'rgba(30,20,40,.45)'; ctx.fillRect(-200, -200, 1500, 2400);
  ctx.save(); ctx.translate(540, 820); ctx.rotate(key(t, [[0, .05], [3.0, .05], [3.3, 0]])); ctx.scale(2.1, 2.1);
  bust(ctx, 'her'); head(ctx, 'her', { eyes: key(t, [[0, .8], [3.0, .8], [3.12, 1]]), lx: look ? 0 : .15, ly: look ? 0 : .85, smile: sm, brow: key(t, [[3.2, 0], [3.5, -.25]]) });
  ctx.restore();
  const py = lerp(1640, 2300, pDown);
  phone(ctx, 560, py, 260, -.05, { faceDown: 1 }, 'base');
  hand(ctx, 470, py + 150, -0.7, 1.7, P.herSkin, .2); hand(ctx, 650, py + 160, 0.6, 1.7, P.herSkin, .2);
  light('rgb(70,58,84)', l => { glow(l, 540, 1500, 1000, P.glow, .75 * on); glow(l, 540, 1100, 500, '#d8eaff', .35 * on); glow(l, 540, 0, 900, '#ff9e7a', .35); });
  FX.tint = 'rgba(255,170,120,.16)'; FX.desat = .15;
});
// 9. Ночь. Ты поворачиваешься к ней
scene(35.6, 39.6, (t) => {
  const st = { ui: { on: 0 }, youEyes: 1, youLx: key(t, [[0, 0], [1.2, .9]]), youRot: key(t, [[0, -.1], [1.4, .35]]), herEyes: 1, herLx: -.9, herRot: -.45, clock: '02:18' };
  const z = key(t, [[0, 1.45], [4, 1.6]]);
  cam(540, 620, z, 0, hh(t, .5)); bedTop(ctx, st, 'base'); light('rgb(30,34,66)', l => bedLights(l, st, t));
  cam(540, 620, z, 0, hh(t, .5)); bedTop(ctx, st, 'emis');
  FX.flash = t < .25 ? .25 * (1 - t / .25) : 0;
});
// 10. «Проснулась от твоего движения»
scene(39.6, 43.6, (t) => {
  const talk = t > .5 && t < 2.6 ? Math.abs(Math.sin((t - .5) * 11)) * .55 : 0;
  const o = { who: 'her', x: 560, y: 900, s: 1.7, tilt: .06,
    face: { eyes: key(t, [[0, 1], [2.7, 1], [2.8, .05], [2.9, 1]]), lx: key(t, [[0, 0], [3.2, 0], [3.35, .9], [3.75, .9], [3.9, 0]]), ly: key(t, [[3.2, 0], [3.35, -.5], [3.75, -.5], [3.9, 0]]),
      mouth: talk, smile: key(t, [[0, 0], [2.6, .25], [3.2, .15]]), brow: 0, shade: 2.6 } };
  const z = key(t, [[0, 1.12], [4, 1.22]]);
  cam(540, 900, z, 0, hh(t, .35)); pillowView(ctx, o, 'base');
  light('rgb(28,32,64)', l => { glow(l, 300, 600, 1100, P.moon, .4); stripes(l, -300, 200, .3, 5, 60, 80, 1600, P.moon, .16); });
});
// 11. Ты отворачиваешься и закрываешь глаза. Она — нет.
scene(43.6, 47.8, (t) => {
  const o = { who: 'you', x: 520, y: 1000, s: 1.45, tilt: -.05, behind: { x: 830, y: 420, eyes: 1, glint: key(t, [[0, 0], [2.5, 0], [3.2, .9]]) },
    face: { eyes: key(t, [[0, 1], [2.0, 1], [2.6, 0]]), lx: 0, ly: .2, brow: .3, shade: -1 } };
  const z = key(t, [[0, 1.0], [4.2, 1.1]]);
  cam(540, 900, z, 0, hh(t, .35)); pillowView(ctx, o, 'base');
  light('rgb(26,30,60)', l => { glow(l, 900, 300, 900, P.moon, .4); stripes(l, -300, 200, .3, 5, 60, 80, 1600, P.moon, .14); });
  cam(540, 900, z, 0, hh(t, .35)); pillowView(ctx, o, 'emis');
});
// 12. Она осторожно встаёт
scene(47.8, 52.6, (t) => {
  cam(key(t, [[0, 560], [4.8, 640]]), 1000, key(t, [[0, 1.0], [4.8, 1.08]]), 0, hh(t, .4));
  ctx.fillStyle = '#2f3658'; ctx.fillRect(-300, -300, 1700, 900);
  ctx.fillStyle = P.floor; ctx.fillRect(-300, 1280, 1700, 1100);
  ctx.strokeStyle = P.floorSh; ctx.lineWidth = 5; for (let y = 1330; y < 2300; y += 90) { ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(1500, y + 20); ctx.stroke(); }
  ctx.fillStyle = P.woodSh; ctx.fillRect(-300, 960, 1700, 130);
  rr(ctx, -300, 560, 1700, 420, 30); fill(ctx, P.sheet);
  const k1 = key(t, [[0, 0], [1.6, 1]]), k2 = key(t, [[.9, 0], [2.6, 1]]);
  const away = key(t, [[3.0, 0], [4.8, 1]]);
  // ноги
  for (const [i, k] of [[0, k1], [1, k2]]) {
    if (k <= 0) continue;
    const bx = 470 + i * 120 + away * 900, kneeY = lerp(820, 900, k), footY = lerp(1000, 1350, k);
    limb(ctx, [[bx - 60, 700], [bx, kneeY], [bx + 30, footY - 30]], 78, i ? P.herSkin : P.herSkinSh);
    ell(ctx, bx + 55, footY - 18, 62, 26); fill(ctx, i ? P.herSkin : P.herSkinSh);
  }
  // одеяло сползает
  const bl = key(t, [[0, 0], [1.8, 1]]);
  ctx.beginPath(); ctx.moveTo(-300, 580); ctx.bezierCurveTo(200, 560 + bl * 60, 500, 600, 1500, 570 + bl * 40);
  ctx.lineTo(1500, 980 - bl * 40); ctx.bezierCurveTo(900, 1060 - bl * 120, 500, 1080 - bl * 160, -300, 1040); ctx.closePath(); fill(ctx, P.blanket);
  ctx.strokeStyle = P.blanketSh; ctx.lineWidth = 12; for (const a of [100, 600, 1000]) { ctx.beginPath(); ctx.moveTo(a, 640); ctx.quadraticCurveTo(a + 40, 820, a - 20, 1000 - bl * 100); ctx.stroke(); }
  light('rgb(44,50,90)', l => { stripes(l, -300, 1180, -.05, 3, 70, 90, 1900, P.moon, .5); glow(l, 600, 1300, 800, P.moon, .4); });
  FX.desat = .25;
});
// 13. Она выходит; дверь ванной закрывается
scene(52.6, 58.8, (t) => {
  const wp = clamp((t - .0) / 3.6), fy = lerp(1880, 1268, wp), fs = lerp(1.2, .58, wp);
  const door = key(t, [[3.5, 0], [3.9, .75], [4.4, .75], [5.0, 0]]);
  const inside = t > 4.2;
  const o = { door, gap: t > 3.9 ? 1 : 0, frame: 1, blanketFG: 1, handle: 0,
    fig: inside ? null : { who: 'her', x: lerp(380, 545, wp), y: fy, s: fs, ph: t * 7, walk: 1, sil: t < 3.85 ? null : '#120d14' } };
  const z = key(t, [[0, .95], [6.2, 1.04]]);
  cam(540, 1000, z, 0, hh(t, .4)); hallway(ctx, o, 'base');
  light('rgb(40,45,82)', l => hallLights(l, o));
  cam(540, 1000, z, 0, hh(t, .4)); hallway(ctx, o, 'emis');
  FX.desat = .2;
});
// 14. Шёпот за дверью
scene(58.8, 65.6, (t) => {
  const fx = 470 + Math.sin(t * .9) * 60, fx2 = fx + 70 + Math.sin(t * 1.3) * 10;
  const o = { gap: 1 + .08 * Math.sin(t * 9), feet: [fx, fx2], handle: 0 };
  const z = key(t, [[0, 2.0], [6.8, 3.0]]), y = key(t, [[0, 1080], [6.8, 1180]]);
  cam(540, y, z, 0, hh(t, .25)); hallway(ctx, o, 'base');
  light('rgb(26,30,58)', l => hallLights(l, o));
  cam(540, y, z, 0, hh(t, .25)); hallway(ctx, o, 'emis');
});
// 15. Ты открываешь глаза: её сторона пуста
scene(65.6, 70.2, (t) => {
  const o = { dent: 1, emptyBack: 1 };
  cam(540, key(t, [[0, 960], [4.6, 1000]]), key(t, [[0, 1.0], [4.6, 1.08]]), 0, hh(t, .5));
  pillowView(ctx, o, 'base');
  light('rgb(24,28,56)', l => { stripes(l, -300, 300, .3, 6, 60, 80, 1700, P.moon, .3); glow(l, 1100, 1300, 700, P.warm, .12); });
  FX.lids = key(t, [[0, 0], [.5, .35], [.7, .3], [1.3, 1]]);
  FX.blur = key(t, [[0, 14], [1.5, 0]]);
});
// 16. Тебе не по себе (сердцебиение)
scene(70.2, 74.2, (t) => {
  const beat = t => { const p = (t % 0.95); return Math.exp(-p * 18) + .6 * Math.exp(-Math.max(0, p - .22) * 18) * (p > .22); };
  const z = key(t, [[0, 1.25], [4, 1.5]]) + beat(t) * .012;
  const o = { who: 'you', x: 520, y: 1000, s: 1.45, tilt: -.05, face: { eyes: 1, lx: key(t, [[0, .3], [2.5, .3], [2.8, -.6]]), ly: key(t, [[0, -.6], [2.5, -.6], [2.8, .2]]), brow: .9, shade: -1, mouth: .08 } };
  cam(520, 980, z, 0, hh(t, .45)); pillowView(ctx, o, 'base');
  light('rgb(22,26,54)', l => { glow(l, 900, 300, 900, P.moon, .35); glow(l, 1100, 1000, 600, P.warm, .1); });
});
// 17. Её телефон остался на тумбочке
scene(74.2, 78.6, (t) => {
  const st = { ui: { on: 0 }, herIn: 0, back: 1, youEyes: 1, youLx: .9, youRot: .3, clock: '02:21' };
  const z = key(t, [[0, 2.0], [4.4, 4.0]], eio), x = key(t, [[0, 860], [4.4, 980]]), y = key(t, [[0, 640], [4.4, 540]]);
  cam(x, y, z, key(t, [[0, 0], [4.4, .2]]), hh(t, .4)); bedTop(ctx, st, 'base'); light('rgb(26,30,60)', l => bedLights(l, st, t));
  cam(x, y, z, key(t, [[0, 0], [4.4, .2]]), hh(t, .4)); bedTop(ctx, st, 'emis');
});
// 18. Экран загорается
scene(78.6, 86.2, (t) => {
  const on = t < .25 ? 0 : clamp((t - .25) / .1);
  const jit = t > .25 && t < .9 ? Math.sin(t * 160) * 1.2 : 0;
  const st = { ui: { on, time: '2:21', notif: { title: 'Неизвестный номер', icon: '#3a8cff', lines: ['Ты сегодня обещала мне', 'кое-что рассказать.', 'Не забыла?'], fs: 5.6, slide: (t - .5) / .5, a: t > .5 ? 1 : 0, h: 40 } },
    herIn: 0, back: 1, clock: '02:21', arm: key(t, [[0, 0], [4.6, 0], [6.4, .82], [7.6, .86]]), armOpen: .5 };
  const z = key(t, [[0, 4.6], [1.5, 8.8], [7.6, 9.8]], eio);
  const h = hh(t, .5);
  cam(985 + jit, key(t, [[0, 545], [7.6, 560]]), z, .2, h); bedTop(ctx, st, 'base'); light('rgb(22,26,54)', l => bedLights(l, st, t));
  cam(985 + jit, key(t, [[0, 545], [7.6, 560]]), z, .2, h); bedTop(ctx, st, 'emis');
  FX.flash = t > .25 && t < .45 ? .3 * (1 - (t - .25) / .2) : 0;
});
// 19. Закрытая дверь… разговор заканчивается
scene(86.2, 90.6, (t) => {
  const fx = t < 2.2 ? 470 + Math.sin(t * .9) * 60 : 470 + Math.sin(2.2 * .9) * 60 + (t - 2.2) * 40;
  const o = { gap: 1, feet: [fx, fx + 70], frame: 1, blanketFG: 1, handle: key(t, [[3.7, 0], [4.1, -.6]]) };
  const z = key(t, [[0, 1.0], [3.7, 1.25], [4.4, 1.55]], eio);
  cam(540, key(t, [[0, 1000], [4.4, 1020]]), z, 0, hh(t, .4)); hallway(ctx, o, 'base');
  light('rgb(28,32,60)', l => hallLights(l, o));
  cam(540, key(t, [[0, 1000], [4.4, 1020]]), z, 0, hh(t, .4)); hallway(ctx, o, 'emis');
});
// 20. Рука отдёргивается
scene(90.6, 91.9, (t) => {
  const on = key(t, [[0, 1], [1.0, .25]]);
  const st = { ui: { on, time: '2:22', notif: { title: 'Неизвестный номер', icon: '#3a8cff', lines: ['Ты сегодня обещала мне', 'кое-что рассказать.', 'Не забыла?'], fs: 5.6, a: 1, slide: 1, h: 40 } },
    herIn: 0, back: 1, clock: '02:22', arm: key(t, [[0, .86], [.45, 0]], eo) };
  const z = key(t, [[0, 5.5], [1.3, 3.0]], eo);
  cam(key(t, [[0, 985], [1.3, 880]]), key(t, [[0, 545], [1.3, 640]]), z, .2, hh(t * 3, 1.5));
  bedTop(ctx, st, 'base'); light('rgb(22,26,54)', l => bedLights(l, st, t));
  cam(key(t, [[0, 985], [1.3, 880]]), key(t, [[0, 545], [1.3, 640]]), z, .2, hh(t * 3, 1.5)); bedTop(ctx, st, 'emis');
});
// 21. Ты ложишься обратно
scene(91.9, 93.6, (t) => {
  const st = { ui: { on: key(t, [[0, .25], [.6, 0]]) }, herIn: 0, back: 1, clock: '02:22', youX: key(t, [[0, 560], [.6, 365]], eo),
    youRot: key(t, [[0, .5], [.7, -.55]]), youEyes: key(t, [[0, 1], [.8, 1], [1.0, 0]]), youLx: -.5 };
  const z = key(t, [[0, 1.6], [1.7, 1.75]]);
  cam(500, 760, z, 0, hh(t * 2, 1)); bedTop(ctx, st, 'base'); light('rgb(26,30,60)', l => bedLights(l, st, t));
  cam(500, 760, z, 0, hh(t * 2, 1)); bedTop(ctx, st, 'emis');
});
// 22. Дверь открывается (сквозь ресницы)
scene(93.6, 96.2, (t) => {
  const door = key(t, [[.3, 0], [.9, .85]]);
  const gap = t < 1.8 ? 1 : 0;
  const walk = clamp((t - 1.9) / 1.0);
  const o = { door, gap, frame: 1, blanketFG: 1,
    fig: t > .7 ? { who: 'her', x: lerp(540, 600, walk), y: lerp(1268, 1700, walk), s: lerp(.58, 1.0, walk), ph: walk * 9, sil: '#0a0810', walk: walk > 0 ? 1 : 0 } : null };
  const z = key(t, [[0, 1.05], [2.6, 1.12]]);
  cam(540, 1000, z, 0, hh(t, .3)); hallway(ctx, o, 'base');
  light(gap ? 'rgb(28,32,60)' : 'rgb(14,16,34)', l => hallLights(l, o));
  cam(540, 1000, z, 0, hh(t, .3));
  if (o.fig) { ctx.save(); personBack(ctx, 'her', o.fig.x, o.fig.y, o.fig.s, o.fig.ph, o.fig); ctx.restore(); }
  hallway(ctx, o, 'emis');
  FX.lids = .34 + Math.sin(t * 5) * .015; FX.lidCurve = 1.4; FX.blur = 3;
});
// 23. Она обнимает тебя. Ты не спишь.
scene(96.2, 105.4, (t) => {
  const arm = key(t, [[.4, 0], [2.4, 1], [6.3, 1], [7.9, 0]]);
  const glowA = key(t, [[8.3, 0], [8.6, 1]]);
  const o = { who: 'you', x: 520, y: 1000, s: 1.45, tilt: -.05, arm, armBlur: 2,
    behind: { x: 860, y: 400, eyes: 0 }, bokeh: glowA > 0 ? { x: 900, y: 260, a: glowA * .9 } : null,
    face: { eyes: key(t, [[0, 0], [4.6, 0], [4.9, 1]]), lx: key(t, [[0, 0], [7.9, 0], [8.4, -.7]]), ly: key(t, [[0, .2], [7.9, .2], [8.4, -.7]]), brow: .7, shade: -1 } };
  const z = key(t, [[0, 1.05], [4.6, 1.15], [5.0, 1.4], [9.2, 1.55]], eio);
  const cy = key(t, [[0, 900], [4.6, 900], [5.0, 960]]);
  cam(520, cy, z, 0, hh(t, .35)); pillowView(ctx, o, 'base');
  light('rgb(26,30,62)', l => { glow(l, 900, 300, 900, P.moon, .32); glow(l, 250, 500, 800, P.moon, .45); glow(l, 900, 260, 1000, P.glow, glowA * .85); });
  cam(520, cy, z, 0, hh(t, .35)); pillowView(ctx, o, 'emis');
});
// 24. Новое сообщение — «Он ничего не…»
scene(105.4, 108.7, (t) => {
  const on = t < .15 ? 0 : (t < 2.75 ? 1 : key(t, [[2.75, 1], [2.85, 0]]));
  const rev = key(t, [[.8, 0], [2.75, .52]], u => u);
  const ui = { on, time: '2:23', notif: { title: 'Сообщение', icon: '#7a7f95', lines: ['Он ничего не подозревает?'], fs: 6.4, reveal: rev, slide: (t - .2) / .4, a: t > .2 ? 1 : 0, h: 28 } };
  camId(); const h = hh(t, .8);
  cam(540, 960, key(t, [[0, 1.0], [3.3, 1.12]]), 0, h);
  ctx.fillStyle = '#0d0f20'; ctx.fillRect(-300, -300, 1700, 2600);
  ctx.save(); ctx.filter = 'blur(26px)'; ctx.translate(560, 1500); ctx.rotate(-.1); ctx.scale(1.3, 1.3); head(ctx, 'her', { eyes: 1, ly: -.8, hairLen: 300 }); ctx.restore(); ctx.filter = 'none';
  phone(ctx, 560, 1060, 520, -.08, ui, 'base');
  hand(ctx, 300, 1380, -.5, 2.2, P.herSkin, .1); hand(ctx, 830, 1400, .5, 2.2, P.herSkin, .1);
  light('rgb(14,16,34)', l => { glow(l, 560, 1000, 1200, P.glow, on * .9); });
  cam(540, 960, key(t, [[0, 1.0], [3.3, 1.12]]), 0, h);
  bloom(ctx, () => phone(ctx, 560, 1060, 520, -.08, ui, 'emis'), 60 * on, '#7fb0ff');
  FX.lids = key(t, [[0, .3], [1.0, .44], [3.3, .4]]) + Math.sin(t * 6) * .012; FX.lidCurve = 1.5; FX.blur = key(t, [[0, 6], [.9, 1.2]]);
});
// 25. Твой глаз в темноте
scene(108.7, 113.6, (t) => {
  camId(); const h = hh(t, .3), z = key(t, [[0, 1.0], [4.9, 1.55]]);
  ctx.setTransform(new DOMMatrix().translate(540 + h[0], 980 + h[1]).scale(z).translate(-540, -980));
  bigEye(ctx, { open: 1, lx: .1, ly: .05, refl: key(t, [[0, .55], [3.5, 0]]), dilate: key(t, [[0, .2], [4.9, 1]]), brow: .5 });
  M = ctx.getTransform();
  light('rgb(16,18,40)', l => { glow(l, 600, 980, 700, P.glow, key(t, [[0, .55], [3.5, .12]])); glow(l, 900, 300, 1100, P.moon, .18); });
});
// 26. Чёрный экран
scene(113.6, 114.6, () => { FX.black = 1; });

const DURATION = 114.6;
function render(t, frame = Math.round(t * 30)) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; ctx.filter = 'none';
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
  FX = { lids: 1, lidCurve: 1, blur: 0, desat: 0, tint: null, vig: .72, flash: 0, black: 0 };
  const sc = S.find(s => t >= s.s && t < s.e) || S[S.length - 1];
  ctx.save(); sc.f(t - sc.s, sc.e - sc.s); ctx.restore();
  post(frame);
}
window.render = render; window.DURATION = DURATION; window.SCENES = S.map(s => [s.s, s.e]);
render(0);
