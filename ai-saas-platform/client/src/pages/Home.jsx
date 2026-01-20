import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check, Sparkles, Zap, Shield, Users } from 'lucide-react';
import Button from '../components/common/Button';
import PaymentModal from '../components/common/PaymentModal';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user } = useAuth();

  const aiTools = [
    { icon: '📝', name: 'Article Writer', desc: 'Generate high-quality articles', color: 'from-blue-500 to-cyan-500' },
    { icon: '✍️', name: 'Blog Generator', desc: 'Create engaging blog posts', color: 'from-purple-500 to-pink-500' },
    { icon: '🖼️', name: 'Image Generator', desc: 'Create stunning AI images', color: 'from-green-500 to-emerald-500' },
    { icon: '🎨', name: 'Background Removal', desc: 'Remove backgrounds instantly', color: 'from-orange-500 to-red-500' },
    { icon: '✂️', name: 'Object Removal', desc: 'Remove objects from images', color: 'from-indigo-500 to-purple-500' },
    { icon: '📄', name: 'Resume Reviewer', desc: 'Get AI-powered resume feedback', color: 'from-yellow-500 to-orange-500' },
  ];

  const features = [
    { icon: <Zap className="h-6 w-6" />, title: 'Fast Generation', desc: 'Get results in seconds' },
    { icon: <Shield className="h-6 w-6" />, title: 'Secure & Private', desc: 'Your data stays protected' },
    { icon: <Sparkles className="h-6 w-6" />, title: 'High Quality', desc: 'Professional-grade output' },
    { icon: <Users className="h-6 w-6" />, title: 'Easy to Use', desc: 'No technical skills needed' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50" />
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 mb-6">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Content Creation
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Create Amazing Content with{' '}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Magic
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10">
              {user ?
                'Welcome back! Access all your favorite AI tools and create amazing content.' :
                'Generate articles, blogs, images, and more with our powerful AI tools. Perfect for creators, marketers, and businesses.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                // Show dashboard button for logged-in users
                <Link to="/dashboard">
                  <Button size="large">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              ) : (
                // Show signup buttons for non-logged-in users
                <>
                  <Link to="/login">
                    <Button size="large">
                      Start Free Trial
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="large" onClick={() => setShowPaymentModal(true)}>
                    View Pricing
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AI Tools Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">AI Tools</h2>
            <p className="text-gray-600 text-lg">
              {user ?
                'FREE tools work instantly. Upgrade to PRO for premium features.' :
                'Click any tool to start creating instantly'
              }
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aiTools.map((tool, index) => {
              // Map tool names to correct IDs
              const toolIdMap = {
                'Article Writer': 'article-writer',
                'Blog Generator': 'blog-generator',
                'Image Generator': 'image-generator',
                'Background Removal': 'background-removal',
                'Object Removal': 'object-removal',
                'Resume Reviewer': 'resume-reviewer',
              };
              const toolId = toolIdMap[tool.name] || tool.name.toLowerCase().replace(' ', '-');
              
              return (
              <Link
                key={index}
                to={`/tools/${toolId}`}
                className="group"
              >
                <div className="bg-white border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center mb-6`}>
                    <span className="text-2xl">{tool.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3">{tool.name}</h3>
                  <p className="text-gray-600 mb-4">{tool.desc}</p>
                  <div className="flex items-center text-blue-600 font-semibold">
                    Try Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Choose Us</h2>
            <p className="text-gray-600">Everything you need for AI content creation</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border">
                <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-gray-600">No hidden fees. Cancel anytime.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="border rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-4">Free</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold">$0</span>
                <span className="text-gray-500">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Article & Blog Tools', 'Unlimited Generations', 'Standard Support', 'Basic Features'].map((item) => (
                  <li key={item} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/sign-up">
                <Button variant="outline" className="w-full">
                  Get Started Free
                </Button>
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <div className="bg-yellow-500 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  POPULAR
                </div>
              </div>

              <h3 className="text-2xl font-bold mb-4">Pro</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold">$29</span>
                <span className="opacity-80">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['All 6 AI Tools', 'Unlimited Generations', 'Priority Support', 'No Watermarks', 'Commercial License', 'Advanced Features'].map((item) => (
                  <li key={item} className="flex items-center">
                    <Check className="h-5 w-5 text-yellow-300 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setShowPaymentModal(true)}
              >
                Upgrade to Pro
              </Button>
            </div>
          </div>
        </div>
      </section>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        plan="pro"
      />
    </div>
  );
};

export default Home;