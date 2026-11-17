"""Genera audios ficticios (voz espeak-ng es-419 + música sintetizada con numpy). Requiere: numpy, ffmpeg, espeak-ng."""
import numpy as np, subprocess, wave, os, json, sys
SR=44100; OUT=sys.argv[1] if len(sys.argv)>1 else "assets/audio"; os.makedirs(OUT,exist_ok=True)
def tts(text,path,speed=150,pitch=45,voice="es-419"):
    subprocess.run(["espeak-ng","-v",voice,"-s",str(speed),"-p",str(pitch),"-g","2","-w",path,text],check=True)
def load(path):
    with wave.open(path) as w:
        n=w.getnframes(); d=np.frombuffer(w.readframes(n),dtype=np.int16).astype(np.float32)/32768; sr=w.getframerate()
    t=np.linspace(0,len(d)/sr,int(len(d)*SR/sr),endpoint=False)
    return np.interp(t,np.arange(len(d))/sr,d)
def save(x,name):
    x=x/max(1e-9,np.abs(x).max())*0.92; p=os.path.join(OUT,name)
    tmp=p+".wav"
    with wave.open(tmp,"w") as w:
        w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((x*32767).astype(np.int16).tobytes())
    subprocess.run(["ffmpeg","-y","-loglevel","error","-i",tmp,"-b:a","128k",p],check=True); os.remove(tmp)
def note(f,d,vol=.3,kind="pluck"):
    t=np.arange(int(d*SR))/SR
    env=np.exp(-t*(4 if kind=="pluck" else 1.2))*(1-np.exp(-t*60))
    s=np.sin(2*np.pi*f*t)+.4*np.sin(2*np.pi*2*f*t)+.15*np.sin(2*np.pi*3*f*t)
    return s*env*vol
def mix(parts,total):
    out=np.zeros(int(total*SR)+SR)
    for st,x in parts:
        i=int(st*SR)
        if i>=len(out): continue
        x=x[:len(out)-i]; out[i:i+len(x)]+=x
    return out[:int(total*SR)]
def jingle(start=0,vol=.35):
    f=[392,494,587,784,988]; return [(start+i*.14,note(x,.9,vol)) for i,x in enumerate(f)]
def bed(total,vol=.12,bpm=96):
    chords=[[220,261.6,329.6],[174.6,220,261.6],[261.6,329.6,392],[196,246.9,293.7]]
    beat=60/bpm; parts=[]
    for bar in range(int(total/(beat*4))+1):
        c=chords[bar%4]
        for k in range(8):
            parts.append((bar*beat*4+k*beat/2,note(c[k%3]*(2 if k%2 else 1),.6,vol*(1.0 if k%2==0 else .7))))
        parts.append((bar*beat*4,note(c[0]/2,beat*3.5,vol*1.4,"pad")))
    return mix(parts,total)
if __name__=="__main__":
    t="/tmp/_t.wav"
    # Preroll audio Colcafé (15 s aprox.)
    tts("Colcafé. Lo que arranca tu mañana.",t,140,50); v=load(t)
    tts("Y con Los Impresentables, mejor.",t,140,50); v2=load(t)
    tot=11; save(mix([(0,bed(tot,.1))]+jingle(0,.3)+[(1.2,v*.9),(4.8,v2*.9)]+jingle(8,.3),tot),"preroll_colcafe.mp3")
    # Cuña / mención radio
    tts("Los Impresentables llegan con Colcafé. Arranca la mañana con el café de siempre.",t,150,45); v=load(t)
    tot=9; save(mix([(0,bed(tot,.08,100))]+[(.4,v)]+jingle(7,.25),tot),"cuna_radio.mp3")
    # Notas de voz: preguntas por WhatsApp
    tts("Oye, parcero, una pregunta rápida para el programa. Cuando piensas en café, ¿qué marcas se te vienen a la cabeza? Respóndenos por aquí.",t,150,40,"es-419"); save(load(t),"pregunta_whatsapp.mp3")
    tts("Seguimos con la pregunta del día. ¿Qué marca de café recuerdas haber escuchado hoy en el programa? Escríbenos por WhatsApp.",t,150,40,"es-419"); save(load(t),"pregunta_post.mp3")
