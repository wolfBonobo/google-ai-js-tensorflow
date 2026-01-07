import { CONFIG } from './config.js';
import { MLService } from './services/mlService.js';
import { PlotService } from './services/plotService.js';
import { UI } from './services/uiService.js';

/**
 * APP CONTROLLER
 */
const App = {
    ml: new MLService(),
    data: null,

    async init() {
        UI.write('Iniciando entorno modular MLP...');
        
        // Inicializar servicios
        this.data = this.ml.prepareData();
        this.ml.buildModel();
        PlotService.init();

        // Actualizar UI
        UI.updateSummary(`Arquitectura:\n- Capas: ${CONFIG.MODEL.layers.length}\n- Neuronas: 32 -> 16 -> 1\n- Activación: ReLU\n- Optimizador: Adam`);
        UI.write('Modelo construido y gráfica lista.', 'success');

        // Eventos
        const trainBtn = UI.elements.btn;
        if (trainBtn) {
            trainBtn.addEventListener('click', () => this.handleTraining());
        }
    },

    async handleTraining() {
        UI.setLoading(true);
        UI.write('Entrenando con Adam...', 'success');

        await this.ml.train(this.data.inputs, this.data.outputs, (epoch, logs) => {
            UI.updateMetrics(logs.loss);
            
            // Actualizar gráfica y terminal cada X épocas
            if (epoch % 20 === 0) {
                UI.write(`Época ${epoch}: RMSE ${Math.sqrt(logs.loss).toFixed(2)}`);
                const curve = this.ml.getCurveData();
                PlotService.updatePredictions(curve);
            }
        });

        UI.write('ENTRENAMIENTO FINALIZADO.', 'success');
        UI.setLoading(false);
        this.handleEvaluation();
    },

    handleEvaluation() {
        const testVal = 7;
        const result = this.ml.predict(testVal);
        
        UI.showPrediction(result);
        UI.write(`PREDICCIÓN FINAL: ${testVal}² ≈ ${result.toFixed(2)}`, 'success');
        
        // Actualización final de la gráfica
        PlotService.updatePredictions(this.ml.getCurveData());
        
        const btn = UI.elements.btn;
        if (btn) btn.innerText = 'Red Entrenada';
    }
};

App.init();