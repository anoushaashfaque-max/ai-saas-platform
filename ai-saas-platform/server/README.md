# AI SaaS Platform - Backend Server

Complete backend server for the AI SaaS Platform with full functionality.

## Features

- ✅ User authentication with Clerk
- ✅ Article generation using OpenAI
- ✅ Blog title generation
- ✅ Resume review
- ✅ Image generation (Pro feature)
- ✅ Background removal (Pro feature)
- ✅ Object removal (Pro feature)
- ✅ Stripe payment integration
- ✅ Credit system
- ✅ Pro subscription management
- ✅ Dashboard with stats
- ✅ Creation history
- ✅ Rate limiting
- ✅ Error handling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file from `.env.example`:
```bash
cp .env.example .env
```

3. Fill in all environment variables in `.env`

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Environment Variables

See `.env.example` for all required environment variables.

## API Endpoints

### Authentication
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile

### Articles
- `POST /api/articles/generate` - Generate article
- `POST /api/articles/blog-titles` - Generate blog titles
- `POST /api/articles/review-resume` - Review resume

### Images (Pro Only)
- `POST /api/images/generate` - Generate image
- `POST /api/images/remove-background` - Remove background
- `POST /api/images/remove-object` - Remove object

### Payments
- `POST /api/payments/checkout/pro` - Create Pro checkout session
- `POST /api/payments/checkout/credits` - Purchase credits
- `POST /api/payments/webhook` - Stripe webhook
- `GET /api/payments/history` - Get payment history

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard stats
- `GET /api/dashboard/creations` - Get all creations
- `GET /api/dashboard/creations/:id` - Get single creation
- `DELETE /api/dashboard/creations/:id` - Delete creation

## Credits System

- Free users get 10 credits on signup
- Article generation: 1 credit
- Blog titles: 1 credit
- Resume review: 2 credits
- Pro users have unlimited credits
- Image tools are Pro-only features

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- Clerk for authentication
- OpenAI for text generation
- Stripe for payments
- Replicate/Stable Diffusion for images
- Remove.bg for background removal
