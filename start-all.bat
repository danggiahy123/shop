@echo off
echo ========================================
echo    Waterdg E-commerce - Start All
echo ========================================
echo.

echo [1/3] Checking if backend is running...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is already running
) else (
    echo ⚠️  Backend not running. Starting backend...
    start "Backend Server" cmd /k "cd backend && npm run dev"
    echo Waiting for backend to start...
    timeout /t 5 >nul
)

echo.
echo [2/3] Checking if frontend is running...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Frontend is already running
) else (
    echo ⚠️  Frontend not running. Starting frontend...
    start "Frontend Server" cmd /k "npm run dev"
    echo Waiting for frontend to start...
    timeout /t 3 >nul
)

echo.
echo [3/3] Opening browser...
timeout /t 2 >nul
start http://localhost:3000

echo.
echo ========================================
echo 🚀 All services started!
echo ========================================
echo.
echo 🌐 URLs:
echo    Frontend: http://localhost:3000
echo    Backend:  http://localhost:5000
echo.
echo 📋 Sample Accounts:
echo    Admin: admin@waterdg.vn / admin123456
echo    Customer: customer@example.com / customer123
echo.
echo 💡 Use the "Test API" button on the frontend to verify integration
echo.
pause
