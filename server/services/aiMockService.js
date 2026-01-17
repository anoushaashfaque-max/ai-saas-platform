const generateArticle = async (topic, tone = 'professional', length = 'medium') => {
    return `
  ${topic}
  
  Artificial Intelligence is rapidly transforming modern industries.
  This ${tone} article demonstrates how AI is shaping the future.
  
  Key Points:
  - AI improves efficiency
  - Automation reduces costs
  - Data-driven decisions enhance accuracy
  
  Conclusion:
  AI will continue to evolve and redefine how we work and live.
  
  (Generated in DEV / MOCK mode)
  `;
  };
  

  const generateBlogTitles = async (
    keyword,
    category = 'technology',
    tone = 'clickbait',
    quantity = 5
  ) => {
    return [
      `Top ${keyword} Trends You Can't Ignore`,
      `How ${keyword} Is Changing the ${category} Industry`,
      `${keyword}: The Future Starts Now`,
      `10 Shocking Facts About ${keyword}`,
      `Why Everyone Is Talking About ${keyword}`
    ].slice(0, quantity);
  };
  
  module.exports = {
    generateArticle,
    generateBlogTitles
  };
  