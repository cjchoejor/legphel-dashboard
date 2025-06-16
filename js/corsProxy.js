// CORS Proxy solution for development
class CORSProxy {
    constructor() {
        this.proxyUrls = [
            'https://cors-anywhere.herokuapp.com/',
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?'
        ];
        this.currentProxyIndex = 0;
    }

    async fetchWithProxy(url, options = {}) {
        // First try direct fetch
        try {
            const response = await fetch(url, {
                ...options,
                mode: 'cors'
            });
            if (response.ok) return response;
        } catch (error) {
            console.log('Direct fetch failed, trying proxy...');
        }

        // Try with proxy
        for (let i = 0; i < this.proxyUrls.length; i++) {
            try {
                const proxyUrl = this.proxyUrls[i] + encodeURIComponent(url);
                const response = await fetch(proxyUrl, {
                    ...options,
                    mode: 'cors'
                });
                if (response.ok) return response;
            } catch (error) {
                console.log(`Proxy ${i + 1} failed, trying next...`);
            }
        }

        throw new Error('All proxy attempts failed');
    }
}

// Make it globally available
window.corsProxy = new CORSProxy();
