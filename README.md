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
- `assets/video/` — video de 60 s (1280×720), subtitulado y sin locución; texto en `subtitulos.txt`. El video es independiente de la web.
- `tools/` — regenerar música y video: `node tools/render_video.js <dir>` y luego `ffmpeg` (requiere numpy, espeak-ng, ffmpeg y Playwright).

## Notas
- El video usa subtítulos y música original sintetizada con código (`tools/gen_music.py`).
- Una comparación antes/después muestra un cambio observado; el Brand Lift incremental requiere un grupo de control válido.
