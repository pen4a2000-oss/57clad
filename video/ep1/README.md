# Серия 1 — видео без озвучки

- `ep1_bez_ozvuchki.mp4` — 1080×1920, 117,5 сек: анимация, субтитры, музыка и звуковые эффекты. Тайминг субтитров совпадает с текстом озвучки из `scripts/seriya-1-final.md`.
- `src/` — исходники: `ep1.html` (анимация на canvas), `render.js` (рендер кадров через Playwright + ffmpeg), `audio.py` (музыка и эффекты на numpy), шрифт Montserrat (лицензия OFL).

Пересборка:
```
cd src
node render.js video 117.5        # -> video_noaudio.mp4
python3 audio.py                  # -> sfx_music.wav
ffmpeg -i sfx_music.wav -af loudnorm=I=-16:TP=-1.5 sfx_music_norm.wav
ffmpeg -i video_noaudio.mp4 -i sfx_music_norm.wav -c:v copy -c:a aac -b:a 192k -shortest ep1.mp4
```

Когда будет озвучка: голос кладётся поверх, а музыку и эффекты лучше приглушить примерно на 6 дБ.
Пасхалка с ассасином — 42,4–44,2 сек (обелиск справа на заднем плане).
