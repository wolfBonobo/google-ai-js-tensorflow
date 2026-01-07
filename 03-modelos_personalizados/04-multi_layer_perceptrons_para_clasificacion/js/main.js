/**
 * CONTROLADOR PRINCIPAL (App)
 * Orquestador: Carga -> Modelo -> Entrenamiento -> Evaluación Continua (Limitada).
 */
import { CONFIG } from './config.js';
import { DataService } from './services/dataService.js';
import { MLService } from './services/mlService.js';
import { UI } from './services/uiService.js';

const App = {
    ml: new MLService(),
    tensors: null,

    async init() {
        UI.log('Iniciando entorno modular MNIST...', 'highlight');

        try {
            // 1. Datos
            UI.log('Descargando dataset...');
            this.tensors = await DataService.loadAndPrepare();
            UI.log(`${DataService.inputs.length} muestras cargadas y mezcladas.`, 'success');

            // 2. Modelo
            this.ml.buildModel();
            UI.log('Red Neuronal (MLP) compilada con Adam.');

            // 3. Entrenamiento
            UI.log('Entrenando el cerebro (esto tomará unos segundos)...');
            await this.ml.train(this.tensors.inputsTensor, this.tensors.outputsTensor, (epoch, logs) => {
                if ((epoch + 1) % 5 === 0 || epoch === 0) {
                    UI.log(`Época ${epoch + 1}: Precisión ${(logs.acc * 100).toFixed(2)}% | Loss ${logs.loss.toFixed(4)}`);
                }
            });

            // 4. Cleanup de memoria de GPU
            this.tensors.inputsTensor.dispose();
            this.tensors.outputsTensor.dispose();

            UI.log('ENTRENAMIENTO COMPLETADO.', 'success');

            // 5. Inferencia
            this.runInferenceLoop();

        } catch (err) {
            UI.log(`Error crítico: ${err.message}`, 'error');
            console.error(err);
        }
    },

    /**
     * Lanza el bucle de pruebas aleatorias (limitado a 25 pruebas).
     */
    runInferenceLoop() {
        UI.log('Bucle de inferencia activo (Máximo: 25 pruebas).', 'highlight');

        let testCount = 0;
        const maxTests = 25;

        const step = () => {
            if (testCount >= maxTests) {
                UI.log(`Se ha alcanzado el límite de ${maxTests} pruebas. Bucle finalizado.`, 'success');
                return;
            }

            const sample = DataService.getRandomSample();

            // Realizamos la predicción y capturamos probabilidades
            const result = this.ml.predict(sample.pixels);
            const isCorrect = result.index === sample.label;

            UI.drawDigit(sample.pixels);
            UI.showResult(result.index, isCorrect);

            // Imprimimos el desglose técnico en la terminal
            UI.logProbabilities(result.probabilities, result.index, sample.label);

            testCount++;

            // Programamos la siguiente prueba
            setTimeout(step, CONFIG.UI.inferenceDelay);
        };

        step();
    }
};

window.onload = () => App.init();