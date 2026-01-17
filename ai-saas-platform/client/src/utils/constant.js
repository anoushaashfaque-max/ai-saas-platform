export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const AI_TOOLS = [
  {
    id: 'article-writer',
    name: 'Article Writer',
    description: 'Generate high-quality articles on any topic',
    icon: '📝',
    requiresPro: false,
    isFree: true,
    category: 'writing'
  },
  {
    id: 'blog-generator',
    name: 'Blog Generator',
    description: 'Create engaging blog posts instantly',
    icon: '✍️',
    requiresPro: false,
    isFree: true,
    category: 'writing'
  },
  {
    id: 'image-generator',
    name: 'Image Generator',
    description: 'Create stunning AI images from text',
    icon: '🖼️',
    requiresPro: true,
    isFree: false,
    category: 'image'
  },
  {
    id: 'background-removal',
    name: 'Background Removal',
    description: 'Remove backgrounds from images instantly',
    icon: '🎨',
    requiresPro: true,
    isFree: false,
    category: 'image'
  },
  {
    id: 'object-removal',
    name: 'Object Removal',
    description: 'Remove unwanted objects from photos',
    icon: '✂️',
    requiresPro: true,
    isFree: false,
    category: 'image'
  },
  {
    id: 'resume-reviewer',
    name: 'Resume Reviewer',
    description: 'Get AI-powered resume feedback',
    icon: '📄',
    requiresPro: true,
    isFree: false,
    category: 'productivity'
  }
];

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    description: 'Perfect for getting started',
    features: [
      'Article Writer (Free)',
      'Blog Generator (Free)',
      'Unlimited Generations',
      'Standard Support',
      'Basic Features'
    ]
  },
  PRO: {
    name: 'Pro',
    price: 29,
    description: 'Unlock all premium tools',
    features: [
      'All 6 AI Tools',
      'Image Generator',
      'Background Removal',
      'Object Removal',
      'Resume Reviewer',
      'Unlimited Usage',
      'Priority Support'
    ]
  }
};

export const PAYMENT_METHODS = [
  { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
  { id: 'paypal', name: 'PayPal', icon: '🏦' },
  { id: 'crypto', name: 'Cryptocurrency', icon: '₿' }
];