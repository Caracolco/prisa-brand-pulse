(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const PL=PB.platforms,P=id=>PL.find(p=>p.id===id);
const fmt=n=>n.toLocaleString('es-CO');
/* ---------- nav / reveal ---------- */
const secs=$$('section[data-t]');
$('#dots').innerHTML=secs.map(s=>`<li><a href="#${s.id}" title="${s.dataset.t}" aria-label="${s.dataset.t}"></a></li>`).join('');
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
const watch=r=>$$('.rv',r).forEach(el=>io.observe(el));watch(document);
const so=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)$$('#dots a').forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id))}),{rootMargin:'-45% 0px -50% 0px'});
secs.forEach(s=>so.observe(s));
addEventListener('scroll',()=>{$('#bar').style.width=(scrollY/(document.body.scrollHeight-innerHeight)*100)+'%'},{passive:true});
/* ---------- audio ---------- */
let cur=null;
function playAudio(src,onend,onstart,ontime){
  if(cur){cur.pause();cur.dispatchEvent(new Event('stopped'))}
  const a=new Audio(src);cur=a;a.addEventListener('ended',()=>{onend&&onend()});a.addEventListener('stopped',()=>{});
  if(ontime)a.addEventListener('timeupdate',()=>ontime(a.currentTime/a.duration));
  a.play().then(()=>onstart&&onstart()).catch(()=>{onend&&onend()});return a;
}
const stopAudio=()=>{if(cur){cur.pause();cur=null}};
const seg=(id,cb)=>{const el=$(id);el.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;$$('button',el).forEach(x=>x.classList.toggle('on',x===b));cb(b.dataset.v)})};
const brands=['Café Sol','Colcafé','Aroma Andes','Otra'];
function drawQ(m){
  const q=$('#qdemo'),d={esp:P('radio').esp,asi:P('ig').asi};
  if(m==='esp'){q.innerHTML=`<div style="font-size:11px;font-weight:800;color:#999;letter-spacing:.1em">SIN OPCIONES</div><div style="font-weight:900;font-size:19px;letter-spacing:-.02em;line-height:1.1">Cuando piensas en café, ¿qué marca te viene primero?</div><div id="ty" style="border:2px solid #111;border-radius:12px;padding:12px;min-height:46px;font-weight:700"></div><div style="margin-top:auto"><div style="font-size:40px;font-weight:900;letter-spacing:-.04em;color:#FD006E">${d.esp[1]} %</div><div style="font-size:12px;color:#555">nombran Colcafé sin ayuda, después de la campaña</div></div>`;
    const t='Colcafé',el=$('#ty');let i=0;clearInterval(drawQ.t);drawQ.t=setInterval(()=>{el.textContent=t.slice(0,++i)+'▍';if(i>=t.length){clearInterval(drawQ.t);el.textContent=t}},220);
  }else{
    q.innerHTML=`<div style="font-size:11px;font-weight:800;color:#999;letter-spacing:.1em">CON OPCIONES</div><div style="font-weight:900;font-size:19px;letter-spacing:-.02em;line-height:1.1">¿Cuáles de estas marcas reconoces?</div>${brands.map(b=>`<div style="border:2px solid #111;border-radius:12px;padding:11px 12px;font-weight:700;display:flex;justify-content:space-between" class="qo">${b}<span>○</span></div>`).join('')}<div style="margin-top:auto"><div style="font-size:40px;font-weight:900;letter-spacing:-.04em;color:#0096DC">${d.asi[1]} %</div><div style="font-size:12px;color:#555">reconocen Colcafé con ayuda, después de la campaña</div></div>`;
    $$('.qo',q).forEach((o,i)=>setTimeout(()=>{if(brands[i]==='Colcafé'||i==0){o.style.background='#111';o.style.color='#fff';o.lastChild.textContent='●'}},500+i*350));
  }
}
seg('#modeSeg',drawQ);drawQ('esp');
/* ---------- momentos ---------- */
const ST=[
 {i:'Antes',t:'Antes',c:'#0096DC',d:'Una pregunta base en cada plataforma. Es el punto de partida.',o:'Línea base'},
 {i:'Campaña',t:'Durante la campaña',c:'#FD006E',d:'Colcafé aparece en LOS40. Al terminar el contenido, se repite la misma pregunta.',o:'Misma pregunta'},
 {i:'Día 7',t:'7 días después',c:'#2fd27a',d:'Una vez más, para ver si el recuerdo se sostiene o se apaga.',o:'Persistencia'}];
$('#steps').innerHTML=ST.map((s,i)=>`<button style="--ac:${s.c}" data-i="${i}"><i>${s.i}</i><b>${s.t}</b></button>`).join('');
function step(n){
  $$('#steps button').forEach((b,i)=>b.classList.toggle('on',i===n));$('#sp').style.width=((n+1)/3*100)+'%';
  const s=ST[n],d=P('ig').asi;
  $('#stepInfo').innerHTML=`<div class="eyebrow" style="color:${s.c}">${s.i}</div><h3 style="font-size:32px;margin:10px 0">${s.t}</h3><p style="color:var(--ink2)">${s.d}</p><div class="chip on" style="margin-top:18px;display:inline-block">${s.o}</div>`;
  const bars=[['Antes',d[0],'#0096DC',n>=0],['Durante',d[1],'#FD006E',n>=1],['7 días después',d[2],'#2fd27a',n>=2]];
  $('#stepVis').innerHTML=`<div style="display:flex;gap:18px;align-items:flex-end;height:170px;width:100%;justify-content:center">${bars.map(b=>`<div style="text-align:center;font-size:12px;color:var(--ink2);width:84px"><div style="height:${b[3]?b[1]*2.6:4}px;background:${b[3]?b[2]:'#ffffff14'};border-radius:10px 10px 3px 3px;transition:height .8s var(--ease)"></div>${b[0]}${b[3]?`<br><b style="color:#fff;font-size:16px">${b[1]}%</b>`:''}</div>`).join('')}</div>`;
}
$('#steps').addEventListener('click',e=>{const b=e.target.closest('button');if(b){clearInterval(stp);sn=+b.dataset.i;step(sn)}});
let sn=0,stp=setInterval(()=>{sn=(sn+1)%3;step(sn)},3800);step(0);
/* ---------- labs ---------- */
function bindPoll(root,res){
  $$('.opt',root).forEach(b=>b.addEventListener('click',()=>{
    if(root.dataset.done)return;root.dataset.done=1;
    $$('.opt',root).forEach((o,i)=>{o.classList.toggle('me',o===b);o.firstElementChild.style.width=res[i]+'%';o.lastElementChild.textContent=res[i]+'%'});
  }));
}
const poll=(q,o)=>`<div class="poll"><h4>${q}</h4>${o.map(x=>`<button class="opt"><i></i><span>${x}</span><span></span></button>`).join('')}<div style="font-size:10px;color:#888;margin-top:8px;text-align:center">Toca una opción · orden aleatorio</div></div>`;
const Q='¿Qué marca de café recuerdas haber visto esta semana?';
const res={tt:[[30,31,24,15],[24,42,19,15]],ig:[[27,38,20,15],[21,52,15,12]],yt:[[28,35,22,15],[22,47,18,13]],st:[[27,40,20,13],[19,55,16,10]],dp:[[29,33,23,15],[26,41,20,13]]};
const vn=(label)=>`<div class="b-in"><div class="vn"><button class="play">▶</button><div class="wv">${Array.from({length:24},(_,i)=>`<i style="height:${6+Math.abs(Math.sin(i*1.7))*16}px"></i>`).join('')}</div></div><div style="font-size:10px;opacity:.6;margin-top:3px">${label}</div></div>`;
const bar=(w,c='var(--yellow)')=>`<div class="tr"><i style="background:${c}"></i></div>`;
const teaser=`<div class="fakevid"><div class="mic">LOS40</div><div class="cup"></div><div class="cap"><b>Los Impresentables</b> · con Colcafé</div></div>`;
const phone=(inner,extra='')=>`<div class="phone"><div class="scr">${inner}</div></div>`;
const rep=(a,s)=>[a,s];
const waReplies={0:[['Camila','Café Sol, el de toda la vida'],['Andrés','Aroma Andes'],['Sofi','el que haga mi mamá jaja'],['Juan','Colcafé']],2:[['Camila','Colcafé!! lo dijeron en el programa'],['Andrés','Colcafé y Café Sol'],['Sofi','el de Los Impresentables, Colcafé'],['Juan','Aroma Andes']]};
const _ttp={0:['Café Sol 🔥','alguien sabe qué canción es?','buenos días Bogotá','saludos desde Cali','pon reggaetón','tinto y música','un cafecito pa la mañana','Aroma Andes jaja'],2:['Colcafé para el desvelo','yo con mi colcafé ☕','qué buena la mención de Colcafé','saludos Medellín','pon reggaetón','tinto y música','café sol siempre','buenos días'],1:['jajaja los impresentables','qué risa','colcafé en el programa!','🔥🔥🔥','saludos','el locutor está durísimo']};
const LABS={
 ig:{num:'04',title:'Instagram',lead:'Historia asistida antes. Contenido de Colcafé en Los Impresentables durante. La misma historia después del contenido.',ac:'#FD006E',
  st:[['Antes','Historia asistida'],['Durante','Contenido de la campaña'],['Después','Historia asistida']],
  r:(i,box)=>{
    if(i==1){box.innerHTML=phone(`<div class="prog"><i id="pg"></i></div><div class="s-top"><div class="av">L40</div>los40co · Reel</div>${teaser}`);setTimeout(()=>{const p=$('#pg');if(p){p.style.transition='width 8s linear';p.style.width='100%'}},60)}
    else{box.innerHTML=phone(`<div class="prog"><i style="width:35%"></i></div><div class="s-top"><div class="av">L40</div>los40co · ${i?'hoy':'hace 7 días'}</div><div class="story">${poll(Q,brands.map((b,k)=>b))}</div>`);bindPoll($('.poll',box),res.ig[i/2|0])}}},
 radio:{num:'05',title:'Radio',lead:'Pregunta por WhatsApp. Cuña o mención de Colcafé. Nueva pregunta durante el programa.',ac:'#FFCB00',
  st:[['Antes','Pregunta por WhatsApp'],['Durante','Cuña al aire'],['Después','Nueva pregunta']],
  r:(i,box)=>{
    if(i==1){box.innerHTML=phone(`<div class="dial"><div style="font-size:11px;letter-spacing:.2em;color:var(--ink3)">EN VIVO</div><div class="fm">LOS40</div><div class="wv" id="rw" style="height:50px;width:70%">${Array.from({length:30},(_,k)=>`<i style="height:${10+Math.abs(Math.sin(k*1.3))*40}px;background:#FFCB00"></i>`).join('')}</div><button class="btn" id="rp" style="background:var(--yellow)">▶ Escuchar cuña</button><div style="font-size:11px;color:var(--ink3)">9 s · audio ficticio</div></div>`);
      $('#rp').onclick=()=>{$('#rw').classList.add('playing');playAudio('assets/audio/cuna_radio.mp3',()=>$('#rw').classList.remove('playing'))}}
    else{box.innerHTML=phone(`<div class="wa"><div class="hd"><div class="av">L40</div>Los Impresentables</div><div class="msgs" id="msgs">${vn(i?'Pregunta del día · 9:42':'Pregunta · 7:15')}</div></div>`);
      const m=$('#msgs');$('.play',m).onclick=()=>{const b=$('.vn',m);b.classList.add('playing');playAudio(i?'assets/audio/pregunta_post.mp3':'assets/audio/pregunta_whatsapp.mp3',()=>{b.classList.remove('playing');waReplies[i].forEach((r,k)=>setTimeout(()=>{m.insertAdjacentHTML('beforeend',`<div class="b-out"><b style="font-size:10px;opacity:.7">${r[0]}</b><br>${r[1]}</div>`)},k*650))})}}}},
 tt:{num:'06',title:'TikTok Live',lead:'Pregunta asistida en el live antes. Contenido de Colcafé durante. La misma pregunta después del contenido.',ac:'#2fd27a',
  st:[['Antes','Pregunta asistida'],['Durante','Contenido de la campaña'],['Después','Pregunta asistida']],
  r:(i,box)=>{
    if(i==1)box.innerHTML=phone(`<div class="tt"><div class="live">● LIVE</div><div style="position:absolute;top:70px;left:10px;right:10px;bottom:70px;border-radius:14px;overflow:hidden;display:flex">${teaser}</div></div>`);
    else{box.innerHTML=phone(`<div class="tt"><div class="live">● LIVE</div><div style="padding:0 14px 40px">${poll(Q,brands)}</div></div>`);bindPoll($('.poll',box),res.tt[i/2|0])}}},
 yt:{num:'07',title:'YouTube Live',lead:'Encuesta nativa de selección múltiple antes. Contenido de Colcafé durante. La misma encuesta después.',ac:'#ff5a3c',
  st:[['Antes','Encuesta nativa'],['Durante','Colcafé en la transmisión'],['Después','Misma encuesta']],
  r:(i,box)=>{
    const chat=['👏👏','buen programa','saludos desde Cali','esa canción 🔥','hola Bogotá'].map(t=>`<div><b style="color:#aaa">user</b> ${t}</div>`).join('');
    box.innerHTML=`<div class="yt"><div class="v"><div class="mic" style="width:70px;height:70px;font-size:12px">LOS40</div><div style="position:absolute;top:10px;left:10px;background:#f00;font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px">● EN VIVO</div>${i==1?'<div class="cup" style="bottom:14px"></div><div class="cap" style="right:70px">Los Impresentables · <b>Colcafé</b></div>':`<div class="poll"><h4 style="font-size:13px;margin-bottom:6px">${Q}</h4>${brands.map(b=>`<button class="opt"><i></i><span>${b}</span><span></span></button>`).join('')}</div>`}</div><div class="chat">${chat}</div></div>`;
    if(i!=1)bindPoll($('.poll',box),res.yt[i/2|0])}},
 st:{num:'08',title:'Streaming',lead:'Preroll de audio y pregunta dentro del reproductor.',ac:'#0096DC',
  st:[['Antes','Pregunta en el player'],['Durante','Preroll de audio'],['Después','Pregunta tras el anuncio']],
  r:(i,box)=>{
    const art=`<div class="art">LOS40</div><div><b>Radio en vivo</b><div style="font-size:12px;color:var(--ink3)">LOS40 Colombia</div></div>`;
    if(i==1){box.innerHTML=phone(`<div class="pl">${art}<div class="ad"><b>Anuncio · Colcafé</b><div class="tr" style="margin:8px 0"><i id="ap"></i></div><button class="btn" id="pp" style="padding:9px 16px;font-size:13px">▶ Escuchar preroll</button></div><div style="font-size:11px;color:var(--ink3)">Preroll de 11 s · audio ficticio</div></div>`);
      $('#pp').onclick=()=>playAudio('assets/audio/preroll_colcafe.mp3',()=>{$('#ap').style.width='100%'},null,f=>{$('#ap').style.width=f*100+'%'})}
    else{box.innerHTML=phone(`<div class="pl">${art}${poll(Q,brands)}</div>`);bindPoll($('.poll',box),res.st[i/2|0])}}}
};
Object.entries(LABS).forEach(([id,c])=>{
  const d=P(id),m=d.asi?'asi':'esp',n=d.n;
  const el=$('#lab-'+id);
  el.innerHTML=`<div class="rv"><div class="eyebrow">${c.title}</div><h2>${c.title}</h2><p class="lead">${c.lead}</p>
   <div class="chips" style="margin-top:16px">${d.esp?'<span class="chip">Espontánea</span>':''}${d.asi?'<span class="chip">Asistida</span>':''}</div>
   <div class="flow">${c.st.map((s,i)=>`<button style="--ac:${c.ac}" data-i="${i}"><small>${s[0]}</small><b>${s[1]}</b></button>`).join('')}</div>
   <div class="kpis"><div><b>${d[m][0]}% → <em style="color:${c.ac};font-style:normal">${d[m][1]}%</em></b><span>${m=='asi'?'asistida':'espontánea'} · antes → después</span></div><div><b>${fmt(n[1])}</b><span>respuestas posteriores</span></div></div>
   <p class="sim">Simulación. Datos ficticios.</p></div><div class="stage rv" id="st-${id}"></div>`;
  watch(el);
  const box=$('#st-'+id);
  const go=i=>{stopAudio();$$('.flow button',el).forEach((b,k)=>b.classList.toggle('on',k===i));c.r(i*(id==='ig'||id==='yt'||id==='st'||id==='dp'?1:1),box);if(id==='ig'&&i==0){}};
  // stage index -> res index: 0 previa,2 posterior
  el.querySelector('.flow').addEventListener('click',e=>{const b=e.target.closest('button');if(b)go(+b.dataset.i)});
  go(0);
});
/* ---------- 10 dashboard ---------- */
let dp='all',dm='esp';
$('#dPl').innerHTML=[{id:'all',short:'Todas'},...PL].map(p=>`<button class="chip ${p.id==='all'?'on':''}" data-id="${p.id}">${p.short}</button>`).join('');
$('#dPl').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;dp=b.dataset.id;$$('#dPl .chip').forEach(x=>x.classList.toggle('on',x===b));draw()});
seg('#dMet',v=>{dm=v;draw()});
const moe=(p,n)=>1.96*Math.sqrt(p/100*(1-p/100)/n)*100;
function agg(){
  const ps=(dp==='all'?PL:[P(dp)]).filter(p=>p[dm]);if(!ps.length)return null;
  const o={v:[0,0,0],n:[0,0,0]};
  [0,1,2].forEach(k=>{const N=ps.reduce((s,p)=>s+p.n[k],0);o.n[k]=N;o.v[k]=ps.reduce((s,p)=>s+p[dm][k]*p.n[k],0)/N});
  return o;
}
function draw(){
  const a=agg(),gb=$('#gb');
  if(!a){gb.innerHTML=`<div style="grid-column:1/-1;align-self:center;text-align:center;color:var(--ink3)">No aplica: este formato no mide recordación ${dm==='esp'?'espontánea':'asistida'}.<br>Cambia de métrica.</div>`;$('#lbls').innerHTML='';$('#drow').innerHTML='';$('#dwarn').textContent='';return}
  const max=dm==='esp'?20:70;
  const vals=a.v;
  const me=a.v.map((v,k)=>moe(v,a.n[k])),mes=me;
  const cols=['#0096DC','#FFCB00','#2fd27a'],lb=['Antes','Durante la campaña','7 días después'];
  gb.innerHTML=vals.map((v,k)=>`<div class="c"><div class="bar" style="height:0;background:${cols[k]}" data-h="${v/max*100}"></div><div class="wh" style="bottom:0;height:0" data-b="${(v-mes[k])/max*100}" data-t="${2*mes[k]/max*100}"></div><em style="position:absolute;left:0;right:0;text-align:center;font-style:normal;font-weight:900;font-size:22px;bottom:calc(${(v+mes[k])/max*100}% + 6px)">${v.toFixed(1)}%</em></div>`).join('');
  requestAnimationFrame(()=>requestAnimationFrame(()=>{$$('#gb .bar').forEach(b=>b.style.height=b.dataset.h+'%');$$('#gb .wh').forEach(w=>{w.style.bottom=w.dataset.b+'%';w.style.height=w.dataset.t+'%'})}));
  $('#lbls').innerHTML=lb.map(x=>`<div>${x}</div>`).join('');
  const d1=vals[1]-vals[0],d2=vals[2]-vals[0],sig=Math.abs(d1)>Math.hypot(mes[0],mes[1]);
  const ret=d1?Math.round(d2/d1*100):0;
  $('#drow').innerHTML=`<div class="dchip"><b style="color:#FFCB00">${d1>=0?'+':''}${d1.toFixed(1)} pp</b><span>observado en campaña</span></div><div class="dchip"><b style="color:#2fd27a">${d2>=0?'+':''}${d2.toFixed(1)} pp</b><span>a los 7 días</span></div><div class="dchip"><b>${ret}%</b><span>del efecto se sostiene</span></div><div class="dchip"><b>${fmt(a.n[1])}</b><span>respuestas posteriores</span></div>`;
  $('#dwarn').textContent='Cambio observado: no separa la campaña de otros factores; para atribuirlo hace falta un grupo de control. '+(sig?'Supera el margen de error.':'Está dentro del margen de error.');
}
draw();
/* ---------- 12 risks ---------- */
const RK=[
 ['Baja participación','Alta','Pocas respuestas ensanchan el margen de error y hacen ruido en la lectura.','Pregunta de un toque, dentro del flujo. Mínimo ~400 respuestas por medición; si no se alcanza, ampliar la ventana. Mostrar siempre el n.'],
 ['Resultados negativos para PRISA','Media','La campaña puede mover poco o nada la recordación, y eso pone a prueba la relación con el anunciante.','Acordar antes qué se mide y cómo se lee. Presentarlo como aprendizaje: qué formato, mensaje o audiencia funcionó. Leer por plataforma y no prometer un resultado.']];
const sc={Crítica:'#FD006E',Alta:'#FFCB00',Media:'#0096DC'};
$('#rk').innerHTML=RK.map(r=>`<details class="rv"><summary><span>${r[0]}</span><span class="chip" style="color:${sc[r[1]]};border-color:${sc[r[1]]}66;margin-left:auto;font-size:12px">${r[1]}</span></summary><div class="in2"><div><b style="color:var(--pink)">Riesgo</b>${r[2]}</div><div><b style="color:var(--green)">Mitigación</b>${r[3]}</div></div></details>`).join('');
watch(document);
})();
