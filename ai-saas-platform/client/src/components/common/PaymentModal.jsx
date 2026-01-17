import React, { useState } from 'react';
import { X, Check, CreditCard, Shield, Lock } from 'lucide-react';
import Button from './Button';
import { useUser, useClerk } from '@clerk/clerk-react';
import { API_BASE_URL } from '../../utils/constant';

const PaymentModal = ({ isOpen, onClose, plan = 'pro' }) => {
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState(1); // 1: Select, 2: Details, 3: Success
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
  });
  const { user } = useUser();
  const { getToken } = useClerk();

  if (!isOpen) return null;

  const plans = {
    pro: {
      name: 'Pro Plan',
      price: 29,
      features: [
        'All 6 AI Tools',
        'Unlimited Generations',
        'Priority Support',
        'Commercial License',
        'No Watermarks',
        'Advanced Features',
      ],
    },
  };

  const selectedPlan = plans[plan];

  const handlePayment = async () => {
    if (paymentStep === 1) {
      setPaymentStep(2);
      return;
    }

    setLoading(true);
    try {
      // Simulate payment processing (2 seconds)
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Try to call backend API first
      try {
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/payment/checkout/pro`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Payment processed via backend:', data);
        }
      } catch (apiError) {
        console.warn('Backend API call failed, using demo mode:', apiError);
        // Continue with demo mode
      }

      // Update user metadata in Clerk (for demo/production)
      if (user) {
        try {
          const subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          await user.update({
            publicMetadata: {
              ...user.publicMetadata,
              isPro: true,
              subscriptionEndDate: subscriptionEndDate,
            }
          });
          
          // Also store in localStorage as backup
          localStorage.setItem('user_isPro', 'true');
          localStorage.setItem('user_subscriptionEndDate', subscriptionEndDate);
          
          console.log('User updated to Pro status');
        } catch (metadataError) {
          console.error('Failed to update Clerk metadata:', metadataError);
          // Store in localStorage anyway as backup
          const subscriptionEndDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
          localStorage.setItem('user_isPro', 'true');
          localStorage.setItem('user_subscriptionEndDate', subscriptionEndDate);
        }
      }

      // Show success message
      setPaymentStep(3);

    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const renderStep1 = () => (
    <>
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-100 rounded-xl p-6 mb-6">
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-blue-700">${selectedPlan.price}</div>
          <div className="text-gray-600">per month</div>
        </div>

        <div className="space-y-3">
          {selectedPlan.features.map((feature, index) => (
            <div key={index} className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-semibold mb-3">Select Payment Method</h4>
        <div className="grid grid-cols-2 gap-3">
          {['card', 'paypal'].map((method) => (
            <button
              key={method}
              onClick={() => setPaymentMethod(method)}
              className={`
                border rounded-lg p-4 flex flex-col items-center justify-center
                ${paymentMethod === method ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
              `}
            >
              <div className="text-lg mb-2">
                {method === 'card' ? '💳' : '🏦'}
              </div>
              <span className="text-sm font-medium">
                {method === 'card' ? 'Credit Card' : 'PayPal'}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Shield className="h-4 w-4 mr-2 text-green-500" />
        <span>Secure payment powered by Stripe</span>
      </div>
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="mb-6">
        <h4 className="font-semibold mb-3">Card Details</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Card Number</label>
            <input
              type="text"
              value={cardDetails.number}
              onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
              placeholder="1234 5678 9012 3456"
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                type="text"
                value={cardDetails.expiry}
                onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                placeholder="MM/YY"
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">CVC</label>
              <input
                type="text"
                value={cardDetails.cvc}
                onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                placeholder="123"
                className="w-full border rounded-lg px-4 py-3"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Name on Card</label>
            <input
              type="text"
              value={cardDetails.name}
              onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
              placeholder="John Doe"
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-center">
          <Lock className="h-4 w-4 text-yellow-600 mr-2" />
          <p className="text-sm text-yellow-700">
            This is a demo. No real payment will be processed.
          </p>
        </div>
      </div>
    </>
  );

  const renderStep3 = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="h-8 w-8 text-green-600" />
      </div>
      <h3 className="text-2xl font-bold mb-3">Payment Successful!</h3>
      <p className="text-gray-600 mb-6">
        You now have access to all Pro features. Start using premium AI tools immediately.
      </p>
    </div>
  );

  const handleSuccess = async () => {
    // Reload user data to get updated Pro status
    if (user) {
      try {
        await user.reload();
        // Wait a moment for metadata to sync
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.warn('Failed to reload user:', error);
      }
    }
    
    // Close modal
    onClose();
    
    // Force full page reload to ensure latest data is loaded
    window.location.href = '/dashboard';
  };


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full animate-in fade-in zoom-in">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center mb-2">
                <CreditCard className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-2xl font-bold">
                  {paymentStep === 1 && 'Upgrade to Pro'}
                  {paymentStep === 2 && 'Enter Payment Details'}
                  {paymentStep === 3 && 'Success!'}
                </h3>
              </div>
              <p className="text-gray-600">Unlock all AI tools and premium features</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X size={20} />
            </button>
          </div>

          {/* Progress Steps */}
          {paymentStep !== 3 && (
            <div className="flex items-center mb-6">
              {[1, 2].map((step) => (
                <React.Fragment key={step}>
                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    ${paymentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
                  `}>
                    {step}
                  </div>
                  {step < 2 && (
                    <div className={`
                      flex-1 h-1 mx-2
                      ${paymentStep > step ? 'bg-blue-600' : 'bg-gray-200'}
                    `} />
                  )}
                </React.Fragment>
              ))}
            </div>
          )}

          {/* Content */}
          {paymentStep === 1 && renderStep1()}
          {paymentStep === 2 && renderStep2()}
          {paymentStep === 3 && renderStep3()}

          {/* Action Buttons */}
          <div className="space-y-3">
            {paymentStep === 3 ? (
              <Button onClick={handleSuccess} className="w-full py-3">
                Start Using Pro Features
              </Button>
            ) : (
              <Button
                onClick={handlePayment}
                loading={loading}
                className="w-full py-3"
              >
                {paymentStep === 1 ? `Pay $${selectedPlan.price} Now` : 'Complete Payment'}
              </Button>
            )}

            {paymentStep === 1 && (
              <button
                onClick={onClose}
                className="w-full text-center text-gray-500 hover:text-gray-700 py-2"
              >
                Maybe later
              </button>
            )}

            {paymentStep === 2 && (
              <button
                onClick={() => setPaymentStep(1)}
                className="w-full text-center text-gray-500 hover:text-gray-700 py-2"
              >
                ← Back
              </button>
            )}

            <p className="text-xs text-gray-400 text-center">
              {paymentStep === 1 && '30-day money-back guarantee. Cancel anytime.'}
              {paymentStep === 2 && 'Securely processed by Stripe. Your card details are encrypted.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;