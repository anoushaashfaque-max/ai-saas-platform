const axios = require('axios');
const FormData = require('form-data');

// Remove.bg API service
const removeBackground = async (imageBuffer, imageFormat = 'auto') => {
  try {
    if (process.env.REMOVE_BG_API_KEY) {
      const formData = new FormData();
      formData.append('image_file', imageBuffer, {
        filename: 'image.jpg',
        contentType: 'image/jpeg'
      });
      formData.append('size', 'regular');
      formData.append('format', imageFormat);

      const response = await axios.post(
        'https://api.remove.bg/v1.0/removebg',
        formData,
        {
          headers: {
            'X-Api-Key': process.env.REMOVE_BG_API_KEY,
            ...formData.getHeaders()
          },
          responseType: 'arraybuffer'
        }
      );

      return Buffer.from(response.data);
    }

    // Fallback: Return original image if API key not configured
    throw new Error('Remove.bg API key not configured');
  } catch (error) {
    console.error('Remove.bg error:', error);
    throw new Error('Failed to remove background');
  }
};

// Remove object from image (using similar service)
const removeObject = async (imageBuffer, objectDescription) => {
  try {
    // This would typically use an AI service like OpenAI's DALL-E or similar
    // For now, return a placeholder
    // In production, integrate with a proper object removal service
    
    if (process.env.OPENAI_API_KEY) {
      // Could use DALL-E to regenerate image without the object
      // This is a simplified version
      return imageBuffer; // Placeholder
    }

    throw new Error('Object removal service not configured');
  } catch (error) {
    console.error('Object removal error:', error);
    throw new Error('Failed to remove object');
  }
};

module.exports = {
  removeBackground,
  removeObject
};
