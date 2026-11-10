"""Процедурная звуковая дорожка серии 1: музыка-эмбиент + SFX (без голоса).
python3 audio.py out.wav
Тайм-коды совпадают со сценами в anim.js и репликами в voice_lines.json.
"""
import sys
import numpy as np
from scipy import signal

SR = 48000
DUR = 114.6
CUT = 113.6  # резкий обрыв
N = int(SR * DUR)
rng = np.random.default_rng(7)
mus = np.zeros((N, 2))
sfx = np.zeros((N, 2))


def t_arr(d):
    return np.arange(int(d * SR)) / SR


def env(n, a=0.005, r=0.1):
    e = np.ones(n)
    na, nr = max(1, int(a * SR)), max(1, int(r * SR))
    e[:na] = np.linspace(0, 1, na)
    e[-nr:] *= np.linspace(1, 0, nr)
    return e


def put(buf, t0, x, gain=1.0, pan=0.0):
    i = int(t0 * SR)
    if x.ndim == 1:
        x = np.stack([x * np.sqrt(0.5 * (1 - pan)), x * np.sqrt(0.5 * (1 + pan))], 1) * np.sqrt(2)
    j = min(N, i + len(x))
    if j > i:
        buf[i:j] += x[: j - i] * gain


def bp(x, lo, hi, order=2):
    sos = signal.butter(order, [lo, hi], 'bandpass', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def lp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, 'lowpass', fs=SR, output='sos'), x)


def hp(x, f, order=2):
    return signal.sosfilt(signal.butter(order, f, 'highpass', fs=SR, output='sos'), x)


def noise(d):
    return rng.standard_normal(int(d * SR))


def reverb(x, d=1.2, mix=0.25):
    ir = rng.standard_normal(int(d * SR)) * np.exp(-np.linspace(0, 7, int(d * SR)))
    ir = lp(ir, 5000)
    ir /= np.sqrt(np.sum(ir ** 2))
    out = np.zeros_like(x)
    for ch in range(x.shape[1]):
        out[:, ch] = signal.fftconvolve(x[:, ch], ir)[: len(x)]
    return x * (1 - mix) + out * mix


def seg(t0, t1):
    tt = np.arange(N) / SR
    return ((tt >= t0) & (tt < t1)).astype(float)


def ramp(points):
    tt = np.arange(N) / SR
    xs, ys = zip(*points)
    return np.interp(tt, xs, ys)


tt = np.arange(N) / SR

# ---------------- МУЗЫКА ----------------
# 1) ночной дрон: низкие синусы с медленной расстройкой
night = ramp([(0, 0), (0.2, 1), (10.4, 1), (10.8, 0), (35.4, 0), (35.8, 0.9), (65, 1.0), (90, 1.15), (108, 1.3), (CUT, 1.5), (CUT + 0.001, 0)])
drone = np.zeros(N)
for f, a in [(55, 1.0), (55.4, 0.7), (82.4, 0.45), (110.2, 0.25), (164.8, 0.08)]:
    drone += a * np.sin(2 * np.pi * f * tt + np.sin(2 * np.pi * 0.07 * tt) * 2)
drone *= 0.08 * (0.75 + 0.25 * np.sin(2 * np.pi * 0.11 * tt))
air = lp(hp(rng.standard_normal(N), 300), 1800) * 0.012
# 2) диссонанс (малая секунда) — нарастает с поворотом
tension = ramp([(0, 0), (58, 0), (66, 0.5), (78, 0.8), (86, 1.0), (90, 0.4), (96, 0.7), (105, 1.0), (CUT, 1.4), (CUT + 0.001, 0)])
diss = (np.sin(2 * np.pi * 233.1 * tt) + np.sin(2 * np.pi * 246.9 * tt)) * 0.018
diss *= 0.6 + 0.4 * np.sin(2 * np.pi * 0.25 * tt)
# 3) высокий «стеклянный» тон в первой сцене (хук)
glass = np.sin(2 * np.pi * 1318.5 * tt) * 0.006 * ramp([(0, 0), (0.5, 1), (10, 0.6), (10.6, 0)])
mono = drone * night + air * night + diss * tension + glass
mus[:, 0] += mono
mus[:, 1] += np.roll(mono, 240)

# 4) флешбэк: тёплый пэд + редкие ноты «музыкальной шкатулки»
fb = ramp([(10.3, 0), (11.2, 1), (34.8, 1), (35.6, 0)])
pad = np.zeros(N)
for f in [220.0, 261.6, 329.6, 392.0]:  # Am7
    pad += np.sin(2 * np.pi * f * tt + 0.3 * np.sin(2 * np.pi * 0.2 * tt))
pad = lp(pad, 1200) * 0.018 * fb
mus[:, 0] += pad
mus[:, 1] += np.roll(pad, 400)
notes = [(11.0, 659.3), (12.5, 523.3), (14.0, 587.3), (15.5, 493.9), (18.0, 659.3), (19.5, 523.3), (21.0, 440.0),
         (24.5, 659.3), (26.0, 622.3), (27.5, 587.3), (29.5, 659.3), (31.0, 523.3), (32.2, 466.2), (33.8, 440.0)]
for t0, f in notes:
    d = 2.2
    x = t_arr(d)
    tone = (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(2 * np.pi * 2 * f * x) + 0.12 * np.sin(2 * np.pi * 3.01 * f * x)) * np.exp(-x * 2.6)
    tone *= env(len(x), 0.004, 0.3) * 0.05 * (0.6 if t0 > 31.9 else 1)
    put(mus, t0, tone, pan=rng.uniform(-0.4, 0.4))

# 5) пульс-тики (тревога) с 74 с
for k, t0 in enumerate(np.arange(74.2, 90.4, 0.5)):
    x = t_arr(0.08)
    put(mus, t0, np.sin(2 * np.pi * 880 * x) * np.exp(-x * 60) * 0.02 * (0.5 + 0.5 * (k % 2 == 0)))

# 6) финальный райзер — обрыв на CUT
x = t_arr(CUT - 108.7)
rise = hp(rng.standard_normal(len(x)), 800) * 0.0 + lp(rng.standard_normal(len(x)), 3000)
sweep = np.sin(2 * np.pi * np.cumsum(np.linspace(80, 320, len(x))) / SR)
rise = (rise * 0.02 + sweep * 0.05) * np.linspace(0, 1, len(x)) ** 2
put(mus, 108.7, rise)

mus = reverb(mus, 2.5, 0.35)

# ---------------- SFX ----------------


def notif_ping(t0, g=1.0):
    for k, (f, dt) in enumerate([(1046.5, 0), (1568.0, 0.11)]):
        x = t_arr(0.6)
        s = (np.sin(2 * np.pi * f * x) + 0.25 * np.sin(2 * np.pi * 2 * f * x)) * np.exp(-x * 9)
        put(sfx, t0 + dt, s * env(len(x), 0.002, 0.05) * 0.16 * g)


def vibrate(t0, d=0.45, g=1.0):
    x = t_arr(d)
    buzz = signal.sawtooth(2 * np.pi * 170 * x) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 9 * x)))
    buzz = bp(buzz, 120, 2200) * env(len(x), 0.01, 0.05) * 0.11 * g
    put(sfx, t0, buzz)


def rustle(t0, d, g=1.0, pan=0.0):
    x = noise(d)
    e = np.abs(lp(rng.standard_normal(len(x)), 8)) * 6
    s = bp(x, 900, 6000) * np.clip(e, 0, 1) * env(len(x), 0.08, 0.25) * 0.05 * g
    put(sfx, t0, s, pan=pan)


def step(t0, g=1.0, pan=0.0):
    x = t_arr(0.25)
    thump = np.sin(2 * np.pi * 70 * x) * np.exp(-x * 30) * 0.3 + lp(noise(0.25), 900) * np.exp(-x * 40) * 0.15
    put(sfx, t0, thump * g, pan=pan)


def click(t0, g=1.0, f=2500):
    x = t_arr(0.06)
    put(sfx, t0, bp(noise(0.06), f * 0.6, f * 1.6) * np.exp(-x * 120) * 0.35 * g)


def door_close(t0, g=1.0):
    x = t_arr(0.5)
    put(sfx, t0, (np.sin(2 * np.pi * 55 * x) * 0.35 + lp(noise(0.5), 400) * 0.2) * np.exp(-x * 14) * g)
    click(t0 + 0.04, 0.8 * g, 1800)


def creak(t0, d=0.9, g=1.0):
    x = t_arr(d)
    f = 320 + 120 * np.sin(2 * np.pi * 1.1 * x) + 60 * x
    saw = signal.sawtooth(2 * np.pi * np.cumsum(f) / SR) * (0.6 + 0.4 * np.sin(2 * np.pi * 23 * x))
    put(sfx, t0, bp(saw, 400, 2500) * env(len(x), 0.05, 0.3) * 0.05 * g)


def whisper(t0, d, g=1.0):
    x = noise(d)
    tt_ = t_arr(d)
    syl = np.clip(np.sin(2 * np.pi * 3.7 * tt_ + 2 * np.sin(2 * np.pi * 0.9 * tt_)), 0, 1) ** 1.5
    phr = np.clip(np.sin(2 * np.pi * 0.35 * tt_ + 0.5), 0.15, 1)
    s = bp(x, 1500, 5500) * syl * phr
    s = lp(s, 2600)  # приглушено дверью
    put(sfx, t0, s * env(len(x), 0.2, 0.4) * 0.07 * g, pan=0.15)


def heartbeat(t0, t1, bpm, g=1.0):
    per = 60 / bpm
    for k, tb in enumerate(np.arange(t0, t1, per)):
        for dt, a in [(0, 1.0), (0.24, 0.65)]:
            x = t_arr(0.3)
            b = np.sin(2 * np.pi * 48 * x) * np.exp(-x * 22) + 0.3 * lp(noise(0.3), 150) * np.exp(-x * 30)
            put(sfx, tb + dt, b * a * 0.45 * g * min(1, 0.4 + k * 0.15))


def whoosh(t0, d=0.5, g=1.0):
    x = noise(d)
    e = np.sin(np.linspace(0, np.pi, len(x))) ** 2
    put(sfx, t0, bp(x, 300, 3000) * e * 0.06 * g)


# 0–10: хук
vibrate(0.12, 0.5)
notif_ping(0.12)
rustle(2.7, 0.8, 0.5)
# флешбэк
vibrate(15.6, 0.9, 0.7)
for k, t0 in enumerate(np.arange(17.5, 21.6, 0.55)):
    step(t0, 0.35 * (1 - k * 0.06))
click(21.6, 0.4)
door_close(22.6, 0.5)
click(23.2, 0.9, 3200)  # щелчок замка
vibrate(25.1, 0.4, 0.6)
# ночь
rustle(35.8, 1.4, 0.8, -0.3)
rustle(46.0, 1.0, 0.5)
rustle(47.9, 2.0, 1.0, 0.3)
step(49.4, 0.5, 0.3)
step(50.5, 0.55, 0.3)
for k, t0 in enumerate(np.arange(51.4, 56.2, 0.62)):
    step(t0, 0.5 * (1 - k * 0.09), 0.2)
click(56.3, 0.5)
creak(56.4, 0.6, 0.6)
click(56.6, 0.6, 4000)  # выключатель
door_close(57.6, 0.4)
# 58.8–65: ванная — вода? нет, только шёпот
whisper(60.0, 5.2, 1.0)
# 65.6: глаза
rustle(65.8, 0.6, 0.4)
heartbeat(70.4, 78.4, 62, 0.8)
# 78.6: экран
vibrate(78.85, 0.5)
notif_ping(78.85)
whisper(80.5, 3.0, 0.6)
whisper(86.3, 2.4, 0.8)
click(89.9, 0.6, 1500)  # дверная ручка
whoosh(90.5, 0.4, 1.2)
rustle(91.9, 1.0, 1.2, -0.2)
creak(93.9, 0.9, 0.9)
click(95.3, 0.6, 4000)
step(95.6, 0.35)
step(96.1, 0.4)
rustle(96.3, 2.4, 0.9, 0.2)
heartbeat(99.4, 108.6, 76, 0.9)
rustle(102.6, 1.4, 0.5, 0.3)
notif_ping(105.55, 0.9)
vibrate(105.55, 0.35, 0.6)
click(108.15, 0.5, 5000)  # экран гаснет

sfx = reverb(sfx, 0.6, 0.18)

# комнатный тон
room = lp(rng.standard_normal(N), 250) * 0.01 + np.sin(2 * np.pi * 50 * tt) * 0.002
room *= 1 - fb * 0.5
mix = mus + sfx + room[:, None]
mix[int(CUT * SR):] = 0  # резкий обрыв
mix = np.tanh(mix * 1.4) / 1.4
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.5  # оставляем запас (~-6 dBFS) под голос
out = sys.argv[1] if len(sys.argv) > 1 else 'bed.wav'
from scipy.io import wavfile
wavfile.write(out, SR, (mix * 32767).astype(np.int16))
print('wrote', out)
