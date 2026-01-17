import React from 'react';
import { 
  Zap, 
  Shield, 
  Users, 
  Clock, 
  Award, 
  Globe,
  Lock,
  BarChart,
  Smartphone,
  Cloud
} from 'lucide-react';

const Features = () => {
  const mainFeatures = [
    {
      icon: <Zap className="h-8 w-8" />,
      title: 'Lightning Fast',
      description: 'Generate content in seconds, not hours',
      details: 'Our optimized AI models process requests in milliseconds',
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: 'Enterprise Security',
      description: 'Your data is protected with bank-level security',
      details: 'End-to-end encryption and GDPR compliance',
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: 'Team Collaboration',
      description: 'Work together seamlessly',
      details: 'Share projects, collaborate in real-time',
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: '24/7 Availability',
      description: 'Always ready when you are',
      details: 'No downtime, global CDN',
    },
  ];

  const aiFeatures = [
    {
      title: 'Article Writer',
      description: 'Create high-quality articles on any topic',
      capabilities: ['SEO Optimized', 'Multiple Tones', 'Plagiarism Free'],
    },
    {
      title: 'Image Generator',
      description: 'Generate stunning images from text',
      capabilities: ['Multiple Styles', 'High Resolution', 'Custom Sizes'],
    },
    {
      title: 'Background Removal',
      description: 'Remove backgrounds instantly',
      capabilities: ['High Precision', 'Batch Processing', 'Multiple Formats'],
    },
    {
      title: 'Blog Generation',
      description: 'Transform ideas into engaging blog posts in seconds',
      capabilities: ['Smart Headlines', 'SEO-Friendly', 'Content Optimization'],
    },
    {
      title: 'Object Removal',
      description: 'Magically erase unwanted objects from your images',
      capabilities: ['AI-Powered', 'Perfect Edges', 'Instant Results'],
    },
    {
      title: 'Resume Reviewer',
      description: 'Get AI-powered feedback',
      capabilities: ['ATS Score', 'Keyword Suggestions', 'Format Check'],
    },
  ];

  const techFeatures = [
    { icon: <Globe className="h-6 w-6" />, text: 'Global Infrastructure' },
    { icon: <Lock className="h-6 w-6" />, text: 'Enterprise Security' },
    { icon: <BarChart className="h-6 w-6" />, text: 'Real-time Analytics' },
    { icon: <Smartphone className="h-6 w-6" />, text: 'Mobile Responsive' },
    { icon: <Cloud className="h-6 w-6" />, text: 'Cloud Powered' },
    { icon: <Award className="h-6 w-6" />, text: 'Award Winning' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="pt-20 pb-32 text-center bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6">
            Powerful <span className="gradient-text">Features</span> for Creators
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Everything you need to create amazing content with AI.
            From writing to design, we've got you covered.
          </p>
        </div>
      </div>

      {/* Main Features */}
      <div className="container mx-auto px-4 -mt-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {mainFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-xl border hover:shadow-2xl transition-shadow"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <div className="text-blue-600">{feature.icon}</div>
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <p className="text-sm text-gray-500">{feature.details}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI Features */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-4xl font-bold text-center mb-4">AI Tools</h2>
        <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
          Our suite of AI tools designed to help you create professional content
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {aiFeatures.map((feature, index) => (
            <div
              key={index}
              className="bg-white border rounded-2xl p-8 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-600 mb-6">{feature.description}</p>
              
              <div className="space-y-3">
                {feature.capabilities.map((capability, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                    <span>{capability}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">Built with Modern Tech</h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            We use cutting-edge technology to deliver the best experience
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {techFeatures.map((feature, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <div className="text-blue-600">{feature.icon}</div>
                </div>
                <span className="font-medium">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-12 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of creators using AI SaaS to save time and create amazing content.
          </p>
          <button className="bg-white text-blue-600 font-bold px-8 py-4 rounded-lg hover:bg-gray-100">
            Start Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};

export default Features;