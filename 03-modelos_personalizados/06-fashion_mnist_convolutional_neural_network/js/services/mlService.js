/**
 * SERVICIO DE MACHINE LEARNING (MLService)
 * Define la arquitectura de la Red Neuronal Convolucional (CNN).
 */
import { CONFIG } from '../config.js';

export class MLService {
    constructor() {
        this.model = null;
    }

    /**
     * buildModel
     * Diseña una red con capas de convolución, pooling y clasificación.
     */
    buildModel() {
        this.model = tf.sequential();

        /**
         * 1. CAPA CONVOLUCIONAL 1:
         * Detecta características básicas (bordes horizontales, verticales, etc.)
         */
        this.model.add(tf.layers.conv2d({
            inputShape: CONFIG.MODEL.inputShape,
            filters: 16,     // 16 "ojos" diferentes mirando la imagen
            kernelSize: 3,   // Escaneo de 3x3 píxeles
            padding: 'same',
            activation: 'relu',
            kernelInitializer: 'varianceScaling'
        }));

        /**
         * 2. MAX POOLING 1:
         * Reduce el tamaño a la mitad (28x28 -> 14x14) quedándose con lo más importante.
         */
        this.model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

        /**
         * 3. CAPA CONVOLUCIONAL 2:
         * Detecta patrones complejos (curvas, texturas, formas de mangas o suelas).
         */
        this.model.add(tf.layers.conv2d({
            filters: 32,
            kernelSize: 3,
            padding: 'same',
            activation: 'relu',
            kernelInitializer: 'varianceScaling'
        }));

        /**
         * 4. MAX POOLING 2:
         * Reduce de nuevo (14x14 -> 7x7).
         */
        this.model.add(tf.layers.maxPooling2d({ poolSize: [2, 2], strides: [2, 2] }));

        /**
         * 5. FLATTEN & CLASSIFY:
         * Aplanamos la salida 2D y usamos capas densas para la decisión final.
         */
        this.model.add(tf.layers.flatten());

        this.model.add(tf.layers.dense({
            units: 128,
            activation: 'relu',
            kernelInitializer: 'varianceScaling'
        }));

        this.model.add(tf.layers.dense({
            units: 10,
            activation: 'softmax', // Probabilidades para 10 clases
            kernelInitializer: 'varianceScaling'
        }));

        this.model.compile({
            optimizer: tf.train.adam(CONFIG.MODEL.learningRate),
            loss: CONFIG.MODEL.loss,
            metrics: ['accuracy']
        });

        return this.model;
    }

    /**
     * train
     * Entrenamiento asíncrono con callback para UI.
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
     * predict
     * Inferencia sobre una sola muestra.
     */
    predict(pixels) {
        return tf.tidy(() => {
            // El input debe ser un tensor 4D [1, 28, 28, 1]
            let input = tf.tensor1d(pixels).reshape([1, 28, 28, 1]);
            if (input.max().dataSync()[0] > 1) input = input.div(255);

            const prediction = this.model.predict(input).squeeze();
            const probabilities = Array.from(prediction.dataSync());
            const winnerIndex = prediction.argMax().dataSync()[0];

            return { index: winnerIndex, probabilities };
        });
    }
}