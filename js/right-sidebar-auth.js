// Right Sidebar Authentication System
class RightSidebarAuth {
    constructor() {
        console.log('🔧 RightSidebarAuth constructor called');
        this.isOpen = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        console.log('🔧 RightSidebarAuth init called');
        this.setupEventListeners();
        this.checkAuthStatus();
    }

    setupEventListeners() {
        console.log('🔧 Setting up event listeners...');
        
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            console.log('✅ Login form found');
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin(e);
            });
        } else {
            console.log('❌ Login form not found');
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            console.log('✅ Register form found');
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister(e);
            });
        } else {
            console.log('❌ Register form not found');
        }

        // Password toggle
        window.togglePassword = (inputId) => {
            const input = document.getElementById(inputId);
            const button = input.nextElementSibling;
            const icon = button.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        };
    }

    checkAuthStatus() {
        console.log('🔍 Checking auth status...');
        const token = localStorage.getItem('authToken');
        const userData = localStorage.getItem('userData');
        
        if (token && userData) {
            try {
                this.currentUser = JSON.parse(userData);
                console.log('👤 User already logged in:', this.currentUser.username);
                this.showUserProfile();
                this.updateHeaderButton();
            } catch (error) {
                console.error('❌ Error parsing user data:', error);
                this.clearAuthData();
            }
        } else {
            console.log('👤 No user logged in');
        }
    }

    async handleLogin(e) {
        const formData = new FormData(e.target);
        const username = formData.get('username');
        const password = formData.get('password');

        if (!username || !password) {
            this.showNotification('Vui lòng điền đầy đủ thông tin', 'error');
            return;
        }

        const submitBtn = e.target.querySelector('.auth-btn');
        this.setLoadingState(submitBtn, true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Login successful:', data.user.username);
                
                // Save auth data
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                this.currentUser = data.user;
                this.showNotification('Đăng nhập thành công!', 'success');
                this.showUserProfile();
                this.updateHeaderButton();
                
                // Close sidebar after delay
                setTimeout(() => {
                    this.closeSidebar();
                }, 1500);
                
            } else {
                const errorData = await response.json();
                this.showNotification(errorData.message || 'Đăng nhập thất bại', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            this.showNotification('Lỗi kết nối. Vui lòng thử lại.', 'error');
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    async handleRegister(e) {
        console.log('📝 handleRegister called');
        const formData = new FormData(e.target);
        const userData = {
            username: formData.get('username'),
            password: formData.get('password'),
            confirmPassword: formData.get('confirmPassword')
        };

        console.log('📋 User data:', userData);

        if (!userData.username || !userData.password || !userData.confirmPassword) {
            console.log('❌ Missing required fields');
            showWarning('Vui lòng điền đầy đủ thông tin', {
                title: 'Thiếu thông tin',
                duration: 4000
            });
            return;
        }

        if (userData.password !== userData.confirmPassword) {
            console.log('❌ Password mismatch');
            showError('Mật khẩu xác nhận không khớp', {
                title: 'Lỗi mật khẩu',
                duration: 4000
            });
            return;
        }

        const submitBtn = e.target.querySelector('.auth-btn');
        this.setLoadingState(submitBtn, true);

        try {
            console.log('📡 Sending register request...');
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            console.log('📊 Response status:', response.status);
            console.log('📊 Response ok:', response.ok);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Register successful:', data.user.username);
                
                // Save auth data
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('userData', JSON.stringify(data.user));
                
                this.currentUser = data.user;
                showSuccess('Đăng ký thành công! Chào mừng bạn đến với Waterdg!', {
                    title: 'Thành công',
                    duration: 3000,
                    actions: [
                        {
                            text: 'Khám phá',
                            handler: 'window.location.href = "#home"'
                        }
                    ]
                });
                this.showUserProfile();
                this.updateHeaderButton();
                
                // Close sidebar after delay
                setTimeout(() => {
                    this.closeSidebar();
                }, 2000);
                
            } else {
                const errorData = await response.json();
                console.log('❌ Register failed:', errorData);
                showError(errorData.message || 'Đăng ký thất bại', {
                    title: 'Lỗi đăng ký',
                    duration: 6000
                });
            }
        } catch (error) {
            console.error('❌ Register error:', error);
            showError('Lỗi kết nối. Vui lòng thử lại.', {
                title: 'Lỗi mạng',
                duration: 5000
            });
        } finally {
            this.setLoadingState(submitBtn, false);
        }
    }

    showUserProfile() {
        const loginContainer = document.getElementById('loginContainer');
        const registerContainer = document.getElementById('registerContainer');
        const userProfile = document.getElementById('userProfile');

        if (loginContainer) loginContainer.style.display = 'none';
        if (registerContainer) registerContainer.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'block';
            
            // Update profile info
            const profileUsername = document.getElementById('profileUsername');
            const profileRole = document.getElementById('profileRole');
            
            if (profileUsername) profileUsername.textContent = this.currentUser.username;
            if (profileRole) {
                profileRole.textContent = this.currentUser.role === 'admin' || this.currentUser.role === 'super_admin' ? 'Admin' : 'Khách hàng';
            }
        }
    }

    showAuthForms() {
        const loginContainer = document.getElementById('loginContainer');
        const registerContainer = document.getElementById('registerContainer');
        const userProfile = document.getElementById('userProfile');

        if (loginContainer) loginContainer.style.display = 'block';
        if (registerContainer) registerContainer.style.display = 'none';
        if (userProfile) userProfile.style.display = 'none';
    }

    updateHeaderButton() {
        const authBtn = document.querySelector('.auth-toggle-btn');
        if (authBtn) {
            if (this.currentUser) {
                authBtn.innerHTML = `
                    <i class="fas fa-user-circle"></i>
                    <span>${this.currentUser.username}</span>
                `;
            } else {
                authBtn.innerHTML = `
                    <i class="fas fa-user"></i>
                    <span>Đăng nhập</span>
                `;
            }
        }
    }

    async handleLogout() {
        try {
            const token = localStorage.getItem('authToken');
            if (token) {
                await fetch('http://localhost:5000/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
            }
        } catch (error) {
            console.error('Logout API error:', error);
        }

        this.clearAuthData();
        this.showNotification('Đăng xuất thành công!', 'success');
        this.showAuthForms();
        this.updateHeaderButton();
        this.closeSidebar();
    }

    clearAuthData() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        this.currentUser = null;
    }

    setLoadingState(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        } else {
            button.disabled = false;
            if (button.classList.contains('login-btn')) {
                button.innerHTML = '<i class="fas fa-sign-in-alt"></i> Đăng nhập';
            } else if (button.classList.contains('register-btn')) {
                button.innerHTML = '<i class="fas fa-user-plus"></i> Tạo tài khoản';
            }
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease-out';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            info: 'info-circle',
            warning: 'exclamation-triangle'
        };
        return icons[type] || 'info-circle';
    }
}

// Global functions
let rightSidebarAuth;

function toggleRightSidebar() {
    const sidebar = document.getElementById('rightSidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (!sidebar) return;

    if (rightSidebarAuth.isOpen) {
        rightSidebarAuth.closeSidebar();
    } else {
        rightSidebarAuth.openSidebar();
    }
}

function switchToRegister() {
    const loginContainer = document.getElementById('loginContainer');
    const registerContainer = document.getElementById('registerContainer');
    
    if (loginContainer) loginContainer.style.display = 'none';
    if (registerContainer) registerContainer.style.display = 'block';
}

function switchToLogin() {
    const loginContainer = document.getElementById('loginContainer');
    const registerContainer = document.getElementById('registerContainer');
    
    if (loginContainer) loginContainer.style.display = 'block';
    if (registerContainer) registerContainer.style.display = 'none';
}

function showProfile() {
    rightSidebarAuth.showNotification('Tính năng hồ sơ đang phát triển', 'info');
}

function showOrders() {
    rightSidebarAuth.showNotification('Tính năng đơn hàng đang phát triển', 'info');
}

function handleLogout() {
    rightSidebarAuth.handleLogout();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initializing RightSidebarAuth...');
    rightSidebarAuth = new RightSidebarAuth();
    console.log('✅ RightSidebarAuth initialized');
    
    // Add overlay
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.onclick = () => rightSidebarAuth.closeSidebar();
    document.body.appendChild(overlay);
    console.log('✅ Overlay added');
});

// Add methods to RightSidebarAuth class
RightSidebarAuth.prototype.openSidebar = function() {
    const sidebar = document.getElementById('rightSidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar) {
        sidebar.classList.add('open', 'slide-in-right');
        sidebar.style.transform = 'translateX(0)';
        this.isOpen = true;
    }
    
    if (overlay) {
        overlay.classList.add('show');
    }
    
    document.body.style.overflow = 'hidden';
};

RightSidebarAuth.prototype.closeSidebar = function() {
    const sidebar = document.getElementById('rightSidebar');
    const overlay = document.querySelector('.sidebar-overlay');
    
    if (sidebar) {
        sidebar.classList.remove('open');
        sidebar.style.transform = 'translateX(100%)';
        this.isOpen = false;
    }
    
    if (overlay) {
        overlay.classList.remove('show');
    }
    
    document.body.style.overflow = '';
};
