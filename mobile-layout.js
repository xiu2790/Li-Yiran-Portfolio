(() => {
  const mobile = matchMedia('(pointer:coarse)');
  const css = document.createElement('style');
  css.textContent = `
    #rotateNotice,#touchMove{display:none}
    @media(pointer:coarse){
      html,body{height:100%;height:100dvh;overscroll-behavior:none}
      #touchMove{display:flex;position:fixed;left:max(12px,env(safe-area-inset-left));bottom:44px;gap:12px;z-index:25;touch-action:none}
      #touchMove button{width:56px;height:48px;background:#c0c0c0e8;border:3px outset white;color:navy;font:bold 22px monospace;touch-action:none;user-select:none}
      #touchMove button:active{border-style:inset}
      .archive-open #touchMove{display:none}
      .view{inset:36px 0 56px}
      .player,.ghost{width:124px;height:164px;margin-left:-62px;transform-origin:center bottom}
      .player,.ghost{background-size:contain;background-position:center bottom}
      #rotateNotice{position:fixed;inset:0;z-index:100000;background:#050b26f5;color:white;align-items:center;justify-content:center;flex-direction:column;gap:18px;text-align:center;padding:25px;font:16px/1.6 Arial,sans-serif}
      #rotateNotice button{padding:12px 24px;background:silver;border:3px outset white;color:navy;font:bold 16px sans-serif}
      .finale-bubble span{white-space:normal}
    }
    @media(pointer:coarse) and (orientation:portrait){#rotateNotice{display:flex}}
  `;
  document.head.append(css);
  const notice = document.createElement('div');notice.id='rotateNotice';
  notice.innerHTML='<div style="font-size:48px" aria-hidden="true">↻</div><strong>横屏浏览，开启桌面漫游</strong><div>请将手机横过来<br>若无法旋转，请关闭系统方向锁定</div><button type="button">一键进入横屏</button>';
  document.body.append(notice);
  async function landscape(fullscreen) {
    if(!mobile.matches)return;
    try {
      if(fullscreen && !document.fullscreenElement && document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();
      if(screen.orientation?.lock)await screen.orientation.lock('landscape');
    } catch (_) { /* The rotation prompt remains available when browser policy prevents locking. */ }
  }
  notice.querySelector('button').onclick=()=>{landscape(true);document.querySelector('iframe').contentWindow.postMessage({type:'music-start'},'*');};
  landscape(false);
  const controls=document.createElement('div');controls.id='touchMove';controls.setAttribute('aria-label','角色移动');
  controls.innerHTML='<button type="button" aria-label="向左移动">◀</button><button type="button" aria-label="向右移动">▶</button>';
  document.body.append(controls);
  controls.querySelectorAll('button').forEach((button,i)=>{
    const key=i?'d':'a';
    button.onpointerdown=e=>{e.preventDefault();button.setPointerCapture(e.pointerId);keys.add(key);document.querySelector('iframe').contentWindow.postMessage({type:'music-start'},'*');};
    const release=()=>keys.delete(key);
    button.onpointerup=button.onpointercancel=button.onlostpointercapture=release;
  });
  const frame=document.querySelector('iframe');
  function fitDesktop(){
    if(!mobile.matches)return;
    const doc=frame.contentDocument;if(!doc?.body)return;
    let style=doc.getElementById('mobileDesktop');
    if(!style){style=doc.createElement('style');style.id='mobileDesktop';doc.head.append(style);}
    style.textContent=`
      .icons{top:12px;left:8px;gap:8px}.icons img{width:26px;height:26px}.icons button{font-size:10px;gap:2px}
      #paint{width:38vw!important;left:45%!important;top:4%!important}
      #eye{width:19vw!important;left:9%!important;top:23%!important}
      #error{width:19vw!important;left:24%!important;top:42%!important}
      #mines{transform:scale(.62);transform-origin:top right;right:14px!important;top:43%!important}
      #osakaAd,#yuequAd,#songAd,#starsAd{width:47vw;max-width:47vw;right:3%;top:16%}
      .taskbar{gap:3px;height:32px;overflow-x:auto;overflow-y:hidden}.taskbar button{font-size:10px;padding:1px 5px;white-space:nowrap;flex-shrink:0}.clock{font-size:10px;padding:4px;white-space:nowrap}
      .archive-files{padding:10px;gap:8px}.archive-project{padding:8px;min-height:100px}
      .note{font-size:20px;bottom:13%}
      .osaka-gallery,.yuequ-gallery,.stars-gallery,#songGallery{inset:6px 6px 35px}
    `;
  }
  frame.addEventListener('load',fitDesktop);addEventListener('resize',fitDesktop);fitDesktop();
})();
