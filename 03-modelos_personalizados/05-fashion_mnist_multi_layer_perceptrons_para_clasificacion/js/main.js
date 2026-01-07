/**
 * CONTROLADOR PRINCIPAL (App)
 * * Este archivo actúa como el "director de orquesta" de la aplicación.
 * Su función es coordinar los diferentes servicios (Datos, ML y UI)
 * para que el flujo de trabajo sea coherente: Inicializar -> Entrenar -> Evaluar.
 */
import { CONFIG } from './config.js';
import { DataService } from './services/dataService.js';
import { MLService } from './services/mlService.js';
import { UI } from './services/uiService.js';

const App = {
    ml: new MLService(), // Instancia del servicio de Machine Learning
    tensors: null,       // Aquí guardaremos los datos listos para el modelo
    testCount: 0,        // Contador para limitar las pruebas automáticas

    /**
     * init: Punto de entrada de la lógica.
     * Prepara el sistema cargando los datos y construyendo el modelo.
     */
    async init() {
        UI.log('Iniciando Fashion AI Engine...', 'highlight');
        try {
            // 1. Cargamos y preparamos los datos (Normalización y Mezcla)
            this.tensors = await DataService.loadAndPrepare();
            UI.log(`${DataService.inputs.length} prendas cargadas y normalizadas.`, 'success');

            // 2. Definimos la arquitectura de la red neuronal
            this.ml.buildModel();

            // 3. Preparamos el botón de la UI para que inicie el entrenamiento al hacer clic
            UI.elements.btnTrain.addEventListener('click', () => this.startTraining());
        } catch (err) {
            UI.log(`Error: ${err.message}`, 'error');
        }
    },

    /**
     * startTraining: Gestiona el proceso de aprendizaje.
     * Bloquea la interfaz, entrena el modelo y libera memoria al finalizar.
     */
    async startTraining() {
        // Deshabilitamos el botón para evitar que el usuario inicie varios entrenamientos a la vez
        UI.elements.btnTrain.disabled = true;
        UI.elements.btnTrain.classList.add('opacity-50');
        UI.log('Iniciando optimización Adam...', 'highlight');

        // Llamamos al entrenamiento y pasamos un callback para actualizar la UI en cada época
        await this.ml.train(this.tensors.inputsTensor, this.tensors.outputsTensor, (epoch, logs) => {
            UI.updateMetrics(epoch, logs);
        });

        UI.log('ENTRENAMIENTO COMPLETADO.', 'success');

        /**
         * GESTIÓN DE MEMORIA:
         * Una vez entrenado el modelo, los tensores de entrenamiento ya no son necesarios.
         * Es vital usar .dispose() para liberar memoria de la tarjeta gráfica (GPU).
         */
        this.tensors.inputsTensor.dispose();
        this.tensors.outputsTensor.dispose();

        // Iniciamos el modo de demostración (inferencia continua)
        this.runInferenceLoop();
    },

    /**
     * runInferenceLoop: Bucle recursivo limitado.
     * Selecciona prendas al azar y las clasifica usando el modelo ya entrenado.
     */
    runInferenceLoop() {
        UI.log(`Iniciando evaluación continua (Máx: ${CONFIG.UI.maxTests})...`, 'highlight');

        const step = () => {
            // Verificamos si hemos llegado al límite de pruebas configurado
            if (this.testCount >= CONFIG.UI.maxTests) {
                UI.log('Límite de pruebas alcanzado.', 'success');
                return;
            }

            // Obtenemos una prenda aleatoria del dataset
            const sample = DataService.getRandomSample();

            // Le pedimos al modelo que "adivine" qué es
            const result = this.ml.predict(sample.pixels);

            // Actualizamos los elementos visuales (Canvas y Resultado)
            UI.drawDigit(sample.pixels);
            UI.showResult(result.index, sample.label, result.probabilities);

            // Nota: El log detallado de probabilidades está desactivado por solicitud del usuario
            // para mantener limpia la terminal visual.

            this.testCount++;

            // Esperamos el tiempo definido en la configuración antes de la siguiente prueba
            setTimeout(step, CONFIG.UI.inferenceDelay);
        };

        // Iniciamos el primer paso del bucle
        step();
    }
};

/**
 * Esperamos a que la ventana esté cargada para arrancar la aplicación.
 */
window.onload = () => App.init();