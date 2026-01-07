/**
 * SERVICIO DE DATOS (DataService)
 * Gestiona la carga, mezcla y normalización de Fashion MNIST.
 * Didáctico: Prepara los tensores en formato 4D necesarios para las capas Conv2D.
 */
import { TRAINING_DATA } from 'https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/fashion-mnist.js';

export const DataService = {
    inputs: null,
    outputs: null,

    /**
     * loadAndPrepare
     * Transforma el dataset plano en volúmenes espaciales.
     */
    async loadAndPrepare() {
        this.inputs = TRAINING_DATA.inputs;
        this.outputs = TRAINING_DATA.outputs;

        // El barajado es crucial para que el modelo no aprenda el orden de las muestras
        tf.util.shuffleCombo(this.inputs, this.outputs);

        return tf.tidy(() => {
            /** * REFORMA PARA CNN (Reshape):
             * Las capas Conv2D operan sobre volúmenes.
             * Convertimos el array plano [784] en [28, 28, 1].
             * El tensor final tiene forma [muestras, 28, 28, 1].
             */
            const inputsTensor = tf.tensor2d(this.inputs)
                .reshape([this.inputs.length, 28, 28, 1]);

            // Normalización defensiva al rango [0, 1]
            const maxVal = inputsTensor.max().dataSync()[0];
            const normalizedInputs = maxVal > 1 ? inputsTensor.div(255) : inputsTensor;

            // One-Hot Encoding para las 10 categorías
            const outputsTensor = tf.oneHot(tf.tensor1d(this.outputs, 'int32'), 10);

            return { inputsTensor: normalizedInputs, outputsTensor };
        });
    },

    /**
     * getRandomSample
     * Extrae una muestra aleatoria para la fase de evaluación.
     */
    getRandomSample() {
        const idx = Math.floor(Math.random() * this.inputs.length);
        return {
            pixels: this.inputs[idx],
            label: this.outputs[idx]
        };
    }
};