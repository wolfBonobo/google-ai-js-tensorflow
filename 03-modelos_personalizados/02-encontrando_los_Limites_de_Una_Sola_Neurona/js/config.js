/**
 * CONFIGURACIÓN DEL EXPERIMENTO
 */
export const CONFIG = {
    // Datos cuadráticos (y = x^2)
    DATA: {
        inputs: [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 14, 15, 18, 20],
        outputs: [1, 4, 9, 16, 25, 36, 64, 81, 100, 144, 196, 225, 324, 400]
    },
    
    // Parámetros de la neurona rígida
    HYPERPARAMS: {
        LEARNING_RATE: 0.01,
        EPOCHS: 250,
        BATCH_SIZE: 2
    },

    // Estilos visuales
    STYLE: {
        points: '#6366f1', // indigo-500
        line: '#f43f5e',   // rose-500
        font: 'Inter, system-ui, sans-serif'
    }
};