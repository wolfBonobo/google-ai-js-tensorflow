import { CONFIG } from '../config.js';
import { UI } from './uiService.js';

/**
 * Lógica pura de renderizado en Canvas
 */
export class DrawingService {
    static initCanvas() {
        UI.elements.canvas.width = UI.elements.img.width;
        UI.elements.canvas.height = UI.elements.img.height;
        this.clear();
    }

    static clear() {
        UI.ctx.clearRect(0, 0, UI.elements.canvas.width, UI.elements.canvas.height);
    }

    static drawPose(keypoints) {
        this.clear();
        
        keypoints.forEach((kp, index) => {
            const [yNorm, xNorm, score] = kp;

            if (score > CONFIG.MIN_CONFIDENCE) {
                // Re-mapeo matemático de coordenadas
                const realY = (yNorm * CONFIG.CROP.size[0]) + CONFIG.CROP.start[0];
                const realX = (xNorm * CONFIG.CROP.size[1]) + CONFIG.CROP.start[1];

                this.drawPoint(realX, realY, index < 5 ? '#f87171' : '#4ade80');
            }
        });
    }

    static drawPoint(x, y, color) {
        UI.ctx.beginPath();
        UI.ctx.arc(x, y, 6, 0, 2 * Math.PI);
        UI.ctx.fillStyle = color;
        UI.ctx.strokeStyle = 'white';
        UI.ctx.lineWidth = 2;
        UI.ctx.fill();
        UI.ctx.stroke();
    }
}