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
  $('#stepVis').innerHTML=`<div style="width:100%;max-width:440px"><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;align-items:end;height:180px;border-bottom:1px solid var(--line)">${bars.map(b=>`<div style="height:${b[3]?b[1]*3.2:4}px;background:${b[3]?b[2]:'#ffffff14'};border-radius:10px 10px 0 0;transition:height .8s var(--ease)"></div>`).join('')}</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px;text-align:center;margin-top:10px">${bars.map(b=>`<div style="font-size:13px;color:var(--ink2);min-height:56px">${b[0]}<br><b style="color:#fff;font-size:20px">${b[3]?b[1]+'%':'&nbsp;'}</b></div>`).join('')}</div></div>`;
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
const res={ig:[[27,38,20,15],[21,52,15,12]],yt:[[28,35,22,15],[22,47,18,13]],tt:[[30,31,24,15],[24,42,19,15]]};
const teaser=`<div class="fakevid"><div class="mic">LOS40</div><div class="cup"></div><div class="cap"><b>Los Impresentables</b> · con Colcafé</div></div>`;
const phone=inner=>`<div class="phone"><div class="scr">${inner}</div></div>`;
const hl=t=>t.replace(/(colcaf[eé])/ig,'<mark>$1</mark>');
const USERS=['sofi','andres_m','cami','dj_jota','lau','mateo','vale'];
const POOL={
 tt:{0:['Café Sol 🔥','alguien sabe qué canción es?','buenos días Bogotá','saludos desde Cali','pon reggaetón','tinto y música','Aroma Andes jaja','Colcafé siempre','el café de mi casa es el de la tienda','qué sueño'],
     2:['Colcafé para el desvelo','yo con mi colcafé ☕','Café Sol, el de siempre','saludos Medellín','colcafé y rumba','tinto y música','buenos días','Aroma Andes','qué buena la mención de Colcafé','pon reggaetón']},
 yt:{0:['hola Bogotá','saludos desde Cali','Café Sol 🔥','esa canción 🔥','Colcafé, el de la casa','buen programa','tinto sin azúcar','Aroma Andes','👏👏','buenos días'],
     2:['Colcafé en el programa!','hola Bogotá','yo tomo colcafé ☕','Café Sol siempre','esa canción 🔥','colcafé y Los Impresentables','buen programa','Aroma Andes','saludos desde Cali','👏👏']}};
function stream(host,pool,counter,ms=850,max=9){
  let k=0,n=0,h=0;clearInterval(host._t);
  host._t=setInterval(()=>{
    if(!document.body.contains(host)){clearInterval(host._t);return}
    const t=pool[k%pool.length],u=USERS[k%USERS.length];k++;n++;const hit=/colcaf/i.test(t);if(hit)h++;
    host.insertAdjacentHTML('beforeend',`<div class="${hit?'hit':''}"><b>${u}</b>${t}</div>`);
    if(host.children.length>max)host.firstChild.remove();
    if(counter)counter.textContent=`Colcafé en ${h} de ${n} comentarios`;
  },ms);
}
/* radio */
const RSUB={
 esp:[['Los Impresentables quieren saber de ustedes.','Escríbannos por WhatsApp al +57 300 000 0000.','¿Qué marcas de café se les vienen a la cabeza?','Los mejores mensajes salen al aire.'],
      ['Los Impresentables llegan con Colcafé.','Arranca la mañana con el café de siempre.','Cuña de 9 s · 6 emisiones en la semana.'],
      ['Seguimos con la pregunta del día.','¿Qué marca de café recuerdan haber escuchado hoy en el programa?','Escríbannos por WhatsApp al +57 300 000 0000.']],
 asi:[['Una pregunta rápida, desde su WhatsApp.','¿Qué marca de café recuerdan haber escuchado esta semana?','Respondan: 1 Café Sol, 2 Colcafé, 3 Aroma Andes, 4 Otra.'],
      ['Los Impresentables llegan con Colcafé.','Arranca la mañana con el café de siempre.','Cuña de 9 s · 6 emisiones en la semana.'],
      ['La misma pregunta de la semana pasada.','¿Qué marca de café recuerdan haber escuchado?','Respondan 1, 2, 3 o 4 por WhatsApp.']]};
const RMSG={
 esp:{0:[['Camila','Café Sol, el de toda la vida','Otra marca'],['Andrés','Aroma Andes','Otra marca'],['Sofi','el que haga mi mamá jaja','Sin marca'],['Juan','Colcafé','Colcafé']],
      2:[['Camila','Colcafé!! lo dijeron en el programa','Colcafé'],['Andrés','Colcafé y Café Sol','Colcafé'],['Sofi','el de Los Impresentables, Colcafé','Colcafé'],['Juan','Aroma Andes','Otra marca']]},
 asi:{0:[['Camila','1','Café Sol'],['Andrés','2','Colcafé'],['Sofi','4','Otra'],['Juan','2','Colcafé']],
      2:[['Camila','2','Colcafé'],['Andrés','2','Colcafé'],['Sofi','3','Aroma Andes'],['Juan','2','Colcafé']]}};
const RADIO_SVG=`<svg class="rsvg" viewBox="0 -14 240 190" width="230" aria-hidden="true"><line x1="150" y1="34" x2="192" y2="6" stroke="#FFCB00" stroke-width="5" stroke-linecap="round"/><path class="w1" d="M202 -2q10 8 0 16" fill="none" stroke="#FFCB00" stroke-width="4" stroke-linecap="round"/><path class="w2" d="M212 -10q16 14 0 28" fill="none" stroke="#FFCB00" stroke-width="4" stroke-linecap="round"/><rect x="10" y="34" width="200" height="132" rx="24" fill="#1b222b" stroke="#FFCB00" stroke-width="5"/><circle cx="72" cy="100" r="42" fill="#0a0c10" stroke="#ffffff30" stroke-width="3"/><circle class="sp" cx="72" cy="100" r="28" fill="none" stroke="#FFCB00" stroke-width="3"/><circle class="sp s2" cx="72" cy="100" r="15" fill="none" stroke="#FD006E" stroke-width="3"/><circle cx="72" cy="100" r="5" fill="#FFCB00"/><rect x="132" y="62" width="64" height="26" rx="7" fill="#0a0c10"/><text x="164" y="81" text-anchor="middle" fill="#FFCB00" font-family="Inter,sans-serif" font-weight="900" font-size="15">LOS40</text><circle cx="148" cy="130" r="13" fill="#FD006E"/><circle cx="186" cy="130" r="13" fill="#0096DC"/></svg>`;
const LABS={
 ig:{title:'Instagram',lead:'Historia asistida antes. Contenido de Colcafé en Los Impresentables durante. La misma historia después del contenido.',ac:'#FD006E',
  st:[['Antes','Historia asistida'],['Durante','Contenido de la campaña'],['Después','Historia asistida']],
  r:(i,box)=>{
    if(i==1){box.innerHTML=phone(`<div class="prog"><i id="pg"></i></div><div class="s-top"><div class="av">L40</div>los40co · Reel</div>${teaser}`);setTimeout(()=>{const p=$('#pg');if(p){p.style.transition='width 8s linear';p.style.width='100%'}},60)}
    else{box.innerHTML=phone(`<div class="prog"><i style="width:35%"></i></div><div class="s-top"><div class="av">L40</div>los40co · ${i?'hoy':'hace 7 días'}</div><div class="story">${poll(Q,brands)}</div>`);bindPoll($('.poll',box),res.ig[i/2|0])}}},
 radio:{title:'Radio',lead:'Convocatoria al aire, mensajes por WhatsApp y la misma pregunta después. Abierta (espontánea) y con opciones (asistida).',ac:'#FFCB00',
  st:[['Antes','Convocatoria al aire'],['Durante','Mención de Colcafé'],['Después','Misma convocatoria']],
  r:(i,box,mode)=>{
    const subs=RSUB[mode][i],msgs=i==1?null:RMSG[mode][i];
    box.innerHTML=`<div class="rad"><div class="rcard">${RADIO_SVG}<div class="rcap" id="rcap"></div><div class="rdots">${subs.map(()=>'<i></i>').join('')}</div></div>
     <div class="wapanel"><div class="wahd">${i==1?'Qué buscamos':'Mensajes por WhatsApp · lo que buscamos'}</div><div class="wam" id="wam"></div>
     <div class="lg">${mode=='esp'?'<span>Mención de Colcafé sin ayuda</span><span>Primera marca nombrada</span>':'<span>Opción elegida (1–4)</span><span>Una respuesta por persona</span>'}</div></div></div>`;
    const cap=$('#rcap',box),dots=$$('.rdots i',box);let k=0;
    const show=()=>{cap.style.animation='none';cap.offsetWidth;cap.style.animation='';cap.textContent=subs[k];dots.forEach((d,x)=>d.classList.toggle('on',x===k))};
    show();clearInterval(box._t);box._t=setInterval(()=>{if(!document.body.contains(cap)){clearInterval(box._t);return}k=(k+1)%subs.length;show()},3200);
    if(msgs){const w=$('#wam',box);msgs.forEach((m,x)=>setTimeout(()=>{if(!document.body.contains(w))return;w.insertAdjacentHTML('beforeend',`<div class="b-out"><span><b>${m[0]}</b> ${hl(m[1])}</span><em class="${m[2]==='Colcafé'?'y':''}">${m[2]}</em></div>`)},700+x*900))}
    else $('#wam',box).innerHTML='<div class="b-in" style="max-width:100%">Los mensajes se miden en las ventanas de antes y después, no durante la mención.</div>'}},
 tt:{title:'TikTok Live',lead:'Pregunta asistida en el live y comentarios del chat (espontánea), antes y después del contenido de Colcafé.',ac:'#2fd27a',
  st:[['Antes','Asistida + comentarios'],['Durante','Contenido de la campaña'],['Después','Asistida + comentarios']],
  r:(i,box,mode)=>{
    if(i==1){box.innerHTML=phone(`<div class="tt"><div class="live">● LIVE</div><div style="position:absolute;top:70px;left:10px;right:10px;bottom:70px;border-radius:14px;overflow:hidden;display:flex">${teaser}</div></div>`);return}
    if(mode=='asi'){box.innerHTML=phone(`<div class="tt"><div class="live">● LIVE</div><div style="padding:0 14px 40px">${poll(Q,brands)}</div></div>`);bindPoll($('.poll',box),res.tt[i/2|0])}
    else{box.innerHTML=phone(`<div class="tt"><div class="live">● LIVE</div><div class="cnt" id="cnt"></div><div style="position:absolute;top:92px;left:14px;right:14px;text-align:center;font-weight:900;font-size:21px;letter-spacing:-.02em;line-height:1.1">${i?'¿Qué marca de café recuerdas haber visto esta semana?':'¿Qué café tomas en la mañana?'}<div style="font-size:11px;font-weight:600;color:#ffffffa0;margin-top:6px">Escríbelo en el chat</div></div><div class="cm" id="cm"></div></div>`);stream($('#cm',box),POOL.tt[i],$('#cnt',box))}}},
 yt:{title:'YouTube Live',lead:'Encuesta nativa de selección múltiple y comentarios del chat (espontánea), antes y después del contenido de Colcafé.',ac:'#ff5a3c',
  st:[['Antes','Encuesta + comentarios'],['Durante','Contenido de la campaña'],['Después','Encuesta + comentarios']],
  r:(i,box,mode)=>{
    const esp=mode=='esp'&&i!=1;
    const live='<div style="position:absolute;top:10px;left:10px;background:#f00;font-size:10px;font-weight:800;padding:2px 6px;border-radius:4px">● EN VIVO</div>';
    const chat='<div class="chat" id="chat">'+(esp?'':['👏👏','buen programa','saludos desde Cali','esa canción 🔥','hola Bogotá'].map(t=>`<div><b>user</b> ${t}</div>`).join(''))+'</div>';
    let v;
    if(i==1)v=`<div class="mic" style="width:70px;height:70px;font-size:12px">LOS40</div>${live}<div class="cup" style="bottom:14px"></div><div class="cap" style="right:70px">Los Impresentables · <b>Colcafé</b></div>`;
    else if(esp)v=`<div class="mic" style="width:70px;height:70px;font-size:12px">LOS40</div>${live}<div class="cnt" id="cnt" style="top:10px;right:10px;left:auto"></div><div class="cap" style="bottom:12px;font-size:13px;text-align:center"><b>${i?'¿Qué marca de café recuerdas haber visto esta semana?':'¿Qué café tomas en la mañana?'}</b><br>Escríbelo en el chat</div>`;
    else v=`<div class="mic" style="width:70px;height:70px;font-size:12px">LOS40</div>${live}<div class="poll"><h4 style="font-size:13px;margin-bottom:6px">${Q}</h4>${brands.map(b=>`<button class="opt"><i></i><span>${b}</span><span></span></button>`).join('')}</div>`;
    box.innerHTML=`<div class="yt ${esp?'esp':''}"><div class="v">${v}</div>${chat}</div>`;
    if(i!=1&&!esp)bindPoll($('.poll',box),res.yt[i/2|0]);
    if(esp)stream($('#chat',box),POOL.yt[i],$('#cnt',box),800,12)}}
};
Object.entries(LABS).forEach(([id,c])=>{
  const d=P(id),mets=[['esp','Espontánea'],['asi','Asistida']].filter(m=>d[m[0]]);
  const el=$('#lab-'+id);let mode=d.asi?'asi':'esp',stage=0;
  el.innerHTML=`<div class="rv"><div class="eyebrow">${c.title}</div><h2>${c.title}</h2><p class="lead">${c.lead}</p>
   <div class="chips" style="margin-top:16px">${mets.map(m=>`<span class="chip">${m[1]}</span>`).join('')}</div>
   <div class="flow">${c.st.map((s,i)=>`<button style="--ac:${c.ac}" data-i="${i}"><small>${s[0]}</small><b>${s[1]}</b></button>`).join('')}</div>
   <div class="kpis">${mets.map(m=>`<div><b>${d[m[0]][0]}% → <em style="color:${c.ac};font-style:normal">${d[m[0]][1]}%</em></b><span>${m[1]} · antes → durante</span></div>`).join('')}<div><b>${fmt(d.n[1])}</b><span>respuestas durante la campaña</span></div></div>
   <p class="sim">Simulación. Datos ficticios.</p></div>
   <div class="stage rv" style="flex-direction:column;align-items:center;gap:18px">${mets.length>1?`<div class="seg" id="md-${id}">${mets.map(m=>`<button data-v="${m[0]}" class="${m[0]===mode?'on':''}">${m[1]}</button>`).join('')}</div>`:''}<div id="st-${id}" style="width:100%;display:flex;justify-content:center"></div></div>`;
  watch(el);
  const box=$('#st-'+id),md=$('#md-'+id);
  const go=()=>{$$('.flow button',el).forEach((b,k)=>b.classList.toggle('on',k===stage));if(md)md.style.visibility=stage==1&&id!=='radio'?'hidden':'visible';c.r(stage,box,mode)};
  $('.flow',el).addEventListener('click',e=>{const b=e.target.closest('button');if(b){stage=+b.dataset.i;go()}});
  if(md)md.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;mode=b.dataset.v;$$('button',md).forEach(x=>x.classList.toggle('on',x===b));go()});
  go();
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
