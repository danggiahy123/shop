// Socket.IO Client Manager
class SocketManager {
    constructor() {
        this.socket = null;
        this.connected = false;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.listeners = new Map();
    }

    connect() {
        try {
            this.socket = io('http://localhost:5000', {
                transports: ['websocket', 'polling'],
                timeout: 5000,
                forceNew: true
            });

            this.setupEventListeners();
            console.log('🔌 Socket.IO connecting...');
        } catch (error) {
            console.error('❌ Socket.IO connection failed:', error);
        }
    }

    setupEventListeners() {
        this.socket.on('connect', () => {
            this.connected = true;
            this.reconnectAttempts = 0;
            console.log('✅ Socket.IO connected:', this.socket.id);
            
            // Authenticate if user is logged in
            const token = localStorage.getItem('authToken');
            if (token) {
                this.authenticate(token);
            }
            
            // Request notifications
            this.socket.emit('request_notifications');
            
            // Show connection notification
            if (window.showSuccess) {
                showSuccess('Kết nối real-time thành công!', { duration: 3000 });
            }
        });

        this.socket.on('disconnect', (reason) => {
            this.connected = false;
            console.log('🔌 Socket.IO disconnected:', reason);
            
            if (reason === 'io server disconnect') {
                // Server disconnected, try to reconnect
                this.handleReconnect();
            }
        });

        this.socket.on('connect_error', (error) => {
            console.error('❌ Socket.IO connection error:', error);
            this.handleReconnect();
        });

        // Real-time notifications
        this.socket.on('notification', (data) => {
            console.log('🔔 Real-time notification:', data);
            this.handleNotification(data);
        });

        // Order updates
        this.socket.on('order_update', (data) => {
            console.log('📦 Order update:', data);
            this.handleOrderUpdate(data);
        });

        // Product updates
        this.socket.on('product_update', (data) => {
            console.log('🛍️ Product update:', data);
            this.handleProductUpdate(data);
        });

        // User status updates
        this.socket.on('user_status', (data) => {
            console.log('👤 User status update:', data);
            this.handleUserStatusUpdate(data);
        });
    }

    authenticate(token) {
        if (this.socket && this.connected) {
            this.socket.emit('authenticate', token);
            console.log('🔐 Socket authentication sent');
        }
    }

    handleReconnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
            
            console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
            
            setTimeout(() => {
                this.connect();
            }, delay);
        } else {
            console.error('❌ Max reconnection attempts reached');
            if (window.showError) {
                showError('Mất kết nối real-time. Vui lòng refresh trang.', { duration: 8000 });
            }
        }
    }

    handleNotification(data) {
        const { type, title, message, actions, persistent } = data;
        
        if (window.showNotification) {
            showNotification(message, type, {
                title,
                actions,
                persistent,
                duration: persistent ? 0 : 5000
            });
        }
    }

    handleOrderUpdate(data) {
        const { orderId, status, message } = data;
        
        if (window.showInfo) {
            showInfo(`Đơn hàng #${orderId}: ${message}`, {
                title: 'Cập nhật đơn hàng',
                actions: [
                    {
                        text: 'Xem chi tiết',
                        handler: `window.location.href = '/orders/${orderId}'`
                    }
                ]
            });
        }
    }

    handleProductUpdate(data) {
        const { productId, action, message } = data;
        
        if (window.showInfo) {
            showInfo(message, {
                title: 'Cập nhật sản phẩm',
                duration: 4000
            });
        }
    }

    handleUserStatusUpdate(data) {
        const { userId, status, message } = data;
        
        if (window.showInfo) {
            showInfo(message, {
                title: 'Thông báo hệ thống',
                duration: 4000
            });
        }
    }

    // Public methods
    emit(event, data) {
        if (this.socket && this.connected) {
            this.socket.emit(event, data);
        } else {
            console.warn('⚠️ Socket not connected, cannot emit:', event);
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
            this.listeners.set(event, callback);
        }
    }

    off(event) {
        if (this.socket && this.listeners.has(event)) {
            this.socket.off(event, this.listeners.get(event));
            this.listeners.delete(event);
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.connected = false;
            console.log('🔌 Socket.IO disconnected manually');
        }
    }

    isConnected() {
        return this.connected && this.socket && this.socket.connected;
    }

    // Utility methods
    sendNotification(type, title, message, options = {}) {
        this.emit('send_notification', {
            type,
            title,
            message,
            ...options
        });
    }

    requestOrderUpdates() {
        this.emit('request_order_updates');
    }

    requestProductUpdates() {
        this.emit('request_product_updates');
    }
}

// Global socket manager
let socketManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if Socket.IO is available
    if (typeof io !== 'undefined') {
        socketManager = new SocketManager();
        socketManager.connect();
        
        // Make it globally available
        window.socketManager = socketManager;
        
        console.log('🔌 Socket Manager initialized');
    } else {
        console.warn('⚠️ Socket.IO not loaded, real-time features disabled');
    }
});

// Global functions for easy access
function emitSocketEvent(event, data) {
    if (socketManager) {
        socketManager.emit(event, data);
    }
}

function sendSocketNotification(type, title, message, options = {}) {
    if (socketManager) {
        socketManager.sendNotification(type, title, message, options);
    }
}

function isSocketConnected() {
    return socketManager ? socketManager.isConnected() : false;
}

