// Mock AI Service for Demo/Portfolio Purposes
console.log('🔑 AI Service Status: Mock Mode (Demo Only)');
console.log('💡 Using high-quality mock responses for portfolio demonstration');
console.log('💰 No API costs - perfect for showcasing the application!');

const generateArticle = async (topic, tone, length) => {
  console.log('🎯 Generating mock article:', { topic, tone, length });

  // Always use mock response in demo mode
  const mockArticle = `## ${topic}

This is a professionally crafted ${tone} article about "${topic}" for demonstration purposes.

### Introduction

${topic} represents a fascinating and increasingly important area in today's rapidly evolving technological landscape. As we navigate through the complexities of modern innovation, understanding ${topic} becomes essential for both individuals and organizations looking to stay ahead of the curve.

### Key Concepts and Applications

**Core Principles:**
- **Innovation**: ${topic} drives new ways of thinking and problem-solving
- **Integration**: Seamless incorporation into existing systems and workflows
- **Scalability**: Ability to grow and adapt as needs evolve

**Real-World Applications:**
1. **Business Transformation**: Companies leverage ${topic} to streamline operations
2. **Personal Development**: Individuals use ${topic} to enhance skills and knowledge
3. **Industry Disruption**: ${topic} creates new opportunities and market segments

### Current Trends and Future Outlook

The landscape of ${topic} continues to evolve rapidly. Recent developments have shown that organizations embracing ${topic} early gain significant competitive advantages. Industry leaders are investing heavily in research and development to unlock new possibilities.

### Best Practices and Implementation

**Getting Started:**
- Assess current capabilities and requirements
- Develop a clear roadmap and implementation strategy
- Invest in training and skill development
- Monitor progress and adjust as needed

**Success Factors:**
- Strong leadership commitment
- Cross-functional collaboration
- Continuous learning and adaptation
- Metrics-driven decision making

### Conclusion

${topic} is not just a passing trend but a fundamental shift in how we approach technology and innovation. Organizations and individuals who embrace ${topic} today will be well-positioned to thrive in tomorrow's digital economy. The journey ahead promises exciting possibilities and transformative opportunities.

---

*This is a demo article generated for portfolio purposes. In production, this would be powered by AI language models.*`;

  console.log('✅ Mock article generated, length:', mockArticle.length);
  return mockArticle;
};

const generateBlogTitles = async (keyword, category, tone, quantity) => {
  console.log('🎯 Generating mock blog titles:', { keyword, category, tone, quantity });

  // Always use mock response in demo mode
  const mockTitles = [
    `The Complete Guide to ${keyword}: Everything You Need to Know`,
    `10 ${tone} Ways ${keyword} Can Revolutionize Your ${category}`,
    `${keyword} in 2024: Trends, Tips, and Best Practices`,
    `Why ${keyword} Matters More Than Ever for ${category} Professionals`,
    `Beginner's Guide to Mastering ${keyword} Techniques`,
    `${keyword} Success Stories: Real Results from ${category} Leaders`,
    `The Future of ${keyword}: What's Next in ${category}`,
    `Common ${keyword} Mistakes and How to Avoid Them`,
    `${keyword} Tools and Resources for ${category} Experts`,
    `Advanced ${keyword} Strategies for Maximum Impact`
  ];

  return mockTitles.slice(0, quantity || 10); // Return requested quantity
};

const reviewResume = async (resumeText) => {
  console.log('🎯 Generating mock resume review, text length:', resumeText.length);

  // Always use mock response in demo mode
  const mockReview = `## Resume Review (Demo Mode)

### 📊 Overall Assessment
Your resume demonstrates solid foundational skills and relevant experience. With some strategic improvements, it can become a powerful tool for job searching.

### ✅ Strengths
- **Professional Structure**: Well-organized sections with clear headings
- **Relevant Experience**: Good progression of roles and responsibilities
- **Technical Skills**: Appropriate technical competencies listed
- **Education**: Strong educational background clearly presented

### 🔧 Areas for Improvement
- **Quantifiable Achievements**: Add specific metrics and results for accomplishments
- **Industry Keywords**: Incorporate more relevant keywords from your target industry
- **Professional Summary**: Consider adding a compelling 3-4 line summary at the top
- **Skills Section**: Group skills by category (Technical, Soft Skills, Tools)

### 💡 Specific Recommendations
1. **Impact Statements**: Replace generic descriptions with specific achievements
   - Instead of: "Managed team projects"
   - Use: "Led cross-functional team of 5, delivering projects 20% under budget and 15% ahead of schedule"

2. **Keyword Optimization**: Research and include industry-specific terms
   - Data Analysis, Agile Methodology, Stakeholder Management, etc.

3. **Action Verbs**: Start bullet points with strong action verbs
   - Developed, Implemented, Optimized, Streamlined, etc.

4. **Education Enhancement**: Include relevant coursework, projects, or certifications

### 🎯 Next Steps
- Tailor resume for each job application
- Get feedback from mentors or industry professionals
- Consider adding a LinkedIn profile URL
- Proofread multiple times for grammar and formatting

### 📈 Suggested Improvements Priority
1. **High Priority**: Add quantifiable achievements and metrics
2. **Medium Priority**: Incorporate industry keywords and action verbs
3. **Low Priority**: Visual design enhancements and additional sections

**Overall Score: 7.5/10** - Strong foundation with room for strategic enhancements to make it more impactful.

---
*This is a demo resume review for portfolio purposes. In production, this would be powered by AI analysis.*`;

  console.log('✅ Mock resume review generated, length:', mockReview.length);
  return mockReview;
};

module.exports = {
  generateArticle,
  generateBlogTitles,
  reviewResume
};
