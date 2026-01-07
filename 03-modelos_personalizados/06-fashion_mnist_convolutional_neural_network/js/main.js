/**
 * CONTROLADOR PRINCIPAL (App)
 * Orquestador del ciclo de vida de la CNN: Carga -> Build -> Train -> Inference.
 */
import { CONFIG } from './config.js';
import { DataService } from './services/dataService.js';
import { MLService } from './services/mlService.js';
import { UI } from './services/uiService.js';

const App = {
    ml: new MLService(),
    tensors: null,
    testCount: 0,
    currentInterval: CONFIG.UI.defaultInferenceDelay,

    async init() {
        UI.log('Convolutional Neural Engine loading...', 'highlight');

        // Configurar listener de velocidad
        UI.elements.speedRange.addEventListener('input', (e) => {
            this.currentInterval = e.target.value;
            UI.elements.domSpeed.innerText = `${this.currentInterval}ms`;
        });

        try {
            // 1. Preparar datos en formato 4D
            this.tensors = await DataService.loadAndPrepare();
            UI.log(`Dataset Ready: ${DataService.inputs.length} images.`, 'success');

            // 2. Construir arquitectura CNN
            this.ml.buildModel();
            UI.log('Architecture Conv2D initialized (32k parameters).');

        } catch (err) {
            UI.log(`Critical Error: ${err.message}`, 'error');
            console.error(err);
        }
    },

    async startTraining() {
        UI.log('Starting heavy training (Epochs: 30)...', 'highlight');

        await this.ml.train(this.tensors.inputsTensor, this.tensors.outputsTensor, (epoch, logs) => {
            UI.updateMetrics(epoch, logs);
            if ((epoch + 1) % 5 === 0) {
                UI.log(`Epoch ${epoch + 1}: Acc=${(logs.acc * 100).toFixed(1)}% | Loss=${logs.loss.toFixed(3)}`);
            }
        });

        UI.log('CONVOLUTIONAL TRAINING FINISHED.', 'success');

        // Liberar memoria de entrenamiento
        this.tensors.inputsTensor.dispose();
        this.tensors.outputsTensor.dispose();

        this.runInferenceLoop();
    },

    runInferenceLoop() {
        UI.log(`Inference mode active (Max tests: ${CONFIG.UI.maxTests})...`, 'highlight');

        const step = () => {
            if (this.testCount >= CONFIG.UI.maxTests) {
                UI.log('Automatic testing cycle complete.', 'success');
                return;
            }

            const sample = DataService.getRandomSample();
            const result = this.ml.predict(sample.pixels);

            UI.drawDigit(sample.pixels);
            UI.showResult(result.index, sample.label);

            this.testCount++;
            setTimeout(step, this.currentInterval);
        };

        step();
    }
};

window.onload = () => App.init();