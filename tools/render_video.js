// node tools/render_video.js <frames_dir> : captura 24 fps de tools/video.html
const {chromium}=require('playwright');const path=require('path');
(async()=>{const out=process.argv[2],fps=24,T=60;const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:720}});
await p.goto('file://'+path.resolve('tools/video.html'));await p.waitForTimeout(500);
for(let i=0;i<fps*T;i++){await p.evaluate(t=>seek(t),i/fps);await p.screenshot({path:`${out}/f${String(i).padStart(4,'0')}.jpg`,type:'jpeg',quality:90});}
await b.close()})();
