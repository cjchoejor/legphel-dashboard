// Configuration file for API settings
const CONFIG = {
    API_BASE_URL: 'http://119.105.142:3800', // Removed /api since your endpoints don't use it
    REFRESH_INTERVAL: 5000, // Changed to 5 seconds as requested
    ITEMS_PER_PAGE: 50,
    DATE_FORMAT: 'DD/MM/YYYY',
    TIME_FORMAT: 'HH:MM',
    CURRENCY_SYMBOL: 'Nu'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
