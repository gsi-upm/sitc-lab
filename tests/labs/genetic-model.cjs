const assert=require('node:assert/strict'),G=require('../../1-intro/geneticlab/model.js');
for(let seed=1;seed<=30;seed++){
 const a=G.init({seed,problem:'tsp',pm:1,pc:1,generations:15,length:10,elite:1});let prev=a.best.value;
 while(!a.done){G.generation(a);assert.ok(a.best.value<=prev+1e-10);prev=a.best.value;for(const x of a.pop){assert.deepEqual(x.g.slice().sort((a,b)=>a-b),[0,1,2,3,4,5,6,7,8,9]);assert.ok(Math.abs(x.value-G.distance(x.g,a.points))<1e-12);}}
 assert.equal(a.evaluations,12*16);assert.deepEqual(G.run({seed}).history,G.run({seed}).history);
}
assert.deepEqual(G.ox([0,1,2,3,4],[4,3,2,1,0],1,2),[3,1,2,0,4]);
const s=G.init({seed:42,length:24,pm:1,pc:0,elite:0,generations:1});G.advance(s);G.advance(s);G.advance(s);for(const tr of s.trace){for(let i=0;i<2;i++)assert.deepEqual(tr.after[i],tr.cross[i].map(v=>1-v));}G.advance(s);assert.ok(s.done);assert.equal(s.generation,1);
const zeros=[{fit:0},{fit:0}];for(let i=0;i<20;i++)assert.ok([0,1].includes(G.select(zeros,'roulette',2,G.rng(i))));
const optimum=G.init({seed:5});optimum.pop[0]={g:Array(12).fill(1),value:12,fit:12};G.generation(optimum);assert.equal(optimum.best.value,12);assert.ok(optimum.done);const n=optimum.evaluations;G.advance(optimum);assert.equal(optimum.evaluations,n);
const r1=G.init({problem:'tsp',seed:4,runSeed:5}),r2=G.init({problem:'tsp',seed:4,runSeed:6});assert.deepEqual(r1.points,r2.points);assert.notDeepEqual(r1.pop,r2.pop);
console.log('Genetic engine: permutations, mutation, elitism, deterministic seeds, terminal stop and counts passed.');
// SUS gives floor/ceil expected counts; tied ranks share equal weight.
const pop=[1,2,3,4].map(fit=>({fit}));
for(let seed=1;seed<40;seed++){let ids=G.parents(pop,'sus',2,G.rng(seed));for(let i=0;i<4;i++){let n=ids.filter(j=>j===i).length,e=4*pop[i].fit/10;assert.ok(n===Math.floor(e)||n===Math.ceil(e));}}
assert.deepEqual(G.weights([{fit:5},{fit:1},{fit:5}],'rank'),[2.5,1,2.5]);
for(const selection of ['tournament','roulette','sus','rank'])for(const mutation of ['gaussian','reset']){
 let s=G.init({problem:'real',selection,mutation,pc:1,pm:1,sigma:1,generations:10});
 G.advance(s);G.advance(s);for(let tr of s.trace)for(let i=0;i<2;i++)assert.deepEqual(tr.cross[i],tr.before[0].map((v,j)=>(v+tr.before[1][j])/2));
 while(!s.done)G.generation(s);for(let p of s.pop){assert.ok(p.g.every(v=>Number.isFinite(v)&&v>=-10&&v<=10));assert.equal(p.value,p.g[0]**2+p.g[1]**2);assert.equal(p.fit,1/(1+p.value));}assert.equal(s.evaluations,132);
}
console.log('SUS, rank ties, real crossover and mutation passed.');

for(const problem of ['bits','real'])for(const crossover of problem==='bits'?['one','two','uniform']:['arithmetic','uniform']){let s=G.init({problem,crossover,pc:1,seed:12});G.advance(s);G.advance(s);for(const tr of s.trace){for(let i=0;i<2;i++)for(let j=0;j<tr.cross[i].length;j++){const origin=tr.origins[i][j];assert.equal(tr.cross[i][j],origin===2?(tr.before[0][j]+tr.before[1][j])/2:tr.before[origin][j]);}assert.equal(tr.cuts.length,crossover==='one'?1:crossover==='two'?2:0);if(crossover==='two')assert.ok(tr.cuts[0]>0&&tr.cuts[1]>tr.cuts[0]&&tr.cuts[1]<s.c.length);}}
console.log('New crossovers and inheritance traces passed.');
