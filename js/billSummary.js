// Bill Summary functionality
class BillSummary {
    constructor() {
        this.refreshInterval = null;
        this.init();
    }

    init() {
        this.createBillSummaryHTML();
        this.setupEventListeners();
        this.startAutoRefresh();
    }

    createBillSummaryHTML() {
        const billSummarySection = document.getElementById('bill-summary');
        billSummarySection.innerHTML = `
            <div class="bill-summary-header">
                <h1><i class="fas fa-receipt"></i> Bill Summary</h1>
                <div class="header-controls">
                    <button class="refresh-btn" id="refreshBtn">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                    <button class="test-connection-btn" id="testConnectionBtn">
                        <i class="fas fa-wifi"></i> Test Connection
                    </button>
                </div>
            </div>
            
            <div class="connection-status" id="connectionStatus">
                <div class="status-indicator">
                    <i class="fas fa-circle" id="statusIcon"></i>
                    <span id="statusText">Checking connection...</span>
                </div>
            </div>
            
            <div class="bills-table-container">
                <table class="bills-table">
                    <thead>
                        <tr>
                            <th>Bill No</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Amount</th>
                            <th>Outlet</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="billsTableBody">
                        <tr>
                            <td colspan="7" class="loading">
                                <i class="fas fa-spinner fa-spin"></i> Loading bills...
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    setupEventListeners() {
        // Refresh button
        document.addEventListener('click', (e) => {
            if (e.target.id === 'refreshBtn' || e.target.closest('#refreshBtn')) {
                this.loadData();
            }
            if (e.target.id === 'testConnectionBtn' || e.target.closest('#testConnectionBtn')) {
                this.testConnection();
            }
        });
    }

    startAutoRefresh() {
        // Refresh data every 5 seconds
        this.refreshInterval = setInterval(() => {
            if (document.getElementById('bill-summary').classList.contains('active')) {
                this.loadData();
            }
        }, CONFIG.REFRESH_INTERVAL);
    }

    async testConnection() {
        const statusIcon = document.getElementById('statusIcon');
        const statusText = document.getElementById('statusText');
        
        statusIcon.className = 'fas fa-spinner fa-spin';
        statusText.textContent = 'Testing connection...';
        
        try {
            // Test direct connection to your server
            const testUrl = `${CONFIG.API_BASE_URL}/fnb_bill_summary_legphel_eats`;
            console.log('Testing connection to:', testUrl);
            
            const response = await fetch(testUrl, {
                method: 'GET',
                mode: 'no-cors' // This won't give us the data but will test if server is reachable
            });
            
            statusIcon.className = 'fas fa-circle';
            statusIcon.style.color = '#16a34a';
            statusText.textContent = 'Server reachable - Using proxy for data';
            
        } catch (error) {
            statusIcon.className = 'fas fa-circle';
            statusIcon.style.color = '#dc2626';
            statusText.textContent = 'Connection failed - Server may be down';
        }
    }

    async loadData() {
        try {
            console.log('Loading bills data...');
            const bills = await window.apiService.getBills();
            this.renderBills(bills);
            this.updateConnectionStatus(true);
            
        } catch (error) {
            console.error('Error loading bills:', error);
            this.showConnectionError(error.message);
            this.updateConnectionStatus(false);
        }
    }

    updateConnectionStatus(isConnected) {
        const statusIcon = document.getElementById('statusIcon');
        const statusText = document.getElementById('statusText');
        
        if (isConnected) {
            statusIcon.className = 'fas fa-circle';
            statusIcon.style.color = '#16a34a';
            statusText.textContent = 'Connected to server';
        } else {
            statusIcon.className = 'fas fa-circle';
            statusIcon.style.color = '#dc2626';
            statusText.textContent = 'Connection failed';
        }
    }

    showConnectionError(errorMessage) {
        const tbody = document.getElementById('billsTableBody');
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align: center; padding: 40px;">
                    <div style="color: #dc2626; margin-bottom: 15px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 24px; margin-bottom: 10px;"></i><br>
                        <strong>Connection Error</strong>
                    </div>
                    <div style="color: #888; font-size: 14px; line-height: 1.5;">
                        <p><strong>Error:</strong> ${errorMessage}</p>
                        <p><strong>Server:</strong> ${CONFIG.API_BASE_URL}</p>
                        <hr style="margin: 15px 0; border-color: #404040;">
                        <p><strong>Possible solutions:</strong></p>
                        <ul style="text-align: left; display: inline-block; margin: 10px 0;">
                            <li>Check if your server is running on port 3800</li>
                            <li>Verify the IP address: 119.105.142 (not 119.105.0.142)</li>
                            <li>Your server needs CORS headers for HTTPS sites</li>
                            <li>Try the "Test Connection" button above</li>
                        </ul>
                        <button onclick="billSummary.loadData()" style="
                            background: #dc2626; 
                            color: white; 
                            border: none; 
                            padding: 8px 16px; 
                            border-radius: 4px; 
                            cursor: pointer;
                            margin-top: 10px;
                        ">
                            <i class="fas fa-redo"></i> Try Again
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    renderBills(bills) {
        const tbody = document.getElementById('billsTableBody');
        
        if (!bills || bills.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px; color: #888;">
                        <i class="fas fa-inbox"></i><br>
                        No bills found
                    </td>
                </tr>
            `;
            return;
        }

        // Sort bills by date and time (newest first)
        bills.sort((a, b) => {
            const dateA = new Date(`${a.date} ${a.time}`);
            const dateB = new Date(`${b.date} ${b.time}`);
            return dateB - dateA;
        });

        tbody.innerHTML = bills.map(bill => `
            <tr>
                <td>${bill.fnb_bill_no || 'N/A'}</td>
                <td>${this.formatDate(bill.date)}</td>
                <td>${this.formatTime(bill.time)}</td>
                <td>₹${this.formatAmount(bill.total_amount)}</td>
                <td>${bill.outlet || 'N/A'}</td>
                <td>
                    <span class="status-badge ${this.getStatusClass(bill.payment_status)}">
                        ${bill.payment_status || 'Unknown'}
                    </span>
                </td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view-btn" onclick="billSummary.viewBillDetails('${bill.fnb_bill_no}')" title="View Details">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn delete-btn" onclick="billSummary.deleteBill('${bill.fnb_bill_no}')" title="Delete Bill">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }

    formatTime(timeString) {
        if (!timeString) return 'N/A';
        return timeString.substring(0, 5); // HH:MM format
    }

    formatAmount(amount) {
        if (!amount) return '0.00';
        return parseFloat(amount).toFixed(2);
    }

    getStatusClass(status) {
        if (!status) return 'status-pending';
        
        const statusLower = status.toLowerCase();
        if (statusLower.includes('paid') || statusLower.includes('settled')) {
            return 'status-paid';
        } else if (statusLower.includes('pending') || statusLower.includes('unpaid')) {
            return 'status-pending';
        } else if (statusLower.includes('cancelled') || statusLower.includes('cancel')) {
            return 'status-cancelled';
        }
        return 'status-pending';
    }

    async viewBillDetails(billNo) {
        if (!billNo) {
            this.showError('Invalid bill number');
            return;
        }

        try {
            const modal = document.getElementById('billDetailsModal');
            const modalBody = document.getElementById('billDetailsContent');
            
            // Show modal with loading state
            modalBody.innerHTML = `
                <div class="loading">
                    <i class="fas fa-spinner fa-spin"></i> Loading bill details...
                </div>
            `;
            modal.style.display = 'block';

            const billDetails = await window.apiService.getBillDetails(billNo);
            this.renderBillDetails(billDetails, billNo);
            
        } catch (error) {
            console.error('Error loading bill details:', error);
            const modalBody = document.getElementById('billDetailsContent');
            modalBody.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    Failed to load bill details: ${error.message}
                </div>
            `;
        }
    }

        renderBillDetails(details, billNo) {
        const modalBody = document.getElementById('billDetailsContent');
        
        if (!details || details.length === 0) {
            modalBody.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #888;">
                    <i class="fas fa-inbox"></i><br>
                    No details found for bill ${billNo}
                </div>
            `;
            return;
        }

        // Calculate totals
        const totalItems = details.reduce((sum, item) => sum + (item.quanity || 0), 0);
        const totalAmount = details.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);

        modalBody.innerHTML = `
            <div class="bill-details-header" style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #404040;">
                <h3 style="color: #dc2626; margin-bottom: 10px;">Bill No: ${billNo}</h3>
                <div style="display: flex; gap: 30px; font-size: 14px; color: #cccccc;">
                    <span><strong>Total Items:</strong> ${totalItems}</span>
                    <span><strong>Total Amount:</strong> ₹${totalAmount.toFixed(2)}</span>
                </div>
            </div>
            
            <div class="bill-details-table-container">
                <table class="bills-table">
                    <thead>
                        <tr>
                            <th>Menu Item</th>
                            <th>Rate</th>
                            <th>Quantity</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${details.map(item => `
                            <tr>
                                <td>${item.menu_name || 'N/A'}</td>
                                <td>₹${this.formatAmount(item.rate)}</td>
                                <td>${item.quanity || 0}</td>
                                <td>₹${this.formatAmount(item.amount)}</td>
                                <td>${this.formatDate(item.date)}</td>
                                <td>${this.formatTime(item.time)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    async deleteBill(billNo) {
        if (!billNo) {
            this.showError('Invalid bill number');
            return;
        }

        if (!confirm(`Are you sure you want to delete bill ${billNo}? This action cannot be undone.`)) {
            return;
        }

        try {
            await window.apiService.deleteBill(billNo);
            this.showSuccess(`Bill ${billNo} deleted successfully`);
            this.loadData();
            
        } catch (error) {
            console.error('Error deleting bill:', error);
            this.showError('Failed to delete bill: ' + error.message);
        }
    }

    showError(message) {
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
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
        `;
        errorDiv.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    showSuccess(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-notification';
        successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: #16a34a;
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            z-index: 1001;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
            animation: slideInRight 0.3s ease-out;
            max-width: 400px;
        `;
        successDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
        
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

// Initialize bill summary when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.billSummary = new BillSummary();
});
