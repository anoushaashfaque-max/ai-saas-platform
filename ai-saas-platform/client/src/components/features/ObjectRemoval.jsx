import React, { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Upload, Download, Crop, MousePointer, ZoomIn, RotateCw, Crown } from 'lucide-react';
import Button from '../common/Button';

const ObjectRemoval = () => {
  const { user } = useAuth();
  const [originalImage, setOriginalImage] = useState('');
  const [processedImage, setProcessedImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedArea, setSelectedArea] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [tool, setTool] = useState('select'); // 'select', 'brush', 'eraser'
  const [brushSize, setBrushSize] = useState(10);
  const canvasRef = useRef(null);

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

  const removeObject = async () => {
    if (!originalImage) {
      alert('Please upload an image first');
      return;
    }

    // Check Pro status
    if (!isPro) {
      alert('Object removal is a Pro feature. Please upgrade to Pro to use this tool.');
      return;
    }

    setLoading(true);
    // Simulate object removal process
    setTimeout(() => {
      // In real app, this would be the processed image from API
      const mockProcessed = 'https://via.placeholder.com/512/10B981/FFFFFF?text=Object+Removed';
      setProcessedImage(mockProcessed);
      setLoading(false);
    }, 2500);
  };

  const handleDownload = () => {
    if (!processedImage) return;
    
    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'object-removed.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tools = [
    { id: 'select', icon: <MousePointer size={18} />, label: 'Select' },
    { id: 'brush', icon: <Crop size={18} />, label: 'Brush' },
    { id: 'eraser', icon: <ZoomIn size={18} />, label: 'Eraser' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl mb-4">
          <Crop className="h-8 w-8 text-indigo-600" />
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-3xl font-bold">Object Removal</h2>
          <div className="flex items-center bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            <Crown className="h-3 w-3 mr-1" />
            PRO
          </div>
        </div>
        <p className="text-gray-600">Remove unwanted objects from images with precision</p>
        {!isPro && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              🚀 <strong>Pro Feature:</strong> Upgrade to Pro to remove objects from unlimited images!
            </p>
          </div>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Panel - Controls */}
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-white rounded-2xl border p-6">
            <h3 className="text-lg font-bold mb-4">Upload Image</h3>
            
            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-6">
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
                  <p className="text-gray-700 font-medium">Click to upload</p>
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

            {!originalImage ? (
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
            ) : (
              <Button
                variant="outline"
                onClick={() => {
                  setOriginalImage('');
                  setProcessedImage('');
                }}
                className="w-full"
              >
                <RotateCw className="mr-2 h-5 w-5" />
                Upload Different Image
              </Button>
            )}
          </div>

          {/* Tools Section */}
          {originalImage && (
            <div className="bg-white rounded-2xl border p-6">
              <h3 className="text-lg font-bold mb-4">Editing Tools</h3>
              
              <div className="mb-6">
                <div className="flex space-x-2 mb-4">
                  {tools.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTool(t.id)}
                      className={`
                        flex-1 flex flex-col items-center justify-center p-4 border rounded-lg
                        ${tool === t.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                      `}
                    >
                      <div className={`mb-2 ${tool === t.id ? 'text-blue-600' : 'text-gray-600'}`}>
                        {t.icon}
                      </div>
                      <span className="text-sm font-medium">{t.label}</span>
                    </button>
                  ))}
                </div>

                {tool === 'brush' && (
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Brush Size</span>
                      <span className="font-medium">{brushSize}px</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={brushSize}
                      onChange={(e) => setBrushSize(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="text-sm text-gray-600">
                  <p className="font-medium mb-1">Instructions:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Select the object you want to remove</li>
                    <li>Adjust brush size for precision</li>
                    <li>Click "Remove Object" when ready</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Preview & Results */}
        <div>
          <div className="bg-white rounded-2xl border p-6 h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Processed Image</h3>
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
              ) : originalImage ? (
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crop className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Processed image will appear here</p>
                  <Button
                    onClick={removeObject}
                    loading={loading}
                    className="mt-4"
                  >
                    Remove Selected Object
                  </Button>
                </div>
              ) : (
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ZoomIn className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Upload an image to start editing</p>
                  <p className="text-sm text-gray-400 mt-2">
                    Select objects to remove them from the image
                  </p>
                </div>
              )}
            </div>

            {originalImage && !processedImage && (
              <Button
                onClick={removeObject}
                loading={loading}
                className="w-full mt-6 py-3"
              >
                Remove Object
              </Button>
            )}

            {processedImage && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-green-600">✓</span>
                  </div>
                  <div>
                    <p className="font-medium text-green-800">Object removed successfully!</p>
                    <p className="text-sm text-green-600 mt-1">
                      Download the image or continue editing
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600">1</span>
                </div>
                <p className="text-xs text-gray-600">Upload</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600">2</span>
                </div>
                <p className="text-xs text-gray-600">Select</p>
              </div>
              <div className="text-center">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600">3</span>
                </div>
                <p className="text-xs text-gray-600">Download</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ObjectRemoval;