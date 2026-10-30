let library, extractor, classifier;
async function model(kind){
 if(!library){library=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1');library.env.allowLocalModels=false;library.env.useBrowserCache=true;library.env.backends.onnx.wasm.numThreads=1;}
 const progress_callback=p=>postMessage({type:'progress',kind,status:p.status,file:p.file,progress:p.progress});
 if(kind==='embedding')return extractor ||= await library.pipeline('feature-extraction','Xenova/all-MiniLM-L6-v2',{dtype:'q8',device:'wasm',progress_callback});
 return classifier ||= await library.pipeline('text-classification','Xenova/distilbert-base-uncased-finetuned-sst-2-english',{dtype:'q8',device:'wasm',progress_callback});
}
onmessage=async({data})=>{try{const pipe=await model(data.kind);if(data.loadOnly){postMessage({type:'result',id:data.id,result:null});return;}let result;if(data.kind==='embedding'){const tensor=await pipe(data.texts,{pooling:'mean',normalize:true});result=tensor.tolist();}else{result=await pipe(data.texts,{top_k:null,truncation:true});}postMessage({type:'result',id:data.id,result});}catch(e){postMessage({type:'error',id:data.id,message:e.message});}};
