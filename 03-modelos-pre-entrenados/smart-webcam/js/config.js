/**
 * CONFIGURACIÓN GLOBAL DE SMART WEBCAM
 * Centraliza los umbrales de detección y estilos de renderizado.
 */
export const CONFIG = {
    // Umbral de confianza (66%). Solo se muestran objetos con alta probabilidad.
    MIN_CONFIDENCE: 0.66,
    
    // Estilos visuales para los cuadros delimitadores (Bounding Boxes)
    STYLE: {
        stroke: '#4f46e5',      // indigo-600 para el borde
        fill: 'rgba(79, 70, 229, 0.15)', // Relleno semi-transparente
        font: 'bold 12px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        labelBg: '#4f46e5',     // Fondo de la etiqueta de texto
        lineWidth: 3            // Grosor del borde del cuadro
    }
};