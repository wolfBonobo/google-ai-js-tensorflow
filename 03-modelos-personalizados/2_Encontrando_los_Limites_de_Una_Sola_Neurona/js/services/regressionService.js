import { CONFIG } from '../config.js';

/**
 * SERVICIO DE REGRESIÓN (ML SERVICE)
 * Maneja la lógica de la neurona única. 
 */
export class RegressionService {
    constructor() {
        this.model = null;
        /**
         * Almacenamos valores numéricos (no tensores) para que persistan 
         * fuera del ciclo de vida de tf.tidy().
         */
        this.normInfo = null; 
    }

    /**
     * Prepara los tensores y extrae los valores de normalización.
     */
    prepareData() {
        return tf.tidy(() => {
            const inputs = tf.tensor2d(CONFIG.DATA.inputs, [CONFIG.DATA.inputs.length, 1]);
            const outputs = tf.tensor2d(CONFIG.DATA.outputs, [CONFIG.DATA.outputs.length, 1]);

            /**
             * SOLUCIÓN AL ERROR DE BACKEND:
             * Extraemos los valores mínimos y máximos como números nativos de JS usando .dataSync().
             * Esto permite que los valores sobrevivan a la limpieza automática de tf.tidy().
             */
            const min = inputs.min().dataSync()[0];
            const max = inputs.max().dataSync()[0];
            
            this.normInfo = { min, max };

            // Normalización de las entradas para el entrenamiento
            const normalizedInputs = inputs.sub(min).div(max - min);

            return { normalizedInputs, outputs };
        });
    }

    /**
     * Construye un modelo secuencial con una única neurona lineal.
     */
    buildModel() {
        this.model = tf.sequential();
        // Una sola neurona = una línea recta (y = wx + b)
        this.model.add(tf.layers.dense({ inputShape: [1], units: 1 }));
        return this.model;
    }

    /**
     * Entrena el modelo usando Descenso de Gradiente Estocástico (SGD).
     */
    async train(inputs, outputs, callbacks) {
        this.model.compile({
            optimizer: tf.train.sgd(CONFIG.HYPERPARAMS.LEARNING_RATE),
            loss: 'meanSquaredError'
        });

        return await this.model.fit(inputs, outputs, {
            epochs: CONFIG.HYPERPARAMS.EPOCHS,
            batchSize: CONFIG.HYPERPARAMS.BATCH_SIZE,
            shuffle: true,
            callbacks: callbacks
        });
    }

    /**
     * Realiza una inferencia basada en los pesos actuales.
     * @param {number} val - El valor de X para el cual queremos predecir Y.
     */
    predict(val) {
        return tf.tidy(() => {
            // Verificamos que tengamos datos de normalización
            if (!this.normInfo) return 0;

            const inputTensor = tf.tensor2d([val], [1, 1]);
            
            /**
             * Normalizamos el valor de entrada usando los números guardados.
             * TF.js permite restar un número directamente a un tensor (broadcasting).
             */
            const normInput = inputTensor.sub(this.normInfo.min).div(this.normInfo.max - this.normInfo.min);
            
            const pred = this.model.predict(normInput);
            return pred.dataSync()[0];
        });
    }
}