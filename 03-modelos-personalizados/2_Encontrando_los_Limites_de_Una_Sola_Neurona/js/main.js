import { CONFIG } from './config.js';
import { PlotService } from './services/plotService.js';
import { RegressionService } from './services/regressionService.js';
import { UI } from './services/uiService.js';

/**
 * ORQUESTADOR (APP)
 */
const App = {
    service: new RegressionService(),
    data: null,

    async init() {
        UI.log('Inicializando laboratorio de límites...');
        
        // Preparar datos y modelo
        this.data = this.service.prepareData();
        this.service.buildModel();

        // Inicializar gráfica
        PlotService.init();

        // Eventos
        UI.elements.btn.addEventListener('click', () => this.handleTrain());
    },

    async handleTrain() {
        UI.elements.btn.disabled = true;
        UI.log('Iniciando descenso de gradiente...', 'text-rose-400');

        await this.service.train(this.data.normalizedInputs, this.data.outputs, {
            onEpochEnd: (epoch, logs) => {
                UI.updateMetrics(epoch + 1, CONFIG.HYPERPARAMS.EPOCHS, logs.loss);
                
                // Actualizar gráfica cada 25 épocas para ver el ajuste lineal
                if ((epoch + 1) % 25 === 0) {
                    UI.log(`Época ${epoch + 1}: Error estancado...`);
                    PlotService.update(this.service);
                    this.handlePredict();
                }
            }
        });

        UI.log('ENTRENAMIENTO FINALIZADO.', 'text-white font-bold');
        UI.log('CONCLUSIÓN: La línea recta no puede seguir la curva.', 'text-rose-500 italic');
        
        PlotService.update(this.service);
        this.handlePredict();
    },

    handlePredict() {
        const val = 7;
        const result = this.service.predict(val);
        UI.showPrediction(result);
    }
};

App.init();