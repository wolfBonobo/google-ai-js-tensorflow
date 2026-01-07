# 🧬 Proyecto 2: Los Límites de la Linealidad (Underfitting)

Este proyecto es un experimento de **Ingeniería de Machine Learning** diseñado para evidenciar el concepto de **Underfitting** (subajuste). El objetivo técnico es intentar que un **Perceptrón Simple** (una única neurona) aprenda una relación cuadrática ($y = x^2$), demostrando que la arquitectura es el factor limitante del conocimiento, independientemente del volumen de datos o el tiempo de entrenamiento.

---

## 🏗️ Arquitectura del Sistema (Modularidad SSoT)

El código sigue el principio de **Responsabilidad Única (SRP)** y utiliza un enfoque de **Single Source of Truth (SSoT)** para la configuración global:

| Módulo                                 | Responsabilidad                                                             |
| :------------------------------------- | :-------------------------------------------------------------------------- |
| **`js/config.js`**                     | Gestión de hiperparámetros y generación del dataset cuadrático (SSoT).      |
| **`js/services/regressionService.js`** | Ciclo de vida del modelo, normalización y lógica de Tensores (Cerebro IA).  |
| **`js/services/uiService.js`**         | Abstracción de la interfaz, manejo de logs de telemetría y estados del DOM. |
| **`js/services/plotService.js`**       | Visualización dinámica en tiempo real mediante **Plotly.js**.               |
| **`js/main.js`**                       | Orquestador principal que dirige el pipeline de entrenamiento e inferencia. |

---

## 🔬 El Experimento: Linealidad vs. Curvatura

### El Desafío Matemático

Un perceptrón simple sin capas ocultas ni funciones de activación no lineales es, matemáticamente, una calculadora lineal. La neurona está restringida a resolver la ecuación de primer grado:

$$y = wx + b$$

Esto genera un **hiperplano** (en este caso, una línea recta). En este laboratorio, alimentamos al modelo con una parábola perfecta ($x, x^2$).

### Resultado: "Fracaso de Arquitectura"

Al finalizar el ciclo de aprendizaje, el sistema experimenta los siguientes fenómenos técnicos:

1. **Rigidez Estructural:** La línea roja (predicción) no puede "doblarse". Traza la mejor línea promedio que minimiza la distancia a todos los puntos, pero falla en la trayectoria.
2. **Estancamiento del Gradiente:** La función de pérdida (_Loss_) alcanza un límite (_plateau_) donde deja de bajar; el optimizador ya no encuentra una pendiente de mejora.
3. **Error en Inferencia:** Al solicitar una predicción para $x = 7$, el modelo entrega un valor errático (aprox. 30 en lugar de 49), confirmando un **Sesgo Lineal Inmanente**.

---

## ⚡ Gestión Avanzada de Memoria (GPU)

### Resolución del Error de Backend

Durante el desarrollo se corrigió el error crítico: `Cannot read properties of undefined (reading 'backend')`.

- **La Causa:** El uso de `tf.tidy()` envolvía los tensores de normalización ($min$ y $max$) necesarios para la inferencia. Al finalizar el bloque `tidy`, TensorFlow eliminaba estos tensores de la **VRAM**, dejando las referencias del servicio vacías para futuras predicciones.
- **La Solución:** Se implementó `.dataSync()[0]` para transferir los valores escalares de la **GPU** a variables nativas de **JavaScript**. Esto garantiza que los parámetros de normalización sobrevivan al ciclo de limpieza de memoria.

> **Nota Técnica:** La **Inferencia** es el proceso de aplicar el conocimiento aprendido a datos nuevos. Sin una des-normalización precisa basada en datos persistentes, el resultado de la neurona sería incomprensible para el usuario.

---

## 🚀 Ejecución del Laboratorio

Debido al uso de módulos ES6 y políticas de seguridad del navegador, el proyecto requiere un servidor local:

1.  **Levantar Servidor:**
    ```bash
    npx http-server . --cors
    ```
2.  **Monitoreo:** Abre la consola del navegador para ver la telemetría del entrenamiento.
3.  **Visualización:** Observa en la gráfica cómo la línea de predicción intenta, sin éxito, ajustarse a la curvatura de los datos reales.

---

**Conclusión Didáctica:** Este experimento demuestra que para resolver problemas complejos del mundo real, no basta con "más datos"; necesitamos **Arquitecturas No Lineales** (MLP) y funciones de activación como **ReLU**.
