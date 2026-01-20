# 🧪 Postman Testing Guide - AI SaaS Platform

## 📋 Overview
Complete API testing guide using Postman collection for the AI SaaS Platform.

## 🚀 Quick Setup

### 1. Import Collection
1. Open Postman
2. Click **Import** button
3. Select **File**
4. Choose `postman_collection.json`
5. Import the collection

### 2. Set Environment Variables
1. Create new environment in Postman
2. Add variables:
   - `base_url`: `http://localhost:5000`
   - `auth_token`: (leave empty, will be auto-set)

### 3. Start Servers
```bash
# Backend
cd server && npm run dev

# Frontend (new terminal)
cd ../client && npm run dev
```

---

## 🧪 Testing Scenarios

### ✅ **Scenario 1: Complete User Journey**

#### Step 1: Health Check
- **Request**: `GET /api/health`
- **Expected**: 200 OK with server status

#### Step 2: User Registration
- **Request**: `POST /api/auth/signup`
- **Body**:
  ```json
  {
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Expected**: 201 Created with user data and JWT token
- **Note**: Token is automatically saved to `auth_token` variable

#### Step 3: User Login
- **Request**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "email": "test@example.com",
    "password": "password123"
  }
  ```
- **Expected**: 200 OK with user data and JWT token

#### Step 4: Verify Authentication
- **Request**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer {{auth_token}}`
- **Expected**: 200 OK with current user data

#### Step 5: Test FREE Tools

**Article Writer:**
- **Request**: `POST /api/articles/generate`
- **Headers**: `Authorization: Bearer {{auth_token}}`
- **Body**:
  ```json
  {
    "topic": "Artificial Intelligence in Healthcare",
    "tone": "professional",
    "length": "medium"
  }
  ```
- **Expected**: 200 OK with generated article

**Blog Title Generator:**
- **Request**: `POST /api/articles/blog-titles`
- **Headers**: `Authorization: Bearer {{auth_token}}`
- **Body**:
  ```json
  {
    "keyword": "digital marketing",
    "tone": "engaging",
    "quantity": 5
  }
  ```
- **Expected**: 200 OK with generated blog titles

#### Step 6: Test PRO Tools (Should Fail)

**Resume Reviewer:**
- **Request**: `POST /api/articles/review-resume`
- **Headers**: `Authorization: Bearer {{auth_token}}`
- **Body**:
  ```json
  {
    "resumeText": "Experienced software developer..."
  }
  ```
- **Expected**: 403 Forbidden ("Pro subscription required")

#### Step 7: Upgrade to PRO (Mock)
- **Request**: `POST /api/payments/create-intent`
- **Headers**: `Authorization: Bearer {{auth_token}}`
- **Body**:
  ```json
  {
    "amount": 2900,
    "currency": "usd",
    "description": "Pro Plan Subscription"
  }
  ```
- **Expected**: 200 OK with Stripe payment intent

#### Step 8: Make User Admin
- **Request**: `POST /api/auth/make-admin`
- **Headers**: `Authorization: Bearer {{auth_token}}`
- **Expected**: 200 OK ("User promoted to admin")

#### Step 9: Test Admin Panel
- **Request**: `GET /api/admin/stats`
- **Headers**: `Authorization: Bearer {{auth_token}}`
- **Expected**: 200 OK with admin statistics

---

### ❌ **Scenario 2: Error Testing**

#### Unauthorized Access
- **Request**: `GET /api/auth/me` (without Authorization header)
- **Expected**: 401 Unauthorized

#### Invalid Token
- **Request**: `GET /api/auth/me`
- **Headers**: `Authorization: Bearer invalid_token`
- **Expected**: 401 Unauthorized

#### PRO Tool Without Subscription
- **Request**: `POST /api/articles/review-resume`
- **Headers**: `Authorization: Bearer {{auth_token}}`
- **Expected**: 403 Forbidden

#### Admin Access Without Admin Role
- **Request**: `GET /api/admin/stats` (as regular user)
- **Expected**: 403 Forbidden

---

## 📊 API Endpoints Summary

### 🔐 Authentication (Public)
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login

### 🔒 Protected Routes (Require JWT)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/make-admin` - Promote to admin

### 📝 FREE Tools (Require Login)
- `POST /api/articles/generate` - Article Writer
- `POST /api/articles/blog-titles` - Blog Generator

### 👑 PRO Tools (Require Login + Subscription)
- `POST /api/articles/review-resume` - Resume Reviewer
- `POST /api/images/generate` - Image Generator
- `POST /api/images/remove-background` - Background Removal
- `POST /api/images/remove-object` - Object Removal

### 💳 Payments (Require Login)
- `POST /api/payments/create-intent` - Create payment intent
- `GET /api/payments/history` - Payment history

### 📊 Dashboard (Require Login)
- `GET /api/dashboard/stats` - User dashboard stats

### 👨‍💼 Admin Panel (Require Login + Admin Role)
- `GET /api/admin/stats` - Admin statistics
- `GET /api/admin/users` - All users
- `GET /api/admin/payments` - All payments
- `GET /api/admin/creations` - All creations

---

## 🎯 Test Results Template

### ✅ Successful Tests
- [ ] Server Health Check
- [ ] User Registration
- [ ] User Login
- [ ] FREE Tools (Article Writer)
- [ ] FREE Tools (Blog Generator)
- [ ] PRO Tools Protection
- [ ] Payment Intent Creation
- [ ] Admin Promotion
- [ ] Admin Panel Access

### ❌ Error Tests
- [ ] Unauthorized Access (No Token)
- [ ] Invalid Token
- [ ] PRO Tool Without Subscription
- [ ] Admin Access Without Admin Role

---

## 🔧 Troubleshooting

### Common Issues:

1. **401 Unauthorized**
   - Check if JWT token is set in `{{auth_token}}` variable
   - Try login again to refresh token

2. **403 Forbidden**
   - For PRO tools: User needs subscription
   - For Admin routes: User needs admin role (use make-admin)

3. **500 Internal Server Error**
   - Check server console for errors
   - Ensure MongoDB is running
   - Check environment variables

4. **CORS Errors**
   - Frontend and backend should be on different ports
   - Frontend: http://localhost:5173
   - Backend: http://localhost:5000

---

## 🚀 Advanced Testing

### Rate Limiting Tests
- Try making multiple requests quickly
- Should get 429 Too Many Requests after limits

### Load Testing
- Use Postman Runner to run collection multiple times
- Monitor server performance

### Integration Testing
- Test complete user journey from signup to admin
- Verify data consistency across endpoints

---

## 📝 Notes

- All AI tools return mock responses (no real API costs)
- File uploads require actual image files for testing
- Stripe integration uses test mode
- Admin role is required for admin panel access
- FREE tools work for any logged-in user
- PRO tools require active subscription

**Happy Testing! 🎉**