# 📚 Curso: Fundamentos de Machine Learning con TensorFlow.js

Este repositorio contiene una serie de guías visuales y técnicas diseñadas para introducir a desarrolladores de JavaScript en el mundo de la Inteligencia Artificial y el Aprendizaje Automático, utilizando el ecosistema de Google (**TensorFlow.js**).

---

## 📂 Contenido del Módulo

### 01. De las Reglas a los Datos: Un Nuevo Paradigma
**Archivo:** `01-De_Reglas_a_Datos.pdf`  
Este primer documento establece la base conceptual del cambio de mentalidad necesario para trabajar con IA.
* **El Enfoque Tradicional:** Programación basada en reglas explícitas (`if-then`) y lógica rígida.
* **El Nuevo Paradigma:** Cómo el Machine Learning invierte el modelo, permitiendo que el sistema aprenda sus propias reglas a partir de ejemplos (datos + respuestas).
* **Factores Críticos:** Explica la convergencia de la explosión de datos (Big Data), el hardware de alta potencia (GPUs) y los avances algorítmicos.

### 02. Fundamentos de IA, ML y DL
**Archivo:** `02-Fundamentos_de_IA_ML_y_DL.pdf`  
Una guía detallada para distinguir las capas de inteligencia computacional.
* **Mapa Conceptual:** Relación jerárquica entre Inteligencia Artificial (IA), Machine Learning (ML) y Deep Learning (DL).
* **Deep Learning al detalle:** Introducción a las Redes Neuronales Profundas y cómo aprenden patrones jerárquicos (de líneas simples a objetos complejos como rostros).
* **Brújula vs. Mapa:** Una analogía sobre la resolución de problemas mediante el aprendizaje frente a la programación estática.

### 03. IA para la Web con TensorFlow.js
**Archivo:** `03-IA_para_la_Web_TensorFlowjs.pdf`  
Introducción práctica a la librería líder para ejecutar modelos de IA directamente en el navegador.
* **Ecosistema:** Recursos disponibles, documentación oficial y el repositorio de modelos pre-entrenados (TensorFlow Hub).
* **Ventajas de la Web:** Privacidad del lado del cliente, baja latencia, interactividad con sensores y "cero instalación".
* **Gestión de Memoria:** Introducción crítica al uso de `tf.tidy()` para evitar fugas de memoria (memory leaks) en la GPU.

### 04. Tensores: El ADN del Cálculo Acelerado
**Archivo:** `04-Tensores_El_ADN_del_Cálculo_Acelerado.pdf`  
Exploración de la estructura de datos fundamental en TensorFlow.
* **¿Qué es un Tensor?:** Definición como contenedor n-dimensional, inmutable y homogéneo diseñado para el cálculo paralelo.
* **Optimización:** Diferencias clave entre un Array de JavaScript y un Tensor que reside en la memoria de la GPU (WebGL).
* **Ciclo de Vida:** Patrones recomendados para crear, manipular y eliminar tensores (uso de `.dispose()` y `tf.tidy()`) para mantener el rendimiento de la aplicación.

---
