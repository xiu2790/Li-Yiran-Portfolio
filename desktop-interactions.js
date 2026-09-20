(() => {
  const eye = document.querySelector('.eye-moving');
  const sclera = document.createElement('div');
  sclera.className = 'eye-sclera';
  const iris = document.createElement('div');
  iris.className = 'eye-iris'; sclera.append(iris); eye.append(sclera);
  function track(x, y) {
    const r = sclera.getBoundingClientRect();
    const dx = Math.max(-13, Math.min(13, (x-r.left-r.width/2)/28));
    const dy = Math.max(-5, Math.min(5, (y-r.top-r.height/2)/35));
    iris.style.transform = `translate(${dx}px,${dy}px)`;
  }
  addEventListener('pointermove', e => track(e.clientX,e.clientY));
  addEventListener('message', e => {
    if(e.source===parent && e.data?.type==='eye-pointer')track(e.data.x,e.data.y);
  });
  const archive = document.getElementById('archive');
  const sync = () => parent.postMessage({type:'archive-state',open:[...document.querySelectorAll('#archive,.app-full,.osaka-gallery,.yuequ-gallery,.stars-gallery,#songGallery')].some(w=>!w.hidden)},'*');
  let syncQueued=false;
  new MutationObserver(records=>{const selector='#archive,.app-full,.osaka-gallery,.yuequ-gallery,.stars-gallery,#songGallery';if(!records.some(r=>r.target.matches?.(selector))||syncQueued)return;syncQueued=true;queueMicrotask(()=>{syncQueued=false;sync()});}).observe(document.body,{subtree:true,attributes:true,attributeFilter:['hidden','data-archive-ad']});
  addEventListener('message',e=>{
    if(e.source!==parent)return;
    const ids={'osaka-open':'osakaAd','yuequ-open':'yuequAd','song-open':'songAd','stars-open':'starsAd'};
    const id=ids[e.data.type];if(!id)return;
    queueMicrotask(()=>{
      const ad=document.getElementById(id);if(!ad)return;
      document.querySelectorAll('[data-archive-ad]').forEach(other=>{if(other!==ad)other.hidden=true});
      if(e.data.fromArchive){ad.setAttribute('data-archive-ad','true');ad.style.zIndex='10000';}else{ad.removeAttribute('data-archive-ad');ad.style.zIndex='290';}sync();
    });
  });
  const archiveStyle=document.createElement('style');archiveStyle.textContent='[data-archive-ad]{z-index:10000!important}.osaka-gallery,.yuequ-gallery,.stars-gallery,#songGallery{z-index:100001!important}';document.head.append(archiveStyle);
  addEventListener('keydown',e=>{if(e.key==='Escape')archive.hidden=true;});
  document.querySelectorAll('.archive-project').forEach(button=>button.onclick=()=>{
    document.getElementById('archive-selection').textContent=button.dataset.name+' / 已打开';
    const projects={大阪丸:'osaka',椰趣:'yuequ',一键入宋:'song',星穹咏调:'stars',星穹永调:'stars'};
    const project=projects[button.dataset.name];
    if(project)parent.postMessage({type:'archive-project-open',project},'*');
    document.querySelectorAll('.archive-project').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  });
})();
