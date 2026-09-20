(() => {
  const style = document.createElement('style');
  style.textContent = `
    @media (pointer:fine){html,body,body *{cursor:url('pixel-cursor-small.png') 2 2,auto!important}}
    .pointer-bubble{position:fixed;pointer-events:none;z-index:2147483647;border-radius:50%;border:1px solid #e6ffffc9;box-shadow:inset 2px 2px 4px #ffffffbb,inset -2px -2px 4px #508fa766,0 0 2px #5f95bb88;animation:pointer-float .85s ease-out forwards}
    .pointer-bubble:after{content:'';position:absolute;left:20%;top:15%;width:25%;height:15%;border-radius:50%;background:#fff9}
    @keyframes pointer-float{from{opacity:.8;transform:translate(-50%,-50%) scale(.65)}to{opacity:0;transform:translate(calc(-50% + var(--dx)),calc(-50% - 48px)) scale(1.15)}}
  `;
  document.head.append(style);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let last = 0;
  const bubbles = new Set();
  document.addEventListener('pointermove', e => {
    if(e.pointerType !== 'mouse' || reduced.matches || e.timeStamp-last < 55 || bubbles.size >= 20)return;
    last = e.timeStamp;
    const bubble = document.createElement('i');
    const size = 7 + Math.random()*12;
    bubble.className = 'pointer-bubble';
    bubble.setAttribute('aria-hidden','true');
    Object.assign(bubble.style,{left:e.clientX+'px',top:e.clientY+'px',width:size+'px',height:size+'px'});
    bubble.style.setProperty('--dx',(Math.random()*36-18)+'px');
    document.body.append(bubble);
    bubbles.add(bubble);
    setTimeout(()=>{bubble.remove();bubbles.delete(bubble);},900);
  },{passive:true});
})();
