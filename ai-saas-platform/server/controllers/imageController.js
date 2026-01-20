const { generateImage } = require('../services/stableDiffusionService');
const { removeBackground, removeObject } = require('../services/removeBgService');
const Creation = require('../models/Creation');
const multer = require('multer');

// Multer config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  }
});

// Generate Image (Pro-only)
const createImage = async (req, res) => {
  try {
    const { prompt, style, size } = req.body;
    const { user, userId, clerkId } = req;

    if (!prompt?.trim()) return res.status(400).json({ success: false, message: 'Prompt is required' });
    if (!user.isPro) return res.status(403).json({ success: false, message: 'Image generation is Pro-only' });

    const imageUrl = await generateImage(prompt, style || 'realistic', size || '512x512');

    const creation = await Creation.create({
      userId,
      clerkId,
      toolType: 'image-generator',
      title: prompt.substring(0, 50),
      input: JSON.stringify({ prompt, style, size }),
      output: imageUrl,
      metadata: { style, size, imageUrl }
    });

    res.status(201).json({ success: true, data: { imageUrl, creationId: creation._id } });

  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to generate image' });
  }
};

// Remove Background (Pro-only)
const removeImageBackground = async (req, res) => {
  try {
    const { user, userId, clerkId } = req;
    if (!req.file) return res.status(400).json({ success: false, message: 'Image file is required' });
    if (!user.isPro) return res.status(403).json({ success: false, message: 'Background removal is Pro-only' });

    console.log('Processing background removal for file:', req.file.originalname);

    const result = await removeBackground(req.file.buffer, req.file.mimetype.split('/')[1]);

    // Handle both mock and real API responses
    let imageUrl;
    if (result.url) {
      // Mock response - already a URL
      imageUrl = result.url;
    } else {
      // Real API response - convert buffer to base64
      imageUrl = `data:image/png;base64,${result.toString('base64')}`;
    }

    const creation = await Creation.create({
      userId,
      clerkId,
      toolType: 'background-removal',
      title: 'Background Removed',
      input: JSON.stringify({ originalFilename: req.file.originalname }),
      output: imageUrl,
      metadata: {
        originalFilename: req.file.originalname,
        isMock: result.isMock || false,
        originalSize: req.file.size
      }
    });

    console.log('✅ Background removal completed, creation saved');

    res.status(201).json({
      success: true,
      data: {
        imageUrl,
        creationId: creation._id,
        isMock: result.isMock || false
      }
    });

  } catch (error) {
    console.error('❌ Background removal error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove background',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Remove Object (Pro-only)
const removeImageObject = async (req, res) => {
  try {
    const { object } = req.body; // Changed from objectDescription to object
    const { user, userId, clerkId } = req;

    if (!req.file) return res.status(400).json({ success: false, message: 'Image file is required' });
    if (!object?.trim()) return res.status(400).json({ success: false, message: 'Object description is required' });
    if (!user.isPro) return res.status(403).json({ success: false, message: 'Object removal is Pro-only' });

    console.log('Processing object removal:', { object, filename: req.file.originalname });

    const result = await removeObject(req.file.buffer, object);

    // Handle both mock and real API responses
    let imageUrl;
    if (result.url) {
      // Mock response - already a URL
      imageUrl = result.url;
    } else {
      // Real API response - convert buffer to base64
      imageUrl = `data:image/png;base64,${result.toString('base64')}`;
    }

    const creation = await Creation.create({
      userId,
      clerkId,
      toolType: 'object-removal',
      title: `Object Removed: ${object}`,
      input: JSON.stringify({ originalFilename: req.file.originalname }),
      output: imageUrl,
      metadata: {
        objectRemoved: object,
        originalFilename: req.file.originalname,
        isMock: result.isMock || false,
        originalSize: req.file.size
      }
    });

    console.log('✅ Object removal completed, creation saved');

    res.status(201).json({
      success: true,
      data: {
        imageUrl,
        creationId: creation._id,
        isMock: result.isMock || false
      }
    });

  } catch (error) {
    console.error('❌ Object removal error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to remove object',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = { createImage, removeImageBackground, removeImageObject, upload };
