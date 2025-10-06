// Pink Sidebar Fixes and Enhanced Functionality
class PinkSidebarManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupSidebarToggle();
        this.setupRightSidebar();
        this.setupOverlayClose();
        this.setupKeyboardClose();
        this.setupMobileMenu();
        console.log('🌸 Pink Sidebar Manager initialized');
    }

    setupSidebarToggle() {
        const sidebarToggle = document.getElementById('sidebarToggle');
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSidebar();
            });
        }

        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSidebar();
            });
        }

        // Close sidebar when clicking outside
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeSidebar();
            });
        }

        // Close sidebar when clicking on sidebar links (mobile)
        const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.closeSidebar();
                }
            });
        });
    }

    setupRightSidebar() {
        const authToggleBtn = document.querySelector('.auth-toggle-btn');
        const rightSidebar = document.getElementById('rightSidebar');
        const closeSidebarBtn = document.querySelector('.close-sidebar');

        if (authToggleBtn) {
            authToggleBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleRightSidebar();
            });
        }

        if (closeSidebarBtn) {
            closeSidebarBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.closeRightSidebar();
            });
        }
    }

    setupOverlayClose() {
        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                this.closeSidebar();
            });
        }
    }

    setupKeyboardClose() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeSidebar();
                this.closeRightSidebar();
            }
        });
    }

    setupMobileMenu() {
        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeSidebar();
            }
        });
    }

    toggleSidebar() {
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
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
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar) {
            sidebar.classList.remove('open');
            if (overlay) {
                overlay.classList.remove('show');
            }
            document.body.style.overflow = '';
        }
    }

    toggleRightSidebar() {
        const rightSidebar = document.getElementById('rightSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (rightSidebar) {
            rightSidebar.classList.toggle('open');
            if (overlay) {
                overlay.classList.toggle('show');
            }
            document.body.style.overflow = rightSidebar.classList.contains('open') ? 'hidden' : '';
        }
    }

    closeRightSidebar() {
        const rightSidebar = document.getElementById('rightSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (rightSidebar) {
            rightSidebar.classList.remove('open');
            if (overlay) {
                overlay.classList.remove('show');
            }
            document.body.style.overflow = '';
        }
    }
}

// Enhanced Auth Management
class PinkAuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.setupAuthForms();
        this.setupFormValidation();
        this.loadUserData();
        console.log('🔐 Pink Auth Manager initialized');
    }

    setupAuthForms() {
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');

        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        if (registerForm) {
            registerForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleRegister();
            });
        }
    }

    setupFormValidation() {
        // Real-time validation
        const inputs = document.querySelectorAll('.auth-form-container input');
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });

            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    handleLogin() {
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        if (!this.validateLoginForm(username, password)) {
            return;
        }

        // Simulate login API call
        this.showLoading('loginBtn');
        
        setTimeout(() => {
            this.hideLoading('loginBtn');
            
            // Mock successful login
            this.currentUser = {
                username: username,
                role: 'customer',
                orders: 0,
                totalSpent: 0
            };
            
            this.showUserProfile();
            this.showNotification('Đăng nhập thành công!', 'success');
        }, 1500);
    }

    handleRegister() {
        const username = document.getElementById('registerUsername').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (!this.validateRegisterForm(username, password, confirmPassword)) {
            return;
        }

        // Simulate register API call
        this.showLoading('registerBtn');
        
        setTimeout(() => {
            this.hideLoading('registerBtn');
            
            // Mock successful registration
            this.currentUser = {
                username: username,
                role: 'customer',
                orders: 0,
                totalSpent: 0
            };
            
            this.showUserProfile();
            this.showNotification('Đăng ký thành công!', 'success');
        }, 1500);
    }

    validateLoginForm(username, password) {
        let isValid = true;

        if (!username.trim()) {
            this.showFieldError('loginUsername', 'Tên đăng nhập là bắt buộc');
            isValid = false;
        }

        if (!password.trim()) {
            this.showFieldError('loginPassword', 'Mật khẩu là bắt buộc');
            isValid = false;
        }

        return isValid;
    }

    validateRegisterForm(username, password, confirmPassword) {
        let isValid = true;

        if (!username.trim() || username.length < 3) {
            this.showFieldError('registerUsername', 'Tên đăng nhập phải có ít nhất 3 ký tự');
            isValid = false;
        }

        if (!password.trim() || password.length < 6) {
            this.showFieldError('registerPassword', 'Mật khẩu phải có ít nhất 6 ký tự');
            isValid = false;
        }

        if (password !== confirmPassword) {
            this.showFieldError('confirmPassword', 'Mật khẩu xác nhận không khớp');
            isValid = false;
        }

        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        const name = input.name;

        this.clearFieldError(input);

        if (name === 'username' && value && value.length < 3) {
            this.showFieldError(input.id, 'Tên đăng nhập phải có ít nhất 3 ký tự');
            return false;
        }

        if (name === 'password' && value && value.length < 6) {
            this.showFieldError(input.id, 'Mật khẩu phải có ít nhất 6 ký tự');
            return false;
        }

        return true;
    }

    showFieldError(fieldId, message) {
        const field = document.getElementById(fieldId);
        if (!field) return;

        this.clearFieldError(field);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.8rem;
            margin-top: 4px;
            animation: slideInUp 0.3s ease;
        `;

        field.parentNode.appendChild(errorDiv);
        field.style.borderColor = '#ef4444';
        field.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    }

    clearFieldError(field) {
        const errorDiv = field.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        field.style.borderColor = '';
        field.style.boxShadow = '';
    }

    showLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = true;
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
        }
    }

    hideLoading(buttonId) {
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
            if (buttonId === 'loginBtn') {
                button.innerHTML = '<i class="fas fa-sign-in-alt"></i> Đăng nhập';
            } else if (buttonId === 'registerBtn') {
                button.innerHTML = '<i class="fas fa-user-plus"></i> Tạo tài khoản';
            }
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
            
            // Update user info
            const usernameElement = document.getElementById('profileUsername');
            const roleElement = document.getElementById('profileRole');
            
            if (usernameElement) usernameElement.textContent = this.currentUser.username;
            if (roleElement) roleElement.textContent = this.currentUser.role === 'admin' ? 'Quản trị viên' : 'Khách hàng';
        }
    }

    showLoginForm() {
        const loginContainer = document.getElementById('loginContainer');
        const registerContainer = document.getElementById('registerContainer');
        const userProfile = document.getElementById('userProfile');

        if (loginContainer) loginContainer.style.display = 'block';
        if (registerContainer) registerContainer.style.display = 'none';
        if (userProfile) userProfile.style.display = 'none';
    }

    showRegisterForm() {
        const loginContainer = document.getElementById('loginContainer');
        const registerContainer = document.getElementById('registerContainer');
        const userProfile = document.getElementById('userProfile');

        if (loginContainer) loginContainer.style.display = 'none';
        if (registerContainer) registerContainer.style.display = 'block';
        if (userProfile) userProfile.style.display = 'none';
    }

    handleLogout() {
        this.currentUser = null;
        this.showLoginForm();
        this.showNotification('Đã đăng xuất thành công!', 'info');
    }

    loadUserData() {
        // Load user data from localStorage or API
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.showUserProfile();
        }
    }

    saveUserData() {
        if (this.currentUser) {
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    }

    showNotification(message, type = 'info') {
        if (window.enhancedUI && window.enhancedUI.showNotification) {
            window.enhancedUI.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Global functions for HTML onclick handlers
function toggleRightSidebar() {
    if (window.pinkSidebarManager) {
        window.pinkSidebarManager.toggleRightSidebar();
    }
}

function switchToRegister() {
    if (window.pinkAuthManager) {
        window.pinkAuthManager.showRegisterForm();
    }
}

function switchToLogin() {
    if (window.pinkAuthManager) {
        window.pinkAuthManager.showLoginForm();
    }
}

function handleLogout() {
    if (window.pinkAuthManager) {
        window.pinkAuthManager.handleLogout();
    }
}

function togglePassword(fieldId) {
    const field = document.getElementById(fieldId);
    const toggle = field.parentNode.querySelector('.password-toggle i');
    
    if (field.type === 'password') {
        field.type = 'text';
        toggle.className = 'fas fa-eye-slash';
    } else {
        field.type = 'password';
        toggle.className = 'fas fa-eye';
    }
}

function showProfile() {
    console.log('Show profile');
    // Implement profile functionality
}

function showOrders() {
    console.log('Show orders');
    // Implement orders functionality
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pinkSidebarManager = new PinkSidebarManager();
    window.pinkAuthManager = new PinkAuthManager();
});

// Export for use in other scripts
window.PinkSidebarManager = PinkSidebarManager;
window.PinkAuthManager = PinkAuthManager;
