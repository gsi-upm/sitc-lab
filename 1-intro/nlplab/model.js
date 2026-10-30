(function(root){
const stop=new Set('a an the is are was were be been am i you he she it we they my your this that these those and or but of to in on at for from with as by do does did can could would will should not no'.split(' '));
function tokens(text){return [...text.matchAll(/[\p{L}\p{N}]+(?:['’][\p{L}]+)*/gu)].map(m=>m[0].toLowerCase());}
function terms(text,{removeStop=false,bigrams=false}={}){const t=tokens(text).filter(t=>!removeStop||!stop.has(t));return bigrams?t.slice(0,-1).map((x,i)=>x+' '+t[i+1]):t;}
function fit(texts,options={}){const docs=texts.map(t=>terms(t,options));const vocabulary=[...new Set(docs.flat())].sort();const counts=docs.map(t=>vocabulary.map(w=>t.filter(x=>x===w).length));const df=vocabulary.map((_,j)=>counts.filter(r=>r[j]>0).length);const idf=df.map(n=>Math.log((1+texts.length)/(1+n))+1);return {vocabulary,counts,df,idf,options,n:texts.length};}
function transform(model,text,method='tfidf'){const t=terms(text,model.options);return model.vocabulary.map((w,j)=>t.filter(x=>x===w).length*(method==='tfidf'?model.idf[j]:1));}
function vectors(model,method='tfidf'){return model.counts.map(r=>r.map((v,j)=>v*(method==='tfidf'?model.idf[j]:1)));}
function cosine(a,b){let dot=0,aa=0,bb=0;for(let i=0;i<a.length;i++){dot+=a[i]*b[i];aa+=a[i]*a[i];bb+=b[i]*b[i];}return aa&&bb?dot/Math.sqrt(aa*bb):0;}
function rank(documents,query){const m=fit(documents.map(d=>d.text),{removeStop:true});const q=transform(m,query);return {model:m,query:q,results:documents.map((d,i)=>({...d,score:cosine(q,vectors(m)[i]),matches:m.vocabulary.filter((w,j)=>q[j]&&m.counts[i][j])})).sort((a,b)=>b.score-a.score)};}
const lexicon={good:1,great:2,excellent:2,wonderful:2,love:2,like:1,happy:1,comfortable:1,clean:1,bad:-1,terrible:-2,hate:-2,dirty:-1,slow:-1,awful:-2,poor:-1};
function sentiment(text){const matches=tokens(text).filter(t=>t in lexicon).map(word=>({word,value:lexicon[word]}));const score=matches.reduce((a,x)=>a+x.value,0);return {matches,score,label:score>0?'POSITIVE':score<0?'NEGATIVE':'ZERO',mixed:matches.some(x=>x.value>0)&&matches.some(x=>x.value<0)};}
const api={tokens,terms,fit,transform,vectors,cosine,rank,sentiment,lexicon,stop};if(typeof module!=='undefined')module.exports=api;else root.NLPModel=api;
})(globalThis);
