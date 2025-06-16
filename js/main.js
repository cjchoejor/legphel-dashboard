// Main dashboard functionality
class Dashboard {
    constructor() {
        this.apiBaseUrl = CONFIG.API_BASE_URL;
        this.currentSection = 'bill-summary';
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupModal();
        this.loadBillSummary();
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
        
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    loadBillSummary() {
        if (this.currentSection === 'bill-summary') {
            window.billSummary.loadData();
        }
    }

    showError(message) {
        console.error('Dashboard Error:', message);
        // You can implement a toast notification here
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.dashboard = new Dashboard();
});
