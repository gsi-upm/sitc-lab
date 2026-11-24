(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.LLMLabModel=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const contexts=[
    {
      id:'river',tokens:['The','bank','of','the','river'],query:1,focus:4,
      queries:[[.2,.1,.1],[.1,2.4,.3],[.1,.1,.3],[.2,.1,.1],[.2,1.4,.4]],
      keys:[[.1,.1,.1],[.3,1.0,.3],[.1,.1,.2],[.1,.1,.1],[.1,2.3,.3]],
      values:[[.05,.02,.02],[.55,.55,.35],[.03,.03,.05],[.05,.02,.02],[.05,1,.25]],
      original:[6,6],contextual:[5.4,5.9],mix:[.9,.1],
      sentence:{es:'La orilla del río',en:'The bank of the river'},
      meaning:{es:'bank = orilla',en:'bank = river bank'}
    },
    {
      id:'money',tokens:['Money','in','the','bank'],query:3,focus:0,
      queries:[[1.5,.2,.3],[.1,.1,.2],[.1,.1,.1],[2.4,.1,.3]],
      keys:[[2.3,.1,.3],[.1,.1,.2],[.1,.1,.1],[1,.3,.3]],
      values:[[1,.05,.25],[.03,.03,.05],[.05,.02,.02],[.55,.55,.35]],
      original:[6,6],contextual:[6.4,4.8],mix:[.8,.2],
      sentence:{es:'Dinero en el banco',en:'Money in the bank'},
      meaning:{es:'bank = banco',en:'bank = financial bank'}
    }
  ];
  const plane=[
    {id:'river',label:'river',xy:[0,5],group:'nature'},
    {id:'money',label:'money',xy:[8,0],group:'finance'},
    {id:'bank',label:'bank',xy:[6,6],group:'ambiguous'},
    {id:'stream',label:'stream',xy:[.8,4.2],group:'nature'},
    {id:'loan',label:'loan',xy:[7.4,.9],group:'finance'}
  ];
  function dot(a,b){return a.reduce((s,x,i)=>s+x*b[i],0);}
  function softmax(values){const max=Math.max(...values),exp=values.map(v=>Math.exp(v-max)),sum=exp.reduce((a,b)=>a+b,0);return exp.map(v=>v/sum);}
  function attention(context,index=context.query){
    const q=context.queries[index],scores=context.keys.map(k=>dot(q,k)/Math.sqrt(q.length));
    const weights=softmax(scores);
    const vector=context.values[0].map((_,d)=>context.values.reduce((s,v,i)=>s+v[d]*weights[i],0));
    return{q,scores,weights,vector};
  }
  function interpolate(a,b,t){return a.map((x,i)=>x+(b[i]-x)*t);}
  function contextualPoint(context,progress=1){return interpolate(context.original,context.contextual,Math.max(0,Math.min(1,progress)));}
  function normalize(values){const sum=values.reduce((a,b)=>a+b,0);return values.map(v=>v/sum);}
  function heads(context){const f=context.focus,q=context.query,n=context.tokens.length;return[
    {id:'meaning',weights:normalize(context.tokens.map((_,i)=>i===f?9:i===q?3:.4))},
    {id:'position',weights:normalize(context.tokens.map((_,i)=>1/(1+Math.abs(q-i))))},
    {id:'structure',weights:normalize(context.tokens.map((_,i)=>i===q?4:i===f?2.5:(i===1||i===2)?1.5:.5))}
  ];}
  const prediction={tokens:['Money','in','the'],candidates:[{word:'bank',p:.64},{word:'world',p:.17},{word:'market',p:.12},{word:'river',p:.07}]};
  return{contexts,plane,prediction,dot,softmax,attention,interpolate,contextualPoint,heads,normalize};
});
