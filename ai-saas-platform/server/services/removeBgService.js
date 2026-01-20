const axios = require('axios');
const FormData = require('form-data');

// Remove.bg API service
const removeBackground = async (imageBuffer, imageFormat = 'auto') => {
  console.log('🎯 Removing background from image');

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

      console.log('✅ Background removed successfully');
      return Buffer.from(response.data);
    }

    // Fallback: Mock background removal for demo
    console.log('⚠️ Remove.bg API key not configured, using mock response');

    // In demo mode, just return the original image with a mock "processed" URL
    // For a real implementation, you'd need to upload to cloud storage
    const mockImageUrl = `https://via.placeholder.com/800x600/00ff00/000000?text=Background+Removed+(Demo)`;

    return {
      url: mockImageUrl,
      isMock: true,
      originalSize: imageBuffer.length
    };

  } catch (error) {
    console.error('❌ Remove.bg error:', error);

    // Provide fallback even on API errors
    const mockImageUrl = `https://via.placeholder.com/800x600/ff0000/ffffff?text=Background+Removal+Failed+(Demo)`;

    return {
      url: mockImageUrl,
      isMock: true,
      error: error.message
    };
  }
};

// Remove object from image (using similar service)
const removeObject = async (imageBuffer, objectDescription) => {
  console.log('🎯 Removing object from image:', objectDescription);

  try {
    // This would typically use an AI service like OpenAI's DALL-E or similar
    // For now, provide mock response

    if (process.env.OPENAI_API_KEY) {
      // Could use DALL-E to regenerate image without the object
      // This is a simplified version for demo
      console.log('✅ Object removal with OpenAI (simulated)');
      const mockImageUrl = `https://via.placeholder.com/800x600/0000ff/ffffff?text=Object+Removed+(Demo)`;

      return {
        url: mockImageUrl,
        isMock: true,
        objectRemoved: objectDescription,
        originalSize: imageBuffer.length
      };
    }

    // Fallback: Mock object removal for demo
    console.log('⚠️ Object removal service not configured, using mock response');
    const mockImageUrl = `https://via.placeholder.com/800x600/800080/ffffff?text=${objectDescription}+Removed+(Demo)`;

    return {
      url: mockImageUrl,
      isMock: true,
      objectRemoved: objectDescription,
      originalSize: imageBuffer.length
    };

  } catch (error) {
    console.error('❌ Object removal error:', error);

    // Provide fallback even on errors
    const mockImageUrl = `https://via.placeholder.com/800x600/ff4500/ffffff?text=Object+Removal+Failed+(Demo)`;

    return {
      url: mockImageUrl,
      isMock: true,
      error: error.message
    };
  }
};

module.exports = {
  removeBackground,
  removeObject
};
