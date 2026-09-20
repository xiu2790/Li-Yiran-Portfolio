class MineGame {
 constructor(random=Math.random){this.random=random;this.reset()}
 reset(){this.cells=Array.from({length:81},()=>({mine:false,open:false,flag:false,count:0}));this.state='ready'}
 neighbors(i){const r=Math.floor(i/9),c=i%9,result=[];for(let y=-1;y<=1;y++)for(let x=-1;x<=1;x++)if((x||y)&&r+y>=0&&r+y<9&&c+x>=0&&c+x<9)result.push((r+y)*9+c+x);return result}
 seed(first){const safe=new Set([first,...this.neighbors(first)]);const available=this.cells.map((_,i)=>i).filter(i=>!safe.has(i));for(let n=0;n<10;n++){const k=Math.floor(this.random()*available.length);this.cells[available.splice(k,1)[0]].mine=true}this.cells.forEach((c,i)=>c.count=this.neighbors(i).filter(j=>this.cells[j].mine).length);this.state='playing'}
 flag(i){if(['won','lost'].includes(this.state)||this.cells[i].open)return;this.cells[i].flag=!this.cells[i].flag}
 reveal(i){if(['won','lost'].includes(this.state)||this.cells[i].flag||this.cells[i].open)return;if(this.state==='ready')this.seed(i);if(this.cells[i].mine){this.cells[i].open=true;this.state='lost';return}const queue=[i];while(queue.length){const j=queue.pop(),c=this.cells[j];if(c.open||c.flag||c.mine)continue;c.open=true;if(c.count===0)queue.push(...this.neighbors(j))}if(this.cells.every(c=>c.mine||c.open)){this.state='won';this.cells.forEach(c=>{if(c.mine)c.flag=true})}}
}
if(typeof module!=='undefined')module.exports=MineGame;
