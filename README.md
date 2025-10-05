# Waterdg Việt Nam - E-commerce Platform

Hệ thống thương mại điện tử hoàn chỉnh với frontend hiện đại và backend API mạnh mẽ.

## 🚀 Tính năng chính

### Frontend (React/Vanilla JS)
- **Giao diện hiện đại** với sidebar navigation
- **Trang chủ giới thiệu** chuyên nghiệp
- **Hệ thống đăng nhập/đăng ký** với validation
- **Responsive design** cho mọi thiết bị
- **Animations** và effects mượt mà

### Backend (Node.js + MongoDB)
- **RESTful API** với Express.js
- **Authentication** với JWT tokens
- **Role-based access control** (Customer, Admin, Super Admin)
- **Product management** với upload hình ảnh
- **Order management** với tracking
- **User management** và dashboard

## 🛠️ Công nghệ sử dụng

### Frontend
- HTML5, CSS3, JavaScript (ES6+)
- Vite cho development server
- Font Awesome icons
- Responsive CSS Grid & Flexbox

### Backend
- Node.js với Express.js
- MongoDB với Mongoose ODM
- JWT authentication
- Multer cho file upload
- Bcrypt cho password hashing
- Express-validator cho validation

## 📋 Yêu cầu hệ thống

- Node.js >= 14.0.0
- MongoDB >= 4.0
- npm hoặc yarn

## 🚀 Cài đặt nhanh

### Windows
```bash
# Chạy script setup tự động
setup.bat
```

### macOS/Linux
```bash
# Chạy script setup tự động
chmod +x setup.sh
./setup.sh
```

### Cài đặt thủ công

1. **Clone repository:**
```bash
git clone <repository-url>
cd shop
```

2. **Cài đặt frontend dependencies:**
```bash
npm install
```

3. **Cài đặt backend dependencies:**
```bash
cd backend
npm install
```

4. **Cấu hình MongoDB:**
```bash
# Khởi động MongoDB
mongod

# Hoặc với Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

5. **Khởi tạo database:**
```bash
cd backend
npm run seed
```

6. **Chạy ứng dụng:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm run dev
```

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000
- **API Documentation:** http://localhost:5000/api/health

## 👤 Tài khoản mẫu

Sau khi chạy `npm run seed`, bạn sẽ có:

### Admin Account
- **Email:** admin@waterdg.vn
- **Password:** admin123456
- **Role:** Super Admin

### Customer Account
- **Email:** customer@example.com
- **Password:** customer123
- **Role:** Customer

## 📁 Cấu trúc project

```
shop/
├── backend/                 # Backend API
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── uploads/           # Uploaded files
│   ├── server.js          # Main server
│   └── package.json
├── css/                   # Stylesheets
│   ├── base.css
│   ├── sidebar.css
│   ├── auth.css
│   └── main.css
├── js/                    # JavaScript files
│   ├── api.js             # API communication
│   ├── auth.js            # Authentication
│   └── app.js             # Main app logic
├── index.html             # Main HTML file
├── package.json           # Frontend dependencies
├── vite.config.js         # Vite configuration
└── README.md
```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `GET /api/auth/me` - Thông tin user
- `PUT /api/auth/profile` - Cập nhật profile

### Products
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `GET /api/products/featured` - Sản phẩm nổi bật
- `GET /api/products/hot` - Sản phẩm hot

### Admin
- `GET /api/admin/products` - Quản lý sản phẩm
- `POST /api/admin/products` - Tạo sản phẩm
- `PUT /api/admin/products/:id` - Cập nhật sản phẩm
- `DELETE /api/admin/products/:id` - Xóa sản phẩm

### Orders
- `POST /api/orders` - Tạo đơn hàng
- `GET /api/orders` - Lịch sử đơn hàng
- `PUT /api/orders/:id/cancel` - Hủy đơn hàng

## 🎯 Tính năng nổi bật

### Frontend
- ✅ **Sidebar navigation** với animations
- ✅ **Authentication forms** với validation
- ✅ **Responsive design** cho mobile/tablet
- ✅ **Modern UI/UX** với gradients và shadows
- ✅ **Hot reload** với Vite
- ✅ **Professional color scheme**

### Backend
- ✅ **JWT Authentication** với refresh tokens
- ✅ **Role-based permissions** (Customer/Admin/Super Admin)
- ✅ **File upload** với Multer
- ✅ **Data validation** với express-validator
- ✅ **Error handling** và logging
- ✅ **Rate limiting** cho security
- ✅ **MongoDB integration** với Mongoose

### Database
- ✅ **User management** với profiles
- ✅ **Product catalog** với categories
- ✅ **Order system** với tracking
- ✅ **Review system** với ratings
- ✅ **Admin dashboard** với statistics

## 🔧 Development

### Frontend Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development
```bash
cd backend

# Start development server
npm run dev

# Seed database
npm run seed

# Run tests
npm test
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/DigitalOcean)
```bash
cd backend
# Set environment variables
# Deploy with PM2 or similar
```

## 📝 License

MIT License - Waterdg Việt Nam

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

- **Email:** support@waterdg.vn
- **Website:** https://waterdg.vn
- **Phone:** +84 xxx xxx xxx

---

Made with ❤️ by Waterdg Việt Nam