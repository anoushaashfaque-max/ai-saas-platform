import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import Button from '../components/common/Button';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email Support',
      details: ['support@aisaaspro.com', 'enterprise@aisaaspro.com'],
      description: '24/7 support for urgent issues',
      responseTime: 'Within 2 hours',
      primary: true,
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Phone',
      details: ['+1 (555) 123-4567'],
      description: 'Business hours: Mon-Fri, 9AM-6PM EST',
      responseTime: 'Immediate',
      availability: 'Mon-Fri 9AM-6PM EST',
    },
    {
      icon: <MapPin className="h-6 w-6" />,
      title: 'Headquarters',
      details: ['Silicon Valley, CA', 'United States'],
      description: 'Global operations center',
      responseTime: 'By appointment',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero */}
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Let's Start a <span className="gradient-text">Conversation</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Ready to transform your content creation workflow? Our team of AI experts
              is here to help you get started and answer any questions you may have.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Response within 24 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Free consultation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Expert support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          {/* Contact Info Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {contactInfo.map((info, index) => (
              <div key={index} className={`bg-white rounded-2xl border-2 p-6 hover:shadow-lg transition-all duration-300 ${info.primary ? 'border-blue-200 bg-gradient-to-br from-blue-50 to-white' : 'border-gray-100'}`}>
                <div className="text-center">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 ${info.primary ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {info.icon}
                  </div>
                  <h3 className="font-bold text-lg mb-3 text-gray-900">{info.title}</h3>
                  <div className="space-y-2 mb-4">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-gray-700 font-medium">{detail}</p>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{info.description}</p>
                  {info.responseTime && (
                    <div className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                      <CheckCircle className="h-3 w-3" />
                      {info.responseTime}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
                <p className="text-gray-600 text-lg">
                  Have a question or need help? We'd love to hear from you.
                  Fill out the form below and our team will respond promptly.
                </p>
              </div>

              {submitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">Message Sent Successfully!</h3>
                  <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                    Thank you for reaching out. Our team has received your message and will respond
                    within 24 hours. We're excited to help you!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                      className="px-8 py-3"
                    >
                      Send Another Message
                    </Button>
                    <Button
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600"
                      onClick={() => window.location.href = '/'}
                    >
                      Return Home
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400"
                        placeholder="your.email@company.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      How can we help you? *
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 bg-white"
                    >
                      <option value="">Select your inquiry type</option>
                      <option value="support">Technical Support</option>
                      <option value="sales">Sales & Pricing</option>
                      <option value="billing">Billing & Account</option>
                      <option value="partnership">Partnership Opportunities</option>
                      <option value="demo">Request a Demo</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-900">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900 placeholder-gray-400 resize-none"
                      placeholder="Please provide details about your inquiry. The more information you share, the better we can assist you..."
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      loading={loading}
                      className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {!loading && <Send className="mr-3 h-5 w-5" />}
                      {loading ? 'Sending Message...' : 'Send Message'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Trust Indicators */}
              {!submitted && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>GDPR Compliant</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>SOC 2 Certified</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-4">
                    Your information is secure and will never be shared with third parties.
                    We respect your privacy and are committed to protecting your data.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Professional Footer CTA */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to Transform Your Content Creation?
          </h3>
          <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of creators who trust AI SaaS Pro to streamline their workflow
            and produce amazing content faster than ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
              onClick={() => window.location.href = '/'}
            >
              Get Started Today
            </Button>
            <Button
              variant="outline"
              className="px-8 py-3 border-white text-white hover:bg-white hover:text-gray-900"
              onClick={() => window.location.href = '/features'}
            >
              Explore Features
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;