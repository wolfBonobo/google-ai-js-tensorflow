# 🤖 Smart Webcam AI: Detección de Objetos en Tiempo Real

Este proyecto es una aplicación avanzada de visión artificial que utiliza el modelo **COCO-SSD** de TensorFlow.js para identificar y clasificar más de 80 tipos de objetos a través de la webcam. La aplicación ha sido rediseñada bajo una **arquitectura modular profesional** para garantizar un código limpio, escalable y eficiente.

---

## 🏗️ Arquitectura del Sistema (Principio de Responsabilidad Única)

El proyecto sigue el principio de **Responsabilidad Única (SRP)**, dividiendo la lógica en servicios especializados. Esta modularización permite que la lógica de Inteligencia Artificial esté totalmente desacoplada de la visualización y gestión del DOM.

### 📁 Estructura de Archivos

```text
smart-webcam/
├── index.html              # Estructura de la interfaz (Tailwind CSS)
└── js/
    ├── config.js           # Single Source of Truth (Configuración global)
    ├── main.js             # Orquestador (Punto de entrada)
    └── services/
        ├── uiService.js      # Gestión del DOM y estados de interfaz
        ├── objectDetector.js # Lógica de la Red Neuronal (COCO-SSD)
        └── drawingService.js # Motor de renderizado gráfico (Canvas)
```

---

## 🛠️ Detalle de los Módulos

### 1. `js/config.js` (Single Source of Truth)

Es la **"fuente de la verdad"** del proyecto. Contiene los parámetros que ajustan el comportamiento de la IA y el estilo visual de los cuadros (_Bounding Boxes_). Centralizar esto permite cambiar el umbral de confianza o los colores sin tocar la lógica del motor.

### 2. `js/services/uiService.js` (Gestor del DOM)

Este servicio actúa como el puente entre JavaScript y el HTML:

- **Gestión de Referencias:** Almacena todos los elementos del DOM (video, botón, canvas).
- **Feedback Visual:** Controla el monitor de estado (`statusMsg`) e indicadores de color.
- **Transiciones:** Maneja la desaparición del _loader_ una vez que el modelo está listo.

### 3. `js/services/objectDetector.js` (Cerebro de IA)

Encapsula la librería de TensorFlow.js y gestiona el modelo:

- **Carga Asíncrona:** Descarga los pesos de COCO-SSD desde TensorFlow Hub.
- **Inferencia:** Recibe frames y devuelve un array de objetos con coordenadas `[x, y, ancho, alto]`, etiquetas y porcentajes de confianza.

### 4. `js/services/drawingService.js` (Motor Gráfico)

Módulo encargado de convertir datos matemáticos en píxeles mediante la API de Canvas:

- **Lógica de Espejo:** Aplica la fórmula `canvas.width - x - width` para compensar la inversión horizontal de la webcam, alineando los cuadros con el movimiento natural del usuario.
- **Renderizado Eficiente:** Dibuja rectángulos y etiquetas de forma síncrona con el refresco de pantalla.

### 5. `js/main.js` (Director de Orquesta)

Controlador principal que gestiona el ciclo de vida:

1. Inicia la carga del modelo.
2. Habilita el acceso a la cámara mediante el usuario.
3. Ejecuta el `predictLoop`, manteniendo la detección constante.

---

## 🔍 Conceptos Técnicos Destacados

- **Gestión de Estados:** El botón de activación permanece bloqueado (`disabled`) mediante Tailwind CSS hasta que el modelo confirma su carga completa en la VRAM.
- **Rendimiento:** Uso de `window.requestAnimationFrame()` para sincronizar la detección con el monitor, reduciendo el parpadeo y la carga innecesaria en la CPU.

---

## 🚀 Cómo Ejecutar el Proyecto

Debido al uso de módulos ES6 y políticas de seguridad **CORS**, se requiere un servidor local:

1.  Abre la terminal en la carpeta del proyecto.
2.  Ejecuta:
    ```bash
    npx http-server . --cors
    ```
3.  Accede a: `http://localhost:8080`.

---
