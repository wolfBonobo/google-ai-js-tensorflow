# 👗 Fashion AI: Clasificador de Prendas con MLP Modular

Este proyecto representa una implementación avanzada de un **Perceptrón Multicapa (MLP)** utilizando el ecosistema de **TensorFlow.js**. El sistema trasciende la lógica de reglas tradicionales para inferir patrones visuales complejos, clasificando artículos de moda del dataset **Fashion MNIST** con una precisión superior al 85% ejecutándose íntegramente en el hardware del cliente.

---

## 🏗️ Arquitectura del Proyecto (Patrón de Servicios)

Siguiendo el principio de **Responsabilidad Única (SRP)** y estándares de ingeniería de software, el código se ha desacoplado utilizando **ESM Modules** para garantizar escalabilidad y mantenibilidad:

```text
Proyecto-Fashion-AI/
├── index.html              # Interfaz Slate Dark Theme (UI/UX)
└── js/
    ├── config.js           # Single Source of Truth (SSoT) para hiperparámetros
    ├── main.js             # Orquestador del ciclo de vida de la App
    └── services/
        ├── dataService.js  # Pipeline de datos: Carga, mezcla y normalización
        ├── mlService.js    # Definición de arquitectura y lógica de Tensores
        └── uiService.js    # Gestión reactiva del DOM y feedback visual
```

# 🧐 ¿Qué es Fashion MNIST?

A diferencia del MNIST tradicional de dígitos (trazos simples), Fashion MNIST plantea un reto de visión artificial más realista. Consiste en imágenes de $28 \times 28$ píxeles que representan 10 categorías de productos de moda. La mayor varianza intra-clase y la complejidad de las texturas exigen que la red neuronal aprenda representaciones jerárquicas más profundas.

### Categorías de Clasificación:

Camiseta, Pantalón, Jersey, Vestido, Abrigo, Sandalia, Camisa, Zapatilla, Bolso y Botín.

---

# 🧠 Especificaciones del Modelo (Deep Learning)

El modelo está diseñado como un Aproximador Universal capaz de detectar bordes, sombras y formas mediante el apilamiento de capas densas:

### Topología de la Red:

- **Capa de Entrada:** 784 neuronas (aplanamiento del tensor de entrada de $28 \times 28$).
- **Capas Ocultas (Cerebro):**
  - **Capa 1:** 128 neuronas con activación **ReLU** (introduce la no-linealidad necesaria para curvas).
  - **Capa 2:** 64 neuronas con activación **ReLU**.
- **Capa de Salida:** 10 neuronas con activación **Softmax**.

> **Nota Técnica:** La función Softmax es vital para la clasificación multiclase, ya que normaliza la salida en una distribución de probabilidad donde $\sum P(x) = 1$.

### Estrategia de Optimización:

- **Optimizador:** Adam ($lr: 0.001$), seleccionado por su capacidad adaptativa de tasa de aprendizaje.
- **Pérdida:** Categorical Crossentropy (mide la distancia entre la predicción y la realidad).
- **Batch Size:** 128 (balance óptimo entre estabilidad del gradiente y velocidad de GPU).

---

# 🚀 Características Principales

- **Normalización Dinámica:** Implementación de _Feature Scaling_ para llevar los píxeles al rango $[0, 1]$. Esto evita la saturación de las neuronas y acelera la convergencia.
- **Gestión de Memoria (VRAM):** Uso estricto de `tf.tidy()` y `.dispose()` para prevenir fugas de memoria en la GPU, asegurando que la aplicación sea fluida incluso tras múltiples sesiones de entrenamiento.
- **UI de Alto Impacto:** Interfaz "Dark Mode" con tipografía masiva y efectos de iluminación dinámica (glow) para una experiencia de usuario inmersiva.
- **Monitor de Telemetría:** Terminal integrada que reporta la pérdida y precisión en cada época mediante callbacks de TensorFlow.js.

---

# 🛠️ Tecnologías y Conceptos Implementados

- **TensorFlow.js:** Inferencia y entrenamiento acelerado por hardware (WebGL).
- **Tensores Inmutables:** Los datos se tratan como "ADN numérico" que fluye por el grafo de cómputo.
- **Inferencia en Tiempo Real:** Bucle de evaluación que procesa muestras aleatorias cada 2.5 segundos utilizando `model.predict()`.
