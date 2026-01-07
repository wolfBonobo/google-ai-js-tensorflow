# 🔢 MNIST Digit Classifier: Reconocimiento Jerárquico con TensorFlow.js

Este proyecto implementa una red neuronal de tipo **Perceptrón Multicapa (MLP)** diseñada para la clasificación de dígitos escritos a mano. Representa un cambio de paradigma fundamental: en lugar de programar reglas lógicas para detectar cada número, el sistema **infiere sus propias reglas** a partir de miles de ejemplos del dataset MNIST, logrando una precisión superior al **93%** ejecutándose íntegramente en el hardware del cliente.

---

## 🧠 ¿Qué es un Multi-Layer Perceptron (MLP)?

Un MLP es una red neuronal densa que utiliza el **Aprendizaje Jerárquico de Patrones**. La magia reside en su capacidad para aprender "patrones de patrones": las primeras capas detectan líneas y bordes, mientras que las capas profundas ensamblan esas formas para reconocer estructuras complejas.

### Componentes de la Arquitectura:

- **Capa de Entrada (Input Layer):** Actúa como el receptor del "ADN de los datos". Cada imagen de $28 \times 28$ píxeles se "aplana" en un tensor unidimensional de **784 valores**.
- **Capas Ocultas (Hidden Layers):** Son las "bisagras" matemáticas de la red. Utilizan funciones de activación para romper la linealidad y permitir que el modelo aprenda la complejidad del mundo real.
- **Capa de Salida (Output Layer):** Proyecta la probabilidad final sobre **10 categorías** (dígitos 0-9).

---

## 🏗️ Anatomía del Modelo y Activaciones

Para garantizar una inferencia fluida en el navegador, el modelo utiliza una estructura optimizada que reside directamente en la **VRAM de la GPU** mediante WebGL:

- **Entrada:** Tensor 1D de 784 valores.
- **Capa Oculta 1:** 32 neuronas con activación **ReLU**. La función ReLU actúa silenciando neuronas con valores negativos, permitiendo un aprendizaje eficiente y rápido.
- **Capa Oculta 2:** 16 neuronas con activación **ReLU**.
- **Capa de Salida:** 10 neuronas con activación **Softmax**.

> **Dato Técnico:** La función **Softmax** es indispensable para la clasificación multiclase; convierte las salidas de la red en una distribución de probabilidad donde la suma de todas las opciones es exactamente **1.0 (100%)**.

---

## ⚙️ Estrategia de Optimización (Compilación)

La compilación define la "brújula" que guiará al modelo durante el entrenamiento:

```javascript
model.compile({
  optimizer: tf.train.adam(),
  loss: 'categoricalCrossentropy',
  metrics: ['accuracy'],
});
```

- **Optimizador Adam:** Un algoritmo de aprendizaje adaptativo que ajusta la tasa de aprendizaje (_Learning Rate_) dinámicamente. Esto permite dar pasos grandes al principio y pasos más finos al final, evitando que el modelo se estanque en mínimos locales.

- **Loss (Categorical Crossentropy):** La función de pérdida encargada de medir la distancia matemática entre la predicción de la red y la "Verdad Fundamental" (_Ground Truth_).
- **Accuracy:** Métrica humana para monitorear el porcentaje de aciertos en tiempo real sobre el dataset.

---

## ⚡ El Ciclo de Vida del Dato y Gestión de Memoria

A diferencia de los objetos estándar de JavaScript, los **Tensores** en TensorFlow.js son inmutables y viven en la memoria de la GPU, lo que requiere una gestión activa para evitar fugas de memoria (_Memory Leaks_).

- **Normalización:** Los píxeles se escalan del rango $[0, 255]$ al rango $[0, 1]$ mediante una transformación **Min-Max**. Esto estabiliza los gradientes y evita que valores de píxeles muy altos saturen las neuronas, facilitando el entrenamiento.
- **One-Hot Encoding:** Las etiquetas (dígitos del 0 al 9) se transforman en vectores binarios. Por ejemplo, el número 3 se convierte en $[0, 0, 0, 1, 0, 0, 0, 0, 0, 0]$. Esto permite que la función de pérdida calcule el error de forma categórica e independiente para cada clase.

- **Gestión de Tensores:** \* `tf.tidy()`: Utilidad que limpia automáticamente los tensores intermedios generados en operaciones matemáticas complejas.
  - `tf.dispose()`: Liberación manual de memoria para tensores de entrada y salida una vez finalizada la sesión de inferencia.

### Hiperparámetros de Entrenamiento

| Parámetro            | Valor | Impacto Técnico                                                          |
| :------------------- | :---- | :----------------------------------------------------------------------- |
| **Batch Size**       | 512   | Equilibrio entre la velocidad de la GPU y la estabilidad del gradiente.  |
| **Epochs**           | 50    | Cantidad de iteraciones completas sobre el dataset (Ciclo de ajuste).    |
| **Validation Split** | 0.2   | Reserva el 20% de los datos para evaluar la capacidad de Generalización. |

---

## 📊 Monitoreo y Evaluación

El sistema incluye un bucle de evaluación continua que demuestra la capacidad de **Inferencia** del modelo en tiempo real:

1. **Extracción de Muestra:** Se obtiene una imagen aleatoria del set de prueba (datos que el modelo nunca vio en el entrenamiento).
2. **Predicción:** El modelo ejecuta `model.predict(input)`, devolviendo un tensor con 10 probabilidades (una para cada dígito).
3. **Resultado:** Se utiliza `.argMax()` para identificar el índice con la probabilidad más alta y se sincroniza con la CPU mediante `.dataSync()` para mostrarlo en pantalla.

### Estado del Sistema:

- 🟢 **Verde:** Predicción correcta. El modelo ha generalizado bien el patrón visual.
- 🔴 **Rojo:** Error de clasificación. Indica límites en la arquitectura, ambigüedad en el trazo del número o necesidad de más épocas de entrenamiento.
