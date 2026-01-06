/**
 * CONFIGURACIÓN GLOBAL
 * Centraliza los hiperparámetros del modelo y los estilos de visualización.
 */
export const CONFIG = {
    // Hiperparámetros de entrenamiento
    LEARNING_RATE: 0.05,
    EPOCHS: 200,
    BATCH_SIZE: 32,
    UPDATE_EVERY_N_EPOCHS: 5,

    // Configuración visual para el motor de gráficas (Plotly)
    PLOT: {
        pointsColor: '#3b82f6', // Color de los puntos de datos (azul)
        lineColor: '#ef4444',   // Color de la línea de tendencia (rojo)
        font: 'Inter, system-ui, sans-serif'
    }
};