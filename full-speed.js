(() => {
  const style=document.createElement('style');
  style.textContent=`
    #fullSpeed{position:absolute;left:28%;top:29%;width:17vw;max-width:330px;min-width:140px;padding:0;background:transparent;border:0;z-index:35;filter:none;touch-action:none;cursor:grab;user-select:none}
    #fullSpeed:active{cursor:grabbing}
    body:has(#archive:not([hidden])) #fullSpeed{z-index:0!important}
    #fullSpeed[hidden]{display:none}
    #fullSpeed .bar{height:19px;padding:2px 23px 2px 4px;background:linear-gradient(90deg,navy,#1084d0);color:white;font:bold 11px Tahoma;touch-action:none;cursor:grab}
    #fullSpeed>img{display:block;width:100%;height:auto;image-rendering:auto;pointer-events:none}
    #fullSpeed .close{top:1px;right:2px;width:16px;height:16px;z-index:2}
    #fullSpeedTask{white-space:nowrap;flex-shrink:0}
    #fullSpeedTask[aria-pressed=true]{border-style:inset;background:#ddd}
    @media(max-width:600px){#fullSpeed{left:28%;top:29%;width:27vw;min-width:110px}}
  `;
  document.head.append(style);
  const win=document.createElement('section');win.id='fullSpeed';win.className='window';win.setAttribute('aria-label','全速前进');
  win.innerHTML='<img src="full-speed.webp" alt="全速前进 GO!GO!GO! 向右箭头" draggable="false">';
  win.title='拖动图片移动';
  document.body.append(win);
  const task=document.createElement('button');task.id='fullSpeedTask';task.type='button';task.textContent='全速前进';task.setAttribute('aria-controls','fullSpeed');task.setAttribute('aria-pressed','true');
  const taskbar=document.querySelector('.taskbar');taskbar.insertBefore(task,taskbar.querySelector('.clock'));
  function focusRoam(){parent.postMessage({type:'roam-focus'},'*')}
  task.onclick=()=>{win.hidden=false;win.style.zIndex='90';task.setAttribute('aria-pressed','true');focusRoam()};
  const bar=win;let drag=null;
  bar.onpointerdown=e=>{if(e.button!==0)return;e.preventDefault();const r=win.getBoundingClientRect();drag={x:e.clientX-r.left,y:e.clientY-r.top};win.style.zIndex='90';bar.setPointerCapture(e.pointerId)};
  bar.onpointermove=e=>{if(!drag)return;win.style.left=Math.max(0,Math.min(innerWidth-win.offsetWidth,e.clientX-drag.x))+'px';win.style.top=Math.max(0,Math.min(innerHeight-win.offsetHeight-36,e.clientY-drag.y))+'px'};
  bar.onpointerup=bar.onpointercancel=()=>{drag=null;focusRoam()};bar.onlostpointercapture=()=>drag=null;
})();
