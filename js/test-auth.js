// Test Authentication Logic
function testAuthLogic() {
    console.log('🧪 Testing Authentication Logic...');
    
    // Test 1: Check initial state
    console.log('\n1. Initial State:');
    debugAuthState();
    
    // Test 2: Simulate login
    console.log('\n2. Simulating login...');
    const mockUser = {
        id: 'test123',
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        role: 'customer'
    };
    
    // Simulate successful login
    api.setToken('mock-token-123');
    updateUIForLoggedInUser(mockUser);
    
    console.log('\n3. After Login:');
    debugAuthState();
    
    // Test 3: Simulate logout
    console.log('\n4. Simulating logout...');
    api.setToken(null);
    showAuthButtons();
    
    console.log('\n5. After Logout:');
    debugAuthState();
    
    console.log('\n✅ Test completed!');
}

// Add test function to window
window.testAuthLogic = testAuthLogic;

// Auto-run test on page load for debugging
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        console.log('🔧 Authentication test available. Run testAuthLogic() in console.');
    }, 2000);
});
