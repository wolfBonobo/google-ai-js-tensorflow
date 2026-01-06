import { CONFIG } from '../config.js';

/**
 * SERVICIO DE VISUALIZACIÓN (PLOT SERVICE)
 * Este servicio se encarga de gestionar la librería Plotly.js para representar
 * visualmente los datos reales y la evolución de la línea de regresión de la neurona.
 */
export class PlotService {
    /**
     * INICIALIZACIÓN DE LA GRÁFICA
     * Crea el lienzo inicial con los puntos de datos reales de las casas.
     * @param {Array} rawInputs - Datos originales de entrada (Sqft, Habitaciones).
     * @param {Array} rawOutputs - Precios reales de las casas.
     */
    static init(rawInputs, rawOutputs) {
        // Extraemos solo la superficie (Sqft) para el eje X de esta gráfica 2D
        const xSize = rawInputs.map(val => val[0]);
        const yPrice = rawOutputs;

        /**
         * Trazo 0: Los puntos de datos (Scatter)
         * Representa las casas reales del dataset.
         */
        const traceData = {
            x: xSize,
            y: yPrice,
            mode: 'markers',
            type: 'scatter',
            name: 'Casas Reales',
            marker: { 
                color: CONFIG.PLOT.pointsColor, 
                size: 7, 
                opacity: 0.6 
            },
        };

        /**
         * Trazo 1: La línea de regresión (Lines)
         * Esta línea representará la "opinión" actual de la neurona sobre los precios.
         * Inicialmente está vacía hasta que el entrenamiento genera predicciones.
         */
        const traceLine = {
            x: [],
            y: [],
            mode: 'lines',
            name: 'Línea de Regresión',
            line: { 
                color: CONFIG.PLOT.lineColor, 
                width: 3 
            },
        };

        const layout = {
            margin: { t: 10, r: 10, l: 50, b: 40 },
            xaxis: { 
                title: 'Superficie (Sqft)', 
                gridcolor: '#f1f5f9' 
            },
            yaxis: { 
                title: 'Precio ($)', 
                gridcolor: '#f1f5f9' 
            },
            font: { family: CONFIG.PLOT.font },
            plot_bgcolor: '#ffffff',
            paper_bgcolor: 'rgba(0,0,0,0)',
            legend: { orientation: 'h', y: -0.2 },
        };

        // Renderizado inicial en el contenedor HTML 'regressionPlot'
        Plotly.newPlot('regressionPlot', [traceData, traceLine], layout, {
            responsive: true,
            displayModeBar: false,
        });
    }

    /**
     * ACTUALIZACIÓN DINÁMICA DE LA LÍNEA
     * Genera una serie de puntos sintéticos para "dibujar" la línea de tendencia
     * basada en los pesos actuales del modelo.
     * @param {RegressionService} regressionService - Instancia del servicio de ML.
     * @param {Array} rawInputs - Entradas originales para determinar el rango del eje X.
     * @param {number} currentRooms - Valor actual de habitaciones seleccionado en la UI.
     */
    static updateLine(regressionService, rawInputs, currentRooms) {
        // Determinamos el rango del eje X basándonos en los datos reales
        const sizes = rawInputs.map(d => d[0]);
        const minSize = Math.min(...sizes);
        const maxSize = Math.max(...sizes);
        
        const numPoints = 20; // Cuántos puntos usaremos para dibujar la línea
        const step = (maxSize - minSize) / (numPoints - 1);

        const plotX = [];
        const plotY = [];

        /**
         * GENERACIÓN DE PREDICCIONES
         * Recorremos el eje X y le preguntamos al modelo:
         * "¿Si una casa mide X y tiene Y cuartos, cuánto debería valer?"
         */
        for (let i = 0; i < numPoints; i++) {
            const size = minSize + step * i;
            plotX.push(size);
            
            // Obtenemos la predicción des-normalizada del modelo
            const prediction = regressionService.predict(size, currentRooms);
            plotY.push(prediction);
        }

        /**
         * Plotly.restyle: Actualización eficiente.
         * En lugar de recrear toda la gráfica, solo actualizamos los datos (x, y)
         * del trazo con índice [1] (la línea roja).
         */
        Plotly.restyle('regressionPlot', { x: [plotX], y: [plotY] }, [1]);
    }
}