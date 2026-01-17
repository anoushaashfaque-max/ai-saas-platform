const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const {
  createCustomer,
  createCheckoutSession,
  handleWebhook,
  getCustomerByEmail,
  createCreditPaymentIntent
} = require('../services/stripeService');
const User = require('../models/User');
const Payment = require('../models/Payment');

// Create checkout session for Pro subscription
const createProCheckout = async (req, res) => {
  try {
    const { user, userId, clerkId } = req;

    // Get or create Stripe customer
    let customer = await getCustomerByEmail(user.email);
    if (!customer) {
      customer = await createCustomer(user.email, user.name, clerkId);
    }

    // Update user with customer ID
    if (!user.stripeCustomerId) {
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    // Create checkout session
    const session = await createCheckoutSession(customer.id, userId, clerkId);

    res.json({
      success: true,
      data: {
        sessionId: session.id,
        url: session.url
      }
    });
  } catch (error) {
    console.error('Create checkout error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create checkout session'
    });
  }
};

// Create payment intent for credit purchase
const createCreditPayment = async (req, res) => {
  try {
    const { amount } = req.body; // Amount in dollars
    const { user, userId, clerkId } = req;

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount. Minimum $1'
      });
    }

    // Get or create Stripe customer
    let customer = await getCustomerByEmail(user.email);
    if (!customer) {
      customer = await createCustomer(user.email, user.name, clerkId);
    }

    // Update user with customer ID
    if (!user.stripeCustomerId) {
      user.stripeCustomerId = customer.id;
      await user.save();
    }

    // Create payment intent (1 credit = $1)
    const credits = Math.floor(amount);
    const paymentIntent = await createCreditPaymentIntent(amount, customer.id, userId, clerkId);

    // Create payment record
    await Payment.create({
      userId,
      clerkId,
      stripeCustomerId: customer.id,
      stripePaymentIntentId: paymentIntent.id,
      amount,
      currency: 'usd',
      status: 'pending',
      planType: 'credits',
      creditsPurchased: credits,
      metadata: { credits }
    });

    res.json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        credits
      }
    });
  } catch (error) {
    console.error('Create credit payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment'
    });
  }
};

// Handle Stripe webhook
const handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const webhookData = await handleWebhook(event);
    if (!webhookData) return res.json({ received: true });

    switch (webhookData.type) {
      case 'subscription_created': {
        const { sessionId, customerId, metadata } = webhookData;
        const user = await User.findOne({ clerkId: metadata.clerkId });
        if (user) {
          user.isPro = true;
          user.stripeCustomerId = customerId;
          user.subscriptionStatus = 'active';
          user.subscriptionId = event.data.object.id;
          // Set subscription end date (should use Stripe data in production)
          user.subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
          await user.upgradeToPro();

          // Create payment record
          await Payment.create({
            userId: user._id,
            clerkId: metadata.clerkId,
            stripeCustomerId: customerId,
            stripeSubscriptionId: event.data.object.id,
            amount: 29,
            currency: 'usd',
            status: 'succeeded',
            planType: 'pro',
            metadata: { sessionId }
          });
        }
        break;
      }

      case 'subscription_updated': {
        const { subscriptionId, status, customerId: subCustomerId } = webhookData;
        const subUser = await User.findOne({ stripeCustomerId: subCustomerId });
        if (subUser) {
          subUser.subscriptionStatus = status;
          if (status === 'canceled' || status === 'past_due') subUser.isPro = false;
          await subUser.save();
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Get payment history with pagination
const getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const payments = await Payment.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('amount currency status planType creditsPurchased createdAt');

    const total = await Payment.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        payments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get payment history'
    });
  }
};

module.exports = {
  createProCheckout,
  createCreditPayment,
  handleStripeWebhook,
  getPaymentHistory
};
