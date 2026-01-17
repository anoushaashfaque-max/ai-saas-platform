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

    const processedImage = await removeBackground(req.file.buffer);
    const imageUrl = `data:image/png;base64,${processedImage.toString('base64')}`;

    const creation = await Creation.create({
      userId,
      clerkId,
      toolType: 'background-removal',
      title: 'Background Removed',
      input: JSON.stringify({ originalFilename: req.file.originalname }),
      output: imageUrl,
      metadata: { originalFilename: req.file.originalname }
    });

    res.status(201).json({ success: true, data: { imageUrl, creationId: creation._id } });

  } catch (error) {
    console.error('Background removal error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to remove background' });
  }
};

// Remove Object (Pro-only)
const removeImageObject = async (req, res) => {
  try {
    const { objectDescription } = req.body;
    const { user, userId, clerkId } = req;

    if (!req.file) return res.status(400).json({ success: false, message: 'Image file is required' });
    if (!objectDescription?.trim()) return res.status(400).json({ success: false, message: 'Object description is required' });
    if (!user.isPro) return res.status(403).json({ success: false, message: 'Object removal is Pro-only' });

    const processedImage = await removeObject(req.file.buffer, objectDescription);
    const imageUrl = `data:image/png;base64,${processedImage.toString('base64')}`;

    const creation = await Creation.create({
      userId,
      clerkId,
      toolType: 'object-removal',
      title: `Object Removed: ${objectDescription}`,
      input: JSON.stringify({ originalFilename: req.file.originalname }),
      output: imageUrl,
      metadata: { objectDescription, originalFilename: req.file.originalname }
    });

    res.status(201).json({ success: true, data: { imageUrl, creationId: creation._id } });

  } catch (error) {
    console.error('Object removal error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to remove object' });
  }
};

module.exports = { createImage, removeImageBackground, removeImageObject, upload };
