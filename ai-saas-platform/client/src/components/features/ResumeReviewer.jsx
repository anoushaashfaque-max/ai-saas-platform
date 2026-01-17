import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Upload, FileText, Star, TrendingUp, Download, Edit3, CheckCircle, Crown } from 'lucide-react';
import Button from '../common/Button';

const ResumeReviewer = () => {
  const { user } = useUser();
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState(null);

  // Check Pro status
  const isPro = user?.publicMetadata?.isPro || localStorage.getItem('user_isPro') === 'true';

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
      // In real app, you would parse the file content
      setResumeText(''); // Clear text input when file is uploaded
    }
  };

  const analyzeResume = async () => {
    if (!resumeFile && !resumeText.trim()) {
      alert('Please upload a resume or paste resume text');
      return;
    }

    // Check Pro status
    if (!isPro) {
      alert('Resume review is a Pro feature. Please upgrade to Pro to use this tool.');
      return;
    }

    setLoading(true);
    // Simulate AI analysis
    setTimeout(() => {
      const mockReview = {
        score: 78,
        suggestions: [
          { id: 1, text: 'Add more quantifiable achievements', priority: 'high' },
          { id: 2, text: 'Include relevant keywords for ATS', priority: 'high' },
          { id: 3, text: 'Improve action verb usage', priority: 'medium' },
          { id: 4, text: 'Format for better readability', priority: 'medium' },
          { id: 5, text: 'Consider adding a skills section', priority: 'low' },
        ],
        strengths: [
          'Clear work experience timeline',
          'Good education background',
          'Professional formatting',
        ],
        atsScore: 85,
        estimatedCalls: 3,
      };
      setReview(mockReview);
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl mb-4">
          <FileText className="h-8 w-8 text-yellow-600" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-3xl font-bold">Resume Reviewer</h2>
          <div className="flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            <Crown className="h-3 w-3 mr-1" />
            PRO
          </div>
        </div>
        <p className="text-gray-600">Get AI-powered feedback to improve your resume</p>
        {!isPro && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              🚀 <strong>Pro Feature:</strong> Upgrade to Pro to get AI-powered resume reviews and improvement suggestions!
            </p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Panel - Input */}
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="text-lg font-bold mb-4">Upload Resume</h3>
            
            <div className="mb-6">
              <label className="block mb-4">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-700 font-medium">
                    {resumeFile ? resumeFile.name : 'Click to upload resume'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    PDF, DOC, DOCX, or TXT up to 5MB
                  </p>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </label>

              <div className="text-center text-gray-500 mb-6">- OR -</div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Paste Resume Text
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume content here for analysis..."
                  className="w-full h-48 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={6}
                />
              </div>
            </div>

            <Button
              onClick={analyzeResume}
              loading={loading}
              className="w-full py-3"
            >
              <Star className="mr-2 h-5 w-5" />
              Analyze Resume
            </Button>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="font-bold mb-3">💡 Resume Tips</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Use action verbs (managed, created, improved)</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Quantify achievements with numbers</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Include relevant keywords for ATS</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Keep it concise (1-2 pages maximum)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div>
          <div className="bg-white rounded-2xl border p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">AI Analysis Results</h3>
              {review && (
                <Button variant="outline" size="small">
                  <Download className="mr-2 h-4 w-4" />
                  Export Report
                </Button>
              )}
            </div>

            {review ? (
              <div className="space-y-6">
                {/* Overall Score */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Overall Score</p>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900">{review.score}</span>
                        <span className="text-gray-500 ml-2">/100</span>
                      </div>
                    </div>
                    <div className="w-20 h-20">
                      <div className="relative">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#4F46E5"
                            strokeWidth="3"
                            strokeDasharray={`${review.score}, 100`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-bold">{review.score}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-sm text-gray-600">ATS Score</span>
                    </div>
                    <div className="text-2xl font-bold">{review.atsScore}%</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Edit3 className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-sm text-gray-600">Est. Callbacks</span>
                    </div>
                    <div className="text-2xl font-bold">{review.estimatedCalls}x</div>
                  </div>
                </div>

                {/* Suggestions */}
                <div>
                  <h4 className="font-bold mb-3">Improvement Suggestions</h4>
                  <div className="space-y-3">
                    {review.suggestions.map((suggestion) => (
                      <div
                        key={suggestion.id}
                        className="flex items-start p-3 border rounded-lg"
                      >
                        <div className={`mr-3 px-2 py-1 rounded text-xs font-medium ${
                          suggestion.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : suggestion.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {suggestion.priority}
                        </div>
                        <span>{suggestion.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths */}
                <div>
                  <h4 className="font-bold mb-3">Your Strengths</h4>
                  <div className="flex flex-wrap gap-2">
                    {review.strengths.map((strength, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {strength}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Analysis results will appear here</p>
                <p className="text-sm text-gray-400 mt-2">
                  Upload or paste your resume to get AI feedback
                </p>
              </div>
            )}
          </div>

          {/* Additional Info */}
          {review && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> This AI analysis provides suggestions based on best practices.
                Always tailor your resume to specific job descriptions for best results.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumeReviewer;