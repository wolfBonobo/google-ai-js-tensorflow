/**
 * SERVICIO DE INTERFAZ (UI)
 */
export const UI = {
    elements: {
        btn: document.getElementById('trainBtn'),
        loss: document.getElementById('lossValue'),
        progress: document.getElementById('progressBar'),
        prediction: document.getElementById('predictionResult'),
        console: document.getElementById('consoleLog')
    },

    log(msg, color = 'text-slate-400') {
        const entry = document.createElement('div');
        entry.className = color;
        entry.innerText = `> ${msg}`;
        this.elements.console.appendChild(entry);
        this.elements.console.scrollTop = this.elements.console.scrollHeight;
    },

    updateMetrics(epoch, total, loss) {
        const rmse = Math.sqrt(loss).toFixed(2);
        this.elements.loss.innerText = rmse;
        this.elements.progress.style.width = `${(epoch / total) * 100}%`;
    },

    showPrediction(val) {
        this.elements.prediction.innerText = val.toFixed(2);
    }
};