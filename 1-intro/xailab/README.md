# XAILab

Sitio estático bilingüe: una vivienda, cuatro tipos de explicación. Todos los precios se calculan con un predictor sintético fijo, no entrenado con ventas. Las 120 viviendas de referencia son ficticias y reproducibles. Rango: 40–200 m², 1–5 habitaciones, 0–100 años, 0–30 km.

- Ejemplos: 5 vecinos en distancia euclídea normalizada por rango, con predicciones del modelo.
- Regiones: sección superficie × distancia fijando habitaciones y antigüedad.
- Características: Shapley exacto por enumeración de las 16 coaliciones. v(S) promedia predicciones de híbridos que mantienen S de la vivienda y toman conjuntamente las demás variables de cada fila de referencia. Tres referencias. Local y media global de valores absolutos.
- LIME tabular simplificado: 30 perturbaciones en la interfaz (500 por defecto en el motor) gaussianas acotadas y redondeadas, kernel gaussiano, regresión ponderada sobre coordenadas normalizadas y centradas. Ridge 1e-6 para estabilidad. Las barras son pendientes para incrementos del 10% del rango, no contribuciones aditivas SHAP. RMSE ponderado sobre las mismas muestras locales, no error de generalización.
- Contrafactuales: búsqueda exhaustiva en rejilla (área 10, habitaciones 1, años 10, km 3), incluye los valores originales y respeta bloqueos. Minimiza lexicográficamente número de cambios y distancia L1 normalizada. No garantiza viabilidad de mercado ni óptimo continuo.

No se reentrena el predictor al explicar. Las atribuciones no son efectos causales. Las métricas se calculan con precisión completa, aunque los precios mostrados se redondean.

Pruebas desde raíz: `node tests/labs/xai-model.cjs`; interfaz Playwright: `node tests/labs/xai-ui.cjs` con servidor local en 4180.
