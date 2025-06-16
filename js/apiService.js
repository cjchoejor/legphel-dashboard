// API Service with CORS proxy support
class APIService {
    constructor() {
        this.baseUrl = CONFIG.API_BASE_URL;
        this.corsProxies = [
            'https://cors-anywhere.herokuapp.com/',
            'https://api.allorigins.win/raw?url=',
            'https://corsproxy.io/?',
            'https://thingproxy.freeboard.io/fetch/'
        ];
        this.currentProxyIndex = 0;
    }

    async makeRequest(endpoint, options = {}) {
        const fullUrl = `${this.baseUrl}${endpoint}`;
        
        // Try direct request first (won't work due to mixed content, but let's try)
        try {
            const response = await fetch(fullUrl, {
                ...options,
                mode: 'cors'
            });
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.log('Direct request failed (expected due to HTTPS/HTTP mixed content)');
        }

        // Try with CORS proxies
        for (let i = 0; i < this.corsProxies.length; i++) {
            try {
                console.log(`Trying proxy ${i + 1}: ${this.corsProxies[i]}`);
                const proxyUrl = this.corsProxies[i] + encodeURIComponent(fullUrl);
                
                const response = await fetch(proxyUrl, {
                    ...options,
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(`Success with proxy ${i + 1}`);
                    return data;
                }
            } catch (error) {
                console.log(`Proxy ${i + 1} failed:`, error.message);
            }
        }

        // If all proxies fail, throw error
        throw new Error('All connection attempts failed. Server may be unreachable or CORS is not configured.');
    }

    async getBills() {
        return await this.makeRequest('/fnb_bill_summary_legphel_eats');
    }

    async getBillDetails(billNo) {
        return await this.makeRequest(`/fnb_bill_details_legphel_eats/${billNo}`);
    }

    async deleteBill(billNo) {
        return await this.makeRequest(`/fnb_bill_summary_legphel_eats/${billNo}`, {
            method: 'DELETE'
        });
    }
}

// Create global instance
window.apiService = new APIService();
