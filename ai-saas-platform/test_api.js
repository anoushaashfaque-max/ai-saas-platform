// Quick API test script
const fetch = require('node-fetch');

async function testAPI() {
  try {
    console.log('Testing API endpoints...\n');

    // 1. Health check
    console.log('1. Health Check:');
    const health = await fetch('http://localhost:5000/api/health');
    const healthData = await health.json();
    console.log('Status:', health.status, healthData);

    // 2. Signup
    console.log('\n2. User Signup:');
    const signup = await fetch('http://localhost:5000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const signupData = await signup.json();
    console.log('Status:', signup.status, signupData);

    if (signupData.success) {
      const token = signupData.data.token;

      // 3. Login
      console.log('\n3. User Login:');
      const login = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      const loginData = await login.json();
      console.log('Status:', login.status, loginData);

      // 4. Test blog titles
      console.log('\n4. Blog Titles Generation:');
      const blogTitles = await fetch('http://localhost:5000/api/articles/blog-titles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          keyword: 'AI technology',
          tone: 'professional',
          quantity: 3
        })
      });
      const titlesData = await blogTitles.json();
      console.log('Status:', blogTitles.status, titlesData);
    }

  } catch (error) {
    console.error('Test failed:', error.message);
  }
}

testAPI();