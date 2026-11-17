# PRISA Brand Pulse

Presentación web interactiva sobre cómo medir cambios en la recordación de marca antes y después de una campaña (ejemplo ficticio: LOS40 + Colcafé). Todos los datos son simulados.

**Sitio:** https://caracolco.github.io/prisa-brand-pulse/

## Uso
Sitio estático, sin build ni dependencias (solo la fuente Inter vía Google Fonts, con respaldo del sistema).
```
python3 -m http.server 8000   # y abrir http://localhost:8000
```
GitHub Pages: Settings → Pages → Deploy from branch `main` / root.

## Contenido
- `index.html`, `css/`, `js/` — la web. Los datos del tablero están en `js/data.js`.
- `assets/audio/` — preroll, cuña y notas de voz ficticias.
- `assets/video/` — video de 60 s (1280×720) y guion.
- `tools/` — regenerar audios y video: `python3 tools/gen_audio.py`, `python3 tools/gen_narration.py <dir>`, `node tools/render_video.js <dir>` y luego `ffmpeg` (requiere numpy, espeak-ng, ffmpeg y Playwright).

## Notas
- La voz es sintética (espeak-ng, es-419): sirve como guía. Para producción, grabar el guion de `assets/video/guion.txt`.
- La música es original, sintetizada con código.
- Una comparación antes/después muestra un cambio observado; el Brand Lift incremental requiere un grupo de control válido.
