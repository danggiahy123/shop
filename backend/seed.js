const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/waterdg_shop', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ Connected to MongoDB');
  seedDatabase();
})
.catch((error) => {
  console.error('❌ MongoDB connection error:', error);
  process.exit(1);
});

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'Waterdg',
      email: 'admin@waterdg.vn',
      phone: '0123456789',
      password: 'admin123456',
      role: 'super_admin',
      company: 'Waterdg Việt Nam'
    });
    await adminUser.save();
    console.log('👤 Created admin user: admin@waterdg.vn / admin123456');

    // Create sample customer
    const customerUser = new User({
      firstName: 'Nguyễn',
      lastName: 'Văn A',
      email: 'customer@example.com',
      phone: '0987654321',
      password: 'customer123',
      role: 'customer',
      company: 'Công ty ABC'
    });
    await customerUser.save();
    console.log('👤 Created customer user: customer@example.com / customer123');

    // Create sample products
    const products = [
      {
        name: 'Website Công ty Chuyên nghiệp',
        description: 'Website công ty với thiết kế hiện đại, responsive, tối ưu SEO. Bao gồm trang chủ, giới thiệu, sản phẩm, tin tức, liên hệ.',
        shortDescription: 'Website công ty chuyên nghiệp với thiết kế hiện đại',
        price: 5000000,
        originalPrice: 7000000,
        category: 'website',
        subcategory: 'corporate',
        images: [
          {
            url: '/uploads/products/website-corporate-1.jpg',
            alt: 'Website công ty',
            isPrimary: true
          }
        ],
        features: [
          { name: 'Responsive Design', description: 'Tương thích mọi thiết bị', icon: 'fas fa-mobile-alt' },
          { name: 'SEO Optimization', description: 'Tối ưu công cụ tìm kiếm', icon: 'fas fa-search' },
          { name: 'Admin Panel', description: 'Quản lý nội dung dễ dàng', icon: 'fas fa-cog' }
        ],
        tags: ['website', 'corporate', 'responsive', 'seo'],
        stock: 10,
        sku: 'WDG-WEB-001',
        status: 'active',
        isFeatured: true,
        isHot: true,
        createdBy: adminUser._id
      },
      {
        name: 'Ứng dụng Mobile E-commerce',
        description: 'Ứng dụng mobile thương mại điện tử với đầy đủ tính năng: đăng ký, đăng nhập, duyệt sản phẩm, giỏ hàng, thanh toán.',
        shortDescription: 'App mobile thương mại điện tử đầy đủ tính năng',
        price: 15000000,
        originalPrice: 20000000,
        category: 'mobile_app',
        subcategory: 'ecommerce',
        images: [
          {
            url: '/uploads/products/mobile-ecommerce-1.jpg',
            alt: 'Mobile E-commerce App',
            isPrimary: true
          }
        ],
        features: [
          { name: 'iOS & Android', description: 'Hỗ trợ cả hai nền tảng', icon: 'fas fa-mobile-alt' },
          { name: 'Payment Gateway', description: 'Tích hợp thanh toán', icon: 'fas fa-credit-card' },
          { name: 'Push Notifications', description: 'Thông báo đẩy', icon: 'fas fa-bell' }
        ],
        tags: ['mobile', 'ecommerce', 'ios', 'android'],
        stock: 5,
        sku: 'WDG-MOB-001',
        status: 'active',
        isFeatured: true,
        isHot: true,
        createdBy: adminUser._id
      },
      {
        name: 'Portfolio Cá nhân',
        description: 'Website portfolio cá nhân với thiết kế sáng tạo, showcase dự án, blog cá nhân, liên hệ.',
        shortDescription: 'Website portfolio cá nhân sáng tạo',
        price: 3000000,
        originalPrice: 4000000,
        category: 'portfolio',
        subcategory: 'personal',
        images: [
          {
            url: '/uploads/products/portfolio-personal-1.jpg',
            alt: 'Portfolio cá nhân',
            isPrimary: true
          }
        ],
        features: [
          { name: 'Creative Design', description: 'Thiết kế sáng tạo', icon: 'fas fa-palette' },
          { name: 'Project Showcase', description: 'Trưng bày dự án', icon: 'fas fa-project-diagram' },
          { name: 'Blog Integration', description: 'Tích hợp blog', icon: 'fas fa-blog' }
        ],
        tags: ['portfolio', 'personal', 'creative', 'blog'],
        stock: 15,
        sku: 'WDG-POR-001',
        status: 'active',
        isFeatured: false,
        isHot: true,
        createdBy: adminUser._id
      },
      {
        name: 'Website Thương mại điện tử',
        description: 'Website thương mại điện tử hoàn chỉnh với hệ thống quản lý sản phẩm, đơn hàng, khách hàng.',
        shortDescription: 'Website thương mại điện tử hoàn chỉnh',
        price: 12000000,
        originalPrice: 15000000,
        category: 'ecommerce',
        subcategory: 'online-store',
        images: [
          {
            url: '/uploads/products/ecommerce-store-1.jpg',
            alt: 'E-commerce Website',
            isPrimary: true
          }
        ],
        features: [
          { name: 'Product Management', description: 'Quản lý sản phẩm', icon: 'fas fa-box' },
          { name: 'Order Management', description: 'Quản lý đơn hàng', icon: 'fas fa-shopping-cart' },
          { name: 'Customer Portal', description: 'Cổng khách hàng', icon: 'fas fa-users' }
        ],
        tags: ['ecommerce', 'online-store', 'management', 'portal'],
        stock: 8,
        sku: 'WDG-ECO-001',
        status: 'active',
        isFeatured: true,
        isHot: false,
        createdBy: adminUser._id
      },
      {
        name: 'Website Tin tức',
        description: 'Website tin tức với hệ thống quản lý bài viết, phân loại, tìm kiếm, bình luận.',
        shortDescription: 'Website tin tức với hệ thống quản lý',
        price: 8000000,
        originalPrice: 10000000,
        category: 'website',
        subcategory: 'news',
        images: [
          {
            url: '/uploads/products/news-website-1.jpg',
            alt: 'Website tin tức',
            isPrimary: true
          }
        ],
        features: [
          { name: 'Content Management', description: 'Quản lý nội dung', icon: 'fas fa-edit' },
          { name: 'Category System', description: 'Hệ thống phân loại', icon: 'fas fa-tags' },
          { name: 'Comment System', description: 'Hệ thống bình luận', icon: 'fas fa-comments' }
        ],
        tags: ['website', 'news', 'cms', 'content'],
        stock: 12,
        sku: 'WDG-NEW-001',
        status: 'active',
        isFeatured: false,
        isHot: false,
        createdBy: adminUser._id
      }
    ];

    for (const productData of products) {
      const product = new Product(productData);
      await product.save();
    }

    console.log(`📦 Created ${products.length} sample products`);
    console.log('✅ Database seeding completed successfully!');
    console.log('\n📋 Sample Accounts:');
    console.log('   Admin: admin@waterdg.vn / admin123456');
    console.log('   Customer: customer@example.com / customer123');
    console.log('\n🚀 You can now start the server with: npm run dev');

    process.exit(0);

  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}
