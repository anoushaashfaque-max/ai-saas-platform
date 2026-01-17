import api from '../utils/api';

const toolService = {
  // Generate article (COMPLETELY FREE - No credits, no Pro check)
  generateArticle: async (topic, tone = 'professional', length = 'medium') => {
    try {
      const response = await api.tools.generateArticle(topic, tone, length);

      return {
        success: true,
        article: response.article,
        isFree: true, // Mark as free tool
      };
    } catch (error) {
      console.error('Generate article error:', error);
      return {
        success: false,
        error: error.message || 'Article generation failed',
      };
    }
  },

  // Generate blog titles (COMPLETELY FREE - No credits, no Pro check)
  generateBlogTitles: async (keyword, category = 'technology', tone = 'clickbait', quantity = 10) => {
    try {
      const response = await api.tools.generateBlogTitles(keyword, category, tone, quantity);

      return {
        success: true,
        titles: response.titles,
        isFree: true, // Mark as free tool
      };
    } catch (error) {
      console.error('Generate blog titles error:', error);
      return {
        success: false,
        error: error.message || 'Blog title generation failed',
      };
    }
  },

  // Generate image (PRO ONLY)
  generateImage: async (prompt, style = 'realistic', size = '512x512') => {
    try {
      // This will be checked at component level for Pro status
      const response = await api.tools.generateImage(prompt, style, size);

      return {
        success: true,
        imageUrl: response.imageUrl,
        requiresPro: true,
      };
    } catch (error) {
      console.error('Generate image error:', error);
      return {
        success: false,
        error: error.message || 'Image generation failed',
      };
    }
  },

  // Remove background (PRO ONLY)
  removeBackground: async (imageData) => {
    try {
      const response = await api.tools.removeBackground(imageData);

      return {
        success: true,
        processedImage: response.processedImage,
        requiresPro: true,
      };
    } catch (error) {
      console.error('Remove background error:', error);
      return {
        success: false,
        error: error.message || 'Background removal failed',
      };
    }
  },

  // Remove object (PRO ONLY)
  removeObject: async (imageData, coordinates) => {
    try {
      const response = await api.tools.removeObject(imageData, coordinates);

      return {
        success: true,
        processedImage: response.processedImage,
        requiresPro: true,
      };
    } catch (error) {
      console.error('Remove object error:', error);
      return {
        success: false,
        error: error.message || 'Object removal failed',
      };
    }
  },

  // Review resume (PRO ONLY)
  reviewResume: async (resumeData) => {
    try {
      const response = await api.tools.reviewResume(resumeData);

      return {
        success: true,
        review: response.review,
        requiresPro: true,
      };
    } catch (error) {
      console.error('Review resume error:', error);
      return {
        success: false,
        error: error.message || 'Resume review failed',
      };
    }
  },

  // Get tool access requirements
  getToolAccessRequirements: () => {
    return {
      'article-writer': { requiresPro: false, isFree: true, description: 'Completely free' },
      'blog-generator': { requiresPro: false, isFree: true, description: 'Completely free' },
      'image-generator': { requiresPro: true, isFree: false, description: 'Pro subscription required' },
      'background-removal': { requiresPro: true, isFree: false, description: 'Pro subscription required' },
      'object-removal': { requiresPro: true, isFree: false, description: 'Pro subscription required' },
      'resume-reviewer': { requiresPro: true, isFree: false, description: 'Pro subscription required' },
    };
  },

  // Validate tool input
  validateToolInput: (tool, input) => {
    const validations = {
      'article-writer': (topic) => {
        if (!topic || topic.trim().length < 3) {
          return 'Topic must be at least 3 characters';
        }
        if (topic.length > 500) {
          return 'Topic is too long (max 500 characters)';
        }
        return null;
      },
      'image-generator': (prompt) => {
        if (!prompt || prompt.trim().length < 5) {
          return 'Prompt must be at least 5 characters';
        }
        if (prompt.length > 1000) {
          return 'Prompt is too long (max 1000 characters)';
        }
        return null;
      },
    };

    const validator = validations[tool];
    return validator ? validator(input) : null;
  },
};

export default toolService;