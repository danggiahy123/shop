// Modern UI Framework
class ModernUI {
    constructor() {
        this.components = new Map();
        this.eventListeners = new Map();
        this.init();
    }

    init() {
        this.setupSidebar();
        this.setupModals();
        this.setupTooltips();
        this.setupDropdowns();
        this.setupAnimations();
        console.log('🎨 Modern UI Framework initialized');
    }

    // Sidebar Management
    setupSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const sidebarToggle = document.querySelector('.sidebar-toggle');
        const sidebarOverlay = document.querySelector('.sidebar-overlay');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.toggleSidebar();
            });
        }

        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

        // Close sidebar on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && sidebar?.classList.contains('open')) {
                this.closeSidebar();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeSidebar();
            }
        });
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar) {
            sidebar.classList.toggle('open');
            if (overlay) {
                overlay.classList.toggle('show');
            }
            document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
        }
    }

    closeSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.querySelector('.sidebar-overlay');
        
        if (sidebar) {
            sidebar.classList.remove('open');
            if (overlay) {
                overlay.classList.remove('show');
            }
            document.body.style.overflow = '';
        }
    }

    // Modal Management
    setupModals() {
        document.addEventListener('click', (e) => {
            if (e.target && typeof e.target.closest === 'function') {
                const modalTrigger = e.target.closest('[data-modal]');
                if (modalTrigger) {
                    e.preventDefault();
                    const modalId = modalTrigger.dataset.modal;
                    this.openModal(modalId);
                }

                const modalClose = e.target.closest('.modal-close, .modal-overlay');
                if (modalClose) {
                    const modal = modalClose.closest('.modal');
                    if (modal) {
                        this.closeModal(modal);
                    }
                }
            }
        });

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const openModal = document.querySelector('.modal.open');
                if (openModal) {
                    this.closeModal(openModal);
                }
            }
        });
    }

    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('open');
            document.body.style.overflow = 'hidden';
            
            // Focus first input
            const firstInput = modal.querySelector('input, textarea, select');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    closeModal(modal) {
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    // Tooltip Management
    setupTooltips() {
        document.addEventListener('mouseenter', (e) => {
            if (e.target && typeof e.target.closest === 'function') {
                const tooltipTrigger = e.target.closest('[data-tooltip]');
                if (tooltipTrigger) {
                    this.showTooltip(tooltipTrigger);
                }
            }
        }, true);

        document.addEventListener('mouseleave', (e) => {
            if (e.target && typeof e.target.closest === 'function') {
                const tooltipTrigger = e.target.closest('[data-tooltip]');
                if (tooltipTrigger) {
                    this.hideTooltip();
                }
            }
        }, true);
    }

    showTooltip(element) {
        const text = element.dataset.tooltip;
        const position = element.dataset.tooltipPosition || 'top';
        
        const tooltip = document.createElement('div');
        tooltip.className = `tooltip tooltip-${position}`;
        tooltip.textContent = text;
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let top, left;
        
        switch (position) {
            case 'top':
                top = rect.top - tooltipRect.height - 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = rect.bottom + 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.left - tooltipRect.width - 8;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.right + 8;
                break;
        }
        
        tooltip.style.top = `${top}px`;
        tooltip.style.left = `${left}px`;
        
        setTimeout(() => tooltip.classList.add('show'), 10);
    }

    hideTooltip() {
        const tooltip = document.querySelector('.tooltip');
        if (tooltip) {
            tooltip.classList.remove('show');
            setTimeout(() => tooltip.remove(), 200);
        }
    }

    // Dropdown Management
    setupDropdowns() {
        document.addEventListener('click', (e) => {
            const dropdownToggle = e.target.closest('.dropdown-toggle');
            if (dropdownToggle) {
                e.preventDefault();
                const dropdown = dropdownToggle.closest('.dropdown');
                this.toggleDropdown(dropdown);
            }

            // Close dropdown when clicking outside
            if (!e.target.closest('.dropdown')) {
                this.closeAllDropdowns();
            }
        });
    }

    toggleDropdown(dropdown) {
        const isOpen = dropdown.classList.contains('open');
        this.closeAllDropdowns();
        
        if (!isOpen) {
            dropdown.classList.add('open');
        }
    }

    closeAllDropdowns() {
        document.querySelectorAll('.dropdown.open').forEach(dropdown => {
            dropdown.classList.remove('open');
        });
    }

    // Animation Management
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements with animation classes
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    // Toast Notifications
    showToast(message, type = 'info', duration = 5000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    ${this.getToastIcon(type)}
                </div>
                <div class="toast-message">${message}</div>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 200);
            }, duration);
        }
    }

    getToastIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-circle"></i>',
            warning: '<i class="fas fa-exclamation-triangle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        return icons[type] || icons.info;
    }

    // Loading States
    setLoading(element, loading = true) {
        if (loading) {
            element.classList.add('loading');
            element.disabled = true;
        } else {
            element.classList.remove('loading');
            element.disabled = false;
        }
    }

    // Form Validation
    validateForm(form) {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.showFieldError(input, 'Trường này là bắt buộc');
                isValid = false;
            } else {
                this.clearFieldError(input);
            }
        });

        return isValid;
    }

    showFieldError(input, message) {
        this.clearFieldError(input);
        
        const error = document.createElement('div');
        error.className = 'field-error';
        error.textContent = message;
        
        input.classList.add('error');
        input.parentNode.appendChild(error);
    }

    clearFieldError(input) {
        input.classList.remove('error');
        const error = input.parentNode.querySelector('.field-error');
        if (error) {
            error.remove();
        }
    }

    // Utility Methods
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Component Registration
    registerComponent(name, component) {
        this.components.set(name, component);
    }

    getComponent(name) {
        return this.components.get(name);
    }
}

// Global UI instance
let modernUI;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    modernUI = new ModernUI();
    window.modernUI = modernUI;
    
    // Add CSS for components
    const style = document.createElement('style');
    style.textContent = `
        /* Modal Styles */
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(4px);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1050;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .modal.open {
            opacity: 1;
            visibility: visible;
        }
        
        .modal-content {
            background: white;
            border-radius: 1rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        }
        
        .modal.open .modal-content {
            transform: scale(1);
        }
        
        .modal-header {
            padding: 1.5rem;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .modal-title {
            font-size: 1.25rem;
            font-weight: 600;
            color: #111827;
        }
        
        .modal-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            color: #6b7280;
            cursor: pointer;
            padding: 0.5rem;
            border-radius: 0.5rem;
            transition: all 0.2s ease;
        }
        
        .modal-close:hover {
            background: #f3f4f6;
            color: #374151;
        }
        
        .modal-body {
            padding: 1.5rem;
        }
        
        .modal-footer {
            padding: 1.5rem;
            border-top: 1px solid #e5e7eb;
            display: flex;
            gap: 0.75rem;
            justify-content: flex-end;
        }
        
        /* Tooltip Styles */
        .tooltip {
            position: absolute;
            background: #1f2937;
            color: white;
            padding: 0.5rem 0.75rem;
            border-radius: 0.5rem;
            font-size: 0.875rem;
            font-weight: 500;
            z-index: 1070;
            opacity: 0;
            transform: translateY(4px);
            transition: all 0.2s ease;
            pointer-events: none;
        }
        
        .tooltip.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        .tooltip::before {
            content: '';
            position: absolute;
            width: 0;
            height: 0;
            border: 4px solid transparent;
        }
        
        .tooltip-top::before {
            bottom: -8px;
            left: 50%;
            transform: translateX(-50%);
            border-top-color: #1f2937;
        }
        
        .tooltip-bottom::before {
            top: -8px;
            left: 50%;
            transform: translateX(-50%);
            border-bottom-color: #1f2937;
        }
        
        .tooltip-left::before {
            right: -8px;
            top: 50%;
            transform: translateY(-50%);
            border-left-color: #1f2937;
        }
        
        .tooltip-right::before {
            left: -8px;
            top: 50%;
            transform: translateY(-50%);
            border-right-color: #1f2937;
        }
        
        /* Dropdown Styles */
        .dropdown {
            position: relative;
            display: inline-block;
        }
        
        .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            min-width: 200px;
            z-index: 1000;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-8px);
            transition: all 0.2s ease;
        }
        
        .dropdown.open .dropdown-menu {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .dropdown-item {
            display: block;
            padding: 0.75rem 1rem;
            color: #374151;
            text-decoration: none;
            transition: background-color 0.2s ease;
        }
        
        .dropdown-item:hover {
            background: #f9fafb;
        }
        
        /* Toast Styles */
        .toast {
            position: fixed;
            top: 1rem;
            right: 1rem;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 0.75rem;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 1080;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 400px;
        }
        
        .toast.show {
            opacity: 1;
            transform: translateX(0);
        }
        
        .toast-content {
            display: flex;
            align-items: center;
            gap: 0.75rem;
            padding: 1rem;
        }
        
        .toast-icon {
            font-size: 1.25rem;
        }
        
        .toast-success .toast-icon { color: #10b981; }
        .toast-error .toast-icon { color: #ef4444; }
        .toast-warning .toast-icon { color: #f59e0b; }
        .toast-info .toast-icon { color: #3b82f6; }
        
        .toast-message {
            flex: 1;
            font-size: 0.875rem;
            font-weight: 500;
            color: #374151;
        }
        
        .toast-close {
            background: none;
            border: none;
            color: #9ca3af;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 0.25rem;
            transition: all 0.2s ease;
        }
        
        .toast-close:hover {
            background: #f3f4f6;
            color: #374151;
        }
        
        /* Field Error Styles */
        .field-error {
            color: #ef4444;
            font-size: 0.75rem;
            font-weight: 500;
            margin-top: 0.25rem;
        }
        
        .form-input.error {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        /* Animation Classes */
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s ease;
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);
    
    console.log('🎨 Modern UI components ready');
});

// Global utility functions
function showToast(message, type = 'info', duration = 5000) {
    if (modernUI) {
        modernUI.showToast(message, type, duration);
    }
}

function toggleSidebar() {
    if (modernUI) {
        modernUI.toggleSidebar();
    }
}

function closeSidebar() {
    if (modernUI) {
        modernUI.closeSidebar();
    }
}

