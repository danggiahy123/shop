// Enhanced UI Interactions and Animations
class EnhancedUI {
    constructor() {
        this.init();
    }

    init() {
        this.setupSmoothScrolling();
        this.setupParallaxEffects();
        this.setupAdvancedAnimations();
        this.setupInteractiveElements();
        this.setupThemeToggle();
        this.setupAdvancedNotifications();
    }

    setupSmoothScrolling() {
        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    setupParallaxEffects() {
        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                const rate = scrolled * -0.5;
                heroSection.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    setupAdvancedAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in');
                    entry.target.style.animationDelay = `${Math.random() * 0.5}s`;
                }
            });
        }, observerOptions);

        // Observe all cards and sections
        document.querySelectorAll('.card, .service-card, .promotion-card, .sample-card').forEach(el => {
            observer.observe(el);
        });
    }

    setupInteractiveElements() {
        // Enhanced button interactions
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-3px) scale(1.02)';
            });
            
            btn.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Enhanced card interactions
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-8px) scale(1.02)';
                this.style.boxShadow = '0 15px 35px rgba(102, 126, 234, 0.15)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
                this.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.08)';
            });
        });

        // Enhanced sidebar navigation
        document.querySelectorAll('.sidebar-nav a').forEach(link => {
            link.addEventListener('mouseenter', function() {
                this.style.transform = 'translateX(8px) scale(1.02)';
            });
            
            link.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.transform = 'translateX(0) scale(1)';
                }
            });
        });
    }

    setupThemeToggle() {
        // Create theme toggle button
        const themeToggle = document.createElement('button');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.className = 'theme-toggle';
        themeToggle.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            transition: all 0.3s ease;
            z-index: 1000;
        `;

        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            
            // Save theme preference
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        document.body.appendChild(themeToggle);
    }

    setupAdvancedNotifications() {
        // Enhanced notification system
        this.showNotification = (message, type = 'info', duration = 3000) => {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.innerHTML = `
                <div class="notification-content">
                    <i class="fas fa-${this.getNotificationIcon(type)}"></i>
                    <span>${message}</span>
                </div>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            `;

            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${this.getNotificationColor(type)};
                color: white;
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.2);
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                max-width: 400px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
            `;

            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);

            // Auto remove
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, duration);

            // Close button
            notification.querySelector('.notification-close').addEventListener('click', () => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (document.body.contains(notification)) {
                        document.body.removeChild(notification);
                    }
                }, 300);
            });
        };

        this.getNotificationIcon = (type) => {
            const icons = {
                success: 'check-circle',
                error: 'exclamation-circle',
                warning: 'exclamation-triangle',
                info: 'info-circle'
            };
            return icons[type] || 'info-circle';
        };

        this.getNotificationColor = (type) => {
            const colors = {
                success: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                error: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)',
                warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
                info: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
            };
            return colors[type] || colors.info;
        };
    }

    // Public methods
    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showWarning(message) {
        this.showNotification(message, 'warning');
    }

    showInfo(message) {
        this.showNotification(message, 'info');
    }
}

// Enhanced Form Validation
class EnhancedFormValidation {
    constructor() {
        this.setupFormValidation();
    }

    setupFormValidation() {
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });

            // Real-time validation
            form.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', () => {
                    this.clearFieldError(input);
                });
            });
        });
    }

    validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    validateField(input) {
        const value = input.value.trim();
        const type = input.type;
        const name = input.name;
        let isValid = true;
        let errorMessage = '';

        // Required field validation
        if (input.hasAttribute('required') && !value) {
            errorMessage = 'Trường này là bắt buộc';
            isValid = false;
        }

        // Email validation
        if (type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errorMessage = 'Email không hợp lệ';
                isValid = false;
            }
        }

        // Password validation
        if (name === 'password' && value) {
            if (value.length < 6) {
                errorMessage = 'Mật khẩu phải có ít nhất 6 ký tự';
                isValid = false;
            }
        }

        // Confirm password validation
        if (name === 'confirmPassword' && value) {
            const password = form.querySelector('input[name="password"]');
            if (password && value !== password.value) {
                errorMessage = 'Mật khẩu xác nhận không khớp';
                isValid = false;
            }
        }

        // Username validation
        if (name === 'username' && value) {
            if (value.length < 3 || value.length > 30) {
                errorMessage = 'Tên đăng nhập phải có từ 3-30 ký tự';
                isValid = false;
            }
        }

        if (!isValid) {
            this.showFieldError(input, errorMessage);
        } else {
            this.clearFieldError(input);
        }

        return isValid;
    }

    showFieldError(input, message) {
        this.clearFieldError(input);
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.8rem;
            margin-top: 4px;
            animation: slideInUp 0.3s ease;
        `;

        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#ef4444';
        input.style.boxShadow = '0 0 0 3px rgba(239, 68, 68, 0.1)';
    }

    clearFieldError(input) {
        const errorDiv = input.parentNode.querySelector('.field-error');
        if (errorDiv) {
            errorDiv.remove();
        }
        input.style.borderColor = '';
        input.style.boxShadow = '';
    }
}

// Enhanced Search Functionality
class EnhancedSearch {
    constructor() {
        this.setupSearch();
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');

        if (searchInput && searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.performSearch(searchInput.value);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch(searchInput.value);
                }
            });

            // Real-time search suggestions
            searchInput.addEventListener('input', (e) => {
                this.showSearchSuggestions(e.target.value);
            });
        }
    }

    performSearch(query) {
        if (!query.trim()) return;

        // Show loading state
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            const originalHTML = searchBtn.innerHTML;
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            searchBtn.disabled = true;

            setTimeout(() => {
                searchBtn.innerHTML = originalHTML;
                searchBtn.disabled = false;
            }, 1000);
        }

        // Perform search logic here
        console.log('Searching for:', query);
        
        // Show notification
        if (window.enhancedUI) {
            window.enhancedUI.showInfo(`Đang tìm kiếm: "${query}"`);
        }
    }

    showSearchSuggestions(query) {
        // Implement search suggestions logic
        if (query.length < 2) return;
        
        // This would typically fetch suggestions from an API
        const suggestions = [
            'Website mẫu',
            'Mobile app',
            'VPS',
            'Dịch vụ hosting',
            'Thiết kế web'
        ].filter(item => item.toLowerCase().includes(query.toLowerCase()));

        // Show suggestions dropdown
        this.displaySuggestions(suggestions);
    }

    displaySuggestions(suggestions) {
        // Remove existing suggestions
        const existingSuggestions = document.querySelector('.search-suggestions');
        if (existingSuggestions) {
            existingSuggestions.remove();
        }

        if (suggestions.length === 0) return;

        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.className = 'search-suggestions';
        suggestionsDiv.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            border: 1px solid rgba(0, 0, 0, 0.1);
            z-index: 1000;
            margin-top: 4px;
            overflow: hidden;
        `;

        suggestions.forEach(suggestion => {
            const suggestionItem = document.createElement('div');
            suggestionItem.textContent = suggestion;
            suggestionItem.style.cssText = `
                padding: 12px 16px;
                cursor: pointer;
                transition: background 0.2s ease;
                border-bottom: 1px solid rgba(0, 0, 0, 0.05);
            `;

            suggestionItem.addEventListener('mouseenter', () => {
                suggestionItem.style.background = 'rgba(102, 126, 234, 0.1)';
            });

            suggestionItem.addEventListener('mouseleave', () => {
                suggestionItem.style.background = '';
            });

            suggestionItem.addEventListener('click', () => {
                document.getElementById('searchInput').value = suggestion;
                this.performSearch(suggestion);
                suggestionsDiv.remove();
            });

            suggestionsDiv.appendChild(suggestionItem);
        });

        const searchBox = document.querySelector('.search-box');
        if (searchBox) {
            searchBox.style.position = 'relative';
            searchBox.appendChild(suggestionsDiv);
        }
    }
}

// Initialize Enhanced UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.enhancedUI = new EnhancedUI();
    window.enhancedFormValidation = new EnhancedFormValidation();
    window.enhancedSearch = new EnhancedSearch();
});

// Export for use in other scripts
window.EnhancedUI = EnhancedUI;
window.EnhancedFormValidation = EnhancedFormValidation;
window.EnhancedSearch = EnhancedSearch;

