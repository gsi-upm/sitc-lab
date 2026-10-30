"""Rebuild prepared linguistic annotations: spaCy 3.8 + en_core_web_sm 3.8.0."""
import json
from pathlib import Path
import spacy
nlp=spacy.load('en_core_web_sm')
texts=['Apple opened an office in Madrid in 2024.','The students were reading books in the library.','I do not like this hotel.','Mary likes green apples.',"I can't believe it's already 3.50 euros!",'Dr. Smith works in the U.K.','Email help@example.com or visit https://example.com.']
texts += ['Barack Obama visited Microsoft in New York on January 10, 2024.', 'Apple and Google opened offices in London and Madrid in 2023.', 'Marie Curie was born in Warsaw on November 7, 1867.']
examples=[]
for text in texts:
 doc=nlp(text);rows=[]
 for token in doc:
  ent=next((e for e in doc.ents if e.start<=token.i<e.end),None)
  rows.append(dict(text=token.text,start=token.idx,end=token.idx+len(token),lemma=token.lemma_,pos=token.pos_,entity=token.ent_type_,entityText=ent.text if ent else ''))
 examples.append(dict(text=text,tokens=rows))
path=Path(__file__).resolve().parents[1]/'data'/'linguistic.json'
path.write_text(json.dumps(dict(model='en_core_web_sm '+nlp.meta['version'],spacy=spacy.__version__,examples=examples),ensure_ascii=False,indent=2))
print(path)
