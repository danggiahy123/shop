# Waterdg Backend API

Backend API cho hệ thống e-commerce Waterdg Việt Nam với Node.js, Express và MongoDB.

## 🚀 Tính năng

### Authentication & Authorization
- Đăng ký/Đăng nhập người dùng
- JWT Token authentication
- Role-based access control (Customer, Admin, Super Admin)
- Password hashing với bcrypt

### Product Management
- CRUD operations cho sản phẩm
- Upload hình ảnh sản phẩm
- Phân loại sản phẩm (Website, Mobile App, Portfolio, E-commerce)
- Featured/Hot products
- Product reviews và ratings

### Order Management
- Tạo đơn hàng
- Quản lý trạng thái đơn hàng
- Tracking đơn hàng
- Payment methods

### User Management
- Profile management
- Order history
- Dashboard statistics

## 📋 Yêu cầu hệ thống

- Node.js >= 14.0.0
- MongoDB >= 4.0
- npm hoặc yarn

## 🛠️ Cài đặt

1. **Clone repository và cài đặt dependencies:**
```bash
cd backend
npm install
```

2. **Cấu hình environment:**
```bash
cp env.example .env
# Chỉnh sửa file .env với thông tin của bạn
```

3. **Khởi tạo database với dữ liệu mẫu:**
```bash
npm run seed
```

4. **Chạy server:**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 📁 Cấu trúc thư mục

```
backend/
├── models/           # MongoDB models
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/           # API routes
│   ├── auth.js
│   ├── admin.js
│   ├── products.js
│   ├── orders.js
│   └── users.js
├── middleware/       # Custom middleware
│   └── auth.js
├── uploads/          # Uploaded files
│   └── products/
├── server.js         # Main server file
├── seed.js          # Database seeding
└── package.json
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Lấy thông tin user hiện tại
- `PUT /api/auth/profile` - Cập nhật profile
- `POST /api/auth/change-password` - Đổi mật khẩu
- `POST /api/auth/logout` - Đăng xuất

### Products (Public)
- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/featured` - Sản phẩm nổi bật
- `GET /api/products/hot` - Sản phẩm hot
- `GET /api/products/categories` - Danh mục sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `POST /api/products/:id/reviews` - Thêm đánh giá

### Admin Products
- `GET /api/admin/products` - Quản lý sản phẩm
- `POST /api/admin/products` - Tạo sản phẩm mới
- `PUT /api/admin/products/:id` - Cập nhật sản phẩm
- `DELETE /api/admin/products/:id` - Xóa sản phẩm
- `PUT /api/admin/products/:id/status` - Cập nhật trạng thái
- `PUT /api/admin/products/:id/featured` - Toggle featured

### Orders
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Lịch sử đơn hàng
- `GET /api/orders/:id` - Chi tiết đơn hàng
- `PUT /api/orders/:id/cancel` - Hủy đơn hàng

### Admin Orders
- `GET /api/orders/admin/all` - Tất cả đơn hàng
- `PUT /api/orders/admin/:id/status` - Cập nhật trạng thái

### Users
- `GET /api/users/profile` - Profile user
- `PUT /api/users/profile` - Cập nhật profile
- `GET /api/users/orders` - Lịch sử đơn hàng
- `GET /api/users/dashboard` - Dashboard

### Admin Users
- `GET /api/users/admin/all` - Quản lý users
- `PUT /api/users/admin/:id/role` - Cập nhật role
- `PUT /api/users/admin/:id/status` - Cập nhật trạng thái
- `DELETE /api/users/admin/:id` - Xóa user

## 🔐 Authentication

API sử dụng JWT tokens. Thêm token vào header:

```
Authorization: Bearer <your-jwt-token>
```

## 📊 Database Schema

### User
- firstName, lastName, email, phone, password
- role (customer, admin, super_admin)
- company, address, preferences
- isActive, avatar, lastLogin

### Product
- name, description, price, category
- images, features, specifications
- status, isFeatured, isHot
- stock, sku, ratings, reviews

### Order
- orderNumber, customer, items
- subtotal, tax, shipping, total
- status, paymentStatus, paymentMethod
- shippingAddress, timeline

## 🎯 Sample Data

Sau khi chạy `npm run seed`, bạn sẽ có:

**Admin Account:**
- Email: admin@waterdg.vn
- Password: admin123456

**Customer Account:**
- Email: customer@example.com
- Password: customer123

**Sample Products:**
- Website Công ty Chuyên nghiệp
- Ứng dụng Mobile E-commerce
- Portfolio Cá nhân
- Website Thương mại điện tử
- Website Tin tức

## 🔧 Environment Variables

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/waterdg_shop
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
```

## 🚀 Deployment

1. Cài đặt MongoDB trên server
2. Cấu hình environment variables
3. Chạy `npm run seed` để khởi tạo data
4. Chạy `npm start` để khởi động server

## 📝 License

MIT License - Waterdg Việt Nam
