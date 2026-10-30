# NLPLab

Laboratorio estático ES/EN, con ejemplos de texto en inglés. Cuatro recorridos guiados: anotación lingüística, BoW/bigramas/TF-IDF, búsqueda y sentimiento. No requiere claves ni servidor de inferencia.

## Qué es real y qué es didáctico

- `data/linguistic.json`: salida real precalculada de spaCy `en_core_web_sm 3.8.0`. Se conserva texto, offsets, lema, POS y entidades. El explorador usa frases preparadas, no simula análisis de texto libre.
- `model.js`: tokenizador léxico didáctico basado en letras/números (distinto del tokenizador de spaCy y del tokenizador subword del transformer). Lista explícita de stop words en inglés. Los bigramas se forman después del filtrado si se activa. Vocabulario compartido por los documentos; cuentas enteras y `idf = ln((1+N)/(1+df))+1`. Los vectores mostrados no llevan normalización L2. El coseno normaliza al comparar; un vector nulo recibe similitud 0 y se identifica en pantalla.
- Búsqueda: seis documentos ficticios sobre servicios universitarios. El vocabulario y el IDF se ajustan sólo con esos documentos. Embeddings reales de `Xenova/all-MiniLM-L6-v2`, mean pooling y normalización, 384 dimensiones. No se fuerza el ranking ni se asignan relevancias artificiales. Los empates mantienen el orden de los documentos. Un resultado en primera posición no implica que responda a la consulta.
- Sentimiento léxico: pesos elegidos explícitamente para enseñar un baseline; suma sin negación ni contexto, no es una probabilidad. Cero significa falta de términos o cancelación, no necesariamente neutralidad.
- Sentimiento transformer: `Xenova/distilbert-base-uncased-finetuned-sst-2-english`, entrenado con SST-2, dos clases sin neutral. Se muestran ambas probabilidades. No se retocan salidas que parecen incorrectas: cerveza fría, ironía y reseñas neutrales ilustran límites y cambio de dominio.

## Ejemplos precalculados y texto nuevo

`data/precomputed.json` contiene resultados generados ejecutando ambos modelos con Transformers.js **3.8.1**, pesos ONNX **q8**, backend WASM. Los ejemplos funcionan con sólo los archivos estáticos del laboratorio. No se cargan recursos externos hasta solicitar una consulta/reseña no precalculada.

Para texto nuevo, `inference-worker.js` descarga Transformers.js desde jsDelivr y los pesos de Hugging Face. Ejecuta la inferencia localmente en un Web Worker, con un hilo WASM; no envía textos a servicios de inferencia. Navegador moderno e internet para la primera descarga. La caché depende del navegador. Incluye estado de descarga, recuperación ante error y timeout de 3 minutos. No hay sustitución silenciosa por reglas si falla el modelo.

## Regenerar datos

Con el repositorio servido en 4180:

- Instalar spaCy 3.8 y su modelo en_core_web_sm 3.8.0; ejecutar `python scripts/generate-linguistic.py` desde esta carpeta.
- Con Playwright disponible, ejecutar `node scripts/generate-model-results.cjs`. Acepta `NLP_URL` y `CHROME_PATH`; descarga los modelos y escribe únicamente sus resultados. Los repositorios de modelos pueden cambiar: conservar este JSON para reproducir la sesión docente.

## Pruebas

Desde la raíz: `node tests/labs/nlp-model.cjs` y `node tests/labs/nlp-ui.cjs` (Playwright, servidor 4180). Modelo: cuentas, IDF, coseno, orden, negación del baseline, datos vacíos, offsets y fixtures reales. Interfaz: pasos, filtros, tablas, rankings, ES/EN, 1440/390/360 px, ejemplos sin acceso externo y recuperación de fallo de descarga.

Fuentes docentes: cuadernos `gsi-upm/sitc/nlp/0_1_NLP_Slides.ipynb` y `0_1_LLM.ipynb`. Los textos de demostración se han redactado para el laboratorio. Modelos y licencias: https://huggingface.co/Xenova/all-MiniLM-L6-v2 ; https://huggingface.co/Xenova/distilbert-base-uncased-finetuned-sst-2-english ; https://spacy.io/models/en#en_core_web_sm .
