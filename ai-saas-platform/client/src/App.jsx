import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignUp } from '@clerk/clerk-react';

import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import ToolDetail from './pages/ToolDetail';
import Features from './pages/Features';
import Contact from './pages/Contact';

import './App.css';

if (!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

function App() {
  return (
    <ClerkProvider
      publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}
      afterSignInUrl="/"
      afterSignUpUrl="/"
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      appearance={{
        variables: {
          colorPrimary: '#3b82f6',
          colorBackground: '#ffffff',
          colorInputBackground: '#f8fafc',
          colorInputText: '#1e293b',
          borderRadius: '8px'
        },
        elements: {
          formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
          card: 'shadow-lg border-0',
          headerTitle: 'text-2xl font-bold text-gray-900',
          headerSubtitle: 'text-gray-600',
          socialButtonsBlockButton: 'border border-gray-300 hover:border-gray-400',
          dividerLine: 'bg-gray-200',
          dividerText: 'text-gray-500',
          formFieldInput: 'border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500',
          footerActionLink: 'text-blue-600 hover:text-blue-700',
          identityPreviewEditButton: 'text-blue-600 hover:text-blue-700'
        }
      }}
    >
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/features" element={<Features />} />
            <Route path="/contact" element={<Contact />} />
          </Route>

          {/* Protected Tool Route */}
          <Route element={<MainLayout />}>
            <Route path="/tools/:toolId" element={
              <SignedIn>
                <ToolDetail />
              </SignedIn>
            } />
          </Route>

          {/* Clerk Auth Routes */}
          <Route path="/sign-in/*" element={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md">
                <SignIn routing="path" path="/sign-in" />
              </div>
            </div>
          } />
          <Route path="/sign-up/*" element={
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
              <div className="w-full max-w-md">
                <SignUp routing="path" path="/sign-up" />
              </div>
            </div>
          } />

          {/* Protected Dashboard/Admin Routes */}
          <Route element={<SignedIn><MainLayout /></SignedIn>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;
