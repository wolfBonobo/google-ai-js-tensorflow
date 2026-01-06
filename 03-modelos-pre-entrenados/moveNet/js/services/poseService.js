import { CONFIG } from '../config.js';
import { UI } from './uiService.js';

/**
 * Encapsula la lógica de TensorFlow.js
 */
export class PoseDetector {
    constructor() {
        this.model = null;
    }

    async load() {
        UI.updateStatus('Descargando modelo...', 'loading');
        try {
            this.model = await tf.loadGraphModel(CONFIG.MODEL_PATH, { fromTFHub: true });
            UI.updateStatus('Modelo listo', 'success');
        } catch (error) {
            UI.updateStatus('Error al cargar IA', 'error');
            throw error;
        }
    }

    async predict(imageElement) {
        if (!this.model) return null;

        return tf.tidy(() => {
            const imageTensor = tf.browser.fromPixels(imageElement);
            
            // Recorte y redimensión según CONFIG
            const resized = tf.image.resizeBilinear(
                tf.slice(imageTensor, CONFIG.CROP.start, CONFIG.CROP.size),
                [CONFIG.INPUT_SIZE, CONFIG.INPUT_SIZE],
                true
            ).toInt();

            return this.model.predict(resized.expandDims(0));
        });
    }
}