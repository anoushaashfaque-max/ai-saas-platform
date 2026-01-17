const axios = require('axios');

const HF_API_KEY = process.env.HUGGING_FACE_API_KEY;

const generateArticle = async (topic) => {
  try {
    const response = await axios.post(
      'https://router.huggingface.co/hf-inference/models/google/flan-t5-base',
      {
        inputs: `Write a professional article about ${topic}`
      },
      {
        headers: {
          Authorization: `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 60000
      }
    );

    // HF response format
    if (Array.isArray(response.data)) {
      return response.data[0]?.generated_text || 'No content generated';
    }

    return response.data.generated_text || 'No content generated';
  } catch (error) {
    console.error(
      'HF Article Error:',
      error.response?.data || error.message
    );
    throw new Error('Failed to generate article');
  }
};

module.exports = {
  generateArticle
};
