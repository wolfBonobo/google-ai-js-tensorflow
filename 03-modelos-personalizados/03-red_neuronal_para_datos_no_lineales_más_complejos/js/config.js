/**
 * Centraliza los hiperparámetros para facilitar el ajuste fino de la red.
 */
export const CONFIG = {
    // Datos: y = x²
    DATA: {
        inputs: Array.from({ length: 25 }, (_, i) => i + 1),
        targetFunc: (x) => x * x
    },

    // Arquitectura MLP (Multilayer Perceptron)
    MODEL: {
        inputShape: [1],
        layers: [
            { units: 32, activation: 'relu' }, // Capa oculta 1
            { units: 16, activation: 'relu' }, // Capa oculta 2
            { units: 1, activation: 'linear' } // Salida
        ],
        learningRate: 0.01, // Usamos Adam, por lo que 0.01 es adecuado
        epochs: 300,
        batchSize: 4
    }
};