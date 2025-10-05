// Performance Optimization Manager
class PerformanceManager {
    constructor() {
        this.debounceTimers = new Map();
        this.throttleTimers = new Map();
        this.observers = new Map();
        this.cache = new Map();
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.setupImageOptimization();
        this.setupScrollOptimization();
        this.setupResizeOptimization();
        this.setupMemoryManagement();
        console.log('⚡ Performance Manager initialized');
    }

    // Debounce function calls
    debounce(key, func, delay = 300) {
        if (this.debounceTimers.has(key)) {
            clearTimeout(this.debounceTimers.get(key));
        }
        
        const timer = setTimeout(() => {
            func();
            this.debounceTimers.delete(key);
        }, delay);
        
        this.debounceTimers.set(key, timer);
    }

    // Throttle function calls
    throttle(key, func, delay = 100) {
        if (this.throttleTimers.has(key)) {
            return;
        }
        
        func();
        
        const timer = setTimeout(() => {
            this.throttleTimers.delete(key);
        }, delay);
        
        this.throttleTimers.set(key, timer);
    }

    // Lazy loading for images
    setupLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            // Observe all lazy images
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });

            this.observers.set('images', imageObserver);
        }
    }

    // Image optimization
    setupImageOptimization() {
        // Add loading="lazy" to all images
        document.querySelectorAll('img:not([loading])').forEach(img => {
            img.setAttribute('loading', 'lazy');
        });

        // Optimize image formats
        this.optimizeImageFormats();
    }

    optimizeImageFormats() {
        // Check for WebP support
        const webpSupported = this.checkWebPSupport();
        
        if (webpSupported) {
            document.querySelectorAll('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]').forEach(img => {
                const src = img.src;
                const webpSrc = src.replace(/\.(jpg|jpeg|png)$/, '.webp');
                
                // Try to load WebP version
                const testImg = new Image();
                testImg.onload = () => {
                    img.src = webpSrc;
                };
                testImg.src = webpSrc;
            });
        }
    }

    checkWebPSupport() {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }

    // Scroll optimization
    setupScrollOptimization() {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.throttle('scroll', () => {
                        this.handleScrollEvents();
                    }, 16); // ~60fps
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    handleScrollEvents() {
        // Parallax effects
        this.updateParallax();
        
        // Show/hide elements based on scroll
        this.updateScrollElements();
    }

    updateParallax() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        
        parallaxElements.forEach(element => {
            const speed = parseFloat(element.dataset.parallax) || 0.5;
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    updateScrollElements() {
        const scrolled = window.pageYOffset;
        const threshold = 100;
        
        // Update header
        const header = document.querySelector('.header');
        if (header) {
            if (scrolled > threshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    }

    // Resize optimization
    setupResizeOptimization() {
        this.debounce('resize', () => {
            this.handleResize();
        }, 250);
        
        window.addEventListener('resize', () => {
            this.debounce('resize', () => {
                this.handleResize();
            }, 250);
        });
    }

    handleResize() {
        // Update responsive elements
        this.updateResponsiveElements();
        
        // Recalculate layouts
        this.recalculateLayouts();
    }

    updateResponsiveElements() {
        const width = window.innerWidth;
        
        // Update sidebar visibility
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
            if (width < 768) {
                sidebar.classList.add('mobile-hidden');
            } else {
                sidebar.classList.remove('mobile-hidden');
            }
        }
    }

    recalculateLayouts() {
        // Force reflow for critical elements
        const criticalElements = document.querySelectorAll('.critical-layout');
        criticalElements.forEach(element => {
            element.style.transform = 'translateZ(0)';
        });
    }

    // Memory management
    setupMemoryManagement() {
        // Clean up unused observers
        setInterval(() => {
            this.cleanupObservers();
        }, 30000); // Every 30 seconds

        // Clean up cache
        setInterval(() => {
            this.cleanupCache();
        }, 60000); // Every minute
    }

    cleanupObservers() {
        this.observers.forEach((observer, key) => {
            if (observer.takeRecords().length === 0) {
                observer.disconnect();
                this.observers.delete(key);
            }
        });
    }

    cleanupCache() {
        // Remove old cache entries
        const maxAge = 5 * 60 * 1000; // 5 minutes
        const now = Date.now();
        
        this.cache.forEach((value, key) => {
            if (now - value.timestamp > maxAge) {
                this.cache.delete(key);
            }
        });
    }

    // Caching system
    cache(key, value, ttl = 300000) { // 5 minutes default
        this.cache.set(key, {
            value,
            timestamp: Date.now(),
            ttl
        });
    }

    getCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < cached.ttl) {
            return cached.value;
        }
        this.cache.delete(key);
        return null;
    }

    // Preload critical resources
    preloadCriticalResources() {
        const criticalResources = [
            'css/enhanced-notifications.css',
            'css/right-sidebar.css',
            'js/enhanced-notifications.js',
            'js/socket-manager.js'
        ];

        criticalResources.forEach(resource => {
            if (resource.endsWith('.css')) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'style';
                link.href = resource;
                document.head.appendChild(link);
            } else if (resource.endsWith('.js')) {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'script';
                link.href = resource;
                document.head.appendChild(link);
            }
        });
    }

    // Optimize animations
    optimizeAnimations() {
        // Use transform and opacity for animations
        const animatedElements = document.querySelectorAll('[data-animate]');
        
        animatedElements.forEach(element => {
            element.style.willChange = 'transform, opacity';
        });
    }

    // Performance monitoring
    monitorPerformance() {
        if ('performance' in window) {
            // Monitor page load time
            window.addEventListener('load', () => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('📊 Page Load Time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
                
                // Show performance notification
                if (window.showInfo) {
                    const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                    if (loadTime > 3000) {
                        showWarning('Trang web tải chậm. Đang tối ưu hóa...', {
                            duration: 5000
                        });
                    }
                }
            });
        }
    }

    // Cleanup on page unload
    cleanup() {
        // Clear all timers
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.throttleTimers.forEach(timer => clearTimeout(timer));
        
        // Disconnect all observers
        this.observers.forEach(observer => observer.disconnect());
        
        // Clear cache
        this.cache.clear();
        
        console.log('🧹 Performance Manager cleaned up');
    }
}

// Global performance manager
let performanceManager;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    performanceManager = new PerformanceManager();
    performanceManager.preloadCriticalResources();
    performanceManager.optimizeAnimations();
    performanceManager.monitorPerformance();
    
    // Make it globally available
    window.performanceManager = performanceManager;
    
    console.log('⚡ Performance optimizations applied');
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (performanceManager) {
        performanceManager.cleanup();
    }
});

// Global utility functions
function debounce(key, func, delay = 300) {
    if (performanceManager) {
        performanceManager.debounce(key, func, delay);
    }
}

function throttle(key, func, delay = 100) {
    if (performanceManager) {
        performanceManager.throttle(key, func, delay);
    }
}

function cache(key, value, ttl = 300000) {
    if (performanceManager) {
        performanceManager.cache(key, value, ttl);
    }
}

function getCache(key) {
    if (performanceManager) {
        return performanceManager.getCache(key);
    }
    return null;
}
