// Configuration file for API settings
const CONFIG = {
    // Correct IP address
    API_BASE_URL: 'http://119.2.105.142:3800',
    REFRESH_INTERVAL: 5000, // 5 seconds
    ITEMS_PER_PAGE: 50,
    DATE_FORMAT: 'DD/MM/YYYY',
    TIME_FORMAT: 'HH:MM',
    CURRENCY_SYMBOL: '₹'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
