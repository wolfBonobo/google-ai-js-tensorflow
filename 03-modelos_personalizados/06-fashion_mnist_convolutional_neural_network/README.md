# 👗 Fashion AI: Convolutional Neural Network (CNN)

Este proyecto implementa una **Red Neuronal Convolucional (CNN)** avanzada utilizando **TensorFlow.js** para clasificar el popular dataset _Fashion MNIST_. A diferencia de los modelos lineales o densos tradicionales (MLP), esta arquitectura utiliza capas de convolución para extraer características espaciales, logrando una precisión superior al **93%** en la clasificación de prendas de vestir.

---

## 🚀 El Salto a las CNN: De Píxeles a Patrones

Mientras que un Perceptrón Multicapa (MLP) "aplana" las imágenes perdiendo la relación geométrica entre píxeles vecinos, la **CNN** procesa la imagen en su formato original de $28 \times 28$.

### Ventajas clave de esta arquitectura:

- **Invariancia Espacial:** Capacidad de detectar un rasgo (como una manga o un cuello) sin importar su ubicación exacta dentro de la imagen.
- **Extracción de Rasgos Jerárquicos:** Los filtros (_kernels_) aprenden a identificar desde bordes y texturas simples hasta formas complejas de manera progresiva.
- **Eficiencia de Parámetros:** Al compartir pesos mediante filtros, requiere significativamente menos conexiones que una red densa, optimizando el rendimiento y la velocidad en el navegador.

---

## 🏗️ Arquitectura del Modelo

El motor de IA está diseñado como un **pipeline de procesamiento de volumen** estructurado en las siguientes etapas:

1.  **Capa Convolucional 1:** 16 filtros de $3 \times 3$ para la detección de rasgos primarios y bordes.
2.  **Max Pooling 1:** Reducción de $2 \times 2$ para simplificar la información, mitigar el ruido y reducir la carga computacional.
3.  **Capa Convolucional 2:** 32 filtros de $3 \times 3$ encargados de identificar patrones de ropa más complejos.
4.  **Max Pooling 2:** Segunda reducción espacial para aumentar la abstracción de los rasgos extraídos.
5.  **Flatten:** Transformación del volumen 3D resultante en un vector lineal apto para la clasificación.
6.  **Capa Densa Final:** Clasificación multiclase mediante la función **Softmax**, distribuyendo las probabilidades entre las 10 categorías del dataset.

---

## 📦 Estructura del Proyecto

El código implementa **ESM Modules** para garantizar una mantenibilidad de estándar industrial y un desacoplamiento efectivo:

- **`index.html`**: Interfaz de usuario profesional con estética _dark-mode_ y monitor de entrenamiento integrado.
- **`js/config.js`**: _Single Source of Truth_ (Fuente única de verdad) para hiperparámetros, rutas y metadatos.
- **`js/services/dataService.js`**: Orquestador de datos; gestiona **Tensores 4D**, normalización defensiva y procesos de _shuffling_.
- **`js/services/mlService.js`**: Definición de la topología CNN y lógica de optimización (entrenamiento y predicción).
- **`js/services/uiService.js`**: Motor de visualización; se encarga del renderizado de Canvas, logs de sistema y efectos visuales de escaneo.
- **`js/main.js`**: Controlador principal y punto de entrada que orquesta el ciclo de vida de la aplicación.

---

## 🛠️ Funcionalidades Avanzadas y Optimización

- **Control de Velocidad:** Slider dinámico para ajustar el intervalo de las pruebas de inferencia en tiempo real durante la demostración.
- **Efecto de Escaneo Visual:** Simulación del proceso de "barrido" convolucional durante la clasificación con fines educativos y estéticos.
- **Monitor en Tiempo Real:** Seguimiento detallado de las métricas de **Loss** (Pérdida) y **Accuracy** (Precisión) graficadas por época.
- **Gestión de Memoria Pro:** Uso estricto de `tf.tidy()` y `.dispose()` para garantizar la liberación de la memoria de video (VRAM) y evitar bloqueos o fugas de memoria (_memory leaks_) en el navegador.

---

> **Hito Técnico:** Este proyecto demuestra que el **Deep Learning de alta precisión** es viable directamente en el cliente (**Edge AI**), eliminando la dependencia de servidores externos, reduciendo costes de infraestructura y garantizando la privacidad absoluta de los datos del usuario.
