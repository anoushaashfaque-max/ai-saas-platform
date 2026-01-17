const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ---------------- ARTICLE ----------------
const generateArticle = async (topic, tone = 'professional', length = 'medium') => {
  try {
    const lengthMap = {
      short: '300 words',
      medium: '600 words',
      long: '1200 words'
    };

    const prompt = `Write a ${tone} article about "${topic}" (${lengthMap[length]}). Include introduction, key points, and conclusion.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: length === 'long' ? 2000 : length === 'medium' ? 1000 : 500,
      temperature: 0.7
    });

    if (!response.choices?.length) {
      throw new Error('Empty OpenAI response');
    }

    return response.choices[0].message.content;

  } catch (error) {
    console.error('❌ Article error:', error.message);
    throw new Error('Failed to generate article');
  }
};

// ---------------- BLOG TITLES ----------------
const generateBlogTitles = async (keyword, category = 'technology', tone = 'clickbait', quantity = 10) => {
  try {
    const prompt = `Generate ${quantity} SEO-friendly blog titles for "${keyword}" in ${category} with ${tone} tone.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 500,
      temperature: 0.9
    });

    if (!response.choices?.length) {
      throw new Error('Empty OpenAI response');
    }

    return response.choices[0].message.content
      .split('\n')
      .map(t => t.trim())
      .filter(Boolean)
      .slice(0, quantity);

  } catch (error) {
    console.error('❌ Blog title error:', error.message);
    throw new Error('Failed to generate blog titles');
  }
};

// ---------------- RESUME REVIEW ----------------
const reviewResume = async (resumeText) => {
  try {
    const prompt = `Review this resume and give detailed feedback with score out of 100:\n${resumeText}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // ✅ FIXED
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1500,
      temperature: 0.5
    });

    if (!response.choices?.length) {
      throw new Error('Empty OpenAI response');
    }

    return response.choices[0].message.content;

  } catch (error) {
    console.error('❌ Resume error:', error.message);
    throw new Error('Failed to review resume');
  }
};
module.exports = {
  generateArticle,
  generateBlogTitles,
  reviewResume
};
