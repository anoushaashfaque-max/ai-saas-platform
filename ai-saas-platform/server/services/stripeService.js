const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create Stripe customer
const createCustomer = async (email, name, clerkId) => {
  try {
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        clerkId
      }
    });

    return customer;
  } catch (error) {
    console.error('Stripe create customer error:', error);
    throw new Error('Failed to create customer');
  }
};

// Create checkout session for Pro subscription
const createCheckoutSession = async (customerId, userId, clerkId) => {
  try {
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'AI SaaS Platform - Pro Plan',
              description: 'Unlimited access to all AI tools',
            },
            recurring: {
              interval: 'month',
            },
            unit_amount: 2900, // $29.00
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/dashboard?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/pricing?canceled=true`,
      metadata: {
        userId: userId.toString(),
        clerkId,
        planType: 'pro'
      }
    });

    return session;
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    throw new Error('Failed to create checkout session');
  }
};


// Handle webhook events
const handleWebhook = async (event) => {
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        return {
          type: 'subscription_created',
          sessionId: session.id,
          customerId: session.customer,
          metadata: session.metadata
        };

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object;
        return {
          type: 'subscription_updated',
          subscriptionId: subscription.id,
          status: subscription.status,
          customerId: subscription.customer
        };

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        return {
          type: 'payment_succeeded',
          paymentIntentId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          metadata: paymentIntent.metadata
        };

      default:
        return null;
    }
  } catch (error) {
    console.error('Stripe webhook error:', error);
    throw error;
  }
};

// Create payment intent for credit purchase
const createCreditPaymentIntent = async (amount, customerId, userId, clerkId) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: customerId,
      metadata: {
        userId: userId.toString(),
        clerkId,
        type: 'credits'
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return paymentIntent;
  } catch (error) {
    console.error('Stripe create payment intent error:', error);
    throw new Error('Failed to create payment intent');
  }
};

// Get customer by email
const getCustomerByEmail = async (email) => {
  try {
    const customers = await stripe.customers.list({
      email,
      limit: 1
    });

    return customers.data[0] || null;
  } catch (error) {
    console.error('Stripe get customer error:', error);
    return null;
  }
};

module.exports = {
  createCustomer,
  createCheckoutSession,
  createCreditPaymentIntent,
  handleWebhook,
  getCustomerByEmail
};
