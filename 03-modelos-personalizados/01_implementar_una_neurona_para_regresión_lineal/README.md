# 🏠 Inmuebles AI: Predicción de Precios con Regresión Lineal

Este proyecto constituye el primer escalón en el dominio del **Aprendizaje Automático (ML)**. Marca la transición del paradigma de reglas fijas a un sistema que "aprende su propio mapa". El objetivo técnico es entrenar un **Perceptrón Simple** (una única neurona) para deducir de forma autónoma la relación matemática entre la superficie/habitaciones de una vivienda y su valor de mercado.

---

## 🏗️ Arquitectura Modular (SSoT)

El proyecto está diseñado bajo una arquitectura de servicios para garantizar un código limpio y escalable, aplicando el principio de **Single Source of Truth (SSoT)**.

- **`js/config.js`**: Centraliza los hiperparámetros (Learning Rate, Épocas). Es la fuente de la verdad para el comportamiento del modelo.
- **`js/services/regressionService.js`**: El núcleo de la IA. Gestiona la creación del modelo y el ciclo de vida de los datos.
- **`js/services/uiService.js`**: Capa de abstracción para la gestión del DOM, logs de consola y feedback visual.
- **`js/services/plotService.js`**: Motor gráfico basado en **Plotly.js** para visualizar la nube de puntos y la optimización de la línea de regresión.
- **`js/main.js`**: Orquestador principal que sincroniza el flujo entre los servicios.

---

## 🧠 Conceptos Técnicos de Deep Learning

### 1. Tensores: El ADN de los Datos

A diferencia de los arrays estándar, este proyecto opera sobre **Tensores**.

- **Aceleración por Hardware**: Residen directamente en la memoria de la **GPU** mediante WebGL.
- **Inmutabilidad**: Las operaciones generan nuevos tensores, optimizando el cálculo paralelo.
- **Cálculo Acelerado**: Diseñados para que los datos "fluyan" masivamente.

### 2. Normalización Crítica (Min-Max Scaling)

Las redes neuronales son brújulas sensibles a las escalas. En nuestro dataset, los precios (\$300k+) y las habitaciones (2) habitan mundos numéricos incompatibles.

- **El Riesgo**: Sin normalización, el optimizador sufre de **Gradientes Explosivos**, resultando en errores `NaN`.
- **La Solución**: Aplicamos escalado para llevar todos los valores al rango `[0, 1]`. Esto permite que el optimizador trabaje en un "terreno suave" y converja con precisión.

### 3. El Perceptrón y la Ecuación Lineal

El modelo utiliza una arquitectura secuencial con una única **Capa Densa** (`units: 1`).

- **La Matemática**: El modelo busca resolver la ecuación:
  $$y = w_1x_1 + w_2x_2 + b$$
  Donde $w$ representa los pesos (influencia de cada característica) y $b$ el sesgo (_bias_).

---

## ⚡ Gestión de Memoria (GPU VRAM)

Dado que los tensores no son recolectados automáticamente por el _Garbage Collector_ de JavaScript, implementamos una gestión de recursos profesional para evitar fugas de memoria (_memory leaks_):

- **`tf.tidy()`**: Limpia automáticamente todos los tensores intermedios creados durante los cálculos matemáticos.
- **`tf.dispose()`**: Libera manualmente la memoria de los tensores persistentes (entradas y salidas) una vez finalizada la sesión de entrenamiento o inferencia.

---

## ⚠️ Análisis de Limitaciones: La Barrera Lineal

Es crucial entender que un Perceptrón Simple tiene límites matemáticos claros:

1.  **Linealidad Estricta**: Solo puede trazar una línea recta. Si el precio de las casas sigue una curva (zonas de lujo o depreciación), el modelo siempre tendrá un error residual.
2.  **Ausencia de Abstracción**: Al no tener capas ocultas, la red no puede aprender patrones complejos. Es una "brújula" que marca la tendencia, pero no un "mapa" exacto de la realidad.

---

## 🚀 Instalación y Uso

Debido al uso de módulos ES6 y la carga de modelos, se requiere un servidor web para ejecutar el proyecto y evitar errores de CORS:

1.  Clona el repositorio.
2.  Ejecuta un servidor local (ej. Live Server en VS Code o `http-server` vía npm).
    ```bash
    npx http-server .
    ```
3.  Abre el navegador en `http://localhost:8080`.

---
