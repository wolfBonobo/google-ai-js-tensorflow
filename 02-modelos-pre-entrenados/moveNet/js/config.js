export const CONFIG = {
    MODEL_PATH: 'https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/4',
    CROP: {
        // Ajustamos para que la suma no supere 179
        start: [10, 50, 0], 
        size: [150, 150, 3]  // Un cuadrado de 150x150 cabe bien en 179
    },
    MIN_CONFIDENCE: 0.3,
    INPUT_SIZE: 192 
};