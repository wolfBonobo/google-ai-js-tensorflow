import { DrawingService } from './services/drawingService.js';
import { ObjectDetector } from './services/objectDetector.js';
import { UI } from './services/uiService.js';

/**
 * Orquestador principal de la Smart Webcam
 */
const App = {
    detector: new ObjectDetector(),
    isActive: false,

    async init() {
        // 1. Cargar el modelo de detección
        await this.detector.load();

        // 2. Escuchar evento de activación de cámara
        UI.elements.btn.addEventListener('click', () => this.handleWebcamAccess());
    },

    async handleWebcamAccess() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            UI.updateStatus('Cámara no soportada', 'error');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            UI.elements.video.srcObject = stream;
            
            UI.elements.video.addEventListener('loadeddata', () => {
                UI.hideButton();
                UI.updateStatus('Detección activa', 'success');
                this.predictLoop();
            });
        } catch (err) {
            UI.updateStatus('Permiso denegado', 'error');
            console.error(err);
        }
    },

    async predictLoop() {
        // Ejecutar detección
        const predictions = await this.detector.detect(UI.elements.video);
        
        // Dibujar resultados
        DrawingService.drawPredictions(predictions);

        // Mantener el bucle de tiempo real
        window.requestAnimationFrame(() => this.predictLoop());
    }
};

// Iniciar aplicación
App.init();