# GeneticLab

Laboratorio estático bilingüe de algoritmos genéticos para SITC · UPM.

## Recorrido
1. Tutorial guiado, con parámetros fijos y estado independiente: reales (inicio) o bits.
2. Experimentar: cambiar representación y operadores.
3. Rutas: permutaciones con OX e inversión.
4. Comparar configuraciones: cinco semillas por configuración, tabla de media, desviación y evaluaciones. No guarda instantáneas parciales. Datos guardados sólo durante la sesión.

Selección: torneo, ruleta, SUS y ranking lineal (rangos medios en empates). Inspector de candidatos, punteros, probabilidades y copias. Elitismo separado en el reemplazo.

Cruces binarios: un punto, dos puntos y uniforme. Cruces reales: media aritmética o uniforme. Mutación binaria: bit flip. Mutación real: gaussiana o reinicio uniforme en [−10,10]; sigma controla la perturbación y pm su probabilidad por coordenada. Se recortan perturbaciones al dominio. Problema real: minimizar x²+y².

SUS conserva punteros equidistantes y baraja los padres seleccionados antes de emparejarlos. Las élites ocupan las primeras plazas de la población nueva. Se evalúan todos los hijos.

Pruebas: `node tests/labs/genetic-model.cjs` y `node tests/labs/genetic-ui.cjs` desde la raíz del repositorio (Playwright y servidor local en 4180 para la segunda).
