const mongoose = require('mongoose');

const creationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  clerkId: {
    type: String,
    required: true
  },
  toolType: {
    type: String,
    required: true,
    enum: ['article-writer', 'blog-generator', 'image-generator', 'background-removal', 'object-removal', 'resume-reviewer']
  },
  title: {
    type: String,
    default: ''
  },
  input: {
    type: String,
    required: true
  },
  output: {
    type: String,
    required: true
  },
  // creditsUsed: {
  //   type: Number,
  //   default: 0
  // },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },  // Flexible storage for extra data
      //Any extra information about the creation that doesn't fit in the main fields (title, input, output) goes here.
}, {
  timestamps: true
});

// Indexes
creationSchema.index({ userId: 1, createdAt: -1 });
creationSchema.index({ clerkId: 1, createdAt: -1 });
creationSchema.index({ toolType: 1 });

const Creation = mongoose.model('Creation', creationSchema);

module.exports = Creation;
