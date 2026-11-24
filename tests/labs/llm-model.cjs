const assert=require('node:assert/strict'),M=require('../../1-intro/llmlab/model.js');
assert.equal(M.contexts.length,2);
for(const c of M.contexts){const a=M.attention(c,c.query);assert.equal(a.weights.length,c.tokens.length);assert.ok(Math.abs(a.weights.reduce((x,y)=>x+y,0)-1)<1e-12);assert.equal(a.weights.indexOf(Math.max(...a.weights)),c.focus);assert.equal(a.vector.length,3);assert.ok(a.vector.every(Number.isFinite));const heads=M.heads(c);assert.equal(heads.length,3);for(const h of heads)assert.ok(Math.abs(h.weights.reduce((x,y)=>x+y,0)-1)<1e-12);assert.deepEqual(M.contextualPoint(c,0),c.original);assert.deepEqual(M.contextualPoint(c,1),c.contextual);}
assert.deepEqual(M.softmax([1,1,1]).map(x=>Math.round(x*3)),[1,1,1]);
assert.ok(Math.abs(M.prediction.candidates.reduce((s,x)=>s+x.p,0)-1)<1e-12);
console.log('LLMLab: attention, heads, context and prediction passed');
