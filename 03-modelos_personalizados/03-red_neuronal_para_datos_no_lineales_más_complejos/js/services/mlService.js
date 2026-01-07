import { CONFIG } from '../config.js';

/**
 * SERVICIO DE MACHINE LEARNING (MLService)
 * * Esta clase encapsula toda la "inteligencia" de la aplicación utilizando TensorFlow.js.
 * Se encarga de procesar los datos, construir la arquitectura de la red y realizar el entrenamiento.
 */
export class MLService {
    constructor() {
        /**
         * @property {tf.Sequential} model - La estructura de la red neuronal.
         * @property {Object} normData - Almacena los valores mínimos y máximos de los datos originales.
         * Es crucial guardar estos valores como NÚMEROS (no tensores) para que no se borren de la memoria.
         */
        this.model = null;
        this.normData = { min: 0, max: 0 };
    }

    /**
     * PREPARACIÓN DE DATOS
     * * Convierte los arrays de JavaScript en Tensores (el lenguaje de las GPUs).
     * También aplica "Normalización", que es escalar los números para que estén entre 0 y 1.
     * Esto ayuda a la red neuronal a aprender mucho más rápido.
     */
    prepareData() {
        const rawInputs = CONFIG.DATA.inputs;
        const rawOutputs = rawInputs.map(CONFIG.DATA.targetFunc);

        // tf.tidy() es una herramienta de limpieza: borra los tensores temporales 
        // automáticamente para no saturar la memoria de video (GPU).
        return tf.tidy(() => {
            const inputsTensor = tf.tensor1d(rawInputs);
            const outputsTensor = tf.tensor1d(rawOutputs);

            // Guardamos los límites reales de nuestros datos para usarlos en el futuro.
            // .dataSync()[0] convierte el tensor en un número normal de JS.
            this.normData.min = inputsTensor.min().dataSync()[0];
            this.normData.max = inputsTensor.max().dataSync()[0];

            // Fórmula de Normalización Min-Max: (valor - min) / (max - min)
            const normalizedInputs = inputsTensor
                .sub(this.normData.min)
                .div(this.normData.max - this.normData.min);

            // Devolvemos los datos listos para el entrenamiento.
            return { inputs: normalizedInputs, outputs: outputsTensor };
        });
    }

    /**
     * CONSTRUCCIÓN DEL MODELO (Arquitectura)
     * * Aquí definimos el "cerebro" de la red. Usamos un modelo secuencial (capa tras capa).
     * Para este proyecto usamos capas Densas (donde cada neurona se conecta con todas las de la siguiente).
     */
    buildModel() {
        // Creamos un modelo donde la información fluye en una sola dirección.
        this.model = tf.sequential();

        // Iteramos sobre la configuración definida en config.js para crear las capas.
        CONFIG.MODEL.layers.forEach((layer, index) => {
            const layerConfig = {
                units: layer.units,           // Cuántas neuronas tiene esta capa.
                activation: layer.activation  // ReLU ayuda a aprender curvas, Linear devuelve valores continuos.
            };
            
            // La primera capa siempre necesita saber cuántos datos recibe (en nuestro caso, solo 1: el valor X).
            if (index === 0) {
                layerConfig.inputShape = CONFIG.MODEL.inputShape;
            }
            
            this.model.add(tf.layers.dense(layerConfig));
        });

        // "Compilar" es preparar el modelo para el entrenamiento definiendo:
        // 1. Optimizador (Adam): El algoritmo que ajusta los pesos para reducir el error.
        // 2. Pérdida (MSE): Cómo medimos qué tan lejos estamos de la respuesta correcta.
        this.model.compile({
            optimizer: tf.train.adam(CONFIG.MODEL.learningRate),
            loss: 'meanSquaredError'
        });

        return this.model;
    }

    /**
     * ENTRENAMIENTO
     * * El proceso donde la red intenta predecir y corrige sus errores basándose en los datos reales.
     */
    async train(inputs, outputs, onEpochEnd) {
        // .fit() es el bucle de entrenamiento principal.
        return await this.model.fit(inputs, outputs, {
            epochs: CONFIG.MODEL.epochs,       // Cuántas veces verá la red todo el conjunto de datos.
            batchSize: CONFIG.MODEL.batchSize, // Cuántos ejemplos procesa antes de actualizar sus pesos.
            shuffle: true,                     // Mezclamos los datos para que no aprenda el orden.
            callbacks: { onEpochEnd }          // Función para actualizar la UI en cada paso.
        });
    }

    /**
     * INFERENCIA (Predicción)
     * * Recibe un valor X (como el 7) y devuelve lo que la red cree que es Y (su cuadrado).
     */
    predict(val) {
        return tf.tidy(() => {
            // El valor de entrada DEBE normalizarse igual que los datos de entrenamiento.
            const inputTensor = tf.tensor1d([val]);
            const normalizedInput = inputTensor
                .sub(this.normData.min)
                .div(this.normData.max - this.normData.min);
            
            // Realizamos la predicción.
            const prediction = this.model.predict(normalizedInput);
            
            // Extraemos el resultado final como un número de JavaScript.
            return prediction.dataSync()[0];
        });
    }

    /**
     * GENERACIÓN DE CURVA VISUAL
     * * Crea una serie de puntos (X, Y) a lo largo de todo el rango de datos.
     * Esto nos sirve para dibujar la línea suave en la gráfica que representa 
     * el "pensamiento" actual de la red neuronal.
     */
    getCurveData() {
        const points = [];
        const min = this.normData.min;
        const max = this.normData.max;
        
        // Generamos puntos con saltos pequeños (0.5) para que la gráfica se vea fluida.
        for (let x = min; x <= max; x += 0.5) {
            points.push({ x: x, y: this.predict(x) });
        }
        return points;
    }
}