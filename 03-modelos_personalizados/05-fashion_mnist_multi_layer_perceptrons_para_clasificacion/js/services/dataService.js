/**
 * SERVICIO DE DATOS (DataService)
 * * Este servicio actúa como la capa de acceso a datos (DAL). Su responsabilidad es
 * obtener el dataset bruto, procesarlo para que sea apto para el aprendizaje
 * profundo y suministrar muestras individuales para la fase de inferencia.
 */
import { TRAINING_DATA } from 'https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/fashion-mnist.js';

export const DataService = {
    // Referencias en memoria para acceder rápidamente a los datos sin volver a cargarlos
    inputs: null,
    outputs: null,

    /**
     * loadAndPrepare
     * Descarga, mezcla y normaliza el dataset Fashion MNIST.
     * * @returns {Promise<Object>} Objeto que contiene los tensores listos para model.fit()
     */
    async loadAndPrepare() {
        this.inputs = TRAINING_DATA.inputs;
        this.outputs = TRAINING_DATA.outputs;

        /**
         * MEZCLA (Shuffle):
         * Es fundamental mezclar los datos antes del entrenamiento. Si los datos
         * vienen ordenados por categoría (ej: primero todos los zapatos), el modelo
         * podría aprender sesgos temporales en lugar de características visuales.
         */
        tf.util.shuffleCombo(this.inputs, this.outputs);

        /**
         * tf.tidy:
         * Una función esencial en TensorFlow.js que libera automáticamente la memoria 
         * de los tensores intermedios creados dentro de ella, evitando fugas de memoria 
         * en la GPU (WebGL).
         */
        return tf.tidy(() => {
            // Convertimos los arrays de JavaScript a tensores, que son matrices optimizadas para IA.
            const inputsTensor = tf.tensor2d(this.inputs);

            /**
             * NORMALIZACIÓN:
             * Las redes neuronales funcionan mucho mejor con valores pequeños (0 a 1).
             * Si los píxeles están en rango 0-255, los gradientes matemáticos pueden "explotar"
             * y causar que el modelo no aprenda nada (quedándose en un 10% de precisión).
             */
            const maxVal = inputsTensor.max().dataSync()[0];
            const normalizedInputs = maxVal > 1 ? inputsTensor.div(255) : inputsTensor;

            /**
             * ONE-HOT ENCODING:
             * Transformamos etiquetas numéricas (ej: 5) en vectores de probabilidad.
             * El número 5 se convierte en [0, 0, 0, 0, 0, 1, 0, 0, 0, 0].
             * Esto permite que la función de pérdida compare la predicción con el valor real.
             */
            const outputsTensor = tf.oneHot(tf.tensor1d(this.outputs, 'int32'), 10);

            return { inputsTensor: normalizedInputs, outputsTensor };
        });
    },

    /**
     * getRandomSample
     * Selecciona una muestra aleatoria del dataset para probar el modelo en tiempo real.
     * * @returns {Object} Contiene los píxeles (784 valores) y su etiqueta original.
     */
    getRandomSample() {
        // Obtenemos un índice al azar entre 0 y el total de imágenes disponibles
        const idx = Math.floor(Math.random() * this.inputs.length);
        return {
            pixels: this.inputs[idx], // La imagen "aplanada" de 28x28 píxeles
            label: this.outputs[idx]  // El índice de la categoría (ej: 9 para botines)
        };
    }
};