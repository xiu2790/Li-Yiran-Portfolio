(() => {
  const audio = document.getElementById('backgroundMusic');
  const button = document.getElementById('musicToggle');
  const label = document.getElementById('musicLabel');
  audio.volume = 0.4;
  let autoPending = true;
  async function startAutomatically() {
    if (!autoPending) return;
    try { await audio.play(); autoPending = false; } catch {}
  }
  audio.autoplay = true;
  startAutomatically();
  document.addEventListener('pointerdown', e => {
    if (!button.contains(e.target)) startAutomatically();
  });
  document.addEventListener('keydown', startAutomatically);
  addEventListener('message', e => {
    if (e.source === parent && e.data?.type === 'music-start') startAutomatically();
  });
  function sync() {
    button.setAttribute('aria-pressed', String(!audio.paused));
    button.title = label.textContent = audio.paused ? '播放音乐' : '暂停音乐';
  }
  button.addEventListener('click', async () => {
    autoPending = false;
    if (!audio.paused) { audio.pause(); return; }
    try { await audio.play(); }
    catch { label.textContent = '播放失败，点击重试'; }
  });
  audio.addEventListener('play', sync);
  audio.addEventListener('pause', sync);
  audio.addEventListener('error', () => { label.textContent = '音乐加载失败'; });
})();
