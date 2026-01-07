/**
 * SERVICIO DE DATOS (DataService)
 * Encargado de la carga asíncrona del dataset y la gestión de muestras.
 */
import { TRAINING_DATA } from 'https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/mnist.js';

export const DataService = {
    inputs: null,
    outputs: null,

    /**
     * Prepara los tensores necesarios para el entrenamiento.
     */
    async loadAndPrepare() {
        this.inputs = TRAINING_DATA.inputs;
        this.outputs = TRAINING_DATA.outputs;

        // Mezcla aleatoria para asegurar que el modelo no aprenda el orden de las clases
        tf.util.shuffleCombo(this.inputs, this.outputs);

        return tf.tidy(() => {
            const inputsTensor = tf.tensor2d(this.inputs);
            // One-Hot: convierte el número (ej: 3) en vector (ej: [0,0,0,1,0,0,0,0,0,0])
            const outputsTensor = tf.oneHot(tf.tensor1d(this.outputs, 'int32'), 10);

            return { inputsTensor, outputsTensor };
        });
    },

    /**
     * Extrae una muestra al azar para la inferencia continua.
     */
    getRandomSample() {
        const idx = Math.floor(Math.random() * this.inputs.length);
        return {
            pixels: this.inputs[idx],
            label: this.outputs[idx]
        };
    }
};