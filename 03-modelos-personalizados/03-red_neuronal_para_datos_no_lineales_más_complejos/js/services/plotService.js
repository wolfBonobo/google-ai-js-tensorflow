import { CONFIG } from '../config.js';

/**
 * SERVICIO DE GRÁFICAS (Chart.js)
 */
export const PlotService = {
    chart: null,

    init() {
        const ctx = document.getElementById('mainChart').getContext('2d');
        
        // Datos de referencia (función real)
        const realData = CONFIG.DATA.inputs.map(x => ({ x, y: CONFIG.DATA.targetFunc(x) }));

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [
                    {
                        label: 'Función Real (x²)',
                        data: realData,
                        borderColor: '#94a3b8',
                        borderDash: [5, 5],
                        borderWidth: 1,
                        pointRadius: 0,
                        fill: false
                    },
                    {
                        label: 'Predicción MLP',
                        data: [],
                        borderColor: '#10b981',
                        borderWidth: 3,
                        pointRadius: 0,
                        tension: 0.4,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: false,
                scales: {
                    x: { type: 'linear', position: 'bottom' },
                    y: { type: 'linear' }
                },
                plugins: {
                    legend: { labels: { boxWidth: 10, font: { size: 10 } } }
                }
            }
        });
    },

    updatePredictions(points) {
        if (this.chart) {
            this.chart.data.datasets[1].data = points;
            this.chart.update('none');
        }
    }
};