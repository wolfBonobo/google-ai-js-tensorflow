/**
 * Gestiona el DOM y los estados de la interfaz
 */
export const UI = {
    elements: {
        video: document.getElementById('webcam'),
        canvas: document.getElementById('outputCanvas'),
        btn: document.getElementById('enableCam'),
        status: document.getElementById('statusMsg'),
        indicator: document.getElementById('statusIndicator'),
        loader: document.getElementById('loaderOverlay')
    },
    
    ctx: document.getElementById('outputCanvas').getContext('2d'),

    updateStatus(msg, type = 'waiting') {
        this.elements.status.innerText = msg;
        const colors = {
            waiting: 'bg-yellow-500',
            loading: 'bg-indigo-500',
            success: 'bg-green-500',
            error: 'bg-red-500'
        };
        this.elements.indicator.className = `w-2 h-2 rounded-full ${colors[type]}`;
    },

    hideLoader() {
        this.elements.loader.classList.add('opacity-0', 'pointer-events-none');
        this.elements.btn.disabled = false;
    },

    hideButton() {
        this.elements.btn.classList.add('hidden');
    }
};