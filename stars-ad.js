(() => {
  const style=document.createElement('style');
  style.textContent=`
    #starsAd{position:fixed;right:4%;top:18%;width:45vw;max-width:900px;padding:30px 8px 8px;background:silver;border:3px outset white;box-shadow:7px 9px #00164355;z-index:290;touch-action:none}
    #starsAd[hidden]{display:none}
    #starsAd .bar{height:24px;background:linear-gradient(90deg,navy,#1084d0);color:white;padding:4px 30px 4px 6px;font:bold 12px Tahoma;cursor:grab}
    #starsAd .close{z-index:5;width:20px;height:20px;top:2px}
    .stars-poster{position:relative;overflow:hidden;border:2px inset #888;aspect-ratio:658/370;background:#03070b}
    .stars-poster>img{display:block;width:100%;height:100%;object-fit:fill}
    .stars-sparkles{position:absolute;inset:0;pointer-events:none}
    .stars-sparkles span{position:absolute;color:#fff9d9;font-size:clamp(12px,1.5vw,23px);text-shadow:0 0 7px #b4dfff;animation:starsTwinkle var(--duration) ease-in-out infinite;animation-delay:var(--delay)}
    @keyframes starsTwinkle{0%,100%{opacity:.1;transform:scale(.55)}50%{opacity:.95;transform:scale(1.15)}}
    .stars-action{position:absolute;display:block;padding:0;border:0;background:transparent;overflow:hidden;border-radius:999px;z-index:2;animation:starsPulse 1.9s ease-in-out infinite;transform-origin:center;cursor:pointer}
    .stars-action img{position:absolute;max-width:none;pointer-events:none}
    .stars-action:focus-visible{outline:3px solid #ffde78;outline-offset:4px}
    @keyframes starsPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.065)}}
    @media(max-width:700px){#starsAd{right:2%;top:12%;width:94vw;max-width:none}}
    @media(prefers-reduced-motion:reduce){.stars-action,.stars-sparkles span{animation:none}}
  `;
  document.head.append(style);
  const win=document.createElement('section');win.id='starsAd';win.className='window';win.hidden=true;
  win.setAttribute('role','dialog');win.setAttribute('aria-label','星穹永调广告');
  win.innerHTML='<div class="bar">星穹永调 / TRANSFORMED PLANE</div><button class="close" type="button" aria-label="关闭星穹永调广告">×</button><div class="stars-poster"><img src="stars-poster.png" alt="星穹咏调游戏项目海报"><div class="stars-sparkles" aria-hidden="true"></div></div>';
  document.body.append(win);
  const poster=win.querySelector('.stars-poster');
  const stars=win.querySelector('.stars-sparkles');
  [[7,7],[40,12],[67,6],[91,6],[37,48],[9,72],[46,85],[64,94],[85,54]].forEach(([x,y],i)=>{
    const star=document.createElement('span');star.textContent='✦';star.style.cssText='left:'+x+'%;top:'+y+'%;--duration:'+(2+i%3*.6)+'s;--delay:-'+i*.39+'s';stars.append(star);
  });
  // Crop each visible label at its original coordinates; animate the actual artwork.
  function label(text,y,link){
    const x=49,width=165,height=45;
    const el=document.createElement(link?'a':'button');el.className='stars-action';el.setAttribute('aria-label',text);
    if(link){el.href=link;el.target='_blank';el.rel='noopener noreferrer';el.title=text+'（新标签页）';}else{el.type='button';}
    el.style.cssText='left:'+x/658*100+'%;top:'+y/370*100+'%;width:'+width/658*100+'%;height:'+height/370*100+'%;animation-delay:'+(link?'-.6s':'0s');
    const img=document.createElement('img');img.src='stars-poster.png';img.alt='';img.style.cssText='width:'+658/width*100+'%;height:'+370/height*100+'%;left:'+(-x/width*100)+'%;top:'+(-y/height*100)+'%';el.append(img);poster.append(el);
  }
  label('点击查看',201);label('前往前传',279,'https://zeerda.itch.io/time-to-scale');
  let drag=null;const bar=win.querySelector('.bar');
  bar.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();const r=win.getBoundingClientRect();drag={x:e.clientX-r.left,y:e.clientY-r.top};bar.setPointerCapture(e.pointerId)};
  bar.onpointermove=e=>{if(!drag)return;win.style.right='auto';win.style.left=Math.max(0,Math.min(innerWidth-win.offsetWidth,e.clientX-drag.x))+'px';win.style.top=Math.max(0,Math.min(innerHeight-60,e.clientY-drag.y))+'px'};
  const release=()=>{drag=null;parent.postMessage({type:'roam-focus'},'*')};bar.onpointerup=bar.onpointercancel=release;bar.onlostpointercapture=()=>drag=null;
  win.querySelector('.close').onclick=()=>{win.hidden=true;release()};
  addEventListener('message',e=>{if(e.source!==parent)return;if(e.data?.type==='stars-open')win.hidden=false;if(e.data?.type==='stars-close')win.hidden=true;});
  const sound=new Audio('osaka-sound.mp4');sound.preload='auto';sound.volume=.7;
  addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='stars-open'){sound.currentTime=0;sound.play().catch(()=>{});}});
  style.textContent += `
    .stars-cta:focus-visible{outline:3px dashed navy;outline-offset:3px}
    .stars-gallery{position:fixed;inset:2vh 2vw 42px;z-index:99999;background:silver;border:3px outset white;padding:30px 7px 26px;box-shadow:6px 8px #00164355}
    .stars-gallery[hidden]{display:none}
    .stars-gallery .close{z-index:5;width:22px;height:20px;pointer-events:auto}
    .stars-gallery-title{position:absolute;inset:0 0 auto;height:25px;padding:4px 28px 4px 7px;background:linear-gradient(90deg,navy,#1084d0);color:white;font:bold 13px Tahoma}
    .stars-gallery-view{height:100%;overflow-x:auto;overflow-y:hidden;background:#090c16;border:2px inset white;scrollbar-width:thin;touch-action:pan-x}
    .stars-gallery-track{display:flex;gap:24px;width:max-content;height:100%;padding:18px}
    .stars-gallery figure{margin:0;flex:none;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}
    .stars-gallery img{height:calc(100% - 32px);width:auto;max-width:none;object-fit:contain;user-select:none}
    .stars-gallery figcaption{font:12px Tahoma;color:#eee3af}
    .stars-gallery-status{position:absolute;bottom:4px;left:10px;font:12px Tahoma;color:#222}
  `;
  const entry=poster.querySelector('button.stars-action');
  const gallery=document.createElement('section');gallery.className='stars-gallery';gallery.hidden=true;
  gallery.setAttribute('role','dialog');gallery.setAttribute('aria-modal','true');gallery.setAttribute('aria-label','星穹永调作品展示');
  gallery.innerHTML='<div class="stars-gallery-title">星穹永调 / DESIGN GALLERY</div><button class="close" aria-label="关闭作品展示">×</button><div class="stars-gallery-view" tabindex="0" aria-label="横向图片展示"><div class="stars-gallery-track"></div></div><div class="stars-gallery-status">鼠标左右移动控制方向与速度 · 中央暂停 · Esc 返回</div>';
  document.body.append(gallery);
  const view=gallery.querySelector('.stars-gallery-view'),track=gallery.querySelector('.stars-gallery-track');
  const images=[['stars-gallery-2.png','星穹永调 / 创意研究与角色设计'],['stars-gallery-6.png','星穹永调 / 游戏流程与核心机制'],['stars-gallery-1.png','星穹永调 / 项目介绍与玩法流程']];
  // Repeat the same sequence to provide continuous scrolling in both directions.
  for(let cycle=0;cycle<3;cycle++)for(const [src,label] of images){
    const figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption');
    img.width=3840;img.height=1080;
    img.addEventListener('load',()=>{img.width=img.naturalWidth;img.height=img.naturalHeight;});
    img.src=src;img.alt=label;img.draggable=false;caption.textContent=label;figure.append(img,caption);track.append(figure);
    if(cycle!==1)figure.setAttribute('aria-hidden','true');
  }
  let speed=45,previousTime=0;
  const period=()=>track.children[images.length].offsetLeft-track.children[0].offsetLeft;
  entry.onclick=()=>{
    gallery.hidden=false;speed=45;previousTime=0;
    parent.postMessage({type:'archive-state',open:true},'*');
    requestAnimationFrame(()=>{view.scrollLeft=period();gallery.querySelector('.close').focus()});
  };
  function closeGallery(){gallery.hidden=true;parent.postMessage({type:'archive-state',open:false},'*');entry.focus();}
  gallery.querySelector('.close').onclick=closeGallery;
  gallery.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();e.stopPropagation();closeGallery();}
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
