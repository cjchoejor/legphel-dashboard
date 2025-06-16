// Simplified API Service that works directly with CORS-enabled server
class APIService {
    constructor() {
        this.baseUrl = CONFIG.API_BASE_URL;
    }

    async makeRequest(endpoint, options = {}) {
        const fullUrl = `${this.baseUrl}${endpoint}`;
        
        try {
            console.log(`Making request to: ${fullUrl}`);
            
            const response = await fetch(fullUrl, {
                ...options,
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('Request successful:', data);
            return data;
            
        } catch (error) {
            console.error('API Request failed:', error);
            throw new Error(`Failed to connect to server: ${error.message}`);
        }
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

    // Test connection method
    async testConnection() {
        try {
            const response = await fetch(`${this.baseUrl}/fnb_bill_summary_legphel_eats`, {
                method: 'HEAD', // Just check if endpoint exists
                mode: 'cors'
            });
            return response.ok;
        } catch (error) {
            return false;
        }
    }
}

// Create global instance
window.apiService = new APIService();
