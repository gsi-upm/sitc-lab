# LLMLab

Laboratorio visual y bilingüe para comprender la intuición de los transformadores (Transformers) sin depender de modelos externos.

El recorrido utiliza el ejemplo `bank–river–money` para mostrar:

1. cómo se suman el encaje léxico (embedding) y la posición para formar el vector de entrada;
2. la necesidad de representaciones contextualizadas;
3. la atención como desplazamiento o mezcla de representaciones;
4. cómo Q y K calculan los pesos y cómo esos pesos recuperan y combinan el contenido de V;
5. la atención multicabeza y las matrices WQ, WK y WV propias que aprende cada cabeza;
6. el flujo esencial de un bloque de transformador, incluida la expansión del MLP y el cálculo de probabilidades;
7. una conclusión guiada y un reto final para comprobar la comprensión.

Los vectores y probabilidades son valores didácticos pequeños. La interfaz identifica explícitamente qué partes son simplificaciones visuales y explica que los encajes léxicos (embeddings) y las matrices de proyección se ajustan durante el entrenamiento para reducir el error de predicción.

## Referencia visual y licencia

La visualización de la capa de entrada —segmentación, encaje léxico, posición y suma final— adapta [Transformer Explainer](https://poloclub.github.io/transformer-explainer/), de Cho et al. (Georgia Institute of Technology), a la versión estática y simplificada de LLMLab. No se incorpora el modelo GPT-2 ni el entorno Svelte/Node.js del proyecto original.

Transformer Explainer se distribuye con licencia MIT. Referencia: A. Cho et al., “Transformer Explainer: Learning LLM Transformers with Interactive Visual Explanation and Experimentation”, *Proceedings of the 2026 CHI Conference on Human Factors in Computing Systems*, 2026.
