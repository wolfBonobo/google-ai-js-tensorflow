/**
 * CONFIGURACIÓN GLOBAL
 * Centraliza hiperparámetros del modelo y ajustes de la interfaz.
 */
export const CONFIG = {
    DATASET_URL: 'https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/mnist.js',

    MODEL: {
        inputShape: [784], // 28 * 28 píxeles aplanados
        layers: [
            { units: 32, activation: 'relu' },    // Capa oculta 1 (Captura rasgos básicos)
            { units: 16, activation: 'relu' },    // Capa oculta 2 (Refina patrones)
            { units: 10, activation: 'softmax' }  // Salida (Distribución de probabilidad 0-9)
        ],
        optimizer: 'adam',
        loss: 'categoricalCrossentropy',
        epochs: 50,
        batchSize: 512,
        validationSplit: 0.2
    },

    UI: {
        inferenceDelay: 2500 // Tiempo entre cada prueba visual (ms)
    }
};