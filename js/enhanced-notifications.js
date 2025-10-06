// Enhanced Notification System
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.maxNotifications = 5;
        this.defaultDuration = 5000;
        this.stack = null;
        this.init();
    }

    init() {
        // Create notification stack container
        this.stack = document.createElement('div');
        this.stack.className = 'notification-stack';
        document.body.appendChild(this.stack);
        
        console.log('🔔 Enhanced Notification System initialized');
    }

    show(message, type = 'info', options = {}) {
        const {
            title = this.getDefaultTitle(type),
            duration = this.defaultDuration,
            persistent = false,
            actions = [],
            progress = false
        } = options;

        // Remove oldest notification if at max
        if (this.notifications.length >= this.maxNotifications) {
            this.removeOldest();
        }

        const notification = this.createNotification(message, type, title, actions, progress);
        this.stack.appendChild(notification);
        this.notifications.push(notification);

        // Show animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto-hide if not persistent
        if (!persistent && duration > 0) {
            this.autoHide(notification, duration);
        }

        // Add click to close
        notification.addEventListener('click', () => {
            this.hide(notification);
        });

        console.log(`🔔 Notification shown: ${type} - ${message}`);
        return notification;
    }

    createNotification(message, type, title, actions, progress) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icon = this.getIcon(type);
        const closeBtn = this.createCloseButton();
        
        notification.innerHTML = `
            <div class="notification-icon">${icon}</div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
                ${actions.length > 0 ? this.createActions(actions) : ''}
            </div>
            ${closeBtn}
            ${progress ? '<div class="notification-progress"></div>' : ''}
        `;

        return notification;
    }

    createCloseButton() {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'notification-close';
        closeBtn.innerHTML = '×';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.hide(e.target.closest('.notification'));
        });
        return closeBtn.outerHTML;
    }

    createActions(actions) {
        const actionsHtml = actions.map(action => 
            `<button class="notification-action" onclick="${action.handler}">${action.text}</button>`
        ).join('');
        return `<div class="notification-actions">${actionsHtml}</div>`;
    }

    getIcon(type) {
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ',
            progress: '⟳'
        };
        return icons[type] || icons.info;
    }

    getDefaultTitle(type) {
        const titles = {
            success: 'Thành công',
            error: 'Lỗi',
            warning: 'Cảnh báo',
            info: 'Thông tin',
            progress: 'Đang xử lý'
        };
        return titles[type] || titles.info;
    }

    hide(notification) {
        if (!notification) return;
        
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 500);
    }

    removeOldest() {
        if (this.notifications.length > 0) {
            this.hide(this.notifications[0]);
        }
    }

    autoHide(notification, duration) {
        if (notification.querySelector('.notification-progress')) {
            const progressBar = notification.querySelector('.notification-progress');
            progressBar.style.width = '100%';
            progressBar.style.transition = `width ${duration}ms linear`;
            progressBar.style.width = '0%';
        }
        
        setTimeout(() => {
            this.hide(notification);
        }, duration);
    }

    clear() {
        this.notifications.forEach(notification => {
            this.hide(notification);
        });
    }

    // Convenience methods
    success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    error(message, options = {}) {
        return this.show(message, 'error', { ...options, duration: 8000 });
    }

    warning(message, options = {}) {
        return this.show(message, 'warning', { ...options, duration: 6000 });
    }

    info(message, options = {}) {
        return this.show(message, 'info', options);
    }

    progress(message, options = {}) {
        return this.show(message, 'progress', { ...options, progress: true, persistent: true });
    }
}

// Global notification manager
let notificationManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    notificationManager = new NotificationManager();
    
    // Add CSS for notification actions
    const style = document.createElement('style');
    style.textContent = `
        .notification-actions {
            margin-top: 8px;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
        }
        
        .notification-action {
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .notification-action:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-1px);
        }
    `;
    document.head.appendChild(style);
    
    console.log('🔔 Notification system ready');
});

// Global functions for easy access
function showNotification(message, type = 'info', options = {}) {
    if (notificationManager) {
        return notificationManager.show(message, type, options);
    }
}

function showSuccess(message, options = {}) {
    if (notificationManager) {
        return notificationManager.success(message, options);
    }
}

function showError(message, options = {}) {
    if (notificationManager) {
        return notificationManager.error(message, options);
    }
}

function showWarning(message, options = {}) {
    if (notificationManager) {
        return notificationManager.warning(message, options);
    }
}

function showInfo(message, options = {}) {
    if (notificationManager) {
        return notificationManager.info(message, options);
    }
}

function showProgress(message, options = {}) {
    if (notificationManager) {
        return notificationManager.progress(message, options);
    }
}

function clearNotifications() {
    if (notificationManager) {
        notificationManager.clear();
    }
}


