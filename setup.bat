@echo off
echo ========================================
echo    Waterdg Việt Nam E-commerce Setup
echo ========================================
echo.

echo [1/4] Checking MongoDB...
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB not found. Please install MongoDB first.
    echo Download from: https://www.mongodb.com/try/download/community
    pause
    exit /b 1
)
echo ✅ MongoDB found

echo.
echo [2/4] Starting MongoDB service...
net start MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  MongoDB service not running. Starting manually...
    start "MongoDB" mongod --dbpath C:\data\db
    timeout /t 3 >nul
)

echo.
echo [3/4] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed

echo.
echo [4/4] Seeding database...
call npm run seed
if %errorlevel% neq 0 (
    echo ❌ Failed to seed database
    pause
    exit /b 1
)
echo ✅ Database seeded successfully

echo.
echo ========================================
echo 🚀 Setup completed successfully!
echo ========================================
echo.
echo 📋 Sample Accounts:
echo    Admin: admin@waterdg.vn / admin123456
echo    Customer: customer@example.com / customer123
echo.
echo 🌐 URLs:
echo    Frontend: http://localhost:3000
echo    Backend API: http://localhost:5000
echo.
echo 📝 Next steps:
echo    1. Start backend: cd backend && npm run dev
echo    2. Start frontend: npm run dev
echo.
pause
