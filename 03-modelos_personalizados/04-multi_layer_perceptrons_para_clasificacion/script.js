import { TRAINING_DATA } from 'https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/mnist.js';

// --- Referencias UI ---
const PREDICTION_ELEMENT = document.getElementById('prediction');
const PREDICTION_CONTAINER = document.getElementById('prediction-container');
const CONSOLE_LOG = document.getElementById('consoleLog');
const CANVAS = document.getElementById('canvas');
const CTX = CANVAS.getContext('2d');

function log(msg) {
  const entry = document.createElement('div');
  entry.innerText = `> ${msg}`;
  CONSOLE_LOG.appendChild(entry);
  CONSOLE_LOG.scrollTop = CONSOLE_LOG.scrollHeight;
}

/**
 * 1. PREPARACIÓN DE DATOS
 */
const INPUTS = TRAINING_DATA.inputs;
const OUTPUTS = TRAINING_DATA.outputs;

// Mezclamos los datos para evitar sesgos (los primeros 1000 son ceros, etc.)
tf.util.shuffleCombo(INPUTS, OUTPUTS);

// Convertimos a Tensores
const INPUTS_TENSOR = tf.tensor2d(INPUTS);
// Salida One-Hot para clasificación de 10 clases (0-9)
const OUTPUTS_TENSOR = tf.oneHot(tf.tensor1d(OUTPUTS, 'int32'), 10);

log(`Dataset mezclado: ${INPUTS.length} ejemplos cargados.`);

/**
 * 2. ARQUITECTURA DEL MODELO
 */
const model = tf.sequential();
// Capa de entrada: 784 neuronas (28x28) con 32 neuronas densas (ReLU)
model.add(tf.layers.dense({ inputShape: [784], units: 32, activation: 'relu' }));
// Capa oculta: 16 neuronas (ReLU)
model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
// Capa de salida: 10 neuronas (Softmax para probabilidades)
model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

model.summary();
log('Modelo compilado. Iniciando entrenamiento...');

/**
 * 3. ENTRENAMIENTO
 */
async function train() {
  model.compile({
    optimizer: 'adam', // Optimizador adaptativo
    loss: 'categoricalCrossentropy', // Pérdida para clasificación multiclase
    metrics: ['accuracy'],
  });

  await model.fit(INPUTS_TENSOR, OUTPUTS_TENSOR, {
    shuffle: true,
    validationSplit: 0.2, // Reservamos 20% para validación
    batchSize: 512,
    epochs: 50,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if ((epoch + 1) % 5 === 0 || epoch === 0) {
          log(
            `Época ${epoch + 1}: Precisión=${(logs.acc * 100).toFixed(
              2,
            )}% | Loss=${logs.loss.toFixed(4)}`,
          );
        }
      },
    },
  });

  // Limpieza de tensores de entrenamiento
  OUTPUTS_TENSOR.dispose();
  INPUTS_TENSOR.dispose();

  log('Entrenamiento finalizado. Iniciando evaluación continua.');
  evaluate();
}

/**
 * 4. EVALUACIÓN Y PREDICCIÓN
 */
function evaluate() {
  // Seleccionamos un ejemplo aleatorio
  const OFFSET = Math.floor(Math.random() * INPUTS.length);

  let answer = tf.tidy(() => {
    // Expandimos dimensiones porque el modelo espera un lote [batch, features]
    let newInput = tf.tensor1d(INPUTS[OFFSET]).expandDims();
    let output = model.predict(newInput);

    // Obtenemos el índice con la probabilidad más alta
    return output.squeeze().argMax();
  });

  // Procesamos la respuesta del tensor de forma asíncrona
  answer.array().then((index) => {
    const isCorrect = index === OUTPUTS[OFFSET];

    // Actualizamos UI
    PREDICTION_ELEMENT.innerText = index;
    PREDICTION_ELEMENT.className = 'text-8xl font-black transition-all duration-300';

    if (isCorrect) {
      PREDICTION_CONTAINER.className =
        'flex items-center justify-center w-48 h-48 rounded-2xl border-4 border-solid border-green-500 bg-green-50 text-green-600 shadow-lg shadow-green-100';
    } else {
      PREDICTION_CONTAINER.className =
        'flex items-center justify-center w-48 h-48 rounded-2xl border-4 border-solid border-red-500 bg-red-50 text-red-600 shadow-lg shadow-red-100';
    }

    answer.dispose();
    drawImage(INPUTS[OFFSET]);
  });
}

/**
 * 5. DIBUJAR IMAGEN EN CANVAS
 */
function drawImage(digit) {
  // Obtenemos el buffer de datos del canvas
  let imageData = CTX.getImageData(0, 0, 28, 28);

  // Los datos MNIST vienen normalizados [0, 1]. Los convertimos a RGBA [0, 255]
  for (let i = 0; i < digit.length; i++) {
    const val = digit[i] * 255;
    imageData.data[i * 4] = val; // R
    imageData.data[i * 4 + 1] = val; // G
    imageData.data[i * 4 + 2] = val; // B
    imageData.data[i * 4 + 3] = 255; // A (Opaco)
  }

  // Pintamos los píxeles en el canvas
  CTX.putImageData(imageData, 0, 0);

  // Siguiente evaluación en 2 segundos
  setTimeout(evaluate, 2000);
}

// Iniciamos el proceso
train();
