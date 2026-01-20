const {
  generateArticle,
  generateBlogTitles,
  reviewResume
} = require('../services/openaiService');

const Creation = require('../models/Creation');

// ARTICLE
const createArticle = async (req, res) => {
  try {
    const { topic, tone, length, keywords } = req.body;
    const { userId, clerkId } = req;

    console.log('Article request:', { topic, tone, length, keywords, userId, clerkId });

    if (!topic?.trim()) {
      return res.status(400).json({ success: false, message: 'Topic is required' });
    }

    if (!userId || !clerkId) {
      return res.status(400).json({ success: false, message: 'User authentication required' });
    }

    const article = await generateArticle(topic, tone || 'professional', length || 'medium');

    console.log('Generated article length:', article.length);

    // Create creation record
    const creation = await Creation.create({
      userId,
      clerkId,
      toolType: 'article-writer',
      title: topic,
      input: JSON.stringify({ topic, tone, length, keywords }),
      output: article
    });
    console.log('Creation record saved:', creation._id);

    res.status(201).json({
      success: true,
      data: { article },
      message: 'Article generated successfully'
    });
  } catch (err) {
    console.error('Article generation error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to generate article',
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

// BLOG TITLES
const createBlogTitles = async (req, res) => {
  try {
    console.log('Blog titles controller called');
    console.log('Request body:', req.body);
    console.log('Request headers:', req.headers);

    // Check if req.body exists first
    if (!req.body) {
      console.error('Request body is undefined');
      return res.status(400).json({ success: false, message: 'Request body is required' });
    }

    // Safe destructuring with defaults
    const { keyword, category = 'technology', tone = 'clickbait', quantity = 10 } = req.body || {};
    const { userId, clerkId } = req;

    console.log('Blog titles request:', { keyword, category, tone, quantity, userId, clerkId });

    if (!keyword?.trim()) {
      return res.status(400).json({ success: false, message: 'Keyword is required' });
    }

    if (!userId || !clerkId) {
      return res.status(400).json({ success: false, message: 'User authentication required' });
    }

    const titles = await generateBlogTitles(
      keyword,
      category || 'technology',
      tone || 'clickbait',
      quantity || 10
    );

    console.log('Generated titles:', titles.length);

    // Create creation record
    const creation = await Creation.create({
      userId,
      clerkId,
      toolType: 'blog-generator',
      title: keyword,
      input: JSON.stringify({ keyword, category, tone, quantity }),
      output: JSON.stringify(titles)
    });
    console.log('Creation record saved:', creation._id);

    res.status(201).json({
      success: true,
      data: { titles },
      message: 'Blog titles generated successfully'
    });
  } catch (err) {
    console.error('Blog titles generation error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to generate blog titles'
    });
  }
};

// RESUME (PRO)
const reviewResumeText = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText?.trim()) {
      return res.status(400).json({ success: false, message: 'Resume text required' });
    }

    const review = await reviewResume(resumeText);
    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  createArticle,
  createBlogTitles,
  reviewResumeText
};
