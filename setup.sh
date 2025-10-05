#!/bin/bash

echo "========================================"
echo "   Waterdg Việt Nam E-commerce Setup"
echo "========================================"
echo

echo "[1/4] Checking MongoDB..."
if ! command -v mongod &> /dev/null; then
    echo "❌ MongoDB not found. Please install MongoDB first."
    echo "Install with: brew install mongodb-community (macOS) or apt-get install mongodb (Ubuntu)"
    exit 1
fi
echo "✅ MongoDB found"

echo
echo "[2/4] Starting MongoDB service..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB not running. Starting manually..."
    mongod --fork --logpath /var/log/mongodb.log --dbpath /var/lib/mongodb
    sleep 3
fi

echo
echo "[3/4] Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install backend dependencies"
    exit 1
fi
echo "✅ Backend dependencies installed"

echo
echo "[4/4] Seeding database..."
npm run seed
if [ $? -ne 0 ]; then
    echo "❌ Failed to seed database"
    exit 1
fi
echo "✅ Database seeded successfully"

echo
echo "========================================"
echo "🚀 Setup completed successfully!"
echo "========================================"
echo
echo "📋 Sample Accounts:"
echo "   Admin: admin@waterdg.vn / admin123456"
echo "   Customer: customer@example.com / customer123"
echo
echo "🌐 URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo
echo "📝 Next steps:"
echo "   1. Start backend: cd backend && npm run dev"
echo "   2. Start frontend: npm run dev"
echo
