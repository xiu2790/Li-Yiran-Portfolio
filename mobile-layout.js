(() => {
  const mobile = matchMedia('(pointer:coarse)');
  const css = document.createElement('style');
  css.textContent = `
    #rotateNotice,#touchMove{display:none}
    @media(pointer:coarse){
      html,body{height:100%;height:100dvh;overscroll-behavior:none}
      .bg{height:100dvh}
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
    @media(pointer:coarse) and (orientation:landscape){
      .top{inset:8px 12px auto;font-size:10px}
      .view{inset:28px 0 42px}
      .foot{inset:auto 12px 8px;font-size:10px}
      #touchMove{bottom:8px;left:10px;gap:5px}
      #touchMove button{width:44px;height:34px;font-size:18px}
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
      #paint{width:min(42vw,520px)!important;max-height:calc(100dvh - 44px);left:43%!important;top:3%!important;overflow:hidden}
      #eye{width:min(22vw,250px)!important;max-height:calc(100dvh - 44px);left:8%!important;top:18%!important;overflow:hidden}
      #error{width:min(22vw,260px)!important;max-height:calc(100dvh - 44px);left:23%!important;top:39%!important;overflow:hidden}
      #mines{width:min(260px,calc(100dvh - 154px))!important;max-width:none;transform:none;right:8px;top:8px!important;overflow:visible}
      #mines .bar{font-size:10px;padding:3px 4px}
      #mines .mine-head{padding:4px;margin-bottom:5px}
      #mines .digits{font-size:16px}
      #mines #mineReset{width:30px;height:30px;font-size:19px}
      #mines .cell{font-size:12px}
      #mines #mineStatus{font-size:9px;margin:4px 0}
      #osakaAd,.osaka-ad,#yuequAd,#songAd,#starsAd{width:min(54vw,560px,calc((100dvh - 100px)*1.778));max-width:none;max-height:none;left:auto;right:max(12px,env(safe-area-inset-right));top:12px;padding:32px 6px 6px;overflow:hidden}
      .osaka-ad .osaka-poster,#yuequAd .yuequ-poster,#songAd .song-poster,#starsAd .stars-poster{max-height:none;aspect-ratio:658/370}
      .osaka-ad .bar,#yuequAd .bar,#songAd .bar,#starsAd .bar{height:28px;padding-right:34px;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;touch-action:none}
      .osaka-ad .close,#yuequAd .close,#songAd .close,#starsAd .close,.app-full .app-close{width:28px;height:26px;top:0;right:1px;z-index:10}
      #fullSpeed{max-width:24vw;min-width:100px;left:26%!important;top:28%!important}
      .app-full{left:4vw!important;top:4dvh!important;width:92vw!important;height:86dvh!important;max-height:calc(100dvh - 42px);padding:30px 8px 8px;overflow:hidden}
      .app-full .app-body{padding:8px;overflow:auto}
      #bin-app .pixel-game{padding:4px;font-size:10px}
      #bin-app .pixel-game h2{font-size:13px;margin:2px}
      #bin-app .pixel-game p{margin:3px;font-size:10px}
      #bin-app .pixel-game{display:flex;flex-direction:column;align-items:center;gap:3px}
      #bin-app .game-screen{flex:none;width:auto;height:calc(100% - 65px);aspect-ratio:350/190;max-width:100%;object-fit:fill;margin:3px auto}
      #bin-app .game-controls{gap:8px;flex-wrap:wrap;font-size:10px}
      #bin-app .pixel-game button{font-size:10px;padding:3px 6px}
      #archive{left:2vw!important;top:2dvh!important;width:96vw!important;height:calc(96dvh - 34px)!important}
      .taskbar{gap:3px;height:32px;overflow-x:auto;overflow-y:hidden}.taskbar button{font-size:10px;padding:1px 5px;white-space:nowrap;flex-shrink:0}.clock{font-size:10px;padding:4px;white-space:nowrap}
      .archive-files{padding:10px;gap:8px}.archive-project{padding:8px;min-height:100px}
      .note{font-size:20px;bottom:13%}
      .osaka-gallery,.yuequ-gallery,.stars-gallery,#songGallery{inset:4px 4px 34px;max-height:none;padding:28px 5px 22px}
      .osaka-gallery-view,.yuequ-gallery-view,.stars-gallery-view,.song-view{height:100%}
      .osaka-gallery img,.yuequ-gallery img,.stars-gallery img,.song-track img{max-height:none;height:calc(100% - 28px);width:auto;max-width:none;flex:none}
      .osaka-gallery-track,.yuequ-gallery-track,.stars-gallery-track,.song-track{height:100%;padding:8px;gap:12px}
      .osaka-gallery figure,.yuequ-gallery figure,.stars-gallery figure,.song-track figure{height:100%;max-width:none;flex:none}
      .osaka-gallery .close,.yuequ-gallery .close,.stars-gallery .close,#songGallery .close{width:28px;height:26px;top:0;right:0}
      .song-view{overflow-x:auto;touch-action:pan-x}
    `;
    // Ad modules append their own styles asynchronously; keep the mobile
    // overrides last in the cascade after those modules are created.
    style.remove();doc.head.append(style);
  }
  frame.addEventListener('load',fitDesktop);addEventListener('resize',fitDesktop);fitDesktop();
  // The ad scripts are loaded by the desktop document after its initial load.
  // Reapply the viewport rules once those late-created windows exist.
  setTimeout(fitDesktop,250);setTimeout(fitDesktop,1000);setTimeout(fitDesktop,2000);
})();
