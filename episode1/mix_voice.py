"""Сведение озвучки с готовым видео.

Положи реплики в папку (по умолчанию episode1/voice/) с именами по id из voice_lines.json:
  01.mp3, 02.mp3, ... 26.mp3   (подойдут .mp3/.wav/.m4a; недостающие просто пропускаются)

python3 mix_voice.py [папка_с_голосом] [выход.mp4]

- каждая реплика ставится на свой тайм-код;
- реплика "her_whisper" обрабатывается как шёпот из-за двери (глушится и уходит в реверб);
- музыка/эффекты автоматически приглушаются под голос (sidechain);
- скрипт предупреждает, если реплика не успевает закончиться до следующей.
"""
import json, os, subprocess, sys

HERE = os.path.dirname(os.path.abspath(__file__))
vdir = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, 'voice')
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, '..', 'output', 'episode1_voiced.mp4')
video = os.path.join(HERE, '..', 'output', 'episode1.mp4')
bed = os.path.join(HERE, '..', 'output', 'bed.wav')
CUT = 113.6

lines = json.load(open(os.path.join(HERE, 'voice_lines.json')))


def dur(f):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f]).strip())


inputs, chains, labels = ['-i', video, '-i', bed], [], []
k = 2
for i, ln in enumerate(lines):
    f = next((os.path.join(vdir, ln['id'] + e) for e in ('.mp3', '.wav', '.m4a', '.ogg') if os.path.exists(os.path.join(vdir, ln['id'] + e))), None)
    if not f:
        continue
    d = dur(f)
    nxt = lines[i + 1]['start'] if i + 1 < len(lines) else CUT
    if ln['start'] + d > nxt + 0.05:
        print(f"! реплика {ln['id']} длится {d:.2f}s и залезает на следующую на {ln['start'] + d - nxt:.2f}s — ускорь её или сократи паузы")
    ms = int(ln['start'] * 1000)
    fx = 'highpass=f=80,acompressor=threshold=-18dB:ratio=3:attack=5:release=80'
    if ln['who'] == 'her_whisper':
        fx = 'highpass=f=300,lowpass=f=2200,volume=0.55,aecho=0.8:0.6:40|70:0.35|0.25'
    chains.append(f'[{k}:a]aresample=48000,aformat=channel_layouts=stereo,{fx},adelay={ms}|{ms}[v{k}]')
    labels.append(f'[v{k}]')
    inputs += ['-i', f]
    k += 1

if not labels:
    sys.exit('Нет файлов озвучки в ' + vdir)

g = ';'.join(chains)
g += f";{''.join(labels)}amix=inputs={len(labels)}:normalize=0,volume=1.6,asplit=2[voice][sc]"
g += ';[1:a][sc]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[duck]'
g += f";[duck][voice]amix=inputs=2:normalize=0,atrim=0:{CUT},apad,alimiter=limit=0.95[a]"
cmd = ['ffmpeg', '-y', *inputs, '-filter_complex', g, '-map', '0:v', '-map', '[a]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', out]
subprocess.check_call(cmd)
print('готово:', out)
