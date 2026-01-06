/**
 * SERVICIO DE INTERFAZ (UI)
 */
export const UI = {
    elements: {
        status: document.getElementById('status'),
        loss: document.getElementById('lossValue'),
        progress: document.getElementById('progressBar'),
        console: document.getElementById('consoleLog'),
        prediction: document.getElementById('predictionResult'),
        trainBtn: document.getElementById('trainButton'),
        sizeIn: document.getElementById('sizeInput'),
        roomsIn: document.getElementById('roomsInput')
    },

    log(msg) {
        const entry = document.createElement('div');
        entry.innerText = `> ${msg}`;
        this.elements.console.appendChild(entry);
        this.elements.console.scrollTop = this.elements.console.scrollHeight;
    },

    updateMetrics(epoch, totalEpochs, loss) {
        const progress = ((epoch + 1) / totalEpochs) * 100;
        this.elements.progress.style.width = `${progress}%`;
        this.elements.loss.innerText = loss.toFixed(6);
    },

    updateStatus(msg) {
        this.elements.status.innerText = msg;
    },

    displayPrice(price) {
        this.elements.prediction.innerText = price.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        });
    }
};