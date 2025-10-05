// Class chính quản lý ứng dụng
class ShopApp {
    constructor() {
        this.cartManager = new CartManager();
        this.productManager = new ProductManager(sampleProducts, sampleCategories);
        this.orderManager = new OrderManager();
        this.currentSection = 'home';
        this.currentProducts = [];
        
        this.initializeApp();
    }

    // Khởi tạo ứng dụng
    initializeApp() {
        this.setupEventListeners();
        this.loadInitialData();
        this.showSection('home');
    }

    // Thiết lập event listeners
    setupEventListeners() {
        // Sidebar navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = e.target.closest('.nav-link')?.getAttribute('data-section');
                if (section) {
                    this.showSection(section);
                }
            });
        });

        // Mobile menu toggle
        const mobileMenuToggle = document.getElementById('mobileMenuToggle');
        const sidebarToggle = document.getElementById('sidebarToggle');
        
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                document.querySelector('.sidebar')?.classList.toggle('open');
            });
        }

        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.querySelector('.sidebar')?.classList.toggle('open');
            });
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                this.handleSearch(query);
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput?.value || '';
                this.handleSearch(query);
            });
        }

        // Filter controls
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                this.handleCategoryFilter(categoryFilter.value);
            });
        }

        if (priceFilter) {
            priceFilter.addEventListener('change', () => {
                this.handlePriceFilter(priceFilter.value);
            });
        }

        // Checkout button
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.handleCheckout();
            });
        }

        // Modal close
        const modal = document.getElementById('productModal');
        const closeBtn = document.querySelector('.close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    // Tải dữ liệu ban đầu
    loadInitialData() {
        // Không cần load sản phẩm và giỏ hàng nữa vì đây là trang dịch vụ
        // Chỉ cần setup các event listeners cơ bản
    }

    // Hiển thị section
    showSection(sectionName) {
        // Ẩn tất cả sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });

        // Hiển thị section được chọn
        const targetSection = document.getElementById(sectionName);
        if (targetSection) {
            targetSection.classList.add('active');
        }

        // Cập nhật navigation active
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        const activeLink = document.querySelector(`[data-section="${sectionName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Cập nhật title
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            const titles = {
                'login': 'Đăng nhập',
                'home': 'Trang chủ',
                'promotions': 'Khuyến mãi',
                'website-samples': 'Website mẫu',
                'mobile-samples': 'Mobile app mẫu',
                'portfolio-samples': 'Portfolio mẫu',
                'services': 'Gói dịch vụ',
                'contact': 'Liên hệ',
                'commitment': 'Cam kết'
            };
            pageTitle.textContent = titles[sectionName] || 'Trang chủ';
        }

        this.currentSection = sectionName;

        // Đóng sidebar trên mobile
        if (window.innerWidth <= 768) {
            document.querySelector('.sidebar')?.classList.remove('open');
        }
    }

    // Tải danh mục
    loadCategories() {
        const categories = this.productManager.getAllCategories();
        const categoryFilter = document.getElementById('categoryFilter');
        const categoriesGrid = document.getElementById('categoriesGrid');

        // Populate category filter
        if (categoryFilter) {
            categoryFilter.innerHTML = '<option value="">Tất cả danh mục</option>';
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                categoryFilter.appendChild(option);
            });
        }

        // Display categories grid
        if (categoriesGrid) {
            categoriesGrid.innerHTML = '';
            categories.forEach(category => {
                const categoryCard = this.createCategoryCard(category);
                categoriesGrid.appendChild(categoryCard);
            });
        }
    }

    // Tạo category card
    createCategoryCard(category) {
        const card = document.createElement('div');
        card.className = 'category-card';
        card.innerHTML = `
            <div class="category-icon">${category.icon}</div>
            <div class="category-name">${category.name}</div>
        `;
        
        card.addEventListener('click', () => {
            this.showSection('products');
            this.handleCategoryFilter(category.name);
        });

        return card;
    }

    // Tải sản phẩm nổi bật
    loadFeaturedProducts() {
        const featuredProducts = this.productManager.getFeaturedProducts();
        const featuredGrid = document.getElementById('featuredProducts');
        
        if (featuredGrid) {
            featuredGrid.innerHTML = '';
            featuredProducts.forEach(product => {
                const productCard = this.createProductCard(product);
                featuredGrid.appendChild(productCard);
            });
        }
    }

    // Tải tất cả sản phẩm
    loadAllProducts() {
        this.currentProducts = this.productManager.getAllProducts();
        this.renderProducts(this.currentProducts);
    }

    // Render sản phẩm
    renderProducts(products) {
        const productsGrid = document.getElementById('allProducts');
        if (productsGrid) {
            productsGrid.innerHTML = '';
            products.forEach(product => {
                const productCard = this.createProductCard(product);
                productsGrid.appendChild(productCard);
            });
        }
    }

    // Tạo product card
    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price">${this.formatPrice(product.price)}</div>
                <p class="product-description">${product.description}</p>
                <div class="product-actions">
                    <button class="btn-add-cart" data-product-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                    </button>
                    <button class="btn-view" data-product-id="${product.id}">
                        <i class="fas fa-eye"></i> Xem
                    </button>
                </div>
            </div>
        `;

        // Add event listeners
        const addToCartBtn = card.querySelector('.btn-add-cart');
        const viewBtn = card.querySelector('.btn-view');

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                this.cartManager.addToCart(product);
            });
        }

        if (viewBtn) {
            viewBtn.addEventListener('click', () => {
                this.showProductModal(product);
            });
        }

        return card;
    }

    // Tải giỏ hàng
    loadCartItems() {
        const cartItems = this.cartManager.getCartItems();
        const cartItemsContainer = document.getElementById('cartItems');
        
        if (cartItemsContainer) {
            cartItemsContainer.innerHTML = '';
            
            if (cartItems.length === 0) {
                cartItemsContainer.innerHTML = '<p>Giỏ hàng trống</p>';
                return;
            }

            cartItems.forEach(item => {
                const cartItemElement = this.createCartItemElement(item);
                cartItemsContainer.appendChild(cartItemElement);
            });
        }
    }

    // Tạo cart item element
    createCartItemElement(item) {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">${item.product.image}</div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.product.name}</div>
                <div class="cart-item-price">${this.formatPrice(item.product.price)}</div>
            </div>
            <div class="cart-item-controls">
                <button class="quantity-btn" data-action="decrease" data-product-id="${item.product.id}">-</button>
                <span class="quantity">${item.quantity}</span>
                <button class="quantity-btn" data-action="increase" data-product-id="${item.product.id}">+</button>
                <button class="remove-btn" data-product-id="${item.product.id}">Xóa</button>
            </div>
        `;

        // Add event listeners
        const decreaseBtn = cartItem.querySelector('[data-action="decrease"]');
        const increaseBtn = cartItem.querySelector('[data-action="increase"]');
        const removeBtn = cartItem.querySelector('.remove-btn');

        if (decreaseBtn) {
            decreaseBtn.addEventListener('click', () => {
                this.cartManager.updateQuantity(item.product.id, item.quantity - 1);
                this.loadCartItems();
            });
        }

        if (increaseBtn) {
            increaseBtn.addEventListener('click', () => {
                this.cartManager.updateQuantity(item.product.id, item.quantity + 1);
                this.loadCartItems();
            });
        }

        if (removeBtn) {
            removeBtn.addEventListener('click', () => {
                this.cartManager.removeFromCart(item.product.id);
                this.loadCartItems();
            });
        }

        return cartItem;
    }

    // Xử lý tìm kiếm
    handleSearch(query) {
        if (query.trim() === '') {
            this.loadAllProducts();
            return;
        }

        const searchResults = this.productManager.searchProducts(query);
        this.currentProducts = searchResults;
        this.renderProducts(searchResults);
    }

    // Xử lý filter theo danh mục
    handleCategoryFilter(category) {
        let products = this.productManager.getAllProducts();
        
        if (category) {
            products = this.productManager.getProductsByCategory(category);
        }
        
        this.currentProducts = products;
        this.renderProducts(products);
    }

    // Xử lý filter theo giá
    handlePriceFilter(order) {
        if (order) {
            this.currentProducts = this.productManager.sortProductsByPrice(this.currentProducts, order);
            this.renderProducts(this.currentProducts);
        }
    }

    // Xử lý checkout
    handleCheckout() {
        const cartItems = this.cartManager.getCartItems();
        
        if (cartItems.length === 0) {
            alert('Giỏ hàng trống!');
            return;
        }

        const order = this.orderManager.createOrder(cartItems);
        this.cartManager.clearCart();
        this.loadCartItems();
        
        alert(`Đơn hàng #${order.id} đã được tạo thành công!`);
        this.showSection('orders');
    }

    // Hiển thị product modal
    showProductModal(product) {
        const modal = document.getElementById('productModal');
        const modalBody = document.getElementById('modalBody');
        
        if (modal && modalBody) {
            modalBody.innerHTML = `
                <div class="product-detail">
                    <div class="product-image-large">${product.image}</div>
                    <div class="product-detail-info">
                        <h2>${product.name}</h2>
                        <div class="product-price-large">${this.formatPrice(product.price)}</div>
                        <p class="product-description-large">${product.description}</p>
                        <div class="product-stock">Còn lại: ${product.stock} sản phẩm</div>
                        <button class="btn btn-primary btn-large" onclick="app.cartManager.addToCart(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                            <i class="fas fa-cart-plus"></i> Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            `;
            
            modal.style.display = 'block';
        }
    }

    // Đóng modal
    closeModal() {
        const modal = document.getElementById('productModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // Định dạng giá tiền
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }
}

// Khởi tạo ứng dụng khi DOM đã load
document.addEventListener('DOMContentLoaded', () => {
    const app = new ShopApp();
    
    // Expose app to global scope for onclick handlers
    window.app = app;
    window.showSection = (section) => app.showSection(section);
});
