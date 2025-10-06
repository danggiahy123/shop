// Laptop Screen Debug Script
class LaptopDebugger {
    constructor() {
        this.screenInfo = {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio,
            userAgent: navigator.userAgent
        };
        this.init();
    }

    init() {
        this.createDebugPanel();
        this.detectScreenIssues();
        this.applyFixes();
        this.setupResizeListener();
        console.log('🔧 Laptop Debugger initialized');
    }

    createDebugPanel() {
        const panel = document.createElement('div');
        panel.id = 'laptop-debug-panel';
        panel.innerHTML = `
            <div class="debug-header">
                <h4>🔧 Laptop Debug</h4>
                <button onclick="this.parentElement.parentElement.style.display='none'">×</button>
            </div>
            <div class="debug-content">
                <div class="debug-item">
                    <strong>Screen:</strong> ${this.screenInfo.width} × ${this.screenInfo.height}
                </div>
                <div class="debug-item">
                    <strong>DPR:</strong> ${this.screenInfo.devicePixelRatio}
                </div>
                <div class="debug-item">
                    <strong>Type:</strong> <span id="screen-type">Detecting...</span>
                </div>
                <div class="debug-item">
                    <strong>Issues:</strong> <span id="screen-issues">None</span>
                </div>
                <div class="debug-item">
                    <strong>Fixes:</strong> <span id="applied-fixes">None</span>
                </div>
            </div>
        `;
        
        panel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 15px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 12px;
            z-index: 10000;
            max-width: 300px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        `;
        
        document.body.appendChild(panel);
        
        // Style the debug panel
        const style = document.createElement('style');
        style.textContent = `
            .debug-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
                border-bottom: 1px solid #333;
                padding-bottom: 5px;
            }
            
            .debug-header h4 {
                margin: 0;
                font-size: 14px;
            }
            
            .debug-header button {
                background: none;
                border: none;
                color: white;
                font-size: 16px;
                cursor: pointer;
                padding: 0;
                width: 20px;
                height: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .debug-content {
                display: flex;
                flex-direction: column;
                gap: 5px;
            }
            
            .debug-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .debug-item span {
                color: #4ade80;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }

    detectScreenIssues() {
        const issues = [];
        const screenType = this.getScreenType();
        
        // Update screen type
        const screenTypeElement = document.getElementById('screen-type');
        if (screenTypeElement) {
            screenTypeElement.textContent = screenType;
        }
        
        // Detect common laptop issues
        if (this.screenInfo.width >= 1024 && this.screenInfo.width <= 1440) {
            if (this.screenInfo.height < 800) {
                issues.push('Low height resolution');
            }
            if (this.screenInfo.devicePixelRatio > 1) {
                issues.push('High DPI scaling');
            }
        }
        
        // Check for layout issues
        const sidebar = document.querySelector('.sidebar');
        const mainContent = document.querySelector('.main-content');
        
        if (sidebar && mainContent) {
            const sidebarRect = sidebar.getBoundingClientRect();
            const mainRect = mainContent.getBoundingClientRect();
            
            if (mainRect.left < sidebarRect.right) {
                issues.push('Content overlap');
            }
        }
        
        // Check for overflow issues
        const body = document.body;
        if (body.scrollWidth > window.innerWidth) {
            issues.push('Horizontal overflow');
        }
        
        // Update issues display
        const issuesElement = document.getElementById('screen-issues');
        if (issuesElement) {
            issuesElement.textContent = issues.length > 0 ? issues.join(', ') : 'None';
            issuesElement.style.color = issues.length > 0 ? '#f87171' : '#4ade80';
        }
        
        return issues;
    }

    getScreenType() {
        const width = this.screenInfo.width;
        const height = this.screenInfo.height;
        
        if (width <= 480) return 'Mobile';
        if (width <= 768) return 'Tablet';
        if (width <= 1024) return 'Small Laptop';
        if (width <= 1440) return 'Laptop';
        if (width <= 1920) return 'Desktop';
        return 'Large Desktop';
    }

    applyFixes() {
        const fixes = [];
        
        // Fix 1: Ensure proper sidebar positioning
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            sidebar.style.position = 'fixed';
            sidebar.style.top = '0';
            sidebar.style.left = '0';
            sidebar.style.height = '100vh';
            sidebar.style.zIndex = '1000';
            fixes.push('Sidebar positioning');
        }
        
        // Fix 2: Ensure proper main content margin
        const mainContent = document.querySelector('.main-content');
        if (mainContent && window.innerWidth >= 768) {
            mainContent.style.marginLeft = '280px';
            mainContent.style.minHeight = '100vh';
            fixes.push('Main content margin');
        }
        
        // Fix 3: Ensure proper content width
        const content = document.querySelector('.content');
        if (content) {
            content.style.maxWidth = '1200px';
            content.style.margin = '0 auto';
            content.style.width = '100%';
            fixes.push('Content width');
        }
        
        // Fix 4: Fix header positioning
        const header = document.querySelector('.header');
        if (header) {
            header.style.position = 'sticky';
            header.style.top = '0';
            header.style.zIndex = '100';
            fixes.push('Header positioning');
        }
        
        // Fix 5: Ensure proper grid layouts
        const featuresGrid = document.querySelector('.features-grid');
        if (featuresGrid && window.innerWidth >= 1024) {
            featuresGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            fixes.push('Features grid');
        }
        
        const statsGrid = document.querySelector('.stats-grid');
        if (statsGrid && window.innerWidth >= 1024) {
            statsGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            fixes.push('Stats grid');
        }
        
        // Update fixes display
        const fixesElement = document.getElementById('applied-fixes');
        if (fixesElement) {
            fixesElement.textContent = fixes.join(', ');
            fixesElement.style.color = '#4ade80';
        }
        
        return fixes;
    }

    setupResizeListener() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.screenInfo.width = window.innerWidth;
                this.screenInfo.height = window.innerHeight;
                this.detectScreenIssues();
                this.applyFixes();
            }, 250);
        });
    }

    // Public methods
    showDebugPanel() {
        const panel = document.getElementById('laptop-debug-panel');
        if (panel) {
            panel.style.display = 'block';
        }
    }

    hideDebugPanel() {
        const panel = document.getElementById('laptop-debug-panel');
        if (panel) {
            panel.style.display = 'none';
        }
    }

    refresh() {
        this.detectScreenIssues();
        this.applyFixes();
    }
}

// Initialize debugger
let laptopDebugger;

document.addEventListener('DOMContentLoaded', () => {
    laptopDebugger = new LaptopDebugger();
    window.laptopDebugger = laptopDebugger;
    
    // Auto-hide debug panel after 10 seconds
    setTimeout(() => {
        const panel = document.getElementById('laptop-debug-panel');
        if (panel) {
            panel.style.opacity = '0.7';
        }
    }, 10000);
});

// Global functions
function showLaptopDebug() {
    if (laptopDebugger) {
        laptopDebugger.showDebugPanel();
    }
}

function hideLaptopDebug() {
    if (laptopDebugger) {
        laptopDebugger.hideDebugPanel();
    }
}

function refreshLaptopDebug() {
    if (laptopDebugger) {
        laptopDebugger.refresh();
    }
}

