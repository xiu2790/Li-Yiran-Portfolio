(function(){
  const style=document.createElement('style');
  style.textContent='.osaka-ad{position:absolute;left:50%;top:8%;transform:translateX(-50%);width:min(760px,86vw);max-height:84vh;background:#c0c0c0;border:3px outset #fff;padding:30px 8px 8px;z-index:240;box-shadow:8px 10px #00164355;overflow:hidden}.osaka-ad .bar{position:absolute;inset:0 0 auto;height:24px;background:linear-gradient(90deg,navy,#1084d0);color:#fff;padding:4px 6px;font:bold 12px Tahoma;cursor:grab}.osaka-poster{position:relative;width:100%;aspect-ratio:16/9;overflow:hidden;border:2px inset #888;background:#111}.osaka-poster>img{display:block;width:100%;height:100%;object-fit:contain}.osaka-stars{position:absolute;inset:0;pointer-events:none}.osaka-star{position:absolute;color:#fff;font-size:22px;text-shadow:0 0 6px #fff,0 0 12px #ffdd66;animation:osakaTwinkle 1.6s infinite ease-in-out}.osaka-star:nth-child(1){top:12%;left:10%}.osaka-star:nth-child(2){top:24%;left:72%;animation-delay:.4s}.osaka-star:nth-child(3){top:66%;left:42%;animation-delay:.8s}.osaka-star:nth-child(4){top:46%;left:84%;animation-delay:.2s}.osaka-star:nth-child(5){top:78%;left:22%;animation-delay:.6s}.osaka-star:nth-child(6){top:14%;left:54%;animation-delay:1s}@keyframes osakaTwinkle{0%,100%{opacity:.2;transform:scale(.85)}50%{opacity:1;transform:scale(1.2)}}.osaka-hit{position:absolute;pointer-events:none;animation:osakaPulse 1.2s ease-in-out infinite}.osaka-cta{left:40%;top:73%;width:18%;height:10%}.osaka-recommend{left:78%;top:35%;width:15%;height:14%;animation:osakaRecommend 1s ease-in-out infinite}.osaka-cup{left:70%;top:47%;width:16%;height:30%;animation:osakaSway 2s ease-in-out infinite;transform-origin:bottom center}.osaka-fan{left:23%;top:23%;width:16%;height:16%;animation:osakaFan 1.6s ease-in-out infinite;transform-origin:bottom center}@keyframes osakaPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.06)}}@keyframes osakaRecommend{0%,100%{transform:scale(1) rotate(-4deg)}50%{transform:scale(1.07) rotate(-4deg)}}@keyframes osakaSway{0%,100%{transform:rotate(-1.2deg)}50%{transform:rotate(1.2deg)}}@keyframes osakaFan{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}';
  document.head.appendChild(style);
  style.textContent += '.osaka-ad{left:auto;right:4%;top:18%;transform:none;width:45vw;max-width:900px}.osaka-poster{aspect-ratio:658/369}.osaka-poster canvas{display:block;width:100%;height:100%}.osaka-hit{display:none}@media(max-width:700px){.osaka-ad{right:2%;width:94vw;max-width:none}}';
  const win=document.createElement('section');win.id='osakaAd';win.className='window osaka-ad';win.hidden=true;win.innerHTML='<div class="bar">大阪丸 / TINY KOMARU JAPANESE</div><button class="close" aria-label="关闭大阪丸广告">×</button><div class="osaka-poster"><img src="osaka-poster.png" alt="大阪丸广告海报"><div class="osaka-stars"><span class="osaka-star">✧</span><span class="osaka-star">✧</span><span class="osaka-star">✧</span><span class="osaka-star">✧</span><span class="osaka-star">✧</span><span class="osaka-star">✧</span></div><div class="osaka-hit osaka-cta"></div><div class="osaka-hit osaka-recommend"></div><div class="osaka-hit osaka-cup"></div><div class="osaka-hit osaka-fan"></div></div>';document.body.appendChild(win);
  let z=260,drag=null;const bar=win.querySelector('.bar');bar.onpointerdown=e=>{e.preventDefault();win.style.zIndex=++z;const r=win.getBoundingClientRect();drag={x:e.clientX-r.left,y:e.clientY-r.top};bar.setPointerCapture(e.pointerId)};bar.onpointermove=e=>{if(!drag)return;win.style.left=Math.max(4,Math.min(innerWidth-win.offsetWidth-4,e.clientX-drag.x))+'px';win.style.top=Math.max(4,Math.min(innerHeight-win.offsetHeight-38,e.clientY-drag.y))+'px';win.style.transform='none'};bar.onpointerup=bar.onpointercancel=()=>{drag=null;parent.postMessage({type:'roam-focus'},'*')};win.querySelector('.close').onclick=()=>win.hidden=true;addEventListener('message',e=>{if(e.data?.type==='osaka-open'){win.hidden=false;win.style.zIndex=++z}if(e.data?.type==='osaka-close')win.hidden=true});
  const sound=new Audio('osaka-sound.mp4');
  sound.preload='none';sound.volume=.7;
  addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='osaka-open'){sound.currentTime=0;sound.play().catch(()=>{});}});
  const poster=win.querySelector('.osaka-poster');
  const original=poster.querySelector('img');
  const canvas=document.createElement('canvas');
  canvas.width=658;canvas.height=369;canvas.setAttribute('aria-label','大阪丸动态广告海报');
  const ctx=canvas.getContext('2d');
  original.after(canvas);original.style.display='none';
  // Deform the original bitmap as a continuous mesh so moving regions leave no holes.
  function point(x,y,t){
    let dx=0,dy=0;
    const region=(cx,cy,rx,ry,move)=>{
      const d=Math.max(Math.abs((x-cx)/rx),Math.abs((y-cy)/ry));
      if(d>=1)return;
      const weight=d<.7?1:(1-d)/.3;
      const delta=move(x-cx,y-cy);dx+=delta[0]*weight;dy+=delta[1]*weight;
    };
    region(333,299,76,30,(a,b)=>{const s=.045*(1+Math.sin(t*5));return[a*s,b*s]});
    region(561,112,88,64,(a,b)=>{const s=.035*(1+Math.sin(t*5.5));return[a*s,b*s]});
    region(340,165,65,45,(a,b)=>[Math.sin(t*4.5)*.8,-3.5*(1+Math.sin(t*4.5))]);
    region(526,263,78,94,(a,b)=>{const r=.018*Math.sin(t*3);return[-(b-70)*r,a*r]});
    return[x+dx,y+dy];
  }
  function triangle(a,b,c,A,B,C){
    const den=a[0]*(b[1]-c[1])+b[0]*(c[1]-a[1])+c[0]*(a[1]-b[1]);
    const coeff=(v)=>[(v[0]*(b[1]-c[1])+v[1]*(c[1]-a[1])+v[2]*(a[1]-b[1]))/den,(v[0]*(c[0]-b[0])+v[1]*(a[0]-c[0])+v[2]*(b[0]-a[0]))/den,(v[0]*(b[0]*c[1]-c[0]*b[1])+v[1]*(c[0]*a[1]-a[0]*c[1])+v[2]*(a[0]*b[1]-b[0]*a[1]))/den];
    const u=coeff([A[0],B[0],C[0]]),v=coeff([A[1],B[1],C[1]]);
    ctx.save();ctx.beginPath();ctx.moveTo(...A);ctx.lineTo(...B);ctx.lineTo(...C);ctx.closePath();ctx.clip();ctx.setTransform(u[0],v[0],u[1],v[1],u[2],v[2]);ctx.drawImage(original,0,0,658,369);ctx.restore();
  }
  let lastFrame=0;
  function animate(ms){
    requestAnimationFrame(animate);
    if(win.hidden||!original.complete||!original.naturalWidth||ms-lastFrame<40)return;
    lastFrame=ms;ctx.drawImage(original,0,0,658,369);
    for(let y=0;y<369;y+=12)for(let x=0;x<658;x+=12){
      const a=[x,y],b=[Math.min(x+12,658),y],c=[x,Math.min(y+12,369)],d=[b[0],c[1]];
      const A=point(...a,ms/1000),B=point(...b,ms/1000),C=point(...c,ms/1000),D=point(...d,ms/1000);
      triangle(a,b,c,A,B,C);triangle(b,d,c,B,D,C);
    }
  }
  requestAnimationFrame(animate);
  style.textContent += `
    .osaka-poster .osaka-cta{display:block;pointer-events:auto;left:40.5%;top:74%;width:20%;height:13%;padding:0;border:0;background:transparent;animation:none;cursor:pointer;z-index:3}
    .osaka-cta:focus-visible{outline:3px dashed navy;outline-offset:3px}
    .osaka-gallery{position:fixed;inset:2vh 2vw 42px;z-index:2000;background:silver;border:3px outset white;padding:30px 7px 26px;box-shadow:6px 8px #00164355}
    .osaka-gallery[hidden]{display:none}
    .osaka-gallery-title{position:absolute;inset:0 0 auto;height:25px;padding:4px 28px 4px 7px;background:linear-gradient(90deg,navy,#1084d0);color:white;font:bold 13px Tahoma}
    .osaka-gallery-view{height:100%;overflow-x:auto;overflow-y:hidden;background:#fff8d9;border:2px inset white;scrollbar-width:thin;touch-action:pan-x}
    .osaka-gallery-track{display:flex;gap:24px;width:max-content;height:100%;padding:18px}
    .osaka-gallery figure{margin:0;flex:none;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}
    .osaka-gallery img{height:calc(100% - 32px);width:auto;max-width:none;object-fit:contain;user-select:none}
    .osaka-gallery figcaption{font:12px Tahoma;color:navy}
    .osaka-gallery-status{position:absolute;bottom:4px;left:10px;font:12px Tahoma;color:#222}
  `;
  const entry=document.createElement('button');
  entry.className='osaka-hit osaka-cta';entry.setAttribute('aria-label','点击进入大阪丸作品展示');
  poster.querySelector('.osaka-cta').replaceWith(entry);
  const gallery=document.createElement('section');gallery.className='osaka-gallery';gallery.hidden=true;
  gallery.setAttribute('role','dialog');gallery.setAttribute('aria-modal','true');gallery.setAttribute('aria-label','大阪丸作品展示');
  gallery.innerHTML='<div class="osaka-gallery-title">大阪丸 / DESIGN GALLERY</div><button class="close" aria-label="关闭作品展示">×</button><div class="osaka-gallery-view" tabindex="0" aria-label="横向图片展示"><div class="osaka-gallery-track"></div></div><div class="osaka-gallery-status">鼠标左右移动控制方向与速度 · 中央暂停 · Esc 返回</div>';
  document.body.append(gallery);
  const view=gallery.querySelector('.osaka-gallery-view'),track=gallery.querySelector('.osaka-gallery-track');
  const images=[['osaka-gallery-3.webp','大阪丸 / 色彩与品牌形象'],['osaka-gallery-2.webp','大阪丸 / 设计背景与市场分析'],['osaka-gallery-4.webp','大阪丸 / 包装与角色设计'],['osaka-gallery-6.webp','大阪丸 / 品牌应用展示']];
  // Repeat the same sequence to provide continuous scrolling in both directions.
  for(let cycle=0;cycle<3;cycle++)for(const [src,label] of images){
    const figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption');
    img.width=src==='osaka-gallery-2.webp'?3834:3840;img.height=1080;
    img.dataset.src=src;img.decoding='async';img.alt=label;img.draggable=false;caption.textContent=label;figure.append(img,caption);track.append(figure);
    if(cycle!==1)figure.setAttribute('aria-hidden','true');
  }
  let speed=45,previousTime=0;
  const period=()=>track.children[images.length].offsetLeft-track.children[0].offsetLeft;
  entry.onclick=()=>{
    gallery.hidden=false;gallery.querySelectorAll('img[data-src]').forEach(image=>{image.loading='eager';image.src=image.dataset.src;delete image.dataset.src;});speed=45;previousTime=0;
    parent.postMessage({type:'archive-state',open:true},'*');
    requestAnimationFrame(()=>{view.scrollLeft=period();gallery.querySelector('.close').focus()});
  };
  function closeGallery(){gallery.hidden=true;parent.postMessage({type:'archive-state',open:false},'*');entry.focus();}
  gallery.querySelector('.close').onclick=closeGallery;
  gallery.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();closeGallery();}
    if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();speed=e.key==='ArrowLeft'?-160:160;}
    if(e.key==='Tab'){const items=[gallery.querySelector('.close'),view],next=items.indexOf(document.activeElement)+(e.shiftKey?-1:1);e.preventDefault();items[(next+2)%2].focus();}
  });
  view.addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;const r=view.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*2-1;speed=Math.abs(x)<.13?0:Math.sign(x)*Math.pow((Math.abs(x)-.13)/.87,1.5)*520;});
  view.addEventListener('pointerleave',()=>speed=45);
  view.addEventListener('wheel',e=>{e.preventDefault();speed=0;view.scrollLeft+=e.deltaX||e.deltaY;},{passive:false});
  function scrollGallery(time){
    requestAnimationFrame(scrollGallery);
    if(gallery.hidden){previousTime=0;return;}
    const dt=previousTime?Math.min((time-previousTime)/1000,.05):0;previousTime=time;
    const length=period();if(length<=0)return;
    view.scrollLeft+=speed*dt;
    if(view.scrollLeft<length*.5)view.scrollLeft+=length;
    else if(view.scrollLeft>length*1.5)view.scrollLeft-=length;
  }
  requestAnimationFrame(scrollGallery);
})();
