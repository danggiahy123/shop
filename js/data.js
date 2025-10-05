// Định nghĩa các interface và type
// Product interface
class Product {
    constructor(id, name, price, description, category, image, stock, featured = false) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.category = category;
        this.image = image;
        this.stock = stock;
        this.featured = featured;
    }
}

// CartItem interface
class CartItem {
    constructor(product, quantity) {
        this.product = product;
        this.quantity = quantity;
    }
}

// Category interface
class Category {
    constructor(id, name, icon, productCount) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.productCount = productCount;
    }
}

// Order interface
class Order {
    constructor(id, items, total, date, status) {
        this.id = id;
        this.items = items;
        this.total = total;
        this.date = date;
        this.status = status;
    }
}

// Dữ liệu mẫu cho sản phẩm
const sampleProducts = [
    new Product(1, "iPhone 15 Pro", 29990000, "iPhone 15 Pro với chip A17 Pro mạnh mẽ, camera 48MP và thiết kế titan cao cấp.", "Điện thoại", "📱", 50, true),
    new Product(2, "MacBook Air M2", 25990000, "MacBook Air với chip M2, màn hình Liquid Retina 13.6 inch và thời lượng pin lên đến 18 giờ.", "Laptop", "💻", 30, true),
    new Product(3, "AirPods Pro 2", 5990000, "AirPods Pro thế hệ 2 với chip H2, chống ồn chủ động và âm thanh không gian.", "Phụ kiện", "🎧", 100, true),
    new Product(4, "iPad Pro 12.9", 22990000, "iPad Pro với chip M2, màn hình Liquid Retina XDR 12.9 inch và hỗ trợ Apple Pencil.", "Máy tính bảng", "📱", 25, false),
    new Product(5, "Apple Watch Series 9", 8990000, "Apple Watch Series 9 với chip S9, màn hình Always-On và nhiều tính năng sức khỏe.", "Đồng hồ", "⌚", 75, true),
    new Product(6, "Samsung Galaxy S24 Ultra", 26990000, "Samsung Galaxy S24 Ultra với camera 200MP, chip Snapdragon 8 Gen 3 và S Pen tích hợp.", "Điện thoại", "📱", 40, false),
    new Product(7, "Dell XPS 13", 22990000, "Dell XPS 13 với chip Intel Core i7, màn hình 13.4 inch và thiết kế siêu mỏng.", "Laptop", "💻", 20, false),
    new Product(8, "Sony WH-1000XM5", 7990000, "Tai nghe chống ồn Sony WH-1000XM5 với âm thanh chất lượng cao và chống ồn chủ động.", "Phụ kiện", "🎧", 60, false)
];

// Dữ liệu mẫu cho danh mục
const sampleCategories = [
    new Category(1, "Điện thoại", "📱", 2),
    new Category(2, "Laptop", "💻", 2),
    new Category(3, "Phụ kiện", "🎧", 2),
    new Category(4, "Máy tính bảng", "📱", 1),
    new Category(5, "Đồng hồ", "⌚", 1)
];
