import { CONFIG } from './config.js';
import { PlotService } from './services/plotService.js';
import { RegressionService } from './services/regressionService.js';
import { UI } from './services/uiService.js';

/**
 * APP CONTROLLER (ORQUESTADOR)
 * Este objeto actúa como el controlador principal de la aplicación.
 * Su función es unir los servicios de IA, Visualización e Interfaz para
 * crear un flujo de trabajo coherente.
 */
const App = {
    // Instanciamos el servicio de regresión (la lógica de la neurona)
    service: new RegressionService(),
    
    // Aquí guardaremos los tensores procesados y datos crudos para acceso rápido
    data: null,

    /**
     * MÉTODO DE INICIALIZACIÓN
     * Prepara el sistema antes de que el usuario interactúe.
     */
    async init() {
        UI.log('Preparando entorno de ejecución...');
        
        // 1. Preparamos los datos (Mezcla, Tensores y Normalización)
        this.data = this.service.prepareData();
        
        // 2. Construimos la arquitectura de la red (Capas y Neuronas)
        this.service.buildModel();

        // 3. Inicializamos la gráfica de Plotly con los datos crudos originales
        PlotService.init(this.data.rawInputs, this.data.rawOutputs);

        // 4. CONFIGURACIÓN DE EVENTOS (LISTENERS)
        
        // Al hacer clic en entrenar, iniciamos el proceso asíncrono de ajuste
        UI.elements.trainBtn.addEventListener('click', () => this.handleTrain());
        
        // Escuchamos cambios en los inputs para realizar predicciones "al vuelo"
        UI.elements.sizeIn.addEventListener('input', () => this.handlePredict());
        UI.elements.roomsIn.addEventListener('input', () => {
            this.handlePredict();
            // También actualizamos la línea de la gráfica para ver el impacto del cambio
            this.updateVisuals();
        });
        
        UI.log('Sistema listo para entrenamiento.');
    },

    /**
     * GESTIÓN DEL ENTRENAMIENTO
     * Maneja la llamada asíncrona al modelo y actualiza la UI en tiempo real.
     */
    async handleTrain() {
        // Bloqueamos el botón para evitar que el usuario reinicie el proceso por error
        UI.elements.trainBtn.disabled = true;
        UI.updateStatus('Entrenando con SGD...');
        UI.log(`Iniciando SGD (Optimizador de Descenso de Gradiente)`);

        /**
         * Llamamos al método train del servicio.
         * Pasamos 'callbacks' para que TensorFlow nos avise cada vez que termine una época.
         */
        await this.service.train(this.data.inputs, this.data.outputs, CONFIG, {
            onEpochEnd: (epoch, logs) => {
                // Actualizamos métricas de error y barra de progreso en la UI
                UI.updateMetrics(epoch, CONFIG.EPOCHS, logs.loss);
                
                // Cada N épocas (definido en config), actualizamos el log y la gráfica
                if ((epoch + 1) % CONFIG.UPDATE_EVERY_N_EPOCHS === 0) {
                    UI.log(`Época ${epoch + 1}: Loss ${logs.loss.toFixed(6)}`);
                    this.updateVisuals();
                }
            }
        });

        // Feedback de finalización
        UI.updateStatus('✅ Ajuste Completado');
        UI.elements.trainBtn.innerText = 'Modelo Entrenado';
        UI.log('Entrenamiento finalizado. Pesos optimizados.');
        
        // Realizamos una predicción inicial con los valores por defecto
        this.handlePredict();
    },

    /**
     * LÓGICA DE PREDICCIÓN (INFERENCIA)
     * Captura los valores de la UI y los pasa por la neurona entrenada.
     */
    handlePredict() {
        const size = parseFloat(UI.elements.sizeIn.value) || 0;
        const rooms = parseFloat(UI.elements.roomsIn.value) || 0;
        
        // Pedimos al servicio que realice la predicción y la des-normalice
        const price = this.service.predict(size, rooms);
        
        // Mostramos el precio formateado en dólares en la interfaz
        UI.displayPrice(price);
    },

    /**
     * ACTUALIZACIÓN DE LA VISUALIZACIÓN
     * Sincroniza la línea roja de la gráfica con el estado actual de la neurona.
     */
    updateVisuals() {
        const rooms = parseFloat(UI.elements.roomsIn.value) || 2;
        // Le pedimos al servicio de dibujo que redibuje la tendencia
        PlotService.updateLine(this.service, this.data.rawInputs, rooms);
    }
};

// Arrancamos la aplicación una vez cargado el script
App.init();