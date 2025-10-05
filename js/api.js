// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// API Manager for backend communication
class APIManager {
    constructor() {
        this.token = localStorage.getItem('authToken');
        console.log('🔍 APIManager initialized with token:', this.token ? 'Token found' : 'No token');
        console.log('🔍 Token value:', this.token);
    }

    // Set authentication token
    setToken(token) {
        console.log('🔑 Setting token:', token ? 'Token received' : 'No token');
        this.token = token;
        if (token) {
            localStorage.setItem('authToken', token);
            console.log('💾 Token saved to localStorage');
        } else {
            localStorage.removeItem('authToken');
            console.log('🗑️ Token removed from localStorage');
        }
    }

    // Get headers with auth token
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: this.getHeaders(),
            ...options
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'API request failed');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication methods
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    }

    async login(username, password) {
        console.log('🔐 Attempting login for:', username);
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        
        console.log('🔑 Login response:', response);
        
        if (response.token) {
            console.log('💾 Saving token to localStorage');
            this.setToken(response.token);
        } else {
            console.error('❌ No token in login response');
        }
        
        return response;
    }

    async logout() {
        try {
            await this.request('/auth/logout', { method: 'POST' });
        } finally {
            this.setToken(null);
        }
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    async updateProfile(profileData) {
        return this.request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async changePassword(currentPassword, newPassword) {
        return this.request('/auth/change-password', {
            method: 'POST',
            body: JSON.stringify({ currentPassword, newPassword })
        });
    }

    // Product methods
    async getProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/products${queryString ? `?${queryString}` : ''}`);
    }

    async getProduct(id) {
        return this.request(`/products/${id}`);
    }

    async getFeaturedProducts() {
        return this.request('/products/featured');
    }

    async getHotProducts() {
        return this.request('/products/hot');
    }

    async getCategories() {
        return this.request('/products/categories');
    }

    async addProductReview(productId, rating, comment) {
        return this.request(`/products/${productId}/reviews`, {
            method: 'POST',
            body: JSON.stringify({ rating, comment })
        });
    }

    // Admin product methods
    async getAdminProducts(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/admin/products${queryString ? `?${queryString}` : ''}`);
    }

    async createProduct(productData) {
        return this.request('/admin/products', {
            method: 'POST',
            body: JSON.stringify(productData)
        });
    }

    async updateProduct(id, productData) {
        return this.request(`/admin/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    }

    async deleteProduct(id) {
        return this.request(`/admin/products/${id}`, {
            method: 'DELETE'
        });
    }

    async updateProductStatus(id, status, note) {
        return this.request(`/admin/products/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, note })
        });
    }

    async toggleProductFeatured(id) {
        return this.request(`/admin/products/${id}/featured`, {
            method: 'PUT'
        });
    }

    // Order methods
    async createOrder(orderData) {
        return this.request('/orders', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    }

    async getOrders(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/orders${queryString ? `?${queryString}` : ''}`);
    }

    async getOrder(id) {
        return this.request(`/orders/${id}`);
    }

    async cancelOrder(id, reason) {
        return this.request(`/orders/${id}/cancel`, {
            method: 'PUT',
            body: JSON.stringify({ reason })
        });
    }

    // Admin order methods
    async getAllOrders(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/orders/admin/all${queryString ? `?${queryString}` : ''}`);
    }

    async updateOrderStatus(id, status, note) {
        return this.request(`/orders/admin/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status, note })
        });
    }

    // User methods
    async getUserProfile() {
        return this.request('/users/profile');
    }

    async updateUserProfile(profileData) {
        return this.request('/users/profile', {
            method: 'PUT',
            body: JSON.stringify(profileData)
        });
    }

    async getUserOrders(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/users/orders${queryString ? `?${queryString}` : ''}`);
    }

    async getUserDashboard() {
        return this.request('/users/dashboard');
    }

    // Admin user methods
    async getAllUsers(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        return this.request(`/users/admin/all${queryString ? `?${queryString}` : ''}`);
    }

    async updateUserRole(id, role) {
        return this.request(`/users/admin/${id}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role })
        });
    }

    async updateUserStatus(id, isActive) {
        return this.request(`/users/admin/${id}/status`, {
            method: 'PUT',
            body: JSON.stringify({ isActive })
        });
    }

    async deleteUser(id) {
        return this.request(`/users/admin/${id}`, {
            method: 'DELETE'
        });
    }
}

// Global API instance
const api = new APIManager();

// Check if user is logged in on page load
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🔍 Checking authentication status...');
    console.log('🔍 Current token:', api.token);
    console.log('🔍 localStorage token:', localStorage.getItem('authToken'));
    
    if (api.token) {
        console.log('🔑 Token found, validating...');
        try {
            const response = await api.getCurrentUser();
            console.log('🔍 getCurrentUser response:', response);
            if (response.user) {
                console.log('✅ User authenticated:', response.user.email);
                // UI is now handled by right sidebar
                return; // Don't show auth buttons
            }
        } catch (error) {
            console.error('❌ Token validation failed:', error);
            api.setToken(null);
        }
    } else {
        console.log('❌ No token found');
        // Auth buttons are now handled by right sidebar
    }
});






// Load user statistics
async function loadUserStats() {
    try {
        const response = await api.getUserDashboard();
        if (response.stats) {
            const ordersCount = document.getElementById('userOrdersCount');
            const totalSpent = document.getElementById('userTotalSpent');
            
            if (ordersCount) {
                ordersCount.textContent = response.stats.totalOrders || 0;
            }
            
            if (totalSpent) {
                const amount = response.stats.totalSpent || 0;
                totalSpent.textContent = formatCurrency(amount);
            }
        }
    } catch (error) {
        console.error('Failed to load user stats:', error);
        // Set default values
        const ordersCount = document.getElementById('userOrdersCount');
        const totalSpent = document.getElementById('userTotalSpent');
        
        if (ordersCount) ordersCount.textContent = '0';
        if (totalSpent) totalSpent.textContent = '0đ';
    }
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}





    async handleRegister(e) {
        const formData = new FormData(e.target);
        const userData = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            password: formData.get('password'),
            company: formData.get('company')
        };

        // Validation
        if (!userData.firstName || !userData.lastName || !userData.email || 
            !userData.phone || !userData.password) {
            this.showNotification('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }

        if (!this.validateEmail(document.getElementById('registerEmail'))) {
            return;
        }

        if (!this.validatePhone(document.getElementById('phone'))) {
            return;
        }

        if (!this.validatePasswordMatch(
            document.getElementById('registerPassword'),
            document.getElementById('confirmPassword')
        )) {
            return;
        }

        if (!document.getElementById('agreeTerms').checked) {
            this.showNotification('Vui lòng đồng ý với điều khoản sử dụng', 'error');
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector('.auth-btn');
        this.setLoadingState(submitBtn, true);

        try {
            const response = await this.api.register(userData);
            console.log('✅ Register successful:', response.user.email);
            console.log('🔑 Register token:', response.token ? 'Token received' : 'No token');
            
            this.showNotification('Đăng ký thành công! Chào mừng bạn đến với Waterdg!', 'success');
            
            // Auto login after registration
            setTimeout(async () => {
                try {
                    console.log('🔄 Auto-login after registration...');
                    const loginResponse = await this.api.login(userData.email, userData.password);
                    console.log('✅ Auto-login successful:', loginResponse.user.email);
                    console.log('🔑 Auto-login token:', loginResponse.token ? 'Token received' : 'No token');
                    console.log('🔍 Token before updateUI:', api.token);
                    console.log('🔍 localStorage before updateUI:', localStorage.getItem('authToken'));
                    // UI is now handled by right sidebar
                    showSection('home');
                } catch (loginError) {
                    console.error('❌ Auto-login failed:', loginError);
                    showSection('login');
                }
            }, 1500);
            
        } catch (error) {
            this.showNotification(error.message || 'Đăng ký thất bại', 'error');
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

// Handle logout with UI update
async function handleLogout() {
    console.log('🚪 Logging out user...');
    
    try {
        await api.logout();
        console.log('✅ Logout API call successful');
        showNotification('Đăng xuất thành công!', 'success');
        
        // Auth buttons are now handled by right sidebar
        
        // Redirect to home
        setTimeout(() => {
            showSection('home');
        }, 1000);
        
    } catch (error) {
        console.error('❌ Logout error:', error);
        showNotification('Đăng xuất thành công!', 'success');
        
        // Auth buttons are now handled by right sidebar
        setTimeout(() => {
            showSection('home');
        }, 1000);
    }
}

// Show notification function
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 400px;
    `;

    document.body.appendChild(notification);

    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || '#3b82f6';
}

// Debug function to check auth state
function debugAuthState() {
    console.log('🔍 Debug Auth State:');
    console.log('- Token exists:', !!api.token);
    console.log('- Token value:', api.token ? api.token.substring(0, 20) + '...' : 'null');
    console.log('- User info element:', !!document.querySelector('.user-info'));
    console.log('- Auth buttons element:', !!document.querySelector('.auth-buttons'));
    console.log('- Current section:', document.querySelector('.content-section.active')?.id);
}

// Add debug function to window for console access
window.debugAuthState = debugAuthState;

// Handle purchase with role-based logic
function handlePurchase(productId, productName, price) {
    console.log(`🛒 Purchase attempt: ${productName} - ${price} VNĐ`);
    
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    
    if (!token || !userData.firstName) {
        // User not logged in - show login requirement
        showLoginRequiredModal(productName, price);
        return;
    }
    
    // User is logged in - proceed with purchase
    proceedWithPurchase(productId, productName, price, userData);
}

// Show modal requiring login
function showLoginRequiredModal(productName, price) {
    // Create modal HTML
    const modalHTML = `
        <div class="modal-overlay" id="loginRequiredModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-lock"></i> Đăng nhập để mua hàng</h3>
                    <button class="modal-close" onclick="closeModal('loginRequiredModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="login-required-content">
                        <div class="product-info">
                            <h4>${productName}</h4>
                            <div class="product-price">${formatPrice(price)}</div>
                        </div>
                        <div class="login-message">
                            <i class="fas fa-info-circle"></i>
                            <p>Bạn cần đăng nhập để có thể mua sản phẩm này.</p>
                        </div>
                        <div class="login-actions">
                            <button class="btn btn-primary" onclick="showSection('login'); closeModal('loginRequiredModal')">
                                <i class="fas fa-sign-in-alt"></i>
                                Đăng nhập ngay
                            </button>
                            <button class="btn btn-secondary" onclick="showSection('register'); closeModal('loginRequiredModal')">
                                <i class="fas fa-user-plus"></i>
                                Đăng ký tài khoản
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add click outside to close
    document.getElementById('loginRequiredModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal('loginRequiredModal');
        }
    });
}

// Proceed with purchase for logged in users
function proceedWithPurchase(productId, productName, price, userData) {
    // Create order data
    const orderData = {
        customer: userData._id || userData.id,
        items: [{
            product: productId,
            name: productName,
            price: price,
            quantity: 1
        }],
        total: price,
        status: 'pending',
        customerInfo: {
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email
        }
    };
    
    // Show purchase confirmation modal
    showPurchaseConfirmationModal(orderData);
}

// Show purchase confirmation modal
function showPurchaseConfirmationModal(orderData) {
    const product = orderData.items[0];
    
    const modalHTML = `
        <div class="modal-overlay" id="purchaseConfirmationModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-shopping-cart"></i> Xác nhận mua hàng</h3>
                    <button class="modal-close" onclick="closeModal('purchaseConfirmationModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="purchase-confirmation-content">
                        <div class="product-summary">
                            <h4>${product.name}</h4>
                            <div class="product-price">${formatPrice(product.price)}</div>
                        </div>
                        <div class="customer-info">
                            <h5>Thông tin khách hàng:</h5>
                            <p><strong>Tên:</strong> ${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName}</p>
                            <p><strong>Email:</strong> ${orderData.customerInfo.email}</p>
                        </div>
                        <div class="total-amount">
                            <h5>Tổng cộng: <span class="total-price">${formatPrice(orderData.total)}</span></h5>
                        </div>
                        <div class="purchase-actions">
                            <button class="btn btn-success" onclick="confirmPurchase('${JSON.stringify(orderData).replace(/"/g, '&quot;')}')">
                                <i class="fas fa-check"></i>
                                Xác nhận mua
                            </button>
                            <button class="btn btn-secondary" onclick="closeModal('purchaseConfirmationModal')">
                                <i class="fas fa-times"></i>
                                Hủy bỏ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add click outside to close
    document.getElementById('purchaseConfirmationModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal('purchaseConfirmationModal');
        }
    });
}

// Confirm purchase and create order
function confirmPurchase(orderDataString) {
    const orderData = JSON.parse(orderDataString.replace(/&quot;/g, '"'));
    
    console.log('🛒 Confirming purchase:', orderData);
    
    // Here you would typically send the order to your backend
    // For now, we'll just show a success message
    showPurchaseSuccessModal(orderData);
    
    // Close confirmation modal
    closeModal('purchaseConfirmationModal');
}

// Show purchase success modal
function showPurchaseSuccessModal(orderData) {
    const product = orderData.items[0];
    
    const modalHTML = `
        <div class="modal-overlay" id="purchaseSuccessModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h3><i class="fas fa-check-circle"></i> Mua hàng thành công!</h3>
                    <button class="modal-close" onclick="closeModal('purchaseSuccessModal')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="purchase-success-content">
                        <div class="success-icon">
                            <i class="fas fa-check-circle"></i>
                        </div>
                        <h4>Cảm ơn bạn đã mua hàng!</h4>
                        <div class="order-details">
                            <p><strong>Sản phẩm:</strong> ${product.name}</p>
                            <p><strong>Giá:</strong> ${formatPrice(product.price)}</p>
                            <p><strong>Trạng thái:</strong> <span class="status-pending">Đang xử lý</span></p>
                        </div>
                        <div class="next-steps">
                            <p>Chúng tôi sẽ liên hệ với bạn trong vòng 24 giờ để xác nhận đơn hàng và hướng dẫn thanh toán.</p>
                        </div>
                        <div class="success-actions">
                            <button class="btn btn-primary" onclick="closeModal('purchaseSuccessModal')">
                                <i class="fas fa-home"></i>
                                Về trang chủ
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Add click outside to close
    document.getElementById('purchaseSuccessModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal('purchaseSuccessModal');
        }
    });
}

// Close modal
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
    }
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}


// Make functions globally available
window.handlePurchase = handlePurchase;
window.closeModal = closeModal;
window.confirmPurchase = confirmPurchase;
