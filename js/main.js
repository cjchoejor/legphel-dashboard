// Main dashboard functionality
class Dashboard {
    constructor() {
        this.apiBaseUrl = CONFIG.API_BASE_URL;
        this.currentSection = 'bill-summary';
        this.billSummaryInstance = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupModal();
        // Wait for billSummary to be ready
        this.waitForBillSummary();
    }

    waitForBillSummary() {
        // Check if billSummary is ready, if not wait a bit
        if (window.billSummary) {
            this.billSummaryInstance = window.billSummary;
            this.loadBillSummary();
        } else {
            setTimeout(() => this.waitForBillSummary(), 100);
        }
    }

    setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Remove active class from all nav items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                item.classList.add('active');
                
                // Hide all content sections
                const sections = document.querySelectorAll('.content-section');
                sections.forEach(section => section.classList.remove('active'));
                
                // Show selected section
                const sectionId = item.getAttribute('data-section');
                const targetSection = document.getElementById(sectionId);
                if (targetSection) {
                    targetSection.classList.add('active');
                    this.currentSection = sectionId;
                    
                    // Load content based on section
                    if (sectionId === 'bill-summary') {
                        this.loadBillSummary();
                    }
                }
            });
        });
    }

    setupModal() {
        const modal = document.getElementById('billDetailsModal');
        const closeBtn = document.querySelector('.close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    loadBillSummary() {
        if (this.currentSection === 'bill-summary' && this.billSummaryInstance) {
            this.billSummaryInstance.loadData();
        }
    }

    showError(message) {
        console.error('Dashboard Error:', message);
        // Create a temporary error notification
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #dc2626;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1001;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        `;
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});
