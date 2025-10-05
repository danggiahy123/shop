// Class quản lý giỏ hàng
class CartManager {
    constructor() {
        this.cart = [];
        this.cartCountElement = document.getElementById('cartCount');
        this.cartTotalElement = document.getElementById('cartTotal');
        this.loadCartFromStorage();
        this.updateCartDisplay();
    }

    // Thêm sản phẩm vào giỏ hàng
    addToCart(product, quantity = 1) {
        const existingItem = this.cart.find(item => item.product.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push(new CartItem(product, quantity));
        }
        
        this.saveCartToStorage();
        this.updateCartDisplay();
        this.showNotification(`${product.name} đã được thêm vào giỏ hàng!`);
    }

    // Xóa sản phẩm khỏi giỏ hàng
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.product.id !== productId);
        this.saveCartToStorage();
        this.updateCartDisplay();
    }

    // Cập nhật số lượng sản phẩm
    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.product.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCartToStorage();
                this.updateCartDisplay();
            }
        }
    }

    // Lấy tổng số sản phẩm trong giỏ hàng
    getTotalItems() {
        return this.cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Lấy tổng giá trị giỏ hàng
    getTotalPrice() {
        return this.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    }

    // Lấy danh sách sản phẩm trong giỏ hàng
    getCartItems() {
        return [...this.cart];
    }

    // Xóa toàn bộ giỏ hàng
    clearCart() {
        this.cart = [];
        this.saveCartToStorage();
        this.updateCartDisplay();
    }

    // Cập nhật hiển thị giỏ hàng
    updateCartDisplay() {
        if (this.cartCountElement) {
            this.cartCountElement.textContent = this.getTotalItems().toString();
        }
        
        if (this.cartTotalElement) {
            this.cartTotalElement.textContent = this.formatPrice(this.getTotalPrice());
        }
    }

    // Lưu giỏ hàng vào localStorage
    saveCartToStorage() {
        localStorage.setItem('shop_cart', JSON.stringify(this.cart));
    }

    // Tải giỏ hàng từ localStorage
    loadCartFromStorage() {
        const savedCart = localStorage.getItem('shop_cart');
        if (savedCart) {
            try {
                const cartData = JSON.parse(savedCart);
                this.cart = cartData.map(item => new CartItem(item.product, item.quantity));
            } catch (error) {
                console.error('Lỗi khi tải giỏ hàng từ localStorage:', error);
                this.cart = [];
            }
        }
    }

    // Hiển thị thông báo
    showNotification(message) {
        // Tạo thông báo tạm thời
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Định dạng giá tiền
    formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    }
}

// Class quản lý sản phẩm
class ProductManager {
    constructor(products, categories) {
        this.products = products;
        this.categories = categories;
    }

    // Lấy tất cả sản phẩm
    getAllProducts() {
        return [...this.products];
    }

    // Lấy sản phẩm theo ID
    getProductById(id) {
        return this.products.find(product => product.id === id);
    }

    // Lấy sản phẩm nổi bật
    getFeaturedProducts() {
        return this.products.filter(product => product.featured);
    }

    // Lấy sản phẩm theo danh mục
    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    // Tìm kiếm sản phẩm
    searchProducts(query) {
        const lowercaseQuery = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(lowercaseQuery) ||
            product.description.toLowerCase().includes(lowercaseQuery) ||
            product.category.toLowerCase().includes(lowercaseQuery)
        );
    }

    // Sắp xếp sản phẩm theo giá
    sortProductsByPrice(products, order) {
        return [...products].sort((a, b) => {
            return order === 'low' ? a.price - b.price : b.price - a.price;
        });
    }

    // Lấy tất cả danh mục
    getAllCategories() {
        return [...this.categories];
    }

    // Lấy danh mục theo ID
    getCategoryById(id) {
        return this.categories.find(category => category.id === id);
    }
}

// Class quản lý đơn hàng
class OrderManager {
    constructor() {
        this.orders = [];
        this.loadOrdersFromStorage();
    }

    // Tạo đơn hàng mới
    createOrder(cartItems) {
        const order = new Order(
            Date.now(),
            [...cartItems],
            cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0),
            new Date(),
            'pending'
        );

        this.orders.unshift(order);
        this.saveOrdersToStorage();
        return order;
    }

    // Lấy tất cả đơn hàng
    getAllOrders() {
        return [...this.orders];
    }

    // Cập nhật trạng thái đơn hàng
    updateOrderStatus(orderId, status) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = status;
            this.saveOrdersToStorage();
        }
    }

    // Lưu đơn hàng vào localStorage
    saveOrdersToStorage() {
        localStorage.setItem('shop_orders', JSON.stringify(this.orders));
    }

    // Tải đơn hàng từ localStorage
    loadOrdersFromStorage() {
        const savedOrders = localStorage.getItem('shop_orders');
        if (savedOrders) {
            try {
                const ordersData = JSON.parse(savedOrders);
                this.orders = ordersData.map(orderData => new Order(
                    orderData.id,
                    orderData.items,
                    orderData.total,
                    new Date(orderData.date),
                    orderData.status
                ));
            } catch (error) {
                console.error('Lỗi khi tải đơn hàng từ localStorage:', error);
                this.orders = [];
            }
        }
    }
}
