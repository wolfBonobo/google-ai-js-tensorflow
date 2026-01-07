/**
 * SERVICIO DE MACHINE LEARNING (MLService)
 * Define y ejecuta las operaciones matemáticas de la red neuronal.
 */
import { CONFIG } from '../config.js';

export class MLService {
    constructor() {
        this.model = null;
    }

    /**
     * Construye la estructura de capas del MLP.
     */
    buildModel() {
        this.model = tf.sequential();

        CONFIG.MODEL.layers.forEach((layer, index) => {
            const config = {
                units: layer.units,
                activation: layer.activation
            };
            if (index === 0) config.inputShape = CONFIG.MODEL.inputShape;
            this.model.add(tf.layers.dense(config));
        });

        this.model.compile({
            optimizer: CONFIG.MODEL.optimizer,
            loss: CONFIG.MODEL.loss,
            metrics: ['accuracy']
        });

        return this.model;
    }

    /**
     * Proceso de ajuste de pesos (entrenamiento).
     */
    async train(inputs, outputs, onEpochEnd) {
        return await this.model.fit(inputs, outputs, {
            epochs: CONFIG.MODEL.epochs,
            batchSize: CONFIG.MODEL.batchSize,
            validationSplit: CONFIG.MODEL.validationSplit,
            shuffle: true,
            callbacks: { onEpochEnd }
        });
    }

    /**
     * Realiza una inferencia y devuelve el desglose de probabilidades.
     * Ajustado para devolver { index, probabilities }.
     */
    predict(pixels) {
        return tf.tidy(() => {
            const input = tf.tensor1d(pixels).expandDims();
            const output = this.model.predict(input).squeeze();

            // Extraemos los datos del tensor antes de destruirlo
            const probabilities = Array.from(output.dataSync());
            const winner = output.argMax().dataSync()[0];

            return { index: winner, probabilities };
        });
    }
}