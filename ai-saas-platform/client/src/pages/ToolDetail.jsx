import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ArrowLeft, Lock, CreditCard } from 'lucide-react';
import Button from '../components/common/Button';
import PaymentModal from '../components/common/PaymentModal';

// Import all tools
import ArticleWriter from '../components/features/ArticleWriter';
import BlogTitleGenerator from '../components/features/BlogTitleGenerator';
import ImageGenerator from '../components/features/ImageGenerator';
import BackgroundRemoval from '../components/features/BackgroundRemoval';
import ObjectRemoval from '../components/features/ObjectRemoval';
import ResumeReviewer from '../components/features/ResumeReviewer';

const ToolDetail = () => {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const tools = {
    'article-writer': { name: 'Article Writer', icon: '📝', description: 'Generate high-quality articles', free: true, component: ArticleWriter },
    'blog-generator': { name: 'Blog Generator', icon: '✍️', description: 'Create engaging blog posts', free: true, component: BlogTitleGenerator },
    'image-generator': { name: 'Image Generator', icon: '🖼️', description: 'Create stunning AI images', free: false, component: ImageGenerator },
    'background-removal': { name: 'Background Removal', icon: '🎨', description: 'Remove backgrounds from images', free: false, component: BackgroundRemoval },
    'object-removal': { name: 'Object Removal', icon: '✂️', description: 'Remove unwanted objects', free: false, component: ObjectRemoval },
    'resume-reviewer': { name: 'Resume Reviewer', icon: '📄', description: 'AI-powered resume feedback', free: false, component: ResumeReviewer },
  };

  const tool = tools[toolId];
  const userIsPro = user?.publicMetadata?.isPro || localStorage.getItem('user_isPro') === 'true' || false;

  useEffect(() => {
    if (!isLoaded) return;
    if (!tool) navigate('/');
    if (!tool.free && !userIsPro) setShowPaymentModal(true);
  }, [tool, userIsPro, isLoaded, navigate]);

  if (!isLoaded) return <div className="text-center py-12">Loading...</div>;
  if (!tool) return <div className="text-center py-12">Tool not found</div>;

  const ToolComponent = tool.component;

  return (
    <div className="container mx-auto px-4 py-8">
      <button onClick={() => navigate('/')} className="flex items-center text-gray-600 mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </button>

      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center">
          <div className="text-4xl mr-4">{tool.icon}</div>
          <div>
            <h1 className="text-3xl font-bold">{tool.name}</h1>
            <p className="text-gray-600">{tool.description}</p>
          </div>
        </div>

        {!tool.free && !userIsPro && (
          <div className="flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
            <Lock className="mr-2 h-4 w-4" /> Pro Feature
          </div>
        )}
      </div>

      {/* Tool or Locked Message */}
      {(!tool.free && !userIsPro) ? (
        <div className="bg-white border rounded-2xl p-12 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Pro Feature</h2>
          <p className="text-gray-600 mb-6">Upgrade to unlock all premium features.</p>
          <Button onClick={() => setShowPaymentModal(true)}>
            <CreditCard className="mr-2 h-4 w-4" /> Upgrade to Pro
          </Button>
        </div>
      ) : (
        <ToolComponent />
      )}

      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} plan="pro" />
    </div>
  );
};

export default ToolDetail;
