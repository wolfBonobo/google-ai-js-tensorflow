import { CONFIG } from '../config.js';
import { UI } from './uiService.js';

/**
 * Gestiona el renderizado de predicciones sobre el Canvas
 */
export class DrawingService {
    static clear() {
        UI.ctx.clearRect(0, 0, UI.elements.canvas.width, UI.elements.canvas.height);
    }

    static drawPredictions(predictions) {
        this.clear();

        predictions.forEach(prediction => {
            if (prediction.score > CONFIG.MIN_CONFIDENCE) {
                const [x, y, width, height] = prediction.bbox;
                
                // Ajuste para el video espejado (scaleX -1)
                // x_real = canvas_width - x - width
                const mirroredX = UI.elements.canvas.width - x - width;

                // Dibujar cuadro delimitador
                UI.ctx.strokeStyle = CONFIG.STYLE.stroke;
                UI.ctx.lineWidth = 4;
                UI.ctx.fillStyle = CONFIG.STYLE.fill;
                
                UI.ctx.strokeRect(mirroredX, y, width, height);
                UI.ctx.fillRect(mirroredX, y, width, height);

                // Dibujar etiqueta
                const label = `${prediction.class} (${Math.round(prediction.score * 100)}%)`;
                UI.ctx.font = CONFIG.STYLE.font;
                
                const textWidth = UI.ctx.measureText(label).width;
                UI.ctx.fillStyle = CONFIG.STYLE.labelBg;
                UI.ctx.fillRect(mirroredX, y - 25, textWidth + 10, 25);
                
                UI.ctx.fillStyle = 'white';
                UI.ctx.fillText(label, mirroredX + 5, y - 7);
            }
        });
    }
}