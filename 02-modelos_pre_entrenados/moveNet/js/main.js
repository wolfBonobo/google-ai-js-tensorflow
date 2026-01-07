import { DrawingService } from './services/drawingService.js';
import { PoseDetector } from './services/poseService.js';
import { UI } from './services/uiService.js';


/**
 * CONTROLADOR DE LA APLICACIÓN
 * Orquesta la inicialización y el flujo de eventos.
 */
const App = {
    detector: new PoseDetector(),

    /**
     * Punto de entrada: carga el modelo y prepara la UI.
     */
    async init() {
        try {
            await this.detector.load();
            
            // Preparar el canvas cuando la imagen esté lista
            if (UI.elements.img.complete) {
                DrawingService.initCanvas();
            } else {
                UI.elements.img.onload = () => DrawingService.initCanvas();
            }

            // Registrar el evento del botón
            UI.elements.btn.addEventListener('click', () => this.runInference());
        } catch (err) {
            console.error('Fallo en la inicialización de la App:', err);
        }
    },

    /**
     * Maneja el proceso de inferencia y dibujo.
     */
    async runInference() {
        UI.setLoading(true);
        UI.updateStatus('Analizando...', 'loading');

        const outputTensor = await this.detector.predict(UI.elements.img);
        
        if (outputTensor) {
            // Descargamos los datos de la GPU
            const arrayOutput = await outputTensor.array();
            const keypoints = arrayOutput[0][0];

            // Renderizamos los puntos sobre el canvas
            DrawingService.drawPose(keypoints);
            
            // Liberamos la memoria del tensor de salida
            outputTensor.dispose();
            UI.updateStatus('Detección completa', 'success');
        }

        UI.setLoading(false);
    }
};

// Arrancar la aplicación
App.init();