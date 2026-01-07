# 🧬 Proyecto 3: MLP - Rompiendo la Barrera de la Linealidad

Este proyecto representa la evolución natural desde el perceptrón simple hacia el **Deep Learning**. Mientras que una sola neurona es físicamente incapaz de "doblarse", esta **Red Neuronal Multicapa (MLP)** utiliza capas ocultas y funciones de activación no lineales para aproximar funciones complejas, logrando aprender con precisión la curvatura de una parábola ($y = x^2$).

---

## 🚀 Características Principales

- **Arquitectura Deep Learning:** Implementación de una red densa con múltiples niveles de abstracción.
- **Activación No Lineal:** Uso de **ReLU** para introducir "bisagras" matemáticas que permiten al modelo ajustarse a curvas.
- **Visualización Reactiva:** Gráfica dinámica basada en **Chart.js** que renderiza el ajuste del modelo en tiempo real (Real-time Regression).
- **Diseño Modular:** Separación estricta de responsabilidades bajo una arquitectura de servicios (ML, UI, Plot).
- **UI de Alta Fidelidad:** Interfaz minimalista y responsiva construida con **Tailwind CSS**.

---

## 🧠 Arquitectura del Modelo

Para superar el subajuste (_underfitting_) de los proyectos anteriores, hemos diseñado un aproximador universal con la siguiente configuración:

1.  **Capa de Entrada:** 1 neurona (recibe el valor escalar $x$).
2.  **Capa Oculta 1:** 32 neuronas con activación **ReLU**.
3.  **Capa Oculta 2:** 16 neuronas con activación **ReLU**.
4.  **Capa de Salida:** 1 neurona con activación **Linear** para la predicción del valor continuo $y$.
5.  **Optimizador:** **Adam** ($lr = 0.01$), elegido por su capacidad de ajustar la tasa de aprendizaje de forma adaptativa.
6.  **Función de Pérdida:** Error Cuadrático Medio (**MSE**).

---

## 🛠️ Conceptos Técnicos Fundamentales

### 1. ¿Por qué ReLU? (Rectified Linear Unit)

Sin una función de activación, el apilamiento de capas es matemáticamente equivalente a una sola capa lineal. ReLU actúa como una "bisagra" que permite que la red se doble. Al combinar múltiples neuronas con ReLU, la red crea una aproximación por tramos que imita perfectamente una curva suave.

### 2. Normalización Min-Max (Feature Scaling)

El entrenamiento de redes profundas es sensible a la magnitud de los datos. Normalizamos las entradas al rango $[0, 1]$ para garantizar que los gradientes fluyan sin explotar ni desvanecerse.

> **Nota técnica:** Extraemos los valores de normalización como números nativos de JavaScript para asegurar que los parámetros sobrevivan al ciclo de limpieza de memoria de TensorFlow.

### 3. Gestión de Memoria y Tensores

El proyecto implementa una gestión de recursos estricta para evitar fugas de memoria en el navegador:

- **`tf.tidy()`:** Limpia automáticamente los tensores intermedios durante el entrenamiento.
- **`.dataSync()`:** Sincroniza los datos de la GPU con la CPU para la visualización final.

---

## 📂 Estructura del Módulo

```text
03-mlp-cuadratico/
├── index.html              # Estructura de la interfaz
├── README.md               # Documentación técnica
└── js/
    ├── config.js           # Hiperparámetros y Single Source of Truth
    ├── main.js             # Orquestador y ciclo de vida de la App
    └── services/
        ├── mlService.js    # Motor de TensorFlow.js y gestión de modelos
        ├── uiService.js    # Gestión del DOM y terminal del sistema
        └── plotService.js  # Pipeline de renderizado de Chart.js
```

## 💻 Ejecución y Desarrollo

Debido al uso de **módulos ES6** y la carga de recursos externos (como los pesos del modelo y librerías desde CDN), el navegador bloquea el acceso a archivos locales por políticas de seguridad (**CORS**). Por ello, es imperativo ejecutar el proyecto a través de un servidor web.

### ⚙️ Pasos para el Despliegue Local

1.  **Iniciar un Servidor Local:**
    Si tienes **Node.js** instalado, puedes usar `http-server`:

    ```bash
    npx http-server . --cors
    ```

    Alternativamente, puedes usar la extensión **Live Server** en VS Code.

2.  **Acceso al Laboratorio:**
    Abre tu navegador en `http://localhost:8080` (o el puerto indicado por tu servidor).

### 🎮 Interacción con el Modelo

- **Entrenamiento:** Haz clic en el botón **"INICIAR ENTRENAMIENTO"**. Observarás cómo la línea de predicción comienza como una recta y, gracias a las capas ocultas y la activación **ReLU**, empieza a curvarse progresivamente para "abrazar" los puntos de la parábola.
- **Monitoreo de Convergencia:** La gráfica de pérdida (_Loss Curve_) mostrará una pendiente descendente, indicando que el optimizador **Adam** está encontrando los pesos ideales.

---

## 📈 Análisis de Resultados: El Poder de la No-Linealidad

A diferencia de los experimentos anteriores, el **MLP** logra:

1.  **Aproximación Universal:** La capacidad de modelar la función $y = x^2$ con un error residual mínimo.
2.  **Generalización:** Capacidad de predecir valores de $x$ no incluidos en el set de entrenamiento con alta precisión.
3.  **Estabilidad:** El optimizador Adam evita las oscilaciones bruscas, logrando un entrenamiento fluido incluso con una tasa de aprendizaje alta ($0.01$).

---

> **Conclusión del Módulo:** Con este proyecto, hemos validado que la arquitectura (neuronas + capas + activaciones) es tan importante como los datos. Hemos pasado de una "regla rígida" a un sistema con "articulaciones" capaz de aprender la complejidad del mundo real.
