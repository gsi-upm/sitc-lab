const assert=require('node:assert/strict'),M=require('../../1-intro/nlplab/model.js'),D=require('../../1-intro/nlplab/data.js'),C=require('../../1-intro/nlplab/data/precomputed.json'),A=require('../../1-intro/nlplab/data/linguistic.json');
const m=M.fit(['a cat cat','a dog','a bird']);assert.equal(m.df[m.vocabulary.indexOf('a')],3);assert.equal(m.idf[m.vocabulary.indexOf('a')],1);assert.ok(Math.abs(m.idf[m.vocabulary.indexOf('cat')]-(Math.log(2)+1))<1e-12);assert.equal(m.counts[0][m.vocabulary.indexOf('cat')],2);
assert.equal(M.cosine([0,0],[2,1]),0);assert.ok(Math.abs(M.cosine([2,0],[1,0])-1)<1e-12);assert.equal(M.cosine([1,0],[0,1]),0);
const order=M.fit(['I like Summer','Summer like I']);assert.deepEqual(order.counts[0],order.counts[1]);assert.notDeepEqual(M.terms('I like Summer',{bigrams:true}),M.terms('Summer like I',{bigrams:true}));assert.equal(M.sentiment('good').score,M.sentiment('not good').score);assert.equal(M.sentiment('terrible excellent').score,0);
assert.deepEqual(M.fit(['...',''],{bigrams:true}).vocabulary,[]);assert.deepEqual(M.tokens('<script>hello</script>'),['script','hello','script']);
for(const [s,v] of Object.entries(C.embeddings)){assert.equal(v.length,384);assert.ok(v.every(Number.isFinite));assert.ok(Math.abs(v.reduce((a,x)=>a+x*x,0)-1)<1e-5);}
for(const scores of Object.values(C.sentiment)){assert.equal(scores.length,2);assert.ok(Math.abs(scores.reduce((a,x)=>a+x.score,0)-1)<1e-5);}
for(const a of A.examples)for(const tok of a.tokens)assert.equal(a.text.slice(tok.start,tok.end),tok.text);
const q='Where can I eat?',r=M.rank(D.documents,q);assert.ok(r.query.every(x=>x===0));
for(const [i,id] of [[0,'cafe'],[2,'library'],[4,'wifi']]){const direct=M.rank(D.documents,D.queries[i]);assert.equal(direct.results[0].id,id);assert.ok(direct.results[0].score>0);assert.ok(C.embeddings[D.queries[i]]);}
const sem=D.documents.map(d=>({id:d.id,s:M.cosine(C.embeddings[q],C.embeddings[d.text])})).sort((a,b)=>b.s-a.s);assert.equal(sem[0].id,'cafe');
assert.equal(C.sentiment['The room is not good.'][0].label,'NEGATIVE');console.log('NLP: IDF, counts, cosine, order, lexicon, real fixtures and token offsets passed');
