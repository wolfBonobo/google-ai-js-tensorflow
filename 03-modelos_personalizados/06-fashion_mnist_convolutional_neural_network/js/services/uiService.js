/**
 * SERVICIO DE UI (UIService)
 * Gestión del DOM, Canvas y visualización de resultados.
 */
import { CONFIG } from '../config.js';

export const UI = {
  get elements() {
    const canvas = document.getElementById('canvas');
    return {
      canvas,
      ctx: canvas ? canvas.getContext('2d', { willReadFrequently: true }) : null,
      accLabel: document.getElementById('accLabel'),
      lossLabel: document.getElementById('lossLabel'),
      epochLabel: document.getElementById('epochLabel'),
      progressBar: document.getElementById('progressBar'),
      terminal: document.getElementById('consoleLog'),
      predictionBox: document.getElementById('predictionBox'),
      predictionText: document.getElementById('predictionText'),
      predictionLabel: document.getElementById('predictionLabel'),
      groundTruth: document.getElementById('groundTruth'),
      scanner: document.getElementById('scanner'),
      speedRange: document.getElementById('speedRange'),
      domSpeed: document.getElementById('domSpeed')
    };
  },

  log(msg, type = 'info') {
    const styles = { success: 'text-green-400 font-bold', error: 'text-red-400', highlight: 'text-indigo-400 italic' };
    const entry = document.createElement('div');
    entry.className = styles[type] || 'text-indigo-400/50';
    entry.innerHTML = `<span class="text-slate-800 font-bold">[${new Date().toLocaleTimeString()}]</span> > ${msg}`;
    const term = this.elements.terminal;
    if (term) { term.appendChild(entry); term.scrollTop = term.scrollHeight; }
  },

  updateMetrics(epoch, logs) {
    const e = this.elements;
    const acc = (logs.acc * 100).toFixed(1);
    e.accLabel.innerText = `${acc}%`;
    e.lossLabel.innerText = logs.loss.toFixed(4);
    e.epochLabel.innerText = `${epoch + 1}/${CONFIG.MODEL.epochs}`;
    e.progressBar.style.width = `${((epoch + 1) / CONFIG.MODEL.epochs) * 100}%`;
  },

  drawDigit(pixels) {
    const { ctx } = this.elements;
    if (!ctx) return;
    const imgData = ctx.createImageData(28, 28);
    for (let i = 0; i < pixels.length; i++) {
      const val = pixels[i] * 255;
      const idx = i * 4;
      imgData.data[idx] = val; imgData.data[idx + 1] = val; imgData.data[idx + 2] = val; imgData.data[idx + 3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
  },

  showResult(winnerIndex, labelIndex) {
    const e = this.elements;
    const isCorrect = winnerIndex === labelIndex;

    // Efecto visual: Activamos el escáner al inferir
    e.scanner.classList.remove('opacity-0');

    e.predictionText.innerText = CONFIG.LOOKUP[winnerIndex].charAt(0).toUpperCase();
    e.predictionLabel.innerText = CONFIG.LOOKUP[winnerIndex];

    // Estética dinámica para el resultado masivo
    e.predictionText.className = `text-[10rem] font-black leading-none transition-all duration-700 ${isCorrect ? 'text-green-500' : 'text-red-500'}`;
    e.predictionText.style.filter = `drop-shadow(0 20px 30px ${isCorrect ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)'})`;

    e.groundTruth.innerText = `Real Item: ${CONFIG.LOOKUP[labelIndex]}`;
    e.predictionBox.className = `p-10 rounded-[3rem] border-2 transition-all duration-1000 bg-slate-950/60 ${isCorrect ? 'border-green-500/20 shadow-2xl shadow-green-900/10' : 'border-red-500/20 shadow-2xl shadow-red-900/10'}`;
  }
};