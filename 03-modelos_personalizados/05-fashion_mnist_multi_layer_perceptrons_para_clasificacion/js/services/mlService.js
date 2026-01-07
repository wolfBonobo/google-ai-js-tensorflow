/**
 * SERVICIO DE MACHINE LEARNING (MLService)
 * * Este servicio es el "cerebro" de la aplicación. Aquí definimos cómo aprende 
 * la red neuronal, su estructura de capas y cómo procesa las imágenes de moda 
 * para transformarlas en predicciones de categorías.
 */
import { CONFIG } from '../config.js';

export class MLService {
    constructor() {
        /** @type {tf.LayersModel|null} Referencia al modelo secuencial de TensorFlow */
        this.model = null;
    }

    /**
     * buildModel: Define la arquitectura de la red.
     * Creamos un modelo "Secuencial", donde los datos fluyen de una capa a la siguiente.
     */
    buildModel() {
        // Inicializamos un modelo donde las capas se apilan una tras otra
        this.model = tf.sequential();

        // Iteramos sobre la configuración de capas definida en config.js
        CONFIG.MODEL.layers.forEach((layer, index) => {
            const config = {
                units: layer.units,          // Número de neuronas en la capa
                activation: layer.activation // Función que decide si la neurona se "dispara"
            };

            /**
             * INPUT SHAPE:
             * La primera capa es la única que necesita saber el tamaño de los datos de entrada.
             * En nuestro caso, son 784 píxeles (28x28).
             */
            if (index === 0) config.inputShape = CONFIG.MODEL.inputShape;

            // Añadimos una capa "Densa" (donde todas las neuronas se conectan con todas las de la capa anterior)
            this.model.add(tf.layers.dense(config));
        });

        /**
         * COMPILACIÓN:
         * Aquí preparamos el modelo para el entrenamiento.
         * - Optimizer (Adam): El algoritmo que ajusta los pesos para reducir el error.
         * - Loss (CategoricalCrossentropy): Mide "qué tan mal" lo está haciendo el modelo.
         * - Metrics (Accuracy): Porcentaje de aciertos que queremos monitorear.
         */
        this.model.compile({
            optimizer: CONFIG.MODEL.optimizer,
            loss: CONFIG.MODEL.loss,
            metrics: ['accuracy']
        });

        return this.model;
    }

    /**
     * train: El proceso de aprendizaje por repetición.
     * @param {tf.Tensor} inputs - Las imágenes de ropa.
     * @param {tf.Tensor} outputs - Las etiquetas correctas (One-Hot).
     * @param {Function} onEpochEnd - Función para avisar a la UI del progreso.
     */
    async train(inputs, outputs, onEpochEnd) {
        // model.fit es el método que inicia el entrenamiento real
        return await this.model.fit(inputs, outputs, {
            epochs: CONFIG.MODEL.epochs,          // Cuántas veces repasará todo el dataset
            batchSize: CONFIG.MODEL.batchSize,    // Cuántas imágenes procesa antes de actualizarse
            validationSplit: CONFIG.MODEL.validationSplit, // Datos reservados para el examen final
            shuffle: true,                        // Mezcla los datos en cada vuelta
            callbacks: { onEpochEnd }             // Informa a la UI tras cada época
        });
    }

    /**
     * predict: La fase de "adivinanza" o inferencia.
     * @param {Array<number>} pixels - Los 784 píxeles de una prenda.
     */
    predict(pixels) {
        /**
         * tf.tidy:
         * Fundamental para evitar que la memoria de la tarjeta gráfica se llene.
         * Limpia todos los tensores temporales creados durante la predicción.
         */
        return tf.tidy(() => {
            /**
             * EXPAND DIMS:
             * El modelo espera un "lote" de imágenes, no solo una.
             * Convertimos [784] en [1, 784] para que parezca un lote de una sola imagen.
             */
            const input = tf.tensor1d(pixels).expandDims();

            // Realizamos la inferencia
            const output = this.model.predict(input).squeeze();

            // dataSync() extrae los valores numéricos del tensor para que JS pueda leerlos
            const probabilities = Array.from(output.dataSync());

            // argMax() encuentra la posición del valor más alto (el dígito predicho)
            const winnerIndex = output.argMax().dataSync()[0];

            return { index: winnerIndex, probabilities };
        });
    }
}