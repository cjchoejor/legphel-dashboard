// Bill Summary functionality
class BillSummary {
    constructor() {
        this.apiBaseUrl = CONFIG.API_BASE_URL;
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
                <button class="refresh-btn" id="refreshBtn">
                    <i class="fas fa-sync-alt"></i> Refresh
                </button>
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
        });
    }

    startAutoRefresh() {
        // Refresh data every 5 seconds as requested
        this.refreshInterval = setInterval(() => {
            if (document.getElementById('bill-summary').classList.contains('active')) {
                this.loadData();
            }
        }, CONFIG.REFRESH_INTERVAL);
    }

    async loadData() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/api/fnb_bill_summary_legphel_eats`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const bills = await response.json();
            this.renderBills(bills);
            
        } catch (error) {
            console.error('Error loading bills:', error);
            this.showError('Failed to load bills. Please check your connection.');
        }
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

            // Fetch bill details
            const response = await fetch(`${this.apiBaseUrl}/api/fnb_bill_details_legphel_eats/${billNo}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const billDetails = await response.json();
            this.renderBillDetails(billDetails, billNo);
            
        } catch (error) {
            console.error('Error loading bill details:', error);
            const modalBody = document.getElementById('billDetailsContent');
            modalBody.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    Failed to load bill details. Please try again.
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
                            <th>Quantity</th>
                            <th>Rate</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${details.map(item => `
                            <tr>
                                <td>${item.menu_name || 'N/A'}</td>
                                <td>${item.quanity || 0}</td>
                                <td>₹${this.formatAmount(item.rate)}</td>
                                <td>₹${this.formatAmount(item.amount)}</td>
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

        // Confirm deletion
        if (!confirm(`Are you sure you want to delete bill ${billNo}? This action cannot be undone.`)) {
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}/api/fnb_bill_summary_legphel_eats/${billNo}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Show success message
            this.showSuccess(`Bill ${billNo} deleted successfully`);
            
            // Reload data
            this.loadData();
            
        } catch (error) {
            console.error('Error deleting bill:', error);
            this.showError('Failed to delete bill. Please try again.');
        }
    }

    showError(message) {
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

    showSuccess(message) {
        // Create a temporary success notification
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
