/* Small, deterministic teaching graph. Values are deliberately compact so the
   learner can follow every fact from the text to RDF and SPARQL. */
window.LinkedLabModel = (() => {
  const nodes = [
    { id: 'gsi', kind: 'resource', type: 'organization', x: 85, y: 220, label: { es: 'GSI', en: 'GSI' }, uri: 'ex:gsi' },
    { id: 'upm', kind: 'resource', type: 'university', x: 275, y: 220, label: { es: 'UPM', en: 'UPM' }, uri: 'ex:upm' },
    { id: 'madrid', kind: 'resource', type: 'city', x: 465, y: 220, label: { es: 'Madrid', en: 'Madrid' }, uri: 'dbr:Madrid' },
    { id: 'spain', kind: 'resource', type: 'country', x: 655, y: 220, label: { es: 'España', en: 'Spain' }, uri: 'dbr:Spain' },
    { id: 'university', kind: 'resource', type: 'class', x: 275, y: 70, label: { es: 'Universidad', en: 'University' }, uri: 'dbo:University' },
    { id: '1971', kind: 'literal', type: 'year', x: 275, y: 385, label: { es: '1971', en: '1971' }, uri: '"1971"^^xsd:gYear' },
    { id: 'dbpedia-upm', kind: 'external', type: 'university', x: 465, y: 385, label: { es: 'UPM en DBpedia', en: 'UPM in DBpedia' }, uri: 'dbr:Technical_University_of_Madrid' },
    { id: 'europe', kind: 'external', type: 'continent', x: 655, y: 70, label: { es: 'Europa', en: 'Europe' }, uri: 'dbr:Europe' }
  ];

  const edges = [
    { id: 'partOf', source: 'gsi', target: 'upm', predicate: 'org:unitOf', extracted: true, label: { es: 'pertenece a', en: 'belongs to' } },
    { id: 'type', source: 'upm', target: 'university', predicate: 'rdf:type', extracted: true, label: { es: 'es una', en: 'is a' } },
    { id: 'city', source: 'upm', target: 'madrid', predicate: 'dbo:city', extracted: true, label: { es: 'está en', en: 'is in' } },
    { id: 'founded', source: 'upm', target: '1971', predicate: 'dbo:foundingYear', extracted: true, label: { es: 'se fundó en', en: 'was founded in' } },
    { id: 'country', source: 'madrid', target: 'spain', predicate: 'dbo:country', extracted: true, label: { es: 'está en', en: 'is in' } },
    { id: 'sameAs', source: 'upm', target: 'dbpedia-upm', predicate: 'owl:sameAs', external: true, label: { es: 'mismo recurso', en: 'same resource' } },
    { id: 'continent', source: 'spain', target: 'europe', predicate: 'dbo:continent', external: true, label: { es: 'continente', en: 'continent' } }
  ];

  const facts = [
    { id: 'partOf', sentence: 0 },
    { id: 'type', sentence: 0 },
    { id: 'city', sentence: 1 },
    { id: 'founded', sentence: 1 },
    { id: 'country', sentence: 2 }
  ];

  const copy = {
    es: {
      title: 'Del texto a un grafo de conocimiento',
      intro: 'Descubre cómo un texto se convierte en entidades y relaciones. Después expresa el mismo conocimiento con RDF, identifícalo con URI y consulta el grafo con SPARQL.',
      path: ['Texto', 'Grafo', 'RDF', 'URI', 'SPARQL', 'Linked Data', 'Beatles', 'Más Beatles'],
      steps: ['Extrae conocimiento', 'Entiende el grafo', 'Modela con RDF', 'Identifica y reutiliza', 'Consulta con SPARQL', 'Enlaza con DBpedia', 'Practica con canciones y músicos', 'Amplía el grafo con instrumentos'],
      tabLabels: ['Texto → grafo', 'Grafo', 'RDF', 'URI y vocabularios', 'SPARQL', 'Linked Data', 'Beatles', 'Más Beatles'],
      previous: 'Anterior', next: 'Siguiente', finish: 'Terminar',
      stepCount: n => `Paso ${n} de 8`,
      textLabel: 'Texto de partida', graphLabel: 'Grafo de conocimiento',
      transform: 'Transformar en grafo', reset: 'Reiniciar',
      sourceText: 'El Grupo de Sistemas Inteligentes (GSI) pertenece a la Universidad Politécnica de Madrid (UPM). La UPM está en Madrid y fue fundada en 1971. Madrid está en España.',
      extractionIntro: 'Pulsa el botón y observa cómo las menciones del texto se convierten en nodos y las expresiones verbales en relaciones.',
      extractionNote: 'El color indica qué se ha detectado: recursos, propiedades o valores literales. Pulsa cualquier etiqueta para seguirla hasta el grafo.',
      legendResource: 'Recurso o entidad', legendProperty: 'Propiedad o relación', legendLiteral: 'Valor literal', legendExternal: 'Dato externo',
      emptyGraph: 'El grafo aparecerá aquí', emptyGraphHint: 'Primero transforma el texto.',
      graphDefinition: 'Un grafo de conocimiento representa hechos mediante nodos y relaciones con significado. Los nodos pueden ser entidades identificables o valores literales.',
      kgFormulaTitle: '¿Qué convierte el dibujo en un grafo de conocimiento?',
      kgParts: [
        ['Identidad', 'Los recursos pueden identificarse de forma inequívoca; después veremos cómo hacerlo con URI.'],
        ['Semántica', 'Los tipos y las relaciones tienen un significado explícito, no son líneas sin nombre.'],
        ['Conexión', 'Los hechos comparten nodos y pueden combinarse para obtener conocimiento nuevo mediante consultas.']
      ],
      kgFormulaResult: 'Entidades identificables + relaciones con significado + hechos conectados = grafo de conocimiento',
      graphTask: 'Inspecciona los nodos', graphTaskHint: 'Pulsa un nodo para saber qué representa y qué hechos lo conectan.',
      inspectorEmpty: 'Selecciona un nodo del grafo.',
      resource: 'Recurso', literal: 'Literal', external: 'Recurso externo', classLabel: 'Clase',
      identifier: 'Identificador', connections: 'Hechos conectados',
      classifyQuestion: 'En el hecho “La UPM fue fundada en 1971”, ¿qué es 1971?',
      classifyResource: 'Un recurso con identidad propia', classifyLiteral: 'Un valor literal', classifyClass: 'Una propiedad',
      correctLiteral: 'Correcto: 1971 es un valor. No necesitamos convertir cada número o texto en un recurso.',
      tryAgain: 'Todavía no. Observa si el elemento identifica una cosa o expresa un valor sobre ella.',
      rdfDefinition: 'RDF expresa cada hecho como una tripla ordenada: sujeto, predicado y objeto. El conjunto de triplas vuelve a formar el mismo grafo.',
      triplesTitle: 'Los hechos del texto como triplas', turtleTitle: 'El mismo grafo en Turtle',
      subject: 'Sujeto', predicate: 'Predicado', object: 'Objeto',
      compact: 'Prefijos', full: 'URI completas',
      selectTriple: 'Pulsa una fila para localizar esa tripla en el grafo y en Turtle.',
      modellingTask: 'Completa una tripla RDF', modellingSentence: 'La UPM fue fundada en 1971.',
      choose: 'Elige…', check: 'Comprobar',
      correctTriple: 'Bien: el sujeto es el recurso descrito, el predicado nombra la relación y el objeto es el valor.',
      wrongTriple: 'Revisa el orden: ¿qué recurso describimos?, ¿qué relación afirmamos?, ¿cuál es el valor?',
      uriDefinition: 'Las etiquetas ayudan a las personas; las URI identifican recursos y propiedades sin ambigüedad. Los prefijos sólo abrevian esas URI.',
      labelHuman: 'Etiqueta para personas', uriMachine: 'URI para identificar', vocabulary: 'Vocabulario compartido',
      labelAmbiguity: 'Puede repetirse y ser ambigua',
      prefixTitle: 'Abreviaturas usadas', uriTask: '¿Qué modelado facilita enlazar y reutilizar datos?',
      uriGood: 'ex:upm dbo:city dbr:Madrid .',
      uriBadLiteral: '"UPM" "está en" "Madrid" .',
      uriBadLocal: 'ex:upm ex:estaEn ex:madrid .',
      uriGoodNote: 'Correcto: los recursos tienen URI y la propiedad reutiliza un vocabulario conocido. Madrid ya enlaza con DBpedia.',
      uriLocalNote: 'Es RDF válido, pero una propiedad local y un Madrid local dificultan la integración si ya existen términos compartidos.',
      uriLiteralNote: 'No: las cadenas de texto no identifican las entidades ni la relación.',
      sparqlDefinition: 'SPARQL no recorre una tabla: busca patrones de triplas. Una variable, como ?city, ocupa el lugar del dato que queremos encontrar.',
      question: 'Pregunta', query: 'Consulta SPARQL', runQuery: 'Buscar coincidencias', result: 'Resultado',
      matchIdle: 'Ejecuta la consulta para ver cómo cada patrón encuentra una parte del grafo.',
      matchStart: 'SPARQL compara los patrones del bloque WHERE con las triplas del grafo.',
      matchDone: 'Los patrones comparten variables: al encajarlos, obtenemos la respuesta seleccionada en SELECT.',
      linkedDefinition: 'Linked Data publica grafos con URI HTTP y añade enlaces a otros grafos. DBpedia es un grafo de conocimiento publicado siguiendo estos principios.',
      localGraph: 'Sólo nuestro grafo', enrich: 'Enlazar con DBpedia', removeLinks: 'Ocultar datos externos',
      extractedFacts: 'Del texto', externalFacts: 'Desde DBpedia',
      principlesTitle: 'Los cuatro principios en esta escena',
      principles: ['Usar URI para nombrar recursos', 'Usar URI HTTP que puedan consultarse', 'Ofrecer información útil con RDF', 'Añadir enlaces a otras URI'],
      linkedNote: 'Las relaciones en color proceden del texto. Las grises representan conocimiento que aparece al seguir enlaces externos.',
      challengeTitle: 'Beatles: canciones y músicos',
      challengeText: 'Empieza con un grafo sencillo: las canciones se conectan con los músicos que las interpretan. Practica consultas SPARQL de un solo patrón.',
      challengeIntro: 'Cada flecha “interpretada por” expresa una relación entre una canción y un músico.',
      challengeRouteTitle: 'SPARQL básico: encuentra patrones en el grafo',
      challengeComplete: 'Has consultado tipos, músicos de una canción y canciones de un músico. Ya puedes ampliar el grafo con nuevos recursos y relaciones.',
      moreBeatlesTitle: 'Más Beatles: añade instrumentos',
      moreBeatlesText: 'Amplía el grafo anterior con instrumentos y resuelve consultas que combinan varios patrones y resultados agregados.',
      moreBeatlesIntro: 'Ahora los músicos se enlazan también con los instrumentos que tocan. Los dos colores distinguen “interpretada por” y “toca”.',
      graphModelTitle: 'Ampliación: instrumentos como nodos',
      graphModelText: 'Cada instrumento es un recurso con tipo e identificador propios. Puede conectarse con varios músicos, aparecer en resultados y participar en recuentos.',
      graphInventory: counts => `Este grafo contiene ${counts.song} canciones · ${counts.musician} músicos · ${counts.instrument} instrumentos`,
      sparqlRouteTitle: 'Ruta SPARQL: de patrones sencillos a consultas agregadas',
      challengeRdfType: 'En SPARQL, “a” es una abreviatura de rdf:type.',
      beatlesKinds: { song: 'Canción', musician: 'Músico', instrument: 'Instrumento' },
      beatlesRelations: { performedBy: 'Interpretada por', plays: 'Toca' },
      challengeProgress: (n, total) => `${n} de ${total} resueltas`,
      challengeChoose: 'Elige una consulta', challengeCheck: 'Comprobar consulta',
      challengeCorrect: 'Correcto: la consulta responde a la pregunta sobre este grafo.',
      challengeWrong: 'Esa consulta no sigue el patrón necesario. Revisa la dirección de las relaciones y las variables.',
      challengeResult: 'Resultado sobre este grafo',
      moreBeatlesComplete: 'Has resuelto recorridos de dos saltos, COUNT con GROUP BY, HAVING y una agregación que combina canciones, músicos e instrumentos.',
      challengeSource: 'Ejercicio adaptado del notebook SPARQL de los Beatles',
      conclusionsTitle: 'Qué debes recordar',
      conclusions: [
        ['Grafo de conocimiento', 'Entidades y valores conectados por relaciones con significado.'],
        ['RDF', 'Una forma estándar de expresar el grafo mediante triplas.'],
        ['SPARQL', 'Un lenguaje para encontrar patrones dentro de grafos RDF.'],
        ['Linked Data', 'Principios para identificar, publicar y enlazar grafos en la Web.']
      ],
      completed: 'LinkedLab completado.'
    },
    en: {
      title: 'From text to a knowledge graph',
      intro: 'See how text becomes entities and relationships. Then express the same knowledge with RDF, identify it with URIs and query the graph with SPARQL.',
      path: ['Text', 'Graph', 'RDF', 'URI', 'SPARQL', 'Linked Data', 'Beatles', 'More Beatles'],
      steps: ['Extract knowledge', 'Understand the graph', 'Model with RDF', 'Identify and reuse', 'Query with SPARQL', 'Link to DBpedia', 'Practise with songs and musicians', 'Extend the graph with instruments'],
      tabLabels: ['Text → graph', 'Graph', 'RDF', 'URI & vocabularies', 'SPARQL', 'Linked Data', 'Beatles', 'More Beatles'],
      previous: 'Previous', next: 'Next', finish: 'Finish',
      stepCount: n => `Step ${n} of 8`,
      textLabel: 'Source text', graphLabel: 'Knowledge graph',
      transform: 'Transform into a graph', reset: 'Reset',
      sourceText: 'The Intelligent Systems Group (GSI) belongs to the Technical University of Madrid (UPM). UPM is in Madrid and was founded in 1971. Madrid is in Spain.',
      extractionIntro: 'Press the button and watch text mentions become nodes and verbal expressions become relationships.',
      extractionNote: 'Colours show what was detected: resources, properties or literal values. Select any label to trace it into the graph.',
      legendResource: 'Resource or entity', legendProperty: 'Property or relationship', legendLiteral: 'Literal value', legendExternal: 'External fact',
      emptyGraph: 'The graph will appear here', emptyGraphHint: 'Transform the text first.',
      graphDefinition: 'A knowledge graph represents facts as meaningful nodes and relationships. Nodes can be identifiable entities or literal values.',
      kgFormulaTitle: 'What turns the diagram into a knowledge graph?',
      kgParts: [
        ['Identity', 'Resources can be identified unambiguously; later we use URIs to do this.'],
        ['Semantics', 'Types and relationships have explicit meaning; they are not unnamed lines.'],
        ['Connection', 'Facts share nodes and can be combined by queries to obtain new knowledge.']
      ],
      kgFormulaResult: 'Identifiable entities + meaningful relationships + connected facts = knowledge graph',
      graphTask: 'Inspect the nodes', graphTaskHint: 'Select a node to learn what it represents and which facts connect it.',
      inspectorEmpty: 'Select a graph node.',
      resource: 'Resource', literal: 'Literal', external: 'External resource', classLabel: 'Class',
      identifier: 'Identifier', connections: 'Connected facts',
      classifyQuestion: 'In the fact “UPM was founded in 1971”, what is 1971?',
      classifyResource: 'A resource with its own identity', classifyLiteral: 'A literal value', classifyClass: 'A property',
      correctLiteral: 'Correct: 1971 is a value. We do not need to turn every number or string into a resource.',
      tryAgain: 'Not yet. Ask whether the element identifies a thing or expresses a value about it.',
      rdfDefinition: 'RDF expresses each fact as an ordered triple: subject, predicate and object. The set of triples recreates the same graph.',
      triplesTitle: 'Text facts as triples', turtleTitle: 'The same graph in Turtle',
      subject: 'Subject', predicate: 'Predicate', object: 'Object',
      compact: 'Prefixes', full: 'Full URIs',
      selectTriple: 'Select a row to locate that triple in the graph and in Turtle.',
      modellingTask: 'Complete an RDF triple', modellingSentence: 'UPM was founded in 1971.',
      choose: 'Choose…', check: 'Check',
      correctTriple: 'Good: the subject is the resource being described, the predicate names the relationship and the object is the value.',
      wrongTriple: 'Check the order: which resource do we describe, which relationship do we assert and what is the value?',
      uriDefinition: 'Labels help people; URIs identify resources and properties unambiguously. Prefixes only abbreviate those URIs.',
      labelHuman: 'Human-facing label', uriMachine: 'URI for identity', vocabulary: 'Shared vocabulary',
      labelAmbiguity: 'It can be repeated and ambiguous',
      prefixTitle: 'Prefixes in use', uriTask: 'Which model makes data easier to link and reuse?',
      uriGood: 'ex:upm dbo:city dbr:Madrid .',
      uriBadLiteral: '"UPM" "is in" "Madrid" .',
      uriBadLocal: 'ex:upm ex:isIn ex:madrid .',
      uriGoodNote: 'Correct: resources have URIs and the property reuses a known vocabulary. Madrid already links to DBpedia.',
      uriLocalNote: 'This is valid RDF, but a local property and local Madrid make integration harder when shared terms already exist.',
      uriLiteralNote: 'No: strings do not identify the entities or the relationship.',
      sparqlDefinition: 'SPARQL does not scan a table: it looks for triple patterns. A variable such as ?city stands in for the value we want to find.',
      question: 'Question', query: 'SPARQL query', runQuery: 'Find matches', result: 'Result',
      matchIdle: 'Run the query to see how each pattern finds a part of the graph.',
      matchStart: 'SPARQL compares the patterns in the WHERE block with graph triples.',
      matchDone: 'The patterns share variables: fitting them together yields the answer selected in SELECT.',
      linkedDefinition: 'Linked Data publishes graphs with HTTP URIs and adds links to other graphs. DBpedia is a knowledge graph published according to these principles.',
      localGraph: 'Only our graph', enrich: 'Link to DBpedia', removeLinks: 'Hide external data',
      extractedFacts: 'From the text', externalFacts: 'From DBpedia',
      principlesTitle: 'The four principles in this scene',
      principles: ['Use URIs to name resources', 'Use HTTP URIs that can be looked up', 'Provide useful information with RDF', 'Add links to other URIs'],
      linkedNote: 'Coloured relationships come from the text. Grey ones represent knowledge found by following external links.',
      challengeTitle: 'Beatles: songs and musicians',
      challengeText: 'Start with a simple graph: songs connect to the musicians who perform them. Practise SPARQL queries with a single pattern.',
      challengeIntro: 'Each “performed by” arrow expresses a relationship between a song and a musician.',
      challengeRouteTitle: 'Basic SPARQL: find patterns in the graph',
      challengeComplete: 'You queried types, the musicians on a song and the songs by a musician. You can now extend the graph with new resources and relationships.',
      moreBeatlesTitle: 'More Beatles: add instruments',
      moreBeatlesText: 'Extend the previous graph with instruments and solve queries that combine several patterns and aggregate results.',
      moreBeatlesIntro: 'Musicians now also link to the instruments they play. The two colours distinguish “performed by” and “plays”.',
      graphModelTitle: 'Extension: instruments as nodes',
      graphModelText: 'Each instrument is a resource with its own type and identifier. It can connect to several musicians, appear in results and take part in counts.',
      graphInventory: counts => `This graph contains ${counts.song} songs · ${counts.musician} musicians · ${counts.instrument} instruments`,
      sparqlRouteTitle: 'SPARQL route: from simple patterns to aggregate queries',
      challengeRdfType: 'In SPARQL, “a” is shorthand for rdf:type.',
      beatlesKinds: { song: 'Song', musician: 'Musician', instrument: 'Instrument' },
      beatlesRelations: { performedBy: 'Performed by', plays: 'Plays' },
      challengeProgress: (n, total) => `${n} of ${total} solved`,
      challengeChoose: 'Choose a query', challengeCheck: 'Check query',
      challengeCorrect: 'Correct: the query answers the question over this graph.',
      challengeWrong: 'That query does not follow the required pattern. Check relationship direction and variables.',
      challengeResult: 'Result over this graph',
      moreBeatlesComplete: 'You solved two-hop traversals, COUNT with GROUP BY, HAVING and an aggregation combining songs, musicians and instruments.',
      challengeSource: 'Exercise adapted from the Beatles SPARQL notebook',
      conclusionsTitle: 'What to remember',
      conclusions: [
        ['Knowledge graph', 'Entities and values connected by meaningful relationships.'],
        ['RDF', 'A standard way to express the graph as triples.'],
        ['SPARQL', 'A language for finding patterns in RDF graphs.'],
        ['Linked Data', 'Principles for identifying, publishing and linking graphs on the Web.']
      ],
      completed: 'LinkedLab completed.'
    }
  };

  const queries = [
    {
      id: 'city',
      question: { es: '¿En qué ciudad está la UPM?', en: 'Which city is UPM in?' },
      code: 'PREFIX dbo: <http://dbpedia.org/ontology/>\nPREFIX ex:  <https://example.org/>\n\nSELECT ?city\nWHERE {\n  ex:upm dbo:city ?city .\n}',
      edges: ['city'],
      columns: ['city'],
      rows: [['dbr:Madrid']]
    },
    {
      id: 'country-gsi',
      question: { es: '¿En qué país está el GSI?', en: 'Which country is GSI in?' },
      code: 'PREFIX dbo: <http://dbpedia.org/ontology/>\nPREFIX org: <http://www.w3.org/ns/org#>\nPREFIX ex:  <https://example.org/>\n\nSELECT ?country\nWHERE {\n  ex:gsi org:unitOf ?university .\n  ?university dbo:city ?city .\n  ?city dbo:country ?country .\n}',
      edges: ['partOf', 'city', 'country'],
      columns: ['country'],
      rows: [['dbr:Spain']]
    },
    {
      id: 'year',
      question: { es: '¿Cuándo se fundó la UPM?', en: 'When was UPM founded?' },
      code: 'PREFIX dbo: <http://dbpedia.org/ontology/>\nPREFIX ex:  <https://example.org/>\n\nSELECT ?year\nWHERE {\n  ex:upm dbo:foundingYear ?year .\n}',
      edges: ['founded'],
      columns: ['year'],
      rows: [['1971']]
    }
  ];

  // A compact, deterministic subset inspired by the Beatles SPARQL notebook.
  // It is embedded so the final exercise works without Fuseki or network access.
  const beatlesNodes = [
    { id: 'hey-jude', kind: 'song', x: 105, y: 105, label: 'Hey Jude', uri: 'song:HeyJude' },
    { id: 'come-together', kind: 'song', x: 105, y: 250, label: 'Come Together', uri: 'song:ComeTogether' },
    { id: 'yesterday', kind: 'song', x: 105, y: 395, label: 'Yesterday', uri: 'song:Yesterday' },
    { id: 'john', kind: 'musician', x: 485, y: 65, label: 'John Lennon', uri: 'm:JohnLennon' },
    { id: 'paul', kind: 'musician', x: 485, y: 180, label: 'Paul McCartney', uri: 'm:PaulMcCartney' },
    { id: 'george', kind: 'musician', x: 485, y: 305, label: 'George Harrison', uri: 'm:GeorgeHarrison' },
    { id: 'ringo', kind: 'musician', x: 485, y: 430, label: 'Ringo Starr', uri: 'm:RingoStarr' },
    { id: 'vocals', kind: 'instrument', x: 875, y: 45, label: { es: 'Voz', en: 'Vocals' }, uri: 'i:Vocals' },
    { id: 'guitar', kind: 'instrument', x: 875, y: 140, label: { es: 'Guitarra', en: 'Guitar' }, uri: 'i:Guitar' },
    { id: 'bass', kind: 'instrument', x: 875, y: 235, label: { es: 'Bajo', en: 'Bass' }, uri: 'i:Bass' },
    { id: 'piano', kind: 'instrument', x: 875, y: 330, label: 'Piano', uri: 'i:Piano' },
    { id: 'drums', kind: 'instrument', x: 875, y: 425, label: { es: 'Batería', en: 'Drums' }, uri: 'i:Drums' }
  ];

  const beatlesEdges = [
    { id: 'hj-john', source: 'hey-jude', target: 'john', predicate: 'ex:performedBy', kind: 'performedBy' },
    { id: 'hj-paul', source: 'hey-jude', target: 'paul', predicate: 'ex:performedBy', kind: 'performedBy' },
    { id: 'hj-george', source: 'hey-jude', target: 'george', predicate: 'ex:performedBy', kind: 'performedBy' },
    { id: 'hj-ringo', source: 'hey-jude', target: 'ringo', predicate: 'ex:performedBy', kind: 'performedBy' },
    { id: 'ct-john', source: 'come-together', target: 'john', predicate: 'ex:performedBy', kind: 'performedBy' },
    { id: 'ct-paul', source: 'come-together', target: 'paul', predicate: 'ex:performedBy', kind: 'performedBy' },
    { id: 'ct-george', source: 'come-together', target: 'george', predicate: 'ex:performedBy', kind: 'performedBy' },
    { id: 'ct-ringo', source: 'come-together', target: 'ringo', predicate: 'ex:performedBy', kind: 'performedBy' },
    { id: 'yd-paul', source: 'yesterday', target: 'paul', predicate: 'ex:performedBy', kind: 'performedBy' },
    { id: 'john-vocals', source: 'john', target: 'vocals', predicate: 'ex:plays', kind: 'plays' },
    { id: 'john-guitar', source: 'john', target: 'guitar', predicate: 'ex:plays', kind: 'plays' },
    { id: 'paul-vocals', source: 'paul', target: 'vocals', predicate: 'ex:plays', kind: 'plays' },
    { id: 'paul-bass', source: 'paul', target: 'bass', predicate: 'ex:plays', kind: 'plays' },
    { id: 'paul-guitar', source: 'paul', target: 'guitar', predicate: 'ex:plays', kind: 'plays' },
    { id: 'paul-piano', source: 'paul', target: 'piano', predicate: 'ex:plays', kind: 'plays' },
    { id: 'george-guitar', source: 'george', target: 'guitar', predicate: 'ex:plays', kind: 'plays' },
    { id: 'ringo-drums', source: 'ringo', target: 'drums', predicate: 'ex:plays', kind: 'plays' }
  ];

  const beatlesQuestions = [
    {
      id: 'basic-types',
      question: { es: '¿Qué tipos de recursos hay en el grafo?', en: 'Which resource types are in the graph?' },
      concept: 'DISTINCT',
      explanation: { es: 'El patrón “?entity a ?type” busca el tipo de cada recurso. DISTINCT elimina los tipos repetidos.', en: 'The “?entity a ?type” pattern finds each resource type. DISTINCT removes repeated types.' },
      options: [
        'PREFIX s: <http://learningsparql.com/ns/schema/>\n\nSELECT DISTINCT ?type\nWHERE {\n  ?entity a ?type .\n}',
        'PREFIX s: <http://learningsparql.com/ns/schema/>\n\nSELECT DISTINCT ?type\nWHERE {\n  ?type a ?entity .\n}',
        'PREFIX s: <http://learningsparql.com/ns/schema/>\n\nSELECT ?entity\nWHERE {\n  ?entity a s:Song .\n}'
      ],
      correct: 0,
      columns: ['type'],
      rows: [['s:Song'], ['s:Musician']],
      activeEdges: [],
      activeNodes: beatlesNodes.filter(node => node.kind !== 'instrument').map(node => node.id)
    },
    {
      id: 'hey-jude-musicians',
      question: { es: '¿Qué músicos participaron en Hey Jude?', en: 'Which musicians performed on Hey Jude?' },
      concept: { es: 'Un patrón', en: 'One pattern' },
      explanation: { es: 'Fijamos la canción y usamos ?musician como variable para encontrar todos los recursos conectados mediante “interpretada por”.', en: 'We fix the song and use ?musician as a variable to find every resource connected through “performed by”.' },
      options: [
        'PREFIX ex: <https://example.org/beatles/>\nPREFIX song: <http://learningsparql.com/ns/song/>\n\nSELECT ?musician\nWHERE {\n  ?musician ex:performedBy song:HeyJude .\n}',
        'PREFIX ex: <https://example.org/beatles/>\nPREFIX song: <http://learningsparql.com/ns/song/>\n\nSELECT ?musician\nWHERE {\n  song:HeyJude ex:performedBy ?musician .\n}\nORDER BY ?musician',
        'PREFIX ex: <https://example.org/beatles/>\nPREFIX song: <http://learningsparql.com/ns/song/>\n\nSELECT ?musician\nWHERE {\n  song:HeyJude ex:plays ?musician .\n}'
      ],
      correct: 1,
      columns: ['musician'],
      rows: [['m:GeorgeHarrison'], ['m:JohnLennon'], ['m:PaulMcCartney'], ['m:RingoStarr']],
      activeEdges: ['hj-john', 'hj-paul', 'hj-george', 'hj-ringo'],
      activeNodes: []
    },
    {
      id: 'paul-songs',
      question: { es: '¿En qué canciones aparece Paul McCartney?', en: 'Which songs feature Paul McCartney?' },
      concept: { es: 'Recurso fijo', en: 'Fixed resource' },
      explanation: { es: 'Ahora fijamos el músico como objeto y dejamos ?song como variable. El mismo patrón sirve para formular otra pregunta.', en: 'Now we fix the musician as the object and leave ?song as the variable. The same pattern answers a different question.' },
      options: [
        'PREFIX ex: <https://example.org/beatles/>\nPREFIX m: <http://learningsparql.com/ns/musician/>\n\nSELECT DISTINCT ?song\nWHERE {\n  m:PaulMcCartney ex:performedBy ?song .\n}',
        'PREFIX ex: <https://example.org/beatles/>\nPREFIX m: <http://learningsparql.com/ns/musician/>\n\nSELECT DISTINCT ?song\nWHERE {\n  ?song ex:plays m:PaulMcCartney .\n}',
        'PREFIX ex: <https://example.org/beatles/>\nPREFIX m: <http://learningsparql.com/ns/musician/>\n\nSELECT DISTINCT ?song\nWHERE {\n  ?song ex:performedBy m:PaulMcCartney .\n}\nORDER BY ?song'
      ],
      correct: 2,
      columns: ['song'],
      rows: [['song:ComeTogether'], ['song:HeyJude'], ['song:Yesterday']],
      activeEdges: ['hj-paul', 'ct-paul', 'yd-paul'],
      activeNodes: []
    },
  ];

  const moreBeatlesQuestions = [
    {
      id: 'hey-jude-instruments',
      question: { es: '¿Qué músicos participaron en Hey Jude y qué instrumentos toca cada uno?', en: 'Which musicians performed on Hey Jude and which instruments does each one play?' },
      concept: { es: 'Dos saltos', en: 'Two hops' },
      explanation: { es: 'La variable compartida ?musician une dos patrones: canción → músico y músico → instrumento.', en: 'The shared ?musician variable joins two patterns: song → musician and musician → instrument.' },
      options: [
        'PREFIX ex: <https://example.org/beatles/>\nPREFIX song: <http://learningsparql.com/ns/song/>\n\nSELECT DISTINCT ?musician ?instrument\nWHERE {\n  ?musician ex:performedBy song:HeyJude .\n  ?instrument ex:plays ?musician .\n}',
        'PREFIX ex: <https://example.org/beatles/>\nPREFIX song: <http://learningsparql.com/ns/song/>\n\nSELECT DISTINCT ?musician ?instrument\nWHERE {\n  song:HeyJude ex:performedBy ?musician .\n  ?musician ex:plays ?instrument .\n}\nORDER BY ?musician ?instrument',
        'PREFIX ex: <https://example.org/beatles/>\nPREFIX song: <http://learningsparql.com/ns/song/>\n\nSELECT DISTINCT ?musician ?instrument\nWHERE {\n  song:HeyJude ex:plays ?instrument .\n  ?instrument ex:performedBy ?musician .\n}'
      ],
      correct: 1,
      columns: ['musician', 'instrument'],
      rows: [
        ['m:GeorgeHarrison', 'i:Guitar'],
        ['m:JohnLennon', 'i:Guitar'],
        ['m:JohnLennon', 'i:Vocals'],
        ['m:PaulMcCartney', 'i:Bass'],
        ['m:PaulMcCartney', 'i:Guitar'],
        ['m:PaulMcCartney', 'i:Piano'],
        ['m:PaulMcCartney', 'i:Vocals'],
        ['m:RingoStarr', 'i:Drums']
      ],
      activeEdges: ['hj-john', 'hj-paul', 'hj-george', 'hj-ringo', 'john-vocals', 'john-guitar', 'paul-vocals', 'paul-bass', 'paul-guitar', 'paul-piano', 'george-guitar', 'ringo-drums'],
      activeNodes: []
    },
    {
      id: 'instrument-count',
      question: { es: '¿Qué instrumento está asociado a más músicos?', en: 'Which instrument is associated with the most musicians?' },
      concept: 'GROUP BY',
      explanation: { es: 'GROUP BY reúne las soluciones por instrumento; COUNT cuenta cuántos músicos distintos hay en cada grupo.', en: 'GROUP BY collects solutions by instrument; COUNT finds how many distinct musicians occur in each group.' },
      options: [
        'PREFIX ex: <https://example.org/beatles/>\n\nSELECT ?instrument ?musician\nWHERE {\n  ?musician ex:plays ?instrument .\n}\nORDER BY ?instrument',
        'PREFIX ex: <https://example.org/beatles/>\n\nSELECT ?instrument (COUNT(?musician) AS ?musicians)\nWHERE {\n  ?musician ex:plays ?instrument .\n}\nORDER BY DESC(?musicians)\nLIMIT 1',
        'PREFIX ex: <https://example.org/beatles/>\n\nSELECT ?instrument (COUNT(DISTINCT ?musician) AS ?musicians)\nWHERE {\n  ?musician ex:plays ?instrument .\n}\nGROUP BY ?instrument\nORDER BY DESC(?musicians)\nLIMIT 1'
      ],
      correct: 2,
      columns: ['instrument', 'musicians'],
      rows: [['i:Guitar', '3']],
      activeEdges: ['john-vocals', 'john-guitar', 'paul-vocals', 'paul-bass', 'paul-guitar', 'paul-piano', 'george-guitar', 'ringo-drums'],
      activeNodes: []
    },
    {
      id: 'all-songs',
      question: { es: '¿Qué músico aparece en las tres canciones?', en: 'Which musician appears on all three songs?' },
      concept: 'HAVING',
      explanation: { es: 'HAVING filtra los grupos después del recuento: sólo conserva músicos asociados con al menos tres canciones.', en: 'HAVING filters groups after counting, retaining only musicians associated with at least three songs.' },
      options: [
        'PREFIX ex: <https://example.org/beatles/>\n\nSELECT ?musician (COUNT(DISTINCT ?song) AS ?songs)\nWHERE {\n  ?song ex:performedBy ?musician .\n}\nHAVING (COUNT(DISTINCT ?song) >= 3)',
        'PREFIX ex: <https://example.org/beatles/>\n\nSELECT ?musician (COUNT(DISTINCT ?song) AS ?songs)\nWHERE {\n  ?song ex:performedBy ?musician .\n}\nGROUP BY ?musician\nHAVING (COUNT(DISTINCT ?song) >= 3)\nORDER BY DESC(?songs)',
        'PREFIX ex: <https://example.org/beatles/>\n\nSELECT ?musician (COUNT(DISTINCT ?song) AS ?songs)\nWHERE {\n  ?musician ex:performedBy ?song .\n}\nGROUP BY ?musician\nHAVING (COUNT(DISTINCT ?song) >= 3)'
      ],
      correct: 1,
      columns: ['musician', 'songs'],
      rows: [['m:PaulMcCartney', '3']],
      activeEdges: ['hj-john', 'hj-paul', 'hj-george', 'hj-ringo', 'ct-john', 'ct-paul', 'ct-george', 'ct-ringo', 'yd-paul'],
      activeNodes: []
    },
    {
      id: 'song-instrument-count',
      question: { es: '¿Cuántos instrumentos distintos están asociados a cada canción a través de sus músicos?', en: 'How many distinct instruments are associated with each song through its musicians?' },
      concept: { es: 'Dos saltos + COUNT', en: 'Two hops + COUNT' },
      explanation: { es: 'La consulta encadena canción → músico → instrumento y después agrupa por canción. Es una combinación de unión de patrones y agregación.', en: 'The query chains song → musician → instrument and then groups by song. It combines pattern joins with aggregation.' },
      options: [
        'PREFIX ex: <https://example.org/beatles/>\n\nSELECT ?song (COUNT(DISTINCT ?musician) AS ?instruments)\nWHERE {\n  ?song ex:performedBy ?musician .\n}\nGROUP BY ?song\nORDER BY DESC(?instruments)',
        'PREFIX ex: <https://example.org/beatles/>\n\nSELECT ?song (COUNT(DISTINCT ?instrument) AS ?instruments)\nWHERE {\n  ?musician ex:performedBy ?song .\n  ?instrument ex:plays ?musician .\n}\nGROUP BY ?song\nORDER BY DESC(?instruments)',
        'PREFIX ex: <https://example.org/beatles/>\n\nSELECT ?song (COUNT(DISTINCT ?instrument) AS ?instruments)\nWHERE {\n  ?song ex:performedBy ?musician .\n  ?musician ex:plays ?instrument .\n}\nGROUP BY ?song\nORDER BY DESC(?instruments) ?song'
      ],
      correct: 2,
      columns: ['song', 'instruments'],
      rows: [
        ['song:ComeTogether', '5'],
        ['song:HeyJude', '5'],
        ['song:Yesterday', '4']
      ],
      activeEdges: beatlesEdges.map(edge => edge.id),
      activeNodes: []
    }
  ];

  const prefixes = {
    ex: 'https://example.org/',
    dbo: 'http://dbpedia.org/ontology/',
    dbr: 'http://dbpedia.org/resource/',
    org: 'http://www.w3.org/ns/org#',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    owl: 'http://www.w3.org/2002/07/owl#',
    xsd: 'http://www.w3.org/2001/XMLSchema#'
  };

  return { nodes, edges, facts, copy, queries, beatlesNodes, beatlesEdges, beatlesQuestions, moreBeatlesQuestions, prefixes };
})();
