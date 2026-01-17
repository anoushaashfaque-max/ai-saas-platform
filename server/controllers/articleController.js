const { generateArticle, generateBlogTitles, reviewResume } = require('../services/openaiService');
const Creation = require('../models/Creation');

// Generate article (FREE)
const createArticle = async (req, res) => {
  try {
    const { topic, tone, length } = req.body;
    const { user, userId, clerkId } = req;

    if (!topic?.trim()) return res.status(400).json({ success: false, message: 'Topic is required' });

    const article = await generateArticle(topic, tone || 'professional', length || 'medium');

    const creation = await Creation.create({
      userId,
      clerkId,
      toolType: 'article-writer',
      title: topic,
      input: JSON.stringify({ topic, tone, length }),
      output: article,
      metadata: { tone, length }
    });

    res.status(201).json({ success: true, data: { article, creationId: creation._id } });
  } catch (error) {
    console.error('Article generation error:', error.message);
    res.status(500).json({ success: false, message: 'Failed to generate article' });
  }
};

// Generate blog titles (FREE)
const createBlogTitles = async (req, res) => {
  try {
    const { keyword, category, tone, quantity } = req.body;
    const { userId, clerkId } = req;

    if (!keyword?.trim()) return res.status(400).json({ success: false, message: 'Keyword is required' });

    const titles = await generateBlogTitles(keyword, category || 'technology', tone || 'clickbait', quantity || 10);

    const creation = await Creation.create({
      userId,
      clerkId,
      toolType: 'blog-generator',
      title: keyword,
      input: JSON.stringify({ keyword, category, tone, quantity }),
      output: JSON.stringify(titles),
      metadata: { category, tone, quantity: titles.length }
    });

    res.status(201).json({ success: true, data: { titles, creationId: creation._id } });
  } catch (error) {
    console.error('Blog titles generation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to generate blog titles' });
  }
};

// Review resume (Pro-only)
const reviewResumeText = async (req, res) => {
  try {
    const { resumeText } = req.body;
    const { user, userId, clerkId } = req;

    if (!resumeText?.trim()) return res.status(400).json({ success: false, message: 'Resume text is required' });
    if (!user.isPro) return res.status(403).json({ success: false, message: 'Resume review is a Pro feature. Please upgrade to Pro.' });

    const review = await reviewResume(resumeText);

    const creation = await Creation.create({
      userId,
      clerkId,
      toolType: 'resume-reviewer',
      title: 'Resume Review',
      input: JSON.stringify({ resumeText }),
      output: review,
      metadata: {}
    });

    res.status(201).json({ success: true, data: { review, creationId: creation._id } });
  } catch (error) {
    console.error('Resume review error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to review resume' });
  }
};

module.exports = { createArticle, createBlogTitles, reviewResumeText };
