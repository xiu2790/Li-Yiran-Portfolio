function initPixelToss(bin) {
  const canvas=bin.querySelector('canvas'),g=canvas.getContext('2d');
  canvas.width=350;canvas.height=190;g.imageSmoothingEnabled=false;
  const backdrop=new Image(),basket=new Image();
  backdrop.src='desktop-wallpaper.jpg';basket.src='retro/bin.png';
  const status=bin.querySelector('#toss-status'),origin={x:48,y:144},gravity=180;
  let aim=null,ball=null,target=252,score=0,attempts=0,last=0,message='HOLD + AIM';
  function charge(now){return aim?Math.min(1,Math.max(0,(now-aim.start)/1500)):0}
  function velocity(now){const speed=100+charge(now)*150;return {x:Math.cos(aim.angle)*speed,y:-Math.sin(aim.angle)*speed}}
  function sample(v,t){return {x:origin.x+v.x*t,y:origin.y+v.y*t+gravity*t*t/2}}
  function point(e){const r=canvas.getBoundingClientRect();return {x:(e.clientX-r.left)*350/r.width,y:(e.clientY-r.top)*190/r.height}}
  function direction(e){if(!aim)return;const p=point(e),dx=p.x-origin.x,dy=origin.y-p.y;if(Math.hypot(dx,dy)>7)aim.angle=Math.max(.2,Math.min(1.4,Math.atan2(dy,dx)))}
  canvas.onpointerdown=e=>{if(e.button!==0||ball||aim)return;const p=point(e);if(Math.hypot(p.x-origin.x,p.y-origin.y)>22){message='GRAB THE PAPER';return}e.preventDefault();aim={id:e.pointerId,start:performance.now(),angle:Math.PI/4};canvas.setPointerCapture(e.pointerId);message='RELEASE TO THROW'};
  canvas.onpointermove=e=>{if(aim?.id===e.pointerId)direction(e)};
  canvas.onpointerup=e=>{if(!aim||aim.id!==e.pointerId)return;direction(e);const v=velocity(performance.now());ball={v,t:0,x:origin.x,y:origin.y};aim=null;attempts++;message='FLYING...'};
  function cancel(){aim=null}
  canvas.onpointercancel=canvas.onlostpointercapture=cancel;
  addEventListener('blur',cancel);
  new MutationObserver(()=>{if(bin.hidden){cancel();ball=null}}).observe(bin,{attributes:true,attributeFilter:['hidden']});
  bin.querySelector('#toss-reset').onclick=()=>{aim=ball=null;score=attempts=0;target=252;message='HOLD + AIM'};
  function finish(hit){ball=null;if(hit){score++;target=190+Math.floor(Math.random()*108)}message=hit?'NICE SHOT!':'TRY AGAIN'}
  function rect(x,y,w,h,c){g.fillStyle=c;g.fillRect(Math.round(x),Math.round(y),w,h)}
  function paper(x,y){rect(x-4,y-3,8,7,'#364d86');rect(x-3,y-4,5,9,'#364d86');rect(x-3,y-2,6,5,'#e6fcff');rect(x-2,y-3,4,2,'#ffffff');rect(x,y,2,3,'#fa66c5')}
  function render(now){
    rect(0,0,350,190,'#8fd6fa');
    if(backdrop.complete&&backdrop.naturalWidth)g.drawImage(backdrop,0,0,350,190);
    rect(0,0,350,20,'#154ad0aa');rect(0,19,350,1,'#fff');
    if(basket.complete&&basket.naturalWidth)g.drawImage(basket,target-5,123,44,51);
    if(aim){const v=velocity(now);for(let t=.075;t<3;t+=.075){const p=sample(v,t);if(p.y>172||p.x>350)break;if(p.y>=24){rect(p.x-1,p.y-1,4,4,'#fff');rect(p.x,p.y,2,2,'#ec299c')}}rect(origin.x-10,origin.y+12,20,2,'#fff')}
    paper(ball?ball.x:origin.x,ball?ball.y:origin.y);
    g.font='8px monospace';g.fillStyle='#ffffff';g.fillText('SCORE '+String(score).padStart(3,'0')+'   TRY '+String(attempts).padStart(3,'0'),8,13);g.fillText(message,190,13);
    rect(7,25,67,10,'#fff');rect(8,26,65,8,'#35528f');for(let i=0;i<12;i++)if(charge(now)>i/12)rect(10+i*5,28,4,4,i<8?'#61fff1':'#ff63c4');g.fillStyle='#123b8c';g.fillText('POWER',8,44);
    status.textContent='得分 '+score+' / 投掷 '+attempts+' / 力度 '+Math.round(charge(now)*100)+'%';
  }
  function frame(now){const dt=last?Math.min(.04,(now-last)/1000):0;last=now;if(!bin.hidden){if(ball){const prev={x:ball.x,y:ball.y};ball.t+=dt;Object.assign(ball,sample(ball.v,ball.t));if(ball.v.y+gravity*ball.t>0&&prev.y<=126&&ball.y>=126){const x=prev.x+(ball.x-prev.x)*(126-prev.y)/(ball.y-prev.y);if(x>target+3&&x<target+29)finish(true)}if(ball&&(ball.y>176||ball.x>355))finish(false)}render(now)}requestAnimationFrame(frame)}requestAnimationFrame(frame);
}
