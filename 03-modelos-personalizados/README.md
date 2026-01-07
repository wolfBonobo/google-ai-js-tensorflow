# 🧠 03. Modelos Personalizados con TensorFlow.js

Este módulo se enfoca en el diseño, entrenamiento e implementación de arquitecturas de **Deep Learning** desde cero. A diferencia de los modelos pre-entrenados, la creación de modelos personalizados permite un control total sobre la arquitectura para resolver problemas específicos con conjuntos de datos únicos.

## 📂 Guías Técnicas y Documentación

A continuación, se describen los documentos fundamentales que componen esta sección, organizados según la ruta de aprendizaje:

### [01] El Ciclo de Vida del Dato, Ética y Generalización 📊
**Archivo:** `01-El_Ciclo_de_Vida_del_Dato_Ética_y_Generalización.pdf`
* **Contenido:** Explora la justificación de crear modelos a medida frente a soluciones genéricas.
* **Puntos Clave:**
    * **Estrategias de Recolección:** Cómo obtener y refinar datos propios o de fuentes abiertas.
    * **Calidad del Dato:** Identificación de inconsistencias, valores nulos y sesgos (Bias) éticos.
    * **Conversión a Tensores:** El proceso paso a paso para transformar arrays de JavaScript en estructuras optimizadas para la GPU.
    * **Normalización:** La importancia de estandarizar los datos para una ingesta eficiente por el modelo.

### [02] El Ciclo de Aprendizaje del Perceptrón 🍎
**Archivo:** `02-El_ciclo_de_aprendizaje_del_Perceptrón.pdf`
* **Contenido:** Un análisis profundo de la unidad básica de la IA: la neurona artificial.
* **Puntos Clave:**
    * **Regresión Lineal:** Implementación del modelo "Hola Mundo" ($y = wx + b$).
    * **Mecánica del Aprendizaje:** Cómo se ajustan los **Pesos (w)** y el **Sesgo (b)** mediante el optimizador.
    * **Proceso de Entrenamiento:** Uso de `model.fit()`, gestión de épocas, `batchSize` y monitorización de la pérdida (*loss*).
    * **Límites Lineales:** Por qué una sola neurona es insuficiente para representar funciones curvas o complejas.

### [03] Del Perceptrón a Redes Convolucionales 🌊
**Archivo:** `03-Del_Perceptrón_a_Redes_convolucionales.pdf`
* **Contenido:** La evolución de la arquitectura para superar la barrera de la linealidad.
* **Puntos Clave:**
    * **Perceptrón Multicapa (MLP):** Uso de capas ocultas y funciones de activación (**ReLU**) para modelar relaciones no lineales.
    * **Estructura de Datos:** Selección de arquitectura según la naturaleza del problema (Tabular vs. Espacial vs. Secuencial).
    * **Invariancia Espacial:** Introducción a la necesidad de las Redes Convolucionales (CNN) para el reconocimiento de patrones en cualquier posición.

### [00] Construyendo Visión Artificial Paso a Paso 🚀
**Archivo:** `00-Construyendo_Visión_Artificial_Paso_a_Paso.pdf`
* **Contenido:** Guía maestra sobre la construcción de modelos inteligentes para procesamiento de imágenes y más.
* **Puntos Clave:**
    * **Arquitecturas CNN:** Cómo las capas de convolución detectan rasgos (líneas, formas, objetos) de manera jerárquica.
    * **Más allá de la Imagen:** Aplicaciones en sonido mediante espectrogramas.
    * **Ciclo de Reto y Solución:** Una comparativa final entre Perceptrón, MLP y CNN, detallando cuándo y por qué utilizar cada uno.

---

## 🚀 Conceptos Técnicos Implementados

1.  **Ingeniería de Características:** Preparación y normalización de tensores.
2.  **Optimización:** Ajuste de gradientes para minimizar el error cuadrático medio (MSE).
3.  **Abstracción de Capas:** Apilamiento de capas densas y convolucionales mediante `tf.layers`.
4.  **Gestión de Memoria:** Implementación de `tf.tidy()` y `.dispose()` para un rendimiento óptimo en el navegador.

---
