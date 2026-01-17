const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  clerkId: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    default: ''
  },
  isPro: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  subscriptionId: {
    type: String,
    default: null
  },
  subscriptionStatus: {
    type: String,
    enum: ['active', 'canceled', 'past_due', 'none'],
    default: 'none'
  },
  subscriptionEndDate: {
    type: Date,
    default: null
  },
  stripeCustomerId: {
    type: String,
    default: null,
    index: true
  },
  // credits: {
  //   type: Number,
  //   default: 5 // Free users get 5 credits
  // },
  // totalCreditsUsed: {
  //   type: Number,
  //   default: 0
  // },
  lastLogin: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
userSchema.index({ clerkId: 1 });
userSchema.index({ email: 1 });

// Methods
userSchema.methods.upgradeToPro = function(endDate) {
  this.isPro = true;
  this.subscriptionStatus = 'active';
  this.subscriptionEndDate = endDate;
  return this.save();
};


const User = mongoose.model('User', userSchema);

module.exports = User;
