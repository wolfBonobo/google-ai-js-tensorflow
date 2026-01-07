/**
 * SERVICIO DE UI
 */
import { CONFIG } from '../config.js';

export const UI = {
  get elements() {
    const canvas = document.getElementById('canvas');
    return {
      canvas,
      ctx: canvas ? canvas.getContext('2d', { willReadFrequently: true }) : null,
      btnTrain: document.getElementById('trainButton'),
      accLabel: document.getElementById('accLabel'),
      lossLabel: document.getElementById('lossLabel'),
      epochLabel: document.getElementById('epochLabel'),
      progressBar: document.getElementById('progressBar'),
      terminal: document.getElementById('consoleLog'),
      predictionBox: document.getElementById('predictionBox'),
      predictionText: document.getElementById('predictionText'),
      predictionLabel: document.getElementById('predictionLabel'),
      groundTruth: document.getElementById('groundTruth'),
      confBar: document.getElementById('confidenceBarContainer'),
      confFill: document.getElementById('confidenceFill')
    };
  },

  log(msg, type = 'info') {
    const styles = { success: 'text-green-400 font-bold', error: 'text-red-400', highlight: 'text-indigo-400 italic' };
    const entry = document.createElement('div');
    entry.className = styles[type] || 'text-indigo-400/60';
    entry.innerHTML = `<span class="text-slate-800 font-bold">[${new Date().toLocaleTimeString()}]</span> > ${msg}`;
    const term = this.elements.terminal;
    if (term) { term.appendChild(entry); term.scrollTop = term.scrollHeight; }
  },

  logProbabilities(probs, winner, label) {
    const term = this.elements.terminal;
    const container = document.createElement('div');
    container.className = 'my-4 pl-6 border-l-2 border-slate-900 space-y-1 animate-fade';
    const isCorrect = winner === label;
    const statusColor = isCorrect ? 'text-green-500' : 'text-red-500';
    container.innerHTML = `<div class="text-[9px] text-slate-600 uppercase font-black mb-2 tracking-widest">Inferencia de Moda <span class="${statusColor}">${isCorrect ? '✓' : '✗'}</span></div>`;

    probs.forEach((p, i) => {
      const isWinner = i === winner;
      const barWidth = Math.max(1, p * 100);
      const color = isWinner ? (isCorrect ? '#10b981' : '#ef4444') : '#1e293b';
      const row = document.createElement('div');
      row.className = `flex items-center gap-3 ${isWinner ? 'text-white' : 'text-slate-600'}`;
      row.innerHTML = `
                <span class="w-20 text-[8px] font-mono truncate uppercase">${CONFIG.LOOKUP[i]}</span>
                <div class="flex-1 bg-slate-950 h-1 rounded-full"><div class="prob-bar" style="width: ${barWidth}%; background-color: ${color}"></div></div>
                <span class="text-[8px] w-8 text-right font-mono">${(p * 100).toFixed(0)}%</span>
            `;
      container.appendChild(row);
    });
    term.appendChild(container);
    term.scrollTop = term.scrollHeight;
  },

  updateMetrics(epoch, logs) {
    const e = this.elements;
    e.accLabel.innerText = `${(logs.acc * 100).toFixed(1)}%`;
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

  showResult(winnerIndex, labelIndex, probabilities) {
    const e = this.elements;
    const isCorrect = winnerIndex === labelIndex;
    const confidence = (probabilities[winnerIndex] * 100).toFixed(1);

    // Icono o primer letra como resultado visual
    e.predictionText.innerText = CONFIG.LOOKUP[winnerIndex].charAt(0).toUpperCase();
    e.predictionLabel.innerText = CONFIG.LOOKUP[winnerIndex];

    e.predictionText.className = `text-[8rem] font-black leading-none transition-all duration-700 ${isCorrect ? 'text-green-500' : 'text-red-500'}`;
    e.predictionText.style.filter = `drop-shadow(0 15px 15px ${isCorrect ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'})`;

    e.groundTruth.innerText = `Real: ${CONFIG.LOOKUP[labelIndex]}`;

    const baseStyles = 'w-full flex flex-col items-center justify-center py-8 rounded-[3rem] border-2 transition-all duration-1000 relative overflow-hidden bg-slate-950/50';
    e.predictionBox.className = isCorrect ? `${baseStyles} border-green-500/30 scale-105` : `${baseStyles} border-red-500/30`;

    e.confBar.style.opacity = '1';
    e.confFill.style.width = `${confidence}%`;
    e.confFill.style.backgroundColor = isCorrect ? '#10b981' : '#ef4444';
  }
};