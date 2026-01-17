import React, { useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { Download, RefreshCw, Sparkles, Upload, Crown } from 'lucide-react';
import Button from '../common/Button';

const ImageGenerator = () => {
  const { user } = useUser();
  const [prompt, setPrompt] = useState('');
  const [style, setStyle] = useState('realistic');
  const [size, setSize] = useState('512x512');
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState('');

  // Check Pro status
  const isPro = user?.publicMetadata?.isPro || localStorage.getItem('user_isPro') === 'true';

  const styles = [
    { value: 'realistic', label: 'Realistic' },
    { value: 'anime', label: 'Anime' },
    { value: 'digital-art', label: 'Digital Art' },
    { value: 'painting', label: 'Painting' },
    { value: '3d', label: '3D Render' },
  ];

  const sizes = [
    { value: '256x256', label: 'Small (256x256)' },
    { value: '512x512', label: 'Medium (512x512)' },
    { value: '1024x1024', label: 'Large (1024x1024)' },
  ];

  const generateImage = async () => {
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    // Check Pro status
    if (!isPro) {
      alert('Image generation is a Pro feature. Please upgrade to Pro to use this tool.');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      // Mock image URL - in real app, this would come from API
      setGeneratedImage(`https://via.placeholder.com/512/3B82F6/FFFFFF?text=${encodeURIComponent(prompt)}`);
      setLoading(false);
    }, 3000);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setGeneratedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl mb-4">
          <Sparkles className="h-8 w-8 text-purple-600" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-3xl font-bold">AI Image Generator</h2>
          <div className="flex items-center bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            <Crown className="h-3 w-3 mr-1" />
            PRO
          </div>
        </div>
        <p className="text-gray-600">Create stunning images from text descriptions</p>
        {!isPro && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              🚀 <strong>Pro Feature:</strong> Upgrade to Pro to generate unlimited AI images!
            </p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Panel - Controls */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border p-6">
            <div className="space-y-6">
              {/* Prompt Input */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Describe your image <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="A futuristic city with flying cars, neon lights, rainy night..."
                  className="w-full h-32 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={4}
                />
                <p className="text-sm text-gray-500 mt-2">
                  Be descriptive for better results
                </p>
              </div>

              {/* Style Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Style</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {styles.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setStyle(s.value)}
                      className={`
                        px-4 py-3 border rounded-lg text-sm font-medium
                        ${style === s.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Image Size</label>
                <div className="grid grid-cols-3 gap-3">
                  {sizes.map((s) => (
                    <button
                      key={s.value}
                      onClick={() => setSize(s.value)}
                      className={`
                        px-4 py-3 border rounded-lg text-sm font-medium
                        ${size === s.value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <Button
                onClick={generateImage}
                loading={loading}
                className="w-full py-3"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Image
              </Button>

              {/* Upload Option */}
              <div className="text-center">
                <label className="inline-flex items-center space-x-2 text-gray-600 cursor-pointer">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Or upload an image to edit</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100 rounded-2xl p-6">
            <h3 className="font-bold mb-3">💡 Tips for better results</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Be specific about colors, lighting, and mood</li>
              <li>• Mention art style (realistic, cartoon, etc.)</li>
              <li>• Include details about composition and subjects</li>
              <li>• Use adjectives to describe emotions</li>
            </ul>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div>
          <div className="bg-white rounded-2xl border p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Generated Image</h3>
              {generatedImage && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="small">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="small" onClick={generateImage}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Regenerate
                  </Button>
                </div>
              )}
            </div>

            <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
              {generatedImage ? (
                <img
                  src={generatedImage}
                  alt="Generated"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Your generated image will appear here</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Enter a prompt and click Generate
                  </p>
                </div>
              )}
            </div>

            {generatedImage && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <span className="text-gray-600">Prompt:</span>
                    <p className="font-medium mt-1">{prompt}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-600">Style: {style}</div>
                    <div className="text-gray-600">Size: {size}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGenerator;