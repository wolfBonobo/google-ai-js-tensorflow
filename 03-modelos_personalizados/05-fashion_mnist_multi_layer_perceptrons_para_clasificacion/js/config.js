/**
 * CONFIGURACIÓN GLOBAL - FASHION AI
 */
export const CONFIG = {
    // Nombres legibles de las 10 categorías de Fashion MNIST
    LOOKUP: [
        'T-shirt/top',
        'Trouser',
        'Pullover',
        'Dress',
        'Coat',
        'Sandal',
        'Shirt',
        'Sneaker',
        'Bag',
        'Ankle boot'
    ],

    MODEL: {
        inputShape: [784],
        layers: [
            { units: 128, activation: 'relu' },
            { units: 64, activation: 'relu' },
            { units: 10, activation: 'softmax' }
        ],
        optimizer: 'adam',
        learningRate: 0.001,
        loss: 'categoricalCrossentropy',
        epochs: 50,
        batchSize: 512,
        validationSplit: 0.2
    },

    UI: {
        inferenceDelay: 2500,
        maxTests: 25
    }
};