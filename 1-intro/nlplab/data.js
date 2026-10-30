(function(root){
const data={
 documents:[
 {id:'cafe',title:['Cafetería','Cafeteria'],text:'The cafeteria serves hot meals, sandwiches and drinks at lunchtime.'},
 {id:'library',title:['Biblioteca','Library'],text:'The library lends books and provides quiet spaces to study.'},
 {id:'sport',title:['Deporte','Sports'],text:'The sports centre has a gym and courts for basketball and tennis.'},
 {id:'wifi',title:['Conexión Wi-Fi','Wi-Fi connection'],text:'Connect your laptop to the campus wireless network using your student account.'},
 {id:'scholarship',title:['Becas','Scholarships'],text:'Students can apply for financial aid to help pay tuition fees.'},
 {id:'health',title:['Atención sanitaria','Health care'],text:'The health service offers medical appointments when students feel ill.'}
 ],
 queries:["Where can I find hot meals and sandwiches?", "Where can I eat?", "Where can I find books and quiet spaces?", "I need somewhere quiet to read.", "How can I connect to the wireless network?", "How do I get online?", "I want to buy a train ticket."],
 queryKinds:["direct", "paraphrase", "direct", "paraphrase", "direct", "paraphrase", "unanswered"],
 sentiment:[
 {text:'The room is good.',pair:'The room is not good.',note:['El léxico suma «good» en ambos casos. ¿Detecta el transformer la negación?','The lexicon adds “good” in both cases. Does the transformer detect negation?']},
 {text:'I love this hotel.',pair:'I hate this hotel.',note:['Aquí basta una palabra explícita. Un método sencillo puede acertar.','Here one explicit word is enough. A simple method can succeed.']},
 {text:'The beer is cold.',pair:'The pizza is cold.',note:['La misma palabra puede valorarse de forma distinta según el objeto. Comprueba qué hace realmente el modelo.','The same word can be evaluated differently depending on the object. Check what the model actually does.']},
 {text:'Great food, slow service.',pair:'Terrible food, excellent service.',note:['Las dos reseñas mezclan valoraciones. Una etiqueta global pierde qué aspecto gusta o disgusta.','Both reviews mix evaluations. A global label loses which aspect is liked or disliked.']},
 {text:'The hotel has twenty rooms.',pair:'Wonderful! Another night without sleep.',note:['¿Es una opinión? ¿Hay ironía? Este clasificador sólo puede elegir positivo o negativo: no dispone de una clase neutral.','Is it an opinion? Is there irony? This classifier can only choose positive or negative: it has no neutral class.']}
 ],
 explorer:['Apple opened an office in Madrid in 2024.','The students were reading books in the library.','I do not like this hotel.','Mary likes green apples.',"I can't believe it's already 3.50 euros!","Dr. Smith works in the U.K.","Email help@example.com or visit https://example.com.","Barack Obama visited Microsoft in New York on January 10, 2024.","Apple and Google opened offices in London and Madrid in 2023.","Marie Curie was born in Warsaw on November 7, 1867."],
 vectorDocs:['Summer is coming but Summer is short','I like the Summer and I like the Winter','I like sandwiches and I like the Winter'],
 models:{embedding:'Xenova/all-MiniLM-L6-v2',sentiment:'Xenova/distilbert-base-uncased-finetuned-sst-2-english'}
};
if(typeof module!=='undefined')module.exports=data;else root.NLPData=data;
})(globalThis);
