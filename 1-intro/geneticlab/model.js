/* Seeded, browser-independent genetic algorithm engine. */
(function(root){
'use strict';
function rng(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=Math.imul(a^a>>>15,1|a);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;};}
function shuffle(a,r){a=a.slice();for(let i=a.length-1;i>0;i--){let j=Math.floor(r()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function cities(seed,n){let r=rng(seed+9001);return Array.from({length:n},()=>({x:.08+.84*r(),y:.08+.84*r()}));}
function distance(g,pts){return g.reduce((v,c,i)=>v+Math.hypot(pts[c].x-pts[g[(i+1)%g.length]].x,pts[c].y-pts[g[(i+1)%g.length]].y),0);}
function ox(a,b,l,h){let c=Array(a.length).fill(null);for(let i=l;i<=h;i++)c[i]=a[i];let j=(h+1)%a.length;for(let k=1;k<=b.length;k++){let v=b[(h+k)%b.length];if(c.includes(v))continue;while(c[j]!==null)j=(j+1)%a.length;c[j]=v;}return c;}
function select(pop,method,k,r){if(method==='roulette'){let total=pop.reduce((s,x)=>s+x.fit,0);if(!total)return Math.floor(r()*pop.length);let t=r()*total;for(let i=0;i<pop.length;i++){t-=pop[i].fit;if(t<0)return i;}return pop.length-1;}let ids=shuffle(pop.map((_,i)=>i),r).slice(0,k);return ids.reduce((best,i)=>pop[i].fit>pop[best].fit?i:best,ids[0]);}
function weights(pop,method){if(method!=='rank')return pop.map(x=>x.fit);return pop.map(x=>1+pop.filter(y=>y.fit<x.fit).length+(pop.filter(y=>y.fit===x.fit).length-1)/2);}
function parents(pop,method,k,r,trace={}){
trace.method=method;trace.population=pop.map(p=>({fit:p.fit,g:p.g?.slice()||[]}));trace.draws=[];
if(method==='tournament')return pop.map(()=>{let candidates=shuffle(pop.map((_,i)=>i),r).slice(0,k),winner=candidates.reduce((best,i)=>pop[i].fit>pop[best].fit?i:best,candidates[0]);trace.draws.push({candidates,winner});return winner;});
let w=weights(pop,method),sum=w.reduce((a,b)=>a+b,0);if(!sum){w=w.map(()=>1);sum=w.length;}trace.weights=w;trace.total=sum;
let cumulative=[],total=0;for(let x of w)cumulative.push(total+=x);trace.cumulative=cumulative;
const pick=x=>{let i=cumulative.findIndex(v=>x<v);return i<0?w.length-1:i;};
if(method==='sus'){let gap=sum/pop.length,start=r()*gap;trace.gap=gap;trace.start=start;let ids=pop.map((_,i)=>{let pointer=start+i*gap,winner=pick(pointer);trace.draws.push({pointer,winner});return winner;});return shuffle(ids,r);}
return pop.map(()=>{let pointer=r()*sum,winner=pick(pointer);trace.draws.push({pointer,winner});return winner;});}
function normal(r){return Math.sqrt(-2*Math.log(Math.max(Number.EPSILON,r())))*Math.cos(2*Math.PI*r());}
function evaluate(s,g){s.evaluations++;let value=s.c.problem==='bits'?g.reduce((a,b)=>a+b,0):s.c.problem==='real'?g.reduce((a,x)=>a+x*x,0):distance(g,s.points);return{g:g.slice(),value,fit:s.c.problem==='bits'?value:s.c.problem==='real'?1/(1+value):1/value};}
function record(s){let best=s.pop.reduce((a,b)=>a.fit>=b.fit?a:b);if(!s.best||best.fit>s.best.fit)s.best={...best,g:best.g.slice()};s.history.push({generation:s.generation,best:best.value,ever:s.best.value,mean:s.pop.reduce((a,b)=>a+b.value,0)/s.pop.length,diversity:new Set(s.pop.map(x=>x.g.join(','))).size/s.pop.length,evaluations:s.evaluations});s.done=s.generation>=s.c.generations||(s.c.problem==='bits'&&s.best.value===s.c.length);}
function init(config){let c={problem:'bits',length:12,population:12,selection:'tournament',k:3,pc:.8,pm:.04,elite:1,generations:40,seed:7,crossover:'one',mutation:'gaussian',sigma:1,...config};c.length=Math.max(4,Math.min(24,Math.round(c.length)));c.population=Math.max(4,Math.min(60,Math.round(c.population/2)*2));c.k=Math.max(2,Math.min(c.population,Math.round(c.k)));c.elite=Math.max(0,Math.min(c.population-1,Math.round(c.elite)));c.generations=Math.max(1,Math.min(150,Math.round(c.generations)));c.pc=Math.max(0,Math.min(1,c.pc));c.pm=Math.max(0,Math.min(1,c.pm));if(c.problem==='real')c.length=2;let s={c,r:rng(c.runSeed??c.seed),points:cities(c.seed,c.length),generation:0,phase:0,evaluations:0,pop:[],history:[],trace:[],done:false};s.pop=Array.from({length:c.population},()=>evaluate(s,c.problem==='bits'?Array.from({length:c.length},()=>s.r()<.5?0:1):c.problem==='real'?Array.from({length:2},()=>-10+20*s.r()):shuffle(Array.from({length:c.length},(_,i)=>i),s.r)));record(s);return s;}
function advance(s){if(s.done)return s;
if(s.phase===0){s.selectionTrace={generation:s.generation};s.parents=parents(s.pop,s.c.selection,s.c.k,s.r,s.selectionTrace);s.trace=[];s.phase=1;}
else if(s.phase===1){s.children=[];for(let i=0;i<s.parents.length;i+=2){let a=s.pop[s.parents[i]].g,b=s.pop[s.parents[i+1]].g;let used=s.r()<s.c.pc,l=0,h=0,ca=a.slice(),cb=b.slice();let originA=a.map(()=>0),originB=b.map(()=>1),cuts=[];
if(used){
if(s.c.problem==='tsp'){l=Math.floor(s.r()*(a.length-1));h=l+1+Math.floor(s.r()*(a.length-l-1));ca=ox(a,b,l,h);cb=ox(b,a,l,h);cuts=[l,h+1];originA=a.map((_,j)=>j>=l&&j<=h?0:1);originB=originA.map(v=>1-v);}
else if(s.c.problem==='real'&&s.c.crossover!=='uniform'){ca=a.map((v,j)=>(v+b[j])/2);cb=ca.slice();originA=a.map(()=>2);originB=originA.slice();}
else {if(s.c.crossover==='uniform')originA=a.map(()=>s.r()<.5?0:1);else if(s.c.crossover==='two'){l=1+Math.floor(s.r()*(a.length-2));h=l+1+Math.floor(s.r()*(a.length-l-1));cuts=[l,h];originA=a.map((_,j)=>j>=l&&j<h?1:0);}else {l=1+Math.floor(s.r()*(a.length-1));cuts=[l];originA=a.map((_,j)=>j<l?0:1);}originB=originA.map(v=>1-v);ca=a.map((v,j)=>originA[j]===0?v:b[j]);cb=b.map((v,j)=>originB[j]===1?v:a[j]);}
}
s.children.push(ca,cb);s.trace.push({parents:[s.parents[i],s.parents[i+1]],used,l,h,cuts,origins:[originA,originB],before:[a.slice(),b.slice()],cross:[ca.slice(),cb.slice()],after:[],changed:[]});}s.phase=2;}
else if(s.phase===2){s.offspring=s.children.map((g,i)=>{let a=g.slice();if(s.c.problem==='bits'){a=a.map(v=>s.r()<s.c.pm?1-v:v);}else if(s.c.problem==='real'){a=a.map(v=>s.r()<s.c.pm?(s.c.mutation==='reset'?-10+20*s.r():Math.max(-10,Math.min(10,v+s.c.sigma*normal(s.r)))):v);}else if(s.r()<s.c.pm){let l=Math.floor(s.r()*(a.length-1)),h=l+1+Math.floor(s.r()*(a.length-l-1));a.splice(l,h-l+1,...a.slice(l,h+1).reverse());}let tr=s.trace[Math.floor(i/2)];tr.after.push(a.slice());tr.changed.push(a.map((v,j)=>v!==g[j]));return evaluate(s,a);});s.phase=3;}
else {let elites=s.pop.slice().sort((a,b)=>b.fit-a.fit).slice(0,s.c.elite);s.pop=elites.concat(s.offspring.slice(0,s.c.population-s.c.elite));s.generation++;s.phase=0;record(s);}return s;}
function generation(s){if(s.done)return s;do{advance(s);}while(s.phase&&!s.done);return s;}
function run(c){let s=init(c);while(!s.done)generation(s);return s;}
const api={weights,parents,rng,shuffle,cities,distance,ox,select,init,advance,generation,run};if(typeof module!=='undefined'&&module.exports)module.exports=api;root.Genetic=api;
})(typeof globalThis!=='undefined'?globalThis:this);
