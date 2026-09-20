(() => {
  const sound = new Audio('qq-notification.m4a');
  sound.preload = 'auto';
  sound.volume = 0.65;
  const resume = document.getElementById('resume');
  const bubble = document.createElement('div');
  bubble.className = 'retro-speech';
  bubble.hidden = true;
  bubble.setAttribute('role', 'status');
  const text = '༊*・˚姐祇媞嗰伝說˚・*༊';
  bubble.setAttribute('aria-label', text);
  const canvas = document.createElement('canvas');
  canvas.width = 180; canvas.height = 28;
  canvas.setAttribute('aria-hidden','true');
  const ctx = canvas.getContext('2d');
  ctx.font = '12px SimSun, serif';
  ctx.fillStyle = '#080808'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, 90, 14, 174);
  bubble.append(canvas);
  const tail = document.createElement('i');
  tail.className = 'speech-tail';
  tail.setAttribute('aria-hidden', 'true');
  bubble.append(tail);
  document.body.append(bubble);
  let visible = false;
  function position() {
    const rect = document.getElementById('player').getBoundingClientRect();
    bubble.style.left = Math.max(8, rect.left - bubble.offsetWidth - 18) + 'px';
    bubble.style.top = Math.max(75, rect.top + 12) + 'px';
  }
  const observer = new MutationObserver(() => {
    const next = resume.getAttribute('aria-hidden') === 'false';
    if (next === visible) return;
    visible = next; bubble.hidden = !next;
    if (next) {
      position();
      sound.currentTime = 0;
      sound.play().catch(() => {});
    } else { sound.pause(); sound.currentTime = 0; }
  });
  observer.observe(resume, {attributes:true, attributeFilter:['aria-hidden']});
  let starsNear=false;
  setInterval(()=>{
    const player=document.getElementById('player');if(!player)return;
    const near=Math.abs(parseFloat(player.style.left||'0')-2350)<65;
    if(near===starsNear)return;starsNear=near;
    document.querySelector('iframe')?.contentWindow.postMessage({type:near?'stars-open':'stars-close'},'*');
  },80);
  let songNear = false;
  setInterval(() => { const player=document.getElementById("player"); if(!player)return; const near=Math.abs(parseFloat(player.style.left||"0")-1950)<65; if(near===songNear)return; songNear=near; document.querySelector("iframe")?.contentWindow.postMessage({type:near?"song-open":"song-close"},"*"); },80);
  let yuequNear = false;
  setInterval(() => {
    const player=document.getElementById("player");
    if(!player)return;
    const near=Math.abs(parseFloat(player.style.left || "0")-1550)<65;
    if(near===yuequNear)return;
    yuequNear=near;
    document.querySelector("iframe")?.contentWindow.postMessage({type:near?"yuequ-open":"yuequ-close"},"*");
  },80);
  let osakaNear = false;
  setInterval(() => {
    const player = document.getElementById('player');
    if (!player) return;
    const near = Math.abs(parseFloat(player.style.left || '0') - 1150) < 65;
    if (near === osakaNear) return;
    osakaNear = near;
    const frame = document.querySelector('iframe');
    frame?.contentWindow.postMessage({type: near ? 'osaka-open' : 'osaka-close'}, '*');
  }, 80);
  addEventListener('resize', () => {if(visible)position();});
})();
