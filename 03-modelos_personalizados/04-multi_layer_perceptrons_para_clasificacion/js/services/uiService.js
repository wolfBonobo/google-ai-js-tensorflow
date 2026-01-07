/**
 * SERVICIO DE UI (UIService)
 */
export const UI = {
  get elements() {
    const canvas = document.getElementById('canvas');
    return {
      canvas,
      ctx: canvas ? canvas.getContext('2d', { willReadFrequently: true }) : null,
      terminal: document.getElementById('consoleLog'),
      prediction: document.getElementById('prediction'),
      box: document.getElementById('prediction-container')
    };
  },

  log(msg, type = 'info') {
    const styles = { success: 'text-green-400 font-bold', error: 'text-red-400', highlight: 'text-orange-300 italic' };
    const entry = document.createElement('div');
    entry.className = styles[type] || 'text-orange-400/60';
    entry.innerHTML = `<span class="text-slate-700 font-bold">[${new Date().toLocaleTimeString()}]</span> > ${msg}`;

    const term = this.elements.terminal;
    if (term) {
      term.appendChild(entry);
      term.scrollTop = term.scrollHeight;
    }
  },

  /**
   * Renderiza las probabilidades.
   */
  logProbabilities(probs, winner, label) {
    const term = this.elements.terminal;
    if (!term) return;

    const container = document.createElement('div');
    container.className = 'my-4 pl-6 border-l-2 border-slate-800 space-y-1.5 animate-in fade-in duration-500';

    const isCorrect = winner === label;
    const colorClass = isCorrect ? 'text-green-500' : 'text-red-500';

    container.innerHTML = `<div class="text-[9px] text-slate-500 uppercase font-black mb-2 tracking-widest">Análisis Probabilístico <span class="${colorClass}">${isCorrect ? '✓' : '✗'}</span></div>`;

    probs.forEach((p, i) => {
      const isWinner = i === winner;
      const barWidth = Math.max(2, p * 100);
      const color = isWinner ? (isCorrect ? '#22c55e' : '#ef4444') : '#1e293b';

      const row = document.createElement('div');
      row.className = `flex items-center gap-3 ${isWinner ? 'text-white font-bold translate-x-1' : 'text-slate-600'} transition-all duration-300`;
      row.innerHTML = `
                <span class="w-3 text-[10px] font-mono">${i}</span>
                <div class="flex-1 bg-slate-950 h-1.5 rounded-full shadow-inner">
                    <div class="prob-bar" style="width: ${barWidth}%; background-color: ${color}; box-shadow: ${isWinner ? `0 0 12px ${color}` : 'none'}"></div>
                </div>
                <span class="text-[9px] w-10 text-right font-mono">${(p * 100).toFixed(1)}%</span>
            `;
      container.appendChild(row);
    });

    term.appendChild(container);
    term.scrollTop = term.scrollHeight;
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

  showResult(val, isCorrect) {
    const { prediction, box } = this.elements;
    if (!prediction || !box) return;

    prediction.innerText = val;
    const shadowColor = isCorrect ? 'rgba(34,197,94,0.4)' : 'rgba(239,68,68,0.4)';
    prediction.className = `text-[11rem] font-black leading-none transition-all duration-700 select-none`;
    prediction.style.filter = `drop-shadow(0 20px 20px ${shadowColor})`;

    const baseStyles = 'flex items-center justify-center w-72 h-72 rounded-[4rem] border-2 transition-all duration-1000 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.1)] relative overflow-hidden bg-white';

    if (isCorrect) {
      box.className = `${baseStyles} border-solid border-green-500/30 text-green-600 scale-105`;
    } else {
      box.className = `${baseStyles} border-solid border-red-500/30 text-red-600`;
    }
  }
};