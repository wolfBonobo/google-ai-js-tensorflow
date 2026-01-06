import { TRAINING_DATA } from '../../real-estate-data.js';

/**
 * SERVICIO DE REGRESIÓN (ML SERVICE)
 * Esta clase encapsula la "inteligencia" de la aplicación, gestionando el ciclo de vida
 * del modelo: desde el tratamiento de datos hasta el entrenamiento y la predicción.
 */
export class RegressionService {
    constructor() {
        /**
         * El modelo de TensorFlow.js. Se inicializa como null hasta que se construye.
         */
        this.model = null;

        /**
         * Guardamos el precio máximo para la técnica de "Feature Scaling".
         * Al dividir todos los precios por el máximo, obtenemos valores entre 0 y 1,
         * lo que ayuda al optimizador SGD a converger mucho más rápido.
         */
        this.maxPrice = Math.max(...TRAINING_DATA.outputs);

        /**
         * Almacenará los valores Mínimos y Máximos de las entradas (Sqft y Cuartos)
         * para poder normalizar las nuevas predicciones de la misma forma que los datos de entrenamiento.
         */
        this.normalizationData = null;
    }

    /**
     * PREPARACIÓN DE DATOS
     * Convierte los arrays de JavaScript en Tensores, que son las estructuras de datos
     * optimizadas que TensorFlow utiliza para cálculos en la GPU/WebGL.
     */
    prepareData() {
        const inputs = [...TRAINING_DATA.inputs];
        const outputs = [...TRAINING_DATA.outputs];
        
        /**
         * Barajamos los datos. Es vital en ML para que el modelo no aprenda
         * sesgos basados en el orden en que se recolectaron los datos.
         */
        tf.util.shuffleCombo(inputs, outputs);

        /**
         * Creamos un Tensor 2D (Matriz). Cada fila es una casa, cada columna una característica (Sqft, Cuartos).
         */
        const inputTensor = tf.tensor2d(inputs);

        /**
         * Normalizamos la salida (precios). Usar precios brutos (ej: 300,000) causaría "Gradientes Explosivos",
         * haciendo que la neurona falle matemáticamente.
         */
        const normalizedOutputs = outputs.map(p => p / this.maxPrice);
        const outputTensor = tf.tensor1d(normalizedOutputs);

        // Calculamos y guardamos los parámetros de normalización de las entradas
        this.normalizationData = this.calculateNormalization(inputTensor);

        return {
            inputs: this.normalizationData.NORMALIZED_VALUES,
            outputs: outputTensor,
            rawInputs: TRAINING_DATA.inputs,
            rawOutputs: TRAINING_DATA.outputs
        };
    }

    /**
     * NORMALIZACIÓN (Min-Max Scaling)
     * Transforma cualquier rango de números al rango [0, 1].
     * Fórmula: (Valor - Mínimo) / (Máximo - Mínimo)
     */
    calculateNormalization(tensor, min, max) {
        /**
         * tf.tidy() limpia automáticamente los tensores intermedios de la memoria de video (GPU)
         * una vez finalizada la función, evitando fugas de memoria (memory leaks).
         */
        return tf.tidy(() => {
            const MIN_VALUES = min || tf.min(tensor, 0); // El '0' indica que busque el mínimo por columna
            const MAX_VALUES = max || tf.max(tensor, 0);
            
            // Operación vectorial: resta y división aplicada a todos los elementos del tensor
            const NORMALIZED_VALUES = tf.div(tf.sub(tensor, MIN_VALUES), tf.sub(MAX_VALUES, MIN_VALUES));
            
            return { NORMALIZED_VALUES, MIN_VALUES, MAX_VALUES };
        });
    }

    /**
     * ARQUITECTURA DEL MODELO
     * Definimos un modelo "Secuencial" donde la información fluye en una sola dirección.
     */
    buildModel() {
        this.model = tf.sequential();

        /**
         * Añadimos una capa "Densa" (totalmente conectada).
         * units: 1 -> Indica que tenemos una sola neurona (Regresión Lineal Simple).
         * inputShape: [2] -> La neurona recibe 2 datos de entrada (Superficie y Habitaciones).
         */
        this.model.add(tf.layers.dense({ inputShape: [2], units: 1 }));
        
        return this.model;
    }

    /**
     * ENTRENAMIENTO
     * El proceso donde el modelo ajusta sus "pesos" (weights) y "sesgo" (bias) para reducir el error.
     */
    async train(inputs, outputs, config, callbacks) {
        /**
         * .compile() configura el proceso de aprendizaje:
         * optimizer: SGD (Descenso de Gradiente Estocástico) es el algoritmo que camina hacia el error mínimo.
         * loss: MSE (Error Cuadrático Medio) es la función que mide qué tan lejos estamos de la realidad.
         */
        this.model.compile({
            optimizer: tf.train.sgd(config.LEARNING_RATE),
            loss: 'meanSquaredError',
        });

        /**
         * .fit() inicia el entrenamiento.
         * epochs: Cuántas veces el modelo verá el dataset completo.
         * batchSize: Cuántos ejemplos procesa antes de actualizar sus pesos.
         */
        return await this.model.fit(inputs, outputs, {
            epochs: config.EPOCHS,
            batchSize: config.BATCH_SIZE,
            callbacks: callbacks
        });
    }

    /**
     * PREDICCIÓN (INFERENCIA)
     * Toma datos nuevos y utiliza los pesos aprendidos para estimar un resultado.
     */
    predict(size, rooms) {
        return tf.tidy(() => {
            // 1. Convertimos la entrada del usuario a Tensor
            const input = tf.tensor2d([[size, rooms]]);

            // 2. Normalizamos la entrada usando los Mismos valores del entrenamiento
            const norm = this.calculateNormalization(
                input, 
                this.normalizationData.MIN_VALUES, 
                this.normalizationData.MAX_VALUES
            );

            // 3. Pasamos el dato por el modelo (Inferencia)
            const prediction = this.model.predict(norm.NORMALIZED_VALUES);

            /**
             * 4. DES-NORMALIZACIÓN
             * El modelo devuelve un valor entre 0 y 1. Multiplicamos por el precio máximo original
             * para convertirlo de nuevo en una cifra de dólares legible por humanos.
             */
            return prediction.dataSync()[0] * this.maxPrice;
        });
    }
}