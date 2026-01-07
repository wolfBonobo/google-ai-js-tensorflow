/**
 * SERVICIO DE UI
 */
export const UI = {
  get elements() {
    return {
      btn: document.getElementById('btnTrain'),
      terminal: document.getElementById('terminal'),
      loss: document.getElementById('lossValue'),
      prediction: document.getElementById('predictionValue'),
      summary: document.getElementById('modelSummary'),
      dot: document.getElementById('statusDot')
    };
  },

  write(text, type = 'info') {
    const colors = {
      info: 'text-emerald-400',
      success: 'text-white font-bold',
      warning: 'text-yellow-400',
      highlight: 'text-blue-300 italic',
    };

    const div = document.createElement('div');
    div.className = colors[type] || colors.info;
    div.innerText = `> ${text}`;

    const term = this.elements.terminal;
    if (term) {
      term.appendChild(div);
      term.scrollTop = term.scrollHeight;
    }
  },

  updateMetrics(loss) {
    const lossElem = this.elements.loss;
    if (lossElem) {
      lossElem.innerText = Math.sqrt(loss).toFixed(2);
    }
  },

  showPrediction(val) {
    const predElem = this.elements.prediction;
    if (predElem) {
      predElem.innerText = val.toFixed(2);
    }
  },

  updateSummary(info) {
    const summaryElem = this.elements.summary;
    if (summaryElem) {
      summaryElem.innerText = info;
    }
  },

  setLoading(isLoading) {
    const btn = this.elements.btn;
    const dot = this.elements.dot;
    if (btn) btn.disabled = isLoading;
    if (dot) dot.className = `w-2 h-2 rounded-full ${isLoading ? 'bg-emerald-500 training-pulse' : 'bg-blue-500'}`;
  }
};