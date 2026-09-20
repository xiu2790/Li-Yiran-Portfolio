(() => {
  const style=document.createElement('style');
  style.textContent=`
  #yuequAd{position:fixed;left:auto;right:4%;top:18%;width:45vw;max-width:900px;padding:30px 8px 8px;background:silver;border:3px outset white;box-shadow:7px 9px #00164355;z-index:270;touch-action:none}
  #yuequAd[hidden]{display:none}
  #yuequAd .bar{height:24px;background:linear-gradient(90deg,navy,#1084d0);color:white;padding:4px 25px 4px 6px;font:bold 12px Tahoma;cursor:grab}
  .yuequ-poster{position:relative;aspect-ratio:658/370;overflow:hidden;border:2px inset #888;background:#faffd6}
  .yuequ-poster canvas{display:block;width:100%;height:100%}
  .yuequ-stars{position:absolute;inset:0;pointer-events:none}
  .yuequ-stars span{position:absolute;color:white;font-size:25px;text-shadow:0 0 5px white,0 0 12px #eaff8c;animation:yuequTwinkle 1.8s ease-in-out infinite}
  @keyframes yuequTwinkle{0%,100%{opacity:.2;transform:scale(.65)}50%{opacity:1;transform:scale(1.2)}}
  @media(max-width:700px){#yuequAd{right:2%;width:94vw;max-width:none;top:12%}}
  @media(prefers-reduced-motion:reduce){.yuequ-stars span{animation:none}}
  `;
  document.head.append(style);
  const win=document.createElement('section');win.id='yuequAd';win.className='window';win.hidden=true;
  win.setAttribute('role','dialog');win.setAttribute('aria-label','椰趣广告');
  win.innerHTML='<div class="bar">椰趣 / YEKOO CAMPING COCO</div><button class="close" aria-label="关闭椰趣广告">×</button><div class="yuequ-poster"><canvas width="658" height="369" role="img" aria-label="椰趣轻露营广告海报"></canvas><div class="yuequ-stars" aria-hidden="true"></div></div>';
  document.body.append(win);
  const stars=win.querySelector('.yuequ-stars');
  [[47,11],[69,10],[5,59],[40,62],[92,64],[55,29]].forEach(([x,y],i)=>{const star=document.createElement('span');star.textContent='✧';star.style.cssText='left:'+x+'%;top:'+y+'%;animation-delay:'+i*.27+'s';stars.append(star)});
  const bar=win.querySelector('.bar');let drag=null;
  bar.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();const r=win.getBoundingClientRect();drag={x:e.clientX-r.left,y:e.clientY-r.top};bar.setPointerCapture(e.pointerId)});
  bar.addEventListener('pointermove',e=>{if(!drag)return;win.style.right='auto';win.style.left=Math.max(0,Math.min(innerWidth-win.offsetWidth,e.clientX-drag.x))+'px';win.style.top=Math.max(0,Math.min(innerHeight-60,e.clientY-drag.y))+'px'});
  const release=()=>{drag=null;parent.postMessage({type:'roam-focus'},'*')};
  bar.addEventListener('pointerup',release);bar.addEventListener('pointercancel',release);bar.addEventListener('lostpointercapture',()=>drag=null);
  win.querySelector('.close').onclick=()=>{win.hidden=true;release()};
  addEventListener('message',e=>{if(e.source!==parent)return;if(e.data?.type==='yuequ-open')win.hidden=false;if(e.data?.type==='yuequ-close')win.hidden=true;});
  const original=new Image();original.src='yuequ-poster.png';
  const canvas=win.querySelector('canvas'),ctx=canvas.getContext('2d');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  function point(x,y,t){
    if(reduced.matches)return[x,y];
    let dx=0,dy=0;
    function region(cx,cy,rx,ry,move){const d=Math.max(Math.abs((x-cx)/rx),Math.abs((y-cy)/ry));if(d>=1)return;const w=d<.65?1:(1-d)/.35;const delta=move(x-cx,y-cy);dx+=delta[0]*w;dy+=delta[1]*w;}
    region(108,246,90,88,(a,b)=>{const s=.018*(1+Math.sin(t*2.8));return[a*s,b*s]});
    region(575,339,79,28,(a,b)=>{const s=.03*(1+Math.sin(t*4));return[a*s,b*s]});
    region(581,199,73,87,(a,b)=>{const r=.016*Math.sin(t*2.3);return[-(b-66)*r,a*r]});
    region(493,127,61,48,(a,b)=>{const r=.012*Math.sin(t*2.3+.6);return[-(b-40)*r,a*r]});
    region(393,229,36,66,(a,b)=>{const r=.017*Math.sin(t*2.1+.9);return[-(b-48)*r,a*r]});
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


  const sound=new Audio('osaka-sound.mp4');sound.preload='none';sound.volume=.7;
  addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='yuequ-open'){sound.currentTime=0;sound.play().catch(()=>{});}});
  const poster=win.querySelector('.yuequ-poster');
  style.textContent += `
    .yuequ-poster .yuequ-cta{display:block;pointer-events:auto;position:absolute;left:75%;top:85%;width:23%;height:14%;padding:0;border:0;background:transparent;animation:none;cursor:pointer;z-index:3}
    .yuequ-cta:focus-visible{outline:3px dashed navy;outline-offset:3px}
    .yuequ-gallery{position:fixed;inset:2vh 2vw 42px;z-index:2000;background:silver;border:3px outset white;padding:30px 7px 26px;box-shadow:6px 8px #00164355}
    .yuequ-gallery[hidden]{display:none}
    .yuequ-gallery-title{position:absolute;inset:0 0 auto;height:25px;padding:4px 28px 4px 7px;background:linear-gradient(90deg,navy,#1084d0);color:white;font:bold 13px Tahoma}
    .yuequ-gallery-view{height:100%;overflow-x:auto;overflow-y:hidden;background:#effff3;border:2px inset white;scrollbar-width:thin;touch-action:pan-x}
    .yuequ-gallery-track{display:flex;gap:24px;width:max-content;height:100%;padding:18px}
    .yuequ-gallery figure{margin:0;flex:none;height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px}
    .yuequ-gallery img{height:calc(100% - 32px);width:auto;max-width:none;object-fit:contain;user-select:none}
    .yuequ-gallery figcaption{font:12px Tahoma;color:navy}
    .yuequ-gallery-status{position:absolute;bottom:4px;left:10px;font:12px Tahoma;color:#222}
  `;
  const entry=document.createElement('button');
  entry.className='yuequ-hit yuequ-cta';entry.setAttribute('aria-label','点击进入椰趣作品展示');
  poster.append(entry);
  const gallery=document.createElement('section');gallery.className='yuequ-gallery';gallery.hidden=true;
  gallery.setAttribute('role','dialog');gallery.setAttribute('aria-modal','true');gallery.setAttribute('aria-label','椰趣作品展示');
  gallery.innerHTML='<div class="yuequ-gallery-title">椰趣 / DESIGN GALLERY</div><button class="close" aria-label="关闭作品展示">×</button><div class="yuequ-gallery-view" tabindex="0" aria-label="横向图片展示"><div class="yuequ-gallery-track"></div></div><div class="yuequ-gallery-status">鼠标左右移动控制方向与速度 · 中央暂停 · Esc 返回</div>';
  document.body.append(gallery);
  const view=gallery.querySelector('.yuequ-gallery-view'),track=gallery.querySelector('.yuequ-gallery-track');
  const images=[['yuequ-gallery-1.webp','椰趣 / 品牌形象'],['yuequ-gallery-3.webp','椰趣 / IP形象设计'],['yuequ-gallery-2.webp','椰趣 / 设计背景与分析'],['yuequ-gallery-4.webp','椰趣 / 三视图与品牌应用']];
  // Repeat the same sequence to provide continuous scrolling in both directions.
  for(let cycle=0;cycle<3;cycle++)for(const [src,label] of images){
    const figure=document.createElement('figure'),img=document.createElement('img'),caption=document.createElement('figcaption');
    img.width=3840;img.height=1080;
    img.addEventListener('load',()=>{img.width=img.naturalWidth;img.height=img.naturalHeight;});
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
