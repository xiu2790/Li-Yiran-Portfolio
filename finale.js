(() => {
  const style = document.createElement('style');
  style.textContent = `
    #player.finale{background-image:url('character-finale.png');animation:none;transform:none;margin-top:-182px}
    .finale-bubble{position:fixed;width:310px;max-width:calc(100vw - 16px);aspect-ratio:640/236;z-index:9;pointer-events:none}
    .finale-bubble[hidden]{display:none}
    .finale-bubble img{position:absolute;inset:0;width:100%;height:100%;image-rendering:pixelated;transform:scaleX(-1)}
    .finale-bubble span{position:absolute;inset:7% 5% 31%;display:flex;align-items:center;justify-content:center;font:16px SimSun,'Microsoft YaHei',serif;white-space:nowrap;color:#080808}
    .archive-open .finale-bubble{visibility:hidden}
  `;
  document.head.append(style);
  const bubble = document.createElement('div');
  bubble.className = 'finale-bubble';bubble.hidden = true;
  bubble.setAttribute('role', 'status');
  const frame = document.createElement('img');frame.src = 'finale-bubble.png';frame.alt = '';
  const text = document.createElement('span');text.textContent = '༄༘⋆ꕥ☪︎・̩͙完结撒花☪︎・̩͙ꕥ⋆༘༅';
  bubble.append(frame, text);document.body.append(bubble);
  window.updateFinale = position => {
    const player = document.getElementById('player');
    const active = position >= 2670;
    player.classList.toggle('finale', active);
    bubble.hidden = !active;
    if (!active) return;
    const rect = player.getBoundingClientRect();
    const width = Math.min(310, Math.max(160, rect.left - 24));
    bubble.style.width = width + 'px';
    text.style.fontSize = Math.max(10, width / 310 * 16) + 'px';
    bubble.style.left = Math.max(8, rect.left - width - 12) + 'px';
    bubble.style.top = Math.max(8, rect.top + 40) + 'px';
  };
})();
