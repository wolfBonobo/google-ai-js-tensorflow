/**
 * Gestiona la comunicación con el DOM
 */
export const UI = {
    elements: {
        img: document.getElementById('exampleImg'),
        canvas: document.getElementById('outputCanvas'),
        btn: document.getElementById('runBtn'),
        status: document.getElementById('statusMsg'),
        indicator: document.getElementById('statusIndicator')
    },
    ctx: document.getElementById('outputCanvas').getContext('2d'),
    
    updateStatus(msg, type = 'waiting') {
        this.elements.status.innerText = msg;
        const colors = {
            waiting: 'bg-yellow-500',
            loading: 'bg-blue-500',
            success: 'bg-green-500',
            error: 'bg-red-500'
        };
        this.elements.indicator.className = `w-2 h-2 rounded-full ${colors[type]}`;
    },
    
    setLoading(isLoading) {
        this.elements.btn.disabled = isLoading;
        if (isLoading) {
            this.elements.btn.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            this.elements.btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    }
};