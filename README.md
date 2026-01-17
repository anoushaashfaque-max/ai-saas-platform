#  AI SaaS Platform

A production-ready MERN stack SaaS application featuring 6 AI-powered content creation tools with freemium monetization and secure payment processing.

## ✨ Features

### AI Tools
- **📝 Article Writer** - Generate SEO-optimized articles (FREE)
- **📝 Blog Generator** - Create engaging blog titles (FREE)
- **🖼️ Image Generator** - AI-powered image creation (PRO)
- **🎨 Background Removal** - Remove image backgrounds (PRO)
- **✂️ Object Removal** - Erase unwanted objects (PRO)
- **📄 Resume Reviewer** - AI-powered resume analysis (PRO)

### 💰 Pricing
- **FREE**: Unlimited access to Article & Blog tools
- **PRO**: $29/month - All 6 tools + premium features

### 🛡️ Security & Analytics
- Secure authentication with Clerk
- Stripe payment processing
- Usage analytics & dashboards
- Rate limiting & data protection

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Git

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd ai-saas-platform

# Backend setup
cd server
npm install
cp .env.example .env  # Configure API keys
npm run dev

# Frontend setup (new terminal)
cd ../client
npm install
echo "VITE_CLERK_PUBLISHABLE_KEY=your_key" > .env
npm run dev
```

**Access**: http://localhost:5173 (Frontend) | http://localhost:5000 (Backend API)

---

## 🛠️ Tech Stack

**Frontend**: React 19, Tailwind CSS, Vite, Clerk Authentication
**Backend**: Node.js, Express.js, MongoDB, Stripe Payments
**AI Services**: OpenAI GPT, Image Processing APIs
**Deployment**: Vercel/Railway, MongoDB Atlas

---

## 📊 Project Stats

- **6 AI Tools** - Content creation, image processing, resume analysis
- **Freemium Model** - Free access to core tools, Pro subscriptions
- **Production Ready** - Error handling, security, scalability
- **API Coverage** - 15+ endpoints with comprehensive testing

---

## 🔑 Environment Setup

Create `.env` files in server/ and client/ directories:

```env
# Backend (.env)
MONGODB_URI=your_mongodb_connection
CLERK_SECRET_KEY=your_clerk_secret
STRIPE_SECRET_KEY=your_stripe_secret
OPENAI_API_KEY=your_openai_key

# Frontend (.env)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_public_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
```

---

## 🧪 Testing

### API Testing with Postman
- **Collection**: `postman_collection.json` - Pre-configured requests for all endpoints
- **Coverage**: Authentication, AI tools, payments, analytics, admin features
- **Manual Testing**: Complete workflow validation

### Testing Checklist
- ✅ User authentication and registration
- ✅ FREE tools (Article Writer, Blog Generator)
- ✅ PRO tools access control and restrictions
- ✅ Payment processing and subscriptions
- ✅ Dashboard analytics and usage tracking
- ✅ Admin panel functionality (admin users only)

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0 or higher
- **MongoDB** (local installation or MongoDB Atlas cloud)
- **npm** or **yarn** package manager
- **Git** for cloning the repository

### Installation & Setup

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd ai-saas-platform
```

#### 2. Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env with your API keys (see Environment Setup section below)
# Required: MONGODB_URI, CLERK_SECRET_KEY, STRIPE_SECRET_KEY, OPENAI_API_KEY

# Start development server
npm run dev
```
**Server will run on:** `http://localhost:5000`

#### 3. Frontend Setup
```bash
cd client

# Install dependencies
npm install

# Create environment file with Clerk publishable key
echo "VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here" > .env

# Start development server
npm run dev
```
**Frontend will run on:** `http://localhost:5173`

#### 4. Access the Application
- 🌐 **Frontend:** [http://localhost:5173](http://localhost:5173)
- 🚀 **Backend API:** [http://localhost:5000](http://localhost:5000)
- 💚 **Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

### First Steps
1. **Register** a new account on the frontend
2. **Verify** your email through Clerk
3. **Generate** your first article (free tool)
4. **Upgrade** to Pro to access premium tools
5. **Explore** the dashboard and admin features

**📖 Detailed Setup Guide:** See [QUICK_START.md](./QUICK_START.md) for comprehensive instructions

---

## 🛠️ **Tech Stack**

### **Frontend**
- ⚛️ **React 19** - Modern UI with hooks & concurrent features
- ⚡ **Vite** - Lightning-fast build tool
- 🎨 **Tailwind CSS** - Beautiful, responsive styling
- 🔐 **Clerk** - Authentication & user management
- 💳 **Stripe** - Secure payment processing

### **Backend**
- 🟢 **Node.js 18+** - JavaScript runtime
- 🚀 **Express.js** - Fast web framework
- 🍃 **MongoDB Atlas** - Cloud database
- 🤖 **OpenAI** - AI content generation
- 🖼️ **Cloudinary** - Image processing

### **Key Features**
- 🔒 **Secure Authentication** with Clerk
- 💰 **Stripe Subscriptions** for payments
- 📊 **Usage Analytics** & dashboards
- 🎯 **Rate Limiting** & security
- 📱 **Mobile Responsive** design

---



```
ai-saas-platform/
├── client/                     # React Frontend Application
│   ├── public/                 # Static assets (Vite favicon, etc.)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Shared components (Button, PaymentModal)
│   │   │   ├── dashboard/      # Dashboard-specific components
│   │   │   ├── features/       # AI tool components (6 tools implemented)
│   │   │   │   ├── ArticleWriter.jsx
│   │   │   │   ├── BlogTitleGenerator.jsx
│   │   │   │   ├── ImageGenerator.jsx
│   │   │   │   ├── BackgroundRemoval.jsx
│   │   │   │   ├── ObjectRemoval.jsx
│   │   │   │   └── ResumeReviewer.jsx
│   │   │   └── layout/         # Layout components (Header, Footer, etc.)
│   │   ├── contexts/           # React contexts
│   │   │   └── AuthContext.jsx # Authentication context
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useApi.js       # API communication hook
│   │   │   ├── useAuth.js      # Authentication hook
│   │   │   └── useLocalStorage.js # localStorage management
│   │   ├── pages/              # Page components
│   │   │   ├── Home.jsx        # Landing page with pricing
│   │   │   ├── Dashboard.jsx   # User dashboard with stats
│   │   │   ├── AdminDashboard.jsx # Admin panel
│   │   │   ├── Features.jsx    # Features showcase page
│   │   │   ├── Contact.jsx     # Contact form page
│   │   │   ├── ToolDetail.jsx  # Individual tool interfaces
│   │   │   └── (Login/Signup redirects to Clerk)
│   │   ├── services/           # API service functions
│   │   │   ├── authService.js  # Authentication services
│   │   │   ├── paymentService.js # Stripe payment services
│   │   │   └── toolService.js  # AI tool API services
│   │   ├── styles/             # Styling files
│   │   │   ├── globals.css     # Global Tailwind styles
│   │   │   └── animation.css   # Custom animations
│   │   ├── utils/              # Utility functions
│   │   │   ├── api.js          # Axios API client setup
│   │   │   ├── constant.js     # Application constants
│   │   │   ├── formatters.js   # Data formatting utilities
│   │   │   └── helpers.js      # General helper functions
│   │   ├── App.jsx             # Main app component with routing
│   │   ├── main.jsx            # React app entry point
│   │   └── index.css           # Global CSS imports
│   ├── package.json
│   ├── tailwind.config.js      # Tailwind configuration
│   └── vite.config.js          # Vite configuration
│
├── server/                     # Node.js Express Backend Application
│   ├── config/                 # Configuration files
│   │   ├── clerk.js            # Clerk authentication configuration
│   │   └── database.js         # MongoDB connection setup
│   ├── controllers/            # Route controllers (business logic)
│   │   ├── articleController.js # Article/blog generation logic
│   │   ├── authController.js   # Authentication endpoints
│   │   ├── dashboardController.js # Dashboard statistics
│   │   ├── imageController.js  # Image processing (generation, editing)
│   │   ├── paymentController.js # Stripe payment processing
│   │   └── adminController.js  # Admin panel functionality
│   ├── middleware/             # Express middleware functions
│   │   ├── auth.js             # Authentication middleware (ensureUser, requirePro, requireAdmin)
│   │   ├── mockAuth.js         # Mock authentication for development
│   │   └── rateLimiter.js      # API rate limiting (generationLimiter, paymentLimiter, apiLimiter)
│   ├── models/                 # Mongoose database models
│   │   ├── User.js             # User schema (clerkId, isPro, subscription, etc.)
│   │   ├── Payment.js          # Payment transactions (Stripe integration)
│   │   └── Creation.js         # AI content creations tracking
│   ├── routes/                 # API route definitions
│   │   ├── articleRoutes.js    # Article/blog generation endpoints
│   │   ├── authRoutes.js       # Authentication routes
│   │   ├── dashboardRoutes.js  # User dashboard data
│   │   ├── imageRoutes.js      # Image processing routes
│   │   ├── paymentRoutes.js    # Stripe payment/checkout routes
│   │   └── adminRoutes.js      # Admin management routes
│   ├── services/               # External service integrations
│   │   ├── aiMockService.js    # Mock AI responses for development
│   │   ├── huggingfaceService.js # HuggingFace AI integration
│   │   ├── openaiService.js    # OpenAI API integration
│   │   ├── removeBgService.js  # Background removal service
│   │   ├── stableDiffusionService.js # Image generation
│   │   └── stripeService.js    # Stripe payment processing
│   ├── server.js               # Main Express server file
│   ├── package.json
│   └── README.md
│
├── README.md                   # This file

```


