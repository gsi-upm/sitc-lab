# ReinforcementLab

Laboratorio bilingüe de Q-learning tabular, sin dependencias ni servicios externos.

1. Explorar: mover el robot y observar (s, a, r, s′), sin actualizar Q.
2. Aprender: ε-greedy, actualización individual y animación (1,8 s), o 100 episodios. Tres controles: ε, α y γ. La semilla fija permite repetir el experimento al reiniciar.
3. Probar: política greedy con Q congelada, recorrido paso a paso y referencia aleatoria. Semilla fija para desempates y referencia; una sola ejecución por política, no estimación estadística.

Tablero 7×5. Inicio (0,2), meta (6,2), zona penalizada (3,2), paredes (3,1) y (3,3). Recompensa +10 al llegar, −9 al entrar en la zona penalizada, −1 para el resto de acciones (incluidos choques). Camino directo: 6 pasos, retorno −3. Rodeo seguro: 10 pasos, retorno +1. El criterio de entrenamiento es el retorno descontado; las métricas muestran la suma sin descuento.

La transición a la meta usa sólo r en la actualización. Límite de 80 pasos para prevenir bucles: es truncamiento de simulación, no terminal del entorno; se mantiene el término de continuación y después se reinicia. Q se conserva entre episodios. Cambiar parámetros conserva Q; reiniciar restablece Q=0 y la semilla.

Pruebas desde la raíz: `node tests/labs/reinforcement-model.cjs`. Interfaz: `node tests/labs/reinforcement-ui.cjs`, con Playwright y servidor local en 4180.
