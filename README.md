# Legphel Hotel POS Dashboard

A modern, responsive dashboard for managing restaurant bills and analytics.

## Features

- **Bill Summary**: View all bills with real-time updates
- **Bill Details**: View detailed information for each bill
- **Delete Bills**: Remove bills with confirmation
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Auto-refresh every 10 seconds

## Setup Instructions

### Local Development

1. Clone this repository
2. Open `index.html` in your browser, or
3. Use a local server:
   ```bash
   npx live-server --port=8080
   ```

### Netlify Deployment

1. Push your code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Click "New site from Git"
4. Connect your GitHub account
5. Select your repository
6. Deploy settings:
   - Build command: `echo 'Static site'`
   - Publish directory: `.` (root)
7. Click "Deploy site"

### API Configuration

Make sure your Node.js API server is running on `http://119.105.142:3800` with CORS enabled.

## File Structure

```
├── index.html              # Main HTML file
├── styles/
│   └── main.css           # Main stylesheet
├── js/
│   ├── main.js            # Main dashboard logic
│   └── billSummary.js     # Bill summary functionality
├── package.json           # Node.js dependencies
├── netlify.toml          # Netlify configuration
└── README.md             # This file
```

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## License

MIT License
```

Now let's create a `.gitignore` file:

```gitignore:.gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
/dist
/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Temporary files
*.tmp
*.temp
```

Let's also create a simple configuration file for API settings:

```javascript:js/config.js
// Configuration file for API settings
const CONFIG = {
    API_BASE_URL: 'http://119.105.142:3800/api',
    REFRESH_INTERVAL: 10000, // 10 seconds
    ITEMS_PER_PAGE: 50,
    DATE_FORMAT: 'DD/MM/YYYY',
    TIME_FORMAT: 'HH:MM',
    CURRENCY_SYMBOL: '₹'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
```

Now update the HTML to include the config file:

```html:index.html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Legphel Hotel - FNB Dashboard</title>
    <link rel="stylesheet" href="styles/main.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <link rel="icon" type="image/x-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏨</text></svg>">
</head>
<body>
    <div class="dashboard-container">
        <!-- Left Sidebar -->
        <div class="sidebar">
            <div class="logo-section">
                <div class="logo-placeholder">
                    <i class="fas fa-hotel"></i>
                </div>
                <h2>FNB Dashboard</h2>
            </div>
            
            <nav class="nav-menu">
                <ul>
                    <li>
                        <a href="#" class="nav-item active" data-section="bill-summary">
                            <i class="fas fa-receipt"></i>
                            <span>Bill Summary</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-item" data-section="analytics">
                            <i class="fas fa-chart-bar"></i>
                            <span>Analytics</span>
                        </a>
                    </li>
                    <li>
                        <a href="#" class="nav-item" data-section="reports">
                            <i class="fas fa-file-alt"></i>
                            <span>Reports</span>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>

        <!-- Main Content Area -->
        <div class="main-content">
            <div id="bill-summary" class="content-section active">
                <!-- Bill Summary content will be loaded here -->
            </div>
            
            <div id="analytics" class="content-section">
                <div class="coming-soon">
                    <i class="fas fa-chart-bar" style="font-size: 48px; color: #dc2626; margin-bottom: 20px;"></i>
                    <h1>Analytics</h1>
                    <p>Analytics dashboard coming soon...</p>
                </div>
            </div>
            
            <div id="reports" class="content-section">
                <div class="coming-soon">
                    <i class="fas fa-file-alt" style="font-size: 48px; color: #dc2626; margin-bottom: 20px;"></i>
                    <h1>Reports</h1>
                    <p>Reports section coming soon...</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Bill Details Modal -->
    <div id="billDetailsModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2>Bill Details</h2>
                <span class="close">&times;</span>
            </div>
            <div class="modal-body">
                <div id="billDetailsContent"></div>
            </div>
        </div>
    </div>

    <!-- Loading Overlay -->
    <div id="loadingOverlay" class="loading-overlay">
        <div class="loading-spinner">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading...</p>
        </div>
    </div>

    <script src="js/config.js"></script>
    <script src="js/main.js"></script>
    <script src="js/billSummary.js"></script>
</body>
</html>
```

Add some additional CSS for the coming soon sections and loading overlay:

```css:styles/main.css
/* ... (previous CSS remains the same) ... */

/* Coming Soon Styles */
.coming-soon {
    text-align: center;
    padding: 80px 20px;
    color: #cccccc;
}

.coming-soon h1 {
    color: #dc2626;
    margin-bottom: 15px;
    font-size: 32px;
}

.coming-soon p {
    font-size: 18px;
    opacity: 0.8;
}

/* Loading Overlay */
.loading-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(26, 26, 26, 0.9);
    z-index: 9999;
    justify-content: center;
    align-items: center;
}

.loading-spinner {
    text-align: center;
    color: #dc2626;
}

.loading-spinner i {
    font-size: 48px;
    margin-bottom: 20px;
}

.loading-spinner p {
    font-size: 18px;
    color: #cccccc;
}

/* Additional Table Styles */
.bills-table tbody tr:nth-child(even) {
    background-color: #252525;
}

.bills-table tbody tr:nth-child(odd) {
    background-color: #2d2d2d;
}

/* Improved Action Buttons */
.action-buttons {
    display: flex;
    gap: 5px;
    justify-content: center;
}

.action-btn {
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 36px;
    height: 36px;
}

.action-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* Improved Status Badges */
.status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: inline-block;
    min-width: 70px;
    text-align: center;
}

/* Enhanced Modal Styles */
.modal-content {
    animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
    from {
        opacity: 0;
        transform: translateY(-50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Bill Details Table in Modal */
.bill-details-table-container .bills-table {
    font-size: 14px;
}

.bill-details-table-container .bills-table th {
    background: linear-gradient(135deg, #404040, #2d2d2d);
    font-size: 12px;
    padding: 12px 8px;
}

.bill-details-table-container .bills-table td {
    padding: 10px 8px;
    font-size: 13px;
}

/* Notification Styles */
.error-notification,
.success-notification {
    animation: slideInRight 0.3s ease-out;
}

@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(100px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Responsive Improvements */
@media (max-width: 1024px) {
    .bills-table {
        font-size: 13px;
    }
    
    .bills-table th,
    .bills-table td {
        padding: 8px 6px;
    }
    
    .action-buttons {
        flex-direction: column;
        gap: 3px;
    }
    
    .action-btn {
        min-width: 30px;
        height: 30px;
        font-size: 12px;
    }
}

@media (max-width: 768px) {
    .logo-section {
        flex-direction: column;
        text-align: center;
    }
    
    .logo-placeholder {
        margin-right: 0;
        margin-bottom: 10px;
    }
    
    .bills-table-container {
        overflow-x: auto;
    }
    
    .bills-table {
        min-width: 700px;
    }
    
    .bill-summary-header {
        flex-direction: column;
        gap: 15px;
        text-align: center;
    }
    
    .modal-content {
        width: 95%;
        margin: 5% auto;
    }
}

/* Print Styles */
@media print {
    .sidebar,
    .action-buttons,
    .refresh-btn {
        display: none !important;
    }
    
    .main-content {
        margin-left: 0;
    }
    
    .bills-table {
        border: 1px solid #000;
    }
    
    .bills-table th,
    .bills-table td {
        border: 1px solid #000;
        color: #000;
    }
}
```

## Netlify Deployment Instructions

Here's a step-by-step guide to deploy your dashboard on Netlify:

### Step 1: Prepare Your Repository

1. Create a new repository on GitHub
2. Upload all the files we created above to your repository
3. Make sure your repository structure looks like this:

```
your-repo/
├── index.html
├── styles/
│   └── main.css
├── js/
│   ├── config.js
│   ├── main.js
│   └── billSummary.js
├── package.json
├── netlify.toml
├── .gitignore
└── README.md
```

### Step 2: Deploy to Netlify

```bash
git add .
git commit -m "Initial commit - Legphel Hotel POS Dashboard"
git push origin main
```

1. Go to [netlify.com](https://netlify.com) and sign up/login
2. Click "New site from Git"
3. Choose "GitHub" and authorize Netlify
4. Select your repository
5. Configure build settings:
   - **Branch to deploy**: `main`
   - **Build command**: Leave empty or use `echo "Static site"`
   - **Publish directory**: `.` (dot for root directory)
6. Click "Deploy site"

### Step 3: Configure Custom Domain (Optional)

1. In your Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter your domain name
4. Follow the DNS configuration instructions

### Step 4: Enable HTTPS and Security Headers

Netlify automatically provides HTTPS. The `netlify.toml` file we created includes security headers.

### Important Notes:

1. **CORS Issues**: Since your API is on `http://119.105.142:3800` and your frontend will be on Netlify's HTTPS domain, you might face CORS issues. Make sure your Node.js server has CORS properly configured:

```javascript
// Add this to your Node.js server
const cors = require('cors');
app.use(cors({
    origin: ['https://your-netlify-domain.netlify.app', 'http://localhost:3000'],
    credentials: true
}));
