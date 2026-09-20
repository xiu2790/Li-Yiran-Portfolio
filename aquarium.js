(() => {
  const style = document.createElement('style');
  style.textContent = `
    .aquarium{position:fixed;inset:0;pointer-events:none;overflow:hidden;z-index:19}
    .desktop-fish{position:absolute;width:145px;height:110px;object-fit:contain;animation:fish-swim 38s linear infinite;filter:drop-shadow(0 5px 6px #153b5a22)}
    .desktop-fish.second{width:105px;top:65%;animation:fish-return 47s linear infinite;animation-delay:-20s}
    .desktop-fish.first{top:15%;animation-delay:-9s}
    @keyframes fish-swim{0%{transform:translate(-180px,0) rotate(-4deg)}50%{transform:translate(50vw,45px) rotate(4deg)}100%{transform:translate(calc(100vw + 180px),0) rotate(-4deg)}}
    @keyframes fish-return{0%{transform:translate(calc(100vw + 180px),0) scaleX(-1) rotate(-4deg)}50%{transform:translate(50vw,-40px) scaleX(-1) rotate(4deg)}100%{transform:translate(-180px,0) scaleX(-1) rotate(-4deg)}}
    .desktop-bubble{position:absolute;bottom:-80px;border-radius:50%;border:1px solid #e7ffffaa;box-shadow:inset 3px 3px 7px #ffffffa0,inset -3px -3px 6px #357a9870,1px 1px 3px #a4fcff88;animation:bubble-rise 18s linear infinite}
    .desktop-bubble:after{content:'';position:absolute;left:20%;top:15%;width:25%;height:12%;border-radius:50%;background:#ffffffe0;transform:rotate(-35deg)}
    @keyframes bubble-rise{from{transform:translate(0,0);opacity:0}10%,85%{opacity:var(--alpha,.65)}50%{transform:translate(var(--sway),-57vh)}to{transform:translate(var(--drift),-115vh);opacity:0}}
    @media(prefers-reduced-motion:reduce){.desktop-fish,.desktop-bubble{animation-play-state:paused}}
  `;
  document.head.append(style);
  const layer = document.createElement('div');
  layer.className = 'aquarium';
  layer.setAttribute('aria-hidden', 'true');
  for (const name of ['first', 'second']) {
    const fish = document.createElement('img');
    fish.src = 'goldfish.png'; fish.alt = ''; fish.className = 'desktop-fish ' + name;
    layer.append(fish);
  }
  for (let i = 0; i < 7; i++) {
    const bubble = document.createElement('i'); bubble.className = 'desktop-bubble';
    function randomize(initial = false) {
      const size = 14 + Math.random() * 44;
      Object.assign(bubble.style, {left: (3+Math.random()*91)+'%', width:size+'px',height:size+'px'});
      bubble.style.setProperty('--sway', (Math.random()*100-50)+'px');
      bubble.style.setProperty('--drift', (Math.random()*160-80)+'px');
      bubble.style.setProperty('--alpha', .3+Math.random()*.4);
      if(initial) Object.assign(bubble.style, {animationDuration:(16+Math.random()*19)+'s',animationDelay:(-Math.random()*30)+'s'});
    }
    randomize(true);
    bubble.addEventListener('animationiteration', () => randomize());
    layer.append(bubble);
  }
  document.body.append(layer);
})();
