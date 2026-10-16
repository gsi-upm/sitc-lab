const assert=require('node:assert/strict');
const M=require('../../1-intro/treelab/model.js');
assert.equal(M.tennis.length,14);
assert.ok(Math.abs(M.impurity(M.tennis)-.94028595867)<1e-10);
[.24674981977,.02922256566,.15183550136,.0481270304].forEach((gain,f)=>assert.ok(Math.abs(M.categorical(M.tennis,f).gain-gain)<1e-9));
const sunny=M.tennis.filter(r=>r.x[0]==='Sunny');assert.ok(Math.abs(M.categorical(sunny,2).gain-M.impurity(sunny))<1e-12);
assert.deepEqual(M.dataset('circle',.2,12),M.dataset('circle',.2,12));
const data=M.dataset('diagonal',.2,42);assert.equal(data.train.length,168);assert.equal(data.validation.length,72);assert.equal(new Set([...data.train,...data.validation].map(r=>r.id)).size,240);
for(const criterion of ['gini','entropy'])for(const depth of [1,3,8])for(const minLeaf of [1,5,20]){const t=M.fit(data.train,{depth,minLeaf,criterion});assert.ok(M.stats(t).depth<=depth);function check(n){if(n.left){assert.ok(n.left.n>=minLeaf&&n.right.n>=minLeaf);assert.equal(n.left.n+n.right.n,n.n);assert.ok(n.gain>0);n.left.rows.forEach(r=>assert.ok(r.x[n.f]<=n.threshold));n.right.rows.forEach(r=>assert.ok(r.x[n.f]>n.threshold));check(n.left);check(n.right);}else assert.ok([0,1].includes(n.pred));}check(t);}
const sample=[{x:[0,0],y:0},{x:[.1,0],y:0},{x:[.9,0],y:1},{x:[1,0],y:1}];const simple=M.fit(sample,{minLeaf:1,depth:1});assert.equal(M.accuracy(simple,sample),1);assert.equal(simple.f,0);assert.equal(simple.threshold,.5);assert.equal(M.predict(simple,[.5,0]),0);
assert.equal(M.stats(M.fit(sample.map(r=>({...r,y:1})),{minLeaf:1})).leaves,1);
let prior=0;for(let depth=1;depth<=8;depth++){const acc=M.accuracy(M.fit(data.train,{depth,minLeaf:1}),data.train);assert.ok(acc>=prior);prior=acc;}
console.log('Tree model: entropy, gains, reproducibility, splits, leaf limits and depth checks passed.');
