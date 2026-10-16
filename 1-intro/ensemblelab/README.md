# EnsembleLab

Interactive Spanish/English regression laboratory for SITC/APAU at UPM. Static HTML/CSS/JavaScript; no external dependencies, accounts, API calls or backend. Open `index.html` directly, or serve the repository and navigate to `1-intro/ensemblelab/`.

## Experiments

- **Bagging:** bootstrap samples with replacement, regression trees and unweighted averaging. Compare with a single tree fitted on all training data. Disable bootstrap to demonstrate identical copies, inspect unique sample counts and out-of-bag RMSE with explicit coverage.
- **Boosting:** gradient boosting for squared loss. Begin with the training mean, fit each tree to current residuals, add its prediction scaled by the learning rate. Inspect each iteration and its residual targets, and compare training/validation RMSE. Early stopping is discussed but is not automatic.
- **Stacking:** linear regression, kNN and a regression tree. Three fixed folds in training yield 90 rows of out-of-fold predictions. Each model is trained on the other two folds (nine temporary fits total). A ridge meta-regressor learns from these predictions and true labels. Three fresh base models are trained on all training data; the meta-model stays fixed. Probe a new input and inspect its three predictions and the combined result.
- **Comparison:** save up to six immutable model/data snapshots, compare curves and metrics. Changing any controls does not delete snapshots. Mixed dataset settings display a warning. Snapshots last for the current page session only.

## Data and numerical conventions

One feature x, generated uniformly in [0,1], and a wave, step or linear response. A seeded generator produces 90 training and 60 validation samples. Noise is a zero-mean unit-variance sum of uniforms scaled by the noise setting (not exactly Gaussian). Fold membership is training index modulo 3. Neither base fits nor meta-fits use validation targets.

Trees search numeric midpoints, minimize squared error, enforce minimum leaf sizes and stop when there is no positive reduction. Bootstrap sample counts include repeated instances. OOB estimates use only trees excluding the sample in question, and report coverage because small ensembles may not cover all samples.

The ridge objective is mean squared error + lambda times the sum of squared coefficients, excluding the intercept. The model uses a direct small linear-system solution with pivoting. Coefficients need not be positive or sum to one. Validation is for exploration/tuning, not an untouched final test.

This focused teaching version does not implement Random Forest feature subsampling, AdaBoost, XGBoost, classification or runtime benchmarking.

## Tests

From the repository root:

```sh
node tests/labs/ensemble-model.cjs
# With the repository served on port 4180 and Playwright installed:
node tests/labs/ensemble-ui.cjs
```

`ENSEMBLE_URL` overrides the test page and `CHROME_PATH` selects Chrome. Checks cover OOF exclusion (including a held-out target perturbation), bootstrap/OOB logic, residual updates, loss behavior, snapshots, both languages and 1440/390/360-pixel layouts. UI screenshots go to `/tmp`.

### AdaBoost y animaciones

AdaBoost es un experimento separado de clasificación binaria con 60 ejemplos de entrenamiento y 40 de validación. Usa árboles de una pregunta (corte exhaustivo en x₁ o x₂), error ponderado y actualización exponencial normalizada de pesos. Se muestran 12 rondas por defecto y hasta 60 rondas; termina antes con error cero o sin un clasificador mejor que el azar. El área de los puntos representa el peso real. La reproducción recorre entrenamiento, identificación de errores y actualización de pesos. La vista del ensemble usa votos ponderados por alfa. No se mezcla con las comparaciones de RMSE de regresión.

Gradient Boosting conserva la regresión por residuos y permite reproducir, pausar, avanzar una iteración y reiniciar. Cambiar de experimento o parámetros detiene la animación.

Validación adicional: `tests/labs/ensemble-ada.cjs` comprueba normalización y actualización de pesos, parada con clasificación perfecta y controles de reproducción de ambos métodos.

La animación permite continuar 12 rondas más sin reiniciar. El fondo se dibuja con las celdas exactas definidas por los cortes; un centro marca cada ejemplo y el halo transparente representa su peso. Los halos pueden cruzar fronteras sin que el ejemplo esté mal clasificado.

### Selector de problema

Clasificación es el modo inicial. Todos los métodos comparten el dataset diagonal (60 entrenamiento, 40 validación) y la semilla. Bagging promedia probabilidades de árboles binarios; Gradient Boosting usa gradiente de pérdida logística, residuos y−p y actualizaciones de puntuación; Stacking genera probabilidades OOF y entrena un metamodelo logístico con L2. AdaBoost mantiene su animación de pesos. Regresión conserva los métodos anteriores y no incluye AdaBoost.

Los guardados son independientes por tipo de problema, contienen el modelo final completo y sobreviven al cambio de modo. Clasificación muestra aciertos y matriz de confusión; regresión, RMSE. Semillas distintas en clasificación o datasets distintos en regresión generan un aviso. Verificaciones: ensemble-classification.cjs, ensemble-ada.cjs, ensemble-model.cjs y ensemble-ui.cjs.
