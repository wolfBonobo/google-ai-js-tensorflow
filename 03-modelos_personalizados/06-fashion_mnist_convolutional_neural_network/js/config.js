/**
 * CONFIGURACIÓN GLOBAL - FASHION CNN
 * Centraliza las etiquetas del dataset, parámetros del modelo e intervalos de UI.
 */
export const CONFIG = {
    // Etiquetas oficiales de Fashion MNIST
    LOOKUP: [
        'T-shirt', 'Trouser', 'Pullover', 'Dress', 'Coat',
        'Sandal', 'Shirt', 'Sneaker', 'Bag', 'Ankle boot'
    ],

    MODEL: {
        // En CNN usamos formato 2D [alto, ancho, canales]
        inputShape: [28, 28, 1],
        optimizer: 'adam',
        learningRate: 0.001,
        loss: 'categoricalCrossentropy',
        epochs: 30,         // Las CNN convergen con menos épocas que las MLP
        batchSize: 256,     // Lote grande para aprovechar la aceleración por hardware
        validationSplit: 0.15
    },

    UI: {
        defaultInferenceDelay: 2000,
        maxTests: 100 // Límite de seguridad
    }
};