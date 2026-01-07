import { TRAINING_DATA } from 'https://storage.googleapis.com/jmstore/TensorFlowJS/EdX/TrainingData/fashion-mnist.js';

// --- Configuración y Referencias ---
const LOOKUP = [
  'T-shirt',
  'Trouser',
  'Pullover',
  'Dress',
  'Coat',
  'Sandal',
  'Shirt',
  'Sneaker',
  'Bag',
  'Ankle boot',
];
const PREDICTION_ELEMENT = document.getElementById('prediction');
const PREDICTION_CARD = document.getElementById('prediction-card');
const CONSOLE_LOG = document.getElementById('consoleLog');
const CANVAS = document.getElementById('canvas');
const CTX = CANVAS.getContext('2d');
const RANGER = document.getElementById('ranger');
const DOM_SPEED = document.getElementById('domSpeed');
const EPOCH_COUNTER = document.getElementById('epochCounter');

let interval = 2000;

function log(msg, isSuccess = false) {
  const entry = document.createElement('div');
  if (isSuccess) entry.className = 'text-green-400 font-bold';
  entry.innerText = `> ${msg}`;
  CONSOLE_LOG.appendChild(entry);
  CONSOLE_LOG.scrollTop = CONSOLE_LOG.scrollHeight;
}

RANGER.addEventListener('input', function () {
  interval = this.value;
  DOM_SPEED.innerText = `Intervalo: ${interval}ms`;
});

/**
 * 1. NORMALIZACIÓN
 * Convierte valores de 0-255 a un rango de 0-1.
 */
function normalize(tensor, min, max) {
  return tf.tidy(() => {
    const MIN_VALUES = tf.scalar(min);
    const MAX_VALUES = tf.scalar(max);
    const TENSOR_SUBTRACT_MIN_VALUE = tf.sub(tensor, MIN_VALUES);
    const RANGE_SIZE = tf.sub(MAX_VALUES, MIN_VALUES);
    return tf.div(TENSOR_SUBTRACT_MIN_VALUE, RANGE_SIZE);
  });
}

/**
 * 2. PREPARACIÓN DE DATOS
 */
const INPUTS = TRAINING_DATA.inputs;
const OUTPUTS = TRAINING_DATA.outputs;
tf.util.shuffleCombo(INPUTS, OUTPUTS);

const INPUTS_TENSOR = normalize(tf.tensor2d(INPUTS), 0, 255);
const OUTPUTS_TENSOR = tf.oneHot(tf.tensor1d(OUTPUTS, 'int32'), 10);
log('Datos normalizados y barajados correctamente.');

/**
 * 3. ARQUITECTURA CNN
 */
const model = tf.sequential();

// Capa Convolucional 1: Busca patrones básicos (bordes)
model.add(
  tf.layers.conv2d({
    inputShape: [28, 28, 1],
    filters: 16,
    kernelSize: 3,
    strides: 1,
    padding: 'same',
    activation: 'relu',
  }),
);
// Reducción de tamaño: de 28x28 a 14x14
model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));

// Capa Convolucional 2: Busca patrones complejos
model.add(
  tf.layers.conv2d({
    filters: 32,
    kernelSize: 3,
    strides: 1,
    padding: 'same',
    activation: 'relu',
  }),
);
// Reducción de tamaño: de 14x14 a 7x7
model.add(tf.layers.maxPooling2d({ poolSize: 2, strides: 2 }));

// Aplanado y Perceptrón Multicapa (MLP)
model.add(tf.layers.flatten());
model.add(tf.layers.dense({ units: 128, activation: 'relu' }));
model.add(tf.layers.dense({ units: 10, activation: 'softmax' }));

model.summary();
log('Arquitectura CNN definida con 32,490 conexiones.');

/**
 * 4. ENTRENAMIENTO
 */
async function train() {
  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  });

  // Reestructurar datos para la entrada convolucional: [batch, ancho, alto, canales]
  const RESHAPED_INPUTS = INPUTS_TENSOR.reshape([INPUTS.length, 28, 28, 1]);

  log('Iniciando entrenamiento pesado (30 épocas)...');

  await model.fit(RESHAPED_INPUTS, OUTPUTS_TENSOR, {
    shuffle: true,
    validationSplit: 0.15,
    batchSize: 256,
    epochs: 30,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        EPOCH_COUNTER.innerText = `Época: ${epoch + 1}/30`;
        log(
          `Época ${epoch + 1}: Precisión=${(logs.acc * 100).toFixed(2)}% | Val_Precisión=${(
            logs.val_acc * 100
          ).toFixed(2)}%`,
        );
      },
    },
  });

  // Limpieza de memoria para optimizar el rendimiento de la predicción
  RESHAPED_INPUTS.dispose();
  OUTPUTS_TENSOR.dispose();
  INPUTS_TENSOR.dispose();

  log('¡Entrenamiento Finalizado! Iniciando visualización.', true);
  evaluate();
}

/**
 * 5. EVALUACIÓN Y DIBUJO
 */
function evaluate() {
  const OFFSET = Math.floor(Math.random() * INPUTS.length);

  let answer = tf.tidy(() => {
    let newInput = normalize(tf.tensor1d(INPUTS[OFFSET]), 0, 255);
    // Predicción con reshape de una sola imagen
    let output = model.predict(newInput.reshape([1, 28, 28, 1]));
    return output.squeeze().argMax();
  });

  answer.array().then((index) => {
    const isCorrect = index === OUTPUTS[OFFSET];

    // Actualizar interfaz
    PREDICTION_ELEMENT.innerText = LOOKUP[index];
    PREDICTION_ELEMENT.className =
      'text-4xl font-black text-center transition-all duration-300 transform scale-110';

    // Aplicar estilos de acierto/error
    PREDICTION_CARD.className = `flex flex-col items-center justify-center w-full h-48 rounded-2xl border-4 transition-all duration-500 shadow-xl ${
      isCorrect ? 'correct-box' : 'wrong-box'
    }`;

    answer.dispose();
    drawImage(INPUTS[OFFSET]);
  });
}

function drawImage(digit) {
  const imageData = CTX.getImageData(0, 0, 28, 28);
  for (let i = 0; i < digit.length; i++) {
    const val = digit[i]; // Valores 0-255 originales
    imageData.data[i * 4] = val; // R
    imageData.data[i * 4 + 1] = val; // G
    imageData.data[i * 4 + 2] = val; // B
    imageData.data[i * 4 + 3] = 255; // A
  }
  CTX.putImageData(imageData, 0, 0);

  // Bucle de clasificación basado en el intervalo del slider
  setTimeout(evaluate, interval);
}

// Lanzar el proceso
train();
