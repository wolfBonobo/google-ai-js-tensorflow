# 🚀 MoveNet Pose Detector:

Este proyecto implementa una solución avanzada de visión por computadora para la detección de pose humana en tiempo real. Utiliza el modelo **MoveNet Lightning** de TensorFlow.js, organizado bajo una arquitectura de módulos ES6 para garantizar escalabilidad, limpieza y alto rendimiento.

---

## 📋 Descripción del Proyecto

La aplicación utiliza inteligencia artificial para identificar **17 puntos clave** del cuerpo humano (ojos, hombros, codos, muñecas, caderas, rodillas y tobillos) con una latencia mínima.

A diferencia de las implementaciones monolíticas, este proyecto separa la lógica de negocio, el procesamiento de tensores y el renderizado visual en archivos independientes, siguiendo el principio de **Responsabilidad Única**.

---

## 🏗️ Estructura de Módulos (JS)

El sistema se divide en los siguientes componentes estratégicos:

### 1. `js/config.js` (Single Source of Truth - SSoT)

Centraliza los hiperparámetros y configuraciones globales:

- **MODEL_PATH**: URL del modelo en TensorFlow Hub.
- **INPUT_SIZE**: Tamaño fijo (**192x192**) requerido por MoveNet Lightning.
- **MIN_CONFIDENCE**: Umbral de certeza (Threshold) para filtrar detecciones ruidosas.

### 2. `js/services/poseService.js` (El Cerebro de IA)

Maneja el ciclo de vida del modelo y la inferencia:

- **Pre-procesamiento**: Realiza el recorte (Crop) y redimensión de la imagen para optimizar la densidad de píxeles.
- **Inferencia**: Ejecuta `model.predict()` aprovechando la aceleración por GPU.
- **Memoria**: Implementa `tf.tidy()` para asegurar la liberación automática de memoria de video (VRAM) tras cada frame.

### 3. `js/services/drawingService.js` (Motor Gráfico)

Transforma datos matemáticos en píxeles:

- **Mapeo de Coordenadas**: Convierte las posiciones normalizadas `[0, 1]` a coordenadas reales de píxeles basadas en el tamaño del canvas.
- **Renderizado**: Dibuja los puntos clave y las líneas de conexión (esqueleto) con estilos personalizados.

### 4. `js/services/uiService.js` (Gestor del DOM)

Abstrae la manipulación del HTML:

- Gestiona indicadores de estado (Cargando, Éxito, Error).
- Proporciona métodos limpios para actualizar el "Monitor de Estado" sin acoplar la lógica de IA a la interfaz.

### 5. `js/main.js` (El Director de Orquesta)

Controlador principal que orquestra el flujo:

1. Carga el modelo de forma asíncrona.
2. Inicializa los eventos de usuario.
3. Dispara el pipeline de detección cuando se detecta una nueva entrada visual.

---

## 🔍 Optimización Crítica: El "Crop & Resize"

MoveNet alcanza su máxima precisión cuando la persona ocupa la mayor parte del área de entrada. Nuestra lógica de **Slice y Resize** garantiza que el modelo reciba la información visual optimizada, evitando que el fondo interfiera en la detección de extremidades.

---

## 🚀 Ejecución del Proyecto

Para dar soporte a los módulos ES6 y evitar bloqueos de **CORS** al cargar el modelo desde TensorFlow Hub, es necesario un servidor local:

1. **Instalación/Ejecución:**
   ```bash
   npx http-server . --cors
   ```
