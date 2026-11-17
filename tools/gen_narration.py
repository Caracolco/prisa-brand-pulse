"""Narración del video (espeak-ng es-419) + música original. Salida: audio mezclado 60 s."""
import sys,json,subprocess,numpy as np
sys.path.insert(0,'tools'); import gen_audio as G
LINES=[ # (inicio s, texto)
 (0.6,"¿Cuánta gente recuerda una marca después de una campaña? Casi siempre se mide tarde, o no se mide."),
 (7.2,"PRISA Brand Pulse usa lo que la audiencia ya hace: votar en una historia, responder por WhatsApp, comentar un live o contestar en el reproductor."),
 (16.8,"El método es simple. Una pregunta antes, la campaña, la misma pregunta después, y una tercera a los siete días, para ver si el recuerdo se sostiene."),
 (27.4,"Aquí, LOS40 y Colcafé: Instagram, radio, TikTok, YouTube, streaming y display. Recordación espontánea y asistida, por separado."),
 (41.0,"Todo llega a un tablero: antes, después y día siete, por plataforma, con tamaño de muestra y margen de error."),
 (50.0,"Ojo: comparar antes y después muestra un cambio, no una causa. Para hablar de Brand Lift hace falta un grupo de control. Eso es PRISA Brand Pulse.")]
out=sys.argv[1]; T=60; parts=[]; info=[]
for i,(st,tx) in enumerate(LINES):
    p=f"{out}/l{i}.wav"; G.tts(tx,p,182,42); v=G.load(p); st=0.4 if i==0 else info[-1][0]+info[-1][1]+0.45; info.append((st,len(v)/G.SR,tx)); parts.append((st,v*1.0))
voice=G.mix(parts,T)
music=G.bed(T,.09,92)
# ducking sencillo: música baja cuando hay voz
env=np.ones(len(music))*1.0
for st,d,_ in info: env[int(st*G.SR):int((st+d)*G.SR)]=.45
k=np.ones(4410)/4410; env=np.convolve(env,k,'same')
fade=np.minimum(1,np.minimum(np.arange(len(music))/(2*G.SR),(len(music)-np.arange(len(music)))/(2*G.SR)))
mix=voice/np.abs(voice).max()*.9+music/np.abs(music).max()*.5*env*fade
G.save(mix,"mix.mp3") if False else None
import wave
mix=mix/np.abs(mix).max()*.92
with wave.open(f"{out}/mix.wav","w") as w:
    w.setnchannels(1);w.setsampwidth(2);w.setframerate(G.SR);w.writeframes((mix*32767).astype(np.int16).tobytes())
json.dump(info,open(f"{out}/timing.json","w"),ensure_ascii=False)
open('assets/video/guion.txt','w').write("\n\n".join(f"[{s:04.1f}–{s+d:04.1f} s] {t}" for s,d,t in info))
for s,d,t in info: print(f"{s:5.1f} → {s+d:5.1f}  {t[:50]}")
