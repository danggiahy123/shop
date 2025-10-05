// Test API Integration
async function testAPI() {
    console.log('🧪 Testing API Integration...');
    
    try {
        // Test 1: Health check
        console.log('1. Testing health check...');
        const healthResponse = await fetch('http://localhost:5000/api/health');
        const healthData = await healthResponse.json();
        console.log('✅ Health check:', healthData);
        
        // Test 2: Get products
        console.log('2. Testing get products...');
        const productsResponse = await fetch('http://localhost:5000/api/products');
        const productsData = await productsResponse.json();
        console.log('✅ Products:', productsData.products?.length || 0, 'products found');
        
        // Test 3: Register new user
        console.log('3. Testing user registration...');
        const testUser = {
            firstName: 'Test',
            lastName: 'User',
            email: `test${Date.now()}@example.com`,
            phone: '0123456789',
            password: 'test123456',
            company: 'Test Company'
        };
        
        const registerResponse = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(testUser)
        });
        
        if (registerResponse.ok) {
            const registerData = await registerResponse.json();
            console.log('✅ Registration successful:', registerData.user.email);
            
            // Test 4: Login
            console.log('4. Testing user login...');
            const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: testUser.email,
                    password: testUser.password
                })
            });
            
            if (loginResponse.ok) {
                const loginData = await loginResponse.json();
                console.log('✅ Login successful:', loginData.user.email);
                console.log('✅ Token received:', loginData.token ? 'Yes' : 'No');
                
                // Test 5: Get current user
                console.log('5. Testing get current user...');
                const meResponse = await fetch('http://localhost:5000/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${loginData.token}`
                    }
                });
                
                if (meResponse.ok) {
                    const meData = await meResponse.json();
                    console.log('✅ Get current user:', meData.user.email);
                } else {
                    console.log('❌ Get current user failed');
                }
            } else {
                console.log('❌ Login failed');
            }
        } else {
            console.log('❌ Registration failed');
        }
        
        console.log('🎉 API Integration test completed!');
        
    } catch (error) {
        console.error('❌ API Test failed:', error);
        console.log('💡 Make sure backend is running on http://localhost:5000');
    }
}

// Run test when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Add test button to page
    const testButton = document.createElement('button');
    testButton.textContent = 'Test API';
    testButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #3b82f6;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 8px;
        cursor: pointer;
        z-index: 1000;
        font-size: 14px;
    `;
    testButton.onclick = testAPI;
    document.body.appendChild(testButton);
    
    // Auto-run test if backend is available
    setTimeout(async () => {
        try {
            const response = await fetch('http://localhost:5000/api/health');
            if (response.ok) {
                console.log('🚀 Backend detected! You can test API integration.');
                testButton.style.background = '#10b981';
                testButton.textContent = '✅ Backend Ready';
            }
        } catch (error) {
            console.log('⚠️ Backend not running. Start backend with: cd backend && npm run dev');
            testButton.style.background = '#ef4444';
            testButton.textContent = '❌ No Backend';
        }
    }, 1000);
});
