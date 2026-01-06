import { UI } from './uiService.js';

/**
 * Encapsula la lógica del modelo COCO-SSD
 */
export class ObjectDetector {
    constructor() {
        this.model = null;
    }

    async load() {
        UI.updateStatus('Cargando COCO-SSD...', 'loading');
        try {
            this.model = await cocoSsd.load();
            UI.updateStatus('Modelo listo', 'success');
            UI.hideLoader();
        } catch (error) {
            UI.updateStatus('Error de carga', 'error');
            console.error('Error cargando el modelo:', error);
        }
    }

    async detect(videoElement) {
        if (!this.model) return [];
        // coco-ssd maneja su propio ciclo de predicción
        return await this.model.detect(videoElement);
    }
}