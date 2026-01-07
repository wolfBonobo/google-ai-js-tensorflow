import { CONFIG } from '../config.js';

/**
 * SERVICIO DE VISUALIZACIÓN (PLOT SERVICE)
 */
export class PlotService {
    static init() {
        const tracePoints = {
            x: CONFIG.DATA.inputs,
            y: CONFIG.DATA.outputs,
            mode: 'markers',
            name: 'Realidad (x²)',
            marker: { color: CONFIG.STYLE.points, size: 10, opacity: 0.7 }
        };

        const traceLine = {
            x: [],
            y: [],
            mode: 'lines',
            name: 'Neurona (Lineal)',
            line: { color: CONFIG.STYLE.line, width: 4 }
        };

        const layout = {
            margin: { t: 20, b: 40, l: 60, r: 20 },
            xaxis: { title: 'Entrada (x)', gridcolor: '#f1f5f9' },
            yaxis: { title: 'Resultado (y)', gridcolor: '#f1f5f9' },
            font: { family: CONFIG.STYLE.font },
            legend: { orientation: 'h', y: -0.2 }
        };

        Plotly.newPlot('plotContainer', [tracePoints, traceLine], layout, {
            responsive: true,
            displayModeBar: false
        });
    }

    static update(regressionService) {
        // Generamos puntos de prueba para dibujar la "línea" de la neurona
        const testX = Array.from({ length: 25 }, (_, i) => i * 0.85);
        const testY = testX.map(x => regressionService.predict(x));

        Plotly.restyle('plotContainer', { x: [testX], y: [testY] }, [1]);
    }
}