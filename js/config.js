// Configuration file for API settings
const CONFIG = {
    // Use your server's HTTPS URL if available, or we'll handle CORS differently
    API_BASE_URL: 'https://119.105.142:3800', // Try HTTPS first
    API_BASE_URL_FALLBACK: 'http://119.105.142:3800', // Fallback to HTTP
    REFRESH_INTERVAL: 5000, // 5 seconds as requested
    ITEMS_PER_PAGE: 50,
    DATE_FORMAT: 'DD/MM/YYYY',
    TIME_FORMAT: 'HH:MM',
    CURRENCY_SYMBOL: 'Nu'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
