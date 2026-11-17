"""Música original de fondo (60 s), sintetizada con numpy. Uso: python3 tools/gen_music.py salida.wav"""
import sys, wave, numpy as np
OUTF = sys.argv[1]; sys.argv = sys.argv[:1]
sys.path.insert(0, 'tools'); import gen_audio as G
T = 60; m = G.bed(T, .11, 92); n = len(m)
fade = np.minimum(1, np.minimum(np.arange(n) / (2 * G.SR), (n - np.arange(n)) / (3 * G.SR)))
m = m * fade; m = m / np.abs(m).max() * .8
with wave.open(OUTF, "w") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(G.SR); w.writeframes((m * 32767).astype(np.int16).tobytes())
