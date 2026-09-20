(() => {
 const r=document.getElementById('resume'),bar=r.querySelector('.resume-title');let drag=null;
 bar.style.cursor='grab';bar.style.touchAction='none';
 bar.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;e.preventDefault();drag=[e.clientX-r.offsetLeft,e.clientY-r.offsetTop];bar.setPointerCapture(e.pointerId)});
 bar.addEventListener('pointermove',e=>{if(!drag)return;r.style.left=Math.max(0,Math.min(innerWidth-80,e.clientX-drag[0]))+'px';r.style.top=Math.max(0,Math.min(innerHeight-40,e.clientY-drag[1]))+'px'});
 bar.onpointerup=bar.onpointercancel=()=>drag=null;
 addEventListener('message',e=>{if(e.source!==document.querySelector('iframe').contentWindow)return;if(e.data?.type==='open-resume-file'){resumeManual=true;resumeDismissed=false;keys.clear();}});
})();
