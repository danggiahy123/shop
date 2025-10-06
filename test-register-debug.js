// Test register functionality
console.log('🧪 Testing register functionality...');

// Check if forms exist
const registerForm = document.getElementById('registerForm');
console.log('📋 Register form:', !!registerForm);

if (registerForm) {
    console.log('🔍 Register form elements:');
    console.log('- Username input:', !!document.getElementById('registerUsername'));
    console.log('- Password input:', !!document.getElementById('registerPassword'));
    console.log('- Confirm password input:', !!document.getElementById('confirmPassword'));
}

// Check if rightSidebarAuth exists
console.log('🔍 rightSidebarAuth:', !!window.rightSidebarAuth);
console.log('🔍 RightSidebarAuth class:', typeof RightSidebarAuth);

// Test API
const testRegisterAPI = async () => {
    try {
        console.log('📡 Testing register API...');
        
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: `testuser${Date.now()}`,
                password: 'password123',
                confirmPassword: 'password123'
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Register API works:', data.message);
        } else {
            const errorData = await response.text();
            console.log('❌ Register API error:', response.status, errorData);
        }
    } catch (error) {
        console.error('❌ Register API test failed:', error.message);
    }
};

// Test form submission manually
const testFormSubmission = () => {
    console.log('📝 Testing form submission...');
    
    if (registerForm) {
        console.log('🔍 Testing register form submission...');
        
        // Fill form
        const usernameInput = document.getElementById('registerUsername');
        const passwordInput = document.getElementById('registerPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        
        if (usernameInput && passwordInput && confirmPasswordInput) {
            usernameInput.value = `testuser${Date.now()}`;
            passwordInput.value = 'password123';
            confirmPasswordInput.value = 'password123';
            
            console.log('📝 Form filled, triggering submit...');
            
            // Trigger submit event
            const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
            registerForm.dispatchEvent(submitEvent);
        } else {
            console.log('❌ Form inputs not found');
        }
    } else {
        console.log('❌ Register form not found');
    }
};

// Run tests
testRegisterAPI();

setTimeout(() => {
    testFormSubmission();
}, 2000);

