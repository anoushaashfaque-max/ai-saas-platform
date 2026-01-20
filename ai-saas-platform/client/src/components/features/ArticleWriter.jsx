import React, { useState } from 'react';
import { PenTool, Copy, Download, Sparkles } from 'lucide-react';
import Button from '../common/Button';
import { useApi } from '../../hooks/useApi';

const ArticleWriter = () => {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [length, setLength] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [article, setArticle] = useState('');
  const { request } = useApi();

  const tones = [
    { value: 'professional', label: 'Professional' },
    { value: 'casual', label: 'Casual' },
    { value: 'persuasive', label: 'Persuasive' },
    { value: 'educational', label: 'Educational' },
  ];

  const lengths = [
    { value: 'short', label: 'Short (300 words)' },
    { value: 'medium', label: 'Medium (600 words)' },
    { value: 'long', label: 'Long (1200 words)' },
  ];

  const generateArticle = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await request('/articles/generate', {
        method: 'POST',
        body: JSON.stringify({ topic, tone, length }),
      });

      if (response.success) {
        setArticle(response.data.article);
      } else {
        alert(response.message || 'Failed to generate article');
      }
    } catch (error) {
      console.error('Article generation error:', error);
      alert(error.message || 'Failed to generate article');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(article);
    alert('Article copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl mb-4">
          <PenTool className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-3xl font-bold mb-2">Article Writer</h2>
        <p className="text-gray-600">Generate high-quality articles on any topic</p>
      </div>

      <div className="bg-white rounded-2xl border p-6 mb-6">
        <div className="space-y-6">
          {/* Topic Input */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Article Topic <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., The Future of Artificial Intelligence in Healthcare"
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Options */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Writing Tone</label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
              >
                {tones.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Article Length</label>
              <select
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg"
              >
                {lengths.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateArticle}
            loading={loading}
            className="w-full py-3"
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Article
          </Button>
        </div>
      </div>

      {/* Generated Article */}
      {article && (
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Generated Article</h3>
            <div className="flex space-x-2">
              <Button variant="outline" size="small" onClick={copyToClipboard}>
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
              <Button variant="outline" size="small">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>

          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-800 bg-gray-50 p-6 rounded-lg">
              {article}
            </pre>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              💡 <strong>Tip:</strong> You can edit the generated article or use it as inspiration for your own writing.
              The AI focuses on providing structure and key points.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ArticleWriter;