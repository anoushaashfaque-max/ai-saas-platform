import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Upload, Download, Trash2, Image as ImageIcon, Crown } from 'lucide-react';
import Button from '../common/Button';

const BackgroundRemoval = () => {
  const { user } = useAuth();
  const [originalImage, setOriginalImage] = useState('');
  const [processedImage, setProcessedImage] = useState('');
  const [loading, setLoading] = useState(false);

  // Check Pro status
  const isPro = user?.publicMetadata?.isPro || localStorage.getItem('user_isPro') === 'true';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setOriginalImage(e.target.result);
        setProcessedImage('');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBackground = async () => {
    if (!originalImage) {
      alert('Please upload an image first');
      return;
    }

    // Check Pro status
    if (!isPro) {
      alert('Background removal is a Pro feature. Please upgrade to Pro to use this tool.');
      return;
    }

    setLoading(true);
    // Simulate background removal process
    setTimeout(() => {
      // In real app, this would be the processed image from API
      setProcessedImage(originalImage); // Same for demo
      setLoading(false);
    }, 2000);
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'background-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearImages = () => {
    setOriginalImage('');
    setProcessedImage('');
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-4">
          <ImageIcon className="h-8 w-8 text-green-600" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-3xl font-bold">Background Removal</h2>
          <div className="flex items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            <Crown className="h-3 w-3 mr-1" />
            PRO
          </div>
        </div>
        <p className="text-gray-600">Remove background from images instantly</p>
        {!isPro && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              🚀 <strong>Pro Feature:</strong> Upgrade to Pro to remove backgrounds from unlimited images!
            </p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Original Image */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Original Image</h3>
            {originalImage && (
              <button
                onClick={clearImages}
                className="text-red-600 hover:text-red-700 flex items-center text-sm"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear
              </button>
            )}
          </div>

          <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
            {originalImage ? (
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-full object-contain"
              />
            ) : (
              <label className="cursor-pointer text-center p-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-700 font-medium">Upload Image</p>
                <p className="text-sm text-gray-500 mt-2">
                  JPG, PNG, or WebP up to 10MB
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {!originalImage && (
            <div className="mt-6">
              <label className="block w-full">
                <Button className="w-full" as="div">
                  <Upload className="mr-2 h-5 w-5" />
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </Button>
              </label>
            </div>
          )}
        </div>

        {/* Processed Image */}
        <div className="bg-white rounded-2xl border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold">Background Removed</h3>
            {processedImage && (
              <Button size="small" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            )}
          </div>

          <div className="aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center">
            {processedImage ? (
              <img
                src={processedImage}
                alt="Processed"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ImageIcon className="h-8 w-8 text-gray-400" />
                </div>
                <p className="text-gray-500">Background removed image will appear here</p>
                {originalImage && (
                  <Button
                    onClick={removeBackground}
                    loading={loading}
                    className="mt-4"
                  >
                    Remove Background
                  </Button>
                )}
              </div>
            )}
          </div>

          {originalImage && !processedImage && (
            <Button
              onClick={removeBackground}
              loading={loading}
              className="w-full mt-6 py-3"
            >
              Remove Background
            </Button>
          )}

          {processedImage && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Format:</span>
                <span className="font-medium">PNG (Transparent)</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Quality:</span>
                <span className="font-medium">High Resolution</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Download:</span>
                <span className="font-medium">Ready</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 grid sm:grid-cols-3 gap-6">
        <div className="bg-white border rounded-xl p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">⚡</span>
          </div>
          <h4 className="font-bold mb-2">Instant Processing</h4>
          <p className="text-sm text-gray-600">Remove backgrounds in seconds</p>
        </div>
        
        <div className="bg-white border rounded-xl p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🎯</span>
          </div>
          <h4 className="font-bold mb-2">High Precision</h4>
          <p className="text-sm text-gray-600">Accurate edge detection</p>
        </div>
        
        <div className="bg-white border rounded-xl p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
            <span className="text-2xl">🔄</span>
          </div>
          <h4 className="font-bold mb-2">Multiple Formats</h4>
          <p className="text-sm text-gray-600">PNG, JPG, WebP support</p>
        </div>
      </div>
    </div>
  );
};

export default BackgroundRemoval;