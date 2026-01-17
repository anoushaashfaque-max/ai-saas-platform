import api from '../utils/api';

const paymentService = {
  // Create Stripe checkout session
  createCheckoutSession: async (plan) => {
    try {
      const response = await api.payment.createSubscription(plan);
      
      return {
        success: true,
        sessionId: response.sessionId,
        url: response.url,
      };
    } catch (error) {
      console.error('Create checkout session error:', error);
      return {
        success: false,
        error: error.message || 'Failed to create checkout session',
      };
    }
  },

  // Buy credits
  buyCredits: async (amount) => {
    try {
      const response = await api.payment.buyCredits(amount);
      
      return {
        success: true,
        credits: response.credits,
        totalCredits: response.totalCredits,
      };
    } catch (error) {
      console.error('Buy credits error:', error);
      return {
        success: false,
        error: error.message || 'Failed to buy credits',
      };
    }
  },

  // Get payment history
  getPaymentHistory: async () => {
    try {
      const response = await api.payment.getInvoices();
      
      return {
        success: true,
        invoices: response.invoices,
      };
    } catch (error) {
      console.error('Get payment history error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get payment history',
      };
    }
  },

  // Get subscription status
  getSubscriptionStatus: async () => {
    try {
      // In real app, this would be an API call
      // For now, return mock data
      return {
        success: true,
        status: 'active',
        plan: 'pro',
        currentPeriodEnd: '2024-12-31T23:59:59Z',
        cancelAtPeriodEnd: false,
      };
    } catch (error) {
      console.error('Get subscription status error:', error);
      return {
        success: false,
        error: error.message || 'Failed to get subscription status',
      };
    }
  },

  // Cancel subscription
  cancelSubscription: async () => {
    try {
      // In real app, this would be an API call
      // For now, return mock success
      return {
        success: true,
        message: 'Subscription will be canceled at the end of the billing period',
      };
    } catch (error) {
      console.error('Cancel subscription error:', error);
      return {
        success: false,
        error: error.message || 'Failed to cancel subscription',
      };
    }
  },

  // Update payment method
  updatePaymentMethod: async (paymentMethodId) => {
    try {
      // In real app, this would be an API call
      // For now, return mock success
      return {
        success: true,
        message: 'Payment method updated successfully',
      };
    } catch (error) {
      console.error('Update payment method error:', error);
      return {
        success: false,
        error: error.message || 'Failed to update payment method',
      };
    }
  },

  // Get available plans
  getAvailablePlans: () => {
    return [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        interval: 'month',
        features: ['3 Basic Tools', '10 Credits Monthly', 'Standard Support'],
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 29,
        interval: 'month',
        features: ['All 6 Tools', 'Unlimited Generations', 'Priority Support'],
      },
      {
        id: 'team',
        name: 'Team',
        price: 99,
        interval: 'month',
        features: ['Everything in Pro', 'Team Collaboration', 'Custom Models'],
      },
    ];
  },

  // Get credit packages
  getCreditPackages: () => {
    return [
      { amount: 100, price: 9.99, discount: 0 },
      { amount: 500, price: 39.99, discount: 20 },
      { amount: 1000, price: 69.99, discount: 30 },
      { amount: 5000, price: 299.99, discount: 40 },
    ];
  },
};

export default paymentService;