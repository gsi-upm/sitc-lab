# LinkedLab

Laboratorio visual y bilingüe para comprender cómo un texto puede convertirse en un grafo de conocimiento y cómo ese conocimiento se representa y consulta con tecnologías de Linked Data.

El recorrido tiene siete pasos breves:

1. detectar entidades, relaciones y valores en un texto;
2. distinguir recursos, clases y literales en el grafo resultante;
3. expresar los hechos como triplas RDF y serializarlos en Turtle;
4. identificar recursos con URI y reutilizar vocabularios;
5. consultar patrones del grafo con SPARQL;
6. enlazar el grafo local con DBpedia y reconocer los cuatro principios de Linked Data;
7. resolver cuatro consultas progresivas sobre un grafo de canciones y músicos de los Beatles.

Todo el laboratorio se ejecuta en el navegador, sin servicios externos ni instalación de Fuseki. Los datos mostrados son un ejemplo didáctico determinista.

## Referencia visual

La disposición inicial texto–grafo y la distinción visual entre hechos extraídos del texto y datos externos se inspiran en la [Natural Language API Demo de Diffbot](https://www.diffbot.com/docs/natural-language/). LinkedLab implementa de nuevo la interacción con HTML, CSS, SVG y JavaScript propios, adaptándola al aprendizaje de RDF, SPARQL y Linked Data.

El contenido conceptual sigue las transparencias `3_sitc-linked-data` y los materiales SPARQL de SITC. El último paso adapta ejercicios de `DISTINCT`, recorrido del grafo, `COUNT` y `OPTIONAL` del [notebook SPARQL de los Beatles](https://github.com/gsi-upm/sitc/blob/master/lod/01_SPARQL_Introduction.ipynb), pero utiliza un subconjunto embebido para no depender de Fuseki.
